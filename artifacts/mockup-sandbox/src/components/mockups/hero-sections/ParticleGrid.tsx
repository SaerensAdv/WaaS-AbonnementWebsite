import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, ShieldCheck, Zap, Globe, Clock, Euro, Check } from "lucide-react";

export function ParticleGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Config
    const particleCount = 100;
    const connectionDistance = 150;
    const mouseConnectionDistance = 200;
    
    let mouse = {
      x: -1000,
      y: -1000
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.radius = Math.random() * 1.5 + 0.5;
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvasWidth) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvasHeight) this.vy = -this.vy;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, 0.5)"; // Tailwind sky-400
        ctx.fill();
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(canvas.width, canvas.height);
        particles[i].draw(ctx);

        // Connect to other particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - distance / connectionDistance)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Connect to mouse
        const dxMouse = particles[i].x - mouse.x;
        const dyMouse = particles[i].y - mouse.y;
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distanceMouse < mouseConnectionDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(96, 165, 250, ${0.3 * (1 - distanceMouse / mouseConnectionDistance)})`; // Tailwind blue-400
          ctx.lineWidth = 1.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          
          // Slight attraction
          particles[i].vx -= dxMouse * 0.0001;
          particles[i].vy -= dyMouse * 0.0001;
          
          // Limit speed
          const speed = Math.sqrt(particles[i].vx * particles[i].vx + particles[i].vy * particles[i].vy);
          if (speed > 2) {
            particles[i].vx = (particles[i].vx / speed) * 2;
            particles[i].vy = (particles[i].vy / speed) * 2;
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const stats = [
    { icon: Globe, label: "500+ websites", value: "Actief" },
    { icon: Zap, label: "99.9% uptime", value: "Gegarandeerd" },
    { icon: Clock, label: "<24u response", value: "Support" },
    { icon: Euro, label: "€0 setup", value: "Kosten" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 font-sans">
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full pointer-events-auto"
      />
      
      {/* Gradient overlay to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        
        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-md mb-8"
        >
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span className="text-sm font-medium text-slate-300">Geen opstartkosten, geen contract</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-5xl leading-[1.1]"
        >
          Binnen 10 dagen een professionele website.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
            Zonder opstartkosten.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed"
        >
          Alles geregeld voor uw online succes: design, hosting, onderhoud en support in één vast maandbedrag vanaf <span className="font-semibold text-slate-200">€49/mnd</span>. Maandelijks opzegbaar.
        </motion.p>

        {/* Features list inline */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-sm text-slate-400"
        >
          {['Premium Design', 'Snelle Hosting', 'SSL Certificaat', 'Onderhoud & Updates'].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-sky-500" />
              <span>{item}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <a
            href="#pricing"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-sky-500 border border-transparent rounded-full overflow-hidden hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start uw website
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
          
          <a
            href="#faq"
            className="group inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-slate-900/50 border border-slate-700/50 rounded-full hover:bg-slate-800/80 hover:border-slate-600 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <Play className="w-5 h-5 mr-2 text-sky-400 transition-transform group-hover:scale-110" />
            Hoe werkt het?
          </a>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative group flex flex-col items-center p-6 bg-slate-900/40 border border-slate-800/50 rounded-2xl backdrop-blur-md overflow-hidden transition-all duration-300 hover:bg-slate-800/60 hover:border-slate-700/50 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <stat.icon className="w-8 h-8 text-sky-400 mb-4" />
              <p className="text-2xl font-bold text-white mb-1">{stat.label.split(' ')[0]}</p>
              <p className="text-sm text-slate-400 font-medium">{stat.label.split(' ').slice(1).join(' ')} {stat.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
