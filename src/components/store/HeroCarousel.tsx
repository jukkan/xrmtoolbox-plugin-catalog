import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plugin } from "@/components/PluginCard";
import { StorePluginCardLarge } from "./StorePluginCardLarge";

interface HeroCarouselProps {
  plugins: Plugin[];
  autoRotate?: boolean;
  rotateInterval?: number;
  className?: string;
}

export function HeroCarousel({
  plugins,
  autoRotate = true,
  rotateInterval = 5000,
  className
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? plugins.length - 1 : prev - 1
    );
  }, [plugins.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === plugins.length - 1 ? 0 : prev + 1
    );
  }, [plugins.length]);

  // Auto-rotate
  useEffect(() => {
    if (!autoRotate || isPaused || plugins.length <= 1) return;

    const interval = setInterval(goToNext, rotateInterval);
    return () => clearInterval(interval);
  }, [autoRotate, isPaused, plugins.length, rotateInterval, goToNext]);

  if (plugins.length === 0) return null;

  return (
    <section
      className={cn("relative", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel container */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {plugins.map((plugin) => (
            <div
              key={plugin.mctools_pluginid}
              className="w-full shrink-0"
            >
              <StorePluginCardLarge plugin={plugin} />
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {plugins.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity shadow-lg"
              onClick={goToPrevious}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity shadow-lg"
              onClick={goToNext}
            >
              <ChevronRight size={20} />
            </Button>
          </>
        )}
      </div>

      {/* Dots navigation */}
      {plugins.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {plugins.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
