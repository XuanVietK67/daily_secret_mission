# Lexicon is curated as files in the repo

The Admin writes Lexicon Senses as JSON files under `lexicon/`. An import command validates them and upserts them into Postgres, keyed by a stable `key` per Sense. There is no Admin UI and no Admin API in the MVP. Git history is the audit trail, review happens through diffs, and FR-03 (never show unverified data as certain) is met because only committed, validated files reach the database. We rejected an admin dashboard and admin endpoints as extra surface to build and secure for a single Admin, and editing rows in Supabase Studio because it skips validation.

## Consequences

- A Sense removed from the files is archived, never deleted, because Learner progress references it.
- If the Lexicon later needs non-developer editors, this is the decision to revisit.
