---
name: Stripe SDK type gotchas
description: Stripe TS types that don't match the installed API version; runtime is fine.
---

`npm run check` (tsc) fails on these Stripe fields because the installed Stripe API-version types moved/omitted them, even though the live API objects still return them:
- `subscription.current_period_end` (Subscription)
- `invoice.subscription` (Invoice)
- `stripe.invoices.retrieveUpcoming(...)`

**Why:** Stripe pins its TS types to an API version; these fields exist at runtime but not in the type. `npm run build` (esbuild) skips type-checking so it passes; only `tsc` complains.

**How to apply:** cast with `as any` at the access site (e.g. `(sub as any).current_period_end`, `const inv = invoice as any`). Do NOT rewrite the runtime logic — it works. Revisit these casts if the Stripe package/API version is upgraded.
