# Supabase as infrastructure only

We use Supabase for managed Postgres, Storage and Auth, but **all business logic lives in the NestJS API**. The Expo app talks to Supabase directly for only two things: signing in (Supabase Auth SDK) and uploading audio to a signed URL the API issued. It never reads or writes database tables, so we don't depend on Row Level Security policies or Edge Functions. We chose this over a full BaaS setup (Supabase handling logic too) because the core rules — Mission completion, XP de-duplication, Streak, the review ladder — must sit in one testable place, and over three separate vendors (Neon + R2 + Clerk) because one vendor means one dashboard, one bill and one data-processor disclosure.

## Consequences

- RLS stays on with no policies (deny-all) as defence in depth; the API connects with a privileged role.
- Leaving Supabase means swapping Auth (JWT verification is isolated in `auth/`) and Storage (isolated in `storage/`); Postgres moves with a plain dump.
