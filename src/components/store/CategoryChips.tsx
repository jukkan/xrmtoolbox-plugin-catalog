import { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategoryColor } from "@/utils/pluginUtils";

interface CategoryChipsProps {
  categories: string[];
  selectedCategory?: string;
  className?: string;
}

export function CategoryChips({
  categories,
  selectedCategory,
  className
}: CategoryChipsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const location = useLocation();

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
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const isStoreHome = location.pathname === '/store' || location.pathname === '/';

  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      {/* Scroll left button */}
      {canScrollLeft && (
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex h-8 w-8 shrink-0"
          onClick={() => scroll('left')}
        >
          <ChevronLeft size={16} />
        </Button>
      )}

      {/* Chips container */}
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-2 overflow-x-auto scroll-smooth",
          "scrollbar-hide -webkit-overflow-scrolling-touch"
        )}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* All category chip */}
        <Link
          to="/store"
          className={cn(
            "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
            "border hover:border-primary/50",
            isStoreHome && !selectedCategory
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border hover:text-foreground"
          )}
        >
          All
        </Link>

        {/* Category chips */}
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <Link
              key={category}
              to={`/store/category/${encodeURIComponent(category)}`}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
                "border hover:opacity-90",
                isSelected
                  ? cn(getCategoryColor(category), "border-transparent")
                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/50"
              )}
            >
              {category}
            </Link>
          );
        })}
      </div>

      {/* Scroll right button */}
      {canScrollRight && (
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex h-8 w-8 shrink-0"
          onClick={() => scroll('right')}
        >
          <ChevronRight size={16} />
        </Button>
      )}
    </div>
  );
}
