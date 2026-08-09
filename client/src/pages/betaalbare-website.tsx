import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import {
  Check,
  CheckCircle,
  ArrowRight,
  Lightning,
  ShieldCheck,
  Headset,
  Clock,
  Coins,
  Gear,
  UsersThree,
  CalendarCheck,
  CreditCard,
  Lock,
  Star,
  Storefront,
  PaintBrush,
  ChartLineUp,
} from "@phosphor-icons/react";
import type { Plan } from "@shared/schema";

const ICON_WEIGHT = "duotone" as const;


const benefits = [
  {
    icon: Coins,
    title: "Geen dure investering vooraf",
    text: "Geen opstartkosten van honderden of duizenden euro's. Je betaalt één vast bedrag per maand, zo houd je grip op je budget.",
  },
  {
    icon: Lightning,
    title: "Binnen 10 werkdagen live",
    text: "Snel professioneel online. Na een korte intake bouwen we je website en zetten we hem voor je live.",
  },
  {
    icon: Gear,
    title: "Alles inbegrepen",
    text: "Design, hosting, SSL, onderhoud, updates, support en 2 wijzigingscredits per maand zitten in het abonnement. Jij hoeft nergens naar om te kijken.",
  },
  {
    icon: Headset,
    title: "Persoonlijk aanspreekpunt",
    text: "Een vaste contactpersoon die je bedrijf kent. Geen wachtrijen of anonieme helpdesk.",
  },
];

const included = [
  "Professioneel maatwerk design",
  "Hosting + SSL-certificaat",
  "Onderhoud en beveiligingsupdates",
  "Support bij vragen en wijzigingen",
  "Mobiel- en tabletvriendelijk",
  "Basis SEO zodat je gevonden wordt",
  "Cookiebanner (AVG/GDPR) inbegrepen",
  "100% eigenaar van je eigen content",
];

const audience = [
  "Starters die net hun zaak hebben opgestart",
  "Zzp'ers en freelancers (Nederland)",
  "Zelfstandigen en eenmanszaken (België)",
  "Kleine kmo's en mkb-bedrijven",
  "Ondernemers die toe zijn aan een betere website",
  "Lokale dienstverleners en winkels",
];

const steps = [
  {
    icon: PaintBrush,
    title: "1. Korte intake",
    text: "We bespreken je bedrijf, je wensen en verzamelen je teksten en beeldmateriaal.",
  },
  {
    icon: Storefront,
    title: "2. Wij bouwen",
    text: "Ons team maakt een professioneel, snel en mobielvriendelijk ontwerp op maat.",
  },
  {
    icon: CalendarCheck,
    title: "3. Online binnen 10 dagen",
    text: "Je website gaat live. Daarna verzorgen wij het onderhoud, de updates en de support.",
  },
];

const faqs = [
  {
    q: "Wat kost een professionele website bij jullie?",
    a: "Je betaalt vanaf €69 per maand. Daarin zitten design, hosting, onderhoud en support. Er zijn geen opstartkosten en geen verrassingen achteraf. De facturatie loopt per kwartaal vooruit.",
  },
  {
    q: "Voor wie is dit bedoeld?",
    a: "Voor starters, zzp'ers, zelfstandigen, eenmanszaken en kleine kmo's of mkb-bedrijven in Nederland en België die professioneel online willen, zonder een groot bedrag vooraf te investeren.",
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
    a: "Een eenmalige website kost vaak €1.500 tot €5.000 vooraf en daarna betaal je apart voor hosting en onderhoud. Met een abonnement spreid je de kosten en blijft alles inbegrepen en up-to-date.",
  },
  {
    q: "Kan ik later upgraden of extra's toevoegen?",
    a: "Zeker. Je kunt op elk moment add-ons toevoegen of verwijderen, zoals extra pagina's, SEO of advertentiebeheer. Er is één plan; de keuze zit in welke add-ons je activeert.",
  },
];

export default function BetaalbareWebsitePage() {
  useSEO({
    title: "Betaalbare professionele website voor starters en zelfstandigen",
    description:
      "Een betaalbare professionele website vanaf €69 per maand. Voor starters, zzp'ers en zelfstandigen in Nederland en België. Geen opstartkosten, binnen 10 werkdagen live.",
    canonical: "/betaalbare-professionele-website",
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: "Betaalbare professionele website als abonnement",
          serviceType: "Website laten maken op abonnementsbasis",
          description:
            "Professionele website voor starters en zelfstandigen vanaf €69 per maand. Inclusief design, hosting, onderhoud en support. Geen opstartkosten.",
          areaServed: ["Nederland", "België"],
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
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
      ],
    },
  });

  const { data: plans = [] } = useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });

  const sortedPlans = [...plans].sort(
    (a, b) => a.monthlyPriceCents - b.monthlyPriceCents,
  );

  return (
    <MarketingLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0a0f1c] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-28 pb-20 text-center sm:pt-32">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-[#f3a427] backdrop-blur-md sm:text-sm">
            <Star size={16} weight="fill" />
            VOOR STARTERS &amp; ZELFSTANDIGEN
          </div>
          <h1
            className="font-display text-[clamp(2.25rem,5vw+1rem,4rem)] leading-[1.08] tracking-tight"
            data-testid="text-page-title"
          >
            Een betaalbare professionele
            <br className="hidden sm:block" /> website vanaf €69 per maand
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 font-light">
            Professioneel online zonder grote investering vooraf. Design,
            hosting, onderhoud en support in één vast maandbedrag — ideaal voor
            starters, zzp'ers en zelfstandigen in Nederland en België.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button
                size="lg"
                className="h-14 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-blue-600 px-8 text-base text-white shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)]"
                data-testid="button-hero-start"
              >
                Start jouw website
                <ArrowRight size={16} weight={ICON_WEIGHT} className="ml-2" />
              </Button>
            </Link>
            <Link href="/offerte">
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-white/20 bg-white/5 px-8 text-base text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                data-testid="button-hero-advies"
              >
                Vraag gratis advies aan
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-300">
            {["Geen opstartkosten", "Binnen 10 werkdagen live", "Inclusief hosting & SSL"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle size={18} weight={ICON_WEIGHT} className="text-emerald-400" />
                  <span>{item}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* WAAROM */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Waarom kiezen starters voor een website-abonnement?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Een eigen professionele website hoeft niet duur of ingewikkeld te
              zijn. Met een abonnement spreid je de kosten en blijft alles
              geregeld.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-border bg-card p-6"
                data-testid={`card-benefit-${b.title}`}
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <b.icon size={24} weight={ICON_WEIGHT} className="text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{b.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {b.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WAT ZIT ERIN + VOOR WIE */}
      <section className="bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Wat zit er in het abonnement?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Elk abonnement is compleet. Je betaalt nooit los bij voor de
              basis.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Voor wie is het?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Speciaal gemaakt voor ondernemers die professioneel online willen,
              zonder gedoe.
            </p>
            <ul className="mt-8 space-y-3">
              {audience.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <UsersThree size={18} weight={ICON_WEIGHT} className="mt-0.5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PRIJZEN */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Eerlijke prijzen, alles inbegrepen
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Eén helder abonnement met alles erin. Prijs per maand, per
              kwartaal vooruit afgerekend.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-md gap-5">
            {sortedPlans.map((plan) => {
              const config = { label: plan.name, popular: true };
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-[2px] ${
                    config.popular
                      ? "bg-gradient-to-b from-primary via-primary/60 to-primary/20 shadow-xl shadow-primary/15"
                      : "bg-gradient-to-b from-border via-border/60 to-border/30"
                  }`}
                  data-testid={`card-plan-${plan.tier.toLowerCase()}`}
                >
                  {config.popular && (
                    <div className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/30">
                        <Star size={12} weight="fill" />
                        Alles-in-één
                      </span>
                    </div>
                  )}
                  <div className="flex h-full flex-col rounded-[14px] bg-card p-7">
                    <h3
                      className={`mb-4 text-sm font-semibold uppercase tracking-widest ${
                        config.popular ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {config.label}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl leading-none tracking-tight" data-testid={`text-price-${plan.tier.toLowerCase()}`}>
                        €{(plan.monthlyPriceCents / 100).toFixed(0)}
                      </span>
                      <span className="text-sm text-muted-foreground">/maand</span>
                    </div>
                    <ul className="mt-6 mb-6 flex-1 space-y-2.5">
                      {(plan.features || []).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                          <Check size={14} weight="bold" className="mt-0.5 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={`/signup?plan=${plan.id}`}>
                      <Button
                        className="w-full gap-2 rounded-xl"
                        variant={config.popular ? "default" : "outline"}
                        data-testid={`button-order-${plan.tier.toLowerCase()}`}
                      >
                        Start je website
                        <ArrowRight size={16} weight={ICON_WEIGHT} />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Lock size={15} weight={ICON_WEIGHT} className="text-primary" />
              Geen opstartkosten
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={15} weight={ICON_WEIGHT} className="text-primary" />
              6 maanden minimum
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard size={15} weight={ICON_WEIGHT} className="text-primary" />
              Per kwartaal vooruit
            </div>
          </div>
        </div>
      </section>

      {/* HOE WERKT HET */}
      <section className="bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Zo werkt het
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Van aanmelding tot online in drie eenvoudige stappen.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.title} className="rounded-2xl border border-border bg-card p-7">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <s.icon size={24} weight={ICON_WEIGHT} className="text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERGELIJKING */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center font-display text-3xl tracking-tight sm:text-4xl">
            Abonnement of eenmalig laten maken?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground">
            Een website eenmalig laten bouwen kost vaak €1.500 tot €5.000 vooraf,
            plus losse kosten voor hosting en onderhoud. Met een abonnement
            spreid je de kosten en blijft alles inbegrepen en up-to-date.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <Coins size={22} weight={ICON_WEIGHT} className="text-muted-foreground" />
              </div>
              <h3 className="mb-3 font-semibold">Eenmalig laten maken</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Hoog bedrag in één keer vooraf</li>
                <li>Hosting en onderhoud apart betalen</li>
                <li>Updates kosten vaak extra</li>
                <li>Snel verouderd zonder onderhoud</li>
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-primary/30 bg-card p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ChartLineUp size={22} weight={ICON_WEIGHT} className="text-primary" />
              </div>
              <h3 className="mb-3 font-semibold">Website-abonnement</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><Check size={15} weight="bold" className="mt-0.5 shrink-0 text-primary" />Vast laag bedrag per maand</li>
                <li className="flex items-start gap-2"><Check size={15} weight="bold" className="mt-0.5 shrink-0 text-primary" />Hosting en onderhoud inbegrepen</li>
                <li className="flex items-start gap-2"><Check size={15} weight="bold" className="mt-0.5 shrink-0 text-primary" />Doorlopende updates en support</li>
                <li className="flex items-start gap-2"><Check size={15} weight="bold" className="mt-0.5 shrink-0 text-primary" />Altijd actueel en veilig</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center font-display text-3xl tracking-tight sm:text-4xl">
            Veelgestelde vragen
          </h2>
          <div className="mt-10 space-y-4">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-border bg-card p-6"
                data-testid={`faq-${f.q}`}
              >
                <h3 className="mb-2 font-semibold">{f.q}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#0a0f1c] py-20 text-white sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Clock size={40} weight={ICON_WEIGHT} className="mx-auto mb-6 text-[#f3a427]" />
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
            Klaar voor een professionele website?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-300 font-light">
            Start vandaag vanaf €69 per maand of vraag eerst gratis advies aan.
            Je staat binnen 10 werkdagen online.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button
                size="lg"
                className="h-14 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-blue-600 px-8 text-base text-white shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)]"
                data-testid="button-cta-start"
              >
                Start jouw website
                <ArrowRight size={16} weight={ICON_WEIGHT} className="ml-2" />
              </Button>
            </Link>
            <Link href="/offerte">
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-white/20 bg-white/5 px-8 text-base text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                data-testid="button-cta-advies"
              >
                Gratis advies aanvragen
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
