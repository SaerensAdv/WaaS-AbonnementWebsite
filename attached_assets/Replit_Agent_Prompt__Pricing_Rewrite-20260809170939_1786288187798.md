# Replit Agent Prompt: Pricing Rewrite

# Replit Agent Prompt: Pricing Model Rewrite
**Doel:** kopieer alles onder de lijn naar Replit Agent.
**Datum:** 9 augustus 2026
**Status:** klaar om uit te voeren

* * *
## Opdracht: Pricing model volledig herwerken naar single-plan + credits + add-ons
### Context
De app toont momenteel 3 plans (Starter €49, Professional €99, Business €199) met een tier-gebaseerd keuzemodel. Dit wordt vervangen door één enkel plan met een creditsysteem en modulaire add-ons.
### NIEUW MODEL (definitief)
**Base plan:**
*   Naam: "Website-abonnement"
*   Prijs: €69/maand
*   Facturatie: kwartaal vooraf (€207 per kwartaal)
*   Minimum: 6 maanden (2 kwartalen)
*   Scope: website op maat (tot 5 pagina’s), responsive ontwerp, hosting, SSL, technisch onderhoud, ConsentEase inbegrepen
*   Credits: 2 wijzigingscredits per maand inbegrepen
*   Extra credits: €29/stuk
*   Support: via e-mail

**Add-ons (herziene prijzen):**

| slug | name | monthlyPriceCents | description |
| ---| ---| ---| --- |
| google-ads | Google Ads Beheer | 34900 | Campagnes, zoektermen, optimalisatie en maandrapportage. 3u beheer/maand. Min fee €349 of 12% van ad spend. Excl. advertentiebudget. |
| google-ads-ecommerce | Google Ads + Shopping | 44900 | Search + Merchant Center, productfeed en Shopping campagnes. 4u beheer/maand. Min fee €449 of 12% van ad spend. Excl. advertentiebudget. |
| meta-ads | Meta Ads Beheer | 34900 | Facebook en Instagram campagnes, doelgroepen, Pixel/CAPI en maandrapportage. 3u beheer/maand. Min fee €349 of 12% van ad spend. Excl. advertentiebudget. |
| seo | SEO Optimalisatie | 34900 | On-page optimalisatie, technische monitoring en kwartaalrapport. 2u/maand. |
| local-seo | Lokale SEO | 19900 | Google Business Profile optimalisatie, maandelijkse check en review-monitoring. 1u/maand. |
| social-media | Social Media Beheer | 39900 | 6 posts/maand op 2 kanalen, contentplanning en basis community management. 4u/maand. |
| ecommerce | E-commerce Module | 9900 | Webshop tot 50 producten met Stripe/Mollie. Eenmalige setup €199. |
| booking | Booking / Reserveringssysteem | 4900 | Online boekingssysteem met kalender, bevestigingsmails en klant-zelf-boeken widget. Max 3 diensten. Eenmalige setup €99. |
| extra-pages | Extra Pagina’s | 1500 | Per bijkomende pagina boven de 5. Eenmalige bouw €149, daarna €15/maand onderhoud inbegrepen. |

**VERWIJDER:** de add-on "extra-content-bundle" (slug: extra-content-bundle). Dit wordt vervangen door het creditsysteem.
### WAT ER MOET GEBEUREN
#### 1\. Database: plans table
*   Deactiveer de 3 bestaande plans (isActive = false), NIET verwijderen (behoudt referential integrity)
*   Voeg 1 nieuw plan toe:
    *   name: "Website-abonnement"
    *   tier: "MEDIUM" (hergebruik bestaande enum, doet er niet meer toe)
    *   monthlyPriceCents: 6900
    *   includedPages: 5
    *   features: \["Website op maat (tot 5 pagina's)", "Responsive ontwerp", "Hosting, SSL en onderhoud", "ConsentEase inbegrepen", "2 wijzigingscredits per maand", "Support via e-mail"\]
    *   isActive: true
    *   stripePriceId en stripeQuarterlyPriceId: maak nieuwe Stripe Prices aan (zie punt 4)
#### 2\. server/addonCatalog.ts
*   Update alle prijzen en descriptions volgens de tabel hierboven
*   Voeg "extra-pages" toe als nieuwe add-on
*   Verwijder "extra-content-bundle" uit de CATALOG array (de deactivatie-logica handelt de DB af)
*   Spend-percentage tekst updaten van "10%" naar "12%"
*   Nieuwe Stripe Price objects moeten aangemaakt worden voor gewijzigde prijzen (test mode). De live Price IDs blijven voorlopig ongewijzigd tot handmatige live-activatie.
#### 3\. Homepage (client/src/pages/home.tsx): VOLLEDIGE REWRITE van pricing sectie
De homepage moet het nieuwe model tonen. De structuur wordt:

**Hero:**
*   "Professionele website op abonnement."
*   "Vanaf €69/mnd" (was €49)
*   Eén prominente CTA, geen 3 plan-kaarten in de hero
*   Trust badges: "Geen opstartkosten", "6 maanden minimum", "Inclusief SSL & hosting"

**Pricing sectie (#pricing):**
*   Eén grote plan-kaart (donker/prominent) met: €69/maand, kwartaal vooraf, de 6 features, CTA "Start je website"
*   Credits uitleg eronder: "2 wijzigingscredits per maand inbegrepen. 1 credit = 1 wijziging. Extra credits: €29/stuk."
*   Hoe het werkt: 3 stappen (Intake → Live in 2 weken → Blijft actueel)

**Add-ons sectie (#addons):**
*   Grid van add-on kaarten (zoals nu, maar met nieuwe prijzen)
*   "Iets anders nodig?" kaart die naar /offerte linkt

**Maatwerk sectie (#maatwerk):**
*   Kan grotendeels blijven zoals het is
*   Verwijder referenties naar "Business plan" of "alles in Business, plus"

**FAQ:**
*   Update "Kan ik later upgraden of downgraden?" naar: "Je kunt op elk moment add-ons toevoegen of verwijderen. Er is één plan; de keuze zit in welke add-ons je activeert."
*   Update "Wat zit er allemaal in het abonnement?" met vermelding van het creditsysteem
*   Update prijs-referenties van €49 naar €69

**CTA sectie:**
*   "Vanaf €69/maand" (niet €49)

**Verwijder:**
*   De hele tier-selectie logica (tierConfig, HeroInteractiveCards met 3 kaarten, HeroPricingCard component)
*   De "Kies het plan dat bij u past" kop en multi-plan grid
*   Het "Op Maat" plan-kaart uit de pricing grid (wordt de maatwerk-sectie)
*   Het concept van LOW/MEDIUM/HIGH tier labels in de UI

**Behoud:**
*   MarketingLayout, useSEO, LeadPopup, FAQ component, ScrollReveal
*   De add-ons grid structuur (update alleen data)
*   De maatwerk sectie (update tekst)
*   De "hoe het werkt" flow
*   Alle animaties en motion components
*   De sticky mobile CTA
*   [Schema.org](http://Schema.org) FAQ structured data (update content)
#### 4\. Stripe (test mode)
*   Maak een nieuw Product "Website-abonnement" aan (of hergebruik bestaand product)
*   Maak 2 nieuwe Prices:
    *   Monthly: €69/maand recurring
    *   Quarterly: €207 per 3 maanden recurring (interval: every 3 months)
*   Update test-mode Price IDs voor alle gewijzigde add-ons
*   Verwijder GEEN bestaande Prices (ze worden alleen niet meer gebruikt)
#### 5\. Checkout flow
*   De checkout moet het nieuwe plan gebruiken
*   Verwijder plan-selectie stap als die er is (er is maar 1 plan)
*   Signup flow: user → signup → checkout met het éne plan → onboarding
*   Kwartaalbilling als default (quarterly Price)
#### 6\. SEO metadata
*   useSEO title: "Website Abonnement €69/maand | Professionele Websites op Abonnement"
*   description: "Professionele website als maandabonnement: €69/maand inclusief design, hosting, onderhoud en 2 wijzigingscredits. Voor starters en zelfstandigen in België en Nederland."
### WAT NIET MAG VERANDEREN
*   Auth systeem (login, signup, sessions, password reset)
*   Dashboard functionaliteit
*   Admin panel
*   Database schema structuur (alleen data wijzigt, geen column changes)
*   Webhook handlers
*   ClickUp integratie
*   Blog functionaliteit
*   Analytics integratie
*   Offerte pagina
*   Email systeem
### VOLGORDE
1. Update addonCatalog.ts (prijzen + nieuwe add-on + verwijder bundle)
2. Seed/sync het nieuwe plan in de database
3. Maak Stripe test-mode Prices aan
4. Rewrite homepage
5. Update checkout flow voor single-plan
6. Test: signup → checkout → dashboard flow moet werken
### KWALITEITSCHECK
*   Geen referenties naar €49, €99 of €199 meer op de publieke site
*   Geen "Starter", "Professional", "Business" labels meer in de UI
*   Het woord "credits" moet op de pricing pagina staan
*   "Kwartaal vooraf" en "6 maanden minimum" moeten zichtbaar zijn
*   Alle add-on prijzen moeten de nieuwe bedragen tonen
*   De checkout moet werken met het nieuwe plan