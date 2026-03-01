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
- Inter font for text, JetBrains Mono for numbers
- framer-motion for animations

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
- `/app` — Customer dashboard
- `/app/addons` — Add-on management
- `/app/billing` — Billing & subscription
- `/app/settings` — Profile settings
- `/admin` — Admin dashboard
- `/admin/customers` — Customer management

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

**Data Model**:
- `users` — ADMIN or CUSTOMER roles
- `customer_profiles` — Company info, Stripe customer ID
- `plans` — 3 tiers (LOW=Starter €49, MEDIUM=Professional €99, HIGH=Business €199)
- `subscriptions` — Links user to plan, tracks Stripe subscription ID
- `projects` — Website project with status tracking (ONBOARDING → PRODUCTION → LIVE → MAINTENANCE)
- `add_ons` — Fixed-price add-ons (Google Ads €149, Meta Ads €149, SEO €99, Content €79, Cookie Banner €9)
- `add_on_selections` — Links add-on to subscription
- `password_reset_tokens` — Password reset flow

**Key API Routes**:
- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`
- `GET /api/me` — Current user
- `GET /api/plans`, `GET /api/addons` — Public plan/addon listing
- `POST /api/checkout` — Creates Stripe Checkout session
- `POST /api/verify-checkout` — Verifies checkout and creates subscription
- `GET /api/dashboard` — Customer dashboard data
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

**Database**: PostgreSQL (Neon-backed via Replit)

### Build and Deployment

**Development**: `npm run dev` — runs Express server + Vite dev server on port 5000
**Production**: Vite builds to `dist/public`, ESBuild bundles server to `dist/index.cjs`
**Database Operations**: `npm run db:push` to sync schema, `npx tsx server/seed.ts` to seed

### Important Files

- `shared/schema.ts` — Database schema + types (source of truth)
- `server/storage.ts` — Data access layer (IStorage interface)
- `server/routes.ts` — All API endpoints
- `server/seed.ts` — Seed data (plans, add-ons, admin user)
- `client/src/App.tsx` — Frontend routing
- `client/src/pages/home.tsx` — Landing page
- `client/src/components/layout/` — Marketing header/footer, app sidebar/layout
