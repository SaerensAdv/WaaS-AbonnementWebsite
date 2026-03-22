# ClickUp Integratie — Abonnement.website

## Connectie

- **ClickUp API v2 Base URL:** `https://api.clickup.com/api/v2`
- **API Token:** Opgeslagen als environment variable `CLICKUP_API_TOKEN`
- **Team/Workspace ID:** `9015913612`
- **Headers:** `Authorization: {CLICKUP_API_TOKEN}` + `Content-Type: application/json`

## Beheer van deze Space

Deze Space is een **basisstructuur**. Je mag en moet deze aanpassen naargelang hoe we in dit project gaan werken:

- **Overbodige lijsten/folders verwijderen** als ze niet relevant blijken
- **Nieuwe lijsten/folders toevoegen** als er iets mist
- **Statussen aanpassen** per lijst als de workflow dat vereist
- **Custom fields toevoegen** waar nodig (bijv. op de Klanten lijst: plan type, domein, abonnement status, etc.)

Werk altijd via de API zodat dit document kan worden bijgewerkt met de nieuwe IDs.

## Space: Abonnement.website

- **Space ID:** `901510164504`

### Structuur & IDs

```
📁 Product Development (Folder ID: 901515271872)
│
├── 📋 Backlog (List ID: 901522317212)
│   Statuses: to do → in progress → complete
│   Gebruik voor: alle geplande features, verbeteringen, ideeën
│
├── 📋 Sprint (List ID: 901522317213)
│   Statuses: to do → in progress → complete
│   Gebruik voor: taken die nu actief worden gebouwd (huidige sprint)
│
├── 📋 Bugs (List ID: 901522317214)
│   Statuses: to do → in progress → complete
│   Gebruik voor: bugmeldingen, technische issues, defects
│
└── 📋 Releases & Changelog (List ID: 901522317217)
    Statuses: to do → in progress → complete
    Gebruik voor: release notes, versie tracking, changelog entries


📁 Klanten & Support (Folder ID: 901515271875)
│
├── 📋 Klanten (List ID: 901522317218)
│   Statuses: to do → in progress → complete
│   Gebruik voor: klantbeheer, account informatie, abonnement status
│
├── 📋 Support Tickets (List ID: 901522317219)
│   Statuses: to do → in progress → complete
│   Gebruik voor: klant support verzoeken, technische problemen
│
├── 📋 Feedback & Feature Requests (List ID: 901522317220)
│   Statuses: to do → in progress → complete
│   Gebruik voor: klant feedback, feature verzoeken, verbeterideeën
│
└── 📋 Aanvragen & Inschrijvingen (List ID: 901522317221)
    Statuses: to do → in progress → complete
    Gebruik voor: nieuwe aanmeldingen, demo-aanvragen, inschrijvingen
```

## Veelgebruikte API Endpoints

### Taken

```
GET    /list/{list_id}/task                  — Alle taken in een lijst
POST   /list/{list_id}/task                  — Taak aanmaken
GET    /task/{task_id}                       — Taak ophalen
PUT    /task/{task_id}                       — Taak updaten
DELETE /task/{task_id}                       — Taak verwijderen
```

### Checklists

```
POST   /task/{task_id}/checklist             — Checklist aanmaken
POST   /checklist/{checklist_id}/checklist_item — Item toevoegen
PUT    /checklist/{checklist_id}/checklist_item/{item_id} — Item updaten
DELETE /checklist/{checklist_id}/checklist_item/{item_id} — Item verwijderen
```

### Comments

```
GET    /task/{task_id}/comment               — Comments ophalen
POST   /task/{task_id}/comment               — Comment toevoegen
```

### Custom Fields

```
POST   /task/{task_id}/field/{field_id}      — Custom field waarde instellen
```

### Lijsten & Folders

```
GET    /space/{space_id}/folder              — Alle folders
GET    /folder/{folder_id}/list              — Lijsten in folder
GET    /space/{space_id}/list                — Folderless lijsten
```

## Richtlijnen

1. **Nieuwe klant toevoegen:** POST naar Klanten lijst (901522317218)
2. **Support ticket aanmaken:** POST naar Support Tickets (901522317219)
3. **Bug loggen:** POST naar Bugs (901522317214)
4. **Feature request:** POST naar Feedback & Feature Requests (901522317220)
5. **Nieuwe aanmelding:** POST naar Aanvragen & Inschrijvingen (901522317221)
6. **Release loggen:** POST naar Releases & Changelog (901522317217)
7. **Nieuwe feature plannen:** POST naar Backlog (901522317212)
8. **Feature starten:** Verplaats taak naar Sprint (901522317213) of maak aan in Sprint

## Taak Aanmaken — Voorbeeld

```json
POST /list/{list_id}/task
{
  "name": "Taaknaam",
  "description": "Beschrijving",
  "status": "to do",
  "priority": 3,
  "tags": ["tag1"],
  "due_date": 1711324800000,
  "time_estimate": 3600000
}
```

Priority: 1 = urgent, 2 = high, 3 = normal, 4 = low

## API Beperkingen

- Rate limit: 100 requests per minuut per token
- Recurring taken kunnen NIET via de API worden ingesteld
- Custom fields op list-level worden niet geretourneerd via het list endpoint — gebruik task-level queries
- `time_estimate` is in milliseconden (1 uur = 3600000)
