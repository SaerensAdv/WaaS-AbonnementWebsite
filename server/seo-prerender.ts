import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

const BOT_USER_AGENTS = [
  "googlebot",
  "bingbot",
  "yandexbot",
  "duckduckbot",
  "slurp",
  "baiduspider",
  "facebookexternalhit",
  "twitterbot",
  "linkedinbot",
  "embedly",
  "quora link preview",
  "showyoubot",
  "outbrain",
  "pinterest",
  "applebot",
  "semrushbot",
  "ahrefsbot",
  "mj12bot",
  "dotbot",
  "petalbot",
  "bytespider",
  "wincher",
  "screaming frog",
  "sitebulb",
  "seobility",
  "rogerbot",
  "ia_archiver",
  "archive.org_bot",
];

interface SeoContent {
  title: string;
  description: string;
  h1: string;
  bodyText: string;
  keywords?: string[];
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

const staticPageContent: Record<string, SeoContent> = {
  "/": {
    title: "Website Abonnement | Professionele Website Vanaf €99/maand",
    description: "Een website abonnement zonder zorgen. Professioneel ontwerp, hosting, onderhoud en support inbegrepen. Geen technische kennis nodig. Start vandaag met uw website op abonnementsbasis.",
    h1: "Website abonnement zonder zorgen",
    bodyText: `Professioneel ontwerp, hosting, onderhoud en support - alles inbegrepen in één vast maandbedrag. Geen technische kennis nodig. Wij regelen alles, u focust op uw bedrijf.

Wat zit er in uw website abonnement? Professioneel webdesign op maat, snelle en veilige hosting, continue updates en onderhoud, SEO-optimalisatie, en persoonlijke support.

Uw website abonnement in 4 stappen: Kies uw abonnement, selecteer een template, wij bouwen uw website, en u gaat live.

Waarom een website abonnement? Focus op uw bedrijf terwijl wij uw online aanwezigheid verzorgen. Geen grote eenmalige investering, altijd de nieuwste technologie, en support wanneer u het nodig heeft.

Kies uw website abonnement: Starter vanaf €99/maand, Professional vanaf €199/maand, of Enterprise op maat. Alle abonnementen zijn maandelijks opzegbaar.`,
    keywords: ["website abonnement", "professionele website", "website laten maken", "website onderhoud", "hosting"],
  },
  "/pricing": {
    title: "Prijzen | Website Abonnement vanaf €99/maand",
    description: "Transparante prijzen voor uw website abonnement. Starter €99/maand, Professional €199/maand, Enterprise op maat. Alles inbegrepen, geen verborgen kosten.",
    h1: "Kies uw website abonnement",
    bodyText: `Transparante prijzen, geen verrassingen. Elk abonnement bevat professioneel webdesign, hosting, onderhoud, SSL-certificaat en support.

Starter - €99/maand: Perfect voor starters en kleine ondernemingen. Inclusief professionele website tot 5 pagina's, hosting en onderhoud, SSL-beveiliging, en e-mail support.

Professional - €199/maand: Ideaal voor groeiende bedrijven. Alles van Starter plus website tot 15 pagina's, SEO-optimalisatie, Google Analytics, maandelijkse rapportages, en prioriteit support.

Enterprise - Op maat: Voor bedrijven met specifieke wensen. Alles van Professional plus onbeperkte pagina's, custom functionaliteiten, dedicated specialist, en 24/7 support.

Alle abonnementen zijn maandelijks opzegbaar. Geen opstartkosten, geen verborgen kosten.`,
    keywords: ["website abonnement prijzen", "website kosten", "website laten maken prijs"],
  },
  "/about": {
    title: "Over Ons | Abonnement.Website - Belgisch Webbureau",
    description: "Leer meer over Abonnement.Website. Een Belgisch webbureau dat professionele websites op abonnementsbasis levert. Kwaliteit, transparantie en persoonlijke service.",
    h1: "Over Abonnement.Website",
    bodyText: `Wij zijn Abonnement.Website, een Belgisch webbureau gespecialiseerd in professionele websites op abonnementsbasis.

Onze missie is om elke ondernemer toegang te geven tot een professionele website zonder grote eenmalige investering. Wij geloven dat een goede website geen luxe maar een noodzaak is voor elk modern bedrijf.

Waarom klanten voor ons kiezen: Transparante prijzen zonder verrassingen, persoonlijke begeleiding door ervaren specialisten, en websites die écht resultaat opleveren.

Ons team bestaat uit ervaren webdesigners, developers en online marketeers die samenwerken om uw online succes te realiseren.`,
    keywords: ["webbureau België", "website laten maken België", "professioneel webbureau"],
  },
  "/blog": {
    title: "Blog | Tips over Websites, SEO en Online Marketing",
    description: "Lees onze blog voor praktische tips over websites, SEO, online marketing en meer. Geschreven door experts voor ondernemers.",
    h1: "Blog",
    bodyText: `Ontdek praktische tips en inzichten over websites, SEO, online marketing en meer. Onze experts delen hun kennis om u te helpen online succes te behalen.

Populaire onderwerpen: Wat kost een website laten maken, website onderhoud tips, lokale SEO voor bedrijven, WordPress onderhoud, en meer.`,
    keywords: ["website tips", "SEO blog", "online marketing tips"],
  },
  "/projecten": {
    title: "Projecten | Bekijk Onze Gerealiseerde Websites",
    description: "Bekijk onze portfolio met gerealiseerde websites. Van kleine ondernemingen tot grote bedrijven - ontdek wat wij voor u kunnen betekenen.",
    h1: "Onze Projecten",
    bodyText: `Bekijk een selectie van websites die wij hebben gerealiseerd voor onze klanten. Van lokale ondernemers tot grotere bedrijven - elke website is op maat gemaakt.

Onze aanpak: Wij luisteren naar uw wensen, ontwerpen een website die bij uw merk past, en zorgen voor technische perfectie. Het resultaat? Websites die niet alleen mooi zijn, maar ook resultaat opleveren.`,
    keywords: ["website portfolio", "gerealiseerde websites", "website voorbeelden"],
  },
  "/templates": {
    title: "Templates | Kies Uw Website Design",
    description: "Bekijk onze professionele website templates. Kies een design dat bij uw bedrijf past en wij passen het aan naar uw wensen.",
    h1: "Website Templates",
    bodyText: `Kies uit onze collectie professionele website templates. Elk template is volledig aanpasbaar aan uw huisstijl en wensen.

Onze templates zijn geoptimaliseerd voor snelheid, SEO en conversie. Of u nu een restaurant, advocatenkantoor, webshop of dienstverlenend bedrijf heeft - wij hebben een passend design.`,
    keywords: ["website templates", "website designs", "website voorbeelden"],
  },
  "/contact": {
    title: "Contact | Neem Contact Op met Abonnement.Website",
    description: "Neem contact op met Abonnement.Website. Wij helpen u graag met al uw vragen over website abonnementen.",
    h1: "Contact",
    bodyText: `Heeft u vragen over onze website abonnementen? Wij helpen u graag.

U kunt ons bereiken via e-mail, telefoon of het contactformulier. Wij reageren binnen 24 uur op werkdagen.`,
    keywords: ["contact webbureau", "website hulp"],
  },
  "/specialists": {
    title: "Specialisten | Ons Team van Experts",
    description: "Maak kennis met onze specialisten. Ervaren webdesigners, developers en online marketeers die werken aan uw succes.",
    h1: "Onze Specialisten",
    bodyText: `Ons team bestaat uit ervaren professionals op het gebied van webdesign, development en online marketing.

Elke klant krijgt een vaste contactpersoon die uw project begeleidt van begin tot eind. Zo weet u altijd bij wie u terecht kunt.`,
    keywords: ["webdesigners", "developers", "online marketeers"],
  },
  "/faq": {
    title: "Veelgestelde Vragen | Website Abonnement FAQ",
    description: "Antwoorden op veelgestelde vragen over website abonnementen. Alles over prijzen, opzegging, onderhoud en meer.",
    h1: "Veelgestelde Vragen",
    bodyText: `Hier vindt u antwoorden op de meest gestelde vragen over onze website abonnementen.

Wat is een website abonnement? Een website abonnement is een all-in-one oplossing waarbij u maandelijks betaalt voor een professionele website inclusief hosting, onderhoud, updates en support.

Wat kost een website abonnement? Onze abonnementen starten vanaf €99 per maand voor Starter, €199 per maand voor Professional, en Enterprise op maat.

Kan ik mijn abonnement opzeggen? Ja, alle abonnementen zijn maandelijks opzegbaar. Geen langlopende contracten.

Wat zit er allemaal in het abonnement? Professioneel webdesign, snelle hosting, SSL-certificaat, continue updates, onderhoud, en persoonlijke support.

Hoe lang duurt het voordat mijn website online is? Gemiddeld is uw website binnen 2-4 weken live, afhankelijk van de complexiteit.`,
    keywords: ["website abonnement faq", "veelgestelde vragen website", "website abonnement opzeggen"],
  },
  "/vergelijk": {
    title: "Vergelijk Website Oplossingen | Abonnement vs Alternatieven",
    description: "Vergelijk een website abonnement met WordPress, Wix en eenmalige websites. Ontdek welke oplossing het beste bij u past.",
    h1: "Vergelijk Website Oplossingen",
    bodyText: `Twijfelt u tussen een website abonnement en andere oplossingen? Wij helpen u de juiste keuze te maken.

Website Abonnement: Alles-in-één oplossing met professioneel design, hosting, onderhoud en support voor een vast maandbedrag.

WordPress: Flexibel maar vereist technische kennis, apart hosting contract, en regelmatig onderhoud.

Wix: Doe-het-zelf website bouwer, beperkte aanpassingsmogelijkheden, en verborgen kosten.

Eenmalige Website: Grote eenmalige investering plus doorlopende kosten voor hosting en onderhoud.`,
    keywords: ["website vergelijken", "website abonnement vs wordpress", "website abonnement vs wix"],
  },
  "/vergelijk/wordpress": {
    title: "Website Abonnement vs WordPress | Vergelijking 2024",
    description: "Gedetailleerde kostenvergelijking tussen een website abonnement en WordPress over 3 jaar. Ontdek de verborgen kosten.",
    h1: "Website Abonnement vs WordPress",
    bodyText: `Vergelijk de totale kosten van een website abonnement met een zelf-gehoste WordPress website.

WordPress kosten over 3 jaar: Hosting (€150-300/jaar), Premium theme (€50-200 eenmalig), Premium plugins (€100-300/jaar), Onderhoud en updates (tijdsinvestering), Beveiliging (extra plugins nodig).

Website Abonnement voordelen: Geen technische kennis nodig, alles inclusief in één prijs, continue updates en beveiliging, professionele support.

Conclusie: Een website abonnement bespaart u tijd en zorgen, terwijl u een professionele website krijgt tegen voorspelbare kosten.`,
    keywords: ["website abonnement vs wordpress", "wordpress kosten", "wordpress alternatief"],
  },
  "/vergelijk/wix": {
    title: "Website Abonnement vs Wix | Vergelijking 2024",
    description: "Vergelijk een website abonnement met Wix. Inclusief tijdsinvestering en verborgen kosten analyse.",
    h1: "Website Abonnement vs Wix",
    bodyText: `Vergelijk de totale kosten en tijdsinvestering van een website abonnement met Wix.

Wix nadelen: Beperkte aanpassingsmogelijkheden, advertenties op gratis versie, eigen domein alleen met betaald abonnement, geen echte SEO-optimalisatie.

Website Abonnement voordelen: Professioneel op maat design, volledige SEO-optimalisatie, geen Wix-branding, persoonlijke support van experts.

Tijdsinvestering: Met Wix besteedt u uren aan het zelf bouwen. Met een website abonnement doen wij al het werk.`,
    keywords: ["website abonnement vs wix", "wix alternatief", "wix nadelen"],
  },
  "/vergelijk/eenmalig": {
    title: "Website Abonnement vs Eenmalige Website | Kostenvergelijking",
    description: "Vergelijk de totale kosten van een website abonnement met een eenmalige website over 3 jaar.",
    h1: "Website Abonnement vs Eenmalige Website",
    bodyText: `Vergelijk de totale kosten van een website abonnement met een traditionele eenmalige website.

Eenmalige website kosten: Ontwikkeling (€3000-10000 eenmalig), Hosting (€100-200/jaar), Onderhoud en updates (€50-100/maand), Aanpassingen (extra kosten per wijziging).

Website Abonnement: Starter €99/maand all-inclusive, Professional €199/maand all-inclusive, geen onverwachte kosten, maandelijks opzegbaar.

Over 3 jaar: Een eenmalige website kan €6000-15000 kosten. Een website abonnement kost €3564-7164 voor dezelfde periode, met betere service en zonder grote eenmalige investering.`,
    keywords: ["website abonnement vs eenmalig", "website laten maken kosten", "website kosten vergelijken"],
  },
  "/tools": {
    title: "Gratis Website Tools | Bereken uw Website Abonnement",
    description: "Gratis tools voor uw website abonnement: kosten calculator, SEO checker en abonnement vergelijker. Ontdek wat het beste bij u past.",
    h1: "Gratis Website Abonnement Tools",
    bodyText: `Gebruik onze gratis tools om de kosten van een website abonnement te berekenen en te vergelijken.

Website Abonnement Kosten Calculator: Bereken wat een website abonnement u werkelijk kost over meerdere jaren vergeleken met traditionele oplossingen.

SEO Check: Controleer hoe goed uw huidige website scoort op zoekmachines.

Website Abonnement Vergelijker: Vergelijk onze abonnementen (Starter €99, Professional €199) en ontdek welk website abonnement het beste bij uw bedrijf past.`,
    keywords: ["website abonnement calculator", "website abonnement kosten", "abonnement website vergelijken"],
  },
};

export function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

export function generateSeoHtml(content: SeoContent, url: string): string {
  const safeH1 = escapeHtml(content.h1);
  const safeBodyText = escapeHtml(content.bodyText).replace(/\n\n/g, '</p><p>').replace(/\n/g, ' ');
  const safeKeywords = content.keywords?.map(k => escapeHtml(k)).join(", ") || "";
  
  return `
    <div id="seo-prerender" style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;" aria-hidden="true">
      <h1>${safeH1}</h1>
      <p>${safeBodyText}</p>
      ${safeKeywords ? `<meta name="keywords" content="${safeKeywords}">` : ''}
    </div>
  `;
}

export function injectSeoContent(html: string, content: SeoContent, url: string): string {
  const seoHtml = generateSeoHtml(content, url);
  const safeTitle = escapeHtml(content.title);
  const safeDescription = escapeHtml(content.description);
  
  const updatedHtml = html
    .replace(/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`)
    .replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${safeDescription}">`
    );
  
  return updatedHtml.replace('<div id="root">', `${seoHtml}<div id="root">`);
}

export async function getSeoContent(url: string): Promise<SeoContent | null> {
  const path = url.split("?")[0];
  
  if (staticPageContent[path]) {
    return staticPageContent[path];
  }
  
  const blogMatch = path.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    try {
      const post = await storage.getBlogPostBySlug(slug);
      if (post) {
        return {
          title: post.metaTitle || `${post.title} | Abonnement.Website Blog`,
          description: post.metaDescription || "",
          h1: post.title,
          bodyText: post.content.replace(/<[^>]*>/g, " ").substring(0, 2000),
          keywords: post.supportingKeywords || [],
        };
      }
    } catch (error) {
      console.error("Error fetching blog post for SEO:", error);
    }
  }
  
  return null;
}

export function createSeoMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.get("user-agent") || "";
    
    if (!isBot(userAgent)) {
      return next();
    }
    
    const originalSend = res.send.bind(res);
    
    res.send = function(body: any) {
      if (typeof body === "string" && body.includes('<!DOCTYPE html>')) {
        getSeoContent(req.originalUrl).then(content => {
          if (content) {
            const enhancedHtml = injectSeoContent(body, content, req.originalUrl);
            originalSend(enhancedHtml);
          } else {
            originalSend(body);
          }
        }).catch(() => {
          originalSend(body);
        });
        return res;
      }
      return originalSend(body);
    };
    
    next();
  };
}
