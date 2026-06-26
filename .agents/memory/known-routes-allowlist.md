---
name: KNOWN_ROUTES SPA allowlist
description: New public client routes must be added to a route allowlist duplicated in two server files, or direct visits return HTTP 404 (bad for SEO).
---

# KNOWN_ROUTES SPA allowlist

Adding a new public client-side page (a `<Route>` in `client/src/App.tsx`) is NOT enough. The Express catch-all serves `index.html` for any path but sets the HTTP status via `KNOWN_ROUTES.has(pathname) ? 200 : 404`. This `KNOWN_ROUTES` Set is **duplicated** in BOTH:
- `server/static.ts` (production / `serveStatic`)
- `server/vite.ts` (development / `setupVite`)

**Rule:** when you add a public route, add its exact path string to the Set in BOTH files. Otherwise a direct visit / refresh / crawler hit returns a soft-404 in production, so Google won't index the page and the SEO work is wasted. Also add it to `/sitemap.xml` (in `server/routes.ts`) and ideally an internal link (e.g. footer).

**Why:** SPA fallback always renders the page client-side, so the bug is invisible in the browser — only the HTTP status is wrong. Easy to miss.

**How to apply:** editing `server/vite.ts` is normally forbidden ("never edit Vite setup"), but adding one string to this allowlist Set is the sanctioned, minimal exception — it is necessary and matches the existing maintained pattern (`/`, `/privacy`, `/terms`, `/offerte`, …). Do not restructure the file.

**Dev quirk:** in dev, unknown routes may still return 200 (Vite middleware SPA fallback intercepts before the custom handler); the real 404 behavior only manifests in production `serveStatic`. Verify route serving by confirming the new route returns 200, not by expecting unknown routes to 404 in dev.
