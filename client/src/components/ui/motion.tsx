import { motion, useSpring, useInView as framerUseInView, Variants } from "framer-motion";
import { useRef, ReactNode, useState, useEffect, RefObject } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 768;
    return isMobileUA && isSmallScreen;
  });
  
  useEffect(() => {
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const checkMobile = () => {
      setIsMobile(isMobileUA && window.innerWidth < 768);
    };
    
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handler = () => {
      setIsMobile(isMobileUA && mediaQuery.matches);
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handler);
    }
    
    checkMobile();
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handler);
      }
    };
  }, []);
  
  return isMobile;
}

function useMobileInView(ref: RefObject<Element | null>, once: boolean = true) {
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [ref, once]);
  
  return isInView;
}

function useInViewDesktopOnly(
  ref: RefObject<Element | null>,
  options: { once?: boolean; amount?: number },
  isMobile: boolean
) {
  const isInView = framerUseInView(ref, isMobile ? { once: true, amount: 0 } : options);
  return isMobile ? true : isInView;
}

const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

const easing = [0.25, 0.1, 0.25, 1];

export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: easing,
    }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easing,
    }
  }
};

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easing,
    }
  }
};

export const slideInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -40,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: easing,
    }
  }
};

export const slideInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 40,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: easing,
    }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: easing,
    }
  }
};

interface MotionDivProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  once?: boolean;
  amount?: number;
}

export function FadeInUp({ 
  children, 
  className = "", 
  delay = 0,
  once = true,
  amount = 0.3,
}: MotionDivProps) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInViewDesktopOnly(ref, { once, amount }, isMobile);
  const mobileInView = useMobileInView(ref, once);
  
  if (isMobile) {
    return (
      <div 
        ref={ref}
        className={`${className} ${mobileInView ? 'animate-fade-in-up' : 'opacity-0'}`}
        style={{ animationDelay: `${delay}s` }}
      >
        {children}
      </div>
    );
  }
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.6,
            delay,
            ease: easing,
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ 
  children, 
  className = "", 
  delay = 0,
  once = true,
  amount = 0.3,
}: MotionDivProps) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInViewDesktopOnly(ref, { once, amount }, isMobile);
  const mobileInView = useMobileInView(ref, once);
  
  if (isMobile) {
    return (
      <div 
        ref={ref}
        className={`${className} ${mobileInView ? 'animate-fade-in' : 'opacity-0'}`}
        style={{ animationDelay: `${delay}s` }}
      >
        {children}
      </div>
    );
  }
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: {
            duration: 0.5,
            delay,
            ease: easing,
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ 
  children, 
  className = "", 
  delay = 0,
  once = true,
  amount = 0.3,
}: MotionDivProps) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInViewDesktopOnly(ref, { once, amount }, isMobile);
  const mobileInView = useMobileInView(ref, once);
  
  if (isMobile) {
    return (
      <div 
        ref={ref}
        className={`${className} ${mobileInView ? 'animate-fade-in' : 'opacity-0'}`}
        style={{ animationDelay: `${delay}s` }}
      >
        {children}
      </div>
    );
  }
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
          opacity: 1, 
          scale: 1,
          transition: {
            duration: 0.5,
            delay,
            ease: easing,
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({ 
  children, 
  className = "", 
  delay = 0,
  direction = "left",
  once = true,
  amount = 0.3,
}: MotionDivProps & { direction?: "left" | "right" }) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInViewDesktopOnly(ref, { once, amount }, isMobile);
  const mobileInView = useMobileInView(ref, once);
  const x = direction === "left" ? -40 : 40;
  
  if (isMobile) {
    const animClass = direction === "left" ? "animate-slide-in-left" : "animate-slide-in-right";
    return (
      <div 
        ref={ref}
        className={`${className} ${mobileInView ? animClass : 'opacity-0'}`}
        style={{ animationDelay: `${delay}s` }}
      >
        {children}
      </div>
    );
  }
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, x },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: {
            duration: 0.6,
            delay,
            ease: easing,
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  amount?: number;
}

export function StaggerChildren({ 
  children, 
  className = "",
  staggerDelay = 0.1,
  once = true,
  amount = 0.2,
}: StaggerChildrenProps) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInViewDesktopOnly(ref, { once, amount }, isMobile);
  const mobileInView = useMobileInView(ref, once);
  
  if (isMobile) {
    return (
      <div 
        ref={ref}
        className={`${className} ${mobileInView ? 'animate-fade-in' : 'opacity-0'}`}
      >
        {children}
      </div>
    );
  }
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ 
  children, 
  className = "",
}: { children: ReactNode; className?: string }) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const mobileInView = useMobileInView(ref, true);
  
  if (isMobile) {
    return (
      <div 
        ref={ref}
        className={`${className} ${mobileInView ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        {children}
      </div>
    );
  }
  
  return (
    <motion.div
      variants={staggerItem}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

export function Parallax({ 
  children, 
  className = "",
  speed = 0.5,
  direction = "up"
}: ParallaxProps) {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <div className={className}>{children}</div>;
  }
  
  const factor = direction === "up" ? -1 : 1;
  const distance = 10 * speed;
  
  return (
    <motion.div
      initial={{ y: distance * factor }}
      whileInView={{ y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FloatProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
  delay?: number;
}

export function Float({ 
  children, 
  className = "",
  duration = 4,
  distance = 10,
  delay = 0
}: FloatProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  if (prefersReducedMotion || isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{
        y: [-distance, distance, -distance],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface GlowPulseProps {
  children?: ReactNode;
  className?: string;
  color?: string;
}

export function GlowPulse({ 
  children, 
  className = "",
}: GlowPulseProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  if (isMobile) {
    return null;
  }

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{
        opacity: [0.5, 0.8, 0.5],
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export function CountUp({ 
  end, 
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
  decimals = 0
}: CountUpProps) {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const isInView = useInViewDesktopOnly(ref, { once: true, amount: 0.5 }, isMobile);
  const count = useSpring(0, { duration: duration * 1000 });
  
  if (isMobile) {
    return (
      <span className={className}>
        {prefix}{end.toFixed(decimals)}{suffix}
      </span>
    );
  }
  
  if (isInView) {
    count.set(end);
  }
  
  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      <motion.span>
        {count.get().toFixed(decimals)}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ 
  children, 
  className = "",
  delay = 0
}: TextRevealProps) {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const isInView = useInViewDesktopOnly(ref, { once: true, amount: 0.5 }, isMobile);
  
  if (isMobile) {
    return <span className={className}>{children}</span>;
  }
  
  const words = children.split(" ");
  
  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay,
          }
        }
      }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.4,
                ease: easing,
              }
            }
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

interface SmoothScrollLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  offset?: number;
}

export function SmoothScrollLink({ 
  href, 
  children, 
  className = "",
  offset = 80
}: SmoothScrollLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };
  
  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

interface BlurInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  amount?: number;
}

export function BlurIn({ 
  children, 
  className = "", 
  delay = 0,
  once = true,
  amount = 0.3,
}: BlurInProps) {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const isInView = useInViewDesktopOnly(ref, { once, amount }, isMobile);
  
  if (isMobile) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { 
          opacity: 0, 
          filter: "blur(10px)",
          y: 20 
        },
        visible: { 
          opacity: 1, 
          filter: "blur(0px)",
          y: 0,
          transition: {
            duration: 0.7,
            delay,
            ease: easing,
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export { motion };
