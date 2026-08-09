# Replit Agent Prompt: Credits Feature Dashboard

# Replit Agent Prompt: Credits Feature Dashboard
**Doel:** kopieer alles onder de lijn naar Replit Agent.
**Datum:** 9 augustus 2026
**Status:** klaar om uit te voeren
**Prioriteit:** hoog (core feature voor lancering)

* * *
## Opdracht: Bouw het creditsysteem in het klantdashboard
### Context
Het nieuwe pricing model geeft elke klant 2 wijzigingscredits per maand. 1 credit = 1 wijzigingsverzoek (tekst, afbeelding, kleine layout-update). Extra credits kosten €29/stuk. Het dashboard heeft momenteel GEEN credit-functionaliteit. Dit is de kern van het product: de klant moet via het dashboard wijzigingen kunnen aanvragen en hun credits kunnen zien.
### WAT ER GEBOUWD MOET WORDEN
#### 1\. Database: nieuwe tabellen
Voeg toe aan `shared/schema.ts`:

```typescript
// Credit allocations per maand
export const creditAllocations = pgTable("credit_allocations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  periodStart: timestamp("period_start").notNull(), // eerste dag van de maand
  periodEnd: timestamp("period_end").notNull(), // laatste dag van de maand
  includedCredits: integer("included_credits").notNull().default(2),
  bonusCredits: integer("bonus_credits").default(0), // voor promoties of compensatie
  createdAt: timestamp("created_at").defaultNow(),
});

// Wijzigingsverzoeken (credit usage)
export const changeRequests = pgTable("change_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  allocationId: varchar("allocation_id").references(() => creditAllocations.id),
  title: text("title").notNull(), // korte beschrijving
  description: text("description"), // details
  creditsUsed: integer("credits_used").notNull().default(1),
  isPaidExtra: boolean("is_paid_extra").default(false), // true als het een extra credit is (€29)
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, rejected
  adminNotes: text("admin_notes"), // interne notities
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

Maak een migratie aan voor deze tabellen.
#### 2\. Server: API endpoints
Voeg toe aan `server/routes.ts` (of een nieuw bestand `server/credit-routes.ts`):

**GET /api/credits** (authenticated)
Returns het credit-overzicht voor de ingelogde user:

```json
{
  "period": { "start": "2026-08-01", "end": "2026-08-31" },
  "included": 2,
  "bonus": 0,
  "used": 1,
  "remaining": 1,
  "extraCreditPrice": 2900
}
```

Logica:
*   Check of er een `creditAllocation` bestaat voor de huidige maand. Zo niet, maak er een aan (2 included, 0 bonus).
*   `used` = count van changeRequests voor deze allocation waar status != "rejected"
*   `remaining` = included + bonus - used

**GET /api/credits/history** (authenticated)
Returns alle changeRequests voor deze user, gesorteerd op datum (nieuwste eerst). Paginatie optioneel.

**POST /api/credits/request** (authenticated)
Maakt een nieuw wijzigingsverzoek aan:

```json
{
  "title": "Openingsuren aanpassen",
  "description": "Maandag moet 9:00-17:00 worden ipv 8:00-16:00"
}
```

Logica:
*   Check of de user credits heeft (remaining > 0). Zo niet: return error met boodschap "Geen credits meer deze maand. Extra credits kosten €29/stuk."
*   Als remaining > 0: maak changeRequest aan met creditsUsed=1, isPaidExtra=false, status="pending"
*   Return de aangemaakte request

**POST /api/credits/request-extra** (authenticated)
Maakt een verzoek aan dat als extra credit (€29) wordt gefactureerd:
*   Maak changeRequest aan met isPaidExtra=true, status="pending"
*   Facturatie: voor nu handmatig (admin factureert later). Later optioneel: Stripe invoice item aanmaken.

**PATCH /api/credits/request/:id** (admin only)
Update status van een request (in\_progress, completed, rejected). Admin-only.
#### 3\. Klantdashboard: nieuwe sectie "Wijzigingen"
Voeg een nieuw menu-item toe in de sidebar: **"Wijzigingen"** (tussen "Add-ons" en "Support"). Icoon: `PencilSimple` of `NotePencil` (Phosphor).

**Pagina: /dashboard/changes**

Structuur:

**Bovenaan: Credit-status kaart**
*   "Wijzigingscredits deze maand"
*   Visueel: een progress bar of cirkel die toont 1/2 gebruikt (of 0/2, 2/2)
*   Tekst: "1 van 2 credits gebruikt" of "2 credits beschikbaar"
*   Periode: "Augustus 2026"
*   Subtekst: "Credits vervallen aan het einde van de maand"
*   Als 0 remaining: toon knop "Extra credit kopen (€29)"

**Midden: "Nieuwe wijziging aanvragen" formulier**
*   Altijd zichtbaar (niet achter een modal)
*   Velden:
    *   Titel \* (text input, placeholder: "Wat wilt u wijzigen?")
    *   Beschrijving (textarea, placeholder: "Geef zoveel detail als mogelijk. Welke pagina? Welke tekst/afbeelding? Wat moet het worden?")
*   Submit knop: "Wijziging aanvragen" (disabled als geen credits remaining EN niet isPaidExtra)
*   Als geen credits: toon "Geen credits meer deze maand" met knop "Aanvragen als extra credit (€29)"
*   Na submit: success message + request verschijnt in de lijst eronder

**Onder: "Mijn wijzigingen" lijst**
*   Alle requests voor deze user, nieuwste eerst
*   Per request tonen:
    *   Titel
    *   Datum aangevraagd
    *   Status badge: Aangevraagd (geel), In behandeling (blauw), Afgerond (groen), Afgewezen (rood)
    *   "Extra credit" badge als isPaidExtra=true
*   Empty state: "Nog geen wijzigingen aangevraagd. Gebruik je credits om teksten, afbeeldingen of kleine aanpassingen te laten doen."
#### 4\. Dashboard home: credit widget
Op de dashboard homepage (het overzichtsscherm), voeg een credit-widget toe naast de bestaande cards (Website Status, Abonnement, Actieve Add-ons):
*   Titel: "Credits"
*   Waarde: "1/2 beschikbaar" of "2/2 beschikbaar"
*   Link: "Wijziging aanvragen →" naar /dashboard/changes
*   Icoon: PencilSimple
#### 5\. Dashboard home: fix plan display
Het overzichtsscherm toont momenteel de plan tier-naam ("Starter"). Dit moet de plan name uit de database tonen. Bij het nieuwe plan is dat "Website-abonnement". Zorg dat:
*   De "Abonnement" card toont: [plan.name](http://plan.name) + "€" + (plan.monthlyPriceCents / 100) + "/mo"
*   Niet de tier-enum (LOW/MEDIUM/HIGH) als label
#### 6\. Facturatie FAQ update
Op de facturatie-pagina staat:
*   "Hoe kan ik mijn abonnement upgraden?" → Vervang met: "Hoe kan ik add-ons toevoegen?" met antwoord: "Ga naar Add-ons in het menu en klik op Toevoegen bij de dienst die u wilt activeren."
### TECHNISCHE VEREISTEN
*   Nieuwe pagina: `client/src/pages/dashboard/changes.tsx`
*   Voeg route toe in de dashboard router
*   Voeg "Wijzigingen" toe aan de sidebar navigatie (tussen Add-ons en Support)
*   Gebruik bestaande UI componenten (Card, Button, Badge, Input, Textarea, Form)
*   Gebruik Phosphor icons
*   Credit-status API moet lazy allocations aanmaken (als er geen allocation is voor deze maand, maak er een)
*   Migratie moet safe zijn (additive only, geen bestaande tabellen wijzigen)
### WAT NIET MAG VERANDEREN
*   Bestaande dashboard pagina's (analytics, add-ons, support, instellingen) blijven ongewijzigd
*   Auth flow blijft ongewijzigd
*   Bestaande API endpoints blijven werken
*   Geen wijzigingen aan de publieke marketing site
### KWALITEITSCHECK
*   /dashboard/changes route werkt
*   Credit-status toont correct (2 beschikbaar bij een verse maand)
*   Wijziging aanvragen werkt (form submit → request in lijst)
*   Status badges tonen correct
*   Bij 0 credits: formulier toont "extra credit" optie
*   Dashboard home toont credit widget
*   Dashboard home toont "Website-abonnement" ipv "Starter"
*   Sidebar toont "Wijzigingen" als menu-item
*   Mobile responsive
*   Migratie draait zonder errors