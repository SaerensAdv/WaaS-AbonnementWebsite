# WebsiteAbonnementen Platform

## Overview

WebsiteAbonnementen is a B2B SaaS platform providing website subscription services with three tiers (Starter/Low, Professional/Medium, and High/Custom). The platform enables customers to select website templates, manage subscriptions, purchase add-ons (Google Ads, Meta Ads, SEO, content creation), and track project progress. Specialists can be assigned to customer accounts for advertising and SEO management, while administrators oversee all operations including customer management, specialist assignments, and platform configuration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite for development and builds

**Routing**: Client-side routing via Wouter (lightweight React Router alternative)

**UI Component System**: Shadcn/ui (Radix UI primitives) with TailwindCSS for styling
- Design system inspired by Linear, Stripe, and Notion
- Custom theme configuration with light/dark mode support
- Inter font for text, JetBrains Mono for code/numbers
- Consistent spacing system using Tailwind units

**State Management**: 
- TanStack Query (React Query) for server state and API data caching
- React Context for authentication state
- Session-based authentication with HttpOnly cookies

**Key Layout Patterns**:
- Marketing layout for public pages (home, pricing)
- App layout with sidebar navigation for authenticated users
- Role-based UI rendering (Customer, Specialist, Admin dashboards)

### Backend Architecture

**Framework**: Express.js server with TypeScript

**API Design**: RESTful endpoints organized by feature
- Session-based authentication using express-session
- Role-based access control via middleware (requireAuth, requireRole)
- Password hashing with SHA-256

**Database Layer**: 
- Drizzle ORM for type-safe database queries
- PostgreSQL as the primary database
- Schema-first approach with Drizzle Zod for validation
- Storage abstraction pattern for data access operations

**Data Model**:
- Users with role-based permissions (ADMIN, CUSTOMER, SPECIALIST)
- Customer and Specialist profile extensions
- Plans with tier-based pricing (LOW, MEDIUM, HIGH)
- Subscriptions linked to Stripe customer IDs
- Projects with status tracking (ONBOARDING, PRODUCTION, LIVE, MAINTENANCE)
- Add-ons with selection tracking
- Assignments linking specialists to customer projects
- Reports for tracking deliverables and updates
- Audit logs for compliance and tracking

### External Dependencies

**Payment Processing**: Stripe
- Subscription management via Stripe Customer IDs
- Subscription status tracking (ACTIVE, PAST_DUE, CANCELED, INCOMPLETE)
- Line items for add-on purchases

**Database**: PostgreSQL
- Hosted via environment variable (DATABASE_URL)
- Connection pooling with node-postgres (pg)
- Schema migrations via Drizzle Kit

**Session Storage**: 
- Express-session with either connect-pg-simple (PostgreSQL store) or memorystore
- Configurable session duration and security settings

**Development Tools**:
- Replit-specific plugins for dev environment (cartographer, dev-banner, runtime error overlay)
- Hot module replacement (HMR) via Vite
- ESBuild for production server bundling

**Planned Integrations** (referenced in requirements but not yet implemented):
- Email service (Resend or Postmark) for transactional emails
- File storage (S3-compatible: Cloudflare R2 or Supabase Storage) for logos and images
- NextAuth or Clerk for enhanced authentication (currently using custom session auth)

### Build and Deployment

**Development**: 
- Vite dev server with HMR
- Express server runs separately, proxies API requests
- TypeScript compilation without emit (type checking only)

**Production**:
- Client: Vite builds static assets to `dist/public`
- Server: ESBuild bundles server code to single `dist/index.cjs` file
- Select dependencies bundled to reduce cold start times
- Static file serving from built client assets

**Database Operations**:
- `db:push` command to sync schema changes to database
- Seed script for initial data (plans, add-ons, admin user, templates)