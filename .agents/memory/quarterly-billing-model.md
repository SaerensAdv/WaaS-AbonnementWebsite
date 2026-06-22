---
name: Quarterly billing model
description: How WebsiteAbonnementen bills (per quarter) and the Stripe constraint behind it.
---

The whole platform bills PER QUARTER (3 months upfront), for both plans and add-ons. Monthly billing is offered only on individual request/approval. The monthly RATE is still the headline (€49 / €99 / €199); quarterly amounts are rate×3 (€147 / €297 / €597).

Stripe shape: a quarterly price is `recurring.interval = "month"`, `interval_count = 3`, `unit_amount = monthlyPriceCents × 3`. Each plan/add-on stores `stripeQuarterlyPriceId`. Checkout falls back to inline `price_data` (×3, interval_count 3) if the id is missing. `scripts/create-quarterly-prices.ts` (idempotent) creates/stores these — only for ACTIVE add-ons.

**Why:** a single Stripe subscription cannot mix billing intervals. Add-ons are added as subscription items to the customer's existing (quarterly) subscription, so they MUST use a quarterly price — otherwise Stripe rejects the item.

**How to apply:** any new billable item (plan or add-on) needs a quarterly price before it can be sold; the add-on purchase route requires both `stripeQuarterlyPriceId` and `isActive`.
