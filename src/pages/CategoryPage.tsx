import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
import { CategoryChips } from "@/components/store/CategoryChips";
import { StorePluginCard } from "@/components/store/StorePluginCard";
import { SEO } from "@/components/SEO";
import { getCategoryColor, getPluginsByCategory, getAllCategories, sortPlugins } from "@/utils/pluginUtils";
import pluginsData from "@/data/plugins.json";

type SortOption = 'downloads' | 'rating' | 'updated' | 'name';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortOption>('downloads');

  // Extract plugins from the JSON data
  const plugins: Plugin[] = pluginsData.value || [];

  // Get all categories
  const allCategories = useMemo(() => getAllCategories(plugins), [plugins]);

  // Decode category name
  const categoryName = categoryId ? decodeURIComponent(categoryId) : '';

  // Get plugins in this category
  const categoryPlugins = useMemo(() => {
    if (!categoryName) return [];
    return sortPlugins(getPluginsByCategory(plugins, categoryName), sortBy);
  }, [plugins, categoryName, sortBy]);

  if (!categoryName || !allCategories.includes(categoryName)) {
    return (
      <StoreLayout plugins={plugins} showHero={false}>
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📁</div>
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The category you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/store')}>
            Back to Store
          </Button>
        </div>
      </StoreLayout>
    );
  }

  const title = `${categoryName} Plugins`;
  const description = `Browse ${categoryPlugins.length} ${categoryName} plugin${categoryPlugins.length !== 1 ? 's' : ''} for XrmToolBox. Power Platform and Dynamics 365 development tools.`;
  const canonical = `/store/category/${encodeURIComponent(categoryName)}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Store',
        item: 'https://xrm.jukkan.com/store'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${categoryName} Plugins`,
        item: `https://xrm.jukkan.com${canonical}`
      }
    ]
  };

  return (
    <StoreLayout plugins={plugins} showHero={false}>
      <SEO
        title={title}
        description={description}
        keywords={`${categoryName}, XrmToolBox plugins, Power Platform, Dynamics 365, Dataverse`}
        canonical={canonical}
        structuredData={breadcrumbSchema}
      />
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(categoryName)}`}>
                {categoryName}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {categoryName} Plugins
            </h1>
            <p className="text-muted-foreground mt-1">
              {categoryPlugins.length} plugin{categoryPlugins.length !== 1 ? 's' : ''}
            </p>
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

        {/* Category chips */}
        <CategoryChips categories={allCategories} selectedCategory={categoryName} />

        {/* Plugin grid */}
        {categoryPlugins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryPlugins.map((plugin) => (
              <StorePluginCard key={plugin.mctools_pluginid} plugin={plugin} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No plugins found</h3>
            <p className="text-muted-foreground">
              No plugins are currently available in this category.
            </p>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
