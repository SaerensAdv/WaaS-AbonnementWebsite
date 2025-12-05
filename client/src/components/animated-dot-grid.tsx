import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

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
  gap = 48,
  baseOpacity = 0.06,
  accentColor = "59, 130, 246",
}: AnimatedDotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const targetFPS = 24;
    const frameInterval = 1000 / targetFPS;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const animate = (time: number) => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (!isVisibleRef.current) return;
      
      const delta = time - lastFrameRef.current;
      if (delta < frameInterval) return;
      lastFrameRef.current = time - (delta % frameInterval);

      ctx.clearRect(0, 0, width, height);
      
      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
      const timeScale = time * 0.0006;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * gap;
          const y = row * gap;
          
          const waveOffset = (x + y) * 0.008;
          const wave = Math.sin(timeScale + waveOffset);
          
          const dx = x - centerX;
          const dy = y - centerY;
          const distFromCenter = Math.sqrt(dx * dx + dy * dy);
          const centerInfluence = 1 - distFromCenter / maxDist;
          
          const opacity = baseOpacity + wave * 0.02 * centerInfluence;
          
          const isAccented = wave > 0.6 && centerInfluence > 0.6;
          
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = isAccented 
            ? `rgba(${accentColor}, ${opacity + 0.04})`
            : `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
        }
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dotSize, gap, baseOpacity, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
    />
  );
}
