import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      ('ontouchstart' in window);
  });

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        ('ontouchstart' in window)
      );
    };
    
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile('matches' in e ? e.matches : (e as MediaQueryListEvent).matches);
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler as (e: MediaQueryListEvent) => void);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handler as (e: MediaQueryListEvent) => void);
    }
    
    checkMobile();
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler as (e: MediaQueryListEvent) => void);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handler as (e: MediaQueryListEvent) => void);
      }
    };
  }, []);

  return isMobile;
}

interface MobileCarouselProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  showDots?: boolean;
}

export function MobileCarousel({
  children,
  className,
  itemClassName,
  showDots = true,
}: MobileCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {React.Children.map(children, (child, index) => (
            <CarouselItem
              key={index}
              className={cn("pl-4 basis-[85%] sm:basis-[75%]", itemClassName)}
              data-testid={`carousel-item-${index}`}
            >
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {showDots && count > 1 && (
        <div className="flex justify-center gap-1.5 mt-6" data-testid="carousel-dots">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === current
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30"
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Ga naar slide ${index + 1}`}
              data-testid={`carousel-dot-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface MobileCarouselSectionProps {
  children: React.ReactNode;
  mobileChildren: React.ReactNode[];
  showDots?: boolean;
  itemClassName?: string;
}

export function MobileCarouselSection({
  children,
  mobileChildren,
  showDots = true,
  itemClassName,
}: MobileCarouselSectionProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileCarousel showDots={showDots} itemClassName={itemClassName}>
        {mobileChildren}
      </MobileCarousel>
    );
  }

  return <>{children}</>;
}
