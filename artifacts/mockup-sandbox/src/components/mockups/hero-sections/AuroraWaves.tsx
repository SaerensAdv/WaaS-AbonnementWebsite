import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown, Rocket, Shield, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AuroraWaves() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-50 selection:bg-teal-500/30">
      {/* CSS Animations for Aurora */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes aurora-1 {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.5; }
          33% { transform: translateY(-5%) translateX(2%) scale(1.05); opacity: 0.7; }
          66% { transform: translateY(2%) translateX(-2%) scale(0.95); opacity: 0.6; }
          100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.5; }
        }
        @keyframes aurora-2 {
          0% { transform: translateY(0) translateX(0) scale(1) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(5%) translateX(5%) scale(1.1) rotate(2deg); opacity: 0.8; }
          100% { transform: translateY(0) translateX(0) scale(1) rotate(0deg); opacity: 0.4; }
        }
        @keyframes aurora-3 {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-8%) translateX(-5%) scale(1.15); opacity: 0.6; }
          100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-aurora-1 { animation: aurora-1 15s ease-in-out infinite; }
        .animate-aurora-2 { animation: aurora-2 20s ease-in-out infinite; }
        .animate-aurora-3 { animation: aurora-3 18s ease-in-out infinite reverse; }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}} />

      {/* Aurora Background Layers */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Deep background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
        
        {/* Wave 1 - Green/Teal */}
        <div className="absolute -top-[20%] -left-[10%] w-[120%] h-[140%] animate-aurora-1" 
             style={{ 
               background: 'radial-gradient(ellipse at 50% 50%, rgba(20, 184, 166, 0.15) 0%, transparent 60%)',
               filter: 'blur(60px)'
             }}>
        </div>

        {/* Wave 2 - Purple/Pink */}
        <div className="absolute -top-[10%] -right-[20%] w-[130%] h-[130%] animate-aurora-2"
             style={{
               background: 'radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 60%)',
               filter: 'blur(80px)'
             }}>
        </div>

        {/* Wave 3 - Emerald/Blue */}
        <div className="absolute top-[10%] -left-[20%] w-[140%] h-[120%] animate-aurora-3"
             style={{
               background: 'radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
               filter: 'blur(70px)'
             }}>
        </div>

        {/* Overlay grid for texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGgyMHYyMEgwem0xMCAxMGgxMHYxMEgxMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] opacity-[0.15] mix-blend-overlay"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        
        {/* Trust Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-300 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>Geen opstartkosten, geen contract</span>
          </div>
        </motion.div>

        {/* Hero Text */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="block text-white mb-2">Binnen 10 dagen een</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-purple-400 pb-2">
              professionele website.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl md:text-2xl font-light leading-relaxed"
          >
            Design, hosting, onderhoud en support in één vast maandbedrag. 
            <span className="font-semibold text-white"> Zonder opstartkosten.</span>
            <br className="hidden sm:block" /> Vanaf €49/mnd, maandelijks opzegbaar.
          </motion.p>
        </div>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6"
        >
          <Button 
            size="lg" 
            className="group relative h-14 overflow-hidden rounded-full bg-teal-500 px-8 text-base font-semibold text-white transition-all hover:bg-teal-400 hover:shadow-[0_0_40px_-10px_rgba(20,184,166,0.5)]"
            asChild
          >
            <a href="#pricing">
              <span className="relative z-10 flex items-center">
                Start uw website
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-teal-600 to-emerald-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
            </a>
          </Button>

          <Button 
            size="lg" 
            variant="outline"
            className="h-14 rounded-full border-slate-700 bg-slate-900/50 px-8 text-base font-semibold text-slate-200 backdrop-blur-md transition-all hover:bg-slate-800 hover:text-white"
            asChild
          >
            <a href="#faq">
              Hoe werkt het?
            </a>
          </Button>
        </motion.div>

        {/* Glass Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="mt-20 grid w-full max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4 md:gap-8"
        >
          {[
            { icon: Rocket, label: "500+", subtext: "Live websites" },
            { icon: Zap, label: "99.9%", subtext: "Uptime garantie" },
            { icon: CheckCircle2, label: "< 24u", subtext: "Support reactie" },
            { icon: Shield, label: "€0", subtext: "Setup kosten" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="group relative flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-lg transition-all hover:bg-white/10 hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
              <stat.icon className="mb-3 h-8 w-8 text-teal-400 opacity-80" />
              <div className="text-2xl font-bold text-white sm:text-3xl">{stat.label}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400 sm:text-sm">{stat.subtext}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-float"
        >
          <span className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-500">Ontdek meer</span>
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </motion.div>

      </div>
    </div>
  );
}
