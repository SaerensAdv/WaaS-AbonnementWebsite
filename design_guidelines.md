# Design Guidelines: WebsiteAbonnementen Platform

## Design Approach
**System-Based Approach** drawing inspiration from modern B2B SaaS leaders:
- **Linear**: Clean dashboard aesthetics, sophisticated data presentation, subtle interactions
- **Stripe**: Crystal-clear pricing tables, trustworthy billing interfaces, professional forms
- **Notion**: Organized information architecture, intuitive wizards, efficient workflows

**Core Principle**: Premium business tool that prioritizes clarity, efficiency, and trust over decoration.

---

## Typography System

**Font Stack**: Inter (primary), SF Mono (code/numbers)
- **Display/Hero**: text-5xl to text-6xl, font-semibold (56-60px)
- **Page Headings**: text-3xl to text-4xl, font-semibold (30-36px)
- **Section Headings**: text-2xl, font-semibold (24px)
- **Card/Component Titles**: text-lg, font-medium (18px)
- **Body Text**: text-base, font-normal (16px)
- **Captions/Labels**: text-sm, font-medium (14px)
- **Small Text**: text-xs (12px)
- **Numbers/Currency**: SF Mono, tabular-nums for alignment

**Line Heights**: leading-tight for headings, leading-relaxed for body text

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 3, 4, 6, 8, 12, 16, 20, 24**
- Component padding: p-4 to p-6
- Section spacing: py-12 to py-20
- Card gaps: gap-4 to gap-6
- Form field spacing: space-y-4

**Grid System**:
- Dashboard: 12-column grid with gap-6
- Admin tables: Full-width with responsive columns
- Wizard steps: Single column max-w-2xl centered
- Pricing page: grid-cols-1 md:grid-cols-3 with gap-8

**Container Widths**:
- Marketing pages: max-w-7xl
- App dashboards: max-w-screen-2xl
- Forms/wizards: max-w-2xl
- Admin tables: full width with px-6

---

## Component Library

### Navigation
**Top Navigation Bar**:
- Fixed header, h-16, border-b
- Logo left, navigation center, user menu right
- Role-based menu items (Admin/Customer/Specialist views)
- Avatar with dropdown for account/billing/logout

**Sidebar (Admin/Specialist)**:
- w-64 fixed sidebar with navigation tree
- Icon + label for each section
- Active state with subtle indicator
- Collapsible on mobile

### Cards & Containers
**Standard Card**: Rounded-lg, border, p-6, shadow-sm on hover
**Stat Card**: p-6, displays metric + trend, icon top-right
**Feature Card** (pricing): p-8, border-2, rounded-xl, hover:shadow-lg
**Project Card**: Includes status badge, thumbnail, key metrics, action buttons

### Forms & Inputs
**Text Inputs**: h-10, px-4, rounded-md, border, focus:ring-2
**Select Dropdowns**: Consistent with text inputs
**Checkboxes/Radio**: Custom styled with rounded appearance
**Budget Slider**: Track h-2, thumb h-5 w-5, with numerical input beside
**File Upload**: Drag-drop zone, dashed border, p-8, rounded-lg

### Buttons
**Primary CTA**: h-10 to h-12, px-6, rounded-md, font-medium
**Secondary**: Outlined variant with border-2
**Ghost/Text**: No background, hover state only
**Icon Buttons**: Square p-2, rounded-md
**Loading State**: Spinner + disabled appearance

### Tables
**Admin Tables**:
- Sticky header with sort indicators
- Row height h-12 to h-14
- Alternating row backgrounds (subtle)
- Action column right-aligned
- Pagination bottom-right
- Search/filter bar above table (h-12, multiple filters inline)

### Wizards
**Multi-Step Wizard**:
- Progress indicator top: numbered circles connected with lines
- Single form section visible at a time
- Previous/Next buttons bottom-right
- Save draft option
- Validation inline with error messages

### Status & Badges
**Status Badges**: px-3, py-1, rounded-full, text-xs, font-medium
- ONBOARDING, PRODUCTION, LIVE, MAINTENANCE
- PROPOSED, ACTIVE, PAUSED, ENDED
**Role Badges**: Similar style for ADMIN/CUSTOMER/SPECIALIST

### Data Visualization
**Budget Split Display**:
- Horizontal bar chart showing media vs management split
- Percentages on segments
- Total budget above, split values below
- Slider to adjust with live recalculation
- Warning indicator if budget < €500

**KPI Display**:
- Grid of metric cards
- Large number (text-3xl), small label below
- Trend arrow/percentage change
- Icon representing metric type

### Modals & Overlays
**Modal**: max-w-2xl, rounded-lg, p-6, backdrop blur
**Slide-over Panel**: Fixed right, w-96 to w-[32rem], for quick actions/details
**Toast Notifications**: Top-right, slide-in, auto-dismiss

---

## Page-Specific Layouts

### Marketing/Pricing Page
**Hero Section**: 
- h-screen with centered content
- Large heading, subheading, dual CTAs
- Hero image/illustration right side (60/40 split on desktop)
- Subtle gradient background

**Pricing Section**:
- 3-column grid for tiers (LOW/MEDIUM/HIGH)
- Featured tier with highlight border/shadow
- Add-ons section below with expandable cards
- Clear CTA buttons per tier

### Dashboard (Customer)
**Overview Grid**:
- Top row: 4 stat cards showing key metrics
- Project cards grid below (2-3 columns)
- Recent activity timeline right sidebar

### Admin Panel
**Layout**: Sidebar + main content area
- Tab navigation for sections (Customers, Projects, Specialists, Add-ons)
- Data tables with filters above
- Quick actions toolbar
- Detail panels slide from right

### Specialist Dashboard
**Assignment List**:
- Card-based layout with client info
- Status indicators, action buttons
- Report creation shortcut
- Calendar integration for deadlines

---

## Icons
**Library**: Heroicons (outline for navigation, solid for status/actions)
- Navigation: 20px icons
- Buttons: 16px icons
- Status badges: 12px icons
- Large feature icons: 32px to 48px

---

## Interactions & Animations
**Premium Smooth Motion System** (Google Chrome-inspired):

**Page Load & Scroll Reveal**:
- BlurIn for hero text (blur-to-focus entrance)
- FadeInUp for content sections (opacity + subtle Y movement)
- StaggerChildren for lists/grids (sequenced entrance, 0.1s delay)
- All scroll animations use `once: true` for single trigger

**Parallax & Depth Effects**:
- Subtle parallax on dashboard mockups (speed: 0.2)
- Float animation on floating stat cards (duration: 5s, distance: 8px)
- GlowPulse on ambient background glows (subtle pulsing)

**Micro-interactions**:
- Button hover: scale(1.02) with whileHover
- Button tap: scale(0.98) with whileTap
- Card hover: y(-4px) lift effect
- Icon hover: scale(1.1) + subtle rotate

**Performance & Accessibility**:
- All animations use Framer Motion with spring physics
- useInView for lazy animation triggering (better performance)
- prefers-reduced-motion media query respected
- Smooth easing: [0.25, 0.1, 0.25, 1]

**Animation Component Library** (`@/components/ui/motion`):
- FadeIn, FadeInUp, ScaleIn, SlideIn
- StaggerChildren, StaggerItem
- Parallax, Float, GlowPulse, BlurIn

---

## Accessibility
- Minimum touch targets: 44px × 44px
- Form labels always visible
- Error messages with icon + text
- Keyboard navigation throughout
- ARIA labels on icon-only buttons
- Sufficient contrast ratios (WCAG AA minimum)

---

## Images
**Hero Section**: Professional office/teamwork imagery showing collaboration (1600x900px)
**Template Previews**: Screenshots of actual website templates (16:9 aspect ratio)
**Specialist Avatars**: Circular, 40px to 80px depending on context
**Empty States**: Friendly illustrations for "no data yet" scenarios

---

This design system ensures a professional, trustworthy SaaS platform that prioritizes usability and clarity—perfect for business users managing subscriptions, budgets, and specialist workflows.