# Roadmap

The backend MVP (PRD §6.1) as a sequence of phases. Each phase ships one capability end to end. Terms follow [CONTEXT.md](../CONTEXT.md); the *how* of each rule is already in [domain-rules.md](domain-rules.md), [data-model.md](data-model.md) and [api.md](api.md), so a phase links there instead of repeating it.

## What a phase is

- **One branch, one PR.** `feat/<name>`, merged to `main`, auto-deployed to Render. `main` stays deployable after every phase.
- **A vertical slice.** Migration (with hand-written CHECK / partial-index SQL and `ENABLE ROW LEVEL SECURITY`), module (controller, service, DTOs, `*.rules.ts`), new env vars in `env.ts` and `.env.example`, new tunables in `learning.config.ts`, and the doc updates the change implies.
- **Tests.** Pure rules get `*.rules.spec.ts` unit tests. Each acceptance criterion the phase covers gets an e2e test named after it (`AC-04 …`). AI vendors and Storage are faked in tests; Postgres and Redis are real.
- **Done when** its ACs pass in CI (`lint` → `typecheck` → `test` → `test:e2e`) and the deploy is green. Checked through e2e tests and Swagger: this plan is backend only, and the Expo app gets its own plan.

## Phases

| # | Phase | Branch | Covers |
|---|---|---|---|
| 0 | Walking skeleton ✅ | — | AC-01 (profile half) |
| 1 | [Lexicon](#1-lexicon) | `feat/lexicon` | FR-03 |
| 2 | [Missions](#2-missions) | `feat/missions` | FR-02, BR-01/02/08, AC-01/02/03/11 |
| 3 | [Text evaluation](#3-text-evaluation) | `feat/text-evaluation` | FR-06, BR-03/04, AC-04/05/08 |
| 4 | [Progress](#4-progress) | `feat/progress` | FR-08/09, BR-09, AC-05/13 |
| 5 | [Corrections & completion](#5-corrections--completion) | `feat/corrections` | FR-07, BR-05, AC-06/07 |
| 🏁 | **Core loop** | | PRD §16 |
| 6 | [Audio](#6-audio) | `feat/audio` | FR-04, BR-12, AC-08 |
| 7 | [Rewards](#7-rewards) | `feat/rewards` | FR-10, BR-06/07, AC-06/09/10 |
| 8 | [History](#8-history) | `feat/history` | FR-11 |
| 9 | [Personal Senses](#9-personal-senses) | `feat/personal-senses` | BR-11, AC-03/12 |
| 10 | [Situation hints](#10-situation-hints) | `feat/situation-hints` | BR-10 |
| 11 | [Privacy](#11-privacy) | `feat/privacy` | FR-12, AC-14, §11 |

### 0. Walking skeleton ✅

Config and env validation, Supabase JWT guard, `GET`/`PATCH /v1/me`, health, error filter, logging, CI, Render web service.

### 1. Lexicon ✅

Senses exist in the database and can be read.

- `headword` and `sense` tables as [data-model.md](data-model.md#headword-sense) and [lexicon-data.md](lexicon-data.md) define them: a database default for every column the Admin doesn't fill, plain `UNIQUE (lexicon_key)`, CHECKs (origin ↔ owner, origin ↔ verification, Lexicon Senses have a `lexicon_key`, at least one example, `rank > 0`).
- `GET /v1/senses/:id`. A Learner-owned Sense of another Learner is `404`.
- `test/fixtures.ts`: creates Lexicon Senses for e2e tests, which never rely on imported data.
- Docs: fix the Node 24 / pnpm drift to Node 22 / npm (tech-stack, project-setup, README).

**Done when** the [lexicon-data.md](lexicon-data.md) import script runs against the local database and a Sense reads back through Swagger.

### 2. Missions

A Learner gets a Mission of N Targets and can abandon it.

- `mission`, `target`, `learner_sense` tables; the `one_open_mission` partial unique index; `UNIQUE (mission_id, sense_id)`.
- Generation as [domain-rules.md](domain-rules.md#mission-generation-fr-02-br-01-br-02-ac-02-ac-03) describes: quota split and slot filling as pure functions. Personal slots stay empty until Phase 9; the shortfall rule covers them.
- `POST /v1/missions` (`409 MISSION_ALREADY_OPEN`, `422 ONBOARDING_REQUIRED`), `GET /v1/missions/current`, `GET /v1/missions/:id`, `POST /v1/missions/:id/abandon` (unfinished Targets' Senses without a due date become Due the day after the Mission started).
- A helper that turns "now" into the Learner's local date; every later phase uses it.
- Tunables: `sourceRatio`, `reviewMaxShare`, `modeMinutes`.

**Done when** AC-01, AC-02, AC-03 and AC-11 pass.

### 3. Text evaluation

A typed Submission is evaluated and each Target gets a Usage Verdict.

- `submission` and `usage_verdict` tables.
- `POST /v1/missions/:id/submissions` (`kind: practice`, typed text, optional Journal) → `202`; `GET /v1/submissions/:id`; `POST /v1/submissions/:id/retry`.
- BullMQ `evaluation` queue: job id = Submission id, 3 attempts with exponential backoff, `Failed` after the last one. The processor runs **inside the API process** (`ponytail:` comment pointing at [ADR 0003](adr/0003-async-evaluation-on-bullmq-worker.md) for the split into a worker). On startup, every `queued` / `processing` Submission is re-enqueued, so a Redis restart never strands one.
- Claude evaluator per [tech-stack.md](tech-stack.md#ai-integration-details): Zod output schema, explicit effort, `stop_reason` check, cached system prompt, allow-listed prompt fields. A verdict whose `evidence_quote` isn't in the text becomes `insufficient_evidence`.
- Target states `pending` → `passed` / `needs_correction` as a pure function.
- Throttling on Submissions.
- Redis: `REDIS_URL`, Redis in `/v1/health`, a `redis` service in CI, a free Key Value instance (`noeviction`) in `render.yaml`. Local dev uses Docker ([project-setup.md](project-setup.md#local-development)).
- Docs: [architecture.md](architecture.md#processes) notes the in-process worker.

**Done when** AC-04, AC-05 (feedback part) and AC-08 (text) pass against a scripted evaluator, and a real typed Submission is evaluated locally.

### 4. Progress

Verdicts move each Sense's Learning Status and Review Step, and Due Senses come back.

- `progress.applyVerdict()` in the verdict transaction, Practice verdicts only: Learning Status, the review ladder (a pure function over step, verdict and date), the Proficient rule, `last_practised_at`, `usage_verdict.local_date`.
- Due Senses fill Review slots in generation, end to end.
- Tunables: `reviewLadderDays`, `proficientDistinctDays`.

**Done when** AC-05 (not Proficient) and AC-13 pass, and a Sense judged `needs_improvement` returns as a Review Target the next local day.

### 5. Corrections & completion

A Learner corrects missed Targets and the Mission completes.

- `kind: correction` with `correctionTargetId`, accepted only for a `needs_correction` Target (`422` otherwise) and evaluated for that Target alone. `needs_correction` → `corrected`. Correction verdicts never move Learning Status.
- Completion when every Target is `passed` or `corrected`: `status`, `completed_at`, `completed_on` (local date now). Corrections after completion are accepted and never undo it.

**Done when** AC-07 passes, and AC-06 passes apart from its XP clause.

### 🏁 Core loop

Receive Senses → use them → get feedback → correct → complete → meet them again after an interval (PRD §16). Start the Expo app plan here, alongside Phase 6.

### 6. Audio

Recordings replace typed text as the main input.

- `storage` module over Supabase Storage (private bucket, short-lived signed URLs, ownership checked first).
- `POST /v1/missions/:id/uploads` → signed upload URL; Submissions accept a `path` (object exists, within `maxUploadBytes`).
- OpenAI transcription in the evaluation job; an empty or low-confidence transcript skips Claude and makes every Target `insufficient_evidence`.
- `GET /v1/submissions/:id/audio` while the audio is retained; an `audio-retention` job scheduler deletes audio after `audioRetentionDays` and sets `audio_deleted_at`.
- Env: `SUPABASE_SECRET_KEY`, `STORAGE_BUCKET`, `OPENAI_API_KEY`, `OPENAI_TRANSCRIBE_MODEL`. Tunables: `audioRetentionDays`, `maxRecordingSeconds`, `maxUploadBytes`, `transcriptMinConfidence` (a placeholder until calibrated on real recordings).

**Done when** AC-08 passes for audio with faked Storage and transcription, and a real recording is evaluated locally.

### 7. Rewards

XP and Streak reward the practice process.

- `xp_event` and `streak_day` tables; `rewards.award()` in the verdict and completion transaction, with cause keys from [domain-rules.md](domain-rules.md#xp-fr-10-br-06-ac-06-ac-09).
- `GET /v1/progress`: status counts, Due count, total XP, current and longest Streak, milestones derived at read time. Which milestones exist is decided at the start of this phase.
- Tunables: `xp.*`.

**Done when** AC-06, AC-09 and AC-10 pass.

### 8. History

The Learner sees past Missions and per-Sense results.

- `GET /v1/missions` (cursor pagination), `GET /v1/progress/senses?status=&due=`, `GET /v1/progress/senses/:senseId`.
- `PUT /v1/verdicts/:id/rating` (the "AI feedback usefulness" metric, PRD §3.2).

**Done when** each endpoint has an e2e test that checks ownership (another Learner's data is `404`).

### 9. Personal Senses

The Learner adds their own Senses, and they appear in Missions.

- `personal_sense` table. `lookup` (normalized like `headword.normalized_text`), add an existing Sense, AI drafts (Claude on the request path, throttled), edit, confirm, remove, all per [domain-rules.md](domain-rules.md#personal-senses-br-11-73-ac-12).
- Generation fills Personal slots.

**Done when** AC-12 passes and AC-03 still passes with a Personal list that has no suitable Senses.

### 10. Situation hints

`POST /v1/missions/:id/hints`: 2–3 open questions from Claude; the prompt forbids a ready-made paragraph using the Targets. Mission Mode shapes the hint style. Throttled.

**Done when** an e2e test with a scripted Claude checks the response shape and the throttle.

### 11. Privacy

The Learner can delete their content and their account.

- `DELETE /v1/submissions/:id`: deletes the audio, nulls the content columns, keeps a tombstone; reads show it as deleted.
- `DELETE /v1/me`: deletes every Learner row, every Storage object under the Learner's prefix, and the Supabase Auth user.

**Done when** AC-14 passes. Before anyone other than the founder uses the app, the [privacy.md release blockers](privacy.md#release-blockers-checklist-prd-113) also need your decisions; they are not code.

## Not in this plan

- **Expo app**: its own plan, starting at the 🏁 milestone.
- **Push notifications**: arrive with the app; until then the app polls `GET /v1/submissions/:id`.
- **Separate worker process**: when the in-process worker gets in the way ([ADR 0003](adr/0003-async-evaluation-on-bullmq-worker.md)); it needs a paid Render plan.
- **Placement test** and everything in PRD §6.2.
