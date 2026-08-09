---
name: Single-plan pricing model
description: Invariants of the 2026-08 pricing rewrite (one plan + credits + add-ons) and pending live-Stripe caveat
---

# Single-plan pricing model (since Aug 2026)

- Public offering is ONE plan: "Website-abonnement" €69/mnd, quarterly prepaid €207, 6-month minimum, 5 pages, 2 change credits/mnd, extra credits €29. Old tiers (Starter/Professional/Business, €49/99/199) must never reappear in public copy, JSON-LD, prerender HTML, llms.txt, translations, or blog content.
- `syncPlanCatalog()` (runs at startup) upserts the plan by name and *deactivates* (not deletes) all other plans so FKs stay intact. `/api/checkout` rejects inactive plans; signup falls back to the sole active plan when `?plan=` is missing/invalid.
- **Why:** old plans still exist in DB for existing subscriptions; only the active flag gates purchasability.
- **Live activation done (Aug 2026):** live Stripe prices now match the new amounts for the plan (€69/mnd + €207/kwartaal, tax exclusive, product prod_V2fhnUu2k9bO1Y) and all 9 add-ons (incl. new extra-pages product). Old live add-on prices are deactivated in Stripe (existing subs unaffected). Prod DB picks up the live IDs via the startup catalog sync on deploy.
- `/signup` is served on the PUBLIC site (marketing funnel → checkout); it is deliberately absent from the public→app auth-redirect list. Login/forgot/reset still redirect to app. Signup page's login link must hard-navigate cross-site (siteUrl), not use wouter Link.
