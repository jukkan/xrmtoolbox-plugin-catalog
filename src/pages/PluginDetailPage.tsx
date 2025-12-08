import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Github,
  Globe,
  Calendar,
  Tag,
  Package,
  Code2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plugin } from "@/components/PluginCard";
import { StoreLayout } from "@/components/store/StoreLayout";
import { PluginCarousel } from "@/components/store/PluginCarousel";
import { RatingStars } from "@/components/store/RatingStars";
import { AuthorBadge } from "@/components/store/AuthorBadge";
import { CategoryBadge } from "@/components/store/CategoryBadge";
import { OpenSourceBadge } from "@/components/store/OpenSourceBadge";
import {
  parseCategories,
  formatDownloadsFull,
  formatFullDate,
  findPluginByNugetId,
  getPluginsByAuthor,
  getSimilarPlugins
} from "@/utils/pluginUtils";
import pluginsData from "@/data/plugins.json";

export function PluginDetailPage() {
  const { nugetId } = useParams<{ nugetId: string }>();
  const navigate = useNavigate();

  // Extract plugins from the JSON data
  const plugins: Plugin[] = pluginsData.value || [];

  // Find the plugin
  const plugin = useMemo(() => {
    if (!nugetId) return null;
    return findPluginByNugetId(plugins, decodeURIComponent(nugetId));
  }, [plugins, nugetId]);

  // Get more from author
  const moreFromAuthor = useMemo(() => {
    if (!plugin) return [];
    return getPluginsByAuthor(plugins, plugin.mctools_authors)
      .filter(p => p.mctools_pluginid !== plugin.mctools_pluginid)
      .slice(0, 6);
  }, [plugins, plugin]);

  // Get similar plugins
  const similarPlugins = useMemo(() => {
    if (!plugin) return [];
    return getSimilarPlugins(plugins, plugin, 6);
  }, [plugins, plugin]);

  if (!plugin) {
    return (
      <StoreLayout plugins={plugins} showHero={false}>
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">Plugin Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The plugin you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/store">
            <Button>Back to Store</Button>
          </Link>
        </div>
      </StoreLayout>
    );
  }

  const categories = parseCategories(plugin.mctools_categorieslist);
  const rating = parseFloat(plugin.mctools_averagefeedbackratingallversions) || 0;
  const ratingCount = (plugin as any).mctools_totalfeedbackallversion || 0;
  const isMvp = (plugin as any)['contact-mctools_ismvp'] || false;
  const xrmVersion = (plugin as any).mctools_xrmtoolboxversiondependency || null;

  const isGitHubUrl = (url: string) => url?.toLowerCase().includes('github.com');

  return (
    <StoreLayout plugins={plugins} showHero={false}>
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>

        {/* Header section */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Plugin Logo */}
          <div className="shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg">
              {plugin.mctools_logourl ? (
                <img
                  src={plugin.mctools_logourl}
                  alt={`${plugin.mctools_name} logo`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-4xl font-bold text-primary">
                  {plugin.mctools_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Plugin Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-bold">
                {plugin.mctools_name}
              </h1>
              <span className="shrink-0 px-3 py-1 bg-muted rounded-full text-sm font-medium">
                v{plugin.mctools_version}
              </span>
            </div>

            <div className="mt-2">
              <AuthorBadge
                name={plugin.mctools_authors}
                isMvp={isMvp}
                showIcon={true}
                size="md"
                onClick={() => navigate(`/store/author/${encodeURIComponent(plugin.mctools_authors)}`)}
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4">
              <RatingStars rating={rating} count={ratingCount} size="md" />
              <span className="text-muted-foreground">·</span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Download size={16} />
                <span>{formatDownloadsFull(plugin.mctools_totaldownloadcount)} downloads</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="rounded-full"
                onClick={() => window.open(plugin.mctools_downloadurl, '_blank')}
              >
                <Download size={18} className="mr-2" />
                Download from NuGet
              </Button>
              {plugin.mctools_projecturl && (
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                  onClick={() => window.open(plugin.mctools_projecturl, '_blank')}
                >
                  {isGitHubUrl(plugin.mctools_projecturl) ? (
                    <>
                      <Github size={18} className="mr-2" />
                      View Source
                    </>
                  ) : (
                    <>
                      <Globe size={18} className="mr-2" />
                      Project Website
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Description */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Description</h2>
          <p className="text-muted-foreground leading-relaxed">
            {plugin.mctools_description}
          </p>
        </section>

        <Separator className="my-8" />

        {/* Information */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Categories */}
            <div className="flex items-start gap-3">
              <Tag size={18} className="text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground mb-1">Categories</div>
                <div className="flex flex-wrap gap-1">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <CategoryBadge
                        key={cat}
                        category={cat}
                        size="sm"
                        onClick={() => navigate(`/store/category/${encodeURIComponent(cat)}`)}
                      />
                    ))
                  ) : (
                    <span className="text-muted-foreground">Uncategorized</span>
                  )}
                </div>
              </div>
            </div>

            {/* First Released */}
            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground mb-1">First Released</div>
                <div>{formatFullDate(plugin.mctools_firstreleasedate)}</div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-start gap-3">
              <Clock size={18} className="text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                <div>{formatFullDate(plugin.mctools_latestreleasedate)}</div>
              </div>
            </div>

            {/* XrmToolBox Version */}
            {xrmVersion && (
              <div className="flex items-start gap-3">
                <Package size={18} className="text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">XrmToolBox</div>
                  <div>Requires v{xrmVersion}+</div>
                </div>
              </div>
            )}

            {/* License */}
            <div className="flex items-start gap-3">
              <Code2 size={18} className="text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground mb-1">License</div>
                <div className="flex items-center gap-2">
                  {plugin.mctools_isopensource ? (
                    <OpenSourceBadge size="sm" />
                  ) : (
                    <span>Proprietary</span>
                  )}
                </div>
              </div>
            </div>

            {/* NuGet ID */}
            <div className="flex items-start gap-3">
              <ExternalLink size={18} className="text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground mb-1">NuGet Package</div>
                <div className="font-mono text-sm">{(plugin as any).mctools_nugetid}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Release Notes */}
        {plugin.mctools_latestreleasenote && (
          <>
            <Separator className="my-8" />
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">What's New</h2>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">
                  v{plugin.mctools_version} Release Notes
                </div>
                <p className="text-foreground whitespace-pre-line">
                  {plugin.mctools_latestreleasenote}
                </p>
              </div>
            </section>
          </>
        )}

        {/* More from Author */}
        {moreFromAuthor.length > 0 && (
          <>
            <Separator className="my-8" />
            <PluginCarousel
              title={`More from ${plugin.mctools_authors}`}
              plugins={moreFromAuthor}
              seeAllLink={`/store/author/${encodeURIComponent(plugin.mctools_authors)}`}
            />
          </>
        )}

        {/* Similar Plugins */}
        {similarPlugins.length > 0 && (
          <>
            <Separator className="my-8" />
            <PluginCarousel
              title="Similar Plugins"
              plugins={similarPlugins}
            />
          </>
        )}
      </div>
    </StoreLayout>
  );
}
