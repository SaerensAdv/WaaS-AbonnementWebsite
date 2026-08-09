---
name: Single-plan pricing model
description: Invariants of the 2026-08 pricing rewrite (one plan + credits + add-ons) and pending live-Stripe caveat
---

# Single-plan pricing model (since Aug 2026)

- Public offering is ONE plan: "Website-abonnement" €69/mnd, quarterly prepaid €207, 6-month minimum, 5 pages, 2 change credits/mnd, extra credits €29. Old tiers (Starter/Professional/Business, €49/99/199) must never reappear in public copy, JSON-LD, prerender HTML, llms.txt, translations, or blog content.
- `syncPlanCatalog()` (runs at startup) upserts the plan by name and *deactivates* (not deletes) all other plans so FKs stay intact. `/api/checkout` rejects inactive plans; signup falls back to the sole active plan when `?plan=` is missing/invalid.
- **Why:** old plans still exist in DB for existing subscriptions; only the active flag gates purchasability.
- **Pending caveat:** add-ons display new prices but production still submits OLD live Stripe price IDs (prompt required live IDs untouched until manual live activation). Before/at live activation, create matching live prices and update the catalog, or prod customers get charged old amounts. `extra-pages` add-on has live IDs = null (returns "not yet available" in prod).
