import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { BlurIn, FadeInUp, GlowPulse } from "@/components/ui/motion";
import { Wrench, ArrowLeft, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <MarketingLayout>
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[72px]"
        data-testid="section-coming-soon"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />
        
        <GlowPulse className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <BlurIn delay={0}>
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
                <Wrench className="h-10 w-10 text-primary" />
              </div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                Komt binnenkort
              </div>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight text-white mb-6" 
                data-testid="text-coming-soon-title"
              >
                We werken aan
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">deze pagina</span>
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.3}>
              <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto leading-relaxed mb-10">
                Ons team is druk bezig om deze pagina voor u klaar te maken. 
                Binnenkort vindt u hier meer informatie over wie wij zijn.
              </p>
            </BlurIn>
            
            <FadeInUp delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="h-12 px-6 border-white/20 text-white bg-white/5 backdrop-blur-sm gap-2"
                    data-testid="button-back-home"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Terug naar home
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" className="h-12 px-6 gap-2" data-testid="button-view-pricing">
                    Bekijk onze abonnementen
                  </Button>
                </Link>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
