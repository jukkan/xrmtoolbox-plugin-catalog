import { cn } from "@/lib/utils";
import { getCategoryColor } from "@/utils/pluginUtils";

interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
}

export function CategoryBadge({
  category,
  size = "sm",
  onClick,
  className
}: CategoryBadgeProps) {
  const sizeMap = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5"
  };

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-colors",
        getCategoryColor(category),
        sizeMap[size],
        onClick && "hover:opacity-80 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {category}
    </Component>
  );
}
