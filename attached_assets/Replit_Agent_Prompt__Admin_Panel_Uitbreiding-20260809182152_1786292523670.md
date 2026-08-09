# Replit Agent Prompt: Admin Panel Uitbreiding

# Replit Agent Prompt: Admin Panel Uitbreiding
**Doel:** kopieer alles onder de lijn naar Replit Agent.
**Datum:** 9 augustus 2026
**Status:** klaar om uit te voeren (na credits-feature prompt)
**Prioriteit:** hoog
**Afhankelijkheid:** de credits-feature (creditAllocations + changeRequests tabellen) moet EERST gebouwd zijn

* * *
## Opdracht: Bouw het admin panel uit met wijzigingsbeheer, klantdetail en credit-overzicht
### Context
Het admin panel heeft momenteel 3 pagina's: Dashboard (metrics), Klanten (tabel), Projectbeheer (ClickUp sync). Het nieuwe pricing model draait op credits: klanten vragen wijzigingen aan via hun dashboard, en de admin moet deze verzoeken kunnen beheren. Het admin panel moet uitgebreid worden tot een volledig operationeel beheerpunt.
### HUIDIGE STRUCTUUR
Sidebar "Admin Menu":
*   Dashboard
*   Klanten
*   Projectbeheer
### NIEUWE STRUCTUUR
Sidebar "Admin Menu":
*   Dashboard (uitbreiden)
*   **Wijzigingen** (NIEUW, prioriteit #1)
*   Klanten (uitbreiden met detail-pagina)
*   **Offertes** (NIEUW)
*   Projectbeheer (bestaand, ongewijzigd)

* * *
### 1\. Wijzigingen-pagina (NIEUW): /admin/changes
De kern van het dagelijks beheer. Hier zie je alle wijzigingsverzoeken van alle klanten.

**Layout: tabel/lijst met filters**

**Kolommen:**
*   Klant (naam + avatar)
*   Titel van het verzoek
*   Aangevraagd op (datum)
*   Status (badge: Aangevraagd, In behandeling, Afgerond, Afgewezen)
*   Type (Inbegrepen / Extra credit)
*   Acties

**Filters bovenaan:**
*   Status filter: Alle / Aangevraagd / In behandeling / Afgerond / Afgewezen
*   Default view: "Aangevraagd" (pending requests eerst)

**Acties per request (via dropdown of knoppen):**
*   "Start" → status naar "in\_progress"
*   "Afronden" → status naar "completed", completedAt = now
*   "Afwijzen" → status naar "rejected" (met optioneel notitieveld)
*   "Bekijk details" → opent detail-view

**Detail-view (klikken op een request):**
*   Alle info: titel, beschrijving, klant, datum, status, credits used, type
*   Admin notities veld (textarea, opslaan)
*   Status-wijzig knoppen
*   Link naar klantprofiel

**Stats bovenaan de pagina (4 cards):**
*   Openstaand (pending count)
*   In behandeling (in\_progress count)
*   Afgerond deze maand
*   Totaal credits gebruikt deze maand

**API endpoints nodig:**
*   GET /api/admin/changes (alle requests, filterable op status, gesorteerd op datum)
*   PATCH /api/admin/changes/:id (status update + adminNotes)

* * *
### 2\. Klant-detailpagina (NIEUW): /admin/clients/:id
Klikken op een klant in de klantentabel opent een detailpagina.

**Secties:**

**Header:**
*   Klantnaam, email, bedrijfsnaam
*   Status badge (Live / Onboarding / Inactive)
*   Lid sinds datum

**Abonnement-info:**
*   Plan naam + prijs
*   Billing status (Actief / Past due)
*   Stripe link ("Bekijk in Stripe" knop)
*   Actieve add-ons lijst

**Credits deze maand:**
*   Included: 2
*   Bonus: 0
*   Gebruikt: X
*   Resterend: Y
*   Knop: "Bonus credit toekennen" (voegt 1 toe aan bonus)

**Wijzigingsgeschiedenis:**
*   Laatste 10 requests van deze klant (titel, datum, status)
*   Link naar volledige lijst

**Project-info:**
*   Website URL
*   Project status
*   Onboarding status
*   Domain

**Notities (nieuw veld):**
*   Vrij tekstveld voor interne notities over deze klant
*   Opslaan knop

**API endpoints nodig:**
*   GET /api/admin/clients/:id (volledige klantinfo incl. credits, requests, subscription, project)
*   POST /api/admin/clients/:id/bonus-credit (voegt 1 bonus credit toe aan huidige maand)
*   PATCH /api/admin/clients/:id/notes (update interne notities)

**Database wijziging:**
*   Voeg `adminNotes` text field toe aan de `customerProfiles` tabel (of een aparte tabel als je dat cleaner vindt)

* * *
### 3\. Offertes-pagina (NIEUW): /admin/quotes
Tabel van alle offerte-aanvragen (quoteRequests uit de database).

**Kolommen:**
*   Bedrijfsnaam
*   Contactpersoon
*   Type project
*   Budget
*   Status (badge: Nieuw, Gecontacteerd, Offerte verstuurd, Geaccepteerd, Afgewezen)
*   Datum
*   Acties

**Acties:**
*   Status wijzigen (dropdown)
*   Detail bekijken (alle formulierdata tonen)
*   ClickUp task aanmaken (als clickupTaskId leeg is)

**Detail-view:**
*   Alle ingevulde velden uit het offerteformulier netjes weergegeven
*   Stijlvoorkeur, gewenste functies, talen, budget, beschrijving, etc.
*   Status-wijzig dropdown
*   Interne notities

**Stats bovenaan:**
*   Nieuw (onbehandeld)
*   Totaal deze maand
*   Conversie (geaccepteerd / totaal)

**API endpoints nodig:**
*   GET /api/admin/quotes (alle quote requests, filterable op status)
*   PATCH /api/admin/quotes/:id (status update)

Deze endpoints bestaan mogelijk al deels. Check server/routes.ts voor bestaande quote-request routes en bouw hierop voort.

* * *
### 4\. Dashboard uitbreiden: /admin
**Huidige metrics behouden** (Klanten, Projecten, Abonnementen, MRR) maar toevoegen:

**Nieuwe cards:**
*   **Open wijzigingen:** count van pending changeRequests. Klikbaar naar /admin/changes.
*   **Nieuwe offertes:** count van quoteRequests met status "NEW". Klikbaar naar /admin/quotes.

**"Recent" sectie onder de metrics:**
*   Laatste 5 wijzigingsverzoeken (titel + klant + status + datum)
*   Laatste 3 offerte-aanvragen (bedrijf + type + datum)

Dit geeft je in één oogopslag: hoeveel werk ligt er, wat is urgent?

* * *
### 5\. Klantentabel uitbreiden
Voeg kolommen toe aan de bestaande klantentabel:
*   **Credits** (X/2 deze maand)
*   **Add-ons** (aantal actieve add-ons)

Maak de klantnaam klikbaar → navigeert naar /admin/clients/:id

* * *
### TECHNISCHE VEREISTEN
*   Nieuwe pagina's:
    *   `client/src/pages/admin/changes.tsx`
    *   `client/src/pages/admin/client-detail.tsx`
    *   `client/src/pages/admin/quotes.tsx`
*   Update: `client/src/pages/admin/` (dashboard en klanten pagina's)
*   Voeg routes toe in de admin router
*   Voeg sidebar items toe: "Wijzigingen" (met badge count voor pending) en "Offertes"
*   Alle admin endpoints moeten ADMIN role checken
*   Gebruik bestaande UI componenten
*   Phosphor icons voor sidebar items: NotePencil (Wijzigingen), FileText (Offertes)
### WAT NIET MAG VERANDEREN
*   Klant-dashboard (client/src/pages/dashboard/) ongewijzigd
*   Auth flow ongewijzigd
*   Publieke marketing site ongewijzigd
*   ClickUp integratie in Projectbeheer ongewijzigd
*   Bestaande API endpoints behouden backward compatibility
### KWALITEITSCHECK
*   /admin/changes toont alle wijzigingsverzoeken
*   Status wijzigen werkt (pending → in\_progress → completed)
*   /admin/clients/:id toont volledige klantinfo met credits
*   Bonus credit toekennen werkt
*   /admin/quotes toont offerte-aanvragen
*   Dashboard toont open wijzigingen + nieuwe offertes count
*   Sidebar badges tonen correct (pending count)
*   Mobile responsive (admin wordt voornamelijk desktop gebruikt, maar mag niet breken op tablet)
*   Alle admin routes zijn beveiligd (ADMIN role check)