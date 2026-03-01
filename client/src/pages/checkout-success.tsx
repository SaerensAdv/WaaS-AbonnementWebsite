import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { AnimatedDotGrid } from "@/components/animated-dot-grid";
import {
  FadeInUp,
  GlowPulse,
  BlurIn,
  motion,
} from "@/components/ui/motion";
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  Mail,
  Calendar,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const nextSteps = [
  {
    icon: Mail,
    title: "E-mail bevestiging",
    description: "U ontvangt direct een bevestigingsmail met uw factuur",
  },
  {
    icon: Clock,
    title: "Persoonlijk contact",
    description: "Binnen 24 uur nemen wij contact met u op",
  },
  {
    icon: Calendar,
    title: "Intakegesprek",
    description: "We plannen samen een kort gesprek om uw wensen te bespreken",
  },
];

export default function CheckoutSuccessPage() {
  const [, setLocation] = useLocation();
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  
  const verifyMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await apiRequest("POST", "/api/verify-checkout", { sessionId });
      return res.json();
    },
    onSuccess: () => {
      setVerified(true);
      setVerifying(false);
    },
    onError: () => {
      setVerifying(false);
    },
  });
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      verifyMutation.mutate(sessionId);
    } else {
      setVerifying(false);
    }
  }, []);
  
  if (verifying) {
    return (
      <MarketingLayout>
        <section className="relative min-h-[80vh] flex items-center justify-center pt-[72px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Uw bestelling wordt verwerkt...</p>
          </div>
        </section>
      </MarketingLayout>
    );
  }
  
  return (
    <MarketingLayout>
      <section 
        className="relative min-h-[80vh] flex items-center overflow-hidden pt-[72px]"
        data-testid="section-checkout-success"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.2),transparent)]" />
        
        <AnimatedDotGrid 
          className="opacity-80"
          dotSize={1}
          gap={35}
          baseOpacity={0.06}
          accentColor="34, 197, 94"
        />
        
        <GlowPulse className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px]" />
        
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <BlurIn delay={0}>
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
              >
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </motion.div>
            </BlurIn>
            
            <BlurIn delay={0.1}>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-6" 
                data-testid="text-success-title"
              >
                Bedankt voor uw bestelling!
              </h1>
            </BlurIn>
            
            <BlurIn delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
                Uw abonnement is succesvol gestart. Wij gaan direct voor u aan de slag.
              </p>
            </BlurIn>

            <FadeInUp delay={0.3}>
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-left">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-white">Wat gebeurt er nu?</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {nextSteps.map((step, index) => (
                      <motion.div 
                        key={step.title}
                        className="flex items-start gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <step.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{step.title}</h3>
                          <p className="text-sm text-slate-400">{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeInUp>

            <FadeInUp delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href="/app">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="gap-2 w-full sm:w-auto" data-testid="button-go-dashboard">
                      Naar mijn dashboard
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto border-white/20 text-white hover:bg-white/10" data-testid="button-go-home">
                      Terug naar home
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
