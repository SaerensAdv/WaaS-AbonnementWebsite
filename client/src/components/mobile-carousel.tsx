import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

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
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none md:hidden" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none md:hidden" />
      
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
  return (
    <>
      <div className="hidden md:block">{children}</div>
      <div className="md:hidden">
        <MobileCarousel showDots={showDots} itemClassName={itemClassName}>
          {mobileChildren}
        </MobileCarousel>
      </div>
    </>
  );
}
