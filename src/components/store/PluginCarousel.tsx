import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plugin } from "@/components/PluginCard";
import { StorePluginCard } from "./StorePluginCard";

interface PluginCarouselProps {
  title: string;
  plugins: Plugin[];
  seeAllLink?: string;
  className?: string;
}

export function PluginCarousel({
  title,
  plugins,
  seeAllLink,
  className
}: PluginCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', updateScrollButtons);
      window.addEventListener('resize', updateScrollButtons);
      return () => {
        scrollEl.removeEventListener('scroll', updateScrollButtons);
        window.removeEventListener('resize', updateScrollButtons);
      };
    }
  }, [plugins]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (plugins.length === 0) return null;

  return (
    <section className={cn("relative", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          {seeAllLink && (
            <Link
              to={seeAllLink}
              className="text-sm text-primary hover:text-primary/80 transition-colors font-medium mr-2"
            >
              See All
            </Link>
          )}
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative -mx-4 md:-mx-0">
        <div
          ref={scrollRef}
          className={cn(
            "flex gap-4 overflow-x-auto scroll-smooth px-4 md:px-0",
            "scrollbar-hide snap-x snap-mandatory",
            "-webkit-overflow-scrolling-touch"
          )}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {plugins.map((plugin) => (
            <div
              key={plugin.mctools_pluginid}
              className="shrink-0 snap-start w-[280px] md:w-[300px]"
            >
              <StorePluginCard plugin={plugin} />
            </div>
          ))}
        </div>

        {/* Gradient fade edges */}
        {canScrollLeft && (
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        )}
      </div>
    </section>
  );
}
