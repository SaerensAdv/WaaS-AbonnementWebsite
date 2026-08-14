---
name: SEO prerender dual-renderer invariants
description: Cross-file rules that keep Googlebot-visible static HTML and the React client in sync for marketing/blog pages.
---

# SEO prerender: server static HTML + client React from one data source

Marketing/blog pages are crawlable because the Express catch-all injects route-specific static HTML + JSON-LD into `<div id="root">` (via `server/seo-prerender.ts`, with blog routes delegated to `server/blog-prerender.ts`). The React client then hydrates the richer design. Blog content lives in a single framework-free typed source (`shared/blog*`) consumed by BOTH the client renderer and the server string-template renderer.

**Invariants that are easy to break (and silently degrade SEO):**

- **Block parity:** every `ContentBlock` variant must be rendered in BOTH `client/src/components/blog/article-renderer.tsx` AND `server/blog-prerender.ts` `renderBlocks`. A new block type added to only the client is invisible to crawlers; added to only the server it won't display to users. Keep heading levels consistent across the two (e.g. in-body CTA title is `h3` in both).
- **JSON-LD dedupe:** the server injects `<script application/ld+json data-route-prerender="true">`. The client `use-seo.ts` MUST remove any `data-route-prerender` script before injecting its own structured-data script, or the page ships duplicate JSON-LD.
- **JSON-LD serialization:** serialize structured data with `<` escaped to `\u003c` so author content can never break out of the `<script>` tag.
- **Known-route registry:** `server/known-routes.ts` (`isKnownRoute`) is the single source for which paths prerender / return 200 vs 404. Add new static routes there; blog article slugs are validated against `getBlogSlugs()`. Both `vite.ts` (dev) and `static.ts` (prod) consume it — don't reintroduce a duplicated route list.
- **Discovery surfaces:** when adding routes, also update the sitemap in `server/routes.ts`, `llms.txt`, and header/footer nav.

**Why:** the whole point is cold organic traffic — the raw HTML (no JS) must contain H1, body, and JSON-LD. Verify with `curl` of the raw HTML, not just the browser.

**Title-suffix parity:** `use-seo.ts` appends `| Abonnement.Website` only when total ≤60 chars; server `ROUTE_METADATA` titles must be written as the exact final string the client will render (add or omit the suffix accordingly). Every public marketing route (incl. lazy-loaded ones) needs its own `ROUTE_METADATA` entry — a missing entry silently serves the generic SPA shell to crawlers (happened with /werkwijze and /consentease).
