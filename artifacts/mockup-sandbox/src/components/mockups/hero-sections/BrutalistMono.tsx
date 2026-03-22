import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Globe, Clock, Zap, CheckCircle, ArrowDown } from 'lucide-react';

export function BrutalistMono() {
  const [typedText, setTypedText] = useState('');
  const fullText = "Binnen 10 dagen een professionele website.";
  
  useEffect(() => {
    let currentText = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        currentText += fullText[i];
        setTypedText(currentText);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Oplevering", value: "10 DAGEN", icon: Clock },
    { label: "Websites", value: "500+", icon: Globe },
    { label: "Uptime", value: "99.9%", icon: Zap },
    { label: "Opstartkosten", value: "€0", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-mono selection:bg-[#ffeb3b] selection:text-black relative overflow-hidden flex flex-col">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
        backgroundSize: '4rem 4rem',
        opacity: 0.1
      }} />

      {/* Trust Badge */}
      <div className="border-b-2 border-black bg-[#ffeb3b] py-2 px-4 flex items-center justify-center font-bold text-sm tracking-widest uppercase relative z-10">
        <marquee scrollamount="5" className="w-full max-w-7xl mx-auto">
          GEEN OPSTARTKOSTEN • GEEN CONTRACT • MAANDELIJKS OPZEGBAAR • ALLES INCLUSIEF • GEEN OPSTARTKOSTEN • GEEN CONTRACT • MAANDELIJKS OPZEGBAAR •
        </marquee>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col md:flex-row relative z-10 max-w-screen-2xl mx-auto w-full border-x-2 border-black">
        
        {/* Left Column - Hero Text */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-16 border-b-2 md:border-b-0 md:border-r-2 border-black relative bg-white">
          <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
            [SYS.INIT]
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-6 mt-8 md:mt-0">
              <Terminal className="w-6 h-6" />
              <span className="text-sm border border-black px-2 py-1 uppercase font-bold bg-[#ffeb3b]">v2.0_DEPLOY</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-none tracking-tighter mb-6">
              {typedText}
              <motion.span 
                animate={{ opacity: [1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-8 h-12 md:h-20 bg-[#ffeb3b] ml-2 align-middle border-2 border-black"
              />
            </h1>
            
            <div className="inline-block bg-black text-white text-2xl md:text-4xl font-bold uppercase px-4 py-2 border-2 border-black transform -rotate-2 hover:rotate-0 transition-transform">
              Zonder opstartkosten.
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
            className="text-lg md:text-xl font-medium border-l-4 border-black pl-4 py-2 mb-12 max-w-xl bg-gray-50"
          >
            Design, hosting, onderhoud en support in één vast maandbedrag. Vanaf €49/mnd. Maandelijks opzegbaar.
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a 
              href="#pricing" 
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-black border-2 border-black hover:bg-transparent hover:text-black transition-colors uppercase tracking-wider overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#ffeb3b] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
              <span className="relative z-10 flex items-center gap-2">
                Start uw website
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            
            <a 
              href="#faq" 
              className="inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-white border-2 border-black hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] uppercase tracking-wider"
            >
              Hoe werkt het?
            </a>
          </motion.div>
        </div>

        {/* Right Column - Stats Grid */}
        <div className="w-full md:w-1/3 lg:w-2/5 flex flex-col bg-[#ffeb3b]">
          <div className="p-4 border-b-2 border-black bg-black text-white font-bold uppercase text-sm flex justify-between items-center">
            <span>Systeem Status</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> ONLINE</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-1 flex-grow">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 * idx, duration: 0.4 }}
                className={`p-6 md:p-8 flex flex-col justify-center border-black ${idx % 2 === 0 ? 'border-b-2 border-r-2 md:border-r-0 bg-white' : 'border-b-2 bg-[#ffeb3b]'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
                  <span className="text-sm md:text-base font-bold uppercase tracking-wider opacity-70">
                    {stat.label}
                  </span>
                </div>
                <div className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Decorative bottom area */}
          <div className="p-8 bg-white relative overflow-hidden flex-grow flex items-end justify-end">
            <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
              backgroundImage: 'radial-gradient(black 2px, transparent 2px)',
              backgroundSize: '16px 16px'
            }}></div>
            <ArrowDown className="w-16 h-16 opacity-20 relative z-10 animate-bounce" />
          </div>
        </div>

      </div>
    </div>
  );
}
