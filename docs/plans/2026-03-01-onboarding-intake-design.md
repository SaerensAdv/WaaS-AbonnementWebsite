# Onboarding Intake Formulier — 1 maart 2026

## Flow
1. Klant betaalt → checkout-success → knop "Start uw onboarding" → `/app/onboarding`
2. Als overgeslagen: dashboard toont banner "Vul uw onboarding formulier in"
3. Formulier is stapsgewijze wizard (5 stappen)
4. Data opgeslagen als JSON in `onboardingData` kolom op `projects` tabel
5. `onboardingCompleted` boolean vlag op project
6. Admin kan data inzien in klantenoverzicht

## Velden

### Stap 1 — Bedrijfsgegevens
- Bedrijfsnaam (verplicht)
- Land (NL/BE, verplicht, bepaalt KVK vs BTW veld)
- KVK-nummer (NL, verplicht)
- BTW-nummer (BE, verplicht)
- Branche (dropdown, verplicht)
- Bestaande website URL (optioneel)
- Telefoonnummer (verplicht)
- Bedrijfsadres (verplicht)

### Stap 2 — Website doelen
- Hoofddoel (meerkeuze, verplicht)
- Doelgroep (tekst, verplicht)
- Concurrenten (tekst, optioneel)

### Stap 3 — Content
- Heeft teksten (ja/nee/gedeeltelijk, verplicht)
- Heeft logo (ja/nee, verplicht)
- Heeft foto's (ja/nee/gedeeltelijk, verplicht)

### Stap 4 — Design voorkeuren
- Kleurvoorkeur (tekst, optioneel)
- Stijlvoorkeur (keuze: modern/klassiek/speels/zakelijk, verplicht)
- Voorbeeldwebsites (tekst, optioneel)

### Stap 5 — Social media & opmerkingen
- Facebook URL (optioneel)
- Instagram URL (optioneel)
- LinkedIn URL (optioneel)
- Overige opmerkingen (textarea, optioneel)

## Opslag
- `projects.onboardingData` (jsonb) — alle formulierdata
- `projects.onboardingCompleted` (boolean) — vlag voor dashboard banner
