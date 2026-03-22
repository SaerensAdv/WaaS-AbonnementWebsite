import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, ArrowRight, Shield, Clock, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const PricingCard = ({ 
  title, 
  price, 
  pages, 
  color, 
  zIndex,
  rotateX,
  rotateY,
  depth,
  isActive,
  onMouseEnter
}: { 
  title: string; 
  price: string; 
  pages: number; 
  color: string;
  zIndex: number;
  rotateX: any;
  rotateY: any;
  depth: number;
  isActive: boolean;
  onMouseEnter: () => void;
}) => {
  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      style={{
        rotateX,
        rotateY,
        z: depth,
        zIndex,
      }}
      className={`absolute w-full max-w-sm rounded-2xl border p-6 bg-white/90 backdrop-blur-xl shadow-2xl transition-colors duration-500 cursor-pointer
        ${isActive ? 'border-primary/50 ring-2 ring-primary/20' : 'border-gray-200 hover:border-primary/30'}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + zIndex * 0.1 }}
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-5`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {isActive && (
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              Populair
            </span>
          )}
        </div>
        
        <div className="mb-6 flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-gray-900">€{price}</span>
          <span className="text-gray-500 font-medium">/mnd</span>
        </div>
        
        <ul className="space-y-3 mb-6">
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <div className="p-1 rounded-full bg-green-100 text-green-600">
              <Check className="w-3.5 h-3.5" />
            </div>
            {pages} Pagina's
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <div className="p-1 rounded-full bg-green-100 text-green-600">
              <Check className="w-3.5 h-3.5" />
            </div>
            Inclusief hosting & SSL
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-600">
            <div className="p-1 rounded-full bg-green-100 text-green-600">
              <Check className="w-3.5 h-3.5" />
            </div>
            Onderhoud & Support
          </li>
        </ul>
        
        <Button className={`w-full transition-all ${isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
          Kies {title}
        </Button>
      </div>
    </motion.div>
  );
};

export function InteractiveCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  
  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring configuration
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Create different transform ranges for the cards
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
    setActiveCard(1); // Reset to middle card
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const cards = [
    { title: "Starter", price: "49", pages: 5, color: "from-blue-500 to-cyan-500" },
    { title: "Professional", price: "99", pages: 10, color: "from-primary to-blue-600" },
    { title: "Business", price: "199", pages: 20, color: "from-purple-500 to-indigo-500" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 flex flex-col justify-center">
      {/* Background Grid & Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Decorative blurred circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] mix-blend-multiply" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-blue-400/20 rounded-full blur-[128px] mix-blend-multiply" />
      </div>

      <div className="container relative z-10 px-4 py-20 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 shadow-sm mb-6">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Geen opstartkosten, geen contract</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                Binnen 10 dagen een professionele website. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  Zonder opstartkosten.
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Krijg een compleet nieuwe website inclusief design, hosting, onderhoud en support. 
                Alles in één vast maandbedrag vanaf €49/mnd. Maandelijks opzegbaar.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold rounded-full group">
                  Start uw website
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold rounded-full bg-white/50 backdrop-blur-sm hover:bg-white">
                  Hoe werkt het?
                </Button>
              </div>

              {/* Trust Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-gray-200/60">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 text-gray-900 font-bold text-xl">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span>500+</span>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Actieve websites</div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1 text-gray-900 font-bold text-xl">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <span>99.9%</span>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Uptime garantie</div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1 text-gray-900 font-bold text-xl">
                    <Clock className="w-5 h-5 text-green-500" />
                    <span>&lt;24u</span>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Reactietijd support</div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1 text-gray-900 font-bold text-xl">
                    <span className="text-primary font-extrabold">€0</span>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Setup kosten</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - 3D Interactive Cards */}
          <div 
            className="relative h-[600px] w-full flex items-center justify-center [perspective:1200px]"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
          >
            {cards.map((card, index) => {
              // Calculate positioning and depth based on index and active state
              const offset = index - activeCard;
              const isCenter = index === activeCard;
              
              // Base depth and positioning
              let z = isCenter ? 50 : -100 - Math.abs(offset) * 50;
              let x = offset * 40;
              let y = offset * 20;

              // Adjust spread when hovering
              if (isHovering) {
                x = offset * 120;
                y = offset * -20;
                z = isCenter ? 80 : -50;
              }

              return (
                <motion.div
                  key={card.title}
                  className="absolute left-0 right-0 mx-auto w-full max-w-sm"
                  animate={{
                    x,
                    y,
                    z,
                    scale: isCenter ? 1 : 0.9,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    zIndex: isCenter ? 30 : 10 - Math.abs(offset),
                  }}
                >
                  <PricingCard
                    {...card}
                    rotateX={rotateX}
                    rotateY={rotateY}
                    depth={isHovering ? (isCenter ? 40 : 10) : 0}
                    zIndex={isCenter ? 30 : 10 - Math.abs(offset)}
                    isActive={isCenter}
                    onMouseEnter={() => setActiveCard(index)}
                  />
                </motion.div>
              );
            })}
          </div>
          
        </div>
      </div>
    </div>
  );
}
