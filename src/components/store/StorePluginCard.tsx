import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Plugin } from "@/components/PluginCard";
import { RatingStars } from "./RatingStars";
import { DownloadBadge } from "./DownloadBadge";
import { AuthorBadge } from "./AuthorBadge";
import { CategoryBadge } from "./CategoryBadge";
import { OpenSourceBadge } from "./OpenSourceBadge";
import { parseCategories, formatRelativeDate } from "@/utils/pluginUtils";

interface StorePluginCardProps {
  plugin: Plugin;
  variant?: "standard" | "compact";
  className?: string;
}

export function StorePluginCard({
  plugin,
  variant = "standard",
  className
}: StorePluginCardProps) {
  const categories = parseCategories(plugin.mctools_categorieslist);
  const rating = parseFloat(plugin.mctools_averagefeedbackratingallversions) || 0;
  const ratingCount = (plugin as any).mctools_totalfeedbackallversion || 0;
  const isMvp = (plugin as any)['contact-mctools_ismvp'] || false;
  const nugetId = (plugin as any).mctools_nugetid || plugin.mctools_pluginid;

  return (
    <Link
      to={`/store/plugin/${encodeURIComponent(nugetId)}`}
      className={cn(
        "group block bg-card rounded-xl border border-border/50 overflow-hidden",
        "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-border",
        variant === "standard" ? "p-4" : "p-3",
        className
      )}
    >
      {/* Header with logo and basic info */}
      <div className="flex gap-3">
        {/* Plugin Logo */}
        <div className={cn(
          "shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5",
          "flex items-center justify-center",
          variant === "standard" ? "w-14 h-14" : "w-12 h-12"
        )}>
          {plugin.mctools_logourl ? (
            <img
              src={plugin.mctools_logourl}
              alt={`${plugin.mctools_name} logo`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <span className={cn(
            "text-primary font-bold",
            plugin.mctools_logourl && "hidden",
            variant === "standard" ? "text-xl" : "text-lg"
          )}>
            {plugin.mctools_name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Title and Author */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors",
            variant === "standard" ? "text-base" : "text-sm"
          )}>
            {plugin.mctools_name}
          </h3>
          <AuthorBadge
            name={plugin.mctools_authors}
            isMvp={isMvp}
            showIcon={false}
            size="sm"
          />
          <div className="mt-1">
            <RatingStars rating={rating} count={ratingCount} size="sm" />
          </div>
        </div>
      </div>

      {/* Description */}
      {variant === "standard" && (
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {plugin.mctools_description}
        </p>
      )}

      {/* Categories */}
      <div className="mt-3 flex flex-wrap gap-1">
        {categories.slice(0, 2).map((category) => (
          <CategoryBadge key={category} category={category} size="sm" />
        ))}
        {plugin.mctools_isopensource && <OpenSourceBadge size="sm" />}
        {categories.length > 2 && (
          <span className="text-xs text-muted-foreground px-2 py-0.5">
            +{categories.length - 2}
          </span>
        )}
      </div>

      {/* Footer stats */}
      <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
        <DownloadBadge count={plugin.mctools_totaldownloadcount} size="sm" />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar size={12} />
          <span>{formatRelativeDate(plugin.mctools_latestreleasedate)}</span>
        </div>
      </div>
    </Link>
  );
}
