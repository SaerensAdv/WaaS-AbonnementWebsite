import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle2, Monitor, Shield, Zap, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CountUp = ({ end, duration = 2, suffix = '', prefix = '', decimals = 0 }: { end: number, duration?: number, suffix?: string, prefix?: string, decimals?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(end * easeOutQuart);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, inView]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};

export function SplitReveal() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex flex-col md:flex-row font-sans">
      
      {/* Left Dark Panel */}
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full md:w-[55%] min-h-[50vh] md:min-h-screen bg-slate-950 text-white z-20 flex flex-col justify-center"
        style={{ 
          clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)'
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_rgba(56,189,248,0.1)_0%,_transparent_50%)]" />
        
        <div className="relative z-10 p-8 md:p-16 lg:p-24 max-w-2xl lg:ml-auto md:pr-24 lg:pr-32 pt-24 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-sky-400 text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <Shield className="w-4 h-4" />
            <span>Geen opstartkosten, geen contract</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
          >
            Binnen 10 dagen een <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
              professionele website.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed font-light"
          >
            Design, hosting, onderhoud en support in één vast maandbedrag vanaf <span className="text-white font-medium">€49/mnd</span>. Maandelijks opzegbaar. 
            <span className="block mt-2 font-medium text-sky-400">Zonder opstartkosten.</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Button size="lg" className="h-14 px-8 text-base bg-white text-slate-950 hover:bg-sky-50 transition-all rounded-full group">
              Start uw website
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base border-slate-700 text-white hover:bg-slate-800 hover:text-white rounded-full bg-transparent">
              Hoe werkt het?
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="grid grid-cols-2 gap-4 text-sm text-slate-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-sky-500" />
              <span>Maandelijks opzegbaar</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-sky-500" />
              <span>Inclusief SSL & Hosting</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Light Panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute md:relative inset-0 md:inset-auto w-full md:w-[60%] min-h-[50vh] md:min-h-screen bg-slate-100 text-slate-900 z-10 md:-ml-[15%]"
      >
        <div className="absolute inset-0">
          <img 
            src="/__mockup/images/split-reveal-bg.png" 
            alt="Professional workspace" 
            className="w-full h-full object-cover opacity-20 md:opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100/90 to-slate-100/50" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end md:justify-center p-8 md:p-16 lg:p-24 pt-32 md:pl-32 lg:pl-48">
          
          <div className="grid grid-cols-2 gap-8 md:gap-12 mt-auto md:mt-0 max-w-lg">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-white"
            >
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4 text-sky-600">
                <Monitor className="w-6 h-6" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                <CountUp end={500} suffix="+" />
              </div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Websites live</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-white"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                <CountUp end={99.9} decimals={1} suffix="%" />
              </div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Uptime garantie</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-900/20 text-white"
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-white">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">
                <CountUp end={0} prefix="€" />
              </div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Setup kosten</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-white flex flex-col justify-center"
            >
              <div className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                &lt;24u
              </div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Support response</div>
            </motion.div>

          </div>

        </div>
      </motion.div>

    </section>
  );
}

export default SplitReveal;
