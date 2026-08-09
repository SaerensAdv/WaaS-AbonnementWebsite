# Replit Agent Prompt: Offerteformulier Alignment

# Replit Agent Prompt: Offerteformulier Alignment
**Doel:** kopieer alles onder de lijn naar Replit Agent.
**Datum:** 9 augustus 2026
**Status:** klaar om uit te voeren (na pricing rewrite)
**Prioriteit:** laag, niet blokkerend voor launch

* * *
## Opdracht: Offerteformulier (/offerte) alignen met nieuw pricing model
### Context
Het offerteformulier in client/src/pages/offerte.tsx is een 4-staps wizard voor maatwerkoffertes. Het pricing model is gewijzigd naar één plan (€69/mo) + credits + add-ons. Het formulier bevat enkele verouderde referenties en keuzes die niet meer kloppen.

Dit zijn kleine, gerichte wijzigingen. Geen volledige rewrite.
### WIJZIGINGEN
#### 1\. Stap 2: "Geschat aantal pagina's" (estimatedPages)
Huidige opties:

```plain
"1-5", "5-10", "10-20", "20+", "unknown"
```

Nieuwe opties + label:
*   Label wijzigen van "Geschat aantal pagina's" naar "Hoeveel pagina's denkt u nodig te hebben?"
*   Opties:

```typescript
<SelectItem value="1-5">1 – 5 pagina’s (standaard abonnement)</SelectItem>
<SelectItem value="6-10">6 – 10 pagina’s</SelectItem>
<SelectItem value="10+">10+ pagina’s</SelectItem>
<SelectItem value="unknown">Weet ik nog niet</SelectItem>
```

#### 2\. Stap 2: Feature checkboxes groeperen
Huidige situatie: alle 16 features in één platte grid.

Nieuwe situatie: splits in twee groepen met een visueel label:

**Groep 1: "Website functies"**
*   Contactformulier
*   Blog / nieuwssectie
*   Foto- / videogalerij
*   Reviews / testimonials
*   Google Maps
*   Meertalig

**Groep 2: "Uitbreidingen & integraties"**
*   Webshop / producten
*   Boekingssysteem
*   Online betalingen (iDEAL, Bancontact)
*   Gebruikersaccounts / login
*   CRM integratie
*   Nieuwsbrief integratie
*   Live chat / chatbot
*   Social media integratie

**Groep 3: "Marketing (beschikbaar als add-on)"**
*   SEO optimalisatie
*   Google Analytics

De groepering is puur visueel (een klein `<p>` label boven elke groep). De form data structuur (desiredFeatures array) blijft ongewijzigd.
#### 3\. Stap 4: Budget indicatie (budgetRange)
Huidige opties:

```typescript
const budgetRanges = [
  { value: "1000-2500", label: "€1.000 – €2.500" },
  { value: "2500-5000", label: "€2.500 – €5.000" },
  { value: "5000-10000", label: "€5.000 – €10.000" },
  { value: "10000+", label: "€10.000+" },
  { value: "unknown", label: "Nog geen idee" },
];
```

Nieuwe opties:

```typescript
const budgetRanges = [
  { value: "standard", label: "Standaard abonnement (€69/maand)" },
  { value: "standard-addons", label: "Standaard + add-ons" },
  { value: "1000-2500", label: "Maatwerk: €1.000 – €2.500" },
  { value: "2500-5000", label: "Maatwerk: €2.500 – €5.000" },
  { value: "5000-10000", label: "Maatwerk: €5.000 – €10.000" },
  { value: "10000+", label: "Maatwerk: €10.000+" },
  { value: "unknown", label: "Nog geen idee" },
];
```

#### 4\. Stap 4: "Onderhoud na oplevering" (maintenancePlan)
Huidige opties:

```typescript
const maintenanceOptions = [
  { value: "yes-full", label: "Ja, volledige onderhoud & updates" },
  { value: "yes-basic", label: "Ja, alleen hosting & beveiliging" },
  { value: "no", label: "Nee, ik beheer het zelf" },
  { value: "unsure", label: "Weet ik nog niet" },
];
```

Nieuwe label + opties:
*   Label wijzigen van "Onderhoud na oplevering" naar "Wat verwacht u na livegang?"
*   Opties:

```typescript
const postLaunchOptions = [
  { value: "standard", label: "Onderhoud en hosting (standaard inbegrepen)" },
  { value: "credits", label: "Regelmatige updates via wijzigingscredits" },
  { value: "addons", label: "Actieve groei (SEO, Ads, Social als add-on)" },
  { value: "unsure", label: "Weet ik nog niet" },
];
```

Rename het form field van `maintenancePlan` naar `postLaunchExpectation` (optioneel, mag ook maintenancePlan blijven als je de database niet wilt wijzigen, aangezien het in het jsonb `details` veld zit).
#### 5\. Sidebar: "Dedicated projectmanager"
In de sidebar array (regel ~rond 428 in het huidige bestand):

```typescript
{ icon: Star, text: "Dedicated projectmanager" },
```

Wijzig naar:

```typescript
{ icon: Star, text: "Persoonlijk aanspreekpunt" },
```

#### 6\. FAQ hints update (StepHelp component)
Stap 4 tips, huidige tekst:

```plain
"Een realistisch budget helpt bij een passend voorstel"
```

Nieuwe tekst:

```plain
"Het standaard abonnement is €69/maand. Geef aan als u maatwerk verwacht."
```

### WAT NIET MAG VERANDEREN
*   Form submission logica en API call
*   Zod validation schema (behalve als je maintenancePlan renamed)
*   Stepper navigatie en animaties
*   Success state na submit
*   Stap 1 (Bedrijfsgegevens) volledig ongewijzigd
*   Stap 3 (Design & Content) volledig ongewijzigd
*   De desiredFeatures array values (alleen visuele groepering)
### KWALITEITSCHECK
*   Geen referenties naar €49, €99, €199 of "Starter"/"Professional"/"Business" in het formulier
*   "Standaard abonnement (€69/maand)" moet als optie zichtbaar zijn
*   Feature checkboxes moeten visueel gegroepeerd zijn met labels
*   "Persoonlijk aanspreekpunt" in de sidebar (niet "projectmanager")
*   Form submit moet nog steeds werken en alle data correct meesturen