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
import { useRef } from "react";

const ICON_WEIGHT = "duotone" as const;

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
    title: "Cookiebanner op maat",
    description:
      "Past zich aan het design van je website aan. Geen lelijke standaardbanner, maar iets dat er hoort.",
  },
  {
    icon: MagnifyingGlass,
    title: "Automatische cookie scan",
    description:
      "Detecteert welke cookies je website plaatst en categoriseert ze automatisch. Geen handmatig uitzoekwerk.",
  },
  {
    icon: ChartBar,
    title: "Google Consent Mode v2",
    description:
      "Je Google Ads en Analytics blijven correct meten, ook als bezoekers cookies weigeren. Geen dataverlies.",
  },
  {
    icon: FileText,
    title: "Privacy & cookie policy",
    description:
      "Genereer een privacy- en cookiebeleid in je eigen taal. Altijd actueel, altijd beschikbaar op je website.",
  },
];

const steps = [
  {
    number: "01",
    title: "Wij installeren alles",
    description:
      "Bij het bouwen van je website configureren wij ConsentEase. Banner, scan, consent mode: alles staat klaar bij livegang.",
  },
  {
    number: "02",
    title: "Jij vult je bedrijfsgegevens aan",
    description:
      "In je dashboard vul je kort in welke data je verzamelt. Wij genereren je privacy- en cookiebeleid.",
  },
  {
    number: "03",
    title: "Het blijft automatisch actueel",
    description:
      "Bij elke wijziging scant ConsentEase opnieuw. Nieuwe cookies? Je wordt genotificeerd.",
  },
];

const stats = [
  { value: "€0", label: "Extra kosten" },
  { value: "0 min", label: "Jouw tijd" },
  { value: "100%", label: "Geconfigureerd" },
];

export default function ConsentEasePage() {
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
        {/* subtle green glow */}
        <div
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at center, #2D6A4F 0%, transparent 70%)",
          }}
        />

        <div className="mx-auto max-w-3xl px-6 text-center relative">
          {/* Co-brand row */}
          <ScrollReveal>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-border/50 bg-muted/40 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <span className="text-foreground/80">abonnement.website</span>
              <span className="text-muted-foreground/50">×</span>
              <span style={{ color: "#52b788" }}>ConsentEase</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Cookie compliance?{" "}
              <span style={{ color: "#52b788" }}>Geregeld.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              Bij elk abonnement.website-plan zit ConsentEase inbegrepen. Geen
              extra kosten, geen extra gedoe. Jouw website is privacyproof vanaf
              dag één.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            {/* Included badge */}
            <div className="mt-8 inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-medium border"
              style={{
                background: "rgba(45, 106, 79, 0.12)",
                borderColor: "rgba(82, 183, 136, 0.3)",
                color: "#52b788",
              }}>
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: "#52b788" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2.5 w-2.5"
                  style={{ backgroundColor: "#52b788" }}
                />
              </span>
              Inbegrepen bij je abonnement
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FEATURES 2×2 ───────────────────────────────── */}
      <section className="bg-muted/20 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Alles wat je nodig hebt, klaar bij livegang
            </h2>
            <p className="mt-3 text-muted-foreground">
              Vier onderdelen, volledig geconfigureerd, gratis bij je website.
            </p>
          </ScrollReveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.07}>
                <div className="group relative rounded-2xl border border-border/50 bg-card p-7 h-full transition-all duration-300 hover:border-[#52b788]/40 hover:shadow-lg hover:shadow-[#2D6A4F]/5">
                  <div
                    className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      background: "rgba(45, 106, 79, 0.15)",
                    }}
                  >
                    <f.icon
                      size={22}
                      weight={ICON_WEIGHT}
                      style={{ color: "#52b788" }}
                    />
                  </div>
                  <h3 className="mb-2 text-base font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
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
            <p className="text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              Zonder correcte consent verlies je meetdata, riskeer je boetes
              tot{" "}
              <span className="text-foreground font-semibold">€20 miljoen</span>
              , en kom je onprofessioneel over bij bezoekers.{" "}
              <span className="text-foreground">
                Wij regelen dit voor je, standaard.
              </span>
            </p>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.08}>
                <div className="rounded-2xl border border-border/40 bg-muted/30 px-6 py-8">
                  <p
                    className="font-display text-4xl font-bold"
                    style={{ color: "#52b788" }}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────── */}
      <section className="bg-muted/20 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <ScrollReveal className="text-center mb-14">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Hoe het werkt
            </h2>
          </ScrollReveal>

          <div className="relative space-y-0">
            {/* vertical connector line */}
            <div className="absolute left-[1.375rem] top-10 bottom-10 w-px bg-gradient-to-b from-[#52b788]/30 via-[#52b788]/20 to-transparent hidden sm:block" />

            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.1}>
                <div className="relative flex gap-6 pb-10 last:pb-0">
                  {/* number bubble */}
                  <div
                    className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                    style={{
                      background: "rgba(45, 106, 79, 0.15)",
                      borderColor: "rgba(82, 183, 136, 0.4)",
                      color: "#52b788",
                    }}
                  >
                    {step.number}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="font-semibold text-base mb-1.5">
                      {step.title}
                    </h3>
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
            <div
              className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(45,106,79,0.25) 0%, rgba(45,106,79,0.08) 50%, rgba(30,30,35,0.6) 100%)",
                border: "1px solid rgba(82,183,136,0.2)",
              }}
            >
              {/* decorative glow */}
              <div
                className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
                style={{
                  background:
                    "radial-gradient(circle, #2D6A4F 0%, transparent 70%)",
                }}
              />

              <div className="relative">
                <div className="mb-5 inline-flex items-center gap-2 text-sm"
                  style={{ color: "#52b788" }}>
                  <CheckCircle size={16} weight="fill" />
                  <span className="font-medium">Inbegrepen bij elk plan</span>
                </div>

                <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Zit bij elk plan.
                  <br />
                  Geen extra stappen.
                </h2>

                <p className="mt-4 text-muted-foreground text-base">
                  Start je website-abonnement en ConsentEase is er gewoon.
                </p>

                <div className="mt-8">
                  <Button
                    size="lg"
                    className="gap-2 rounded-xl px-7"
                    asChild
                  >
                    <a href="/#pricing">
                      Bekijk het abonnement
                      <ArrowRight size={16} weight="bold" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </MarketingLayout>
  );
}
