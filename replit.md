# WebsiteAbonnementen Platform
## Overview
[abonnement.website](http://abonnement.website) is a B2B SaaS platform providing professional website subscription services for Belgian and Dutch SMEs and freelancers. One plan (€69/mo), credit-based content changes, modular add-ons. Quarterly billing, 6-month minimum commitment. Designed to scale via referral partners and a future freelancer marketplace for marketing add-on delivery.
## User Preferences
Preferred communication style: Simple, everyday language. Dutch (NL) as primary language, English as secondary.
## Pricing Model (updated 9 Aug 2026)
**Single plan: Website-abonnement**
*   Price: €69/month, billed quarterly upfront (€207/quarter)
*   Minimum: 6 months (2 quarters), then quarterly cancellable
*   Scope: custom responsive website (up to 5 pages), hosting, SSL, maintenance, ConsentEase included
*   Credits: 2 modification credits/month included (1 credit = 1 change request: text, image, small layout update)
*   Extra credits: €29/each
*   Support: via email

**Add-ons (monthly, activatable/cancellable anytime):**

| Slug | Name | Price (cents) | Scope |
| ---| ---| ---| --- |
| google-ads | Google Ads Beheer | 34900 | 3h/month, min €349 or 12% of ad spend |
| google-ads-ecommerce | Google Ads + Shopping | 44900 | 4h/month, min €449 or 12% of ad spend |
| meta-ads | Meta Ads Beheer | 34900 | 3h/month, min €349 or 12% of ad spend |
| seo | SEO Optimalisatie | 34900 | 2h/month on-page + technical + quarterly report |
| local-seo | Lokale SEO | 19900 | 1h/month GBP + review monitoring |
| social-media | Social Media Beheer | 39900 | 6 posts/month, 2 channels, 4h/month |
| ecommerce | E-commerce Module | 9900 | Webshop up to 50 products + €199 one-time setup |
| booking | Booking / Reserveringssysteem | 4900 | Calendar widget, max 3 services + €99 one-time setup |
| extra-pages | Extra Pagina's | 1500 | Per additional page above 5, €149 one-time build |

**Removed:** extra-content-bundle (replaced by credit system)

**Cookie Banner:** ConsentEase included in ALL plans at no extra cost (agency account).
## System Architecture
### Frontend Architecture
**Framework**: React with TypeScript, using Vite for development and builds
**Routing**: Client-side routing via Wouter, host-based for subdomain detection
**UI Component System**: Shadcn/ui (Radix UI primitives) with TailwindCSS
*   Light/dark mode support via ThemeProvider
*   DM Serif Display for display headings, DM Sans for body text, JetBrains Mono for numbers
*   Warm off-white/navy color palette
*   Phosphor Icons (duotone weight) for marketing pages; Lucide React for shadcn UI components and dashboard
*   framer-motion for scroll-triggered reveal animations, FAQ accordion, hero entrance, sticky mobile CTA, lead popup
*   CRO lead popup: exit-intent (desktop), scroll depth (65%), time delay (20s). Cookie suppression (7d dismiss, 90d submit).
*   Professional loading: Shimmer/wave skeleton animations

**State Management**:
*   TanStack Query v5 for server state
*   React Context for authentication state and i18n
*   Session-based authentication with HttpOnly cookies

**Internationalization**: Dutch (nl) and English (en) via custom React Context i18n.

**Subdomain-based routing:**
*   `abonnement.website` — Public marketing site
*   `app.abonnement.website` — Customer dashboard
*   `admin.abonnement.website` — Admin panel

**Public pages (**[**abonnement.website**](http://abonnement.website)**):**
*   `/` — Landing page (single plan, credits explainer, add-ons, how it works, FAQ)
*   `/werkwijze` — 6-step delivery process timeline
*   `/consentease` — Co-branded ConsentEase partnership page
*   `/offerte` — 4-step quote request wizard for custom projects
*   `/blog/*` — Blog/news
*   `/privacy`, `/terms` — Legal pages
*   `/betaalbare-website` — SEO landing page
*   `/checkout-success` — Post-payment redirect to app.\*

**Customer dashboard (**[**app.abonnement.website**](http://app.abonnement.website)**):**
*   `/` — Dashboard home (status, plan, credits widget, add-ons, billing)
*   `/changes` — Credit usage: request changes, view history, buy extra credits
*   `/analytics` — GA4 + Search Console + PageSpeed data
*   `/add-ons` — Add-on management (activate/pause)
*   `/support` — Support tickets
*   `/facturatie` — Billing, Stripe portal, FAQ
*   `/instellingen` — Profile settings

**Admin panel (**[**admin.abonnement.website**](http://admin.abonnement.website)**):**
*   `/` — Admin dashboard (MRR, clients, open requests, new quotes)
*   `/changes` — All change requests from all clients (inbox, status management)
*   `/klanten` — Client list with credits, add-ons, status
*   `/klanten/:id` — Client detail (plan, credits, requests, add-ons, notes)
*   `/offertes` — Quote request inbox
*   `/projectbeheer` — ClickUp integration (Roadmap, Delivery, Support, Growth)
### Backend Architecture
**Framework**: Express.js with TypeScript
**API Design**: RESTful endpoints, session-based auth, role-based access control

**Database Layer**: Drizzle ORM with PostgreSQL (Neon)

**Data Model**:
*   `users` — ADMIN or CUSTOMER roles
*   `customer_profiles` — Company info, Stripe customer ID, admin notes
*   `plans` — Single active plan: Website-abonnement €69/mo (old plans deactivated, not deleted)
*   `subscriptions` — Links user to plan, Stripe subscription ID, currentPeriodEnd
*   `projects` — Website project with status tracking (ONBOARDING → PRODUCTION → LIVE → MAINTENANCE)
*   `add_ons` — Catalog of available add-ons (synced at startup via addonCatalog.ts)
*   `add_on_selections` — Links add-on to subscription
*   `credit_allocations` — Monthly credit budgets per user (2 included + bonus)
*   `change_requests` — Modification requests (pending/in\_progress/completed/rejected)
*   `quote_requests` — Custom project inquiries from /offerte form
*   `password_reset_tokens` — Password reset flow
*   `processed_webhook_events` — Stripe webhook idempotency

**Key API Routes**:
*   Auth: signup, login, logout, forgot/reset-password
*   Plans/Addons: GET /api/plans, GET /api/addons (public)
*   Checkout: POST /api/checkout, POST /api/verify-checkout
*   Credits: GET /api/credits, GET /api/credits/history, POST /api/credits/request, POST /api/credits/request-extra
*   Dashboard: GET /api/dashboard, GET /api/billing
*   Onboarding: GET/POST /api/onboarding
*   Profile: GET/PATCH /api/profile
*   Admin: /api/admin/stats, /api/admin/customers, /api/admin/changes, /api/admin/quotes, /api/admin/clients/:id
*   Lead popup: POST /api/popup-lead
*   Quote requests: POST /api/quote-requests
### External Dependencies
**Stripe**: Checkout Sessions, Customer Portal, webhooks (checkout.session.completed, subscription.updated/deleted, invoice.payment\_failed). Quarterly billing as default.

**ClickUp API v2**: Auto-creates tasks on signup, checkout, onboarding. Support tickets. Admin overview.

**ConsentEase**: Cookie banner via agency account, included in all plans. Policy generator available for client self-service (future dashboard integration).
### Build and Deployment
**Development**: `npm run dev` (Express + Vite dev server on port 5000). Subdomain detection via ?subdomain= query param in dev.
**Production**: Vite builds to `dist/public`, ESBuild bundles server to `dist/index.cjs`. Deployed on Replit with custom domains.
**Database**: `npm run db:push` to sync schema, `npx tsx server/seed.ts` to seed.
### Security
*   helmet (HSTS, X-Frame-Options, X-Content-Type-Options)
*   Rate limiting on auth routes
*   Password requirements: min 8 chars + 1 uppercase + 1 digit
*   Webhook idempotency via processed\_webhook\_events table
*   Cookie domain set to `.abonnement.website` for cross-subdomain sessions
*   Admin routes require ADMIN role check
### Important Files
*   `shared/schema.ts` — Database schema + types (source of truth)
*   `server/addonCatalog.ts` — Add-on catalog with Stripe Price IDs (test + live)
*   `server/routes.ts` — All API endpoints
*   `server/credit-routes.ts` — Credit system endpoints
*   `server/storage.ts` — Data access layer
*   `server/clickup.ts` — ClickUp API service
*   `server/seed.ts` — Seed data (plan, add-ons, admin user)
*   `client/src/App.tsx` — Frontend routing with subdomain detection
*   `client/src/pages/home.tsx` — Landing page (single plan, credits, add-ons)
*   `client/src/pages/werkwijze.tsx` — Delivery process page
*   `client/src/pages/consentease.tsx` — ConsentEase co-branded page
*   `client/src/pages/offerte.tsx` — Quote request wizard
*   `client/src/pages/dashboard/changes.tsx` — Credit usage + change requests
*   `client/src/pages/admin/changes.tsx` — Admin change request inbox
*   `client/src/pages/admin/client-detail.tsx` — Client detail view
*   `client/src/pages/admin/quotes.tsx` — Quote request management
*   `client/src/components/layout/` — Marketing header/footer, app sidebar, admin sidebar
*   `client/src/lib/translations/` — i18n translation files (nl.ts, en.ts)