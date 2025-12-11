import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Plugin } from "@/components/PluginCard";
import { StoreLayout } from "@/components/store/StoreLayout";
import { StorePluginCard } from "@/components/store/StorePluginCard";
import { getPluginsByAuthor, sortPlugins, formatDownloads } from "@/utils/pluginUtils";
import pluginsData from "@/data/plugins.json";

type SortOption = 'downloads' | 'rating' | 'updated' | 'name';

export function AuthorPage() {
  const { authorName } = useParams<{ authorName: string }>();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortOption>('downloads');

  // Extract plugins from the JSON data
  const plugins: Plugin[] = pluginsData.value || [];

  // Decode author name
  const author = authorName ? decodeURIComponent(authorName) : '';

  // Get plugins by this author
  const authorPlugins = useMemo(() => {
    if (!author) return [];
    return sortPlugins(getPluginsByAuthor(plugins, author), sortBy);
  }, [plugins, author, sortBy]);

  // Check if author is MVP
  const isMvp = authorPlugins.length > 0 && (authorPlugins[0] as any)['contact-mctools_ismvp'];

  // Calculate author stats
  const stats = useMemo(() => {
    const totalDownloads = authorPlugins.reduce((sum, p) => sum + p.mctools_totaldownloadcount, 0);
    const ratingsCount = authorPlugins.reduce((sum, p) => sum + ((p as any).mctools_totalfeedbackallversion || 0), 0);

    // Calculate average rating only from plugins that have ratings
    const pluginsWithRatings = authorPlugins.filter(p => {
      const rating = parseFloat(p.mctools_averagefeedbackratingallversions);
      return !isNaN(rating) && rating > 0;
    });

    const avgRating = pluginsWithRatings.length > 0
      ? pluginsWithRatings.reduce((sum, p) => sum + parseFloat(p.mctools_averagefeedbackratingallversions), 0) / pluginsWithRatings.length
      : 0;

    return { totalDownloads, ratingsCount, avgRating };
  }, [authorPlugins]);

  if (!author || authorPlugins.length === 0) {
    return (
      <StoreLayout plugins={plugins} showHero={false}>
        <div className="text-center py-16">
          <div className="text-5xl mb-4">👤</div>
          <h1 className="text-2xl font-bold mb-2">Author Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The author you're looking for doesn't exist or has no plugins.
          </p>
          <Button onClick={() => navigate('/store')}>
            Back to Store
          </Button>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout plugins={plugins} showHero={false}>
      <div className="space-y-6">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            {/* Author name and badge */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{author}</h1>
                  {isMvp && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                      <Award size={12} className="fill-amber-500" />
                      MVP
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {authorPlugins.length} plugin{authorPlugins.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Download size={16} className="text-muted-foreground" />
                <span className="font-medium">{formatDownloads(stats.totalDownloads)}</span>
                <span className="text-muted-foreground">total downloads</span>
              </div>
              {stats.avgRating > 0 && (
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="font-medium">{stats.avgRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">avg rating</span>
                </div>
              )}
            </div>
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="downloads">Most Popular</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="updated">Recently Updated</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Plugin grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {authorPlugins.map((plugin) => (
            <StorePluginCard key={plugin.mctools_pluginid} plugin={plugin} />
          ))}
        </div>
      </div>
    </StoreLayout>
  );
}
