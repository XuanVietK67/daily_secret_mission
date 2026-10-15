# Lexicon is loaded directly into the database

**Status:** accepted; supersedes [ADR 0004](0004-lexicon-curated-as-files-in-repo.md).

The Admin keeps the Lexicon as an existing dataset and loads it straight into the `headword` and `sense` tables through a staging table and one SQL script ([lexicon-data.md](../lexicon-data.md)); the database, not the repo, is the source of truth. We dropped ADR 0004's JSON files and `lexicon:import` command because converting the dataset into repo files would be a second copy to keep in sync, for a single Admin. The price is losing the git audit trail and the class-validator pass, so FR-03 (never show unverified data as certain) now rests on database constraints.

## Consequences

- `lexicon_key` is required for Lexicon Senses and never changes; re-imports upsert by it, so Learner progress survives them.
- Every column the Admin doesn't fill has a database default (`id`, `origin`, `verification`, timestamps), so plain SQL inserts work without Prisma.
- e2e tests never rely on imported data; they create their own Senses.
- If non-developers ever edit the Lexicon, revisit this together with ADR 0004's rejected admin UI.
