# Replit Agent Prompt: Werkwijze Pagina

# Replit Agent Prompt: Werkwijze Pagina
**Doel:** kopieer alles onder de lijn naar Replit Agent (Design mode).
**Datum:** 9 augustus 2026
**Status:** klaar om uit te voeren
**Prioriteit:** na pricing rewrite en consentease pagina

* * *
## Opdracht: Bouw een werkwijze-pagina op /werkwijze
### Context
Prospects willen weten hoe het werkt voordat ze bestellen. De homepage toont 4 korte stappen, maar sommige mensen willen meer detail en vertrouwen opbouwen. Deze pagina geeft het volledige proces weer in 6 heldere stappen, met nadruk op wat de klant moet doen vs. wat wij doen.
### ROUTE
`/werkwijze` (nieuwe pagina, toevoegen aan router)
### DESIGN RICHTING
*   Gebruik het bestaande dark theme en componenten (MarketingLayout, ScrollReveal, Phosphor icons, framer-motion)
*   Verticaal, storytelling-achtig: de klant scrollt door het proces als een tijdlijn
*   Elk stap-blok is visueel onderscheidend (afwisselend links/rechts of met een verticale tijdlijn)
*   Rustig, vertrouwenwekkend, niet druk. Veel whitespace.
*   Accent kleur voor "jouw actie" vs "onze actie" (bv. blauw = wij, amber/goud = jij)
### STRUCTUUR
#### Hero
*   Headline: **"Van bestelling tot live in 10 dagen"**
*   Subtitel: "Geen technische kennis nodig. Jij levert je wensen, wij bouwen je website. Zes stappen, helder en voorspelbaar."
*   Geen CTA in hero (die komt onderaan)
#### Tijdlijn / Stappen
**Stap 1: Bestellen**
*   Tijdsindicatie: "Dag 0 — 2 minuten"
*   Icoon: CreditCard
*   Beschrijving: "Kies je abonnement en reken af. Kwartaal vooraf, geen opstartkosten. Je ontvangt direct een bevestiging en toegang tot je dashboard."
*   Label: "Jouw actie"

**Stap 2: Intake**
*   Tijdsindicatie: "Dag 1-2"
*   Icoon: ClipboardText
*   Beschrijving: "Vul de intake-vragenlijst in: over je bedrijf, je doelgroep, je wensen en je huisstijl. Heb je al teksten en foto’s? Upload ze. Nog niet? Geen probleem, wij helpen."
*   Label: "Jouw actie"

**Stap 3: Ontwerp**
*   Tijdsindicatie: "Dag 3-7"
*   Icoon: PaintBrush
*   Beschrijving: "Wij bouwen je website op maat. Responsive, snel, professioneel. Je ontvangt een preview-link zodra de eerste versie klaar is."
*   Label: "Wij aan het werk"

**Stap 4: Feedback & revisie**
*   Tijdsindicatie: "Dag 7-9"
*   Icoon: ChatCircleDots
*   Beschrijving: "Bekijk de preview en geef feedback. Wat moet anders? Wij verwerken je opmerkingen in maximaal twee revisierondes. Na goedkeuring gaan we live."
*   Label: "Samen"

**Stap 5: Livegang**
*   Tijdsindicatie: "Dag 10"
*   Icoon: Rocket
*   Beschrijving: "Na jouw goedkeuring koppelen wij je domein, activeren SSL, en zetten alles live. Cookie consent, analytics en sitemap worden automatisch geconfigureerd."
*   Label: "Wij aan het werk"

**Stap 6: Overdracht & support**
*   Tijdsindicatie: "Dag 10+"
*   Icoon: Handshake
*   Beschrijving: "Je ontvangt een overdracht met alles wat je moet weten: hoe wijzigingen aanvragen werkt, hoe credits werken, en hoe je ons bereikt. Vanaf nu onderhouden wij je website."
*   Label: "Klaar"
#### "Wat je mag verwachten" blok
Onder de tijdlijn, een horizontale strip of grid met 4 beloftes:
*   **10 werkdagen** tot live (bij volledige intake)
*   **2 revisierondes** inbegrepen
*   **Geen technische kennis** nodig
*   **Alles inbegrepen:** hosting, SSL, onderhoud, consent, support
#### "Veelgestelde vragen over het proces" (3-4 FAQ items)
1. **"Wat als ik geen content heb?"**

"Geen probleem. Wij kunnen placeholder-teksten schrijven op basis van je intake. Je kunt later via je wijzigingscredits de definitieve content laten plaatsen."

2. **"Wat als ik niet tevreden ben na 2 rondes?"**

"Extra revisies zijn mogelijk via je wijzigingscredits (€29 per aanpassing). We bespreken altijd vooraf wat nodig is."

3. **"Moet ik iets technisch doen?"**

"Nee. Wij regelen hosting, domein, SSL, cookie consent en analytics. Jij levert alleen content en feedback."

4. **"Hoe lang duurt het als ik traag reageer?"**

"De doorlooptijd van 10 dagen geldt bij tijdige reactie. Als je langer nodig hebt voor intake of feedback, schuift de planning mee. Geen stress, geen boete."

#### CTA (afsluiting)
*   Card: "Klaar om te starten?"
*   Subtekst: "Kies je abonnement en wij nemen binnen 24 uur contact op."
*   Button: "Bekijk het abonnement →" linkt naar /#pricing
*   Secundaire link: "Liever eerst een offerte op maat? → /offerte"
### TECHNISCHE VEREISTEN
*   Nieuwe pagina component: `client/src/pages/werkwijze.tsx`
*   Gebruik MarketingLayout
*   Gebruik bestaande UI componenten (Button, Badge, Card)
*   Gebruik Phosphor icons: CreditCard, ClipboardText, PaintBrush, ChatCircleDots, Rocket, Handshake (of dichtste equivalenten in Phosphor)
*   Gebruik framer-motion voor scroll-reveal animaties per stap (staggered)
*   useSEO hook met:
    *   title: "Werkwijze | Van Bestelling tot Live in 10 Dagen"
    *   description: "Zo werkt [abonnement.website](http://abonnement.website): bestel, vul de intake in, wij bouwen en binnen 10 werkdagen is je professionele website live. Geen technische kennis nodig."
    *   canonical: "/werkwijze"
*   Voeg de route toe aan App.tsx
*   Voeg een link "Werkwijze" toe in de header/footer navigatie
*   Responsive: mobile-first
*   Geen nieuwe dependencies
### FAQ STRUCTURED DATA
Voeg FAQ [schema.org](http://schema.org) structured data toe (zelfde patroon als homepage):

```typescript
const werkwijzeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wat als ik geen content heb voor mijn website?",
      acceptedAnswer: { "@type": "Answer", text: "Geen probleem. Wij kunnen placeholder-teksten schrijven op basis van je intake. Je kunt later via je wijzigingscredits de definitieve content laten plaatsen." }
    },
    {
      "@type": "Question",
      name: "Wat als ik niet tevreden ben na 2 revisierondes?",
      acceptedAnswer: { "@type": "Answer", text: "Extra revisies zijn mogelijk via je wijzigingscredits (€29 per aanpassing). We bespreken altijd vooraf wat nodig is." }
    },
    {
      "@type": "Question",
      name: "Moet ik iets technisch doen voor mijn website?",
      acceptedAnswer: { "@type": "Answer", text: "Nee. Wij regelen hosting, domein, SSL, cookie consent en analytics. Jij levert alleen content en feedback." }
    },
    {
      "@type": "Question",
      name: "Hoe lang duurt het als ik traag reageer?",
      acceptedAnswer: { "@type": "Answer", text: "De doorlooptijd van 10 dagen geldt bij tijdige reactie. Als je langer nodig hebt voor intake of feedback, schuift de planning mee. Geen stress, geen boete." }
    }
  ]
};
```

### WAT NIET MAG
*   Geen lichte achtergrond (dark theme)
*   Geen beloftes die we niet kunnen waarmaken (geen "gegarandeerd 10 dagen" maar "gemiddeld 10 werkdagen bij tijdige reactie")
*   Geen vermelding van oude plannen (Starter/Professional/Business)
*   Geen prijzen op deze pagina (die staan op /#pricing)
*   Geen nieuwe fonts of externe CSS
### KWALITEITSCHECK
*   Pagina laadt zonder errors
*   Route /werkwijze werkt
*   Mobile layout: stappen stacked verticaal, leesbaar op 375px
*   Alle 6 stappen zichtbaar met duidelijke visuele scheiding
*   Labels ("Jouw actie" / "Wij aan het werk" / "Samen") zijn zichtbaar per stap
*   FAQ items openen/sluiten correct
*   CTA linkt naar /#pricing
*   Structured data is correct in de page head
*   Link in navigatie (header of footer) werkt