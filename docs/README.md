# Daily Secret Mission — backend docs

Backend design for the MVP described in the PRD ([VI](../Daily_Secret_Mission_PRD_v1.0_VI.md) · [EN](<../Daily Secret Mission PRD v1.0 (English).md>)). The PRD says *what* to build; these docs say *how*.

## Reading order

1. [CONTEXT.md](../CONTEXT.md): the domain glossary. Read it first; every other doc uses its words.
2. [tech-stack.md](tech-stack.md): each technology choice and why.
3. [architecture.md](architecture.md): processes, modules, the Submission → feedback flow, the Mission lifecycle.
4. [domain-rules.md](domain-rules.md): Mission generation, evaluation, completion, Learning Status, review, XP, Streak, and the tunables.
5. [data-model.md](data-model.md): tables and the constraints that enforce the rules.
6. [api.md](api.md): REST conventions and the endpoint outline.
7. [privacy.md](privacy.md): data inventory, processors, deletion, release blockers.
8. [project-setup.md](project-setup.md): repo layout, env, local dev, testing, CI/CD, conventions.
9. [lexicon-data.md](lexicon-data.md): the fields the Admin fills and how to load the Lexicon.
10. [roadmap.md](roadmap.md): the MVP as phases, one feature per PR, and which acceptance criteria each covers.
## Decisions (ADRs)

| # | Decision |
|---|---|
| [0001](adr/0001-sense-is-the-unit-of-learning.md) | Sense, not Headword, is the unit of learning |
| [0002](adr/0002-supabase-as-infrastructure-only.md) | Supabase as infrastructure only; NestJS owns all logic |
| [0003](adr/0003-async-evaluation-on-bullmq-worker.md) | Evaluation runs async on a BullMQ worker |
| [0004](adr/0004-lexicon-curated-as-files-in-repo.md) | ~~Lexicon is curated as files in the repo~~ (superseded by 0007) |
| [0005](adr/0005-drafts-live-on-device-only.md) | Drafts live on the device only |
| [0006](adr/0006-review-ladder-over-fsrs.md) | Fixed review ladder over FSRS/SM-2 |
| [0007](adr/0007-lexicon-loaded-directly-into-database.md) | Lexicon is loaded directly into the database |

## Stack at a glance

TypeScript · Node 24 · NestJS · class-validator · Prisma · Supabase (Postgres, Storage, Auth) · BullMQ + Redis · Render (API + worker + Key Value) · OpenAI speech-to-text · Claude evaluation · Expo client.

## Open before release

The privacy items in [privacy.md](privacy.md#release-blockers-checklist-prd-113) are not decided just because they're written down (PRD §11.3).
