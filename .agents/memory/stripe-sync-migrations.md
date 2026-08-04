---
name: stripe-replit-sync migration quirks
description: Lessons from upgrading stripe-replit-sync 0.0.12 -> 1.0.0 and fixing managed webhook setup
---

- Migration 0039 (`ALTER TYPE ... ADD VALUE 'paused'`) is non-idempotent; DBs that already have the label but no `stripe._migrations` id=39 record fail all later migrations. A guarded repair step exists in `initStripe` (server/index.ts) — keep it until all environments have migrated.
- **Why:** the package's migration runner (pg-node-migrations) rolls back and stops at the first failure; "Stripe schema already up to date" log can mask a real migration failure because the catch only checks for "already exists".
- Hash format for `stripe._migrations`: sha1(fileName + sql contents).
- v1.0.0 API breaks: `findOrCreateManagedWebhook` returns the webhook object directly (no `{webhook, uuid}`), `processWebhook(payload, signature)` has no uuid param; webhook route is `/api/stripe/webhook` (uuid route kept for compat).
- Stripe production connection (live keys) is configured via the Publish pane "Install Stripe app" flow, NOT the regular integration panel (that one manages the dev/test sandbox). After connecting, a republish is required.
- **How to apply:** on any Stripe sync issue, check deployment logs for "Webhook setup skipped"/"connection not found" and verify which environment (dev=test keys, prod=live keys) is failing before touching code.
