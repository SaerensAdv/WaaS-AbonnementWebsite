import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle2, ChevronRight, Play, ArrowRight, ShieldCheck, Zap, Server, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function GradientFlow() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 font-sans selection:bg-orange-500/30">
      {/* Background Animated Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50 opacity-90 mix-blend-overlay z-10"></div>
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ 
            x: [0, 100, -50, 0], 
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear" 
          }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-orange-300/40 mix-blend-multiply filter blur-[100px] opacity-70"
        />
        
        <motion.div 
          animate={{ 
            x: [0, -100, 100, 0], 
            y: [0, 100, -50, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            ease: "linear" 
          }}
          className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-indigo-300/40 mix-blend-multiply filter blur-[100px] opacity-70"
        />
        
        <motion.div 
          animate={{ 
            x: [0, 50, -100, 0], 
            y: [0, -50, 100, 0],
            scale: [1, 1.3, 0.7, 1]
          }}
          transition={{ 
            duration: 22, 
            repeat: Infinity,
            ease: "linear" 
          }}
          className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-amber-200/40 mix-blend-multiply filter blur-[120px] opacity-60"
        />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Navigation / Header Mock */}
        <motion.nav 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-6 lg:px-12"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-indigo-600 shadow-lg"></div>
            <span className="text-xl font-bold tracking-tight text-slate-900">abonnement.website</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Prijzen</a>
            <a href="#portfolio" className="hover:text-slate-900 transition-colors">Portfolio</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          </div>
          <Button variant="outline" className="hidden md:flex rounded-full bg-white/50 backdrop-blur-md border-slate-200/50 hover:bg-white/80">
            Inloggen
          </Button>
        </motion.nav>

        {/* Main Hero Content */}
        <div className="w-full max-w-4xl mx-auto text-center mt-12 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50/50 backdrop-blur-sm text-sm font-medium text-orange-800 shadow-sm">
              <span className="flex w-2 h-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
              Geen opstartkosten, geen contract
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6"
          >
            Binnen 10 dagen een professionele website. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-600">Zonder opstartkosten.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium"
          >
            Design, hosting, onderhoud en support in één vast maandbedrag.
            Geen verborgen kosten, <span className="text-slate-900 font-semibold">vanaf €49/mnd</span> en maandelijks opzegbaar.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button size="lg" className="h-14 px-8 w-full sm:w-auto text-base font-semibold rounded-full bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-900/20 group">
              Start uw website
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 w-full sm:w-auto text-base font-semibold rounded-full bg-white/60 backdrop-blur-md border-slate-200 hover:bg-white/90 hover:shadow-lg transition-all text-slate-700">
              <Play className="w-5 h-5 mr-2 text-slate-500 fill-slate-500" />
              Hoe werkt het?
            </Button>
          </motion.div>
        </div>

        {/* Dashboard/Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 50 }}
          className="w-full max-w-5xl mx-auto relative perspective-[2000px]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-20 bottom-[-20%] pointer-events-none"></div>
          
          <div className="relative rounded-2xl md:rounded-[2rem] border border-white/40 bg-white/40 backdrop-blur-xl shadow-2xl overflow-hidden transform-gpu rotate-x-12 scale-95 origin-bottom hover:rotate-x-0 hover:scale-100 transition-all duration-700 ease-out p-2 md:p-4">
            
            {/* Window Controls */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/20">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>

            <div className="bg-slate-50 rounded-xl overflow-hidden aspect-[16/9] relative flex items-center justify-center border border-slate-100">
              {/* Fake dashboard content */}
              <div className="absolute inset-0 flex">
                <div className="w-64 border-r border-slate-200 bg-white p-6 hidden md:block">
                  <div className="h-4 w-24 bg-slate-200 rounded mb-8"></div>
                  <div className="space-y-4">
                    <div className="h-8 w-full bg-indigo-50 rounded-md"></div>
                    <div className="h-8 w-full bg-slate-50 rounded-md"></div>
                    <div className="h-8 w-full bg-slate-50 rounded-md"></div>
                  </div>
                </div>
                <div className="flex-1 p-8 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-8">
                    <div className="h-6 w-48 bg-slate-200 rounded"></div>
                    <div className="h-10 w-32 bg-slate-900 rounded-lg"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="h-32 bg-white border border-slate-100 rounded-xl shadow-sm"></div>
                    <div className="h-32 bg-white border border-slate-100 rounded-xl shadow-sm"></div>
                    <div className="h-32 bg-white border border-slate-100 rounded-xl shadow-sm"></div>
                  </div>
                  <div className="h-64 bg-white border border-slate-100 rounded-xl shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Proof Strip */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-full max-w-5xl mx-auto mt-20 pt-10 border-t border-slate-200/50"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/60 shadow-sm border border-slate-100 flex items-center justify-center text-orange-500 mb-1">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-slate-800">500+</div>
              <div className="text-sm text-slate-500 font-medium">Actieve websites</div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/60 shadow-sm border border-slate-100 flex items-center justify-center text-indigo-500 mb-1">
                <Server className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-slate-800">99.9%</div>
              <div className="text-sm text-slate-500 font-medium">Uptime garantie</div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/60 shadow-sm border border-slate-100 flex items-center justify-center text-amber-500 mb-1">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-slate-800">&lt;24u</div>
              <div className="text-sm text-slate-500 font-medium">Support response</div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/60 shadow-sm border border-slate-100 flex items-center justify-center text-green-500 mb-1">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-slate-800">€0</div>
              <div className="text-sm text-slate-500 font-medium">Setup kosten</div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
