import { db } from "./db";
import { plans, addOns, users, specialistProfiles, blogPosts } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function seed() {
  console.log("Seeding database...");

  const existingPlans = await db.select().from(plans);
  if (existingPlans.length === 0) {
    console.log("Creating plans...");
    await db.insert(plans).values([
      {
        name: "Starter",
        tier: "LOW",
        monthlyPriceCents: 9900,
        yearlyPriceCents: 99000,
        includedPages: 5,
        includedCredits: 2,
        includedTemplatesMax: 3,
        features: [
          "Professionele website",
          "Beheerde hosting",
          "SSL certificaat",
          "Basis SEO",
          "Email support",
        ],
        slaText: "Response binnen 48 uur",
        isActive: true,
      },
      {
        name: "Professional",
        tier: "MEDIUM",
        monthlyPriceCents: 19900,
        yearlyPriceCents: 199000,
        includedPages: 10,
        includedCredits: 5,
        includedTemplatesMax: 10,
        features: [
          "Alles in Starter",
          "10 premium templates",
          "Geavanceerde SEO",
          "Analytics dashboard",
          "Priority support",
          "Maandelijks rapport",
        ],
        slaText: "Response binnen 24 uur",
        isActive: true,
      },
      {
        name: "Enterprise",
        tier: "HIGH",
        monthlyPriceCents: 49900,
        yearlyPriceCents: 499000,
        includedPages: 999,
        includedCredits: 20,
        includedTemplatesMax: 999,
        features: [
          "Alles in Professional",
          "Custom design",
          "Onbeperkte paginas",
          "Dedicated specialist",
          "Telefoon support",
          "SLA garantie",
        ],
        slaText: "Response binnen 4 uur",
        isActive: true,
      },
    ]);
    console.log("Plans created");
  }

  const existingAddOns = await db.select().from(addOns);
  if (existingAddOns.length === 0) {
    console.log("Creating add-ons...");
    await db.insert(addOns).values([
      {
        slug: "google-ads",
        name: "Google Ads Beheer",
        description: "Professioneel beheer van uw Google Ads campagnes met maandelijkse optimalisatie en rapportage.",
        baseFeeCents: 0,
        requiresBudget: true,
        minBudgetCents: 50000,
        mediaPercentageMin: 80,
        mediaPercentageMax: 90,
        mediaPercentageDefault: 85,
        isActive: true,
      },
      {
        slug: "meta-ads",
        name: "Meta Ads Beheer",
        description: "Beheer van Facebook en Instagram advertenties met doelgroep targeting en A/B testing.",
        baseFeeCents: 0,
        requiresBudget: true,
        minBudgetCents: 50000,
        mediaPercentageMin: 80,
        mediaPercentageMax: 90,
        mediaPercentageDefault: 85,
        isActive: true,
      },
      {
        slug: "seo",
        name: "SEO Optimalisatie",
        description: "Maandelijkse SEO optimalisatie inclusief keyword research, content suggesties en technische audits.",
        baseFeeCents: 29900,
        requiresBudget: false,
        isActive: true,
      },
      {
        slug: "content",
        name: "Content Creatie",
        description: "Professionele content voor uw website inclusief blogartikelen en landingpages.",
        baseFeeCents: 39900,
        requiresBudget: false,
        isActive: true,
      },
      {
        slug: "local-seo",
        name: "Lokale SEO",
        description: "Optimalisatie voor lokale zoekopdrachten inclusief Google Business Profile beheer.",
        baseFeeCents: 19900,
        requiresBudget: false,
        isActive: true,
      },
    ]);
    console.log("Add-ons created");
  }

  const existingAdmins = await db.select().from(users).where(eq(users.role, "ADMIN"));
  if (existingAdmins.length === 0) {
    console.log("Creating admin user...");
    const passwordHash = await hashPassword("admin123");
    await db.insert(users).values({
      email: "admin@websiteabonnementen.nl",
      name: "Platform Admin",
      passwordHash,
      role: "ADMIN",
    });
    console.log("Admin user created (email: admin@websiteabonnementen.nl, password: admin123)");
  } else {
    console.log("Updating admin password to use bcrypt...");
    const passwordHash = await hashPassword("admin123");
    await db.update(users)
      .set({ passwordHash })
      .where(eq(users.email, "admin@websiteabonnementen.nl"));
    console.log("Admin password updated");
  }

  const existingBlogPosts = await db.select().from(blogPosts);
  if (existingBlogPosts.length === 0) {
    console.log("Creating first blog post...");
    await db.insert(blogPosts).values({
      slug: "wat-kost-een-website-laten-maken-2025",
      title: "Wat kost een website laten maken in 2025?",
      metaTitle: "Wat kost een website laten maken in 2025? | Complete Prijsgids",
      metaDescription: "Ontdek wat een professionele website kost in 2025. Van eenmalige kosten tot maandelijkse abonnementen. Vergelijk opties en vind de beste oplossing voor uw budget.",
      focusKeyword: "wat kost een website",
      supportingKeywords: ["website laten maken kosten", "website prijzen", "professionele website kosten", "website abonnement"],
      featuredImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop",
      featuredImageAlt: "Laptop met website ontwerp en rekenmachine voor kostenbepaling",
      intro: "Een professionele website is essentieel voor elk bedrijf, maar wat kost een website laten maken eigenlijk in 2025? De prijzen variëren enorm - van enkele honderden tot tienduizenden euros. In dit artikel bespreken we alle factoren die de prijs bepalen en helpen we u de juiste keuze te maken voor uw budget en doelen.",
      keyTakeaways: [
        "Een eenvoudige website kost tussen de €500 en €2.500 eenmalig",
        "Maandelijkse abonnementen starten vanaf €99 per maand inclusief onderhoud",
        "Lopende kosten zoals hosting en onderhoud worden vaak vergeten bij eenmalige aankopen",
        "Een website abonnement biedt voorspelbare kosten en professioneel beheer",
        "De totale kosten hangen af van functionaliteit, design en doorlopende support"
      ],
      content: `
<h2>De verschillende manieren om een website te laten maken</h2>
<p>Er zijn verschillende manieren om aan een professionele website te komen. Elke optie heeft zijn eigen voor- en nadelen qua kosten, kwaliteit en gemak.</p>

<h3>1. Doe-het-zelf met een website builder</h3>
<p>Platforms zoals Wix, Squarespace en WordPress.com bieden gebruiksvriendelijke website builders. De kosten variëren van gratis (met beperkingen) tot ongeveer €30 per maand voor premium plannen.</p>
<p><strong>Voordelen:</strong> Laagste kosten, volledige controle</p>
<p><strong>Nadelen:</strong> Kost veel tijd, beperkte professionaliteit, geen support</p>

<h3>2. Freelance webdesigner</h3>
<p>Een freelancer kan een website maken voor €500 tot €5.000, afhankelijk van complexiteit en ervaring.</p>
<p><strong>Voordelen:</strong> Persoonlijke aanpak, maatwerk mogelijk</p>
<p><strong>Nadelen:</strong> Wisselende kwaliteit, onderhoud vaak niet inbegrepen</p>

<h3>3. Webbureau</h3>
<p>Professionele webbureaus rekenen €2.000 tot €20.000+ voor een complete website.</p>
<p><strong>Voordelen:</strong> Hoge kwaliteit, uitgebreide functionaliteit</p>
<p><strong>Nadelen:</strong> Hoge eenmalige kosten, aparte onderhoudscontracten nodig</p>

<h3>4. Website abonnement</h3>
<p>Bij een website abonnement betaalt u een vast maandelijks bedrag (€99-€499) voor een professionele website inclusief hosting, onderhoud, updates en support.</p>
<p><strong>Voordelen:</strong> Voorspelbare kosten, alles inbegrepen, professioneel beheer</p>
<p><strong>Nadelen:</strong> Doorlopende verplichting</p>

<h2>Waar worden de kosten door bepaald?</h2>
<p>De prijs van een website wordt door verschillende factoren beïnvloed:</p>

<h3>Design en maatwerk</h3>
<p>Een template-gebaseerd ontwerp is goedkoper dan volledig maatwerk. Custom designs kosten al snel €1.000-€5.000 extra.</p>

<h3>Aantal pagina's</h3>
<p>Meer pagina's betekent meer werk. Een one-page website is goedkoper dan een uitgebreide bedrijfswebsite met 20+ pagina's.</p>

<h3>Functionaliteit</h3>
<p>Speciale functies zoals webshops, boekingssystemen of ledenportalen verhogen de kosten aanzienlijk.</p>

<h3>Content creatie</h3>
<p>Professionele teksten, foto's en video's zijn vaak niet inbegrepen en kosten extra.</p>

<h2>Verborgen kosten bij eenmalige websites</h2>
<p>Bij het vergelijken van prijzen worden de lopende kosten vaak vergeten:</p>
<ul>
<li><strong>Hosting:</strong> €50-€300 per jaar</li>
<li><strong>Domeinnaam:</strong> €10-€50 per jaar</li>
<li><strong>SSL-certificaat:</strong> €0-€100 per jaar</li>
<li><strong>Updates en onderhoud:</strong> €500-€2.000 per jaar</li>
<li><strong>Beveiliging:</strong> €100-€500 per jaar</li>
</ul>
<p>Deze kosten kunnen oplopen tot €1.000-€3.000 per jaar bovenop de eenmalige investering.</p>

<h2>Waarom kiezen voor een website abonnement?</h2>
<p>Een website abonnement biedt een aantrekkelijk alternatief voor traditionele website-aankopen:</p>
<ul>
<li><strong>Geen grote eenmalige investering</strong> - Start direct zonder kapitaal</li>
<li><strong>Alles inbegrepen</strong> - Hosting, onderhoud, SSL en support</li>
<li><strong>Altijd up-to-date</strong> - Automatische updates en beveiliging</li>
<li><strong>Professionele ondersteuning</strong> - Hulp wanneer u het nodig heeft</li>
<li><strong>Flexibel</strong> - Schaal mee met uw bedrijf</li>
</ul>

<h2>Conclusie: wat is de beste keuze?</h2>
<p>De beste keuze hangt af van uw situatie. Voor de meeste MKB-bedrijven is een website abonnement de slimste optie: u krijgt een professionele website zonder grote investering, met voorspelbare maandelijkse kosten en professioneel beheer.</p>
<p>Wilt u weten wat de beste oplossing is voor uw bedrijf? <a href="/contact">Neem contact met ons op</a> voor een vrijblijvend adviesgesprek.</p>
`,
      authorBio: "Het WebsiteAbonnementen team bestaat uit ervaren webdesigners en online marketing specialisten die MKB-bedrijven helpen groeien met professionele websites en online strategieën.",
      ctaText: "Klaar om te starten met uw professionele website?",
      ctaLink: "/pricing",
      status: "PUBLISHED",
      publishedAt: new Date(),
      readTimeMinutes: 8,
      category: "Kosten & Budget",
    });
    console.log("Blog post created");
  }

  console.log("Seeding completed!");
}

seed().catch(console.error).finally(() => process.exit(0));
