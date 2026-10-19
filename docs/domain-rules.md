# Domain rules

How the PRD's business rules map to concrete backend behaviour. Terms follow [CONTEXT.md](../CONTEXT.md). Every number here is a **starting tunable** (see [Tunables](#tunables)), not a fixed law (PRD §14). Each rule below should end up covered by a unit test of a pure function or by an e2e test named after its PRD acceptance criterion.

## Mission generation (FR-02, BR-01, BR-02, AC-02, AC-03)

`POST /v1/missions` fails with `409` if the Learner already has an Open Mission. Otherwise it picks **N** = `learner.senses_per_mission` Targets:

1. **Quotas.** Split N by `sourceRatio` (new 0.6 · review 0.3 · personal 0.1) with the largest-remainder method; ties go to personal, then review, then new. N=5 → 3 new · 1 review · 1 personal. N=3 → 2 new · 1 review · 0 personal.
2. **Review slots** take Due Senses (`due_on <= today`) that are not archived: Needs practice first, then the oldest `due_on`. Extra Due Senses may take over New slots, up to `floor(reviewMaxShare × N)` in total, so review never crowds out all new material (PRD §13).
3. **Personal slots** take the Learner's Personal Senses that are not `draft`, not Proficient and not already picked; never-practised first, then the least recently practised.
4. **New slots** take Lexicon Senses the Learner has no progress row for, not archived, ordered by `rank`: the Learner's level first, then one level up, then one level down, never skipping a level (basic → intermediate · intermediate → advanced → basic · advanced → intermediate).
5. **Shortfall.** An empty Personal slot goes to Review if more Senses are Due, otherwise to New (AC-03). An empty Review slot goes to New. An empty New slot goes to any Senses still Due, even past `reviewMaxShare`: the cap protects new material, and there is none left. Senses that are not Due never fill in early: that would fight the review ladder.
6. If fewer than N suitable Senses exist at all, the Mission is created with fewer Targets. It is never padded with unsuitable ones (AC-03).
7. A Due Sense is tagged `review` even if it is also on the Personal list. No Sense appears twice (DB unique `(mission_id, sense_id)`). Two Senses of one Headword are allowed ([ADR 0001](adr/0001-sense-is-the-unit-of-learning.md)).
8. Creating the Mission upserts a `learner_sense` row (`new`, step 0) for each Target.

**Mission Mode** changes only the guidance and hint style. It never drops a Target (BR-01). The Mission carries its Mode's expected `minutes: { min, max }` from `modeMinutes`, so the app never hardcodes them.

## Situation hints (BR-10)

`POST /v1/missions/:id/hints` asks Claude for 2–3 open questions that help the Learner think of a real situation. The prompt forbids writing a ready-made paragraph that uses the Targets, so the Learner has nothing to read out as their own answer.

## Evaluating a Submission (FR-06, BR-03, BR-04, BR-12)

Each Target in the Submission gets exactly one Usage Verdict:

| Verdict | When | Effect on Target |
|---|---|---|
| `appropriate` | Used correctly and naturally in a meaningful context | see [Target states](#target-states) |
| `needs_improvement` | Attempted in context, but wrong form, collocation or meaning | see Target states |
| `not_used` | Absent, read out alone, listed, or used in nonsense/off-topic content (BR-03) | none: stays `pending` |
| `insufficient_evidence` | Unclear audio/transcript, or the AI can't judge reliably | none: stays `pending`; the Learner is asked to re-record or type (AC-08) |

- `appropriate` and `needs_improvement` must carry an `evidence_quote` that appears verbatim in the transcript or Journal; otherwise the worker downgrades the verdict to `insufficient_evidence`.
- An empty or low-confidence transcript skips Claude entirely: every Target gets `insufficient_evidence`.
- A **Correction** Submission is evaluated for its one `correction_target_id` only.
- Feedback never claims to assess pronunciation (BR-12).

## Target states

Mission completion depends only on Target states:

```
pending ──practice: appropriate──────────────▶ passed
pending ──practice: needs_improvement────────▶ needs_correction
needs_correction ──practice: appropriate─────▶ passed
needs_correction ──correction: appropriate | needs_improvement──▶ corrected
(not_used / insufficient_evidence never change state; passed and corrected are final)
```

## Mission completion (BR-05, AC-04, AC-07)

After applying verdicts, the worker completes the Mission when **every** Target is `passed` or `corrected`. A Target corrected without success still counts (BR-05.3: a guided step was done); its Sense stays Needs practice and Due. A Learner never has to master every Sense in one day.

Completing a Mission, in the same transaction:
- sets `status = completed`, `completed_at`, `completed_on` = Learner's local date **now** (BR-08: finishing Monday's Mission on Tuesday counts for Tuesday);
- inserts `streak_day (learner_id, completed_on)` `ON CONFLICT DO NOTHING`;
- awards Mission XP.

**Abandoning** (`POST /v1/missions/:id/abandon`) sets `abandoned`. Every Target still `pending` or `needs_correction` keeps its Sense's `due_on` if it has one; otherwise `due_on` becomes the day after the Mission's `started_on`. So the Sense comes back as Review from the next local day on (BR-08, AC-11), never in a Mission started the same day, and abandoning never pushes a due date later. Nothing is deleted.

A system error never changes Target states (BR-05).

## Learning Status (FR-08, BR-09, AC-05, AC-13)

Only **Practice** verdicts move Learning Status and the Review Step. Correction verdicts are recorded and can earn XP, but don't count as independent evidence: the Learner had just been shown the fix.

| Practice verdict | Status becomes |
|---|---|
| `appropriate` | `proficient` if the Proficient rule holds, else `learning` |
| `needs_improvement` | `needs_practice` (demotes `proficient` too) |
| `not_used`, `insufficient_evidence` | unchanged |

**Proficient rule:** `appropriate` Practice verdicts on at least `proficientDistinctDays` (3) distinct local dates, counted **since the Sense's most recent `needs_improvement` Practice verdict**. One correct use never makes a Sense Proficient (AC-13), and after a lapse the Learner has to re-earn it across days.

## Review scheduling (FR-09, [ADR 0006](adr/0006-review-ladder-over-fsrs.md))

`reviewLadderDays = [1, 3, 7, 14, 30]`. On a Practice verdict with local date `d`:

- `appropriate`: `due_on = d + ladder[step]`, then `step = min(step + 1, last)`.
- `needs_improvement`: `step = 0`, `due_on = d + ladder[0]`.
- Abandoned: `due_on = COALESCE(due_on, started_on + 1)`, step unchanged.

A Sense is **Due** when `due_on <= today` in the Learner's time zone.

## XP (FR-10, BR-06, AC-06, AC-09)

| Reward | Amount | `cause_key` (unique per Learner) |
|---|---|---|
| Mission completed | +10 | `mission:{missionId}:completed` |
| Target practised (reached `passed` or `corrected`) | +2 | `target:{targetId}:practised` |
| Correction succeeded (Correction verdict `appropriate`) | +2 | `target:{targetId}:corrected` |

Inserts use `ON CONFLICT DO NOTHING`, so re-submitting, retried jobs and duplicate requests never award twice. Practice is never blocked because a reward was already used up. XP is never shown as, or used for, proficiency.

## Streak (BR-07, AC-10)

The current Streak is the run of consecutive `streak_day` dates ending today or yesterday (local). Several Missions in one day add one row. Corrections after completion, or a missed day, never delete rows or progress. No streak-protection items in the MVP.

## Personal Senses (BR-11, §7.3, AC-12)

1. `POST /v1/personal-senses/lookup {text}` normalizes the text and returns matching Lexicon Senses. If one fits, the Learner adds it: `POST /v1/personal-senses {senseId}`.
2. If none fit, `POST /v1/personal-senses/drafts {text, context?}` asks Claude for candidate Senses. They are stored as Learner-owned with `verification = draft`; several candidates means the Learner picks one (AC-12).
3. The Learner edits the draft (`PATCH`) and confirms it (`POST /v1/personal-senses/:senseId/confirm`), which sets `learner_confirmed`. Only non-draft Senses can become Targets.
4. Removing a Lexicon Sense from the list deletes only the list row; progress stays. Removing a Learner-owned Sense hard-deletes it if it was never a Target, otherwise archives it.
5. Learner-owned Senses are never shared and never enter the Lexicon.

## Tunables

All of these live in `src/config/learning.config.ts`, with types and a unit test asserting the defaults.

| Key | Default | Source |
|---|---|---|
| `sensesPerMission.presets` / `.min` / `.max` | `[3, 5]` / 1 / 10 | BR-01 |
| `modeMinutes` | quick 3–5 · daily 10 · deep 15–20 | BR-01 |
| `sourceRatio` | new 0.6 · review 0.3 · personal 0.1 | BR-02 |
| `reviewMaxShare` | 0.6 | PRD §13 overload guard |
| `reviewLadderDays` | `[1, 3, 7, 14, 30]` | FR-09 |
| `proficientDistinctDays` | 3 | BR-09 |
| `xp.missionCompleted` / `.targetPractised` / `.correctionSucceeded` | 10 / 2 / 2 | BR-06 |
| `audioRetentionDays` | 30 | PRD §11.3 |
| `maxRecordingSeconds` / `maxUploadBytes` | 300 / 15 MB | OpenAI 25 MB limit, with headroom |
| `transcriptMinConfidence` | to be calibrated on real recordings | BR-04 |
| `evaluationJob.attempts` | 3, exponential backoff | BR-05 |
