import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { CheckCircle2, ArrowRight, Shield, Clock, Zap, Star, Check } from 'lucide-react';

export function MeshGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      time += 0.002;
      
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Base background color (warm off-white)
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(0, 0, width, height);

      // Create multiple radial gradients that move
      const drawBlob = (x: number, y: number, r: number, color: string) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      };

      // Soft warm colors: peach, soft yellow, light coral, gentle pink
      const c1x = width * 0.5 + Math.sin(time) * width * 0.3;
      const c1y = height * 0.5 + Math.cos(time * 0.8) * height * 0.3;
      drawBlob(c1x, c1y, width * 0.6, 'rgba(255, 218, 185, 0.6)'); // Peachpuff

      const c2x = width * 0.2 + Math.cos(time * 1.2) * width * 0.2;
      const c2y = height * 0.2 + Math.sin(time * 1.1) * height * 0.2;
      drawBlob(c2x, c2y, width * 0.7, 'rgba(255, 236, 179, 0.5)'); // Soft Yellow

      const c3x = width * 0.8 + Math.sin(time * 0.7) * width * 0.2;
      const c3y = height * 0.8 + Math.cos(time * 1.3) * height * 0.2;
      drawBlob(c3x, c3y, width * 0.6, 'rgba(255, 182, 193, 0.4)'); // Light Pink

      const c4x = width * 0.5 + Math.cos(time * 0.9) * width * 0.4;
      const c4y = height * 0.8 + Math.sin(time * 1.4) * height * 0.3;
      drawBlob(c4x, c4y, width * 0.8, 'rgba(240, 128, 128, 0.3)'); // Light Coral

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center items-center font-sans selection:bg-rose-200 selection:text-rose-900">
      {/* Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        style={{ filter: 'blur(60px)' }}
      />
      
      {/* Subtle grain overlay for texture */}
      <div 
        className="absolute inset-0 z-[1] opacity-20 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center max-w-4xl"
        >
          {/* Trust Badge */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-sm text-sm font-medium text-stone-700">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Geen opstartkosten, geen contract
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900 mb-6 leading-[1.1]">
            Binnen 10 dagen een professionele website. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Zonder opstartkosten.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-stone-600 mb-10 max-w-2xl leading-relaxed">
            Design, hosting, onderhoud en support in één vast maandbedrag. Vanaf €49/mnd, maandelijks opzegbaar. Focus op uw bedrijf, wij regelen uw online aanwezigheid.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
            <a 
              href="#pricing" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-stone-900 text-white font-medium text-lg hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Start uw website
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a 
              href="#faq" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/50 backdrop-blur-sm border border-stone-200/50 text-stone-800 font-medium text-lg hover:bg-white/80 transition-all shadow-sm"
            >
              Hoe werkt het?
            </a>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div variants={fadeUp} className="w-full pt-10 border-t border-stone-200/50">
            <p className="text-sm text-stone-500 font-medium mb-6 uppercase tracking-wider">Waarom 500+ bedrijven voor ons kiezen</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-2xl bg-white/60 backdrop-blur-sm shadow-sm flex items-center justify-center mb-3 text-rose-500">
                  <Star className="h-6 w-6 fill-current" />
                </div>
                <div className="text-2xl font-bold text-stone-900">500+</div>
                <div className="text-sm text-stone-600">Websites</div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-2xl bg-white/60 backdrop-blur-sm shadow-sm flex items-center justify-center mb-3 text-emerald-500">
                  <Zap className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-stone-900">99.9%</div>
                <div className="text-sm text-stone-600">Uptime</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-2xl bg-white/60 backdrop-blur-sm shadow-sm flex items-center justify-center mb-3 text-blue-500">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-stone-900">&lt;24u</div>
                <div className="text-sm text-stone-600">Reactietijd</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-2xl bg-white/60 backdrop-blur-sm shadow-sm flex items-center justify-center mb-3 text-amber-500">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-stone-900">€0</div>
                <div className="text-sm text-stone-600">Setup kosten</div>
              </div>
            </div>
          </motion.div>
          
        </motion.div>
      </div>
    </div>
  );
}
