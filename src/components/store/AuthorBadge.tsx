import { User, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthorBadgeProps {
  name: string;
  isMvp?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export function AuthorBadge({
  name,
  isMvp = false,
  showIcon = true,
  size = "sm",
  className,
  onClick
}: AuthorBadgeProps) {
  const sizeMap = {
    sm: { icon: 12, text: "text-xs", badge: "text-[10px]" },
    md: { icon: 14, text: "text-sm", badge: "text-xs" },
    lg: { icon: 16, text: "text-base", badge: "text-sm" }
  };

  const { icon: iconSize, text: textSize, badge: badgeSize } = sizeMap[size];

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      className={cn(
        "inline-flex items-center gap-1 text-muted-foreground",
        textSize,
        onClick && "hover:text-foreground transition-colors cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {showIcon && <User size={iconSize} className="text-muted-foreground/70" />}
      <span className="truncate">{name}</span>
      {isMvp && (
        <span className={cn(
          "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-medium",
          "bg-amber-100 text-amber-700 border border-amber-200",
          badgeSize
        )}>
          <Award size={iconSize - 2} className="fill-amber-500" />
          MVP
        </span>
      )}
    </Component>
  );
}
