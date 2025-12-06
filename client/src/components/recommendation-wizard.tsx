import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Phone,
  ShoppingCart,
  BookOpen,
  Zap,
  Clock,
  TrendingUp,
  Check,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { Plan, AddOn } from "@shared/schema";

type Goal = "leads" | "calls" | "sales" | "inform";
type Speed = "fast" | "relaxed";
type Growth = "yes" | "no";

interface Answers {
  goal?: Goal;
  speed?: Speed;
  growth?: Growth;
}

interface Recommendation {
  plan: Plan;
  addOn?: AddOn;
  reason: string;
}

const goalOptions = [
  { value: "leads" as Goal, label: "Meer aanvragen", icon: Users, description: "Leads genereren via formulieren" },
  { value: "calls" as Goal, label: "Meer bellen", icon: Phone, description: "Klanten laten bellen" },
  { value: "sales" as Goal, label: "Online verkopen", icon: ShoppingCart, description: "Producten of diensten verkopen" },
  { value: "inform" as Goal, label: "Informeren", icon: BookOpen, description: "Bezoekers informeren" },
];

const speedOptions = [
  { value: "fast" as Speed, label: "Zo snel mogelijk", icon: Zap, description: "Binnen 2 weken live" },
  { value: "relaxed" as Speed, label: "Rustig aan", icon: Clock, description: "Neem de tijd voor perfectie" },
];

const growthOptions = [
  { value: "yes" as Growth, label: "Ja, graag!", icon: TrendingUp, description: "Advertenties, SEO, of content" },
  { value: "no" as Growth, label: "Nee, niet nu", icon: Check, description: "Alleen de website" },
];

function getRecommendation(answers: Answers, plans: Plan[], addOns: AddOn[]): Recommendation | null {
  if (!answers.goal || !answers.speed || !answers.growth) return null;

  const starterPlan = plans.find(p => p.tier === "LOW");
  const professionalPlan = plans.find(p => p.tier === "MEDIUM");
  
  if (!starterPlan || !professionalPlan) return null;

  let recommendedPlan: Plan;
  let recommendedAddOn: AddOn | undefined;
  let reason: string;

  switch (answers.goal) {
    case "leads":
      recommendedPlan = professionalPlan;
      if (answers.growth === "yes") {
        recommendedAddOn = addOns.find(a => a.slug === "seo");
      }
      reason = "Voor maximale leadgeneratie adviseren wij Professional met geavanceerde SEO en analytics.";
      break;
    case "calls":
      recommendedPlan = starterPlan;
      if (answers.growth === "yes") {
        recommendedAddOn = addOns.find(a => a.slug === "local-seo");
      }
      reason = "Voor lokale vindbaarheid en meer telefoontjes is Starter met lokale SEO ideaal.";
      break;
    case "sales":
      recommendedPlan = professionalPlan;
      if (answers.growth === "yes") {
        recommendedAddOn = addOns.find(a => a.slug === "google-ads");
      }
      reason = "Voor online verkoop adviseren wij Professional met Google Ads voor direct bereik.";
      break;
    case "inform":
    default:
      recommendedPlan = starterPlan;
      if (answers.growth === "yes") {
        recommendedAddOn = addOns.find(a => a.slug === "content");
      }
      reason = "Voor een informatieve website is Starter perfect. Content creatie houdt uw site actueel.";
      break;
  }

  if (answers.growth === "no") {
    recommendedAddOn = undefined;
  }

  return {
    plan: recommendedPlan,
    addOn: recommendedAddOn,
    reason,
  };
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

interface RecommendationWizardProps {
  plans: Plan[];
  addOns: AddOn[];
  onCheckout: (planId: string) => void;
  isLoggedIn: boolean;
  isCustomer: boolean;
  isCheckoutPending: boolean;
}

export function RecommendationWizard({
  plans,
  addOns,
  onCheckout,
  isLoggedIn,
  isCustomer,
  isCheckoutPending,
}: RecommendationWizardProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (key: keyof Answers, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    
    if (step < 2) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const recommendation = getRecommendation(answers, plans, addOns);

  const handleCheckoutClick = () => {
    if (recommendation) {
      if (isCustomer) {
        onCheckout(recommendation.plan.id);
      } else if (!isLoggedIn) {
        window.location.href = `/signup?plan=${recommendation.plan.id}`;
      }
    }
  };

  const steps = [
    { key: "goal" as const, question: "Wat is uw belangrijkste doel?", options: goalOptions },
    { key: "speed" as const, question: "Hoe snel wilt u live?", options: speedOptions },
    { key: "growth" as const, question: "Wilt u dat wij ook groei regelen?", options: growthOptions },
  ];

  return (
    <Card className="overflow-visible border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-semibold">Vind uw ideale plan in 60 seconden</span>
        </div>

        <div className="flex gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < step || showResult
                  ? "bg-primary"
                  : i === step && !showResult
                  ? "bg-primary/50"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-medium mb-4" data-testid={`text-wizard-question-${step}`}>
                {steps[step].question}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {steps[step].options.map((option) => {
                  const Icon = option.icon;
                  const isSelected = answers[steps[step].key] === option.value;
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "default" : "outline"}
                      className={`h-auto py-4 px-4 justify-start gap-3 ${
                        isSelected ? "" : "hover-elevate"
                      }`}
                      onClick={() => handleAnswer(steps[step].key, option.value)}
                      data-testid={`button-wizard-${steps[step].key}-${option.value}`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs opacity-70">{option.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {recommendation && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg" data-testid="text-wizard-recommendation-title">
                        Onze aanbeveling voor u
                      </h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-wizard-recommendation-reason">
                        {recommendation.reason}
                      </p>
                    </div>
                  </div>

                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge variant="default" className="text-sm" data-testid="badge-wizard-plan">
                        {recommendation.plan.name}
                      </Badge>
                      {recommendation.addOn && (
                        <Badge variant="outline" className="text-sm" data-testid="badge-wizard-addon">
                          + {recommendation.addOn.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-2xl font-semibold" data-testid="text-wizard-price">
                        {formatPrice(recommendation.plan.monthlyPriceCents)}
                      </span>
                      <span className="text-muted-foreground">/maand</span>
                      {recommendation.addOn && (recommendation.addOn.baseFeeCents ?? 0) > 0 && (
                        <span className="text-sm text-muted-foreground">
                          + {formatPrice(recommendation.addOn.baseFeeCents ?? 0)} voor {recommendation.addOn.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      className="flex-1 gap-2"
                      onClick={handleCheckoutClick}
                      disabled={isCheckoutPending || (isLoggedIn && !isCustomer)}
                      data-testid="button-wizard-checkout"
                    >
                      {isCheckoutPending ? (
                        "Laden..."
                      ) : isLoggedIn && !isCustomer ? (
                        "Alleen voor klanten"
                      ) : (
                        <>
                          {isCustomer ? "Direct afrekenen" : "Aanmelden met dit plan"}
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={reset}
                      className="gap-2"
                      data-testid="button-wizard-reset"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Opnieuw
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
