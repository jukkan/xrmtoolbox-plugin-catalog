import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Download, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plugin } from "@/components/PluginCard";
import { StoreLayout } from "@/components/store/StoreLayout";
import { StorePluginCard } from "@/components/store/StorePluginCard";
import { SEO } from "@/components/SEO";
import { getMostPopular, getTopRated, getRecentlyUpdated, sortPlugins } from "@/utils/pluginUtils";
import pluginsData from "@/data/plugins.json";

export function ChartsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get('sort') || 'downloads';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Extract plugins from the JSON data
  const plugins: Plugin[] = pluginsData.value || [];

  // Get plugins for each chart
  const mostPopular = useMemo(() => getMostPopular(plugins).slice(0, 50), [plugins]);
  const topRated = useMemo(() => getTopRated(plugins, 3).slice(0, 50), [plugins]);
  const recentlyUpdated = useMemo(() => getRecentlyUpdated(plugins, 90).slice(0, 50), [plugins]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ sort: value });
  };

  const renderPluginList = (pluginList: Plugin[], showRank: boolean = true) => (
    <div className="space-y-3">
      {pluginList.map((plugin, index) => (
        <div key={plugin.mctools_pluginid} className="flex items-start gap-4">
          {showRank && (
            <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-muted font-bold text-sm">
              {index + 1}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <StorePluginCard plugin={plugin} variant="compact" />
          </div>
        </div>
      ))}
    </div>
  );

  const chartTitles: Record<string, string> = {
    downloads: 'Most Downloaded Plugins',
    rating: 'Top Rated Plugins',
    updated: 'Recently Updated Plugins'
  };

  const chartDescriptions: Record<string, string> = {
    downloads: 'Discover the top 50 most downloaded XrmToolBox plugins for Microsoft Power Platform and Dynamics 365.',
    rating: 'Browse the highest-rated XrmToolBox plugins based on community feedback. Power Platform development tools.',
    updated: 'Check out recently updated XrmToolBox plugins with the latest features and improvements.'
  };

  const title = chartTitles[activeTab] || 'Top Charts';
  const description = chartDescriptions[activeTab] || 'Discover the most popular and highest-rated XrmToolBox plugins for Power Platform.';

  return (
    <StoreLayout plugins={plugins} showHero={false}>
      <SEO
        title={title}
        description={description}
        keywords="XrmToolBox charts, most popular plugins, top rated, recently updated, Power Platform, Dynamics 365"
        canonical={`/store/charts${activeTab !== 'downloads' ? `?sort=${activeTab}` : ''}`}
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
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={24} className="text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">Top Charts</h1>
          </div>
          <p className="text-muted-foreground">
            Discover the most popular and highest-rated plugins
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="downloads" className="flex items-center gap-2">
              <Download size={14} />
              <span className="hidden sm:inline">Downloads</span>
            </TabsTrigger>
            <TabsTrigger value="rating" className="flex items-center gap-2">
              <Star size={14} />
              <span className="hidden sm:inline">Top Rated</span>
            </TabsTrigger>
            <TabsTrigger value="updated" className="flex items-center gap-2">
              <Clock size={14} />
              <span className="hidden sm:inline">Updated</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="downloads" className="mt-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Most Downloaded</h2>
              <p className="text-sm text-muted-foreground">Top 50 plugins by total downloads</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mostPopular.map((plugin, index) => (
                <div key={plugin.mctools_pluginid} className="flex items-start gap-3">
                  <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full font-bold text-sm ${
                    index < 3 ? 'bg-amber-100 text-amber-700' : 'bg-muted'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <StorePluginCard plugin={plugin} variant="compact" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rating" className="mt-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Top Rated</h2>
              <p className="text-sm text-muted-foreground">Highest rated plugins with 3+ ratings</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topRated.map((plugin, index) => (
                <div key={plugin.mctools_pluginid} className="flex items-start gap-3">
                  <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full font-bold text-sm ${
                    index < 3 ? 'bg-amber-100 text-amber-700' : 'bg-muted'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <StorePluginCard plugin={plugin} variant="compact" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="updated" className="mt-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Recently Updated</h2>
              <p className="text-sm text-muted-foreground">Plugins updated in the last 90 days</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentlyUpdated.map((plugin, index) => (
                <div key={plugin.mctools_pluginid} className="flex items-start gap-3">
                  <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-muted font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <StorePluginCard plugin={plugin} variant="compact" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </StoreLayout>
  );
}
