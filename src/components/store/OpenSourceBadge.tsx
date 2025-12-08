import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OpenSourceBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function OpenSourceBadge({
  size = "sm",
  className
}: OpenSourceBadgeProps) {
  const sizeMap = {
    sm: { icon: 10, text: "text-xs px-2 py-0.5" },
    md: { icon: 12, text: "text-sm px-2.5 py-1" },
    lg: { icon: 14, text: "text-base px-3 py-1.5" }
  };

  const { icon: iconSize, text: textClass } = sizeMap[size];

  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-medium",
      "bg-green-100 text-green-700 border border-green-200",
      textClass,
      className
    )}>
      <Code2 size={iconSize} />
      Open Source
    </span>
  );
}
