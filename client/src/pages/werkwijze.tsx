import { useRef, useState } from "react";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  ClipboardText,
  PaintBrush,
  ChatCircleDots,
  RocketLaunch,
  Handshake,
  ArrowRight,
  CaretDown,
  Clock,
  ArrowsClockwise,
  Sparkle,
  Package,
} from "@phosphor-icons/react";
import { motion, useInView, AnimatePresence } from "framer-motion";

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

// Actor-labels: blauw (primary) = wij, amber = jij, gemengd = samen
type Actor = "you" | "us" | "together" | "done";

const actorStyles: Record<Actor, { label: string; className: string }> = {
  you: {
    label: "Jouw actie",
    className: "border-amber-500/40 bg-amber-500/10 text-amber-500",
  },
  us: {
    label: "Wij aan het werk",
    className: "border-primary/40 bg-primary/10 text-primary",
  },
  together: {
    label: "Samen",
    className:
      "border-violet-500/40 bg-violet-500/10 text-violet-400",
  },
  done: {
    label: "Klaar",
    className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
  },
};

const steps: {
  icon: typeof CreditCard;
  title: string;
  time: string;
  description: string;
  actor: Actor;
}[] = [
  {
    icon: CreditCard,
    title: "Bestellen",
    time: "Dag 0 — 2 minuten",
    description:
      "Kies je abonnement en reken af. Kwartaal vooraf, geen opstartkosten. Je ontvangt direct een bevestiging en toegang tot je dashboard.",
    actor: "you",
  },
  {
    icon: ClipboardText,
    title: "Intake",
    time: "Dag 1-2",
    description:
      "Vul de intake-vragenlijst in: over je bedrijf, je doelgroep, je wensen en je huisstijl. Heb je al teksten en foto's? Upload ze. Nog niet? Geen probleem, wij helpen.",
    actor: "you",
  },
  {
    icon: PaintBrush,
    title: "Ontwerp",
    time: "Dag 3-7",
    description:
      "Wij bouwen je website op maat. Responsive, snel, professioneel. Je ontvangt een preview-link zodra de eerste versie klaar is.",
    actor: "us",
  },
  {
    icon: ChatCircleDots,
    title: "Feedback & revisie",
    time: "Dag 7-9",
    description:
      "Bekijk de preview en geef feedback. Wat moet anders? Wij verwerken je opmerkingen in maximaal twee revisierondes. Na goedkeuring gaan we live.",
    actor: "together",
  },
  {
    icon: RocketLaunch,
    title: "Livegang",
    time: "Dag 10",
    description:
      "Na jouw goedkeuring koppelen wij je domein, activeren SSL, en zetten alles live. Cookie consent, analytics en sitemap worden automatisch geconfigureerd.",
    actor: "us",
  },
  {
    icon: Handshake,
    title: "Overdracht & support",
    time: "Dag 10+",
    description:
      "Je ontvangt een overdracht met alles wat je moet weten: hoe wijzigingen aanvragen werkt, hoe credits werken, en hoe je ons bereikt. Vanaf nu onderhouden wij je website.",
    actor: "done",
  },
];

const promises = [
  {
    icon: Clock,
    title: "10 werkdagen",
    description: "Gemiddeld tot live, bij volledige intake en tijdige reactie",
  },
  {
    icon: ArrowsClockwise,
    title: "2 revisierondes",
    description: "Inbegrepen in elk traject",
  },
  {
    icon: Sparkle,
    title: "Geen technische kennis",
    description: "Jij levert wensen en feedback, wij doen de rest",
  },
  {
    icon: Package,
    title: "Alles inbegrepen",
    description: "Hosting, SSL, onderhoud, consent en support",
  },
];

const faqItems = [
  {
    question: "Wat als ik geen content heb voor mijn website?",
    answer:
      "Geen probleem. Wij kunnen placeholder-teksten schrijven op basis van je intake. Je kunt later via je wijzigingscredits de definitieve content laten plaatsen.",
  },
  {
    question: "Wat als ik niet tevreden ben na 2 revisierondes?",
    answer:
      "Extra revisies zijn mogelijk via je wijzigingscredits (€29 per aanpassing). We bespreken altijd vooraf wat nodig is.",
  },
  {
    question: "Moet ik iets technisch doen voor mijn website?",
    answer:
      "Nee. Wij regelen hosting, domein, SSL, cookie consent en analytics. Jij levert alleen content en feedback.",
  },
  {
    question: "Hoe lang duurt het als ik traag reageer?",
    answer:
      "De doorlooptijd van 10 dagen geldt bij tijdige reactie. Als je langer nodig hebt voor intake of feedback, schuift de planning mee. Geen stress, geen boete.",
  },
];

const werkwijzeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function WerkwijzePage() {
  useSEO({
    title: "Werkwijze | Van Bestelling tot Live in 10 Dagen",
    description:
      "Zo werkt abonnement.website: bestel, vul de intake in, wij bouwen en binnen 10 werkdagen is je professionele website live. Geen technische kennis nodig.",
    canonical: "/werkwijze",
    structuredData: werkwijzeFaqSchema,
  });

  return (
    <MarketingLayout>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-background pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[640px] -translate-x-1/2 rounded-full opacity-[0.1] blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Van bestelling tot live <span className="text-primary">in 10 dagen</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Geen technische kennis nodig. Jij levert je wensen, wij bouwen je website. Zes
              stappen, helder en voorspelbaar.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            {/* Legenda voor de actor-kleuren */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className={`rounded-full border px-3 py-1 font-medium ${actorStyles.you.className}`}>
                Jouw actie
              </span>
              <span className={`rounded-full border px-3 py-1 font-medium ${actorStyles.us.className}`}>
                Wij aan het werk
              </span>
              <span className={`rounded-full border px-3 py-1 font-medium ${actorStyles.together.className}`}>
                Samen
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── TIJDLIJN ─────────────────────────────────── */}
      <section className="bg-background pb-24 pt-4 sm:pb-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="relative">
            {/* verticale tijdlijn */}
            <div
              className="absolute bottom-8 left-[1.4rem] top-8 w-px sm:left-[1.65rem]"
              style={{
                background:
                  "linear-gradient(180deg, transparent, hsl(var(--border)) 8%, hsl(var(--border)) 92%, transparent)",
              }}
              aria-hidden
            />

            {steps.map((step, i) => {
              const actor = actorStyles[step.actor];
              return (
                <ScrollReveal key={step.title} delay={Math.min(i * 0.06, 0.2)}>
                  <div
                    className="relative flex gap-5 pb-12 last:pb-0 sm:gap-7"
                    data-testid={`step-${i + 1}`}
                  >
                    {/* icoon-node op de tijdlijn */}
                    <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card shadow-sm sm:h-[3.3rem] sm:w-[3.3rem]">
                      <step.icon
                        size={24}
                        weight={ICON_WEIGHT}
                        className={
                          step.actor === "you"
                            ? "text-amber-500"
                            : step.actor === "together"
                              ? "text-violet-400"
                              : step.actor === "done"
                                ? "text-emerald-500"
                                : "text-primary"
                        }
                      />
                    </div>

                    <div className="min-w-0 pt-0.5">
                      <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {step.time}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${actor.className}`}
                        >
                          {actor.label}
                        </span>
                      </div>
                      <h2 className="mb-2 font-display text-xl font-semibold sm:text-2xl">
                        <span className="mr-2 text-muted-foreground/50">{i + 1}.</span>
                        {step.title}
                      </h2>
                      <p className="max-w-[58ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WAT JE MAG VERWACHTEN ────────────────────── */}
      <section className="bg-muted/20 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Wat je mag verwachten
            </h2>
          </ScrollReveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <p.icon size={20} weight={ICON_WEIGHT} className="text-primary" />
                  </div>
                  <h3 className="mb-1.5 font-semibold">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <ScrollReveal className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Veelgestelde vragen over het proces
            </h2>
          </ScrollReveal>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <ScrollReveal key={item.question} delay={index * 0.05}>
                <FAQItem question={item.question} answer={item.answer} index={index} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="bg-background pb-24 sm:pb-28">
        <div className="mx-auto max-w-2xl px-6">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-10 text-center sm:p-14">
              <div
                className="pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full opacity-[0.12] blur-3xl"
                style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
              />
              <div className="relative">
                <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Klaar om te starten?
                </h2>
                <p className="mt-4 text-base text-muted-foreground">
                  Kies je abonnement en wij nemen binnen 24 uur contact op.
                </p>
                <div className="mt-8">
                  <Button size="lg" className="gap-2 rounded-xl px-7" asChild data-testid="button-werkwijze-cta">
                    <a href="/#pricing">
                      Bekijk het abonnement
                      <ArrowRight size={16} weight="bold" />
                    </a>
                  </Button>
                </div>
                <p className="mt-5 text-sm text-muted-foreground">
                  Liever eerst een offerte op maat?{" "}
                  <a
                    href="/offerte"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                    data-testid="link-werkwijze-offerte"
                  >
                    Vraag een offerte aan
                  </a>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </MarketingLayout>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="overflow-hidden rounded-xl border bg-card"
      data-testid={`werkwijze-faq-item-${index}`}
      whileTap={{ scale: 0.99 }}
      layout
    >
      <button
        className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        data-testid={`button-werkwijze-faq-${index}`}
      >
        <span className="font-medium leading-snug">{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0">
          <CaretDown size={20} weight={ICON_WEIGHT} className="text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="max-w-[65ch] px-5 pb-5 text-sm leading-relaxed text-muted-foreground md:px-6 md:pb-6">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
