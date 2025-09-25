import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
}

export const StarRating = ({ rating, size = 16 }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {/* Full stars */}
      {Array(fullStars).fill(0).map((_, i) => (
        <Star 
          key={`full-${i}`} 
          size={size} 
          className="fill-warning text-warning" 
        />
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <StarHalf 
          size={size} 
          className="fill-warning text-warning" 
        />
      )}
      
      {/* Empty stars */}
      {Array(emptyStars).fill(0).map((_, i) => (
        <Star 
          key={`empty-${i}`} 
          size={size} 
          className="text-muted-foreground" 
        />
      ))}
      
      <span className="ml-1 text-sm text-muted-foreground">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
};