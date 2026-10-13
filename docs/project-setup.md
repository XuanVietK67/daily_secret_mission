# Project setup

How the backend repository is laid out, configured, run and shipped. This is the blueprint for scaffolding; nothing here exists yet.

## Repository layout

```
daily_secret_mission/
├── CONTEXT.md                  # domain glossary: use these words in code
├── docs/                       # this folder
├── lexicon/                    # Admin-curated Senses (ADR 0004)
│   └── *.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── scripts/
│   └── lexicon-import.ts
├── src/
│   ├── main.ts                 # HTTP entrypoint
│   ├── worker.ts               # BullMQ worker entrypoint (no HTTP)
│   ├── app.module.ts
│   ├── config/                 # env schema, learning.config.ts (tunables)
│   ├── prisma/                 # PrismaService
│   ├── auth/
│   ├── learners/
│   ├── lexicon/
│   ├── personal-senses/
│   ├── missions/
│   ├── submissions/
│   ├── evaluation/             # processor, transcription client, Claude evaluator, prompts
│   ├── progress/
│   ├── rewards/
│   ├── storage/
│   ├── notifications/
│   └── privacy/
├── test/                       # e2e: one spec per PRD acceptance criterion group
├── render.yaml
├── .env.example
└── package.json
```

Inside a module: `*.module.ts`, `*.controller.ts` (HTTP only), `*.service.ts` (rules), `dto/`, and pure rule functions in `*.rules.ts` with a `*.rules.spec.ts` next to them. Controllers contain no business logic.

## Environment variables

Validated at boot by `src/config/env.ts`; the app refuses to start if one is missing or invalid. `.env.example` lists them with placeholders.

| Var | Example / note |
|---|---|
| `NODE_ENV`, `PORT`, `LOG_LEVEL` | |
| `DATABASE_URL` | Supabase **transaction pooler** (port 6543) with `?pgbouncer=true`; used at runtime |
| `DIRECT_URL` | Supabase **session pooler** or direct connection (port 5432); used by `prisma migrate` |
| `REDIS_URL` | Render Key Value internal URL |
| `SUPABASE_URL` | `https://<ref>.supabase.co`. JWKS (`/auth/v1/.well-known/jwks.json`) and issuer (`/auth/v1`) are derived from it |
| `SUPABASE_SECRET_KEY` | Server-only key for Storage and deleting Auth users. Never shipped to the app |
| `STORAGE_BUCKET` | `submissions` |
| `OPENAI_API_KEY`, `OPENAI_TRANSCRIBE_MODEL` | e.g. `gpt-4o-transcribe` |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | default `claude-opus-5-5` |
| `EXPO_ACCESS_TOKEN` | optional; enables Expo push security |

How Prisma reads the two URLs (`schema.prisma` vs `prisma.config.ts` / driver adapter) depends on the Prisma major installed. Follow its docs at scaffold time; the split (pooled at runtime, session/direct for migrations) is what matters.

## Scripts

| Script | Does |
|---|---|
| `pnpm start:dev` / `pnpm start:worker:dev` | API / worker with watch mode |
| `pnpm build` | `nest build` |
| `pnpm start` / `pnpm start:worker` | `node dist/main` / `node dist/worker` |
| `pnpm lint` / `pnpm format` / `pnpm typecheck` | ESLint / Prettier / `tsc --noEmit` |
| `pnpm test` / `pnpm test:e2e` | Jest unit / e2e |
| `pnpm db:migrate` / `pnpm db:deploy` | `prisma migrate dev` / `prisma migrate deploy` |
| `pnpm lexicon:import` | Validate `lexicon/*.json` and upsert into the DB |

## Local development

Prerequisites: Node 24 LTS, pnpm, Docker, the Supabase CLI.

1. `supabase start` runs local Postgres, Auth and Storage. Put the printed URLs and keys in `.env`; locally `DATABASE_URL` and `DIRECT_URL` are the same (port 54322).
2. Start Redis: `docker run -d --name dsm-redis -p 6379:6379 redis:7 --maxmemory-policy noeviction`.
3. `pnpm install && pnpm db:migrate && pnpm lexicon:import`.
4. Run `pnpm start:dev` and `pnpm start:worker:dev` in two terminals. Swagger UI is at `http://localhost:3000/docs`.

## Lexicon files

One JSON array per file, any grouping (topic, batch). `key` is permanent: it ties progress to the Sense.

```json
[
  {
    "key": "run.v.manage",
    "headword": "run",
    "partOfSpeech": "verb",
    "definition": "to manage or be in charge of a business or activity",
    "pronunciationIpa": "/rʌn/",
    "examples": ["She runs a small bakery near the station."],
    "collocations": ["run a business", "run a meeting"],
    "topic": "work",
    "difficulty": "intermediate",
    "rank": 120
  }
]
```

`lexicon:import` validates every entry (class-validator) and fails on duplicate keys. It upserts by `key` and archives Senses whose key is no longer in any file. Run it after every Lexicon change, locally and as part of deploy.

## Testing

- **Unit tests** cover the pure rule functions: quota split, Target state machine, ladder, Proficient rule, XP cause keys. No mocks needed.
- **e2e tests** run against real Postgres and Redis, never a mocked database. Only the outside world is faked: the transcription client, the Claude evaluator, Storage and the JWKS are overridden with test providers that return scripted results. Test files are named after PRD criteria, e.g. `AC-04 mission with unattempted targets stays open`, so PRD §15.7 ("acceptance criteria become test cases") is literally true.
- CI uses `postgres` and `redis` service containers; Supabase isn't needed in CI because Auth and Storage are faked.

## CI/CD

- **GitHub Actions** on every PR: `pnpm install --frozen-lockfile` → `lint` → `typecheck` → `db:deploy` (CI database) → `test` → `test:e2e`.
- **Render** auto-deploys `main` from `render.yaml`:
  - `web` service: build `pnpm install && pnpm build`, pre-deploy `pnpm db:deploy && pnpm lexicon:import`, start `pnpm start`, health check `/v1/health`.
  - `worker` service: same build, start `pnpm start:worker`.
  - `keyvalue` instance: `maxmemoryPolicy: noeviction`, internal access only.
  - Check field names against Render's Blueprint spec when writing the file.

## Conventions

- **Words.** Code, tables, routes and logs use [CONTEXT.md](../CONTEXT.md) terms: `Sense`, not `Word`; `Submission`, not `Attempt`. When a new domain concept shows up, add it to the glossary first.
- **Branches.** `feat/<short-name>` for features, `fixBug/<short-name>` for fixes.
- **Before committing.** Run `pnpm lint && pnpm typecheck`. Never commit `.env` or secrets. Never use `--no-verify`.
- **Migrations.** Never edit an applied migration. Partial indexes and CHECK constraints are hand-written SQL appended to the generated migration.
- **Rules.** A rule that must never break (one Open Mission, no double XP, one Streak row per day) is a database constraint first and app code second.
- **Decisions.** Hard-to-reverse, surprising trade-offs get an ADR in `docs/adr/` (format: a short title plus 1–3 sentences).
