import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, Filter, SortAsc } from "lucide-react";
import { Plugin } from "./PluginCard";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  allCategories: string[];
  pluginCount: number;
  totalCount: number;
}

export const SearchAndFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  sortBy,
  onSortChange,
  allCategories,
  pluginCount,
  totalCount,
}: SearchAndFiltersProps) => {
  const clearAllFilters = () => {
    onSearchChange('');
    selectedCategories.forEach(cat => onCategoryToggle(cat));
  };

  const hasActiveFilters = searchQuery || selectedCategories.length > 0;

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search plugins..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SortAsc size={16} className="mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="downloads">Most Downloaded</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="updated">Recently Updated</SelectItem>
            <SelectItem value="created">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <span className="font-medium">Categories</span>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={14} className="mr-1" />
              Clear All
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <Badge
                key={category}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => onCategoryToggle(category)}
              >
                {category}
                {isSelected && <X size={12} className="ml-1" />}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
        <span>
          Showing {pluginCount.toLocaleString()} of {totalCount.toLocaleString()} plugins
        </span>
        {hasActiveFilters && (
          <span className="text-primary">
            {selectedCategories.length > 0 && `${selectedCategories.length} categories`}
            {searchQuery && selectedCategories.length > 0 && " • "}
            {searchQuery && "search active"}
          </span>
        )}
      </div>
    </div>
  );
};