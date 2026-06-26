---
name: Vite dev server crashes on malformed percent-encoded URLs
description: Why a request like /blog/%E0%A4%A kills the dev server but production is fine — do not chase it as an app bug.
---

# Vite dev server: "URI malformed" crash on bad percent-encoding

A request with malformed percent-encoding (e.g. `/blog/%E0%A4%A`) crashes the **dev** workflow with `Internal server error: URI malformed` thrown from `decodeURI` inside Vite's own `viteTransformMiddleware`.

**Why it matters:** That middleware runs *before* any Express app handler / catch-all, so no amount of app-level guarding (try/catch around `decodeURIComponent`, route validation) prevents the dev crash. It is purely a dev-mode artifact of Vite's middleware stack.

**How to apply:**
- Do NOT treat this as a bug in app routing/prerender code, and do NOT modify `server/vite.ts` or the Vite config to "fix" it (also a project constraint).
- Production serving (`server/static.ts`, no Vite middleware) handles the same URL gracefully — `serve-static` returns 4xx, and app code still guards decoding.
- App-level decode guarding (a `safeDecode` that returns null on `URIError`) is still worth keeping for the production path and for correct 404s on unknown-but-valid slugs.
- When verifying routes, don't fire malformed-URI curls at the dev server — it will take the whole dev workflow down and report HTTP 000 on every subsequent request.
