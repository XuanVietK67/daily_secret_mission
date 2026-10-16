# Project setup

How the backend repository is laid out, configured, run and shipped. The walking skeleton (config, auth, `/v1/me`, health, CI, Render) exists; the layout below is the target, and each module arrives with its feature. Entries marked *(later)* don't exist yet.

## Repository layout

```
daily_secret_mission/
├── CONTEXT.md                  # domain glossary: use these words in code
├── docs/                       # this folder
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── prisma.config.ts            # migrate uses DIRECT_URL; loads .env.test when NODE_ENV=test
├── supabase/                   # local stack config (`npx supabase start`)
├── src/
│   ├── main.ts                 # HTTP entrypoint
│   ├── worker.ts               # BullMQ worker entrypoint (no HTTP) (later: evaluation feature)
│   ├── app.module.ts
│   ├── error.filter.ts         # the one global error shape
│   ├── health.controller.ts    # /v1/health
│   ├── generated/prisma/       # Prisma client, generated on install (gitignored)
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
├── .github/workflows/ci.yml
├── render.yaml
├── .env.example
└── package.json
```

Inside a module: `*.module.ts`, `*.controller.ts` (HTTP only), `*.service.ts` (rules), `dto/`, and pure rule functions in `*.rules.ts` with a `*.rules.spec.ts` next to them. Controllers contain no business logic.

The code is ESM (`"type": "module"`, `nodenext`), as NestJS 12 scaffolds it: relative imports end in `.js`.

## Environment variables

Validated at boot by `src/config/env.ts`; the app refuses to start if one is missing or invalid. `.env.example` lists the ones in use today; each feature adds its own.

| Var | Example / note |
|---|---|
| `NODE_ENV`, `PORT`, `LOG_LEVEL` | |
| `DATABASE_URL` | Supabase **transaction pooler** (port 6543); used at runtime through Prisma's `pg` driver adapter, which needs no `?pgbouncer=true` (harmless if present) |
| `DIRECT_URL` | Supabase **session pooler** or direct connection (port 5432); used by `prisma migrate` via `prisma.config.ts` |
| `REDIS_URL` | Render Key Value internal URL |
| `SUPABASE_URL` | `https://<ref>.supabase.co`. JWKS (`/auth/v1/.well-known/jwks.json`) and issuer (`/auth/v1`) are derived from it |
| `SUPABASE_SECRET_KEY` | Server-only key for Storage and deleting Auth users. Never shipped to the app |
| `STORAGE_BUCKET` | `submissions` |
| `OPENAI_API_KEY`, `OPENAI_TRANSCRIBE_MODEL` | e.g. `gpt-4o-transcribe` |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | default `claude-opus-5-5` |
| `EXPO_ACCESS_TOKEN` | optional; enables Expo push security |

Prisma 7: `schema.prisma` has no URL; `prisma.config.ts` gives migrations `DIRECT_URL`, and `PrismaService` passes `DATABASE_URL` to the `@prisma/adapter-pg` driver adapter.

## Scripts

| Script | Does |
|---|---|
| `npm run start:dev` / `npm run start:worker:dev` | API / worker *(later)* with watch mode |
| `npm run build` | `nest build` |
| `npm start` / `npm run start:worker` | `node dist/main` / `node dist/worker` *(later)* |
| `npm run lint` / `npm run format` / `npm run typecheck` | oxlint (type-aware) / Prettier / `tsc --noEmit` |
| `npm test` / `npm run test:e2e` | Vitest unit / e2e |
| `npm run db:migrate` / `npm run db:deploy` | `prisma migrate dev` + `prisma generate` (Prisma 7 no longer generates on migrate) / `prisma migrate deploy` |

`postinstall` runs `prisma generate`.

## Local development

Prerequisites: Node 22 LTS (`.nvmrc`) with its bundled npm, Docker. The Supabase CLI is a devDependency.

1. `npm ci`.
2. Auth needs an asymmetric key locally, or its JWKS stays empty: run `npx supabase gen signing-key --algorithm ES256` and save the printed key **inside a JSON array** as `supabase/signing_keys.json` (gitignored).
3. `npx supabase start` runs local Postgres, Auth and Storage.
4. Copy `.env.example` to `.env` and to `.env.test`; in `.env.test` set `NODE_ENV=test`, `LOG_LEVEL=silent` and point both database URLs at a separate database (e.g. `…:54322/dsm_test`). `prisma migrate deploy` creates it on first run.
5. `npm run db:migrate`, then `npm run start:dev`. Swagger UI is at `http://localhost:3000/docs`.
6. To call `/v1/me` by hand, sign up a user against local Auth (`POST http://127.0.0.1:54321/auth/v1/signup` with the publishable key from `npx supabase status`) and send its `access_token` as a Bearer token.

When the worker lands, local dev also needs Redis: `docker run -d --name dsm-redis -p 6379:6379 redis:7 --maxmemory-policy noeviction`.

## Lexicon data

The Admin loads the Lexicon straight into the database, locally and in the deployed Supabase project ([ADR 0007](adr/0007-lexicon-loaded-directly-into-database.md)). Fields and the import script: [lexicon-data.md](lexicon-data.md).

## Testing

Vitest + Supertest (the NestJS 12 defaults).

- **Unit tests** (`*.spec.ts` next to the code) cover the pure rule functions: quota split, Target state machine, ladder, Proficient rule, XP cause keys. No mocks needed.
- **e2e tests** (`test/*.e2e-spec.ts`) run against real Postgres (and Redis, once it exists), never a mocked database. `test/global-setup.ts` applies migrations first. Only the outside world is faked: the JWKS (`test/app.ts` signs tokens with a local key), and later the transcription client, the Claude evaluator and Storage, are overridden with test providers that return scripted results. Each test uses a fresh Learner id, so tests don't need table truncation. Test files are named after PRD criteria, e.g. `AC-04 mission with unattempted targets stays open`, so PRD §15.7 ("acceptance criteria become test cases") is literally true.
- CI uses a `postgres` service container (plus `redis` later); Supabase isn't needed in CI because Auth and Storage are faked.

## CI/CD

- **GitHub Actions** on every PR and on `main`: `npm ci` → `lint` → `typecheck` → `test` → `test:e2e` (which migrates the CI database).
- **Render** deploys `main` from `render.yaml` once CI passes (`autoDeployTrigger: checksPass`), region `singapore`:
  - `web` service on the **free** plan: build `npm ci && npm run build && npm run db:deploy`, start `NODE_ENV=production node dist/main`, health check `/v1/health`. The free plan has no pre-deploy command, so migrations run at the end of the build; on a paid plan they move to `preDeployCommand`.
  - `worker` service *(later; paid plans only)*: same build, start `node dist/worker`.
  - `keyvalue` instance *(later)*: `maxmemoryPolicy: noeviction`, internal access only.

### First deploy

1. **Supabase**: create a project in `ap-southeast-1` (Singapore). Check that `https://<ref>.supabase.co/auth/v1/.well-known/jwks.json` lists a key; if it's empty, enable JWT signing keys (Project Settings → JWT Keys). From Connect, copy the transaction pooler URL (port 6543) for `DATABASE_URL` and the session pooler URL (port 5432) for `DIRECT_URL`.
2. **Render**: New → Blueprint → this repo. Fill in `DATABASE_URL`, `DIRECT_URL` and `SUPABASE_URL` when prompted.
3. **Check**: `GET /v1/health` returns 200. Create a test user (Supabase dashboard → Authentication), get a token with `POST https://<ref>.supabase.co/auth/v1/token?grant_type=password` (header `apikey: <publishable key>`, body `{email, password}`), then `GET /v1/me` returns `onboarded: false`.

## Conventions

- **Words.** Code, tables, routes and logs use [CONTEXT.md](../CONTEXT.md) terms: `Sense`, not `Word`; `Submission`, not `Attempt`. When a new domain concept shows up, add it to the glossary first.
- **Branches.** `feat/<short-name>` for features, `fixBug/<short-name>` for fixes.
- **Before committing.** Run `npm run lint && npm run typecheck`. Never commit `.env` or secrets. Never use `--no-verify`.
- **Migrations.** Never edit an applied migration. Partial indexes and CHECK constraints are hand-written SQL appended to the generated migration (`prisma migrate dev --create-only`, edit, then `prisma migrate dev`). Every new table also gets `ENABLE ROW LEVEL SECURITY` with no policies, which keeps Supabase's Data API off it ([ADR 0002](adr/0002-supabase-as-infrastructure-only.md)).
- **Rules.** A rule that must never break (one Open Mission, no double XP, one Streak row per day) is a database constraint first and app code second.
- **Decisions.** Hard-to-reverse, surprising trade-offs get an ADR in `docs/adr/` (format: a short title plus 1–3 sentences).
