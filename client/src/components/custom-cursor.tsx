import { useEffect, useRef, useCallback } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const isPointerRef = useRef(false);
  const rafRef = useRef<number>();

  const updateCursor = useCallback(() => {
    if (cursorRef.current && ringRef.current) {
      const { x, y } = posRef.current;
      cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (prefersReducedMotion || isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          updateCursor();
          rafRef.current = undefined;
        });
      }
    };

    const handlePointerChange = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        !!target.closest('button') ||
        !!target.closest('a') ||
        !!target.closest('[role="button"]') ||
        !!target.closest('input') ||
        !!target.closest('textarea');
      
      if (isClickable !== isPointerRef.current) {
        isPointerRef.current = isClickable;
        if (cursorRef.current && ringRef.current) {
          if (isClickable) {
            cursorRef.current.style.width = '8px';
            cursorRef.current.style.height = '8px';
            ringRef.current.style.width = '44px';
            ringRef.current.style.height = '44px';
            ringRef.current.style.borderWidth = '2px';
          } else {
            cursorRef.current.style.width = '10px';
            cursorRef.current.style.height = '10px';
            ringRef.current.style.width = '32px';
            ringRef.current.style.height = '32px';
            ringRef.current.style.borderWidth = '1.5px';
          }
        }
      }
    };

    const handleMouseDown = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -50%) scale(0.8)`;
      }
    };

    const handleMouseUp = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -50%) scale(1)`;
      }
    };

    document.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseover', handlePointerChange, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: true });

    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    style.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handlePointerChange);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const existingStyle = document.getElementById('custom-cursor-style');
      if (existingStyle) existingStyle.remove();
    };
  }, [updateCursor]);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  
  if (prefersReducedMotion || isTouchDevice) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-primary mix-blend-difference"
        style={{
          width: '10px',
          height: '10px',
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          transition: 'width 0.15s ease, height 0.15s ease',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border-primary/60"
        style={{
          width: '32px',
          height: '32px',
          borderWidth: '1.5px',
          borderStyle: 'solid',
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          transition: 'width 0.2s ease, height 0.2s ease, border-width 0.2s ease',
          willChange: 'transform',
        }}
      />
    </>
  );
}
