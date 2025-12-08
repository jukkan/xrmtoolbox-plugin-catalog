import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  count?: number;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RatingStars({
  rating,
  count,
  showValue = true,
  size = "sm",
  className
}: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeMap = {
    sm: { icon: 12, text: "text-xs" },
    md: { icon: 14, text: "text-sm" },
    lg: { icon: 16, text: "text-base" }
  };

  const { icon: iconSize, text: textSize } = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={iconSize}
            className="fill-amber-400 text-amber-400"
          />
        ))}
        {hasHalfStar && (
          <StarHalf
            size={iconSize}
            className="fill-amber-400 text-amber-400"
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={iconSize}
            className="text-gray-300"
          />
        ))}
      </div>
      {showValue && (
        <span className={cn("text-muted-foreground", textSize)}>
          {rating > 0 ? rating.toFixed(1) : "No ratings"}
          {count !== undefined && count > 0 && (
            <span className="text-muted-foreground/60"> ({count})</span>
          )}
        </span>
      )}
    </div>
  );
}
