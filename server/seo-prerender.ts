import { getBlogMetadata } from "./blog-prerender";

const BASE_URL = "https://abonnement.website";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = "Abonnement.Website";

export interface RouteMetadata {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  structuredData?: object;
  staticHtml: string;
}

const betaalbareWebsiteFaqs = [
  {
    q: "Wat kost een professionele website bij jullie?",
    a: "Je betaalt vanaf \u20ac69 per maand. Daarin zitten design, hosting, onderhoud en support. Er zijn geen opstartkosten en geen verrassingen achteraf. De facturatie loopt per kwartaal vooruit.",
  },
  {
    q: "Voor wie is dit bedoeld?",
    a: "Voor starters, zzp\u2019ers, zelfstandigen, eenmanszaken en kleine kmo\u2019s of mkb-bedrijven in Nederland en Belgi\u00eb die professioneel online willen, zonder een groot bedrag vooraf te investeren.",
  },
  {
    q: "Hoe snel staat mijn website online?",
    a: "Gemiddeld binnen 10 werkdagen. Na je aanmelding plannen we een korte intake, bouwen we je site en zetten we hem live.",
  },
  {
    q: "Ben ik eigenaar van mijn website en content?",
    a: "Ja. De teksten en beelden die je aanlevert blijven 100% van jou. We werken met een minimumtermijn van 6 maanden.",
  },
  {
    q: "Wat is het verschil met een website eenmalig laten maken?",
    a: "Een eenmalige website kost vaak \u20ac1.500 tot \u20ac5.000 vooraf en daarna betaal je apart voor hosting en onderhoud. Met een abonnement spreid je de kosten en blijft alles inbegrepen en up-to-date.",
  },
  {
    q: "Kan ik later upgraden of extra\u2019s toevoegen?",
    a: "Zeker. Je kunt op elk moment add-ons toevoegen of verwijderen, zoals extra pagina\u2019s, SEO of advertentiebeheer. Er is \u00e9\u00e9n plan; de keuze zit in welke add-ons je activeert.",
  },
];

const ROUTE_METADATA: Record<string, RouteMetadata> = {
  "/": {
    title: "Website op Abonnement | Vanaf \u20ac69/maand",
    description:
      "Professionele website voor \u20ac69/maand: design, hosting, onderhoud en 2 wijzigingscredits inbegrepen. Voor starters en zelfstandigen in NL en Belgi\u00eb.",
    canonical: `${BASE_URL}/`,
    ogImage: DEFAULT_OG_IMAGE,
    staticHtml: `
<div id="root">
  <header>
    <nav>
      <a href="/">Abonnement.Website</a>
      <a href="/#pricing">Prijzen</a>
      <a href="/#addons">Add-ons</a>
      <a href="/blog">Blog</a>
      <a href="/#faq">FAQ</a>
      <a href="/login">Inloggen</a>
      <a href="/signup">Registreren</a>
    </nav>
  </header>
  <main>
    <section>
      <h1>Professionele website op abonnement</h1>
      <p>Vanaf \u20ac69 per maand. Voor starters en zelfstandigen in Nederland en Belgi\u00eb: design, hosting, onderhoud, support en 2 wijzigingscredits in \u00e9\u00e9n vast maandbedrag. Binnen 2 weken live, per kwartaal vooruit afgerekend.</p>
      <a href="/signup">Direct starten</a>
      <a href="/#pricing">Bekijk abonnementen</a>
    </section>
    <section id="pricing">
      <h2>Website abonnement prijzen</h2>
      <ul>
        <li><strong>Website-abonnement \u2014 \u20ac69/maand</strong>: website op maat (tot 5 pagina\u2019s), responsive ontwerp, hosting, SSL en onderhoud, ConsentEase inbegrepen, 2 wijzigingscredits per maand, support via e-mail. Kwartaal vooraf gefactureerd (\u20ac207 per kwartaal), minimale looptijd 6 maanden.</li>
      </ul>
      <p>2 wijzigingscredits per maand inbegrepen. 1 credit = 1 wijziging. Extra credits: \u20ac29/stuk. Uitbreiden kan met add-ons zoals Google Ads, SEO, social media, e-commerce en extra pagina\u2019s.</p>
    </section>
    <section>
      <h2>Betaalbare professionele websites</h2>
      <p>Geen grote investering vooraf. Alles inbegrepen: design, hosting, SSL, onderhoud, updates en persoonlijke support.</p>
      <a href="/betaalbare-professionele-website">Meer over betaalbare websites</a>
    </section>
    <section>
      <h2>Tips over websites, kosten en SEO</h2>
      <p>Praktische artikelen voor starters en zelfstandigen over websitekosten, SEO en online groeien.</p>
      <a href="/blog">Bekijk alle artikelen</a>
    </section>
  </main>
  <footer>
    <p>Abonnement.Website \u2014 Professionele websites als abonnement. Hosting, onderhoud en support inbegrepen.</p>
    <a href="/privacy">Privacy</a> | <a href="/terms">Algemene Voorwaarden</a> | <a href="/offerte">Offerte aanvragen</a> | <a href="/blog">Blog</a>
  </footer>
</div>`,
  },

  "/privacy": {
    title: `Privacybeleid | ${SITE_NAME}`,
    description:
      "Lees ons privacybeleid. Wij respecteren uw privacy en verwerken uw gegevens veilig conform de AVG.",
    canonical: `${BASE_URL}/privacy`,
    ogTitle: `Privacybeleid | ${SITE_NAME}`,
    ogDescription:
      "Lees ons privacybeleid. Wij respecteren uw privacy en verwerken uw gegevens veilig conform de AVG.",
    staticHtml: `
<div id="root">
  <header>
    <nav>
      <a href="/">Abonnement.Website</a>
      <a href="/#pricing">Prijzen</a>
      <a href="/login">Inloggen</a>
    </nav>
  </header>
  <main>
    <nav aria-label="Breadcrumb">
      <a href="/">Home</a> &rsaquo; <span>Privacy Policy</span>
    </nav>
    <h1>Privacy Policy</h1>
    <p>Wij gebruiken uw gegevens alleen om onze dienst te leveren en u correct te helpen.</p>
    <h2>Wat we bijhouden</h2>
    <ul>
      <li>Naam en e-mailadres (accountgegevens)</li>
      <li>Facturatiegegevens (via onze betaalpartner)</li>
      <li>Website-instellingen en contactaanvragen</li>
      <li>Basis gebruiksdata om de dienst te verbeteren</li>
    </ul>
    <h2>Waarom</h2>
    <ul>
      <li>Om uw website te bouwen en te beheren</li>
      <li>Om betalingen en abonnementen te verwerken</li>
      <li>Om support te kunnen geven</li>
      <li>Om veiligheid te garanderen</li>
    </ul>
    <h2>Delen met derden</h2>
    <p>Alleen partijen die nodig zijn om de dienst te leveren (betaling, e-mail, hosting).</p>
    <h2>Uw rechten</h2>
    <p>U heeft recht op inzage, aanpassing of verwijdering van uw gegevens. Neem contact met ons op via e-mail.</p>
  </main>
  <footer>
    <p>Abonnement.Website</p>
    <a href="/">Home</a> | <a href="/terms">Algemene Voorwaarden</a>
  </footer>
</div>`,
  },

  "/terms": {
    title: `Algemene Voorwaarden | ${SITE_NAME}`,
    description:
      "Lees de algemene voorwaarden van Abonnement.website (Saerens Advertising). Alles over abonnementen, looptijd, opzegging, eigendom, betaling en GDPR.",
    canonical: `${BASE_URL}/terms`,
    ogTitle: `Algemene Voorwaarden | ${SITE_NAME}`,
    ogDescription:
      "Lees de algemene voorwaarden van Abonnement.website (Saerens Advertising). Alles over abonnementen, looptijd, opzegging, eigendom, betaling en GDPR.",
    staticHtml: `
<div id="root">
  <header>
    <nav>
      <a href="/">Abonnement.Website</a>
      <a href="/#pricing">Prijzen</a>
      <a href="/login">Inloggen</a>
    </nav>
  </header>
  <main>
    <nav aria-label="Breadcrumb">
      <a href="/">Home</a> &rsaquo; <span>Algemene Voorwaarden</span>
    </nav>
    <h1>Algemene Voorwaarden \u2014 Abonnement.website</h1>
    <p>Lees de algemene voorwaarden van Abonnement.website (Saerens Advertising). Alles over abonnementen, looptijd, opzegging, eigendom, betaling en GDPR.</p>
    <h2>Abonnement &amp; looptijd</h2>
    <p>Abonnementen worden afgesloten voor een minimumperiode van 6 maanden en worden per kwartaal vooruit gefactureerd.</p>
    <h2>Opzegging</h2>
    <p>Na de minimumperiode kunt u opzeggen met een opzegtermijn van \u00e9\u00e9n maand.</p>
    <h2>Betaling</h2>
    <p>Facturatie vindt per kwartaal vooruit plaats via Stripe. Er zijn geen opstartkosten.</p>
    <h2>Eigendom</h2>
    <p>Teksten en afbeeldingen die u aanlevert blijven uw eigendom. Het website-ontwerp blijft eigendom van Abonnement.Website tijdens de abonnementsperiode.</p>
    <h2>Contact</h2>
    <p>Vragen over deze voorwaarden? Neem contact op via onze website.</p>
  </main>
  <footer>
    <p>Abonnement.Website</p>
    <a href="/">Home</a> | <a href="/privacy">Privacybeleid</a>
  </footer>
</div>`,
  },

  "/offerte": {
    title: `Offerte Aanvragen | ${SITE_NAME}`,
    description:
      "Vraag een vrijblijvende offerte aan voor uw maatwerkwebsite. Ontvang binnen 48 uur een persoonlijke prijsopgave op basis van uw wensen en budget.",
    canonical: `${BASE_URL}/offerte`,
    ogTitle: `Offerte Aanvragen | ${SITE_NAME}`,
    ogDescription:
      "Vraag een vrijblijvende offerte aan voor uw maatwerkwebsite. Ontvang binnen 48 uur een persoonlijke prijsopgave op basis van uw wensen en budget.",
    staticHtml: `
<div id="root">
  <header>
    <nav>
      <a href="/">Abonnement.Website</a>
      <a href="/#pricing">Prijzen</a>
      <a href="/login">Inloggen</a>
    </nav>
  </header>
  <main>
    <nav aria-label="Breadcrumb">
      <a href="/">Home</a> &rsaquo; <span>Offerte Aanvragen</span>
    </nav>
    <h1>Vraag een vrijblijvende offerte aan</h1>
    <p>Heeft u een specifiek project in gedachten dat verder gaat dan onze standaard abonnementen? Vul het formulier in en ontvang binnen 48 uur een persoonlijke prijsopgave op maat.</p>
    <p>Wij helpen u graag verder met maatwerk webprojecten voor uw bedrijf.</p>
    <a href="/signup">Of start direct met een standaard abonnement</a>
  </main>
  <footer>
    <p>Abonnement.Website</p>
    <a href="/">Home</a> | <a href="/#pricing">Prijzen</a> | <a href="/privacy">Privacy</a>
  </footer>
</div>`,
  },

  "/werkwijze": {
    title: "Werkwijze | Van Bestelling tot Live in 10 Dagen",
    description:
      "Zo werkt abonnement.website: bestel, vul de intake in, wij bouwen en binnen 10 werkdagen is je professionele website live. Geen technische kennis nodig.",
    canonical: `${BASE_URL}/werkwijze`,
    ogImage: DEFAULT_OG_IMAGE,
    staticHtml: `
<div id="root">
  <header>
    <nav>
      <a href="/">Abonnement.Website</a>
      <a href="/#pricing">Prijzen</a>
      <a href="/werkwijze">Werkwijze</a>
      <a href="/blog">Blog</a>
      <a href="/login">Inloggen</a>
    </nav>
  </header>
  <main>
    <section>
      <h1>Van bestelling tot live in 10 dagen</h1>
      <p>Zo werkt abonnement.website: je bestelt online, vult de intake in, wij ontwerpen en bouwen je website, en binnen 10 werkdagen sta je live. Geen technische kennis nodig.</p>
      <a href="/signup">Direct starten</a>
    </section>
    <section>
      <h2>Zo verloopt het proces</h2>
      <ol>
        <li><strong>Bestel je abonnement:</strong> kies je add-ons en rond de betaling af. Geen opstartkosten.</li>
        <li><strong>Vul de intake in:</strong> vertel over je bedrijf, huisstijl en wensen via een korte online vragenlijst.</li>
        <li><strong>Wij bouwen je website:</strong> design, teksten structureren, hosting en SSL \u2014 alles wordt voor je geregeld.</li>
        <li><strong>Feedback en livegang:</strong> je bekijkt het voorstel, geeft feedback en binnen 10 werkdagen staat je site live.</li>
      </ol>
    </section>
    <section>
      <h2>Veelgestelde vragen</h2>
      <dl>
        <dt>Heb ik technische kennis nodig?</dt>
        <dd>Nee. Wij regelen design, bouw, hosting, onderhoud en updates. Jij levert alleen input over je bedrijf.</dd>
        <dt>Wat als ik langer nodig heb voor de intake of feedback?</dt>
        <dd>De doorlooptijd van 10 dagen geldt bij tijdige reactie. Heb je meer tijd nodig, dan schuift de planning gewoon mee.</dd>
      </dl>
    </section>
  </main>
  <footer>
    <p>Abonnement.Website</p>
    <a href="/">Home</a> | <a href="/#pricing">Prijzen</a> | <a href="/offerte">Offerte aanvragen</a> | <a href="/privacy">Privacy</a>
  </footer>
</div>`,
  },

  "/consentease": {
    title: "ConsentEase: Cookiebanner & Compliance Inbegrepen",
    description:
      "Bij elk abonnement.website-plan zit ConsentEase inbegrepen: cookiebanner, automatische scan, Google Consent Mode v2 en policy generator. Geen extra kosten.",
    canonical: `${BASE_URL}/consentease`,
    ogImage: DEFAULT_OG_IMAGE,
    staticHtml: `
<div id="root">
  <header>
    <nav>
      <a href="/">Abonnement.Website</a>
      <a href="/#pricing">Prijzen</a>
      <a href="/consentease">ConsentEase</a>
      <a href="/blog">Blog</a>
      <a href="/login">Inloggen</a>
    </nav>
  </header>
  <main>
    <section>
      <h1>Cookie compliance? Geregeld.</h1>
      <p>Bij elk abonnement.website-plan zit ConsentEase inbegrepen: een complete cookie-compliance-oplossing met cookiebanner, automatische scan, Google Consent Mode v2 en policy generator. Zonder extra kosten.</p>
      <a href="/signup">Direct starten</a>
    </section>
    <section>
      <h2>Wat zit erin?</h2>
      <ul>
        <li><strong>Cookiebanner op maat:</strong> in de stijl van je website, AVG/GDPR-conform voor Nederland en Belgi\u00eb.</li>
        <li><strong>Automatische cookiescan:</strong> je site wordt periodiek gescand zodat je cookieverklaring actueel blijft.</li>
        <li><strong>Google Consent Mode v2:</strong> correcte doorgifte van toestemming aan Google Analytics en Ads.</li>
        <li><strong>Policy generator:</strong> automatisch gegenereerde cookie- en privacyverklaring.</li>
      </ul>
    </section>
  </main>
  <footer>
    <p>Abonnement.Website</p>
    <a href="/">Home</a> | <a href="/#pricing">Prijzen</a> | <a href="/offerte">Offerte aanvragen</a> | <a href="/privacy">Privacy</a>
  </footer>
</div>`,
  },

  "/betaalbare-professionele-website": {
    title: "Betaalbare professionele website voor starters en zelfstandigen",
    description:
      "Betaalbare professionele website vanaf \u20ac69 per maand. Voor starters en zelfstandigen in NL en Belgi\u00eb. Geen opstartkosten, binnen 10 werkdagen live.",
    canonical: `${BASE_URL}/betaalbare-professionele-website`,
    ogTitle: "Betaalbare professionele website voor starters en zelfstandigen",
    ogDescription:
      "Betaalbare professionele website vanaf \u20ac69 per maand. Voor starters en zelfstandigen in NL en Belgi\u00eb. Geen opstartkosten, binnen 10 werkdagen live.",
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: "Betaalbare professionele website als abonnement",
          serviceType: "Website laten maken op abonnementsbasis",
          description:
            "Professionele website voor starters en zelfstandigen vanaf \u20ac69 per maand. Inclusief design, hosting, onderhoud en support. Geen opstartkosten.",
          areaServed: ["Nederland", "Belgi\u00eb"],
          provider: {
            "@type": "Organization",
            name: "Abonnement.Website",
            url: "https://abonnement.website",
          },
          offers: {
            "@type": "Offer",
            price: "69",
            priceCurrency: "EUR",
            url: "https://abonnement.website/betaalbare-professionele-website",
          },
        },
        {
          "@type": "FAQPage",
          mainEntity: betaalbareWebsiteFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
      ],
    },
    staticHtml: `
<div id="root">
  <header>
    <nav>
      <a href="/">Abonnement.Website</a>
      <a href="/#pricing">Prijzen</a>
      <a href="/login">Inloggen</a>
    </nav>
  </header>
  <main>
    <section>
      <span>VOOR STARTERS &amp; ZELFSTANDIGEN</span>
      <h1>Een betaalbare professionele website vanaf \u20ac69 per maand</h1>
      <p>Professioneel online zonder grote investering vooraf. Design, hosting, onderhoud en support in \u00e9\u00e9n vast maandbedrag \u2014 ideaal voor starters, zzp\u2019ers en zelfstandigen in Nederland en Belgi\u00eb.</p>
      <a href="/signup">Direct starten</a>
      <a href="/#pricing">Bekijk abonnementen</a>
    </section>
    <section>
      <h2>Voordelen van een website abonnement</h2>
      <ul>
        <li><strong>Geen dure investering vooraf:</strong> Geen opstartkosten van honderden of duizenden euro\u2019s. Je betaalt \u00e9\u00e9n vast bedrag per maand.</li>
        <li><strong>Binnen 10 werkdagen live:</strong> Na een korte intake bouwen we je website en zetten we hem voor je live.</li>
        <li><strong>Alles inbegrepen:</strong> Design, hosting, SSL, onderhoud, updates, support en 2 wijzigingscredits per maand zitten in het abonnement.</li>
        <li><strong>Persoonlijk aanspreekpunt:</strong> Een vaste contactpersoon die je bedrijf kent.</li>
      </ul>
    </section>
    <section>
      <h2>Voor wie is dit?</h2>
      <ul>
        <li>Starters die net hun zaak hebben opgestart</li>
        <li>Zzp\u2019ers en freelancers (Nederland)</li>
        <li>Zelfstandigen en eenmanszaken (Belgi\u00eb)</li>
        <li>Kleine kmo\u2019s en mkb-bedrijven</li>
        <li>Lokale dienstverleners en winkels</li>
      </ul>
    </section>
    <section>
      <h2>Veelgestelde vragen</h2>
      <dl>
        <dt>Wat kost een professionele website bij jullie?</dt>
        <dd>Je betaalt vanaf \u20ac69 per maand. Daarin zitten design, hosting, onderhoud en support. Er zijn geen opstartkosten en geen verrassingen achteraf.</dd>
        <dt>Hoe snel staat mijn website online?</dt>
        <dd>Gemiddeld binnen 10 werkdagen. Na je aanmelding plannen we een korte intake, bouwen we je site en zetten we hem live.</dd>
        <dt>Ben ik eigenaar van mijn website en content?</dt>
        <dd>Ja. De teksten en beelden die je aanlevert blijven 100% van jou. We werken met een minimumtermijn van 6 maanden.</dd>
      </dl>
    </section>
  </main>
  <footer>
    <p>Abonnement.Website</p>
    <a href="/">Home</a> | <a href="/#pricing">Prijzen</a> | <a href="/offerte">Offerte aanvragen</a> | <a href="/privacy">Privacy</a>
  </footer>
</div>`,
  },
};

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function injectRouteMetadata(html: string, pathname: string): string {
  const meta = ROUTE_METADATA[pathname] ?? getBlogMetadata(pathname);
  if (!meta) return html;

  const ogTitle = meta.ogTitle ?? meta.title;
  const ogDescription = meta.ogDescription ?? meta.description;
  const ogImage = meta.ogImage ?? DEFAULT_OG_IMAGE;
  const twitterTitle = meta.twitterTitle ?? ogTitle;
  const twitterDescription = meta.twitterDescription ?? ogDescription;

  let result = html;

  result = result.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtmlAttr(meta.title)}</title>`,
  );

  result = result.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtmlAttr(meta.description)}" />`,
  );

  result = result.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${meta.canonical}" />`,
  );

  result = result.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeHtmlAttr(ogTitle)}" />`,
  );
  result = result.replace(
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtmlAttr(ogDescription)}" />`,
  );
  result = result.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${meta.canonical}" />`,
  );
  result = result.replace(
    /<meta property="og:image" content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${escapeHtmlAttr(ogImage)}" />`,
  );
  result = result.replace(
    /<meta property="og:image:alt" content="[^"]*"\s*\/>/,
    `<meta property="og:image:alt" content="${escapeHtmlAttr(ogTitle)}" />`,
  );

  result = result.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtmlAttr(twitterTitle)}" />`,
  );
  result = result.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtmlAttr(twitterDescription)}" />`,
  );
  result = result.replace(
    /<meta name="twitter:image" content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${escapeHtmlAttr(ogImage)}" />`,
  );
  result = result.replace(
    /<meta name="twitter:image:alt" content="[^"]*"\s*\/>/,
    `<meta name="twitter:image:alt" content="${escapeHtmlAttr(ogTitle)}" />`,
  );

  if (meta.structuredData) {
    result = result.replace(
      "</head>",
      `<script type="application/ld+json" data-route-prerender="true">${serializeJsonLd(meta.structuredData)}</script>\n  </head>`,
    );
  }

  result = result.replace(
    '<div id="root"></div>',
    meta.staticHtml,
  );

  return result;
}
