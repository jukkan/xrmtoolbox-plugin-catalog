import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Plugin } from "@/components/PluginCard";
import { StoreLayout } from "@/components/store/StoreLayout";
import { HeroCarousel } from "@/components/store/HeroCarousel";
import { PluginCarousel } from "@/components/store/PluginCarousel";
import { CategoryChips } from "@/components/store/CategoryChips";
import { StorePluginCard } from "@/components/store/StorePluginCard";
import { SEO } from "@/components/SEO";
import {
  getAllCategories,
  getFeaturedPlugins,
  getRecentlyUpdated,
  getMostPopular,
  getTopRated,
  getMvpPlugins,
  filterPlugins
} from "@/utils/pluginUtils";
import pluginsData from "@/data/plugins.json";

export function StorePage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // Extract plugins from the JSON data
  const plugins: Plugin[] = pluginsData.value || [];

  // Get all unique categories
  const allCategories = useMemo(() => getAllCategories(plugins), [plugins]);

  // Get featured plugins for hero
  const featuredPlugins = useMemo(() => getFeaturedPlugins(plugins, 5), [plugins]);

  // Get new & updated plugins (within last 60 days)
  const newAndUpdated = useMemo(
    () => getRecentlyUpdated(plugins, 60).slice(0, 15),
    [plugins]
  );

  // Get most popular plugins
  const mostPopular = useMemo(
    () => getMostPopular(plugins).slice(0, 15),
    [plugins]
  );

  // Get top rated plugins
  const topRated = useMemo(
    () => getTopRated(plugins, 3).slice(0, 15),
    [plugins]
  );

  // Get MVP developer plugins
  const mvpPicks = useMemo(
    () => getMostPopular(getMvpPlugins(plugins)).slice(0, 15),
    [plugins]
  );

  // Search results (if searching)
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return filterPlugins(plugins, { search: searchQuery });
  }, [plugins, searchQuery]);

  // If searching, show search results
  if (searchQuery) {
    const searchTitle = `Search: ${searchQuery}`;
    const searchDescription = `Found ${searchResults.length} XrmToolBox plugin${searchResults.length !== 1 ? 's' : ''} matching "${searchQuery}". Browse tools for Microsoft Power Platform and Dynamics 365.`;

    return (
      <StoreLayout plugins={plugins} showHero={false}>
        <SEO
          title={searchTitle}
          description={searchDescription}
          canonical={`/store?search=${encodeURIComponent(searchQuery)}`}
        />
        <div className="space-y-6">
          {/* Search results header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Search results for "{searchQuery}"
            </h1>
            <p className="text-muted-foreground mt-1">
              {searchResults.length} plugin{searchResults.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Category chips */}
          <CategoryChips categories={allCategories} />

          {/* Results grid */}
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchResults.map((plugin) => (
                <StorePluginCard key={plugin.mctools_pluginid} plugin={plugin} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No plugins found</h3>
              <p className="text-muted-foreground">
                Try different search terms or browse categories below
              </p>
            </div>
          )}
        </div>
      </StoreLayout>
    );
  }

  // Default store home view
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'XrmToolBox Plugin Catalog',
    description: 'Discover and explore XrmToolBox plugins for Microsoft Power Platform development and administration',
    url: 'https://xrm.jukkan.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://xrm.jukkan.com/store?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'XrmToolBox Community',
      url: 'https://www.xrmtoolbox.com'
    }
  };

  return (
    <StoreLayout
      plugins={plugins}
      showHero={true}
    >
      <SEO
        title="XrmToolBox Plugin Catalog - Power Platform Tools"
        description={`Discover and explore ${plugins.length}+ XrmToolBox plugins for Microsoft Power Platform development and administration. Browse tools for Dynamics 365 and Dataverse.`}
        canonical="/store"
        structuredData={organizationSchema}
      />
      <div className="space-y-12">
        {/* Category Quick Access */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Browse Categories</h2>
          <CategoryChips categories={allCategories} />
        </section>

        {/* New & Updated */}
        <PluginCarousel
          title="New & Updated"
          plugins={newAndUpdated}
          seeAllLink="/store/charts?sort=updated"
        />

        {/* Most Popular */}
        <PluginCarousel
          title="Most Popular"
          plugins={mostPopular}
          seeAllLink="/store/charts?sort=downloads"
        />

        {/* Top Rated */}
        <PluginCarousel
          title="Top Rated"
          plugins={topRated}
          seeAllLink="/store/charts?sort=rating"
        />

        {/* Featured Plugins */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Featured</h2>
          <HeroCarousel plugins={featuredPlugins} />
        </section>

        {/* MVP Developer Picks */}
        {mvpPicks.length > 0 && (
          <PluginCarousel
            title="MVP Developer Picks"
            plugins={mvpPicks}
          />
        )}
      </div>
    </StoreLayout>
  );
}
