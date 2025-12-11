import { useState, useMemo } from "react";
import { PluginCard, Plugin } from "@/components/PluginCard";
import { PluginDetails } from "@/components/PluginDetails";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { ViewToggle } from "@/components/store/ViewToggle";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles, HelpCircle, Github } from "lucide-react";
import { Link } from "react-router-dom";
import pluginsData from "@/data/plugins.json";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("downloads");
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);

  // Extract plugins from the JSON data
  const plugins: Plugin[] = pluginsData.value || [];

  // Get all unique categories
  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    plugins.forEach(plugin => {
      if (plugin.mctools_categorieslist) {
        plugin.mctools_categorieslist.split(',').forEach(cat => {
          categorySet.add(cat.trim());
        });
      }
    });
    return Array.from(categorySet).sort();
  }, [plugins]);

  // Filter and sort plugins
  const filteredAndSortedPlugins = useMemo(() => {
    let filtered = plugins.filter(plugin => {
      // Search filter
      const matchesSearch = !searchQuery || 
        plugin.mctools_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.mctools_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.mctools_authors.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        (plugin.mctools_categorieslist && 
         selectedCategories.some(cat => 
           plugin.mctools_categorieslist!.split(',').map(c => c.trim()).includes(cat)
         ));

      return matchesSearch && matchesCategory;
    });

    // Sort plugins
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.mctools_name.localeCompare(b.mctools_name);
        case "downloads":
          return b.mctools_totaldownloadcount - a.mctools_totaldownloadcount;
        case "rating":
          return parseFloat(b.mctools_averagefeedbackratingallversions) - parseFloat(a.mctools_averagefeedbackratingallversions);
        case "updated":
          return new Date(b.mctools_latestreleasedate).getTime() - new Date(a.mctools_latestreleasedate).getTime();
        case "created":
          return new Date(b.mctools_firstreleasedate).getTime() - new Date(a.mctools_firstreleasedate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [plugins, searchQuery, selectedCategories, sortBy]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-hero text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={32} className="text-white" />
            <h1 className="text-4xl md:text-5xl font-bold">
              XrmToolBox Plugin Catalog
            </h1>
          </div>
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl mx-auto">
            Discover powerful plugins for Microsoft Power Platform development and administration
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="text-base">
              <span className="font-semibold">{plugins.length.toLocaleString()}</span> plugins available
            </div>
            <div className="hidden sm:block text-white/60">•</div>
            <div className="text-base">
              <span className="font-semibold">{allCategories.length}</span> categories
            </div>
            <div className="hidden sm:block text-white/60">•</div>
            <div className="text-base">
              Built for Power Platform
            </div>
          </div>
          {/* View Toggle and Getting Started */}
          <div className="flex items-center justify-center gap-4">
            <ViewToggle />
            <Link
              to="/getting-started"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <HelpCircle size={14} />
              <span className="hidden sm:inline">Getting Started</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            sortBy={sortBy}
            onSortChange={setSortBy}
            allCategories={allCategories}
            pluginCount={filteredAndSortedPlugins.length}
            totalCount={plugins.length}
          />
        </div>

        {/* Plugin Grid */}
        {filteredAndSortedPlugins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedPlugins.map((plugin) => (
              <PluginCard
                key={plugin.mctools_pluginid}
                plugin={plugin}
                onViewDetails={setSelectedPlugin}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold mb-2">No plugins found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategories([]);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left side */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Sparkles size={12} className="text-white" />
                </div>
                <span className="font-semibold text-sm">XrmToolBox Plugin Catalog</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                  onClick={() => window.open("https://www.xrmtoolbox.com/", "_blank")}
                >
                  XrmToolBox.com
                  <ExternalLink size={12} className="ml-1" />
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                  onClick={() => window.open("https://github.com/jukkan/xrmtoolbox-plugin-catalog", "_blank")}
                >
                  <Github size={14} className="mr-1" />
                  GitHub
                </Button>
              </div>
            </div>

            {/* Right side */}
            <div className="text-sm text-muted-foreground text-center md:text-right">
              <p>{plugins.length.toLocaleString()} plugins available</p>
              <p className="text-xs mt-1">Data refreshed regularly from XrmToolBox.com</p>
              <p className="text-xs mt-1">
                Catalog site created by{" "}
                <a
                  href="https://jukkan.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Jukka Niiranen
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Plugin Details Modal */}
      <PluginDetails
        plugin={selectedPlugin}
        open={!!selectedPlugin}
        onClose={() => setSelectedPlugin(null)}
      />
    </div>
  );
};

export default Index;
