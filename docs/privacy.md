# Privacy & data handling

Implements PRD §11. Recordings, transcripts and Journals are private by default and are never shown to anyone but their Learner. Items marked **Release blocker** must be confirmed and published before anyone other than the founder uses the app (PRD §11.3, §15.6).

## Data inventory

| Data | Stored in | Processed by | Retention (proposed) |
|---|---|---|---|
| Account (email, auth identity) | Supabase Auth | Supabase | Until account deletion |
| Profile (level, goal, settings, time zone, push token) | Postgres | — | Until account deletion |
| Raw audio | Supabase Storage, private bucket, `submissions/{learnerId}/{submissionId}.m4a` | OpenAI (transcription) | **30 days** after the Submission, then deleted by the `audio-retention` job |
| Transcript, Journal, typed text | Postgres `submission` | Anthropic (evaluation) | Until the Learner deletes the Submission or the account |
| Usage Verdicts and feedback text | Postgres `usage_verdict` | — | Same as the Submission |
| Progress, XP, Streak | Postgres | — | Until account deletion |
| Personal Senses | Postgres | Anthropic (drafting) | Until removed or account deletion |
| Drafts | **Device only** | — | Up to the app ([ADR 0005](adr/0005-drafts-live-on-device-only.md)) |

## Third-party processors

| Vendor | Receives | Purpose |
|---|---|---|
| Supabase | All stored data | Database, storage, auth |
| Render | Data in transit through the API and worker; logs (no content) | Hosting |
| OpenAI | Raw audio | Speech-to-text |
| Anthropic | Transcript, Journal, Target Senses, Mission Mode; Personal Sense text | Usage evaluation, hints, Sense drafts |
| Expo | Push token and notification text (no content) | Push notifications |

**Release blocker:** review each vendor's current API data-retention and training terms (OpenAI, Anthropic, Supabase backups), record the result here, and publish it in the in-app privacy notice. Personal content must not be used to train models by default (PRD §11.2.4).

## Rules in code

- **Minimal prompts.** AI prompts never include name, email, Learner id or time zone (PRD §11.2.7). The prompt builder takes an explicit allow-list of fields.
- **No content in logs.** Transcripts, Journals and feedback text are never logged. Log ids and statuses only.
- **Private storage.** The bucket isn't public; uploads and downloads use short-lived signed URLs issued per request, after an ownership check.
- **Ownership.** Every query is scoped by `learner_id = token.sub`. Another Learner's resource returns `404`, not `403`.
- **Secrets.** Only in Render env vars and a local `.env` (git-ignored); never committed.

## Deletion

- **Delete a Submission** (`DELETE /v1/submissions/:id`, AC-14): deletes the audio object, the transcript, the Journal/typed text and the feedback text. The Submission row stays as a tombstone (`deleted_at`) so derived progress (Learning Status, Review Step, XP, Streak) remains consistent. Derived progress holds no personal content. The UI must show the Submission as deleted, never as if its content were intact.
- **Delete the account** (`DELETE /v1/me`): deletes every row owned by the Learner (cascade), every Storage object under `submissions/{learnerId}/`, and the Supabase Auth user.
- **Backups.** Deleted data may remain in Supabase's managed backups until they rotate out. **Release blocker:** state the backup window in the privacy notice.

## Release blockers checklist (PRD §11.3)

- [ ] Raw audio retention: proposed 30 days. Confirm and publish.
- [ ] Transcripts: proposed to keep until the Learner deletes them. Confirm and publish.
- [ ] Journal and AI feedback retention: proposed the same as transcripts. Confirm and publish.
- [ ] Deletion process and backup handling: as above. Confirm the backup window.
- [ ] Data sent to AI vendors: the processor table above. Verify vendor terms.
- [ ] Consent mechanism for any use beyond providing the service: none planned. If one is added, it must be opt-in.
