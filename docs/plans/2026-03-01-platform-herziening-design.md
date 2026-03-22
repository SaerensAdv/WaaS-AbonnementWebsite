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
| Starter | €49/mo | 5 | Design, hosting, SSL, basis SEO, 1 content wijziging/mnd, cookie banner inbegrepen |
| Professional | €99/mo | 10 | + Geavanceerde SEO, Analytics, Google Maps, beeldbank, 3 content wijzigingen/mnd |
| Business | €199/mo | 20 | + Blog, meertalig, geavanceerde formulieren, rapport, 5 content wijzigingen/mnd, dedicated accountmanager |

## Add-ons (vaste prijzen, maandelijks)
- Google Ads beheer — €249/mo (3u beheer + 1u rapportage)
- Meta Ads beheer — €249/mo (3u beheer + 1u rapportage)
- Extra Content Wijzigingen — €29/mo (5 extra/mnd)
- E-commerce Module — €79/mo (webshop tot 50 producten)
- Social Media Beheer — €199/mo (8 posts/mnd op 2 platforms)
- Booking / Reserveringssysteem — €39/mo

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
