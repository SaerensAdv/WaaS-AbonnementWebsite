import { useState, useMemo } from "react";
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
import { useTranslation } from "@/lib/i18n-context";
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
  t,
}: { 
  plan: Plan; 
  featured?: boolean;
  isCustomer: boolean;
  isLoggedIn: boolean;
  onCheckout: (planId: string) => void;
  isCheckoutPending: boolean;
  pendingPlanId: string | null;
  t: (key: string, params?: Record<string, string | number>) => string;
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
    if (plan.tier === "HIGH") return t("common.buttons.contactUs");
    if (isLoggedIn && !isCustomer) return t("common.buttons.customersOnly");
    if (isCustomer) return t("common.buttons.directStart");
    return t("common.buttons.selectPlan");
  };

  return (
    <Card className={`relative flex flex-col ${featured ? "border-2 border-primary" : "border"}`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge>{t("pricing.planLabels.popular")}</Badge>
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
            <div className="text-3xl font-semibold">{t("pricing.planLabels.custom")}</div>
          ) : (
            <div className="text-3xl font-semibold">
              {formatPrice(plan.monthlyPriceCents)}
              <span className="text-base font-normal text-muted-foreground">{t("pricing.planLabels.perMonth")}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground border-b pb-3 mb-3">
            {plan.tier === "LOW" && t("pricing.planFeatures.templateChoice", { count: plan.includedTemplatesMax })}
            {plan.tier === "MEDIUM" && t("pricing.planFeatures.templateChoice", { count: plan.includedTemplatesMax })}
            {plan.tier === "HIGH" && t("pricing.planFeatures.customDesign")}
          </div>
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
          <div className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>{t("pricing.planFeatures.pagesIncluded", { count: plan.includedPages })}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>{t("pricing.planFeatures.creditsPerMonth", { count: plan.includedCredits })}</span>
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

function AddOnCard({ addOn, t }: { addOn: AddOn; t: (key: string, params?: Record<string, string | number>) => string }) {
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
                    <Badge variant="secondary" className="text-xs">{t("pricing.addons.budgetLabel")}</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("pricing.addons.budgetTooltip")}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{addOn.description}</p>
            {addOn.baseFeeCents && addOn.baseFeeCents > 0 && (
              <div className="text-sm">
                <span className="font-medium">{t("pricing.addons.fromPrice")} {formatPrice(addOn.baseFeeCents)}</span>
                <span className="text-muted-foreground">{t("pricing.planLabels.perMonth")}</span>
              </div>
            )}
            {addOn.requiresBudget && (
              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Info className="h-3 w-3" />
                {t("pricing.addons.mediaSplit")} {addOn.mediaPercentageDefault}% / {100 - (addOn.mediaPercentageDefault || 85)}%
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
  const { t } = useTranslation();

  const serviceStructuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Website Abonnement",
    "serviceType": "Website Subscription Service",
    "description": t("pricing.seo.description"),
    "provider": {
      "@type": "Organization",
      "name": "Abonnement.Website",
      "url": "https://abonnement.website"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "Belgium"
      },
      {
        "@type": "Country",
        "name": "Netherlands"
      }
    ],
    "offers": [
      {
        "@type": "Offer",
        "name": t("pricing.planLabels.low"),
        "price": "99",
        "priceCurrency": "EUR",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "99",
          "priceCurrency": "EUR",
          "unitText": "MONTH",
          "referenceQuantity": {
            "@type": "QuantitativeValue",
            "value": "1",
            "unitCode": "MON"
          }
        }
      },
      {
        "@type": "Offer",
        "name": t("pricing.planLabels.medium"),
        "price": "199",
        "priceCurrency": "EUR",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "199",
          "priceCurrency": "EUR",
          "unitText": "MONTH",
          "referenceQuantity": {
            "@type": "QuantitativeValue",
            "value": "1",
            "unitCode": "MON"
          }
        }
      }
    ]
  }), [t]);

  const faqStructuredData = {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t("pricing.faq.questions.0.question"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("pricing.faq.questions.0.answer")
        }
      },
      {
        "@type": "Question",
        "name": t("pricing.faq.questions.1.question"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("pricing.faq.questions.1.answer")
        }
      },
      {
        "@type": "Question",
        "name": t("pricing.faq.questions.2.question"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("pricing.faq.questions.2.answer")
        }
      },
      {
        "@type": "Question",
        "name": t("pricing.faq.questions.3.question"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("pricing.faq.questions.3.answer")
        }
      }
    ]
  };

  const combinedStructuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      faqStructuredData,
      serviceStructuredData
    ]
  }), [serviceStructuredData, t]);

  useSEO({
    title: t("pricing.seo.title"),
    description: t("pricing.seo.description"),
    canonical: "/pricing",
    structuredData: combinedStructuredData,
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
          title: t("pricing.errors.checkoutFailed"),
          description: t("pricing.errors.checkoutFailed"),
          variant: "destructive",
        });
      }
      setPendingPlanId(null);
    },
    onError: (error: any) => {
      toast({
        title: t("pricing.errors.checkoutFailed"),
        description: error.message || t("pricing.errors.checkoutFailed"),
        variant: "destructive",
      });
      setPendingPlanId(null);
    },
  });

  const sortedPlans = plans?.sort((a, b) => {
    const order: Record<string, number> = { LOW: 0, MEDIUM: 1, HIGH: 2 };
    return (order[a.tier as string] || 0) - (order[b.tier as string] || 0);
  });

  return (
    <MarketingLayout>
      <section className="pt-[104px] pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <BreadcrumbNav 
            items={[{ label: t("common.nav.pricing") }]} 
            className="mb-8"
          />
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">{t("pricing.hero.badge")}</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4" data-testid="text-pricing-title">
              {t("pricing.hero.title")}
              <span className="text-primary"> {t("pricing.hero.titleHighlight")}</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("pricing.hero.description")}{" "}
              <a 
                href="https://developers.google.com/speed/docs/insights/v5/about" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                data-testid="link-external-pagespeed"
              >
                {t("pricing.hero.pageSpeedLink")}
              </a>
            </p>
          </div>

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
            <p className="text-sm text-muted-foreground">{t("pricing.viewAllOptions")}</p>
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
                    t={t}
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
                      t={t}
                    />
                  ))}
                </div>
              </MobileCarouselSection>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("pricing.plansComingSoon")}</p>
            </div>
          )}
        </div>
      </section>

      <section id="addons" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">{t("pricing.addons.badge")}</Badge>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              {t("pricing.addons.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("pricing.addons.description")}
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
                <AddOnCard key={addOn.id} addOn={addOn} t={t} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("pricing.addons.comingSoon")}</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">
              {t("pricing.faq.title")}
            </h2>
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="font-medium mb-2">{t("pricing.faq.questions.0.question")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("pricing.faq.questions.0.answer")}
                </p>
              </div>
              <div className="border-b pb-6">
                <h3 className="font-medium mb-2">{t("pricing.faq.questions.1.question")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("pricing.faq.questions.1.answer")}
                </p>
              </div>
              <div className="border-b pb-6">
                <h3 className="font-medium mb-2">{t("pricing.faq.questions.2.question")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("pricing.faq.questions.2.answer")}
                </p>
              </div>
              <div className="border-b pb-6">
                <h3 className="font-medium mb-2">{t("pricing.faq.questions.3.question")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("pricing.faq.questions.3.answer")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
