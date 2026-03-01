# Platform Herziening Design — McDonald's Strategie

## Datum: 2026-03-01

## Doel
Het WebsiteAbonnementen platform vereenvoudigen naar een "McDonald's menu" aanpak: simpel, snel te begrijpen, meteen afrekenen. Geen overkill, focus op de kern.

## Structuur

### Publiek
- **Landingspagina**: Hero + pricing tiers + add-ons + FAQ + footer
- **Privacy & Terms**: Juridisch noodzakelijk

### Klant Dashboard (na login)
- Website status (Onboarding / Productie / Live)
- Actief abonnement info
- Add-ons beheer (toevoegen/bekijken)
- Facturen via Stripe portal
- Basisinstellingen

### Admin Dashboard (na login)
- Klantenlijst met abonnement en status
- Projectstatus updaten
- Basisstatistieken (aantal klanten, MRR)

## Pricing

| Tier | Prijs | Pagina's | Features |
|------|-------|----------|----------|
| Starter | €49/mo | 5 | Hosting, SSL, onderhoud, responsive, contactformulier |
| Professional | €99/mo | 10 | + SEO basis, 2 content updates/mo |
| Business | €199/mo | 20 | + 5 content updates/mo, prioriteit support |

## Add-ons (vaste prijzen, maandelijks)
- Google Ads beheer — €149/mo
- Meta Ads beheer — €149/mo
- SEO pakket — €99/mo
- Content creatie — €79/mo
- Cookie banner (ConsentEase) — €9/mo

## Verwijderd
- Specialist-portaal (hele sectie)
- Blog en blogbeheer
- Vergelijkingspagina's
- Uitgebreide onboarding wizard
- Template selectie/beheer
- Rapportages en KPI dashboards
- ClickUp integratie
- Complexe admin functies

## Technische aanpak
- Opschonen bestaande codebase (Aanpak A)
- Behoud: Express + React + TypeScript, Drizzle ORM, Stripe, Shadcn UI, i18n
- Vereenvoudigd database schema (geen specialist/blog/template tabellen)
- Schaalbaar fundament voor toekomstig freelancer-platform
