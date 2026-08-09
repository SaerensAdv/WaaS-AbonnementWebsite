import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import {
  PaintBrush,
  MagnifyingGlass,
  ChartBar,
  FileText,
  ArrowRight,
  CheckCircle,
} from "@phosphor-icons/react";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import logoImage from "@assets/logo-abonnement-website.webp";
import consentEaseLogo from "@assets/consentease-logo.webp";

const ICON_WEIGHT = "duotone" as const;

/*
 * Co-branding concept: "De gradient-handdruk"
 * abonnement.website (donker, blauw/primary) en ConsentEase.io
 * (paars → magenta → oranje gradient op licht) vloeien in elkaar over.
 * De pagina is bewust altijd licht/wit — zoals consentease.io zelf — en de
 * ConsentEase-gradient stroomt als een rode draad door de secties: van
 * blauw (links/boven) via paars en magenta naar oranje (rechts/onder).
 */

// ConsentEase brand gradient (paars → magenta → oranje)
const CE_GRADIENT = "linear-gradient(100deg, #8B5CF6 0%, #D946EF 50%, #F97316 100%)";
const CE_GRADIENT_SOFT =
  "linear-gradient(100deg, rgba(139,92,246,0.16) 0%, rgba(217,70,239,0.12) 50%, rgba(249,115,22,0.14) 100%)";
// De fusie: abo.web-blauw dat overloopt in de ConsentEase-gradient
const FUSION_GRADIENT =
  "linear-gradient(100deg, hsl(var(--primary)) 0%, #8B5CF6 40%, #D946EF 70%, #F97316 100%)";

function GradientText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={className}
      style={{
        backgroundImage: CE_GRADIENT,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
}

/** Het echte ConsentEase-logo (consentease.io) */
function ConsentEaseMark({ size = 28 }: { size?: number }) {
  return (
    <img
      src={consentEaseLogo}
      alt=""
      className="shrink-0 rounded-full object-contain"
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}

/** Deze pagina is bewust altijd licht/wit — passend bij de ConsentEase-branding. */
function useForceLightTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains("dark");

    const forceLight = () => {
      if (root.classList.contains("dark") || !root.classList.contains("light")) {
        root.classList.remove("dark");
        root.classList.add("light");
      }
    };
    forceLight();

    // De ThemeProvider (of de theme-toggle in de header) kan de klassen
    // opnieuw zetten; blijf licht afdwingen zolang deze pagina open staat.
    const observer = new MutationObserver(forceLight);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      root.classList.remove("light");
      if (wasDark) root.classList.add("dark");
    };
  }, []);
}

function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const features = [
  {
    icon: PaintBrush,
    color: "#8B5CF6",
    title: "Cookiebanner op maat",
    description:
      "Past zich aan het design van je website aan. Geen lelijke standaardbanner, maar iets dat er hoort.",
  },
  {
    icon: MagnifyingGlass,
    color: "#A855F7",
    title: "Automatische cookie scan",
    description:
      "Detecteert welke cookies je website plaatst en categoriseert ze automatisch. Geen handmatig uitzoekwerk.",
  },
  {
    icon: ChartBar,
    color: "#D946EF",
    title: "Google Consent Mode v2",
    description:
      "Je Google Ads en Analytics blijven correct meten, ook als bezoekers cookies weigeren. Geen dataverlies.",
  },
  {
    icon: FileText,
    color: "#F97316",
    title: "Privacy & cookie policy",
    description:
      "Genereer een privacy- en cookiebeleid in je eigen taal. Altijd actueel, altijd beschikbaar op je website.",
  },
];

const steps = [
  {
    number: "01",
    color: "#8B5CF6",
    title: "Wij installeren alles",
    description:
      "Bij het bouwen van je website configureren wij ConsentEase. Banner, scan, consent mode: alles staat klaar bij livegang.",
  },
  {
    number: "02",
    color: "#D946EF",
    title: "Jij vult je bedrijfsgegevens aan",
    description:
      "In je dashboard vul je kort in welke data je verzamelt. Wij genereren je privacy- en cookiebeleid.",
  },
  {
    number: "03",
    color: "#F97316",
    title: "Het blijft automatisch actueel",
    description:
      "Bij elke wijziging scant ConsentEase opnieuw. Nieuwe cookies? Je wordt genotificeerd.",
  },
];

const stats = [
  { value: "€0", label: "Extra kosten", color: "#8B5CF6" },
  { value: "0 min", label: "Jouw tijd", color: "#D946EF" },
  { value: "100%", label: "Geconfigureerd", color: "#F97316" },
];

export default function ConsentEasePage() {
  useForceLightTheme();
  useSEO({
    title: "ConsentEase Inbegrepen | Cookie Compliance Zonder Extra Kosten",
    description:
      "Bij elk abonnement.website-plan zit ConsentEase inbegrepen: cookiebanner, automatische scan, Google Consent Mode v2 en policy generator. Geen extra kosten.",
    canonical: "/consentease",
  });

  return (
    <MarketingLayout>
      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-background pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* Twee brand-glows die in elkaar overvloeien: blauw (abo.web) links, CE-gradient rechts */}
        <div
          className="pointer-events-none absolute -top-40 left-[10%] h-[420px] w-[420px] rounded-full opacity-[0.14] blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -top-32 right-[8%] h-[440px] w-[440px] rounded-full opacity-[0.12] blur-3xl"
          style={{ background: "radial-gradient(circle, #D946EF 0%, #F97316 55%, transparent 75%)" }}
        />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          {/* Co-brand lockup: beide merken met hun eigen identiteit, verbonden door de fusie-gradient */}
          <ScrollReveal>
            <div className="mx-auto mb-9 inline-flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full border border-border/50 bg-muted/40 py-2.5 pl-4 pr-5 backdrop-blur-sm">
              <span className="inline-flex items-center gap-2">
                <img src={logoImage} alt="" className="h-6 w-6 rounded-md object-contain" />
                <span className="text-sm font-semibold tracking-tight text-foreground">
                  abonnement.website
                </span>
              </span>
              <span
                className="hidden h-px w-10 sm:block"
                style={{ background: FUSION_GRADIENT }}
                aria-hidden
              />
              <span className="text-muted-foreground/60 sm:hidden">×</span>
              <span className="inline-flex items-center gap-2">
                <ConsentEaseMark size={24} />
                <GradientText className="text-sm font-semibold tracking-tight">
                  ConsentEase
                </GradientText>
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Cookie compliance?
              <br />
              <GradientText>Geregeld.</GradientText>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Bij elk abonnement.website-plan zit ConsentEase inbegrepen. Geen extra kosten, geen
              extra gedoe. Jouw website is privacyproof vanaf dag één.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            {/* Badge met gradient-rand + pulserende dot */}
            <span
              className="mt-8 inline-flex rounded-full p-px"
              style={{ background: FUSION_GRADIENT }}
            >
              <span className="inline-flex items-center gap-2.5 rounded-full bg-background/90 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                    style={{ backgroundColor: "#D946EF" }}
                  />
                  <span
                    className="relative inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ background: CE_GRADIENT }}
                  />
                </span>
                Inbegrepen bij je abonnement
              </span>
            </span>
          </ScrollReveal>
        </div>

        {/* De fusie-lijn: abo.web-blauw stroomt over in de ConsentEase-gradient */}
        <div
          className="absolute inset-x-0 bottom-0 h-px opacity-70"
          style={{ background: FUSION_GRADIENT }}
          aria-hidden
        />
      </section>

      {/* ── FEATURES 2×2 ───────────────────────────────── */}
      <section className="bg-muted/20 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Alles wat je nodig hebt, <GradientText>klaar bij livegang</GradientText>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Vier onderdelen, volledig geconfigureerd, gratis bij je website.
            </p>
          </ScrollReveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.07}>
                <div
                  className="group relative h-full rounded-2xl border border-border/50 bg-card p-7 transition-all duration-300 hover:shadow-lg"
                  style={{ boxShadow: "0 0 0 0 transparent" }}
                >
                  {/* gradient accent die per kaart een stukje verder in het CE-spectrum zit */}
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-[3px] rounded-t-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`,
                    }}
                  />
                  <div
                    className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: `${f.color}1f` }}
                  >
                    <f.icon size={22} weight={ICON_WEIGHT} style={{ color: f.color }} />
                  </div>
                  <h3 className="mb-2 text-base font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IT MATTERS ─────────────────────────────── */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <ScrollReveal>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
              Zonder correcte consent verlies je meetdata, riskeer je boetes tot{" "}
              <span className="font-semibold text-foreground">€20 miljoen</span>, en kom je
              onprofessioneel over bij bezoekers.{" "}
              <span className="text-foreground">Wij regelen dit voor je, standaard.</span>
            </p>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.08}>
                <div className="rounded-2xl border border-border/40 bg-muted/30 px-6 py-8">
                  <p className="font-display text-4xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────── */}
      <section className="bg-muted/20 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <ScrollReveal className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Hoe het werkt
            </h2>
          </ScrollReveal>

          <div className="relative">
            {/* verticale lijn die het volledige CE-spectrum doorloopt */}
            <div
              className="absolute bottom-10 left-[1.375rem] top-10 hidden w-px opacity-50 sm:block"
              style={{ background: "linear-gradient(180deg, #8B5CF6, #D946EF, #F97316)" }}
            />

            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.1}>
                <div className="relative flex gap-6 pb-10 last:pb-0">
                  <div
                    className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-bold"
                    style={{ borderColor: `${step.color}66`, color: step.color }}
                  >
                    {step.number}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="mb-1.5 text-base font-semibold">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <ScrollReveal>
            {/* Gradient-rand als fusie van beide merken, donkere kern */}
            <div className="rounded-3xl p-px" style={{ background: FUSION_GRADIENT }}>
              <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-card p-10 text-center sm:p-14">
                <div
                  className="pointer-events-none absolute inset-0 opacity-80"
                  style={{ background: CE_GRADIENT_SOFT }}
                />
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-25 blur-2xl"
                  style={{ background: "radial-gradient(circle, #F97316 0%, transparent 70%)" }}
                />
                <div
                  className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full opacity-25 blur-2xl"
                  style={{
                    background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
                  }}
                />

                <div className="relative">
                  <div className="mb-5 inline-flex items-center gap-2 text-sm font-medium">
                    <CheckCircle size={16} weight="fill" style={{ color: "#D946EF" }} />
                    <GradientText>Inbegrepen bij elk plan</GradientText>
                  </div>

                  <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    Zit bij elk plan.
                    <br />
                    Geen extra stappen.
                  </h2>

                  <p className="mt-4 text-base text-muted-foreground">
                    Start je website-abonnement en ConsentEase is er gewoon.
                  </p>

                  <div className="mt-8">
                    <Button size="lg" className="gap-2 rounded-xl px-7" asChild>
                      <a href="/#pricing">
                        Bekijk het abonnement
                        <ArrowRight size={16} weight="bold" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </MarketingLayout>
  );
}
