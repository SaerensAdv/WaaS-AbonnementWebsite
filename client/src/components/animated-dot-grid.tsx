import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth < 768;
  return isMobileUA && isSmallScreen;
}

interface AnimatedDotGridProps {
  className?: string;
  dotSize?: number;
  gap?: number;
  baseOpacity?: number;
  accentColor?: string;
}

export function AnimatedDotGrid({
  className,
  dotSize = 1,
  gap = 40,
  baseOpacity = 0.08,
  accentColor = "59, 130, 246",
}: AnimatedDotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    if (isMobile) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      
      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * gap;
          const y = row * gap;
          
          const waveOffset = (x + y) * 0.01;
          const wave = Math.sin(time * 0.0008 + waveOffset) * 0.5 + 0.5;
          
          const centerX = width / 2;
          const centerY = height / 2;
          const distFromCenter = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          );
          const maxDist = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          const centerInfluence = 1 - (distFromCenter / maxDist) * 0.5;
          
          const pulse = Math.sin(time * 0.001 - distFromCenter * 0.003) * 0.5 + 0.5;
          
          const opacity = baseOpacity + wave * 0.04 + pulse * centerInfluence * 0.06;
          
          const isAccented = pulse > 0.7 && centerInfluence > 0.5;
          const color = isAccented ? accentColor : "255, 255, 255";
          
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${opacity})`;
          ctx.fill();
          
          if (isAccented && opacity > 0.1) {
            const glowSize = dotSize * 3;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
            gradient.addColorStop(0, `rgba(${accentColor}, ${opacity * 0.3})`);
            gradient.addColorStop(1, `rgba(${accentColor}, 0)`);
            ctx.beginPath();
            ctx.arc(x, y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dotSize, gap, baseOpacity, accentColor, isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
    />
  );
}
