---
name: Subdomein-routing (app + admin)
description: Hoe de site gesplitst is over abonnement.website / app. / admin. en de dev-fallback werkt
---

- Publiek = abonnement.website, klantdashboard = app.*, admin = admin.*. Host-detectie in `server/subdomain.ts`; route-registries per site in `server/known-routes.ts`; client-kant in `client/src/lib/site.ts` + drie routers in App.tsx.
- **Dev heeft geen subdomeinen**: gebruik `?subdomain=app|admin|public` — dit zet/leest een `dev_subdomain` cookie (client én server). Curl-tests: eerst `/?subdomain=app` met cookie-jar, daarna paden zonder prefix.
- Paden zijn prefix-gestript, niet hernoemd (bewust: /billing, /customers, /clients/:id — niet de NL-slugs uit de prompt, die was gebaseerd op verouderde /dashboard-paden).
- Sessie-cookie `Domain=.abonnement.website` wordt per request gezet ná de session-middleware, alléén als de host onder het custom domein valt. **Why:** een statische domain-optie breekt logins op *.replit.app/preview-hosts (browser weigert de cookie).
- SEO-prerender + isKnownRoute alleen op de publieke site; app/admin krijgen noindex + robots Disallow. Public /login etc. 301't naar app-subdomein.
- **Publish-vereiste:** app. en admin. moeten als custom domains aan de deployment gekoppeld zijn, anders zijn cross-site links dood.
