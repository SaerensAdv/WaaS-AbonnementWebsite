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
  Lock,
  CheckCircle,
  Gear,
} from "@phosphor-icons/react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useRef, useEffect } from "react";
import { motion, useInView, useScroll, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
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
        className="absolute bottom-[10%] right-[30%] w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[80px] mix-blend-screen"
      />
    </div>
  );
}

const cardColorMap: Record<string, string> = {
  LOW: "from-blue-500 to-cyan-500",
  MEDIUM: "from-[hsl(var(--primary))] to-blue-600",
  HIGH: "from-purple-500 to-indigo-500",
};

function HeroPricingCard({
  title,
  price,
  pages,
  color,
  isActive,
  rotateX,
  rotateY,
  depth,
  onMouseEnter,
  onClick,
}: {
  title: string;
  price: string;
  pages: number;
  color: string;
  isActive: boolean;
  rotateX: any;
  rotateY: any;
  depth: number;
  onMouseEnter: () => void;
  onClick: () => void;
}) {
  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      style={{ rotateX, rotateY, z: depth }}
      className={`absolute w-full max-w-[280px] sm:max-w-sm rounded-2xl border p-5 sm:p-6 bg-card/90 backdrop-blur-xl shadow-2xl transition-colors duration-500 cursor-pointer
        ${isActive ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border hover:border-primary/30'}`}
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-5`} />
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-foreground">{title}</h3>
          {isActive && (
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              Populair
            </span>
          )}
        </div>
        <div className="mb-5 flex items-baseline gap-1">
          <span className="font-display text-3xl sm:text-4xl text-foreground">{price}</span>
          <span className="text-muted-foreground font-medium text-sm">/mnd</span>
        </div>
        <ul className="space-y-2.5 mb-5">
          <li className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <Check size={14} weight={ICON_WEIGHT} />
            </div>
            {pages} Pagina's
          </li>
          <li className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <Check size={14} weight={ICON_WEIGHT} />
            </div>
            Inclusief hosting & SSL
          </li>
          <li className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <Check size={14} weight={ICON_WEIGHT} />
            </div>
            Onderhoud & Support
          </li>
        </ul>
        <Button
          className={`w-full transition-all ${isActive ? 'shadow-lg shadow-primary/25' : 'bg-muted text-foreground hover:bg-muted/80'}`}
          variant={isActive ? "default" : "secondary"}
          onClick={onClick}
          data-testid={`button-hero-card-${title.toLowerCase()}`}
        >
          Kies {title}
        </Button>
      </div>
    </motion.div>
  );
}

function HeroInteractiveCards({
  plans,
  onOrder,
}: {
  plans: Plan[];
  onOrder: (planId: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(1);
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
    setActiveCard(1);
  };

  const sortedPlans = [...plans].sort((a, b) => a.monthlyPriceCents - b.monthlyPriceCents);

  const cards = sortedPlans.map((plan) => ({
    id: plan.id,
    title: tierConfig[plan.tier]?.label || plan.name,
    price: `€${(plan.monthlyPriceCents / 100).toFixed(0)}`,
    pages: plan.includedPages ?? 0,
    color: cardColorMap[plan.tier] || "from-blue-500 to-cyan-500",
  }));

  return (
    <>
      {/* Desktop: 3D interactive perspective cards */}
      <div
        className="hidden lg:flex relative h-[550px] w-full items-center justify-center [perspective:1200px]"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovering(true)}
        data-testid="hero-interactive-cards"
      >
        {cards.map((card, index) => {
          const offset = index - activeCard;
          const isCenter = index === activeCard;
          let z = isCenter ? 50 : -100 - Math.abs(offset) * 50;
          let x = offset * 40;
          let y = offset * 20;

          if (isHovering) {
            x = offset * 120;
            y = offset * -20;
            z = isCenter ? 80 : -50;
          }

          return (
            <motion.div
              key={card.title}
              className="absolute left-0 right-0 mx-auto w-full max-w-sm"
              animate={{ x, y, z, scale: isCenter ? 1 : 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                transformStyle: "preserve-3d",
                zIndex: isCenter ? 30 : 10 - Math.abs(offset),
              }}
            >
              <HeroPricingCard
                title={card.title}
                price={card.price}
                pages={card.pages}
                color={card.color}
                rotateX={rotateX}
                rotateY={rotateY}
                depth={isHovering ? (isCenter ? 40 : 10) : 0}
                isActive={isCenter}
                onMouseEnter={() => setActiveCard(index)}
                onClick={() => onOrder(sortedPlans[index].id)}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Mobile/Tablet: Horizontal scrollable cards */}
      <div className="lg:hidden w-full relative" data-testid="hero-mobile-cards">
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex gap-4 overflow-x-auto pb-4 px-1 snap-x snap-mandatory scrollbar-hide">
          {cards.map((card, index) => {
            const isPopular = sortedPlans[index]?.tier === "MEDIUM";
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className={`relative snap-center shrink-0 w-[260px] rounded-2xl border p-5 bg-card/90 backdrop-blur-xl shadow-lg overflow-hidden
                  ${isPopular ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border'}`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.color} opacity-5 pointer-events-none`} />
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
                    {isPopular && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                        Populair
                      </span>
                    )}
                  </div>
                  <div className="mb-4 flex items-baseline gap-1">
                    <span className="font-display text-3xl text-foreground">{card.price}</span>
                    <span className="text-muted-foreground font-medium text-sm">/mnd</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        <Check size={12} weight={ICON_WEIGHT} />
                      </div>
                      {card.pages} Pagina's
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        <Check size={12} weight={ICON_WEIGHT} />
                      </div>
                      Hosting & SSL
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        <Check size={12} weight={ICON_WEIGHT} />
                      </div>
                      Support
                    </li>
                  </ul>
                  <Button
                    className={`w-full transition-all text-sm ${isPopular ? 'shadow-lg shadow-primary/25' : 'bg-muted text-foreground hover:bg-muted/80'}`}
                    variant={isPopular ? "default" : "secondary"}
                    size="sm"
                    onClick={() => onOrder(sortedPlans[index].id)}
                    data-testid={`button-hero-mobile-card-${card.title.toLowerCase()}`}
                  >
                    Kies {card.title}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
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
                className="mb-8 bg-white/5 border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.2)] text-amber-300 backdrop-blur-md"
                data-testid="badge-hero"
              >
                <Star size={16} weight="fill" className="mr-1.5 text-amber-300" />
                <span className="tracking-wide text-xs sm:text-sm">PREMIUM WEBSITES VOOR MKB</span>
              </Badge>
            </motion.div>

            <motion.h1
              className="font-display text-[clamp(2.5rem,5vw+1rem,4.5rem)] leading-[1.05] tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              data-testid="text-hero-title"
            >
              <span className="block font-sans font-light text-slate-200 mb-2 text-[0.65em]">Binnen 10 dagen een</span>
              <span className="relative inline-block">
                professionele website.
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
              Design, hosting, onderhoud en support in één vast maandbedrag vanaf <span className="text-white font-medium px-1 py-0.5 bg-white/10 rounded">€49/mnd</span>. Maandelijks opzegbaar.
              <span className="block mt-4 font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 text-xl">
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
                  Start uw website
                  <ArrowRight size={16} weight={ICON_WEIGHT} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="#faq">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/20 text-white hover:bg-white/10 hover:text-white rounded-full bg-white/5 backdrop-blur-sm transition-all" data-testid="button-hero-faq">
                  Hoe werkt het?
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
                <span>Maandelijks opzegbaar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} weight={ICON_WEIGHT} className="text-emerald-400" />
                <span>Inclusief SSL & Hosting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} weight={ICON_WEIGHT} className="text-emerald-400" />
                <span>Premium Design</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Light Panel — Interactive 3D Pricing Cards (desktop only as separate panel) */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:flex w-[55%] min-h-screen bg-background text-foreground z-10 -ml-[7%] flex-col"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary)/0.05)_0%,_transparent_100%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 flex-1 flex flex-col justify-center p-16 pl-24 xl:pl-32">
            {sortedPlans.length > 0 && (
              <HeroInteractiveCards plans={sortedPlans} onOrder={handleOrder} />
            )}
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
              Geen opstartkosten, geen contract
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} weight={ICON_WEIGHT} className="text-muted-foreground" />
              100% Eigendom content
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <Check size={16} weight={ICON_WEIGHT} className="text-muted-foreground" />
              Inclusief SSL & Hosting
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile: Scrollable pricing cards below dark panel */}
        <div className="lg:hidden bg-background py-6 px-4">
          {sortedPlans.length > 0 && (
            <HeroInteractiveCards plans={sortedPlans} onOrder={handleOrder} />
          )}
        </div>

        {/* Mobile stat strip (visible below hero on small screens) */}
        <div className="lg:hidden bg-background px-4 py-6" data-testid="mobile-stat-strip">
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
            {[
              { value: "500+", label: "Websites", icon: Star, slug: "clients" },
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

      {/* PRICING */}
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
              Kies het plan dat bij u past
            </h2>
            <p className="text-lg text-muted-foreground max-w-[50ch] mx-auto leading-relaxed">
              Elk plan bevat design, hosting, onderhoud en support. Het verschil? Het aantal pagina's en extra mogelijkheden.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-14 text-sm text-muted-foreground">
              {[
                { icon: Lock, text: "Geen opstartkosten" },
                { icon: ShieldCheck, text: "6 maanden minimum" },
                { icon: CheckCircle, text: "14 dagen gratis proefperiode" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5">
                  <item.icon size={15} weight={ICON_WEIGHT} className="text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-5">
            {sortedPlans.map((plan, index) => {
              const config = tierConfig[plan.tier] || { label: plan.name };
              return (
                <ScrollReveal key={plan.id} delay={index * 0.1}>
                  <motion.div
                    className={`relative rounded-2xl p-[2px] h-full ${
                      config.popular
                        ? "bg-gradient-to-b from-primary via-primary/60 to-primary/20 shadow-xl shadow-primary/15"
                        : "bg-gradient-to-b from-border via-border/60 to-border/30"
                    }`}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    whileTap={{ scale: 0.98 }}
                    data-testid={`card-plan-${plan.tier.toLowerCase()}`}
                  >
                    {config.popular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                        <Badge className="bg-primary text-primary-foreground shadow-lg shadow-primary/30 px-4 py-1" data-testid="badge-popular">
                          <Star size={12} weight="fill" className="mr-1.5" />
                          Meest gekozen
                        </Badge>
                      </div>
                    )}
                    <div className={`rounded-[14px] p-6 md:p-7 h-full flex flex-col ${
                      config.popular
                        ? "bg-gradient-to-b from-card via-card to-primary/[0.02]"
                        : "bg-card"
                    }`}>
                      <div className="text-center mb-6">
                        <h3 className={`text-sm font-semibold mb-4 tracking-widest uppercase ${
                          config.popular ? "text-primary" : "text-muted-foreground"
                        }`}>{config.label}</h3>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="font-display text-[clamp(2.25rem,3.5vw,3rem)] tracking-tight leading-none" data-testid={`text-price-${plan.tier.toLowerCase()}`}>
                            €{(plan.monthlyPriceCents / 100).toFixed(0)}
                          </span>
                          <span className="text-muted-foreground text-sm">/maand</span>
                        </div>
                        <div className="mt-3 inline-flex items-center gap-1.5 bg-muted/60 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
                          <FileText size={12} weight={ICON_WEIGHT} />
                          {plan.includedPages} pagina's
                        </div>
                      </div>
                      <div className="h-px bg-border/60 mb-5" />
                      <ul className="space-y-2.5 flex-1 mb-6">
                        {(plan.features || []).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                            <Check size={14} weight="bold" className="text-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full gap-2 rounded-xl h-11 ${
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

            <ScrollReveal delay={0.3}>
              <motion.div
                className="relative rounded-2xl p-[2px] h-full bg-gradient-to-b from-amber-400/40 via-amber-400/20 to-amber-400/5"
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                whileTap={{ scale: 0.98 }}
                data-testid="card-plan-custom"
              >
                <div className="rounded-[14px] bg-card p-6 md:p-7 h-full flex flex-col">
                  <div className="text-center mb-6">
                    <h3 className="text-sm font-semibold mb-4 tracking-widest uppercase text-amber-600 dark:text-amber-400">Op Maat</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="font-display text-[clamp(1.5rem,2.5vw,2rem)] tracking-tight leading-none" data-testid="text-price-custom">
                        Op aanvraag
                      </span>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-500/10 rounded-full px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                      <Star size={12} weight="fill" />
                      Volledig op maat
                    </div>
                  </div>
                  <div className="h-px bg-border/60 mb-5" />
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {[
                      "Alles in Business, plus:",
                      "Onbeperkt aantal pagina's",
                      "E-commerce (100+ producten)",
                      "Meertalig (5+ talen)",
                      "Complexe integraties op maat",
                      "Custom boekingssystemen",
                      "Eenmalige opstart + maandelijkse fee",
                      "Dedicated projectmanager",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                        <Star size={14} weight="fill" className="text-amber-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full gap-2 rounded-xl h-11"
                    variant="outline"
                    data-testid="button-order-custom"
                    asChild
                  >
                    <a href="#maatwerk">
                      Vraag een offerte aan
                      <ArrowRight size={16} weight={ICON_WEIGHT} />
                    </a>
                  </Button>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.4}>
            <div className="mt-12 rounded-2xl border bg-card/80 backdrop-blur-sm p-6 md:p-8">
              <div className="text-center mb-6">
                <h3 className="font-semibold text-base">Bij elk plan inbegrepen</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { icon: ShieldCheck, title: "SSL & Hosting", desc: "Veilige, snelle hosting inclusief" },
                  { icon: Lightning, title: "99.5% Uptime", desc: "Gegarandeerde beschikbaarheid" },
                  { icon: Headset, title: "Persoonlijke support", desc: "E-mail & telefoon ondersteuning" },
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

      {/* MAATWERK */}
      <section id="maatwerk" className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c18] via-[#0a1020] to-[#080c18]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[100px]" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-amber-500/10 border-amber-500/20 text-amber-300">
              <Star size={14} weight="fill" className="mr-1.5 text-amber-400" />
              Op Maat
            </Badge>
            <h2 className="font-display text-[clamp(2rem,3.5vw+0.5rem,3.25rem)] tracking-tight mb-5 leading-[1.1] text-white" data-testid="text-maatwerk-title">
              Groter project? Wij bouwen het.
            </h2>
            <p className="text-lg text-slate-300/90 max-w-[52ch] mx-auto leading-relaxed">
              Voor bedrijven die meer nodig hebben dan een standaard pakket. Eenmalige opstartkosten, daarna een vast maandbedrag voor hosting, onderhoud en support.
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
                    <div className="font-mono text-5xl font-bold text-amber-400/[0.08] absolute top-0 left-1/2 -translate-x-1/2 leading-none select-none">
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
                    <a href="mailto:info@abonnement.website?subject=Aanvraag%20maatwerk%20project">
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
                <span>Maandelijks opzegbaar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={15} weight={ICON_WEIGHT} className="text-primary" />
                <span>Combineerbaar met elk plan</span>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {addOns.map((addOn, index) => {
              const Icon = addOnIcons[addOn.slug] || Lightning;
              return (
                <ScrollReveal key={addOn.id} delay={index * 0.08}>
                  <motion.div
                    className="group rounded-2xl border bg-card h-full overflow-hidden"
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    data-testid={`card-addon-${addOn.slug}`}
                  >
                    <div className="p-6 flex gap-4">
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
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,hsl(var(--primary)/0.03)_0%,transparent_50%)]" />

        <div className="container mx-auto max-w-5xl relative z-10">
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

          <div className="relative">
            <div className="hidden lg:block absolute top-[2.75rem] left-[calc(12.5%+1.25rem)] right-[calc(12.5%+1.25rem)] h-px bg-gradient-to-r from-border via-primary/20 to-border" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
              {[
                { step: "01", title: "Kies uw plan", desc: "Selecteer het abonnement dat bij u past. Afrekenen duurt 2 minuten.", icon: CreditCard },
                { step: "02", title: "Deel uw wensen", desc: "Vertel over uw bedrijf, doelen en huisstijl. Wij stellen de juiste vragen.", icon: Globe },
                { step: "03", title: "Wij bouwen", desc: "Binnen 10 werkdagen ontvangt u uw complete website, klaar voor lancering.", icon: Lightning },
                { step: "04", title: "U bent online", desc: "Uw website is live. Volg bezoekers en resultaten via uw persoonlijke dashboard.", icon: Star },
              ].map((item, i) => (
                <ScrollReveal key={item.step} delay={i * 0.12}>
                  <div className="text-center relative">
                    <div className="relative inline-flex mb-6">
                      <div className="h-[3.5rem] w-[3.5rem] rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 flex items-center justify-center relative z-10">
                        <item.icon size={24} weight={ICON_WEIGHT} className="text-primary" />
                      </div>
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center z-20 shadow-sm">
                        {item.step.replace(/^0/, '')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 leading-snug">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[28ch] mx-auto">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <ScrollReveal delay={0.5}>
            <div className="mt-14 flex items-center justify-center">
              <Button size="lg" className="gap-2 rounded-full shadow-lg shadow-primary/20" asChild data-testid="button-hiw-cta">
                <a href="#pricing">
                  Bekijk de plannen
                  <ArrowRight size={16} weight={ICON_WEIGHT} />
                </a>
              </Button>
            </div>
          </ScrollReveal>
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
