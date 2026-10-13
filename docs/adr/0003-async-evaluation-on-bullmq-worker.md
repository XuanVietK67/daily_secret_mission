# Evaluation runs asynchronously on a BullMQ worker

Transcribing a recording and evaluating it takes roughly 5–30 seconds and depends on two external AI vendors. The API therefore accepts a Submission with `202 Accepted` and puts an `evaluation` job (job id = Submission id) on a BullMQ queue backed by Redis. A separate worker process, built from the same codebase, runs the job with retries; the app polls for status and gets a push notification when the result is ready. We rejected a synchronous request because a dropped mobile connection would lose the result, and BR-05 requires that a system error never fails a Mission. We rejected pg-boss, which would avoid running Redis, in favour of the NestJS-native `@nestjs/bullmq` integration and its mature tooling.

## Consequences

- Redis must run with `maxmemory-policy noeviction`, otherwise jobs can silently disappear.
- Job handlers must be idempotent: a retried job may re-apply verdicts, so rewards rely on database unique constraints (see [domain-rules.md](../domain-rules.md)).
