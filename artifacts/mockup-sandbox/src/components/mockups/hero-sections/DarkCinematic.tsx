import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Check, Play, Star, Shield, Zap, Clock } from "lucide-react";

export function DarkCinematic() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-[#030303] text-zinc-100 overflow-hidden font-sans selection:bg-indigo-500/30"
    >
      {/* Cinematic Lighting / Spotlight Effect */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-out"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 40%)`,
        }}
      />
      
      {/* Deep Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] mix-blend-screen opacity-50" />

      {/* Grid Texture */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 md:px-12 lg:px-24 pt-24 pb-12">
        
        {/* Top Trust Strip */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 border border-white/10 bg-white/5 backdrop-blur-md rounded-full px-5 py-2 w-fit mb-16 shadow-[0_0_30px_rgba(99,102,241,0.1)]"
        >
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
          <span className="text-xs font-medium tracking-wider uppercase text-zinc-300">
            Geen opstartkosten, geen contract
          </span>
        </motion.div>

        <div className="flex-grow flex flex-col justify-center max-w-5xl">
          {/* Dramatic Headline */}
          <motion.h1 
            style={{ y: y1 }}
            className="text-6xl md:text-8xl lg:text-[110px] font-bold leading-[0.9] tracking-tighter mb-8"
          >
            <motion.span 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="block text-zinc-400"
            >
              Binnen 10 dagen
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="block text-white"
            >
              een professionele
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-indigo-200 to-white"
            >
              website.
            </motion.span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="h-px w-full max-w-2xl bg-gradient-to-r from-indigo-500/50 via-white/10 to-transparent mb-10"
          />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 max-w-3xl mb-16"
          >
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
              Zonder opstartkosten. Inclusief design, hosting, onderhoud en support in één vast maandbedrag vanaf <span className="text-white font-medium">€49/mnd</span>. Maandelijks opzegbaar.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <a 
              href="#pricing"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden w-full sm:w-auto transition-transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">Start uw website</span>
              <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a 
              href="#faq"
              className="group inline-flex items-center gap-3 px-8 py-4 text-white font-medium w-full sm:w-auto justify-center"
            >
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 group-hover:after:origin-bottom-left group-hover:after:scale-x-100">
                Hoe werkt het?
              </span>
              <Play className="w-4 h-4 fill-white opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          </motion.div>
        </div>

        {/* Bottom Stats Bar */}
        <motion.div 
          style={{ opacity }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 border-t border-white/10 pt-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Star className="w-4 h-4 fill-indigo-400" />
                <span className="text-sm font-medium uppercase tracking-wider">Klanten</span>
              </div>
              <div className="text-3xl font-light text-white">500+ <span className="text-sm text-zinc-500">websites</span></div>
            </div>
            
            <div className="flex flex-col gap-2 pl-8">
              <div className="flex items-center gap-2 text-indigo-400">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Uptime</span>
              </div>
              <div className="text-3xl font-light text-white">99.9% <span className="text-sm text-zinc-500">gegarandeerd</span></div>
            </div>
            
            <div className="flex flex-col gap-2 pl-8">
              <div className="flex items-center gap-2 text-indigo-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Support</span>
              </div>
              <div className="text-3xl font-light text-white">&lt;24u <span className="text-sm text-zinc-500">response</span></div>
            </div>
            
            <div className="flex flex-col gap-2 pl-8">
              <div className="flex items-center gap-2 text-indigo-400">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Setup</span>
              </div>
              <div className="text-3xl font-light text-white">€0 <span className="text-sm text-zinc-500">kosten</span></div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
