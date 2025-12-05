import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedDotGridProps {
  className?: string;
  dotSize?: number;
  gap?: number;
  baseOpacity?: number;
  pulseOpacity?: number;
  baseColor?: string;
  accentColor?: string;
}

export function AnimatedDotGrid({
  className,
  dotSize = 2,
  gap = 32,
  baseOpacity = 0.15,
  pulseOpacity = 0.6,
  baseColor = "255, 255, 255",
  accentColor = "59, 130, 246",
}: AnimatedDotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dots: { x: number; y: number; baseOpacity: number; currentOpacity: number; targetOpacity: number; pulsePhase: number }[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      dots = [];
      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          dots.push({
            x: col * gap,
            y: row * gap,
            baseOpacity: baseOpacity,
            currentOpacity: baseOpacity,
            targetOpacity: baseOpacity,
            pulsePhase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      
      const mouse = mouseRef.current;
      const influenceRadius = 150;
      
      dots.forEach((dot) => {
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const pulseValue = Math.sin(time * 0.001 + dot.pulsePhase) * 0.5 + 0.5;
        const basePulse = dot.baseOpacity + pulseValue * 0.1;
        
        if (distance < influenceRadius) {
          const influence = 1 - distance / influenceRadius;
          dot.targetOpacity = basePulse + influence * (pulseOpacity - basePulse);
        } else {
          dot.targetOpacity = basePulse;
        }
        
        dot.currentOpacity += (dot.targetOpacity - dot.currentOpacity) * 0.1;
        
        const isInInfluence = distance < influenceRadius;
        const color = isInInfluence ? accentColor : baseColor;
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${dot.currentOpacity})`;
        ctx.fill();
        
        if (isInInfluence && dot.currentOpacity > 0.3) {
          const glowSize = dotSize + (dot.currentOpacity - 0.3) * 8;
          const gradient = ctx.createRadialGradient(
            dot.x, dot.y, 0,
            dot.x, dot.y, glowSize
          );
          gradient.addColorStop(0, `rgba(${accentColor}, ${dot.currentOpacity * 0.4})`);
          gradient.addColorStop(1, `rgba(${accentColor}, 0)`);
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dotSize, gap, baseOpacity, pulseOpacity, baseColor, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full pointer-events-auto", className)}
      style={{ touchAction: "none" }}
    />
  );
}
