# Product Review: Abonnement.website

**Reviewer**: Saerens Ecosysteem Technisch Team  
**Datum**: 30 december 2024  
**Versie**: 1.0

---

## Samenvatting

De codebase is goed gestructureerd met een moderne stack (React, TypeScript, Express, PostgreSQL). Er zijn echter enkele bugs, ontbrekende features en technische schuld die aandacht vereisen.

---

## Al in ClickUp

| Issue | List |
|-------|------|
| Target persona documenteren | Product Overview |
| [IMPROVEMENT] Template portfolio uitbreiden | Development |
| Support kanalen opzetten | Operations |

---

## Toe te Voegen

### 🔴 Critical (Prioriteit 1)

#### 1. **[BUG] TypeScript errors in pricing.tsx**
- **Beschrijving**: 4 LSP errors - `Type 'number | null' is not assignable to type 'string | number'` op regels 127, 128, 139, 143
- **Impact**: Build kan falen in strict mode, potentieel runtime errors
- **Fix**: Add null checks: `plan.includedTemplatesMax ?? 0`
- **List**: Development

#### 2. **[BUG] Stripe Price IDs niet gekoppeld aan plans**
- **Beschrijving**: `stripePriceId: null` voor alle plans in database. Stripe checkout werkt niet correct.
- **Impact**: Klanten kunnen niet betalen
- **Fix**: Koppel Stripe products/prices aan database plans
- **List**: Development

#### 3. **[BUG] Geen email notificaties bij contact form**
- **Beschrijving**: Contact form maakt alleen ClickUp taak, geen email naar team
- **Impact**: Leads kunnen gemist worden als ClickUp niet gecheckt wordt
- **Fix**: Integreer email service (Resend/Postmark)
- **List**: Development

---

### 🟠 High (Prioriteit 2)

#### 4. **[FEATURE] Onboarding wizard voor nieuwe klanten**
- **Beschrijving**: Na checkout geen begeleide flow om content te verzamelen
- **Impact**: Handmatig werk nodig, inconsistente data
- **List**: Design & Development

#### 5. **[FEATURE] Client self-service portal**
- **Beschrijving**: Klanten kunnen geen content wijzigingen aanvragen via dashboard
- **Impact**: Alle wijzigingen via email/telefoon = inefficient
- **List**: Design & Development

#### 6. **[BUG] Dashboard routes niet beschermd**
- **Beschrijving**: `/dashboard/*` paginas laden UI zonder auth check op route level
- **Impact**: Potentieel info leakage (UI laadt, API faalt)
- **Fix**: Add route guards in wouter
- **List**: Development

#### 7. **[FEATURE] Intake/briefing formulier**
- **Beschrijving**: Geen gestandaardiseerd intake formulier voor projecten
- **Impact**: Inconsistente klant informatie verzameling
- **List**: Design & Development

#### 8. **[TECHNICAL] Session store niet persistent**
- **Beschrijving**: Gebruikt in-memory sessions, verloren bij restart
- **Impact**: Users logged out na deployment
- **Fix**: Gebruik connect-pg-simple (al geinstalleerd)
- **List**: Development

---

### 🟡 Medium (Prioriteit 3)

#### 9. **[FEATURE] Template preview/demo functionaliteit**
- **Beschrijving**: Templates tonen alleen statische afbeelding, geen live preview
- **Impact**: Klanten kunnen niet interactief templates bekijken
- **List**: Design & Development

#### 10. **[FEATURE] Analytics dashboard voor klanten**
- **Beschrijving**: Dashboard UI aanwezig maar zonder echte data integratie
- **Impact**: Klanten zien geen website statistieken
- **Fix**: Integreer Google Analytics API
- **List**: Development

#### 11. **[CONTENT] FAQ sectie uitbreiden**
- **Beschrijving**: FAQ pagina heeft beperkte vragen
- **Impact**: Support load hoger dan nodig
- **List**: Operations

#### 12. **[CONTENT] Portfolio/projecten pagina vullen**
- **Beschrijving**: /projecten pagina toont mock data, geen echte showcases
- **Impact**: Social proof ontbreekt voor leads
- **List**: Operations

#### 13. **[FEATURE] Automated backups communicatie**
- **Beschrijving**: Geen backup status zichtbaar voor klanten
- **Impact**: Klanten weten niet of backups werken
- **List**: Development

#### 14. **[TECHNICAL] E2E tests ontbreken**
- **Beschrijving**: Geen test files gevonden in codebase
- **Impact**: Regressies mogelijk bij updates
- **Fix**: Setup Playwright tests
- **List**: Development

#### 15. **[CONTENT] Testimonials met echte klanten**
- **Beschrijving**: Homepage testimonials zijn placeholder names
- **Impact**: Authenticity probleem
- **List**: Operations

---

### 🟢 Low (Prioriteit 4)

#### 16. **[FEATURE] Template filteropties uitbreiden**
- **Beschrijving**: Alleen categorie filter, geen prijs/features filter
- **List**: Design & Development

#### 17. **[TECHNICAL] Code splitting voor grote pages**
- **Beschrijving**: home.tsx is 46KB, kan lazy loaded worden
- **Impact**: Initial load time
- **List**: Development

#### 18. **[CONTENT] Vergelijk paginas SEO optimalisatie**
- **Beschrijving**: /vergelijk/* paginas kunnen beter geoptimaliseerd
- **List**: Operations

#### 19. **[FEATURE] Multi-language admin interface**
- **Beschrijving**: Admin/specialist dashboards alleen Engels
- **Impact**: Team members die Nederlands prefereren
- **List**: Design & Development

#### 20. **[TECHNICAL] API error handling standardiseren**
- **Beschrijving**: Inconsistente error responses across endpoints
- **Fix**: Zod validation errors uniform returnen
- **List**: Development

#### 21. **[FEATURE] Specialist availability calendar**
- **Beschrijving**: Geen inzicht in specialist beschikbaarheid
- **List**: Design & Development

#### 22. **[TECHNICAL] Database indexes voor performance**
- **Beschrijving**: Geen indexes op foreign keys
- **Impact**: Query performance bij groei
- **List**: Development

---

## Technische Schuld Overzicht

| Item | Locatie | Ernst |
|------|---------|-------|
| TypeScript strict mode violations | pricing.tsx | Hoog |
| In-memory session storage | routes.ts | Hoog |
| Missing Stripe price bindings | seed.ts | Hoog |
| No automated tests | / | Medium |
| Large bundle sizes | home.tsx (46KB) | Laag |
| Inconsistent error handling | routes.ts | Laag |

---

## Aanbevolen Prioritering

### Sprint 1 (Critical)
1. Fix pricing.tsx TypeScript errors
2. Koppel Stripe Price IDs
3. Setup email notificaties

### Sprint 2 (High)
4. Onboarding wizard
5. Client self-service portal
6. Auth route guards
7. Intake formulier
8. Persistent sessions

### Sprint 3 (Medium)
9-15. Features en content verbetering

### Backlog (Low)
16-22. Nice-to-haves

---

## ClickUp Implementatie Script

De volgende taken moeten worden aangemaakt:

```
List: Development (901519034023)
- [BUG] TypeScript errors in pricing.tsx - null checks ontbreken
- [BUG] Stripe Price IDs niet gekoppeld aan database plans
- [BUG] Geen email notificaties bij contact form submissions
- [BUG] Dashboard routes niet beschermd op route level
- [BUG] Session store niet persistent - gebruikt in-memory
- [FEATURE] Analytics dashboard - Google Analytics API integratie
- [FEATURE] Automated backup status in klant dashboard
- [IMPROVEMENT] E2E tests setup met Playwright
- [IMPROVEMENT] Code splitting voor grote paginas
- [IMPROVEMENT] API error handling standaardiseren
- [IMPROVEMENT] Database indexes op foreign keys

List: Design & Development (901519230453)
- [FEATURE] Onboarding wizard voor nieuwe klanten na checkout
- [FEATURE] Client self-service content wijzigingen portal
- [FEATURE] Intake/briefing formulier voor projecten
- [FEATURE] Template preview/demo functionaliteit
- [FEATURE] Template filteropties uitbreiden (prijs/features)
- [FEATURE] Multi-language admin interface
- [FEATURE] Specialist availability calendar

List: Operations (901519034022)
- [CONTENT] FAQ sectie uitbreiden met veelgestelde vragen
- [CONTENT] Portfolio/projecten vullen met echte showcases
- [CONTENT] Testimonials met echte klant namen en foto's
- [CONTENT] Vergelijk paginas SEO optimalisatie
```
