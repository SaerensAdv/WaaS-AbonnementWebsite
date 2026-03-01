import { useQuery, useMutation } from "@tanstack/react-query";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  ArrowRight,
  Globe,
  Shield,
  Zap,
  Headphones,
  Megaphone,
  Share2,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useState } from "react";
import type { Plan, AddOn } from "@shared/schema";

const tierConfig: Record<string, { label: string; popular?: boolean }> = {
  LOW: { label: "Starter" },
  MEDIUM: { label: "Professional", popular: true },
  HIGH: { label: "Business" },
};

const addOnIcons: Record<string, any> = {
  "google-ads": Megaphone,
  "meta-ads": Share2,
  "cookie-banner": ShieldCheck,
};

const faqItems = [
  {
    q: "Hoe snel is mijn website klaar?",
    a: "Na uw bestelling nemen we binnen 24 uur contact op. Uw website is gemiddeld binnen 5-10 werkdagen live, afhankelijk van de complexiteit en het aanleveren van content.",
  },
  {
    q: "Wat als ik wil opzeggen?",
    a: "U kunt op elk moment opzeggen via uw Stripe dashboard. Er is geen minimale looptijd. Na opzegging blijft uw website actief tot het einde van de betaalperiode.",
  },
  {
    q: "Wat is inbegrepen in het abonnement?",
    a: "Alles wat u nodig heeft: professioneel design, hosting, SSL certificaat, onderhoud, beveiligingsupdates, en email support. Geen verrassingen.",
  },
  {
    q: "Kan ik later upgraden?",
    a: "Ja, u kunt op elk moment upgraden naar een hoger plan. Het prijsverschil wordt automatisch verrekend via Stripe.",
  },
  {
    q: "Wie is eigenaar van de website?",
    a: "De content (teksten, afbeeldingen) is altijd van u. Het design en de technische opzet worden beheerd als onderdeel van het abonnement.",
  },
  {
    q: "Kan ik add-ons later toevoegen?",
    a: "Absoluut. U kunt op elk moment add-ons toevoegen of verwijderen via uw dashboard. De kosten worden automatisch verrekend.",
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useSEO({
    title: "Professionele Website als Abonnement",
    description: "Professionele websites vanaf €49/maand. Alles inbegrepen: design, hosting, onderhoud en support. Geen eenmalige kosten, direct online.",
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

  return (
    <MarketingLayout>
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6" data-testid="badge-hero">
            Website als abonnement
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
            Uw professionele website.
            <br />
            <span className="text-primary">Zonder gedoe.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="text-hero-description">
            Geen grote eenmalige investering. Geen technische zorgen. Gewoon een professionele website vanaf €49 per maand, alles inbegrepen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#pricing">
              <Button size="lg" className="gap-2 text-base px-8" data-testid="button-hero-pricing">
                Bekijk prijzen
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-y bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Globe, label: "Hosting inbegrepen" },
              { icon: Shield, label: "SSL & beveiliging" },
              { icon: Zap, label: "Altijd up-to-date" },
              { icon: Headphones, label: "Support inbegrepen" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-pricing-title">
              Kies uw plan
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Simpel, eerlijk en alles inbegrepen. Geen verborgen kosten.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {sortedPlans.map((plan) => {
              const config = tierConfig[plan.tier] || { label: plan.name };
              return (
                <Card
                  key={plan.id}
                  className={`relative border-2 transition-shadow ${
                    config.popular ? "border-primary shadow-lg shadow-primary/10" : "border-border"
                  }`}
                  data-testid={`card-plan-${plan.tier.toLowerCase()}`}
                >
                  {config.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground" data-testid="badge-popular">
                        Populairste keuze
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">{config.label}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold" data-testid={`text-price-${plan.tier.toLowerCase()}`}>
                        €{(plan.monthlyPriceCents / 100).toFixed(0)}
                      </span>
                      <span className="text-muted-foreground">/maand</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {plan.includedPages} pagina's inbegrepen
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {(plan.features || []).map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full gap-2"
                      variant={config.popular ? "default" : "outline"}
                      onClick={() => handleOrder(plan.id)}
                      disabled={checkoutMutation.isPending}
                      data-testid={`button-order-${plan.tier.toLowerCase()}`}
                    >
                      {checkoutMutation.isPending ? "Bezig..." : "Bestel nu"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="addons" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-addons-title">
              Groei met add-ons
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Extra diensten om uw online aanwezigheid te versterken. Voeg toe wanneer u wilt.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {addOns.map((addOn) => {
              const Icon = addOnIcons[addOn.slug] || Zap;
              const isCookieBanner = addOn.slug === "cookie-banner";
              return (
                <Card key={addOn.id} className="border" data-testid={`card-addon-${addOn.slug}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{addOn.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{addOn.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold" data-testid={`text-addon-price-${addOn.slug}`}>
                            €{(addOn.monthlyPriceCents / 100).toFixed(0)}
                            <span className="text-sm font-normal text-muted-foreground">/maand</span>
                          </span>
                          {isCookieBanner && (
                            <Badge variant="secondary" className="text-xs">
                              Gratis bij Professional+
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-faq-title">
              Veelgestelde vragen
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <FAQItem key={index} question={item.q} answer={item.a} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-cta-title">
            Klaar om te starten?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Kies uw plan en wij regelen de rest. Binnen 10 dagen live.
          </p>
          <a href="#pricing">
            <Button size="lg" variant="secondary" className="gap-2 text-base px-8" data-testid="button-cta-pricing">
              Bekijk prijzen
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>
    </MarketingLayout>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border rounded-lg overflow-hidden"
      data-testid={`faq-item-${index}`}
    >
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
        onClick={() => setOpen(!open)}
        data-testid={`button-faq-${index}`}
      >
        <span className="font-medium pr-4">{question}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-muted-foreground">
          {answer}
        </div>
      )}
    </div>
  );
}
