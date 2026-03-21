# 🧩 Project: Abonnement.website

**Dossier type:** Technisch-Strategisch Ecosysteem Dossier  
**Datum:** 21 maart 2026  
**Status:** Actief Product  
**Positie:** Product-node binnen Saerens Agency Ecosysteem

---

## 🎯 1. Definitie & Doel

### Kernmissie
**"Professionele websites als maandelijks abonnement aanbieden aan Belgische KMO's en starters, waardoor de drempel naar online aanwezigheid volledig wordt weggenomen."**

### Status: **MVP → Productie**
Het platform beschikt over een werkende landing page, Stripe-betaalintegratie, klantendashboard, admin-panel, onboarding-wizard en meertalige ondersteuning (NL/EN). Kritieke bugs (Stripe Price ID koppeling, session persistence) zijn geïdentificeerd en deels opgelost. Het product is functioneel maar vereist nog hardening voor volledige productie-schaal.

### Pijnpunt dat wordt opgelost

**Voor de klant (KMO/starter):**
- Hoge eenmalige websitekosten (€2.000–€10.000) vormen een onoverkomelijke drempel
- Slechte ervaringen met freelancers/bureaus die verdwijnen of te veel beloven
- DIY-platformen (Wix, WordPress) kosten 40+ uur en leveren onprofessionele resultaten
- Websites die na oplevering niet worden onderhouden en verouderen

**Voor de agency (Saerens/EYN):**
- Creëert een voorspelbare, schaalbare MRR-stroom (recurring revenue)
- Biedt een laagdrempelig instapproduct dat klanten bindt aan het ecosysteem
- Genereert een continue stroom van upsell-mogelijkheden (Ads, SEO, ConsentEase)

---

## 🛠 2. Componenten & Data

### Tech Stack

| Laag | Technologie |
|------|-------------|
| **Frontend** | React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion |
| **Routing** | Wouter (client-side) |
| **State** | TanStack Query v5 (server state), React Context (auth, i18n) |
| **Backend** | Node.js + Express.js, TypeScript |
| **Database** | PostgreSQL (Neon via Replit), Drizzle ORM |
| **Auth** | Passport.js (Local Strategy), session-based (connect-pg-simple) |
| **Betalingen** | Stripe (Checkout Sessions, Customer Portal, Webhooks) |
| **i18n** | Custom React Context (NL/EN) |
| **SEO** | Custom useSEO hook, JSON-LD structured data, sitemap.xml, robots.txt |
| **Iconen** | Phosphor Icons (marketing), Lucide React (dashboard/UI) |
| **Hosting** | Replit (Development & Deployment) |

### Data-Assets

| Data Type | Beschrijving | Strategische Waarde |
|-----------|-------------|---------------------|
| **Klantprofielen** | Bedrijfsnaam, sector, contactgegevens, Stripe customer ID | CRM-kern, segmentatie voor upsell |
| **Onboarding Data** | Bedrijfsdoelen, designvoorkeuren, kleuren, content assets (JSON) | Inzicht in klantbehoeften, template-optimalisatie |
| **Subscription Data** | Plan type, status, MRR per klant, churn-data | Financiële forecasting, cohort-analyse |
| **Project Status** | Fase-tracking (Onboarding → Production → Live → Maintenance) | Operationele efficiëntie, SLA-monitoring |
| **Add-on Selecties** | Google Ads, Meta Ads, Cookie Banner keuzes per klant | Cross-sell tracking, omzetoptimalisatie |
| **Bezoekersstatistieken** | (Gepland) Google Analytics per klantenwebsite | Klantwaarde-bewijs, retentie-argument |

### Datamodel (Kern-entiteiten)

```
users (ADMIN | CUSTOMER)
  └── customer_profiles (bedrijfsinfo, Stripe ID)
       └── subscriptions (plan, status, Stripe subscription ID)
            ├── projects (website status, onboarding data)
            └── add_on_selections (Google Ads, Meta Ads, Cookie Banner)

plans (Starter €49 | Professional €99 | Business €199)
add_ons (Google Ads €149 | Meta Ads €149 | Cookie Banner €9)
```

### ClickUp Link

**Space:** 🌐 Abonnement.website (ID: 90159033136)

| Lijst | Functie |
|-------|---------|
| Product Overview | Product backlog, feature planning |
| Development | Bugs, technische taken, improvements |
| Operations | Dagelijkse operaties, support, content |
| Recurring | Maandelijks onderhoud, terugkerende taken |
| Done/Archive | Afgeronde taken |

**Open Keuken integratie:** Klantprojecten volgen de 4-stappen flow:
1. Intake & Briefing → 2. Design & Development → 3. Review & Feedback → 4. Live & Maintenance

Stripe webhooks triggeren automatisch ClickUp onboarding-taken bij nieuwe subscriptions.

---

## 🔗 3. Ecosysteem Connecties (Mapping)

### Input (Upstream)

| Bron | Data/Trigger | Mechanisme |
|------|-------------|------------|
| **Saerens Advertising (Google Ads)** | Leads via Google Ads campagnes gericht op "website abonnement" zoektermen | Ads → Landing page → Checkout |
| **EYN Agency (Marketing Hub)** | Klantrelaties uit bestaand netwerk, referrals | Persoonlijk advies → Signup |
| **Stripe** | Checkout completion, subscription updates, payment events | Webhooks → Database sync |
| **ClickUp** | Projectstatus updates, teamtaken | API-integratie (list IDs geconfigureerd) |

### Output (Downstream)

| Bestemming | Data/Waarde | Mechanisme |
|------------|-------------|------------|
| **Saerens Advertising** | Klanten die Google Ads add-on (€149/mo) activeren worden Ads-klant | Dashboard add-on selectie → Ads team onboarding |
| **ConsentEase (CMP)** | Cookie Banner add-on (€9/mo voor Starter, gratis bij Pro/Business) = directe product-integratie | Automatische bundeling in hogere plannen |
| **AI Intelligence Dashboard** | MRR data, churn rates, klant-segmentatie, project doorlooptijden | API endpoints (/api/admin/stats) |
| **ClickUp (Open Keuken)** | Projectvoortgang, klantcommunicatie, SLA-metrics | ClickUp API taak-creatie |

### Cross-sell Potentieel

```
                    ┌─────────────────────────────────┐
                    │     KLANT JOURNEY BINNEN        │
                    │     SAERENS ECOSYSTEEM           │
                    └─────────────────────────────────┘

[Starter €49/mo] ──────────────────────────────────────►
    │                                                    
    ├── + Cookie Banner (ConsentEase) → €9/mo add-on     
    ├── + Google Ads → €149/mo add-on (→ Saerens Ads)    
    ├── + Meta Ads → €149/mo add-on                      
    │                                                    
    ▼                                                    
[Professional €99/mo] ─────────────────────────────────►
    │  (Cookie Banner nu GRATIS inbegrepen)              
    ├── + SEO pakket → €149/mo                           
    ├── + Content Creatie → €99/mo                       
    │                                                    
    ▼                                                    
[Business €199/mo] ────────────────────────────────────►
    │  (Alles inbegrepen + maatwerk)                     
    ├── + E-commerce integratie                          
    ├── + API-koppelingen (→ AI Dashboard data)          
    └── → Full-service Saerens/EYN Agency klant          
```

**Kernmechanisme:** Abonnement.website fungeert als de **"instaptrechter"** van het ecosysteem. De lage maandelijkse drempel trekt klanten aan die vervolgens via add-ons en plan-upgrades steeds dieper in het Saerens-ecosysteem worden getrokken.

---

## 📊 4. AI-Dashboard Integratie

### Datapunten voor het AI Intelligence Dashboard

| Datapunt | Bron | AI-toepassing |
|----------|------|---------------|
| **MRR & ARR** | Stripe + subscriptions tabel | Omzetvoorspelling, groei-trajecten |
| **Churn Rate** | Subscription status changes | Churn-predictie model, at-risk klant alerts |
| **Plan Distributie** | Subscriptions per tier | Prijsoptimalisatie, tier-conversie analyse |
| **Onboarding Doorlooptijd** | Project status timestamps | Bottleneck-detectie, capaciteitsplanning |
| **Add-on Adoptie** | add_on_selections tabel | Upsell-timing optimalisatie, bundle-suggesties |
| **Klant Sector** | Onboarding data (JSON) | Sector-specifieke template-performance |
| **Lead → Klant Conversie** | Signup → Checkout completion rate | Funnel-optimalisatie, A/B test sturing |
| **Support Volume** | ClickUp taak-count per klant | Service-kosten per klant, automations-kansen |

### Concrete AI-Sturingskansen

1. **Predictive Churn Alert:** AI analyseert patronen (login-frequentie, support-tickets, betalingsgedrag) en waarschuwt proactief bij churn-risico → team kan ingrijpen
2. **Smart Upsell Timing:** AI bepaalt het optimale moment om een add-on of plan-upgrade voor te stellen op basis van klantgedrag en sector-benchmarks
3. **Template Performance Scoring:** AI rankt templates op conversie per sector, waardoor de homepage automatisch de best-converterende templates toont
4. **Capacity Planning:** AI voorspelt hoeveel nieuwe projecten het team aankan op basis van huidige doorlooptijden en beschikbare capaciteit
5. **Cross-sell Routing:** AI identificeert welke website-klanten het meest waarschijnlijk Google Ads klanten worden en routeert ze naar Saerens Advertising

### Benodigde API-endpoints voor Dashboard

```
GET /api/admin/stats          → MRR, totaal klanten, plan distributie
GET /api/admin/customers      → Klantoverzicht met subscription details
GET /api/admin/projects       → Project status tracking
GET /api/admin/churn-metrics  → (Nieuw) Churn data per cohort
GET /api/admin/addon-adoption → (Nieuw) Add-on conversie metrics
GET /api/admin/funnel         → (Nieuw) Lead-to-customer funnel data
```

---

## ❓ 5. Strategische Interview Vragen

### Vraag 1: Klant Lifecycle Ownership
**"Wanneer een Abonnement.website-klant Google Ads als add-on activeert, wordt die klant dan volledig overgedragen aan het Saerens Advertising team, of blijft Abonnement.website de 'eigenaar' van de klantrelatie met Ads als managed service eronder?"**

*Waarom dit ertoe doet:* Dit bepaalt of Abonnement.website een productplatform is (met eigen P&L) of een leadgenerator voor de agency. De keuze beïnvloedt prijsstrategie, teamstructuur en hoe MRR wordt gerapporteerd in het AI Dashboard.

### Vraag 2: ConsentEase Bundeling
**"Is ConsentEase puur een add-on/feature binnen Abonnement.website (cookie banner = €9/mo), of is het plan om ConsentEase als standalone SaaS-product ook aan NIET-Abonnement.website klanten te verkopen? En zo ja, hoe voorkom je kanaalconflicten in pricing?"**

*Waarom dit ertoe doet:* Als ConsentEase standalone waarde heeft, is de €9/mo pricing binnen Abonnement.website mogelijk te laag en cannibaliseert het de standalone markt. De ecosysteem-mapping verandert fundamenteel afhankelijk van dit antwoord.

### Vraag 3: AI Dashboard als Revenue Center
**"Welke data uit Abonnement.website zou je het AI Intelligence Dashboard willen laten gebruiken om direct omzet te genereren — dus niet alleen interne sturing, maar als betaalde feature voor klanten? Denk aan: 'Uw website presteert 30% beter dan gemiddeld in uw sector' als premium inzicht."**

*Waarom dit ertoe doet:* Als klant-facing analytics een premium feature wordt, verandert het AI Dashboard van een interne cost center naar een revenue driver. Dit beïnvloedt welke data je prioritair gaat verzamelen en hoe je de plan-tiers herstructureert.

---

## 📎 Bijlage: Ecosysteem Positie (Visueel Overzicht)

*Na beantwoording van bovenstaande vragen wordt een Mermaid.js flowchart gegenereerd die de exacte positie van Abonnement.website binnen het Saerens Agency Ecosysteem weergeeft, inclusief alle data-flows en cross-sell routes.*

### Voorlopige Positie-Samenvatting

```
┌──────────────────────────────────────────────────────────┐
│                  SAERENS / EYN AGENCY                     │
│                   (Marketing Hub / HQ)                    │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Saerens     │  │ Abonnement.  │  │  ConsentEase │  │
│  │  Advertising  │◄─┤   website    ├──►│    (CMP)     │  │
│  │ (Google Ads)  │  │  (Web-SaaS)  │  │              │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘  │
│         │                  │                              │
│         └────────┬─────────┘                              │
│                  ▼                                        │
│         ┌──────────────┐                                 │
│         │      AI      │                                 │
│         │ Intelligence │                                 │
│         │  Dashboard   │                                 │
│         └──────────────┘                                 │
│                                                          │
│  Infra: Replit (Dev) │ ClickUp (PM / Open Keuken)       │
└──────────────────────────────────────────────────────────┘
```

---

*Document gegenereerd op basis van codebase-analyse, business documentatie en ClickUp space structuur. Versie 1.0 — 21 maart 2026.*
