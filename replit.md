# WebsiteAbonnementen Platform

## Overview

WebsiteAbonnementen (abonnement.website) is a B2B SaaS platform providing professional website subscription services. The "McDonald's Strategy" approach: one strong landing page, 3 clear pricing tiers (Starter €49/mo, Professional €99/mo, Business €199/mo), instant Stripe checkout, a simple customer dashboard, and a basic admin panel. Designed to be scalable toward a future freelancer marketplace.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite for development and builds

**Routing**: Client-side routing via Wouter

**UI Component System**: Shadcn/ui (Radix UI primitives) with TailwindCSS
- Light/dark mode support via ThemeProvider
- DM Serif Display for display headings (font-display), DM Sans for body text (font-sans), JetBrains Mono for numbers
- Warm off-white/navy color palette (not pure white/black)
- Phosphor Icons (duotone weight) for marketing pages (homepage, header, footer); Lucide React for shadcn UI components and dashboard
- framer-motion for scroll-triggered reveal animations, FAQ accordion, hero entrance, sticky mobile CTA, lead popup
- CRO lead popup (`client/src/components/lead-popup.tsx`): exit-intent (desktop), scroll depth (65%), time delay (20s) triggers. 3 fields (naam, email, optioneel vraag). Cookie suppression (7d dismiss, 90d submit). FAQ "Stel uw vraag" button also opens popup via `open-lead-popup` custom event. Fully accessible: focus trap, Escape close, aria-modal, aria-invalid.
- Mobile optimizations: `dvh` viewport units, horizontal stat scroll-strip (lg:hidden), `whileTap` touch feedback on cards, sticky "Bekijk prijzen" CTA bar (md:hidden, appears after hero, hides at pricing), auto-close mobile menu on scroll, safe-area-inset-bottom padding, `scrollbar-hide` utility in CSS

**State Management**: 
- TanStack Query v5 for server state and API data caching
- React Context for authentication state and i18n
- Session-based authentication with HttpOnly cookies

**Internationalization (i18n)**:
- Custom React Context-based i18n (client/src/lib/i18n-context.tsx)
- Dutch (nl) and English (en) languages
- Translation files: client/src/lib/translations/nl.ts and en.ts

**Key Pages**:
- `/` — Landing page with hero, pricing, add-ons, FAQ sections
- `/login`, `/signup` — Authentication pages
- `/privacy`, `/terms` — Legal pages
- `/checkout-success` — Post-payment confirmation
- `/offerte` — Quote request form for maatwerk/custom projects (submits to quote_requests DB + ClickUp task in AANVRAGEN list)
- `/app` — Customer dashboard (status, subscription, add-ons)
- `/app/onboarding` — 5-step onboarding intake wizard
- `/app/addons` — Add-on management
- `/app/billing` — Billing & subscription
- `/app/settings` — Profile settings
- `/admin` — Admin dashboard (MRR, stats, customer count)
- `/admin/customers` — Customer management with onboarding status

**Layout Patterns**:
- MarketingLayout: header (anchor nav: Pricing, Add-ons, FAQ) + footer
- AppLayout: sidebar navigation for authenticated users
- Roles: ADMIN (admin sidebar) and CUSTOMER (customer sidebar)

### Backend Architecture

**Framework**: Express.js with TypeScript

**API Design**: RESTful endpoints
- Session-based auth via express-session
- Role-based access control (requireAuth, requireRole middlewares)
- Password hashing with bcryptjs

**Database Layer**: 
- Drizzle ORM with PostgreSQL
- Schema-first approach with drizzle-zod validation
- Storage abstraction pattern (IStorage interface)
- One-time schema cleanup migration runs on startup (tracked in `_schema_migrations` table, skips if already applied)
- Enums: `user_role` (ADMIN, CUSTOMER), `subscription_status` (ACTIVE, PAST_DUE, CANCELED, INCOMPLETE), `plan_tier` (LOW, MEDIUM, HIGH), `project_status` (ONBOARDING, PRODUCTION, LIVE, MAINTENANCE), `addon_status` (REQUESTED, ACTIVE, PAUSED)

**Data Model**:
- `users` — ADMIN or CUSTOMER roles
- `customer_profiles` — Company info, Stripe customer ID
- `plans` — 3 tiers (LOW=Starter €49, MEDIUM=Professional €99, HIGH=Business €199)
- `subscriptions` — Links user to plan, tracks Stripe subscription ID
- `projects` — Website project with status tracking (ONBOARDING → PRODUCTION → LIVE → MAINTENANCE), includes `onboardingData` (jsonb) and `onboardingCompleted` (boolean)
- `add_ons` — Google Ads Beheer €249, Meta Ads Beheer €249, Extra Content Wijzigingen €29, E-commerce Module €79, Social Media Beheer €199, Booking/Reserveringssysteem €39
- `add_on_selections` — Links add-on to subscription
- `password_reset_tokens` — Password reset flow

**Cookie Banner**: ConsentEase cookie banner is included in ALL plans at no extra cost (agency account). No separate add-on.

**Plan Differentiation**:
- Starter: 5 pages, 1 content change/mnd, email support (24h), basis SEO
- Professional: 10 pages, 3 content changes/mnd, priority support (8h), geavanceerde SEO, Google Analytics, Google Maps, beeldbank
- Business: 20 pages, 5 content changes/mnd, dedicated accountmanager (4h), blog, meertalig, geavanceerde formulieren, maandelijks rapport

**SEO & Schema Markup**:
- `client/index.html` — Static OG tags, canonical, and consolidated `@graph` JSON-LD (Organization, WebSite, ProfessionalService with all 3 pricing tiers)
- `client/src/hooks/use-seo.ts` — Dynamic per-page SEO (title, description, canonical, OG, Twitter, hreflang, structured data injection)
- Homepage injects FAQPage schema (6 Q&A pairs) via `useSEO({ structuredData })`
- Auth pages (login, signup, forgot-password, reset-password) and 404 set `noIndex: true`
- `GET /robots.txt` — Allows `/`, disallows `/app/`, `/admin/`, `/api/`, auth pages
- `GET /sitemap.xml` — Lists `/`, `/privacy`, `/terms`

**Key API Routes**:
- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`
- `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`
- `GET /api/me` — Current user
- `GET /api/plans`, `GET /api/addons` — Public plan/addon listing
- `POST /api/popup-lead` — Lead capture popup submission (rate-limited, stores in DB + ClickUp AANVRAGEN list)
- `POST /api/checkout` — Creates Stripe Checkout session
- `POST /api/verify-checkout` — Verifies checkout and creates subscription
- `GET /api/dashboard` — Customer dashboard data
- `GET /api/onboarding`, `POST /api/onboarding` — Onboarding intake form
- `GET /api/addons/my`, `POST /api/addons/select` — Customer add-on management
- `GET /api/profile`, `PATCH /api/profile` — Customer profile
- `GET /api/billing`, `POST /api/billing/portal` — Billing + Stripe portal
- `GET /api/admin/stats`, `GET /api/admin/customers` — Admin endpoints
- `GET /api/admin/projects`, `PUT /api/admin/projects/:id/status` — Project management

### External Dependencies

**Payment Processing**: Stripe
- Checkout Sessions for new subscriptions
- Customer Portal for subscription management
- Webhook handler for checkout.session.completed, subscription.updated/deleted
- stripe-replit-sync for data mirroring

**Project Management**: ClickUp API v2
- API Token: `CLICKUP_API_TOKEN` environment variable
- Space ID: `901510164504`, Team ID: `9015913612`
- Auto-creates tasks in ClickUp on: signup (Aanvragen list), checkout (Klanten list), onboarding complete (Sprint list)
- Customer support tickets: creates/reads tasks in Support Tickets list
- Admin overview: reads Sprint, Bugs, Support, Backlog lists
- Service module: `server/clickup.ts`
- Documentation: `docs/clickup-integratie.md`

**Database**: PostgreSQL (Neon-backed via Replit)

**Admin Credentials**: admin@websiteabonnementen.nl / admin123

### Build and Deployment

**Development**: `npm run dev` — runs Express server + Vite dev server on port 5000
**Production**: Vite builds to `dist/public`, ESBuild bundles server to `dist/index.cjs`
**Database Operations**: `npm run db:push` to sync schema, `npx tsx server/seed.ts` to seed

### Important Files

- `shared/schema.ts` — Database schema + types (source of truth)
- `server/storage.ts` — Data access layer (IStorage interface)
- `server/routes.ts` — All API endpoints
- `server/clickup.ts` — ClickUp API service module
- `server/seed.ts` — Seed data (plans, add-ons, admin user)
- `client/src/App.tsx` — Frontend routing
- `client/src/pages/home.tsx` — Landing page
- `client/src/pages/dashboard/onboarding.tsx` — 5-step onboarding wizard
- `client/src/pages/dashboard/support.tsx` — Customer support tickets (ClickUp)
- `client/src/pages/admin/clickup.tsx` — Admin ClickUp projectbeheer
- `client/src/components/layout/` — Marketing header/footer, app sidebar/layout
- `client/src/lib/translations/` — i18n translation files (nl.ts, en.ts)
