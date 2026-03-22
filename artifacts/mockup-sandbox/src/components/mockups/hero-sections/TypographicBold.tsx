import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useAnimation, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, MousePointerClick, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const wordVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

const StatItem = ({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    className="flex flex-col border-l border-zinc-200/20 pl-4 py-1"
  >
    <span className="text-3xl font-serif font-medium tracking-tight text-zinc-900 dark:text-zinc-100">{value}</span>
    <span className="text-xs uppercase tracking-widest text-zinc-500 font-sans mt-1">{label}</span>
  </motion.div>
);

export function TypographicBold() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#FDFBF7] dark:bg-[#0A0A0A] overflow-hidden selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 font-sans"
    >
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-zinc-200 to-transparent blur-3xl mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-zinc-300 to-transparent blur-3xl mix-blend-multiply dark:mix-blend-screen" />
      </div>

      {/* Trust Badge / Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center mix-blend-difference text-white"
      >
        <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          WebsiteAbonnementen
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-medium uppercase tracking-widest opacity-80">
          <span>Geen opstartkosten</span>
          <span className="w-1 h-1 rounded-full bg-white" />
          <span>Geen contract</span>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen pt-20 pb-10 px-4 sm:px-8 md:px-12 max-w-[1400px] mx-auto">
        
        {/* Massive Typography */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: y1, opacity }}
          className="max-w-[1200px]"
        >
          <div className="overflow-hidden leading-[0.85] pb-2">
            <motion.h1 className="text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[7vw] font-serif font-medium tracking-tighter text-zinc-900 dark:text-zinc-50 flex flex-wrap gap-x-[2vw] gap-y-2">
              <span className="overflow-hidden flex">
                <motion.span variants={wordVariants}>Binnen</motion.span>
              </span>
              <span className="overflow-hidden flex relative group">
                <motion.span variants={wordVariants} className="italic text-zinc-400">
                  10 dagen
                </motion.span>
                {/* Visual texture behind specific word */}
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 mix-blend-difference opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-xl -z-10" />
              </span>
              <span className="overflow-hidden flex">
                <motion.span variants={wordVariants}>een</motion.span>
              </span>
              <span className="overflow-hidden flex w-full">
                <motion.span 
                  variants={wordVariants}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-900 dark:from-white dark:via-zinc-400 dark:to-white bg-[length:200%_auto] animate-gradient"
                >
                  professionele
                </motion.span>
              </span>
              <span className="overflow-hidden flex">
                <motion.span variants={wordVariants}>website.</motion.span>
              </span>
            </motion.h1>
          </div>

          <div className="mt-8 md:mt-12 overflow-hidden">
            <motion.h2 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[6vw] sm:text-[5vw] md:text-[4vw] font-sans font-light tracking-tight text-zinc-500 dark:text-zinc-400 italic"
            >
              Zonder opstartkosten.
            </motion.h2>
          </div>
        </motion.div>

        {/* Editorial Layout: Two Columns Bottom */}
        <div className="mt-16 md:mt-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-end w-full">
          
          {/* Left: Description & CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="md:col-span-5 lg:col-span-4 flex flex-col gap-8"
          >
            <p className="text-base md:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 font-sans max-w-md border-l border-zinc-900 dark:border-white pl-4 ml-2 py-1">
              Design, hosting, onderhoud en support in één vast maandbedrag vanaf <strong className="font-semibold text-zinc-900 dark:text-zinc-100">€49/mnd</strong>. Maandelijks opzegbaar, geen kleine lettertjes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 ml-2">
              <Button size="lg" className="rounded-full h-14 px-8 text-base bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all duration-300 shadow-xl shadow-zinc-900/10 group">
                Start uw website
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800 transition-all duration-300">
                Hoe werkt het?
              </Button>
            </div>
          </motion.div>

          {/* Right: Integrated Stats */}
          <motion.div 
            style={{ y: y2 }}
            className="md:col-span-7 lg:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 lg:gap-8 justify-end w-full"
          >
            <StatItem value="500+" label="Websites" delay={1.1} />
            <StatItem value="99.9%" label="Uptime" delay={1.2} />
            <StatItem value="<24u" label="Response" delay={1.3} />
            <StatItem value="€0" label="Setup costs" delay={1.4} />
          </motion.div>

        </div>

        {/* Bottom Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 text-zinc-500"
        >
          <span className="text-xs uppercase tracking-widest font-sans">Scroll</span>
          <motion.div 
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>

      </div>

      {/* Global styles for this specific component's custom animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
      `}} />
    </div>
  );
}
