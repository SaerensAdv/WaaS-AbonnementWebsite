import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { DashboardMockup, TrustLogos, PaymentMethods } from "@/components/dashboard-mockup";
import { BudgetCalculator } from "@/components/budget-calculator";
import {
  Globe,
  Zap,
  Shield,
  BarChart3,
  Users,
  Headphones,
  ArrowRight,
  Check,
  Star,
  MousePointer,
  Palette,
  TrendingUp,
  Clock,
  Activity,
  Sparkles,
  Play,
  ChevronRight,
  Layers,
  Target,
  LineChart,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Professionele Websites",
    description: "Kies uit hoogwaardige templates of laat een website op maat maken voor uw bedrijf.",
  },
  {
    icon: Zap,
    title: "Snelle Levering",
    description: "Uw website is binnen enkele dagen live dankzij ons gestroomlijnde proces.",
  },
  {
    icon: Shield,
    title: "Beheerde Hosting",
    description: "SSL, updates, backups en beveiliging worden volledig door ons beheerd.",
  },
  {
    icon: BarChart3,
    title: "Growth Add-ons",
    description: "Voeg Google Ads, Meta Ads, SEO en content toe voor maximale groei.",
  },
  {
    icon: Users,
    title: "Expert Specialisten",
    description: "Gecertificeerde specialisten beheren uw advertenties met bewezen resultaten.",
  },
  {
    icon: Headphones,
    title: "Premium Support",
    description: "Persoonlijke ondersteuning en maandelijkse rapportages over uw resultaten.",
  },
];

const stats = [
  { value: "500+", label: "Tevreden klanten", description: "Bedrijven vertrouwen ons" },
  { value: "99.9%", label: "Uptime garantie", description: "Altijd online" },
  { value: "2.4M", label: "Bezoekers/maand", description: "Totaal bereik" },
  { value: "127%", label: "Gem. groei", description: "ROI verhoging" },
];

const howItWorks = [
  {
    step: "01",
    icon: MousePointer,
    title: "Kies uw plan",
    description: "Selecteer het abonnement dat het beste past bij uw behoeften en budget.",
  },
  {
    step: "02",
    icon: Palette,
    title: "Wij bouwen uw website",
    description: "Ons team ontwerpt en bouwt uw professionele website binnen enkele dagen.",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Groei met add-ons",
    description: "Breid uit met Google Ads, SEO, content en meer naarmate u groeit.",
  },
];

const testimonials = [
  {
    name: "Jan de Vries",
    initials: "JV",
    company: "De Vries Bouw",
    role: "Directeur",
    text: "Eindelijk een website waar ik me geen zorgen over hoef te maken. Het team zorgt voor alles en de resultaten zijn uitstekend!",
    rating: 5,
  },
  {
    name: "Sarah Jansen",
    initials: "SJ",
    company: "Jansen Consulting",
    role: "CEO",
    text: "De combinatie van een mooie website plus Google Ads beheer heeft ons bedrijf een enorme boost gegeven.",
    rating: 5,
  },
  {
    name: "Mohammed El-Amin",
    initials: "ME",
    company: "El-Amin Logistics",
    role: "Eigenaar",
    text: "Transparante prijzen, professionele service, en uitstekende resultaten. Na jaren zoeken eindelijk de juiste partner.",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[100vh] flex items-center overflow-hidden"
        data-testid="section-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
        
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10 pt-32 pb-20">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              Nu met gratis proefperiode van 14 dagen
              <ChevronRight className="h-4 w-4" />
            </div>
            
            <h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] text-white mb-8" 
              data-testid="text-hero-title"
            >
              Professionele websites
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">zonder zorgen</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
              Alles-in-een website abonnementen met beheerde hosting, SEO, 
              en advertentie-beheer. Kies uw plan en laat ons de rest regelen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg" className="gap-2 text-lg h-14 px-8" data-testid="button-view-plans">
                  Bekijk plannen
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-14 px-8 text-lg border-white/20 text-white bg-white/5 backdrop-blur-sm"
                  data-testid="button-start-trial"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Bekijk demo
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-blue-500/20 to-primary/20 blur-3xl rounded-3xl opacity-50" />
            <DashboardMockup variant="dashboard" className="relative" />
            
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Gem. groei klanten</div>
                  <div className="text-2xl font-bold font-mono">+127%</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Websites live</div>
                  <div className="text-2xl font-bold font-mono">2,847</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-b" data-testid="section-trust">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Vertrouwd door 500+ Nederlandse bedrijven
          </p>
          <TrustLogos />
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-stats">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center"
                data-testid={`stat-${index}`}
              >
                <div className="text-5xl sm:text-6xl lg:text-7xl font-bold font-mono tabular-nums bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-900" data-testid="section-product">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-6 no-default-hover-elevate no-default-active-elevate">
                Website Builder
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Bouw uw perfecte website
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Onze intuïtieve website builder maakt het eenvoudig om een professionele 
                website te creëren. Kies uit tientallen templates en pas alles aan naar wens.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Drag-and-drop editor",
                  "50+ professionele templates",
                  "Mobiel-geoptimaliseerd design",
                  "Geïntegreerde SEO tools",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-slate-200">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
              
              <Link href="/pricing">
                <Button size="lg" className="gap-2">
                  Start met bouwen
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-500/20 blur-3xl rounded-3xl opacity-50" />
              <DashboardMockup variant="builder" className="relative" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
              Hoe het werkt
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              In 3 stappen online
            </h2>
            <p className="text-xl text-muted-foreground">
              Van aanmelding tot live website in minder dan een week
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((item, index) => (
              <div 
                key={item.step}
                className="relative"
                data-testid={`step-${index}`}
              >
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="text-7xl font-bold text-primary/10 mb-4 font-mono">
                    {item.step}
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-950" data-testid="section-calculator">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
              Budget Calculator
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Bereken uw advertentie potentieel
            </h2>
            <p className="text-xl text-slate-300">
              Verdeel uw budget over Google Ads, Meta en SEO en zie direct de geschatte resultaten
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <BudgetCalculator />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-features">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="lg:sticky lg:top-32">
              <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
                Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Alles wat u nodig heeft
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Van website tot advertenties, wij bieden een complete oplossing 
                voor uw online aanwezigheid.
              </p>
              <Link href="/pricing">
                <Button size="lg" className="gap-2">
                  Bekijk alle features
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card 
                  key={feature.title} 
                  className="border bg-card group"
                  data-testid={`feature-card-${index}`}
                >
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-slate-900" data-testid="section-analytics">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-3xl opacity-50" />
              <DashboardMockup variant="analytics" className="relative" />
            </div>
            
            <div className="order-1 lg:order-2">
              <Badge variant="secondary" className="mb-6 no-default-hover-elevate no-default-active-elevate">
                Advertentie Dashboard
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Volledige controle over uw ads
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Bekijk real-time prestaties, beheer uw budget en optimaliseer 
                uw campagnes met ons intuïtieve dashboard.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Target, label: "Doelgroep targeting" },
                  { icon: LineChart, label: "Real-time analytics" },
                  { icon: Layers, label: "A/B testing" },
                  { icon: TrendingUp, label: "ROI tracking" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-slate-200">
                    <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/pricing">
                <Button size="lg" className="gap-2">
                  Start met adverteren
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-testimonials">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Wat onze klanten zeggen
            </h2>
            <p className="text-xl text-muted-foreground">
              Ontdek waarom meer dan 500 bedrijven voor ons kiezen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.name}
                className="border bg-card"
                data-testid={`testimonial-card-${index}`}
              >
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed mb-8">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} bij {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-y" data-testid="section-payments">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Veilig betalen met
          </p>
          <PaymentMethods />
        </div>
      </section>

      <section className="py-24 md:py-32" data-testid="section-pricing-preview">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Badge variant="secondary" className="mb-4 no-default-hover-elevate no-default-active-elevate">
              Prijzen
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Transparante prijzen
            </h2>
            <p className="text-xl text-muted-foreground">
              Kies het plan dat past bij uw behoeften. Geen verborgen kosten.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border bg-card" data-testid="pricing-low">
              <CardContent className="p-8">
                <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Starter</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-bold font-mono">99</span>
                  <span className="text-muted-foreground">/maand</span>
                </div>
                <p className="text-muted-foreground text-sm mb-8">Perfect voor kleine bedrijven</p>
                <ul className="space-y-4 mb-8">
                  {["3 templates", "5 pagina's", "Basis support", "SSL inbegrepen"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">Selecteer</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary bg-card relative" data-testid="pricing-medium">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Meest gekozen</Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Professional</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-bold font-mono">199</span>
                  <span className="text-muted-foreground">/maand</span>
                </div>
                <p className="text-muted-foreground text-sm mb-8">Voor groeiende bedrijven</p>
                <ul className="space-y-4 mb-8">
                  {["10 templates", "Onbeperkt pagina's", "Priority support", "Analytics dashboard", "SEO basis pakket"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing">
                  <Button className="w-full">Selecteer</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border bg-card" data-testid="pricing-high">
              <CardContent className="p-8">
                <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Enterprise</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">Op maat</span>
                </div>
                <p className="text-muted-foreground text-sm mb-8">Voor grote organisaties</p>
                <ul className="space-y-4 mb-8">
                  {["Custom design", "Dedicated support", "SLA garantie", "Specialist toegang", "Volledige integratie"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">Contact</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section 
        className="py-32 md:py-40 relative overflow-hidden"
        data-testid="section-cta"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 text-white">
            Klaar om te starten?
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Start vandaag nog met uw professionele website. 
            Geen verplichtingen, transparante prijzen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="gap-2 text-lg h-14 px-10" 
                data-testid="button-cta-signup"
              >
                Start gratis proefperiode
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/5 border-white/20 text-white h-14 px-10 text-lg backdrop-blur-sm"
                data-testid="button-cta-pricing"
              >
                Bekijk prijzen
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 mt-16 text-slate-400 flex-wrap">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>SSL Beveiligd</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
