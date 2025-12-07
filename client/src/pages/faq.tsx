import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { AnimatedDotGrid } from "@/components/animated-dot-grid";
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
import { useEffect } from "react";

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

const faqCategories: FAQCategory[] = [
  {
    id: "algemeen",
    title: "Algemeen",
    icon: HelpCircle,
    questions: [
      {
        question: "Wat is een website abonnement?",
        answer: "Een website abonnement is een all-in-one oplossing waarbij u een professionele website krijgt voor een vast maandelijks bedrag. Dit omvat het ontwerp, de bouw, hosting, onderhoud, beveiliging en support. U betaalt geen grote eenmalige factuur, maar een voorspelbaar maandbedrag vanaf €99."
      },
      {
        question: "Hoe werkt een website abonnement precies?",
        answer: "U kiest een abonnement dat past bij uw bedrijf (Starter vanaf €99/maand, Professional vanaf €199/maand, of Enterprise op maat). Na aanmelding bespreken we uw wensen, bouwen wij uw website, en na goedkeuring gaat deze live. Daarna zorgen wij maandelijks voor updates, beveiliging, hosting en kleine aanpassingen."
      },
      {
        question: "Voor wie is een website abonnement geschikt?",
        answer: "Een website abonnement is ideaal voor MKB-bedrijven, zelfstandigen en starters die een professionele online aanwezigheid willen zonder technische kennis of grote investeringen. Het is perfect voor ondernemers die zich willen focussen op hun bedrijf, niet op website-onderhoud."
      },
      {
        question: "Hoe snel is mijn website online?",
        answer: "De meeste websites zijn binnen 10 werkdagen live. Na het intakegesprek ontvangt u binnen 5 dagen een eerste ontwerp. Na uw feedback maken we de laatste aanpassingen en gaat uw website online."
      },
      {
        question: "Kan ik mijn website later uitbreiden?",
        answer: "Ja, u kunt op elk moment upgraden naar een hoger abonnement of add-ons toevoegen zoals Google Ads beheer, SEO-optimalisatie, of contentcreatie. Downgraden kan ook, dit gaat in op de volgende factuurdatum."
      },
    ],
  },
  {
    id: "prijzen",
    title: "Prijzen & Kosten",
    icon: Euro,
    questions: [
      {
        question: "Wat kost een website abonnement per maand?",
        answer: "Onze abonnementen starten vanaf €99/maand (Starter) voor een professionele website met 5 pagina's. Het Professional abonnement kost €199/maand en biedt tot 15 pagina's plus geavanceerde functies. Voor grotere projecten bieden we Enterprise abonnementen op maat."
      },
      {
        question: "Zijn er opstartkosten of eenmalige kosten?",
        answer: "Nee, er zijn geen opstartkosten. De prijs die u ziet is de prijs die u betaalt. Alles is inbegrepen: ontwerp, bouw, hosting, SSL-certificaat, en een .nl of .be domeinnaam voor het eerste jaar."
      },
      {
        question: "Wat is goedkoper: een website abonnement of een eenmalige website?",
        answer: "Over 3 jaar bekeken is een website abonnement vaak voordeliger. Een eenmalige website kost €3.000-€10.000 plus jaarlijks €500-€1.500 voor hosting en onderhoud. Ons Starter abonnement kost €99 × 36 = €3.564 voor 3 jaar, inclusief alles. Bovendien heeft u geen onverwachte kosten bij updates of problemen."
      },
      {
        question: "Wat is inbegrepen in de maandelijkse prijs?",
        answer: "Elk abonnement bevat: professioneel webdesign, hosting op snelle servers, SSL-beveiliging, maandelijks onderhoud en updates, technische support, back-ups, en kleine tekstaanpassingen. Bij hogere abonnementen komen daar extra pagina's, contactformulieren, en geavanceerde functies bij."
      },
      {
        question: "Hoe vergelijkt dit met Wix of WordPress?",
        answer: "Wix kost €17-€35/maand maar u doet alles zelf (ontwerp, onderhoud, beveiliging). WordPress hosting + onderhoud kost €70-€180/maand bij een bureau, zonder het ontwerp. Ons abonnement is een complete oplossing: wij doen alles voor u, inclusief professioneel maatwerk design."
      },
    ],
  },
  {
    id: "technisch",
    title: "Technisch",
    icon: Settings,
    questions: [
      {
        question: "Op welk platform wordt mijn website gebouwd?",
        answer: "Wij bouwen websites met moderne technologieën die snel, veilig en SEO-vriendelijk zijn. U hoeft zich geen zorgen te maken over technische details - wij kiezen de beste oplossing voor uw situatie."
      },
      {
        question: "Krijg ik een eigen domeinnaam?",
        answer: "Ja, uw eerste jaar domeinnaam (.nl, .be, of .com) is inbegrepen. Heeft u al een domeinnaam? Dan helpen we gratis met de verhuizing naar uw nieuwe website."
      },
      {
        question: "Hoe zit het met SEO (vindbaarheid in Google)?",
        answer: "Elke website wordt gebouwd met basis-SEO: snelle laadtijden, mobielvriendelijk design, juiste meta-tags, en een sitemap voor Google. Voor actieve SEO-optimalisatie (zoekwoordenonderzoek, contentoptimalisatie, linkbuilding) kunt u onze SEO add-on toevoegen."
      },
      {
        question: "Is mijn website mobielvriendelijk?",
        answer: "Absoluut. Alle websites zijn 100% responsive en werken perfect op smartphones, tablets en desktops. Dit is essentieel voor Google-ranking en gebruikerservaring."
      },
      {
        question: "Hoe veilig is mijn website?",
        answer: "Zeer veilig. Elke website heeft een SSL-certificaat (het groene slotje), regelmatige beveiligingsupdates, dagelijkse back-ups, en wordt gehost op beveiligde servers. Bij problemen herstellen wij uw website snel."
      },
    ],
  },
  {
    id: "onderhoud",
    title: "Onderhoud & Support",
    icon: Wrench,
    questions: [
      {
        question: "Wat houdt het maandelijkse onderhoud in?",
        answer: "Wij zorgen voor: software-updates en beveiligingspatches, prestatie-optimalisatie, dagelijkse back-ups, monitoring op downtime, en het oplossen van technische problemen. U hoeft nergens aan te denken."
      },
      {
        question: "Kan ik zelf aanpassingen doen aan mijn website?",
        answer: "Kleine tekstaanpassingen kunt u via ons doorgeven en worden snel uitgevoerd. Voor grotere wijzigingen bespreken we de beste aanpak. Zo blijft uw website professioneel en consistent."
      },
      {
        question: "Hoe snel krijg ik support bij problemen?",
        answer: "Bij urgente problemen (website offline) reageren we binnen 2 uur tijdens kantooruren. Voor reguliere vragen ontvangt u binnen 24 uur een reactie. Enterprise klanten hebben toegang tot prioriteitssupport."
      },
      {
        question: "Wat gebeurt er als ik wil opzeggen?",
        answer: "U kunt maandelijks opzeggen met een opzegtermijn van 1 maand. Bij opzegging ontvangt u een export van uw content (teksten en afbeeldingen). De website-code blijft ons eigendom, maar u kunt altijd een nieuwe website laten bouwen met uw content."
      },
      {
        question: "Krijg ik rapportages over mijn website?",
        answer: "Ja, u ontvangt maandelijks een overzicht met bezoekersstatistieken, technische status, en uitgevoerde werkzaamheden. Zo weet u precies hoe uw website presteert."
      },
    ],
  },
];

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
  const faqSchema = generateFAQSchema(faqCategories);
  
  useSEO({
    title: "Veelgestelde Vragen over Website Abonnementen - FAQ",
    description: "Antwoorden op veelgestelde vragen over website abonnementen. Wat kost het? Hoe werkt het? Wat is inbegrepen? Ontdek alles over onze website abonnement service.",
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
  }, []);

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
            items={[{ label: "Veelgestelde Vragen" }]} 
            className="[&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/70"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8">
                <HelpCircle className="h-4 w-4 text-primary" />
                Alle antwoorden op één plek
                <ChevronRight className="h-4 w-4" />
              </div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-6" 
                data-testid="text-faq-hero-title"
              >
                Veelgestelde
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">Vragen</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Alles wat u wilt weten over website abonnementen, prijzen, 
                techniek en onderhoud.
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
                Meer weten?
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Vergelijk uw opties
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Bekijk hoe een website abonnement zich verhoudt tot andere oplossingen.
              </p>
              
              <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <Link href="/vergelijk/wordpress">
                  <Card className="hover-elevate cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-lg font-medium mb-2">vs WordPress</div>
                      <p className="text-sm text-muted-foreground">Vergelijk kosten en gemak</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/vergelijk/wix">
                  <Card className="hover-elevate cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-lg font-medium mb-2">vs Wix</div>
                      <p className="text-sm text-muted-foreground">Zelf doen vs laten doen</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/vergelijk/eenmalig">
                  <Card className="hover-elevate cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-lg font-medium mb-2">vs Eenmalige website</div>
                      <p className="text-sm text-muted-foreground">Welke is voordeliger?</p>
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
                Nog vragen?
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                Staat uw vraag er niet tussen? Neem gerust contact op. 
                Wij helpen u graag verder.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-faq-contact">
                    Stel uw vraag
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
                    Bekijk abonnementen
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
