import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthorBadgeProps {
  name: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export function AuthorBadge({
  name,
  showIcon = true,
  size = "sm",
  className,
  onClick
}: AuthorBadgeProps) {
  const sizeMap = {
    sm: { icon: 12, text: "text-xs" },
    md: { icon: 14, text: "text-sm" },
    lg: { icon: 16, text: "text-base" }
  };

  const { icon: iconSize, text: textSize } = sizeMap[size];

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
    </Component>
  );
}
