import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  className?: string;
}

export function ViewToggle({ className }: ViewToggleProps) {
  const location = useLocation();
  const isStoreView = location.pathname.startsWith('/store') || location.pathname === '/';
  const isFeedView = location.pathname === '/feed';

  return (
    <div className={cn(
      "inline-flex items-center rounded-full bg-muted p-1 gap-1",
      className
    )}>
      <Link
        to="/store"
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
          isStoreView && !isFeedView
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <LayoutGrid size={14} />
        <span className="hidden sm:inline">Store</span>
      </Link>
      <Link
        to="/feed"
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
          isFeedView
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <List size={14} />
        <span className="hidden sm:inline">Feed</span>
      </Link>
    </div>
  );
}
