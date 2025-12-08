import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plugin } from "@/components/PluginCard";
import { RatingStars } from "./RatingStars";
import { DownloadBadge } from "./DownloadBadge";
import { AuthorBadge } from "./AuthorBadge";
import { CategoryBadge } from "./CategoryBadge";
import { OpenSourceBadge } from "./OpenSourceBadge";
import { parseCategories, getCategoryGradient } from "@/utils/pluginUtils";

interface StorePluginCardLargeProps {
  plugin: Plugin;
  className?: string;
}

export function StorePluginCardLarge({
  plugin,
  className
}: StorePluginCardLargeProps) {
  const categories = parseCategories(plugin.mctools_categorieslist);
  const rating = parseFloat(plugin.mctools_averagefeedbackratingallversions) || 0;
  const ratingCount = (plugin as any).mctools_totalfeedbackallversion || 0;
  const isMvp = (plugin as any)['contact-mctools_ismvp'] || false;
  const nugetId = (plugin as any).mctools_nugetid || plugin.mctools_pluginid;
  const gradient = getCategoryGradient(categories);

  return (
    <div
      className={cn(
        "group relative bg-card rounded-2xl border border-border/50 overflow-hidden",
        "transition-all duration-300 hover:shadow-xl hover:border-border",
        className
      )}
    >
      {/* Gradient background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50",
        gradient
      )} />

      {/* Content */}
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Plugin Logo */}
          <div className="shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-white shadow-lg flex items-center justify-center">
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
                "text-3xl font-bold text-primary",
                plugin.mctools_logourl && "hidden"
              )}>
                {plugin.mctools_name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
              {plugin.mctools_name}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <AuthorBadge
                name={plugin.mctools_authors}
                isMvp={isMvp}
                showIcon={true}
                size="md"
              />
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4">
              <RatingStars rating={rating} count={ratingCount} size="md" />
              <span className="text-muted-foreground">·</span>
              <DownloadBadge count={plugin.mctools_totaldownloadcount} size="md" />
            </div>

            <p className="mt-4 text-muted-foreground line-clamp-3 md:line-clamp-2">
              {plugin.mctools_description}
            </p>

            {/* Categories */}
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.slice(0, 3).map((category) => (
                <CategoryBadge key={category} category={category} size="md" />
              ))}
              {plugin.mctools_isopensource && <OpenSourceBadge size="md" />}
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              <Link to={`/store/plugin/${encodeURIComponent(nugetId)}`}>
                <Button size="lg" className="rounded-full px-8">
                  View Plugin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
