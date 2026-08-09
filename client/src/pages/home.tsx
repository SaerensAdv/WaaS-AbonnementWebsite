import { useQuery, useMutation } from "@tanstack/react-query";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  ArrowRight,
  Globe,
  ShieldCheck,
  Lightning,
  Headset,
  Megaphone,
  ShareNetwork,
  CaretDown,
  Clock,
  CreditCard,
  Star,
  FilePlus,
  ShoppingCart,
  ShoppingBag,
  MagnifyingGlass,
  MapPin,
  UsersThree,
  CalendarCheck,
  Lock,
  CheckCircle,
  Gear,
  Coins,
} from "@phosphor-icons/react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useRef } from "react";
import { LeadPopup } from "@/components/lead-popup";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Plan, AddOn } from "@shared/schema";

const ICON_WEIGHT = "duotone" as const;

const addOnIcons: Record<string, any> = {
  "google-ads": Megaphone,
  "google-ads-ecommerce": ShoppingBag,
  "meta-ads": ShareNetwork,
  "seo": MagnifyingGlass,
  "local-seo": MapPin,
  "social-media": UsersThree,
  "ecommerce": ShoppingCart,
  "booking": CalendarCheck,
  "extra-pages": FilePlus,
};

const faqItems = [
  {
    q: "Hoe snel staat mijn website online?",
    a: "Snel. Na uw bestelling nemen we binnen 24 uur contact op. De meeste websites zijn binnen 2 weken live. U hoeft alleen uw content aan te leveren — wij doen de rest.",
  },
  {
    q: "Zit ik ergens aan vast?",
    a: "Er geldt een minimale looptijd van 6 maanden. U betaalt per kwartaal vooruit. Na de minimale looptijd kunt u opzeggen via uw dashboard, zonder opzegboete; uw website blijft actief tot het einde van de betaalde periode.",
  },
  {
    q: "Wat zit er allemaal in het abonnement?",
    a: "Alles wat u nodig heeft om online professioneel over te komen: een website op maat (tot 5 pagina's), snelle hosting, SSL certificaat, cookie banner (GDPR-conform), technisch onderhoud en support via e-mail. Daarnaast krijgt u elke maand 2 wijzigingscredits: 1 credit = 1 wijziging aan uw website. Extra credits kunnen bijgekocht worden voor €29 per stuk. Geen verborgen kosten, geen verrassingen achteraf.",
  },
  {
    q: "Kan ik later upgraden of downgraden?",
    a: "Je kunt op elk moment add-ons toevoegen of verwijderen. Er is één plan; de keuze zit in welke add-ons je activeert.",
  },
  {
    q: "Hoe werken de wijzigingscredits?",
    a: "Elke maand krijgt u 2 wijzigingscredits inbegrepen. 1 credit staat voor 1 wijziging aan uw website — bijvoorbeeld een tekstaanpassing, nieuwe afbeelding of kleine layout-wijziging. Heeft u er meer nodig? Extra credits kosten €29 per stuk.",
  },
  {
    q: "Wie is eigenaar van mijn content?",
    a: "Uw teksten, afbeeldingen en bedrijfsdata zijn altijd van u. Het technische ontwerp en de hosting worden beheerd als onderdeel van uw abonnement, zodat u zich daar geen zorgen over hoeft te maken.",
  },
  {
    q: "Wat als ik niet tevreden ben?",
    a: "Dan horen we dat graag. We werken samen aan aanpassingen tot het design past bij uw wensen. Er geldt een minimale looptijd van 6 maanden; daarna kunt u per kwartaal opzeggen, zonder opzegboete.",
  },
  {
    q: "Kan ik add-ons later toevoegen of verwijderen?",
    a: "Absoluut. U kunt op elk moment add-ons activeren of pauzeren via uw dashboard. De kosten worden direct verrekend. Geen gedoe, geen wachttijden.",
  },
  {
    q: "Zit de cookie banner erbij?",
    a: "Ja. Elke website die wij bouwen bevat een GDPR-conforme cookie banner via ConsentEase. Dit zit standaard in het abonnement inbegrepen — zonder meerkosten.",
  },
];

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const PLAN_FEATURES_FALLBACK = [
  "Website op maat (tot 5 pagina's)",
  "Responsive ontwerp",
  "Hosting, SSL en onderhoud",
  "ConsentEase inbegrepen",
  "2 wijzigingscredits per maand",
  "Support via e-mail",
];

function HeroGridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 mix-blend-overlay" />
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-[hsl(var(--primary)/0.2)] rounded-full blur-[100px] mix-blend-screen"
      />
      <motion.div
        animate={{ y: [0, 30, 0], opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[10%] right-[30%] w-[300px] h-[300px] bg-[#f3a427]/10 rounded-full blur-[80px] mix-blend-screen"
      />
    </div>
  );
}

function HeroPlanShowcase({
  plan,
  onOrder,
  isPending,
}: {
  plan?: Plan;
  onOrder: () => void;
  isPending: boolean;
}) {
  const features = plan?.features?.length ? plan.features : PLAN_FEATURES_FALLBACK;
  const price = plan ? (plan.monthlyPriceCents / 100).toFixed(0) : "69";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6 }}
      className="relative w-full max-w-md mx-auto rounded-2xl border border-primary/30 ring-2 ring-primary/15 bg-card/95 backdrop-blur-xl shadow-2xl p-6 sm:p-8"
      data-testid="hero-plan-card"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-blue-600 opacity-5 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-foreground">Website-abonnement</h3>
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
            Eén plan
          </span>
        </div>
        <div className="mb-2 flex items-baseline gap-1">
          <span className="font-display text-4xl sm:text-5xl text-foreground" data-testid="text-hero-plan-price">€{price}</span>
          <span className="text-muted-foreground font-medium text-sm">/maand</span>
        </div>
        <p className="text-xs text-muted-foreground mb-5">
          Kwartaal vooraf gefactureerd (€207 per kwartaal) · minimaal 6 maanden
        </p>
        <ul className="space-y-2.5 mb-6">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Check size={14} weight={ICON_WEIGHT} />
              </div>
              {f}
            </li>
          ))}
        </ul>
        <Button
          className="w-full shadow-lg shadow-primary/25"
          size="lg"
          onClick={onOrder}
          disabled={isPending || !plan}
          data-testid="button-hero-plan-order"
        >
          {isPending ? "Bezig..." : "Start je website"}
          <ArrowRight size={16} weight={ICON_WEIGHT} className="ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

function ScrollReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

export default function HomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useSEO({
    title: "Website Abonnement €69/maand | Professionele Websites op Abonnement",
    absoluteTitle: true,
    description: "Professionele website als maandabonnement: €69/maand inclusief design, hosting, onderhoud en 2 wijzigingscredits. Voor starters en zelfstandigen in België en Nederland.",
    canonical: "/",
    structuredData: homeFaqSchema,
  });

  const { data: plans = [] } = useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });

  const { data: addOns = [] } = useQuery<AddOn[]>({
    queryKey: ["/api/addons"],
  });

  const checkoutMutation = useMutation({
    mutationFn: async (planId: string) => {
      const res = await apiRequest("POST", "/api/checkout", { planId });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  // Single-plan model: there is exactly one active plan.
  const plan = plans[0];
  const planFeatures = plan?.features?.length ? plan.features : PLAN_FEATURES_FALLBACK;

  const handleOrder = () => {
    if (!plan) return;
    if (!user) {
      setLocation(`/signup?plan=${plan.id}`);
      return;
    }
    checkoutMutation.mutate(plan.id);
  };

  const heroRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { margin: "0px" });
  const pricingInView = useInView(pricingRef, { margin: "100px" });
  const showStickyCta = !heroInView && !pricingInView;

  return (
    <MarketingLayout>
      <LeadPopup />
      {/* HERO — Split Reveal */}
      <section ref={heroRef} className="relative w-full overflow-hidden flex flex-col lg:flex-row lg:min-h-screen bg-[#0a0f1c]" data-testid="hero-section">

        {/* Left Dark Panel */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full lg:w-[52%] min-h-[auto] lg:min-h-screen bg-[#0a0f1c] text-white z-20 flex flex-col justify-center pb-8 lg:pb-0 lg:[clip-path:polygon(0_0,100%_0,92%_100%,0_100%)]"
        >
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[hsl(var(--primary)/0.5)] to-transparent shadow-[0_0_15px_hsl(var(--primary)/0.5)] z-30" style={{ transform: 'translateX(8vw) skewX(-4.5deg)' }} />

          <HeroGridBackground />

          <div className="relative z-10 p-6 sm:p-12 lg:p-20 xl:p-24 max-w-2xl xl:ml-auto lg:pr-32 pt-28 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Badge
                variant="secondary"
                className="mb-8 bg-white/5 border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.2)] text-[#f3a427] backdrop-blur-md"
                data-testid="badge-hero"
              >
                <Star size={16} weight="fill" className="mr-1.5 text-[#f3a427]" />
                <span className="tracking-wide text-xs sm:text-sm">WEBSITES VOOR STARTERS &amp; ZELFSTANDIGEN</span>
              </Badge>
            </motion.div>

            <motion.h1
              className="font-display text-[clamp(2.5rem,5vw+1rem,4.5rem)] leading-[1.05] tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              data-testid="text-hero-title"
            >
              <span className="block font-sans font-light text-slate-200 mb-2 text-[0.65em]">Professionele website</span>
              <span className="relative inline-block">
                op abonnement.
                <span className="absolute bottom-2 left-0 w-full h-3 bg-[hsl(var(--primary)/0.2)] -z-10 blur-sm" />
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mb-10 text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed font-light"
              data-testid="text-hero-description"
            >
              Voor starters en zelfstandigen: design, hosting, onderhoud en support in één vast maandbedrag vanaf <span className="text-white font-medium px-1 py-0.5 bg-white/10 rounded">€69/mnd</span>. Per kwartaal vooruit afgerekend.
              <span className="block mt-4 font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#f3a427] to-[#f3a427] text-xl">
                Zonder opstartkosten.
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <a href="#pricing">
                <Button size="lg" className="h-14 px-8 text-base bg-gradient-to-r from-[hsl(var(--primary))] to-blue-600 hover:from-[hsl(var(--primary)/0.9)] hover:to-blue-500 text-white transition-all rounded-full group shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] border-0" data-testid="button-hero-pricing">
                  Start je website
                  <ArrowRight size={16} weight={ICON_WEIGHT} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="flex flex-wrap items-center gap-6 text-sm text-slate-300 font-medium"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={20} weight={ICON_WEIGHT} className="text-emerald-400" />
                <span>Geen opstartkosten</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} weight={ICON_WEIGHT} className="text-emerald-400" />
                <span>6 maanden minimum</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} weight={ICON_WEIGHT} className="text-emerald-400" />
                <span>Inclusief SSL & hosting</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Light Panel — Single plan showcase */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:flex w-[55%] min-h-screen bg-background text-foreground z-10 -ml-[7%] flex-col"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary)/0.05)_0%,_transparent_100%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 flex-1 flex flex-col justify-center p-16 pl-24 xl:pl-32">
            <HeroPlanShowcase plan={plan} onOrder={handleOrder} isPending={checkoutMutation.isPending} />
          </div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="w-full mt-auto border-t border-border/60 bg-card/50 backdrop-blur-md py-4 px-12 flex flex-wrap items-center justify-start gap-x-8 gap-y-2 text-sm text-muted-foreground font-medium"
          >
            <div className="flex items-center gap-2">
              <Lock size={16} weight={ICON_WEIGHT} className="text-muted-foreground" />
              Geen opstartkosten
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} weight={ICON_WEIGHT} className="text-muted-foreground" />
              100% Eigendom content
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <Check size={16} weight={ICON_WEIGHT} className="text-muted-foreground" />
              Inclusief SSL & hosting
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile: plan card below dark panel */}
        <div className="lg:hidden bg-background py-8 px-4">
          <HeroPlanShowcase plan={plan} onOrder={handleOrder} isPending={checkoutMutation.isPending} />
        </div>

        {/* Mobile stat strip (visible below hero on small screens) */}
        <div className="lg:hidden bg-background px-4 py-6" data-testid="mobile-stat-strip">
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
            {[
              { value: "2 weken", label: "Tot live", icon: CalendarCheck, slug: "delivery" },
              { value: "99.9%", label: "Uptime", icon: Lightning, slug: "uptime" },
              { value: "<24u", label: "Support", icon: Clock, slug: "response" },
              { value: "€0", label: "Opstartkosten", icon: CreditCard, slug: "setup" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shrink-0"
                data-testid={`stat-mobile-${stat.slug}`}
              >
                <stat.icon size={18} weight={ICON_WEIGHT} className="text-primary shrink-0" />
                <div>
                  <div className="font-mono text-base font-bold tracking-tight leading-none" data-testid={`text-stat-value-${stat.slug}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING — single plan */}
      <section ref={pricingRef} id="pricing" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-transparent to-muted/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.04)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.03)_0%,transparent_50%)]" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollReveal className="text-center mb-6">
            <Badge variant="secondary" className="mb-4">
              Prijzen
            </Badge>
            <h2 className="font-display text-[clamp(1.875rem,3vw+0.5rem,3rem)] tracking-tight mb-4 leading-[1.15]" data-testid="text-pricing-title">
              Eén plan. Alles inbegrepen.
            </h2>
            <p className="text-lg text-muted-foreground max-w-[50ch] mx-auto leading-relaxed">
              Geen keuzestress: één helder abonnement met design, hosting, onderhoud en wijzigingscredits. Uitbreiden doet u met add-ons.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-14 text-sm text-muted-foreground">
              {[
                { icon: Lock, text: "Geen opstartkosten" },
                { icon: ShieldCheck, text: "6 maanden minimum" },
                { icon: CreditCard, text: "Kwartaal vooraf" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5">
                  <item.icon size={15} weight={ICON_WEIGHT} className="text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* One prominent dark plan card */}
          <ScrollReveal>
            <div className="max-w-2xl mx-auto">
              <motion.div
                className="relative rounded-3xl p-[2px] bg-gradient-to-b from-primary via-primary/60 to-primary/20 shadow-2xl shadow-primary/20"
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                data-testid="card-plan-single"
              >
                <div className="rounded-[22px] bg-[#0a0f1c] text-white p-8 md:p-10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/15 rounded-full blur-[100px] pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                      <h3 className="text-xl md:text-2xl font-bold">Website-abonnement</h3>
                      <Badge className="bg-primary text-primary-foreground shadow-lg shadow-primary/30 px-4 py-1">
                        <Star size={12} weight="fill" className="mr-1.5" />
                        Alles-in-één
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-display text-[clamp(3rem,5vw,4rem)] tracking-tight leading-none" data-testid="text-price-single">
                        €{plan ? (plan.monthlyPriceCents / 100).toFixed(0) : "69"}
                      </span>
                      <span className="text-slate-300">/maand</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-8">
                      Kwartaal vooraf gefactureerd (€207 per kwartaal) · minimale looptijd 6 maanden
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-8">
                      {planFeatures.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-200">
                          <Check size={15} weight="bold" className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full gap-2 rounded-xl h-12 text-base shadow-lg shadow-primary/25"
                      size="lg"
                      onClick={handleOrder}
                      disabled={checkoutMutation.isPending || !plan}
                      data-testid="button-order-single"
                    >
                      {checkoutMutation.isPending ? "Bezig..." : "Start je website"}
                      <ArrowRight size={16} weight={ICON_WEIGHT} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Credits uitleg */}
          <ScrollReveal delay={0.1}>
            <div className="max-w-2xl mx-auto mt-6">
              <div className="rounded-2xl border bg-card/80 backdrop-blur-sm p-6 flex items-start gap-4" data-testid="credits-explainer">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#f3a427]/20 to-[#f3a427]/5 border border-[#f3a427]/15 flex items-center justify-center shrink-0">
                  <Coins size={22} weight={ICON_WEIGHT} className="text-[#f3a427]" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Wijzigingscredits</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    2 wijzigingscredits per maand inbegrepen. 1 credit = 1 wijziging. Extra credits: €29/stuk.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Hoe het werkt: 3 stappen */}
          <ScrollReveal delay={0.15}>
            <div className="mt-16 max-w-4xl mx-auto">
              <h3 className="text-center text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-8">Zo werkt het</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { step: "01", title: "Intake", desc: "Vertel over uw bedrijf, doelen en huisstijl. Wij stellen de juiste vragen.", icon: Headset },
                  { step: "02", title: "Live in 2 weken", desc: "Wij ontwerpen en bouwen uw website. Binnen 2 weken staat u online.", icon: Lightning },
                  { step: "03", title: "Blijft actueel", desc: "Met 2 wijzigingscredits per maand blijft uw website altijd up-to-date.", icon: CheckCircle },
                ].map((item) => (
                  <div key={item.step} className="text-center" data-testid={`step-${item.step}`}>
                    <div className="relative inline-flex mb-5">
                      <div className="h-[3.5rem] w-[3.5rem] rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 flex items-center justify-center relative z-10">
                        <item.icon size={24} weight={ICON_WEIGHT} className="text-primary" />
                      </div>
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center z-20 shadow-sm">
                        {item.step.replace(/^0/, '')}
                      </span>
                    </div>
                    <h4 className="font-semibold text-base mb-1.5">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[28ch] mx-auto">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="mt-14 rounded-2xl border bg-card/80 backdrop-blur-sm p-6 md:p-8">
              <div className="text-center mb-6">
                <h3 className="font-semibold text-base">Altijd inbegrepen</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { icon: ShieldCheck, title: "SSL & Hosting", desc: "Veilige, snelle hosting inclusief" },
                  { icon: Lightning, title: "99.5% Uptime", desc: "Gegarandeerde beschikbaarheid" },
                  { icon: Headset, title: "Support via e-mail", desc: "Persoonlijke ondersteuning" },
                  { icon: Lock, title: "GDPR-compliant", desc: "Cookie banner & privacybeleid" },
                ].map((item) => (
                  <div key={item.title} className="flex flex-col items-center text-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon size={18} weight={ICON_WEIGHT} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium leading-snug">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ADD-ONS */}
      <section id="addons" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-muted/20 to-muted/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--primary)/0.04)_0%,transparent_50%)]" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollReveal className="text-center mb-6">
            <Badge variant="secondary" className="mb-4">
              Add-ons
            </Badge>
            <h2 className="font-display text-[clamp(1.875rem,3vw+0.5rem,3rem)] tracking-tight mb-4 leading-[1.15]" data-testid="text-addons-title">
              Meer bezoekers, meer klanten
            </h2>
            <p className="text-lg text-muted-foreground max-w-[50ch] mx-auto leading-relaxed">
              Breid uw website uit met bewezen diensten. Activeer of pauzeer wanneer u wilt — geen extra contract.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <div className="flex items-center justify-center gap-4 mb-14 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Lightning size={15} weight={ICON_WEIGHT} className="text-primary" />
                <span>Direct activeren</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={15} weight={ICON_WEIGHT} className="text-primary" />
                <span>Per kwartaal afgerekend</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={15} weight={ICON_WEIGHT} className="text-primary" />
                <span>Vrij combineerbaar</span>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {addOns.map((addOn, index) => {
              const Icon = addOnIcons[addOn.slug] || Lightning;
              return (
                <ScrollReveal key={addOn.id} delay={index * 0.08}>
                  <motion.div
                    className="group rounded-2xl border bg-card h-full overflow-hidden flex flex-col"
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    data-testid={`card-addon-${addOn.slug}`}
                  >
                    <div className="p-6 flex gap-4 flex-1">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                        <Icon size={22} weight={ICON_WEIGHT} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base mb-1 leading-snug">{addOn.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{addOn.description}</p>
                      </div>
                    </div>
                    <div className="border-t border-border/60 bg-muted/20 px-6 py-3.5 flex items-center justify-between">
                      <div className="flex items-baseline gap-1" data-testid={`text-addon-price-${addOn.slug}`}>
                        <span className="font-display text-xl leading-none">
                          €{(addOn.monthlyPriceCents / 100).toFixed(0)}
                        </span>
                        <span className="text-xs text-muted-foreground">/maand</span>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <ArrowRight size={12} weight={ICON_WEIGHT} />
                        Activeer via dashboard
                      </span>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}

            {/* "Iets anders nodig?" card */}
            <ScrollReveal delay={addOns.length * 0.08}>
              <motion.div
                className="group rounded-2xl border border-dashed border-[#f3a427]/40 bg-[#f3a427]/[0.03] h-full overflow-hidden flex flex-col"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                data-testid="card-addon-custom"
              >
                <div className="p-6 flex gap-4 flex-1">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#f3a427]/20 to-[#f3a427]/5 border border-[#f3a427]/15 flex items-center justify-center shrink-0">
                    <Star size={22} weight={ICON_WEIGHT} className="text-[#f3a427]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1 leading-snug">Iets anders nodig?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Webshop met 100+ producten, meertalige website of een koppeling op maat? Vertel ons wat u zoekt.
                    </p>
                  </div>
                </div>
                <div className="border-t border-border/60 bg-muted/20 px-6 py-3.5">
                  <a href="/offerte" className="text-sm font-medium text-[#f3a427] flex items-center gap-1.5" data-testid="link-addon-offerte">
                    Vraag een offerte aan
                    <ArrowRight size={14} weight={ICON_WEIGHT} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* MAATWERK */}
      <section id="maatwerk" className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c18] via-[#0a1020] to-[#080c18]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#f3a427]/[0.03] rounded-full blur-[100px]" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-[#f3a427]/10 border-[#f3a427]/20 text-[#f3a427]">
              <Star size={14} weight="fill" className="mr-1.5 text-[#f3a427]" />
              Op Maat
            </Badge>
            <h2 className="font-display text-[clamp(2rem,3.5vw+0.5rem,3.25rem)] tracking-tight mb-5 leading-[1.1] text-white" data-testid="text-maatwerk-title">
              Groter project? Wij bouwen het.
            </h2>
            <p className="text-lg text-slate-300/90 max-w-[52ch] mx-auto leading-relaxed">
              Voor bedrijven die meer nodig hebben dan het standaard abonnement. Eenmalige opstartkosten, daarna een vast maandbedrag voor hosting, onderhoud en support.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-5 mb-16">
            {[
              {
                icon: ShoppingCart,
                title: "E-commerce & webshops",
                description: "Webshops met 100+ producten, voorraadbeheer, betaalintegraties (iDEAL, Bancontact, creditcard) en verzendkoppelingen.",
                highlights: ["Productcatalogus", "Betaalintegraties", "Voorraadbeheer"],
              },
              {
                icon: Globe,
                title: "Meertalige websites",
                description: "Professionele websites in 5+ talen met vertaalbeheer, taalspecifieke SEO en automatische taaldetectie.",
                highlights: ["Vertaalbeheer", "SEO per taal", "Hreflang tags"],
              },
              {
                icon: CalendarCheck,
                title: "Boekings- & reserveringssystemen",
                description: "Geavanceerde planning met klant-zelf-boeken, agenda-synchronisatie, automatische bevestigingen en herinneringen.",
                highlights: ["Online boeken", "Agenda-sync", "Herinneringen"],
              },
              {
                icon: Gear,
                title: "Custom integraties & API's",
                description: "Naadloze koppelingen met uw bestaande systemen: CRM, ERP, boekhoudsoftware, en externe API's.",
                highlights: ["CRM-koppeling", "API-integratie", "Automatisering"],
              },
            ].map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.1}>
                <motion.div
                  className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 md:p-7 h-full flex gap-5 hover:bg-white/[0.06] hover:border-white/[0.12] transition-colors duration-300"
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  data-testid={`card-maatwerk-${index}`}
                >
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon size={22} weight={ICON_WEIGHT} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white mb-1.5">{item.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.highlights.map((h) => (
                        <span key={h} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-slate-300">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.2}>
            <div className="mb-16">
              <h3 className="text-center text-sm font-semibold tracking-widest uppercase text-slate-400 mb-8">Hoe maatwerk werkt</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { step: "01", title: "Vrijblijvend gesprek", desc: "Vertel over uw project. Wij luisteren, stellen de juiste vragen en denken mee." },
                  { step: "02", title: "Offerte op maat", desc: "Binnen 48 uur ontvangt u een heldere offerte met scope, planning en investering." },
                  { step: "03", title: "Wij bouwen & lanceren", desc: "Na akkoord starten wij direct. U volgt de voortgang en geeft feedback via uw dashboard." },
                ].map((item, i) => (
                  <div key={item.step} className="relative text-center">
                    <div className="font-mono text-5xl font-bold text-[#f3a427]/[0.08] absolute top-0 left-1/2 -translate-x-1/2 leading-none select-none">
                      {item.step}
                    </div>
                    <div className="relative pt-10">
                      <h4 className="text-sm font-semibold text-white mb-1.5">{item.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-[30ch] mx-auto">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm overflow-hidden max-w-3xl mx-auto">
              <div className="p-8 md:p-10 text-center">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-emerald-400 mb-5">
                  <CheckCircle size={14} weight="fill" />
                  Vrijblijvend &middot; Reactie binnen 48 uur
                </div>
                <h3 className="text-2xl md:text-[1.75rem] font-bold text-white mb-3 leading-snug" data-testid="text-maatwerk-cta-title">
                  Vertel ons over uw project
                </h3>
                <p className="text-slate-300/80 mb-8 max-w-md mx-auto leading-relaxed text-[0.95rem]">
                  Beschrijf uw wensen en ontvang een heldere offerte. Geen verplichtingen, geen verrassingen.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    className="h-13 px-8 text-base bg-gradient-to-r from-[hsl(var(--primary))] to-blue-600 hover:from-[hsl(var(--primary)/0.9)] hover:to-blue-500 text-white transition-all rounded-full group shadow-[0_0_30px_hsl(var(--primary)/0.25)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] border-0"
                    data-testid="button-maatwerk-offerte"
                    asChild
                  >
                    <a href="/offerte">
                      Vraag een offerte aan
                      <ArrowRight size={16} weight={ICON_WEIGHT} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>
              <div className="border-t border-white/[0.06] bg-white/[0.02] px-8 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
                {["Eenmalige opstart + maandelijkse fee", "Dedicated projectmanager", "Alle hosting & support inbegrepen"].map((text) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Check size={12} weight="bold" className="text-emerald-400" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-muted/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary)/0.03)_0%,transparent_50%)]" />

        <div className="container mx-auto max-w-3xl relative z-10">
          <ScrollReveal className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              FAQ
            </Badge>
            <h2 className="font-display text-[clamp(1.875rem,3vw+0.5rem,3rem)] tracking-tight mb-4 leading-[1.15]" data-testid="text-faq-title">
              Veelgestelde vragen
            </h2>
            <p className="text-lg text-muted-foreground max-w-[45ch] mx-auto leading-relaxed">
              Alles wat u wilt weten voordat u begint. Staat uw vraag er niet bij? Neem gerust contact op.
            </p>
          </ScrollReveal>

          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <FAQItem question={item.q} answer={item.a} index={index} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-10 text-center">
              <p className="text-sm text-muted-foreground mb-3">Nog een vraag?</p>
              <Button
                variant="outline"
                className="gap-2 rounded-full"
                data-testid="button-faq-contact"
                onClick={() => window.dispatchEvent(new CustomEvent("open-lead-popup"))}
              >
                <Headset size={16} weight={ICON_WEIGHT} />
                Stel uw vraag
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4 relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--primary)/0.92)] to-blue-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.12)_0%,transparent_60%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent" />

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-xs font-medium text-white/90 mb-6 backdrop-blur-sm">
              <Lightning size={14} weight="fill" />
              Gemiddeld binnen 2 weken live
            </div>
            <h2 className="font-display text-[clamp(2rem,4vw+0.5rem,3.5rem)] tracking-tight mb-5 text-white leading-[1.08]" data-testid="text-cta-title">
              Uw professionele website,<br className="hidden sm:block" /> binnen 2 weken online
            </h2>
            <p className="text-lg text-white/75 mb-10 max-w-[46ch] mx-auto leading-relaxed">
              Geen opstartkosten. Eén helder abonnement. Start vandaag en wij regelen de rest.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 shadow-xl h-14 px-8 text-base rounded-full"
                data-testid="button-cta-pricing"
                asChild
              >
                <a href="#pricing">
                  Start je website
                  <ArrowRight size={16} weight={ICON_WEIGHT} />
                </a>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="gap-2 h-14 px-8 text-base rounded-full text-white/90 hover:bg-white/10 hover:text-white border border-white/20"
                data-testid="button-cta-maatwerk"
                asChild
              >
                <a href="#maatwerk">
                  Of bekijk maatwerk
                </a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/50">
              {[
                { text: "Vanaf €69/maand", icon: CreditCard },
                { text: "Geen opstartkosten", icon: CheckCircle },
                { text: "6 maanden minimum", icon: ShieldCheck },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <item.icon size={15} weight={ICON_WEIGHT} className="text-white/60" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
            data-testid="sticky-mobile-cta"
          >
            <div className="bg-background/95 backdrop-blur-lg border-t border-border/50 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
              <a href="#pricing" className="block" data-testid="link-sticky-cta">
                <Button className="w-full gap-2 shadow-lg shadow-primary/20" size="lg" data-testid="button-sticky-cta">
                  Start je website
                  <ArrowRight size={16} weight={ICON_WEIGHT} />
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MarketingLayout>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="rounded-xl border bg-card overflow-hidden"
      data-testid={`faq-item-${index}`}
      whileTap={{ scale: 0.99 }}
      layout
    >
      <button
        className="w-full flex items-center justify-between p-5 md:p-6 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        data-testid={`button-faq-${index}`}
      >
        <span className="font-medium leading-snug">{question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
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
            <div className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-muted-foreground leading-relaxed max-w-[65ch]">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
