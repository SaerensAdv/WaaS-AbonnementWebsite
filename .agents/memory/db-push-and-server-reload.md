---
name: db:push interactivity & server reload
description: drizzle-kit push prompts interactively for new tables; tsx dev server needs workflow restart to pick up server code
---

- `npm run db:push` (drizzle-kit push) blocks on an interactive create-vs-rename prompt for new tables that piped newlines cannot answer. Workaround: apply the DDL directly via `psql "$DATABASE_URL"` (additive-only) while keeping `shared/schema.ts` as source of truth — a later push then sees the tables as existing.
- **Why:** push hung twice on the change_requests table prompt during the credits feature.
- The dev workflow (`npm run dev`, tsx) hot-reloads only the Vite client; server code changes (routes/storage) require a workflow restart. **How to apply:** always restart "Start application" before re-testing server endpoints, otherwise you test stale code (a race-condition fix falsely appeared broken this way).
