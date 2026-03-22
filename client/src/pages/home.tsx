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
  FileText,
  ShoppingCart,
  UsersThree,
  CalendarCheck,
} from "@phosphor-icons/react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useRef } from "react";
import { motion, useInView, useScroll, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Plan, AddOn } from "@shared/schema";

const ICON_WEIGHT = "duotone" as const;

const tierConfig: Record<string, { label: string; popular?: boolean }> = {
  LOW: { label: "Starter" },
  MEDIUM: { label: "Professional", popular: true },
  HIGH: { label: "Business" },
};

const addOnIcons: Record<string, any> = {
  "google-ads": Megaphone,
  "meta-ads": ShareNetwork,
  "extra-content": FileText,
  "ecommerce": ShoppingCart,
  "social-media": UsersThree,
  "booking": CalendarCheck,
};

const faqItems = [
  {
    q: "Hoe snel staat mijn website online?",
    a: "Snel. Na uw bestelling nemen we binnen 24 uur contact op. De meeste websites zijn binnen 5 tot 10 werkdagen live. U hoeft alleen uw content aan te leveren — wij doen de rest.",
  },
  {
    q: "Zit ik ergens aan vast?",
    a: "Nee. Er is geen minimale looptijd en geen opzegboete. U kunt op elk moment opzeggen via uw dashboard. Uw website blijft actief tot het einde van de betaalperiode. Zo simpel is het.",
  },
  {
    q: "Wat zit er allemaal in het abonnement?",
    a: "Alles wat u nodig heeft om online professioneel over te komen: op maat gemaakt design, snelle hosting, SSL certificaat, maandelijks onderhoud, beveiligingsupdates en persoonlijke support. Geen verborgen kosten, geen verrassingen achteraf.",
  },
  {
    q: "Kan ik later upgraden of downgraden?",
    a: "Ja, op elk moment. Uw plan aanpassen kan met één klik in uw dashboard. Het prijsverschil wordt automatisch verrekend — u betaalt nooit dubbel.",
  },
  {
    q: "Wie is eigenaar van mijn content?",
    a: "Uw teksten, afbeeldingen en bedrijfsdata zijn altijd van u. Het technische ontwerp en de hosting worden beheerd als onderdeel van uw abonnement, zodat u zich daar geen zorgen over hoeft te maken.",
  },
  {
    q: "Wat als ik niet tevreden ben?",
    a: "Dan horen we dat graag. We werken samen aan aanpassingen tot het design past bij uw wensen. En omdat er geen contract of minimale looptijd is, kunt u op elk moment stoppen — u betaalt alleen zolang u waarde ervaart.",
  },
  {
    q: "Kan ik add-ons later toevoegen of verwijderen?",
    a: "Absoluut. U kunt op elk moment add-ons activeren of pauzeren via uw dashboard. De kosten worden direct verrekend. Geen gedoe, geen wachttijden.",
  },
  {
    q: "Zit de cookie banner er bij alle plannen bij?",
    a: "Ja. Elke website die wij bouwen bevat een GDPR-conforme cookie banner via ConsentEase. Dit zit standaard inbegrepen bij alle abonnementen — zonder meerkosten.",
  },
];

const trustItems = [
  { icon: ShieldCheck, label: "SSL beveiligd" },
  { icon: Lightning, label: "99.9% uptime garantie" },
  { icon: Clock, label: "Maandelijks opzegbaar" },
  { icon: Headset, label: "Persoonlijke support" },
  { icon: CreditCard, label: "Veilig betalen via Stripe" },
];

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

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a,
      },
    })),
  };

  useSEO({
    title: "Professionele Website als Abonnement | Vanaf €49/maand",
    description: "Professionele website binnen 10 werkdagen live. Vanaf €49/maand, alles inbegrepen: design, hosting, onderhoud en support. Geen opstartkosten, maandelijks opzegbaar.",
    canonical: "/",
    structuredData: faqStructuredData,
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

  const handleOrder = (planId: string) => {
    if (!user) {
      setLocation(`/signup?plan=${planId}`);
      return;
    }
    checkoutMutation.mutate(planId);
  };

  const sortedPlans = [...plans].sort((a, b) => a.monthlyPriceCents - b.monthlyPriceCents);

  const heroRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { margin: "0px" });
  const pricingInView = useInView(pricingRef, { margin: "100px" });
  const showStickyCta = !heroInView && !pricingInView;

  return (
    <MarketingLayout>
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[90dvh] flex items-center pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute top-20 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-chart-4/5 blur-3xl" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge
                  variant="secondary"
                  className="mb-8 border border-primary/20 bg-primary/5 text-primary"
                  data-testid="badge-hero"
                >
                  <Star size={16} weight={ICON_WEIGHT} className="mr-1.5" />
                  Geen opstartkosten, geen contract
                </Badge>
              </motion.div>

              <motion.h1
                className="font-display text-[clamp(2.5rem,5vw+1rem,4.5rem)] tracking-tight mb-6 leading-[1.1]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                data-testid="text-hero-title"
              >
                Binnen 10 dagen een professionele website.{" "}
                <span className="text-primary">Zonder opstartkosten.</span>
              </motion.h1>

              <motion.p
                className="text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] text-muted-foreground max-w-[55ch] mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                data-testid="text-hero-description"
              >
                Design, hosting, onderhoud en support in één vast maandbedrag vanaf{" "}
                <span className="font-semibold text-foreground">€49 per maand</span>. Maandelijks opzegbaar, geen verplichtingen.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <a href="#pricing" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20" data-testid="button-hero-pricing">
                    Start uw website
                    <ArrowRight size={16} weight={ICON_WEIGHT} />
                  </Button>
                </a>
                <a href="#faq" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2" data-testid="button-hero-faq">
                    Hoe werkt het?
                  </Button>
                </a>
              </motion.div>
            </div>

            <motion.div
              className="hidden lg:flex flex-col gap-4 items-end"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {[
                  { value: "500+", label: "Websites gebouwd", icon: Star },
                  { value: "99.9%", label: "Uptime garantie", icon: Lightning },
                  { value: "<24u", label: "Reactietijd support", icon: Clock },
                  { value: "€0", label: "Opstartkosten", icon: CreditCard },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="rounded-2xl border bg-card/80 backdrop-blur-sm p-6 space-y-3"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <stat.icon size={20} weight={ICON_WEIGHT} className="text-primary" />
                    <div className="font-mono text-2xl font-bold tracking-tight leading-none">{stat.value}</div>
                    <div className="text-sm text-muted-foreground leading-snug">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="flex lg:hidden overflow-x-auto gap-3 mt-10 pb-2 -mx-4 px-4 scrollbar-hide"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            data-testid="mobile-stat-strip"
          >
            {[
              { value: "500+", label: "Websites", icon: Star, slug: "clients" },
              { value: "99.9%", label: "Uptime", icon: Lightning, slug: "uptime" },
              { value: "<24u", label: "Support", icon: Clock, slug: "response" },
              { value: "€0", label: "Opstartkosten", icon: CreditCard, slug: "setup" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl border bg-card/80 backdrop-blur-sm px-4 py-3 shrink-0"
                data-testid={`stat-mobile-${stat.slug}`}
              >
                <stat.icon size={18} weight={ICON_WEIGHT} className="text-primary shrink-0" />
                <div>
                  <div className="font-mono text-base font-bold tracking-tight leading-none" data-testid={`text-stat-value-${stat.slug}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="py-5 px-4 border-y border-border/50">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {trustItems.map((item, i) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon size={16} weight={ICON_WEIGHT} className="text-primary/70" />
                  <span>{item.label}</span>
                  {i < trustItems.length - 1 && (
                    <span className="hidden md:inline ml-6 text-border/80">|</span>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* PRICING */}
      <section ref={pricingRef} id="pricing" className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Prijzen
            </Badge>
            <h2 className="font-display text-[clamp(1.875rem,3vw+0.5rem,3rem)] tracking-tight mb-4 leading-[1.15]" data-testid="text-pricing-title">
              Kies het plan dat bij u past
            </h2>
            <p className="text-lg text-muted-foreground max-w-[50ch] mx-auto leading-relaxed">
              Elk plan bevat design, hosting, onderhoud en support. Het verschil? Het aantal pagina's en extra mogelijkheden.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {sortedPlans.map((plan, index) => {
              const config = tierConfig[plan.tier] || { label: plan.name };
              return (
                <ScrollReveal key={plan.id} delay={index * 0.1}>
                  <motion.div
                    className={`relative rounded-2xl border-2 p-1 h-full ${
                      config.popular
                        ? "border-primary bg-gradient-to-b from-primary/5 to-transparent shadow-xl shadow-primary/10"
                        : "border-border"
                    }`}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    whileTap={{ scale: 0.98 }}
                    data-testid={`card-plan-${plan.tier.toLowerCase()}`}
                  >
                    {config.popular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                        <Badge className="bg-primary text-primary-foreground shadow-lg shadow-primary/30" data-testid="badge-popular">
                          Meest gekozen
                        </Badge>
                      </div>
                    )}
                    <div className="rounded-xl bg-card p-6 md:p-8 h-full flex flex-col">
                      <div className="text-center mb-8">
                        <h3 className="text-base font-semibold mb-4 tracking-wide uppercase text-muted-foreground">{config.label}</h3>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="font-display text-[clamp(2.5rem,4vw,3.5rem)] tracking-tight leading-none" data-testid={`text-price-${plan.tier.toLowerCase()}`}>
                            €{(plan.monthlyPriceCents / 100).toFixed(0)}
                          </span>
                          <span className="text-muted-foreground text-sm">/maand</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">
                          {plan.includedPages} pagina's inbegrepen
                        </p>
                      </div>
                      <ul className="space-y-3 flex-1 mb-8">
                        {(plan.features || []).map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={12} weight={ICON_WEIGHT} className="text-primary" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full gap-2 ${
                          config.popular ? "shadow-lg shadow-primary/20" : ""
                        }`}
                        variant={config.popular ? "default" : "outline"}
                        onClick={() => handleOrder(plan.id)}
                        disabled={checkoutMutation.isPending}
                        data-testid={`button-order-${plan.tier.toLowerCase()}`}
                      >
                        {checkoutMutation.isPending ? "Bezig..." : `Start met ${config.label}`}
                        <ArrowRight size={16} weight={ICON_WEIGHT} />
                      </Button>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ADD-ONS */}
      <section id="addons" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute inset-0 dot-grid opacity-30" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollReveal className="text-center mb-16">
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

          <div className="grid md:grid-cols-3 gap-6">
            {addOns.map((addOn, index) => {
              const Icon = addOnIcons[addOn.slug] || Lightning;
              return (
                <ScrollReveal key={addOn.id} delay={index * 0.1}>
                  <motion.div
                    className="rounded-2xl border bg-card p-6 h-full"
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    data-testid={`card-addon-${addOn.slug}`}
                  >
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                      <Icon size={24} weight={ICON_WEIGHT} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 leading-snug">{addOn.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-[45ch]">{addOn.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-2xl leading-none" data-testid={`text-addon-price-${addOn.slug}`}>
                        €{(addOn.monthlyPriceCents / 100).toFixed(0)}
                        <span className="text-sm font-sans font-normal text-muted-foreground">/maand</span>
                      </span>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Hoe het werkt
            </Badge>
            <h2 className="font-display text-[clamp(1.875rem,3vw+0.5rem,3rem)] tracking-tight mb-4 leading-[1.15]">
              Van bestelling tot live in 10 dagen
            </h2>
            <p className="text-lg text-muted-foreground max-w-[50ch] mx-auto leading-relaxed">
              U kiest, wij bouwen. Vier stappen, geen technische kennis nodig.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Kies uw plan", desc: "Selecteer het abonnement dat bij u past. Afrekenen duurt 2 minuten.", icon: CreditCard },
              { step: "02", title: "Deel uw wensen", desc: "Vertel over uw bedrijf, doelen en huisstijl. Wij stellen de juiste vragen.", icon: Globe },
              { step: "03", title: "Wij bouwen", desc: "Binnen 10 werkdagen ontvangt u uw complete website, klaar voor lancering.", icon: Lightning },
              { step: "04", title: "U bent online", desc: "Uw website is live. Volg bezoekers en resultaten via uw persoonlijke dashboard.", icon: Star },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.1}>
                <div className="relative">
                  <div className="font-mono text-6xl font-bold text-primary/[0.07] dark:text-primary/[0.04] absolute -top-4 -left-1 leading-none select-none">
                    {item.step}
                  </div>
                  <div className="relative pt-10">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon size={20} weight={ICON_WEIGHT} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 leading-snug">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[35ch]">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="container mx-auto max-w-3xl relative z-10">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              FAQ
            </Badge>
            <h2 className="font-display text-[clamp(1.875rem,3vw+0.5rem,3rem)] tracking-tight mb-4 leading-[1.15]" data-testid="text-faq-title">
              Veelgestelde vragen
            </h2>
          </ScrollReveal>

          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <FAQItem question={item.q} answer={item.a} index={index} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden grain-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-700" />
        <div className="absolute inset-0 dot-grid opacity-10" />

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <ScrollReveal>
            <h2 className="font-display text-[clamp(1.875rem,3vw+0.5rem,3rem)] tracking-tight mb-6 text-primary-foreground leading-[1.15]" data-testid="text-cta-title">
              Uw website kan volgende week al live staan
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-10 max-w-[50ch] mx-auto leading-relaxed">
              Geen opstartkosten. Geen contract. Binnen 10 dagen online. Kies uw plan en wij regelen de rest.
            </p>
            <a href="#pricing">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 shadow-xl"
                data-testid="button-cta-pricing"
              >
                Start uw website
                <ArrowRight size={16} weight={ICON_WEIGHT} />
              </Button>
            </a>
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
                  Start uw website
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
