import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDownloads } from "@/utils/pluginUtils";

interface DownloadBadgeProps {
  count: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function DownloadBadge({
  count,
  showIcon = true,
  size = "sm",
  className
}: DownloadBadgeProps) {
  const sizeMap = {
    sm: { icon: 12, text: "text-xs" },
    md: { icon: 14, text: "text-sm" },
    lg: { icon: 16, text: "text-base" }
  };

  const { icon: iconSize, text: textSize } = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-1 text-muted-foreground", textSize, className)}>
      {showIcon && <Download size={iconSize} className="text-muted-foreground/70" />}
      <span>{formatDownloads(count)}</span>
    </div>
  );
}
