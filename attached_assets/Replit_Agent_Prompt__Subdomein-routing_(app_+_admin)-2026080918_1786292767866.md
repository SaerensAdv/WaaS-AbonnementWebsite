# Replit Agent Prompt: Subdomein-routing (app + admin)

# Replit Agent Prompt: Subdomein-routing (app + admin)
**Doel:** kopieer alles onder de lijn naar Replit Agent.
**Datum:** 9 augustus 2026
**Status:** klaar om uit te voeren (na admin panel uitbreiding)
**Prioriteit:** hoog (architectuurwijziging)

* * *
## Opdracht: Verplaats klantdashboard en admin naar subdomeinen
### Context
De app draait momenteel alles op één domein ([abonnement.website](http://abonnement.website)) met path-based routing:
*   / = publieke marketing site
*   /dashboard/\* = klantdashboard
*   /admin/\* = admin panel
*   /signup, /login = auth

Dit moet veranderen naar subdomein-based routing:
*   [**abonnement.website**](http://abonnement.website) = publieke marketing site (pricing, werkwijze, consentease, offerte, blog)
*   [**app.abonnement.website**](http://app.abonnement.website) = klantdashboard
*   [**admin.abonnement.website**](http://admin.abonnement.website) = admin panel
### WAAROM
*   Schonere scheiding tussen publiek, klant en admin
*   Subdomeinen zijn al geclaimed (DNS records staan klaar)
*   Schaalbaarder: later kunnen app en admin apart gedeployed worden indien nodig
*   Professioneler: klant logt in op [app.abonnement.website](http://app.abonnement.website), niet op [abonnement.website/dashboard](http://abonnement.website/dashboard)
### WAT ER MOET GEBEUREN
#### 1\. Host-based routing in de server
In `server/index.ts` of `server/routes.ts`, implementeer host-detection:

```typescript
// Pseudocode voor de routing logica
function getSubdomain(hostname: string): string | null {
  // Productie: check voor app.abonnement.website of admin.abonnement.website
  // Development: check voor app.localhost of admin.localhost (of gebruik query param ?subdomain=app)
  const parts = hostname.split('.');
  if (parts.length >= 3) {
    const sub = parts[0];
    if (sub === 'app' || sub === 'admin') return sub;
  }
  return null; // = publieke site
}
```

De server moet op basis van het subdomein beslissen welke frontend te serveren:
*   Geen subdomein (of www) → publieke marketing site
*   `app` subdomein → klantdashboard app
*   `admin` subdomein → admin panel app
#### 2\. Frontend routing aanpassen
De React app moet detecteren op welk subdomein die draait en de juiste routes tonen:

[**app.abonnement.website**](http://app.abonnement.website)**:**
*   / = dashboard home (was /dashboard)
*   /analytics (was /dashboard/analytics)
*   /add-ons (was /dashboard/add-ons)
*   /changes (was /dashboard/changes) \[nieuw van credits-feature\]
*   /support (was /dashboard/support)
*   /facturatie (was /dashboard/facturatie)
*   /instellingen (was /dashboard/instellingen)
*   /login = klant login
*   /signup = klant signup

[**admin.abonnement.website**](http://admin.abonnement.website)**:**
*   / = admin dashboard home (was /admin)
*   /changes (was /admin/changes)
*   /klanten (was /admin/klanten)
*   /klanten/:id (was /admin/clients/:id)
*   /offertes (was /admin/quotes)
*   /projectbeheer (was /admin/projectbeheer)
*   /login = admin login

[**abonnement.website**](http://abonnement.website) **(publiek):**
*   / = homepage
*   /werkwijze
*   /consentease
*   /offerte
*   /blog/\*
*   /privacy
*   /terms
*   /betaalbare-website
*   /checkout-success
#### 3\. Auth aanpassen
*   Login/signup op [app.abonnement.website](http://app.abonnement.website) = klant auth (role: CUSTOMER)
*   Login op [admin.abonnement.website](http://admin.abonnement.website) = admin auth (role: ADMIN)
*   De publieke site heeft geen auth (behalve /checkout-success die redirect naar app.\*)
*   Session cookies moeten werken across subdomeinen: set cookie domain to `.abonnement.website` (met de dot prefix) zodat de cookie geldig is op alle subdomeinen

**Cookie domain instelling:**

```typescript
// In session/cookie config:
const cookieOptions = {
  domain: process.env.NODE_ENV === 'production' ? '.abonnement.website' : undefined,
  // ... rest van de cookie opties
};
```

#### 4\. Redirects
*   Bezoeker op [abonnement.website/dashboard](http://abonnement.website/dashboard) → redirect 301 naar [app.abonnement.website/](http://app.abonnement.website/)
*   Bezoeker op [abonnement.website/admin](http://abonnement.website/admin) → redirect 301 naar [admin.abonnement.website/](http://admin.abonnement.website/)
*   Bezoeker op [app.abonnement.website](http://app.abonnement.website) zonder auth → redirect naar [app.abonnement.website/login](http://app.abonnement.website/login)
*   Bezoeker op [admin.abonnement.website](http://admin.abonnement.website) zonder ADMIN role → redirect naar [admin.abonnement.website/login](http://admin.abonnement.website/login)
*   Na succesvolle checkout op [abonnement.website](http://abonnement.website) → redirect naar [app.abonnement.website/](http://app.abonnement.website/) (niet /dashboard)
#### 5\. Links updaten
Alle interne links die naar /dashboard of /admin verwijzen moeten bijgewerkt worden:
*   Marketing site CTA's die naar signup/login gaan: `https://app.abonnement.website/signup`
*   "Abonnement beheren" links in facturatie: relatief (want je bent al op app.\*)
*   Admin links in ClickUp-integratie: update naar [admin.abonnement.website](http://admin.abonnement.website)
*   Checkout success redirect: naar [app.abonnement.website](http://app.abonnement.website)
#### 6\. Development mode
Voor lokale development (Replit) waar subdomeinen niet standaard werken:

**Optie A (aanbevolen):** gebruik een query parameter als fallback:
*   localhost:5000?subdomain=app → behandel als app subdomein
*   localhost:5000?subdomain=admin → behandel als admin subdomein
*   localhost:5000 (geen param) → publieke site

**Optie B:** gebruik port-based routing in development:
*   :5000 = publiek
*   :5001 = app
*   :5002 = admin

Optie A is simpeler en vereist geen multi-port setup.
#### 7\. Replit deployment
Replit custom domains ondersteunen subdomeinen. De DNS records staan al klaar (CNAME naar Replit). De Replit deployment moet alle drie de subdomeinen accepteren op dezelfde app, en de server-side routing handelt de rest.

In `.replit` of deployment config: zorg dat alle subdomeinen naar dezelfde Replit app wijzen. De host-detection in de server doet de routing.
### WAT NIET MAG VERANDEREN
*   Alle bestaande functionaliteit blijft werken
*   API endpoints (/api/\*) moeten beschikbaar zijn op alle subdomeinen
*   Stripe webhooks (/api/webhooks/stripe) moeten blijven werken
*   De ClickUp integratie moet blijven werken
*   Bestaande Stripe checkout URLs mogen niet breken
### MIGRATIE-AANPAK
1. Implementeer host-detection in de server (met fallback voor development)
2. Pas de cookie domain aan voor cross-subdomein sessies
3. Splits de frontend routing op basis van gedetecteerd subdomein
4. Voeg redirects toe van oude /dashboard en /admin paths
5. Update alle hardcoded interne links
6. Test: publieke site werkt op [abonnement.website](http://abonnement.website)
7. Test: klantdashboard werkt op [app.abonnement.website](http://app.abonnement.website)
8. Test: admin werkt op [admin.abonnement.website](http://admin.abonnement.website)
9. Test: login/sessie werkt cross-subdomein
10. Test: checkout flow eindigt op app.\*
### KWALITEITSCHECK
*   [abonnement.website](http://abonnement.website) toont de publieke marketing site
*   [app.abonnement.website](http://app.abonnement.website) toont het klantdashboard (of login als niet geauth)
*   [admin.abonnement.website](http://admin.abonnement.website) toont het admin panel (of login als niet ADMIN)
*   [abonnement.website/dashboard](http://abonnement.website/dashboard) redirect 301 naar [app.abonnement.website](http://app.abonnement.website)
*   [abonnement.website/admin](http://abonnement.website/admin) redirect 301 naar [admin.abonnement.website](http://admin.abonnement.website)
*   Inloggen op app.\* als klant werkt
*   Inloggen op admin.\* als admin werkt
*   Session cookie werkt op alle subdomeinen (eenmaal inloggen = overal ingelogd)
*   API calls werken vanaf elk subdomein
*   Stripe webhooks blijven functioneren
*   Checkout success redirect gaat naar app.\*
*   Development mode werkt via ?subdomain= parameter
*   Geen broken links op de publieke site
*   Geen broken links in het dashboard
*   Mobile werkt op alle subdomeinen