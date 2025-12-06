import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MobileCarouselSection } from "@/components/mobile-carousel";
import {
  Check,
  X,
  Globe,
  Megaphone,
  Search,
  FileText,
  MapPin,
  TrendingUp,
  ArrowRight,
  Info,
  Loader2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Plan, AddOn } from "@shared/schema";
import { RecommendationWizard } from "@/components/recommendation-wizard";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

const planIcons = {
  LOW: "text-chart-2",
  MEDIUM: "text-primary",
  HIGH: "text-chart-3",
};

const addOnIcons: Record<string, any> = {
  "google-ads": Megaphone,
  "meta-ads": Megaphone,
  "seo": Search,
  "content": FileText,
  "local-seo": MapPin,
};

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function PlanCard({ 
  plan, 
  featured = false, 
  isCustomer,
  isLoggedIn,
  onCheckout,
  isCheckoutPending,
  pendingPlanId,
}: { 
  plan: Plan; 
  featured?: boolean;
  isCustomer: boolean;
  isLoggedIn: boolean;
  onCheckout: (planId: string) => void;
  isCheckoutPending: boolean;
  pendingPlanId: string | null;
}) {
  const features = plan.features || [];
  const isPending = isCheckoutPending && pendingPlanId === plan.id;

  const handleClick = () => {
    if (plan.tier === "HIGH") {
      window.location.href = "mailto:sales@abonnement.website?subject=Custom%20Plan%20Aanvraag";
    } else if (isCustomer) {
      onCheckout(plan.id);
    } else if (!isLoggedIn) {
      window.location.href = `/signup?plan=${plan.id}`;
    }
  };
  
  const getButtonText = () => {
    if (plan.tier === "HIGH") return "Neem contact op";
    if (isLoggedIn && !isCustomer) return "Alleen voor klanten";
    if (isCustomer) return "Direct starten";
    return "Selecteer plan";
  };

  return (
    <Card className={`relative flex flex-col ${featured ? "border-2 border-primary" : "border"}`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge>Populair</Badge>
        </div>
      )}
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={planIcons[plan.tier as keyof typeof planIcons]}>
            {plan.tier}
          </Badge>
        </div>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <div className="mt-2">
          {plan.tier === "HIGH" ? (
            <div className="text-3xl font-semibold">Op maat</div>
          ) : (
            <div className="text-3xl font-semibold">
              {formatPrice(plan.monthlyPriceCents)}
              <span className="text-base font-normal text-muted-foreground">/maand</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground border-b pb-3 mb-3">
            {plan.tier === "LOW" && `Keuze uit ${plan.includedTemplatesMax} templates`}
            {plan.tier === "MEDIUM" && `Keuze uit ${plan.includedTemplatesMax} templates`}
            {plan.tier === "HIGH" && "Volledig op maat ontwerp"}
          </div>
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
          <div className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>{plan.includedPages} pagina's inbegrepen</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>{plan.includedCredits} credits/wijzigingen per maand</span>
          </div>
          {plan.slaText && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground pt-2 border-t mt-4">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{plan.slaText}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button 
          className="w-full gap-2" 
          variant={featured ? "default" : "outline"} 
          data-testid={`button-select-${plan.tier.toLowerCase()}`}
          onClick={handleClick}
          disabled={isPending || (isLoggedIn && !isCustomer && plan.tier !== "HIGH")}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {getButtonText()}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function AddOnCard({ addOn }: { addOn: AddOn }) {
  const IconComponent = addOnIcons[addOn.slug] || TrendingUp;

  return (
    <Card className="border">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{addOn.name}</h3>
              {addOn.requiresBudget && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="secondary" className="text-xs">Budget</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Deze add-on vereist een maandelijks advertentiebudget</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{addOn.description}</p>
            {addOn.baseFeeCents && addOn.baseFeeCents > 0 && (
              <div className="text-sm">
                <span className="font-medium">Vanaf {formatPrice(addOn.baseFeeCents)}</span>
                <span className="text-muted-foreground">/maand</span>
              </div>
            )}
            {addOn.requiresBudget && (
              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Media/beheer split: {addOn.mediaPercentageDefault}% / {100 - (addOn.mediaPercentageDefault || 85)}%
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PlansSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border">
          <CardHeader>
            <Skeleton className="h-6 w-20 mb-2" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-24 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function PricingPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Wat kost een website abonnement?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Onze website abonnementen starten vanaf €99 per maand voor het Starter pakket. Het Professional pakket kost €199 per maand en biedt uitgebreidere functionaliteiten. Voor Enterprise oplossingen maken wij een offerte op maat."
        }
      },
      {
        "@type": "Question",
        "name": "Wat is inbegrepen in het abonnement?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Elk abonnement bevat een professionele website, beheerde hosting met SSL, regelmatige updates en backups, basis SEO optimalisatie, en ondersteuning via e-mail. Afhankelijk van uw plan krijgt u ook toegang tot meer templates en maandelijkse credits voor wijzigingen."
        }
      },
      {
        "@type": "Question",
        "name": "Kan ik mijn abonnement opzeggen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, u kunt maandelijks opzeggen. Na opzegging blijft uw website nog 30 dagen actief. Op verzoek kunnen we uw websitebestanden exporteren zodat u ze elders kunt hosten."
        }
      },
      {
        "@type": "Question",
        "name": "Hoe werkt de budgetsplit voor advertenties?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bij onze advertentie add-ons (Google Ads, Meta Ads) splitsen we uw maandbudget automatisch op. Standaard gaat 85% naar mediakosten (de daadwerkelijke advertenties) en 15% naar beheerskosten. U ziet deze split altijd transparant voordat u bevestigt."
        }
      },
      {
        "@type": "Question",
        "name": "Kan ik later upgraden naar een hoger plan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja, u kunt op elk moment upgraden. Het verschil in kosten wordt pro-rata berekend. Uw bestaande website en data blijven volledig behouden bij een upgrade."
        }
      }
    ]
  };

  useSEO({
    title: "Prijzen en Abonnementen",
    description: "Kies het website abonnement dat past bij uw bedrijf. Starter vanaf €99/maand, Professional vanaf €199/maand, of Enterprise voor maatwerk. Inclusief hosting en onderhoud.",
    canonical: "/pricing",
    structuredData: faqSchema,
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  const { data: plans, isLoading: plansLoading } = useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });

  const { data: addOns, isLoading: addOnsLoading } = useQuery<AddOn[]>({
    queryKey: ["/api/addons"],
  });

  const checkoutMutation = useMutation({
    mutationFn: async (planId: string) => {
      setPendingPlanId(planId);
      const response = await apiRequest("POST", "/api/checkout", { planId });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Fout",
          description: "Kan checkout niet starten. Probeer het opnieuw.",
          variant: "destructive",
        });
      }
      setPendingPlanId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Fout",
        description: error.message || "Kan checkout niet starten. Probeer het opnieuw.",
        variant: "destructive",
      });
      setPendingPlanId(null);
    },
  });

  const sortedPlans = plans?.sort((a, b) => {
    const order = { LOW: 0, MEDIUM: 1, HIGH: 2 };
    return (order[a.tier as keyof typeof order] || 0) - (order[b.tier as keyof typeof order] || 0);
  });

  return (
    <MarketingLayout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <BreadcrumbNav 
            items={[{ label: "Prijzen" }]} 
            className="mb-12"
          />
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Prijzen</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4" data-testid="text-pricing-title">
              Transparante prijzen,
              <span className="text-primary"> geen verrassingen</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Kies het plan dat past bij uw bedrijf. Alle plannen inclusief hosting, SSL, en basis ondersteuning. 
              Onze websites zijn geoptimaliseerd volgens de{" "}
              <a 
                href="https://developers.google.com/speed/docs/insights/v5/about" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                data-testid="link-external-pagespeed"
              >
                Google PageSpeed richtlijnen
              </a>.
            </p>
          </div>

          {/* Recommendation Wizard */}
          {sortedPlans && sortedPlans.length > 0 && addOns && addOns.length > 0 && (
            <div className="max-w-xl mx-auto mb-16">
              <RecommendationWizard
                plans={sortedPlans}
                addOns={addOns}
                onCheckout={(planId) => checkoutMutation.mutate(planId)}
                isLoggedIn={!!user}
                isCustomer={user?.role === "CUSTOMER"}
                isCheckoutPending={checkoutMutation.isPending}
              />
            </div>
          )}

          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">Of bekijk alle opties hieronder</p>
          </div>

          {plansLoading ? (
            <PlansSkeleton />
          ) : sortedPlans && sortedPlans.length > 0 ? (
            <div className="max-w-5xl mx-auto">
              <MobileCarouselSection
                mobileChildren={sortedPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    featured={plan.tier === "MEDIUM"}
                    isCustomer={user?.role === "CUSTOMER"}
                    isLoggedIn={!!user}
                    onCheckout={(planId) => checkoutMutation.mutate(planId)}
                    isCheckoutPending={checkoutMutation.isPending}
                    pendingPlanId={pendingPlanId}
                  />
                ))}
              >
                <div className="grid md:grid-cols-3 gap-6">
                  {sortedPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      featured={plan.tier === "MEDIUM"}
                      isCustomer={user?.role === "CUSTOMER"}
                      isLoggedIn={!!user}
                      onCheckout={(planId) => checkoutMutation.mutate(planId)}
                      isCheckoutPending={checkoutMutation.isPending}
                      pendingPlanId={pendingPlanId}
                    />
                  ))}
                </div>
              </MobileCarouselSection>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Plannen worden binnenkort beschikbaar.</p>
            </div>
          )}
        </div>
      </section>

      <section id="addons" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Add-ons</Badge>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Boost uw groei
            </h2>
            <p className="text-lg text-muted-foreground">
              Voeg extra diensten toe om uw online aanwezigheid te versterken. Van advertenties tot SEO.
            </p>
          </div>

          {addOnsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : addOns && addOns.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {addOns.map((addOn) => (
                <AddOnCard key={addOn.id} addOn={addOn} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Add-ons worden binnenkort beschikbaar.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
              Veelgestelde vragen
            </h2>
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="font-medium mb-2">Wat zit er allemaal in mijn abonnement?</h3>
                <p className="text-muted-foreground text-sm">
                  Elk abonnement bevat een professionele website, beheerde hosting met SSL, regelmatige updates en backups, 
                  basis SEO optimalisatie, en ondersteuning via e-mail. Afhankelijk van uw plan krijgt u ook toegang tot 
                  meer templates en maandelijkse credits voor wijzigingen.
                </p>
              </div>
              <div className="border-b pb-6">
                <h3 className="font-medium mb-2">Hoe werkt de budgetsplit voor advertenties?</h3>
                <p className="text-muted-foreground text-sm">
                  Bij onze advertentie add-ons (Google Ads, Meta Ads) splitsen we uw maandbudget automatisch op. 
                  Standaard gaat 85% naar mediakosten (de daadwerkelijke advertenties) en 15% naar beheerskosten. 
                  U ziet deze split altijd transparant voordat u bevestigt.
                </p>
              </div>
              <div className="border-b pb-6">
                <h3 className="font-medium mb-2">Kan ik later upgraden naar een hoger plan?</h3>
                <p className="text-muted-foreground text-sm">
                  Ja, u kunt op elk moment upgraden. Het verschil in kosten wordt pro-rata berekend. 
                  Uw bestaande website en data blijven volledig behouden bij een upgrade.
                </p>
              </div>
              <div className="border-b pb-6">
                <h3 className="font-medium mb-2">Wat als ik wil opzeggen?</h3>
                <p className="text-muted-foreground text-sm">
                  U kunt maandelijks opzeggen. Na opzegging blijft uw website nog 30 dagen actief. 
                  Op verzoek kunnen we uw websitebestanden exporteren zodat u ze elders kunt hosten.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
