# Tech stack

Every choice below was made for one constraint: **one developer shipping an MVP** in which the founder is the only Learner, but which can grow to more Learners later without a rewrite. Pin exact versions when scaffolding; this doc names majors only where it matters.

## Summary

| Concern | Choice | Why |
|---|---|---|
| Language | **TypeScript** (strict) | Same language as the Expo client; one toolchain. |
| Runtime | **Node.js 24 LTS**, **pnpm** | Current Active LTS. pnpm is fast and strict about undeclared dependencies. |
| HTTP framework | **NestJS** | Opinionated modules give the codebase a predictable shape; first-class integrations for BullMQ, Swagger, config, throttling and health checks. |
| Validation | **class-validator + class-transformer** (global `ValidationPipe`) | Idiomatic NestJS DTOs; `@nestjs/swagger` reads them to produce OpenAPI. |
| API contract | **REST + OpenAPI** via `@nestjs/swagger` (CLI plugin on) | The Expo app consumes a client generated from the OpenAPI spec (e.g. `openapi-typescript`), so the API stays the single source of truth. |
| Database | **PostgreSQL on Supabase** | Managed, with backups and a free tier. Postgres constraints (partial unique indexes, CHECKs) enforce the rules that must never break. |
| ORM | **Prisma 7** with the `@prisma/adapter-pg` driver adapter | Typed client, migrations and Studio. Partial indexes and CHECK constraints go in hand-edited SQL migrations. |
| Auth | **Supabase Auth** | Expo SDK for sign-in; the API only verifies JWTs against Supabase's JWKS (`jose`). See [ADR 0002](adr/0002-supabase-as-infrastructure-only.md). |
| Object storage | **Supabase Storage** (private bucket) | Audio goes straight from the device to a signed upload URL; the API never proxies bytes. |
| Background jobs | **BullMQ + Redis** via `@nestjs/bullmq` | Retries and backoff for the evaluation pipeline; job schedulers for cleanup. See [ADR 0003](adr/0003-async-evaluation-on-bullmq-worker.md). |
| Speech-to-text | **OpenAI transcription API** (`gpt-4o-transcribe` family, model set via env) | Accurate on accented English, accepts m4a directly, can return confidence signals. |
| Usage evaluation | **Claude** via `@anthropic-ai/sdk`, model `claude-opus-5-5` (env-configurable) | Nuanced, explained feedback; structured output returns verdicts as typed JSON. |
| Push notifications | **Expo Push Service** (`expo-server-sdk`) | "Feedback ready" and streak reminders without running APNs/FCM ourselves. |
| Hosting | **Render**: web service (API), background worker, Key Value (Redis) | All three in one place; deploys from GitHub via `render.yaml`. Postgres stays on Supabase. |
| Config | `@nestjs/config` + class-validator env schema | The app refuses to boot with missing or invalid env. |
| Logging | `nestjs-pino` (JSON logs; `pino-pretty` when `NODE_ENV=development`) | Structured logs that Render's log stream can search. |
| Rate limiting | `@nestjs/throttler` | Caps AI-cost endpoints (submissions, sense drafts) per Learner. |
| Health | `@nestjs/terminus` | `/v1/health` checks DB + Redis for Render's health check. |
| Testing | **Vitest + Supertest** (NestJS 12 default) | Unit tests for pure rules; e2e tests turn PRD AC-01…AC-14 into executable checks. |
| Lint / format | oxlint (type-aware) + Prettier (NestJS 12 defaults), `tsc --noEmit` | Run before every commit. |
| Module format | ESM (`nodenext`), TypeScript 6 | What NestJS 12 scaffolds; TypeScript stays on 6.x until the Nest CLI, swagger plugin and linters support 7. |
| CI | GitHub Actions | lint → typecheck → test on every PR. |

## AI integration details

**Transcription (OpenAI).** The worker downloads the audio from Storage and sends it to the transcription endpoint (limit: 25 MB per file; the app caps recordings well below that). A transcript that is empty, or whose confidence falls below a threshold, skips evaluation and yields **Insufficient evidence** for every Target (BR-04, AC-08). The model name comes from `OPENAI_TRANSCRIBE_MODEL`.

**Evaluation (Claude).**
- SDK: `@anthropic-ai/sdk`. Use `client.messages.parse()` with `output_config.format: zodOutputFormat(VerdictsSchema)` (from `@anthropic-ai/sdk/helpers/zod`) so the response is validated against a schema. Zod is used **only** for this AI-output contract; HTTP DTOs use class-validator.
- Model: `claude-opus-5-5` by default, via `ANTHROPIC_MODEL`. On Opus 5.5, thinking cannot be disabled and effort defaults to `medium`, so set `output_config.effort` explicitly (start at `medium`; measure before changing).
- Refusals: always check `stop_reason` before reading content. Enable server-side fallbacks (`betas: ["server-side-fallback-2026-07-01"]`, `fallbacks: "default"`).
- Prompt caching: system prompt and rubric go first (stable, cached); Targets and transcript go last.
- Evidence check: every verdict except Not used must quote the transcript or Journal. If the quote isn't actually in the text, the verdict is downgraded to **Insufficient evidence**, so the AI can't claim evidence that doesn't exist (PRD principle 4).
- No PII in prompts: send only the transcript, Journal, Target Senses and Mission Mode, never the Learner's name, email or ID (PRD §11.2.7).
- Pronunciation is **not** evaluated (BR-12): only the transcript reaches Claude, so the feedback must never comment on pronunciation.

## Rejected alternatives worth remembering

- **Fastify / Hono**: leaner, but NestJS's module structure and integrations were preferred.
- **Drizzle**: lighter and closer to SQL; Prisma was preferred for tooling and familiarity.
- **pg-boss** (queue in Postgres, no Redis): see [ADR 0003](adr/0003-async-evaluation-on-bullmq-worker.md).
- **Upstash Redis**: serverless per-command pricing doesn't suit BullMQ's constant polling; use Render Key Value instead.
- **Monorepo with shared Zod contracts**: rejected for an API-only repo; the generated OpenAPI client keeps client and server in sync.
- **Gemini audio-in evaluation**: one call, but it blurs the boundary between usage evaluation and pronunciation (BR-12).
