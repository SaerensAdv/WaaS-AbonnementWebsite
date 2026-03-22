import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Globe, 
  Wrench, 
  Headset, 
  Search, 
  CheckCircle,
  Zap,
  Smartphone,
  Check,
  ArrowRight
} from "lucide-react";

const ORBITAL_ITEMS = [
  { icon: Globe, label: "Hosting", color: "text-blue-500", bg: "bg-blue-100", orbit: 1, angle: 0, delay: 0 },
  { icon: ShieldCheck, label: "SSL", color: "text-green-500", bg: "bg-green-100", orbit: 1, angle: 120, delay: -4 },
  { icon: Wrench, label: "Onderhoud", color: "text-orange-500", bg: "bg-orange-100", orbit: 1, angle: 240, delay: -8 },
  { icon: Headset, label: "Support", color: "text-purple-500", bg: "bg-purple-100", orbit: 2, angle: 60, delay: -2 },
  { icon: Search, label: "SEO", color: "text-pink-500", bg: "bg-pink-100", orbit: 2, angle: 180, delay: -6 },
  { icon: Smartphone, label: "Responsive", color: "text-teal-500", bg: "bg-teal-100", orbit: 2, angle: 300, delay: -10 },
];

export function OrbitalMotion() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden flex items-center justify-center font-sans">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 blur-[120px] rounded-full mix-blend-multiply" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-teal-400/20 blur-[120px] rounded-full mix-blend-multiply" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CgkJPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgwLCAwLCAwLCAwLjA1KSIvPgoJPC9zdmc+')] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      {/* Orbital Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Ring 1 */}
        <div className="absolute w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full border border-slate-200/50 [border-style:dashed]" />
        
        {/* Ring 2 */}
        <div className="absolute w-[900px] h-[900px] sm:w-[1200px] sm:h-[1200px] rounded-full border border-slate-200/50 [border-style:dashed]" />

        {/* Orbiting Items */}
        {mounted && ORBITAL_ITEMS.map((item, i) => {
          const radius = item.orbit === 1 ? (window.innerWidth < 640 ? 300 : 400) : (window.innerWidth < 640 ? 450 : 600);
          const duration = item.orbit === 1 ? 40 : 60;
          
          return (
            <motion.div
              key={i}
              className="absolute flex items-center justify-center"
              initial={{ rotate: item.angle }}
              animate={{ rotate: item.angle + 360 }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: radius * 2,
                height: radius * 2,
              }}
            >
              <div 
                className={`absolute top-0 -mt-8 flex flex-col items-center gap-2 pointer-events-auto`}
                style={{
                  transform: `rotate(-${item.angle}deg)`, // Anti-rotate to keep upright, but this needs dynamic update if we want them perfectly upright. 
                  // For simplicity in pure CSS/Framer, we'll just let them have a subtle rotation or use a trick.
                }}
              >
                <motion.div
                   animate={{ rotate: -(item.angle + 360) }}
                   transition={{
                     duration,
                     repeat: Infinity,
                     ease: "linear",
                   }}
                   className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center shadow-lg border border-white/50 backdrop-blur-sm transition-transform group-hover:scale-110 cursor-pointer`}>
                    <item.icon className={`w-8 h-8 ${item.color}`} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-slate-600 bg-white/80 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm border border-slate-100">
                    {item.label}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200/60 text-sm font-medium text-slate-700 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          Geen opstartkosten, geen contract
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]"
        >
          Binnen 10 dagen een <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            professionele website.
          </span>
          <br />
          <span className="text-3xl md:text-4xl lg:text-5xl text-slate-500 font-bold mt-2 block">
            Zonder opstartkosten.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Design, hosting, onderhoud en support in één vast maandbedrag vanaf <span className="font-semibold text-slate-900">€49/mnd</span>. Maandelijks opzegbaar, dus u zit nergens aan vast.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a href="#pricing" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-semibold text-lg transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center gap-2 group">
              Start uw website
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </a>
          <a href="#faq" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-full font-semibold text-lg transition-all shadow-sm border border-slate-200 flex items-center justify-center gap-2">
              Hoe werkt het?
            </button>
          </a>
        </motion.div>

        {/* Social Proof Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-200/60 pt-10"
        >
          {[
            { label: "Websites online", value: "500+" },
            { label: "Uptime garantie", value: "99.9%" },
            { label: "Support reactie", value: "<24u" },
            { label: "Setup kosten", value: "€0" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{stat.value}</span>
              <span className="text-sm font-medium text-slate-500">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
