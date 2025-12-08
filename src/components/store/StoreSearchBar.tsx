import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plugin } from "@/components/PluginCard";

interface StoreSearchBarProps {
  plugins: Plugin[];
  className?: string;
}

export function StoreSearchBar({
  plugins,
  className
}: StoreSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Plugin[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Update suggestions when query changes
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const q = query.toLowerCase();
    const matches = plugins
      .filter(p =>
        p.mctools_name.toLowerCase().includes(q) ||
        p.mctools_description.toLowerCase().includes(q) ||
        p.mctools_authors.toLowerCase().includes(q)
      )
      .slice(0, 8);

    setSuggestions(matches);
    setSelectedIndex(-1);
  }, [query, plugins]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        navigateToPlugin(suggestions[selectedIndex]);
      } else if (query) {
        navigate(`/store?search=${encodeURIComponent(query)}`);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const navigateToPlugin = (plugin: Plugin) => {
    const nugetId = (plugin as any).mctools_nugetid || plugin.mctools_pluginid;
    navigate(`/store/plugin/${encodeURIComponent(nugetId)}`);
    setQuery("");
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-2xl", className)}>
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search plugins, authors, categories..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-12 pl-11 pr-10 text-base rounded-full",
            "bg-card border-border/50 focus:border-primary",
            "placeholder:text-muted-foreground/60"
          )}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={clearSearch}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border border-border shadow-xl overflow-hidden z-50">
          {suggestions.map((plugin, index) => {
            const nugetId = (plugin as any).mctools_nugetid || plugin.mctools_pluginid;
            return (
              <button
                key={nugetId}
                className={cn(
                  "w-full px-4 py-3 flex items-center gap-3 text-left transition-colors",
                  index === selectedIndex
                    ? "bg-muted"
                    : "hover:bg-muted/50"
                )}
                onClick={() => navigateToPlugin(plugin)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {/* Logo */}
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                  {plugin.mctools_logourl ? (
                    <img
                      src={plugin.mctools_logourl}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-primary font-bold">
                      {plugin.mctools_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">
                    {plugin.mctools_name}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    by {plugin.mctools_authors}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Search all results */}
          {query.length >= 2 && (
            <button
              className="w-full px-4 py-3 text-left text-sm text-primary hover:bg-muted/50 border-t border-border"
              onClick={() => {
                navigate(`/store?search=${encodeURIComponent(query)}`);
                setIsOpen(false);
              }}
            >
              Search all results for "{query}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}
