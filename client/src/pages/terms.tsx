import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useSEO } from "@/hooks/use-seo";
import { AnimatedDotGrid } from "@/components/animated-dot-grid";
import {
  FadeInUp,
  GlowPulse,
  BlurIn,
  motion,
} from "@/components/ui/motion";
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

const termsBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://abonnement.website/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Algemene Voorwaarden",
      item: "https://abonnement.website/terms",
    },
  ],
};

const lastUpdated = "22 maart 2026";

const sections = [
  {
    id: "definities",
    title: "Artikel 1 — Definities",
    content: [
      "In deze Algemene Voorwaarden wordt verstaan onder:",
      "**Dienstverlener**: Saerens Advertising (eenmanszaak), handelend onder de naam Abonnement.website, ingeschreven in de Kruispuntbank van Ondernemingen onder nummer BE 1019.436.742, gevestigd te Aalst, België.",
      "**Klant**: de natuurlijke persoon of rechtspersoon die een Abonnement afsluit bij Dienstverlener.",
      "**Abonnement**: de overeenkomst tussen Dienstverlener en Klant voor het ontwerpen, bouwen, hosten, onderhouden en ondersteunen van een website tegen een vast maandtarief dat per kwartaal vooruit wordt gefactureerd.",
      "**Website**: de door Dienstverlener ontworpen en gebouwde website ten behoeve van de Klant.",
      "**Add-on**: een aanvullende dienst die naast het Abonnement kan worden afgenomen, zoals Google Ads Beheer, Social Media Beheer of een E-commerce Module.",
      "**Credits**: het maandelijkse budget voor content wijzigingen, uitgedrukt in euro, dat per plan verschilt.",
      "**Onboarding**: het proces waarbij de Klant via een formulier de benodigde informatie en materialen aanlevert voor het bouwen van de Website.",
      "**Minimale Looptijd**: de eerste 6 maanden van het Abonnement, gedurende welke het Abonnement niet kan worden opgezegd.",
    ],
  },
  {
    id: "toepasselijkheid",
    title: "Artikel 2 — Toepasselijkheid",
    content: [
      "2.1. Deze Algemene Voorwaarden zijn van toepassing op alle aanbiedingen, offertes, overeenkomsten en diensten van Dienstverlener.",
      "2.2. Afwijkingen van deze voorwaarden zijn slechts geldig indien deze uitdrukkelijk schriftelijk zijn overeengekomen.",
      "2.3. Door het afsluiten van een Abonnement verklaart de Klant kennis te hebben genomen van en akkoord te gaan met deze Algemene Voorwaarden.",
      "2.4. Dienstverlener behoudt zich het recht voor deze Algemene Voorwaarden te wijzigen. Wijzigingen worden minimaal 30 dagen voor inwerkingtreding per e-mail aan de Klant medegedeeld.",
    ],
  },
  {
    id: "abonnement",
    title: "Artikel 3 — Het Abonnement",
    content: [
      "3.1. Dienstverlener biedt één abonnementsvorm aan:",
      "• **Website-abonnement** (€69/maand) — website op maat tot 5 pagina's, 1 revisieronde bij oplevering, 2 wijzigingscredits per maand inbegrepen.",
      "Het abonnement kan worden uitgebreid met losse add-ons (zoals extra pagina's, SEO, advertentiebeheer, e-commerce of een boekingssysteem) tegen de op de website vermelde tarieven.",
      "3.2. Het abonnement is inclusief: op maat gemaakt design, responsive (mobiel-vriendelijk) ontwikkeling, beheerde hosting, SSL-certificaat, onderhoud, beveiligingsupdates, cookie banner (ConsentEase) en support.",
      "3.3. Er zijn geen opstartkosten verbonden aan het afsluiten van een Abonnement.",
      "3.4. De exacte inhoud en features van het abonnement en de add-ons staan beschreven op de website van Dienstverlener en kunnen van tijd tot tijd worden bijgewerkt.",
    ],
  },
  {
    id: "looptijd",
    title: "Artikel 4 — Looptijd en Opzegging",
    content: [
      "4.1. Het Abonnement heeft een Minimale Looptijd van 6 maanden, ingaand op de datum van de eerste betaling.",
      "4.2. Na de Minimale Looptijd kan het Abonnement worden opgezegd. Opzegging geschiedt via het klantendashboard of per e-mail aan info@abonnement.website.",
      "4.3. Bij opzegging loopt het Abonnement door tot het einde van de lopende, reeds betaalde facturatieperiode. Restitutie van reeds betaalde bedragen vindt niet plaats.",
      "4.4. Dienstverlener is gerechtigd het Abonnement per direct op te zeggen in geval van:",
      "• wanbetaling die voortduurt na de in Artikel 7 genoemde betalingstermijn;",
      "• gebruik van de Website voor onwettige, frauduleuze of schadelijke doeleinden;",
      "• schending van deze Algemene Voorwaarden door de Klant.",
    ],
  },
  {
    id: "oplevering",
    title: "Artikel 5 — Oplevering van de Website",
    content: [
      "5.1. Dienstverlener streeft ernaar de Website binnen 10 werkdagen na ontvangst van alle benodigde materialen op te leveren. Dit betreft een streefdatum en geen harde deadline.",
      "5.2. De Klant is verantwoordelijk voor het tijdig aanleveren van alle benodigde content (teksten, afbeeldingen, logo, huisstijlgegevens) via het Onboarding-formulier.",
      "5.3. Indien de Klant niet binnen 14 dagen na het afsluiten van het Abonnement de benodigde materialen aanlevert, behoudt Dienstverlener zich het recht voor de oplevertermijn evenredig te verlengen.",
      "5.4. Na oplevering van het eerste ontwerp heeft de Klant recht op 1 revisieronde. Aanvullende revisierondes worden als extra wijzigingen verrekend via het credits-systeem.",
      "5.5. De Website wordt pas live gezet na schriftelijke goedkeuring door de Klant, per e-mail of via het klantendashboard.",
    ],
  },
  {
    id: "wijzigingen",
    title: "Artikel 6 — Content Wijzigingen en Credits",
    content: [
      "6.1. Het Abonnement bevat 2 wijzigingscredits per maand. 1 credit staat voor 1 wijziging. Extra credits kunnen worden aangekocht voor €29 per stuk.",
      "6.2. Credits worden ingezet voor reguliere content wijzigingen zoals het aanpassen van teksten, vervangen van afbeeldingen en kleine layout aanpassingen.",
      "6.3. Credits vervallen aan het einde van iedere maand en zijn niet overdraagbaar naar volgende maanden. Ongebruikte Credits worden door Dienstverlener besteed aan achterliggende optimalisaties (SEO, schema markup, Google Search Console, performance).",
      "6.4. De volgende werkzaamheden vallen niet onder reguliere wijzigingen en worden apart geoffreerd:",
      "• Structurele wijzigingen aan het design of de architectuur van de Website;",
      "• Nieuwe integraties of koppelingen met externe systemen;",
      "• Uitbreiding van het aantal pagina's boven de 5 inbegrepen pagina's (hiervoor bestaat de add-on Extra Pagina's);",
      "• Migratie naar een ander platform of betalingssysteem.",
      "6.5. Het actuele creditsaldo is zichtbaar voor de Klant in het klantendashboard.",
    ],
  },
  {
    id: "betaling",
    title: "Artikel 7 — Betaling",
    content: [
      "7.1. Betaling geschiedt per kwartaal vooraf via Stripe: het abonnementsbedrag wordt telkens voor de komende 3 maanden in rekening gebracht (€207 per kwartaal voor het Website-abonnement). De Klant machtigt Dienstverlener om dit bedrag automatisch te incasseren. Maandelijkse betaling is uitsluitend op verzoek en na akkoord van Dienstverlener mogelijk.",
      "7.2. Bij een mislukte betaling heeft de Klant 14 kalenderdagen om het openstaande bedrag te voldoen.",
      "7.3. Indien betaling na deze termijn uitblijft, is Dienstverlener gerechtigd de Website offline te halen en het Abonnement op te schorten totdat volledige betaling is ontvangen.",
      "7.4. Alle genoemde prijzen zijn exclusief BTW, tenzij uitdrukkelijk anders vermeld.",
      "7.5. Dienstverlener behoudt zich het recht voor om prijzen aan te passen. Prijswijzigingen worden minimaal 30 dagen voor inwerkingtreding per e-mail aan de Klant medegedeeld. Bij een prijsverhoging heeft de Klant het recht het Abonnement op te zeggen tegen de datum waarop de prijswijziging ingaat, mits de Minimale Looptijd is verstreken.",
    ],
  },
  {
    id: "addons",
    title: "Artikel 8 — Add-ons",
    content: [
      "8.1. Naast het Abonnement kan de Klant aanvullende Add-ons afnemen, waaronder maar niet beperkt tot: Google Ads Beheer, Meta Ads Beheer, SEO, Lokale SEO, Social Media Beheer, E-commerce Module, Extra Pagina's en Booking/Reserveringssysteem.",
      "8.2. Add-ons worden apart gefactureerd en volgen dezelfde betalingsvoorwaarden als het Abonnement.",
      "8.3. Bij opzegging van het hoofdabonnement worden alle lopende Add-ons automatisch mee opgezegd per dezelfde einddatum.",
      "8.4. Voor Add-ons die betrekking hebben op advertentiebeheer (Google Ads, Meta Ads): het advertentiebudget is altijd exclusief en komt volledig voor rekening van de Klant. Dienstverlener beheert de campagnes maar is niet verantwoordelijk voor de prestaties van advertentieplatformen.",
    ],
  },
  {
    id: "eigendom",
    title: "Artikel 9 — Intellectueel Eigendom",
    content: [
      "9.1. Gedurende de Minimale Looptijd blijven alle intellectuele eigendomsrechten op het design, de code, het CMS en de technische infrastructuur van de Website bij Dienstverlener.",
      "9.2. Na voltooiing van de Minimale Looptijd en bij opzegging van het Abonnement, draagt Dienstverlener het volledige eigendom van de Website (design, code en content) over aan de Klant, onder de volgende voorwaarden:",
      "• De vermelding \"Website by Abonnement.website\" of \"Website by Saerens Advertising\" blijft zichtbaar op de Website, tenzij anders schriftelijk overeengekomen.",
      "• De overdracht vindt plaats binnen 14 werkdagen na de einddatum van het Abonnement.",
      "9.3. Content die door de Klant is aangeleverd (teksten, afbeeldingen, logo's, huisstijlmateriaal) blijft te allen tijde eigendom van de Klant.",
      "9.4. Dienstverlener behoudt het recht om de Website als referentieproject op te nemen in het eigen portfolio, tenzij de Klant hiertegen schriftelijk bezwaar maakt.",
    ],
  },
  {
    id: "domein",
    title: "Artikel 10 — Domeinnaam en Hosting",
    content: [
      "10.1. Dienstverlener registreert en beheert de domeinnaam namens de Klant, tenzij de Klant reeds over een eigen domeinnaam beschikt.",
      "10.2. Indien de Klant een bestaande domeinnaam wil gebruiken, dient de Klant tijdig toegang te verlenen tot de benodigde platforms (DNS-beheer, registrar) om de koppeling te realiseren.",
      "10.3. Bij opzegging na de Minimale Looptijd wordt de domeinnaam overgedragen aan de Klant, mits alle openstaande facturen zijn voldaan.",
      "10.4. Hosting geschiedt via servers in Noord-Amerika (Replit). Dienstverlener garandeert een uptime van minimaal 99,5% op jaarbasis, exclusief gepland onderhoud en overmacht.",
      "10.5. Dienstverlener is niet aansprakelijk voor downtime veroorzaakt door derden, waaronder de hostingprovider, internetproviders of DDoS-aanvallen.",
    ],
  },
  {
    id: "offboarding",
    title: "Artikel 11 — Beëindiging en Offboarding",
    content: [
      "11.1. Bij beëindiging van het Abonnement na de Minimale Looptijd ontvangt de Klant:",
      "• Een volledige export van de Website (design, code en content);",
      "• Overdracht van de domeinnaam (indien geregistreerd door Dienstverlener);",
      "• De mogelijkheid om tegen vergoeding support of training aan te vragen om zelf de Website te beheren.",
      "11.2. Bij beëindiging vóór het verstrijken van de Minimale Looptijd (door wanbetaling of overtreding) heeft de Klant uitsluitend recht op een export van de door de Klant aangeleverde content (teksten en afbeeldingen). Design en code blijven eigendom van Dienstverlener.",
      "11.3. De Website wordt offline gehaald op de einddatum van het Abonnement. Dienstverlener bewaart een backup van de Website gedurende 30 dagen na beëindiging, waarna alle gegevens definitief worden verwijderd.",
    ],
  },
  {
    id: "aansprakelijkheid",
    title: "Artikel 12 — Aansprakelijkheid",
    content: [
      "12.1. De totale aansprakelijkheid van Dienstverlener is te allen tijde beperkt tot het bedrag van één (1) maandelijkse abonnementsvergoeding.",
      "12.2. Dienstverlener is niet aansprakelijk voor:",
      "• Indirecte schade, waaronder gevolgschade, gederfde winst, gemiste omzet of gemiste besparingen;",
      "• Schade als gevolg van het niet of niet tijdig aanleveren van content door de Klant;",
      "• Schade veroorzaakt door onbevoegd gebruik van inloggegevens;",
      "• Downtime, dataverlies of beveiligingsincidenten veroorzaakt door derden;",
      "• Prestaties van advertentiecampagnes (Google Ads, Meta Ads) beheerd als Add-on.",
      "12.3. De Klant vrijwaart Dienstverlener tegen alle aanspraken van derden die voortvloeien uit het gebruik van de Website of de door de Klant aangeleverde content.",
    ],
  },
  {
    id: "vertrouwelijkheid",
    title: "Artikel 13 — Vertrouwelijkheid",
    content: [
      "13.1. Beide partijen verplichten zich tot geheimhouding van alle vertrouwelijke informatie die zij in het kader van het Abonnement van de andere partij ontvangen.",
      "13.2. Deze geheimhoudingsverplichting geldt ook na beëindiging van het Abonnement.",
    ],
  },
  {
    id: "overmacht",
    title: "Artikel 14 — Overmacht",
    content: [
      "14.1. Dienstverlener is niet gehouden tot het nakomen van enige verplichting indien dit wordt verhinderd door overmacht.",
      "14.2. Onder overmacht wordt verstaan: elke omstandigheid buiten de wil van Dienstverlener, waaronder maar niet beperkt tot storingen bij hostingproviders, internetuitval, stroomstoringen, natuurrampen, pandemieën, overheidsmaatregelen en cyberaanvallen.",
      "14.3. Indien de overmachtssituatie langer dan 60 dagen voortduurt, hebben beide partijen het recht het Abonnement te ontbinden zonder schadevergoeding verschuldigd te zijn.",
    ],
  },
  {
    id: "privacy",
    title: "Artikel 15 — Verwerkersovereenkomst (GDPR)",
    content: [
      "15.1. In het kader van het Abonnement verwerkt Dienstverlener persoonsgegevens namens de Klant (als verwerker in de zin van de AVG/GDPR). Dit betreft onder meer gegevens verzameld via contactformulieren, analyticsdiensten en eventuele boekingssystemen op de Website van de Klant.",
      "15.2. **Doel van de verwerking**: Dienstverlener verwerkt persoonsgegevens uitsluitend ten behoeve van het bouwen, hosten, onderhouden en optimaliseren van de Website van de Klant, alsmede het doorsturen van formulierinzendingen naar de Klant.",
      "15.3. **Categorieën gegevens**: naam, e-mailadres, telefoonnummer, IP-adres, browsergegevens, en overige gegevens die bezoekers invullen via formulieren op de Website.",
      "15.4. **Beveiligingsmaatregelen**: Dienstverlener treft passende technische en organisatorische maatregelen ter beveiliging van persoonsgegevens, waaronder SSL-encryptie, regelmatige beveiligingsupdates, toegangscontrole en monitoring.",
      "15.5. **Sub-verwerkers**: Dienstverlener maakt gebruik van de volgende sub-verwerkers:",
      "• **Replit** (hosting, Noord-Amerika) — voor het hosten van de Website;",
      "• **Stripe** (betalingen, EU/VS) — voor het verwerken van betalingen;",
      "• **Google** (analytics) — voor websitestatistieken, indien door de Klant gewenst;",
      "• **ConsentEase** (cookie management) — voor het beheren van cookietoestemming.",
      "15.6. Dienstverlener zal de Klant zonder onredelijke vertraging informeren over een datalek dat persoonsgegevens van de Klant betreft.",
      "15.7. Bij beëindiging van het Abonnement worden alle persoonsgegevens die Dienstverlener namens de Klant verwerkt, binnen 30 dagen verwijderd of aan de Klant overgedragen, naar keuze van de Klant.",
      "15.8. De Klant blijft als verwerkingsverantwoordelijke verantwoordelijk voor het plaatsen van een correct privacybeleid op de Website en het informeren van bezoekers over de verwerking van hun gegevens.",
    ],
  },
  {
    id: "slotbepalingen",
    title: "Artikel 16 — Slotbepalingen",
    content: [
      "16.1. Op deze Algemene Voorwaarden is het Belgisch recht van toepassing.",
      "16.2. Geschillen die voortvloeien uit of verband houden met deze Algemene Voorwaarden worden voorgelegd aan de bevoegde rechtbank van het arrondissement Aalst, België.",
      "16.3. Indien enige bepaling van deze Algemene Voorwaarden nietig of ongeldig wordt verklaard, blijven de overige bepalingen onverminderd van kracht.",
      "16.4. Dienstverlener behoudt zich het recht voor deze Algemene Voorwaarden te wijzigen. De meest recente versie is steeds beschikbaar op de website van Dienstverlener.",
    ],
  },
];

export default function TermsPage() {
  useSEO({
    title: "Algemene Voorwaarden — Abonnement.website",
    description:
      "Lees de algemene voorwaarden van Abonnement.website (Saerens Advertising). Alles over abonnementen, looptijd, opzegging, eigendom, betaling en GDPR.",
    canonical: "/terms",
    structuredData: termsBreadcrumbSchema,
  });

  return (
    <MarketingLayout>
      <section
        className="relative min-h-[40vh] flex flex-col overflow-hidden pt-[72px]"
        data-testid="section-terms-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />
        <AnimatedDotGrid
          className="opacity-80"
          dotSize={1}
          gap={35}
          baseOpacity={0.06}
          accentColor="59, 130, 246"
        />
        <GlowPulse className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

        <div className="container mx-auto px-4 relative z-10 pt-8">
          <BreadcrumbNav
            items={[{ label: "Algemene Voorwaarden" }]}
            className="[&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/70"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Juridisch document
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </BlurIn>

            <BlurIn delay={0.1}>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-8"
                data-testid="text-terms-hero-title"
              >
                Algemene Voorwaarden
              </h1>
            </BlurIn>

            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Transparantie en eerlijkheid — zo werken wij samen. Hieronder
                vindt u de volledige voorwaarden die van toepassing zijn op onze
                dienstverlening.
              </p>
            </BlurIn>
          </div>
        </div>
      </section>

      <section className="py-8 border-b" data-testid="section-terms-nav">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground mb-3 font-medium">
              Spring naar:
            </p>
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`}>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-colors text-xs"
                    data-testid={`nav-term-${s.id}`}
                  >
                    {s.title.replace(/Artikel \d+ — /, "")}
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-terms-content">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            {sections.map((section, sectionIndex) => (
              <FadeInUp key={section.id} delay={Math.min(sectionIndex * 0.05, 0.3)}>
                <div id={section.id} className="scroll-mt-32">
                  <h2
                    className="text-xl md:text-2xl font-bold mb-6 pb-3 border-b"
                    data-testid={`heading-${section.id}`}
                  >
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.content.map((paragraph, pIndex) => {
                      const isBullet = paragraph.startsWith("•");
                      const rendered = paragraph
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="font-semibold text-foreground">$1</strong>'
                        );

                      if (isBullet) {
                        return (
                          <div
                            key={pIndex}
                            className="flex gap-3 pl-4 text-muted-foreground leading-relaxed"
                            data-testid={`term-${section.id}-${pIndex}`}
                          >
                            <span className="text-primary mt-0.5 shrink-0">•</span>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: rendered.replace(/^• /, ""),
                              }}
                            />
                          </div>
                        );
                      }

                      return (
                        <p
                          key={pIndex}
                          className="text-muted-foreground leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: rendered }}
                          data-testid={`term-${section.id}-${pIndex}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50"
        data-testid="section-terms-contact"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInUp>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Vragen over onze voorwaarden?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Wij vinden transparantie belangrijk. Heeft u vragen over deze
                Algemene Voorwaarden of wilt u iets bespreken? Neem gerust
                contact met ons op.
              </p>
              <a href="mailto:info@abonnement.website">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block"
                >
                  <Button className="gap-2" data-testid="button-contact-terms">
                    <MessageSquare className="h-4 w-4" />
                    Neem contact op
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </a>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <p
                className="text-sm text-muted-foreground mt-8"
                data-testid="text-terms-last-updated"
              >
                Laatst bijgewerkt: {lastUpdated}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Saerens Advertising — BE 1019.436.742 — Aalst, België
              </p>
            </FadeInUp>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
