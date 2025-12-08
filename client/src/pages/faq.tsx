import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { AnimatedDotGrid } from "@/components/animated-dot-grid";
import { useTranslation } from "@/lib/i18n-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FadeInUp,
  FadeIn,
  StaggerChildren,
  StaggerItem,
  GlowPulse,
  BlurIn,
} from "@/components/ui/motion";
import {
  ArrowRight,
  HelpCircle,
  Euro,
  Settings,
  Wrench,
  ChevronRight,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { useEffect, useMemo } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: typeof HelpCircle;
  questions: FAQItem[];
}

function generateFAQSchema(categories: FAQCategory[]) {
  const allQuestions = categories.flatMap(cat => cat.questions);
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allQuestions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };
}

export default function FAQPage() {
  const { t } = useTranslation();

  const faqCategories: FAQCategory[] = useMemo(() => [
    {
      id: "algemeen",
      title: t("faq.categories.algemeen.title"),
      icon: HelpCircle,
      questions: [
        {
          question: t("faq.categories.algemeen.questions.0.question"),
          answer: t("faq.categories.algemeen.questions.0.answer"),
        },
        {
          question: t("faq.categories.algemeen.questions.1.question"),
          answer: t("faq.categories.algemeen.questions.1.answer"),
        },
        {
          question: t("faq.categories.algemeen.questions.2.question"),
          answer: t("faq.categories.algemeen.questions.2.answer"),
        },
        {
          question: t("faq.categories.algemeen.questions.3.question"),
          answer: t("faq.categories.algemeen.questions.3.answer"),
        },
        {
          question: t("faq.categories.algemeen.questions.4.question"),
          answer: t("faq.categories.algemeen.questions.4.answer"),
        },
      ],
    },
    {
      id: "prijzen",
      title: t("faq.categories.prijzen.title"),
      icon: Euro,
      questions: [
        {
          question: t("faq.categories.prijzen.questions.0.question"),
          answer: t("faq.categories.prijzen.questions.0.answer"),
        },
        {
          question: t("faq.categories.prijzen.questions.1.question"),
          answer: t("faq.categories.prijzen.questions.1.answer"),
        },
        {
          question: t("faq.categories.prijzen.questions.2.question"),
          answer: t("faq.categories.prijzen.questions.2.answer"),
        },
        {
          question: t("faq.categories.prijzen.questions.3.question"),
          answer: t("faq.categories.prijzen.questions.3.answer"),
        },
        {
          question: t("faq.categories.prijzen.questions.4.question"),
          answer: t("faq.categories.prijzen.questions.4.answer"),
        },
      ],
    },
    {
      id: "technisch",
      title: t("faq.categories.technisch.title"),
      icon: Settings,
      questions: [
        {
          question: t("faq.categories.technisch.questions.0.question"),
          answer: t("faq.categories.technisch.questions.0.answer"),
        },
        {
          question: t("faq.categories.technisch.questions.1.question"),
          answer: t("faq.categories.technisch.questions.1.answer"),
        },
        {
          question: t("faq.categories.technisch.questions.2.question"),
          answer: t("faq.categories.technisch.questions.2.answer"),
        },
        {
          question: t("faq.categories.technisch.questions.3.question"),
          answer: t("faq.categories.technisch.questions.3.answer"),
        },
        {
          question: t("faq.categories.technisch.questions.4.question"),
          answer: t("faq.categories.technisch.questions.4.answer"),
        },
      ],
    },
    {
      id: "onderhoud",
      title: t("faq.categories.onderhoud.title"),
      icon: Wrench,
      questions: [
        {
          question: t("faq.categories.onderhoud.questions.0.question"),
          answer: t("faq.categories.onderhoud.questions.0.answer"),
        },
        {
          question: t("faq.categories.onderhoud.questions.1.question"),
          answer: t("faq.categories.onderhoud.questions.1.answer"),
        },
        {
          question: t("faq.categories.onderhoud.questions.2.question"),
          answer: t("faq.categories.onderhoud.questions.2.answer"),
        },
        {
          question: t("faq.categories.onderhoud.questions.3.question"),
          answer: t("faq.categories.onderhoud.questions.3.answer"),
        },
        {
          question: t("faq.categories.onderhoud.questions.4.question"),
          answer: t("faq.categories.onderhoud.questions.4.answer"),
        },
      ],
    },
  ], [t]);

  const faqSchema = useMemo(() => generateFAQSchema(faqCategories), [faqCategories]);
  
  useSEO({
    title: t("faq.seo.title"),
    description: t("faq.seo.description"),
    canonical: "/faq",
  });

  useEffect(() => {
    const existingSchema = document.querySelector('script[data-schema="faq"]');
    if (existingSchema) {
      existingSchema.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'faq');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);
    
    return () => {
      const schemaScript = document.querySelector('script[data-schema="faq"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [faqSchema]);

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[50vh] flex flex-col overflow-hidden pt-[72px]"
        data-testid="section-faq-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />
        
        <AnimatedDotGrid 
          className="opacity-80"
          dotSize={1}
          gap={35}
          baseOpacity={0.06}
          accentColor="59, 130, 246"
        />
        
        <GlowPulse className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
        
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10 pt-8">
          <BreadcrumbNav 
            items={[{ label: t("common.nav.faq") }]} 
            className="[&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/70"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8">
                <HelpCircle className="h-4 w-4 text-primary" />
                {t("faq.hero.badge")}
                <ChevronRight className="h-4 w-4" />
              </div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-6" 
                data-testid="text-faq-hero-title"
              >
                {t("faq.hero.title")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">{t("faq.hero.titleHighlight")}</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {t("faq.hero.description")}
              </p>
            </BlurIn>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" data-testid="section-faq-content">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <StaggerChildren staggerDelay={0.1}>
              {faqCategories.map((category) => (
                <StaggerItem key={category.id}>
                  <div className="mb-12" data-testid={`faq-category-${category.id}`}>
                    <FadeInUp>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <category.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-2xl font-semibold">{category.title}</h2>
                      </div>
                    </FadeInUp>
                    
                    <Card>
                      <CardContent className="p-0">
                        <Accordion type="single" collapsible className="w-full">
                          {category.questions.map((item, index) => (
                            <AccordionItem 
                              key={index} 
                              value={`${category.id}-${index}`}
                              className="px-6"
                            >
                              <AccordionTrigger 
                                className="text-left hover:no-underline"
                                data-testid={`faq-question-${category.id}-${index}`}
                              >
                                <span className="pr-4">{item.question}</span>
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground leading-relaxed">
                                {item.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/50" data-testid="section-faq-comparison">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6 no-default-hover-elevate no-default-active-elevate">
                {t("faq.comparison.badge")}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t("faq.comparison.title")}
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                {t("faq.comparison.description")}
              </p>
              
              <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <Link href="/vergelijk/wordpress">
                  <Card className="hover-elevate cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-lg font-medium mb-2">{t("faq.comparison.vsWordpress")}</div>
                      <p className="text-sm text-muted-foreground">{t("faq.comparison.vsWordpressDesc")}</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/vergelijk/wix">
                  <Card className="hover-elevate cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-lg font-medium mb-2">{t("faq.comparison.vsWix")}</div>
                      <p className="text-sm text-muted-foreground">{t("faq.comparison.vsWixDesc")}</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/vergelijk/eenmalig">
                  <Card className="hover-elevate cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-lg font-medium mb-2">{t("faq.comparison.vsOneTime")}</div>
                      <p className="text-sm text-muted-foreground">{t("faq.comparison.vsOneTimeDesc")}</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-900" data-testid="section-faq-cta">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="max-w-3xl mx-auto text-center">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-8">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                {t("faq.cta.title")}
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                {t("faq.cta.description")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-faq-contact">
                    {t("common.buttons.askQuestion")}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="h-14 px-8 text-lg border-white/20 text-white bg-white/5 backdrop-blur-sm"
                    data-testid="button-faq-pricing"
                  >
                    {t("common.buttons.viewPlans")}
                  </Button>
                </Link>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>
    </MarketingLayout>
  );
}
