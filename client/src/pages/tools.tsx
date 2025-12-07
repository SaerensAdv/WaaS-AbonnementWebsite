import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { useSEO } from "@/hooks/use-seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { AnimatedDotGrid } from "@/components/animated-dot-grid";
import {
  FadeInUp,
  StaggerChildren,
  StaggerItem,
  GlowPulse,
  BlurIn,
  motion,
} from "@/components/ui/motion";
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  Search,
  BarChart3,
  Shield,
  ExternalLink,
  BookOpen,
} from "lucide-react";

interface Tool {
  name: string;
  description: string;
  url?: string;
}

interface ToolCategory {
  icon: typeof Search;
  title: string;
  description: string;
  tools: Tool[];
}

const toolCategories: ToolCategory[] = [
  {
    icon: Search,
    title: "SEO & Zoekmachines",
    description: "Professionele tools voor optimale vindbaarheid in zoekmachines",
    tools: [
      {
        name: "Google Search Console",
        description: "Inzicht in hoe Google uw website ziet en indexeert",
        url: "https://search.google.com/search-console",
      },
      {
        name: "Bing Webmaster Tools",
        description: "Optimalisatie voor Microsoft's zoekmachine",
        url: "https://www.bing.com/webmasters",
      },
      {
        name: "SEMrush",
        description: "Professionele keyword research en concurrentieanalyse",
        url: "https://www.semrush.com",
      },
      {
        name: "Wincher",
        description: "Dagelijkse ranking monitoring voor uw zoekwoorden",
        url: "https://www.wincher.com",
      },
      {
        name: "Schema.org",
        description: "Gestructureerde data voor rijke zoekresultaten",
        url: "https://schema.org",
      },
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics & Inzichten",
    description: "Data-gedreven beslissingen voor uw website abonnement",
    tools: [
      {
        name: "Google Analytics 4",
        description: "Uitgebreide website statistieken en gebruikersgedrag",
        url: "https://analytics.google.com",
      },
      {
        name: "Microsoft Clarity",
        description: "Heatmaps en sessie-opnames voor UX-inzichten",
        url: "https://clarity.microsoft.com",
      },
      {
        name: "Google Tag Manager",
        description: "Centrale beheer van tracking en conversies",
        url: "https://tagmanager.google.com",
      },
    ],
  },
  {
    icon: Shield,
    title: "Privacy & Compliance",
    description: "AVG-conforme oplossingen voor uw bezoekers",
    tools: [
      {
        name: "ConsentEase",
        description: "AVG-conforme cookie consent voor uw bezoekers",
        url: "https://consentease.io",
      },
    ],
  },
];

export default function ToolsPage() {
  useSEO({
    title: "Onze Tools - Website Abonnement | Professionele SEO & Analytics",
    description: "Ontdek de professionele tools die wij gebruiken voor SEO, analytics en privacy. Van Google Search Console tot SEMrush - alles voor betere prestaties.",
    canonical: "/tools",
  });

  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[60vh] flex flex-col overflow-hidden pt-[72px]"
        data-testid="section-tools-hero"
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
            items={[{ label: "Tools" }]} 
            className="[&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/70"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <BlurIn delay={0}>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Professionele tools voor uw website abonnement
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-8" 
                data-testid="text-tools-hero-title"
              >
                Onze professionele
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">SEO & Analytics tools</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
                Met uw website abonnement krijgt u toegang tot dezelfde professionele tools die de beste bureaus gebruiken. Wij zorgen voor de techniek, u plukt de vruchten.
              </p>
            </BlurIn>
            
            <FadeInUp delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-tools-pricing">
                      Bekijk abonnementen
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/blog">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="h-14 px-8 text-lg border-white/20 text-white bg-white/5 backdrop-blur-sm"
                      data-testid="button-tools-blog"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Lees onze artikelen
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {toolCategories.map((category, categoryIndex) => (
        <section 
          key={category.title}
          className={`py-24 md:py-32 ${categoryIndex % 2 === 1 ? 'bg-slate-50 dark:bg-slate-900/50' : ''}`}
          data-testid={`section-tools-${category.title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <div className="container mx-auto px-4">
            <FadeInUp>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <motion.div 
                  className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <category.icon className="h-8 w-8 text-primary" />
                </motion.div>
                <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                  {category.title}
                </Badge>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  {category.title}
                </h2>
                <p className="text-xl text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </FadeInUp>

            <StaggerChildren 
              className={`grid gap-6 max-w-5xl mx-auto ${
                category.tools.length === 1 
                  ? 'sm:grid-cols-1 max-w-md' 
                  : category.tools.length === 3 
                    ? 'sm:grid-cols-2 lg:grid-cols-3' 
                    : 'sm:grid-cols-2 lg:grid-cols-3'
              }`} 
              staggerDelay={0.1}
            >
              {category.tools.map((tool, toolIndex) => (
                <StaggerItem key={tool.name}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card 
                      className="border bg-card h-full"
                      data-testid={`card-tool-${categoryIndex}-${toolIndex}`}
                    >
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{tool.description}</p>
                        {tool.url && (
                          <a 
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                            data-testid={`link-tool-${categoryIndex}-${toolIndex}`}
                          >
                            Meer informatie
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      ))}

      <section className="py-24 md:py-32" data-testid="section-tools-cta">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6 no-default-hover-elevate no-default-active-elevate">
                Start vandaag
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Professionele tools,
                <br />
                <span className="text-primary">zonder technische kennis</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Met een website abonnement bij ons krijgt u toegang tot al deze professionele tools. 
                Wij configureren alles voor u en zorgen dat uw website optimaal presteert.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-tools-cta-pricing">
                      Bekijk onze abonnementen
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/blog">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="h-14 px-8 text-lg"
                      data-testid="button-tools-cta-blog"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Lees gerelateerde artikelen
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>
    </MarketingLayout>
  );
}
