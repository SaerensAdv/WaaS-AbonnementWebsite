# Replit Agent Prompt: ConsentEase Landingspagina

# Replit Agent Prompt: ConsentEase Landingspagina
**Doel:** kopieer alles onder de lijn naar Replit Agent (Design mode).
**Datum:** 9 augustus 2026
**Status:** klaar om uit te voeren
**Prioriteit:** na pricing rewrite

* * *
## Opdracht: Bouw een co-branded landingspagina /consentease
### Context
[Abonnement.website](http://Abonnement.website) bevat ConsentEase (cookie consent tool) gratis bij elk abonnement. We willen een dedicated landingspagina die dit uitlegt en de waarde benadrukt. De pagina is co-branded: [abonnement.website](http://abonnement.website) × ConsentEase.
### ROUTE
`/consentease` (nieuwe pagina, toevoegen aan router)
### DESIGN RICHTING
**Co-branded:** twee merkidentiteiten vloeien samen.
*   Basis: het bestaande dark theme van [abonnement.website](http://abonnement.website) (donkere achtergrond, dezelfde componenten, fonts en tokens)
*   ConsentEase accent: groen/teal als secundaire kleur die subtiel doorvloeit (#2D6A4F of equivalent in jullie kleurensysteem)
*   Bovenaan een co-brand moment: "[abonnement.website](http://abonnement.website) × ConsentEase" als twee labels naast elkaar
*   Geen volledig andere pagina; het moet voelen als onderdeel van de bestaande site, met een ConsentEase-twist

**Sfeer:** vertrouwenwekkend, simpel, niet technisch. De doelgroep is een kmo-eigenaar die niet weet wat GDPR precies inhoudt.
### STRUCTUUR
#### 1\. Hero
*   Co-brand labels: "[abonnement.website](http://abonnement.website)" en "ConsentEase" naast elkaar (met × of divider)
*   Headline: **"Cookie compliance? Geregeld."**
*   Subtitel: "Bij elk abonnement.website-plan zit ConsentEase inbegrepen. Geen extra kosten, geen extra gedoe. Jouw website is privacyproof vanaf dag één."
*   Badge/pill: "Inbegrepen bij je abonnement" met een groene dot/pulse animatie
*   Geen CTA button in hero (de CTA komt onderaan)
#### 2\. Features (2x2 grid)
Vier kaarten met icon + titel + korte beschrijving:

1. **Cookiebanner op maat** — "Past zich aan het design van je website aan. Geen lelijke standaardbanner, maar iets dat er hoort."
2. **Automatische cookie scan** — "Detecteert welke cookies je website plaatst en categoriseert ze automatisch. Geen handmatig uitzoekwerk."
3. **Google Consent Mode v2** — "Je Google Ads en Analytics blijven correct meten, ook als bezoekers cookies weigeren. Geen dataverlies."
4. **Privacy & cookie policy** — "Genereer een privacy- en cookiebeleid in je eigen taal. Altijd actueel, altijd beschikbaar op je website."

Icons: gebruik Phosphor icons (al in het project). Suggesties: PaintBrush, MagnifyingGlass, ChartBar, FileText.
#### 3\. "Waarom dit ertoe doet" sectie
*   Centered tekst: "Zonder correcte consent verlies je meetdata, riskeer je boetes tot €20 miljoen, en kom je onprofessioneel over bij bezoekers. Wij regelen dit voor je, standaard."
*   Drie stats eronder: "€0 Extra kosten" | "0 min Jouw tijd" | "100% Geconfigureerd"
#### 4\. "Hoe het werkt" (3 stappen, verticaal)
1. "Wij installeren alles" — "Bij het bouwen van je website configureren wij ConsentEase. Banner, scan, consent mode: alles staat klaar bij livegang."
2. "Jij vult je bedrijfsgegevens aan" — "In je dashboard vul je kort in welke data je verzamelt. Wij genereren je privacy- en cookiebeleid."
3. "Het blijft automatisch actueel" — "Bij elke wijziging scant ConsentEase opnieuw. Nieuwe cookies? Je wordt genotificeerd."
#### 5\. CTA (afsluiting)
*   Card met lichte gradient (groen/donker)
*   Tekst: "Zit bij elk plan. Geen extra stappen."
*   Subtekst: "Start je website-abonnement en ConsentEase is er gewoon."
*   Button: "Bekijk het abonnement →" linkt naar /#pricing
### TECHNISCHE VEREISTEN
*   Nieuwe pagina component: `client/src/pages/consentease.tsx`
*   Gebruik MarketingLayout (zelfde als home, offerte, etc.)
*   Gebruik bestaande UI componenten (Button, Badge, Card waar relevant)
*   Gebruik Phosphor icons (al geïnstalleerd)
*   Gebruik framer-motion voor entrance animations (ScrollReveal pattern uit home.tsx)
*   useSEO hook met:
    *   title: "ConsentEase Inbegrepen | Cookie Compliance Zonder Extra Kosten"
    *   description: "Bij elk abonnement.website-plan zit ConsentEase inbegrepen: cookiebanner, automatische scan, Google Consent Mode v2 en policy generator. Geen extra kosten."
    *   canonical: "/consentease"
*   Voeg de route toe aan App.tsx
*   Voeg een link toe in de footer navigatie (bij de bestaande links)
*   Responsive: mobile-first, grid collapset naar 1 kolom op small screens
*   Geen nieuwe dependencies, geen externe assets buiten wat al in het project zit
### WAT NIET MAG
*   Geen lichte/witte achtergrond (blijf in het dark theme)
*   Geen claims als "GDPR-proof", "100% compliant" of "gecertificeerd"
*   Geen pricing van ConsentEase zelf tonen (het is gratis voor de klant)
*   Geen link naar [consentease.io](http://consentease.io) (de klant hoeft daar niet naartoe)
*   Geen nieuwe fonts of externe CSS
### KWALITEITSCHECK
*   Pagina laadt zonder errors
*   Route /consentease werkt
*   Mobile layout ziet er goed uit (test op 375px breed)
*   Co-brand moment is zichtbaar bovenaan
*   ConsentEase groene accentkleur is subtiel aanwezig
*   CTA linkt correct naar /#pricing
*   SEO meta tags zijn correct ingevuld
*   Link in footer navigatie werkt