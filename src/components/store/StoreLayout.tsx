import { ReactNode, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plugin } from "@/components/PluginCard";
import { StoreSearchBar } from "./StoreSearchBar";
import { ViewToggle } from "./ViewToggle";
import { getAllCategories } from "@/utils/pluginUtils";

interface StoreLayoutProps {
  children: ReactNode;
  plugins: Plugin[];
  showHero?: boolean;
  heroContent?: ReactNode;
  className?: string;
}

export function StoreLayout({
  children,
  plugins,
  showHero = true,
  heroContent,
  className
}: StoreLayoutProps) {
  const allCategories = useMemo(() => getAllCategories(plugins), [plugins]);

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Hero Header Section */}
      {showHero && (
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
            {/* View Toggle */}
            <div className="flex justify-center">
              <ViewToggle />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Search Header (when not showing hero or after scroll) */}
      {!showHero && (
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="h-16 flex items-center justify-between gap-4">
              {/* Logo */}
              <Link
                to="/store"
                className="flex items-center gap-2 shrink-0"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <span className="font-bold text-lg hidden sm:inline">
                  XrmToolBox
                </span>
              </Link>

              {/* Search */}
              <div className="flex-1 flex justify-center max-w-xl">
                <StoreSearchBar plugins={plugins} className="w-full" />
              </div>

              {/* View Toggle */}
              <ViewToggle />
            </div>
          </div>
        </header>
      )}

      {/* Search bar below hero */}
      {showHero && (
        <div className="bg-background border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
            <div className="flex justify-center">
              <StoreSearchBar plugins={plugins} className="w-full max-w-2xl" />
            </div>
          </div>
        </div>
      )}

      {/* Featured content section */}
      {showHero && heroContent && (
        <div className="bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {heroContent}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {children}
      </main>

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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
