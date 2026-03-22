import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle2, Monitor, Shield, Zap, ArrowUpRight, Check, Star, Lock, Layout } from 'lucide-react';
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
    <span ref={ref} className="tabular-nums font-bold">
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};

const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 mix-blend-overlay"></div>
    
    {/* Animated glowing orbs */}
    <motion.div 
      animate={{ 
        y: [0, -20, 0],
        opacity: [0.3, 0.5, 0.3],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-sky-500/20 rounded-full blur-[100px] mix-blend-screen"
    />
    <motion.div 
      animate={{ 
        y: [0, 30, 0],
        opacity: [0.2, 0.4, 0.2],
        scale: [1, 1.2, 1]
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute bottom-[10%] right-[30%] w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[80px] mix-blend-screen"
    />
  </div>
);

const BrowserMockup = () => (
  <motion.div 
    initial={{ opacity: 0, y: 40, rotateX: 10 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ duration: 1, delay: 0.8, type: "spring", stiffness: 50 }}
    className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-slate-200/50 bg-white"
    style={{ transformPerspective: 1000 }}
  >
    {/* Browser Chrome */}
    <div className="h-10 bg-slate-50 border-b border-slate-200/60 flex items-center px-4 gap-2">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
      </div>
      <div className="mx-auto bg-white rounded-md h-6 w-1/2 max-w-[200px] border border-slate-200 flex items-center px-3 gap-2 shadow-sm">
        <Lock className="w-3 h-3 text-slate-400" />
        <div className="h-1.5 w-1/2 bg-slate-200 rounded-full"></div>
      </div>
    </div>
    
    {/* Mockup Content */}
    <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 flex flex-col">
        {/* Mock header */}
        <div className="h-14 bg-white border-b border-slate-100 flex items-center px-6 justify-between shrink-0">
          <div className="w-24 h-4 bg-slate-200 rounded-sm"></div>
          <div className="flex gap-4">
            <div className="w-12 h-2 bg-slate-100 rounded-full"></div>
            <div className="w-12 h-2 bg-slate-100 rounded-full"></div>
            <div className="w-12 h-2 bg-slate-100 rounded-full"></div>
          </div>
        </div>
        
        {/* Mock hero */}
        <div className="flex-1 p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white"></div>
          <div className="absolute right-0 top-0 w-1/2 h-full bg-sky-50/50 rounded-l-3xl transform translate-x-1/4 -translate-y-1/4"></div>
          
          <div className="relative z-10 max-w-[60%] space-y-4">
            <div className="w-16 h-4 bg-indigo-100 rounded-full mb-6"></div>
            <div className="w-full h-8 bg-slate-800 rounded-md"></div>
            <div className="w-4/5 h-8 bg-slate-800 rounded-md"></div>
            <div className="w-full h-3 bg-slate-400 rounded-full mt-4"></div>
            <div className="w-2/3 h-3 bg-slate-400 rounded-full"></div>
            
            <div className="flex gap-3 mt-8">
              <div className="w-24 h-10 bg-indigo-600 rounded-lg"></div>
              <div className="w-24 h-10 bg-white border border-slate-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export function SplitRevealPro() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-slate-50 flex flex-col lg:flex-row font-['Inter',sans-serif]">
      
      {/* Left Dark Panel */}
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full lg:w-[52%] min-h-[60vh] lg:min-h-screen bg-[#0a0f1c] text-white z-20 flex flex-col justify-center pb-24 lg:pb-0"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)'
        }}
      >
        {/* Glowing edge along the clip path */}
        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-sky-400/50 to-transparent shadow-[0_0_15px_rgba(56,189,248,0.5)] z-30" style={{ transform: 'translateX(8vw) skewX(-4.5deg)' }}></div>
        
        <GridBackground />
        
        <div className="relative z-10 p-6 sm:p-12 lg:p-20 xl:p-24 max-w-2xl xl:ml-auto lg:pr-32 pt-24 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.2)] text-amber-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md"
          >
            <Star className="w-4 h-4 fill-amber-300" />
            <span className="tracking-wide">PREMIUM WEBSITES VOOR MKB</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
          >
            <span className="block font-light text-slate-200 mb-2">Binnen 10 dagen een</span>
            <span className="relative inline-block">
              professionele website.
              <span className="absolute bottom-2 left-0 w-full h-3 bg-sky-500/20 -z-10 blur-sm"></span>
            </span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mb-10 text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed font-light"
          >
            Design, hosting, onderhoud en support in één vast maandbedrag vanaf <span className="text-white font-medium px-1 py-0.5 bg-white/10 rounded">€49/mnd</span>. Maandelijks opzegbaar. 
            <span className="block mt-4 font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 text-xl">
              Zonder opstartkosten.
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Button size="lg" className="h-14 px-8 text-base bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white transition-all rounded-full group shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:shadow-[0_0_40px_rgba(56,189,248,0.5)] border-0">
              Start uw website
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/20 text-white hover:bg-white/10 hover:text-white rounded-full bg-white/5 backdrop-blur-sm transition-all">
              Hoe werkt het?
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-wrap items-center gap-6 text-sm text-slate-300 font-medium"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Maandelijks opzegbaar</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Inclusief SSL & Hosting</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Premium Design</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Light Panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full lg:w-[55%] min-h-[50vh] lg:min-h-screen bg-[#f8fafc] text-slate-900 z-10 lg:-ml-[7%] flex flex-col"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(224,242,254,0.4)_0%,_transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col lg:justify-center p-6 sm:p-12 lg:p-20 pt-12 lg:pt-0 lg:pl-32 xl:pl-40">
          
          <div className="w-full mb-12 lg:mb-16 hidden sm:block">
            <BrowserMockup />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 relative">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-white p-5 sm:p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full -z-10 group-hover:bg-sky-100 transition-colors"></div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-100/50 rounded-xl flex items-center justify-center mb-4 text-sky-600">
                <Layout className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 tracking-tight">
                <CountUp end={500} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">Websites live</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="bg-white p-5 sm:p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-10 group-hover:bg-indigo-100 transition-colors"></div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100/50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 tracking-tight">
                <CountUp end={99.9} decimals={1} suffix="%" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">Uptime garantie</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl shadow-slate-900/10 text-white group hover:-translate-y-1 transition-transform duration-300 border border-slate-700 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -z-10"></div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-white backdrop-blur-sm">
                <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                <CountUp end={0} prefix="€" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-wider">Setup kosten</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="bg-white p-5 sm:p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-10 group-hover:bg-amber-100 transition-colors"></div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100/50 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 tracking-tight">
                &lt;24u
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">Support response</div>
            </motion.div>

          </div>
        </div>
        
        {/* Minimal trust strip at bottom */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="w-full mt-auto border-t border-slate-200/60 bg-white/50 backdrop-blur-md py-4 px-6 sm:px-12 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-2 text-sm text-slate-500 font-medium"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            Geen opstartkosten, geen contract
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            100% Eigendom content
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-slate-400" />
            Inclusief SSL & Hosting
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
}

export default SplitRevealPro;
