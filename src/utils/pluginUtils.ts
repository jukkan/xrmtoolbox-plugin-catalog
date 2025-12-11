import { Plugin } from "@/components/PluginCard";

// Parse categories from comma-separated string
export function parseCategories(categoriesList: string | null | undefined): string[] {
  if (!categoriesList) return [];
  return categoriesList.split(',').map(c => c.trim()).filter(Boolean);
}

// Format download count: 152847 → "152.8K"
export function formatDownloads(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

// Format download count with full number: 152847 → "152,847"
export function formatDownloadsFull(count: number): string {
  return count.toLocaleString();
}

// Relative time: "3 days ago", "2 months ago"
export function formatRelativeDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  } catch {
    return 'Unknown';
  }
}

// Format date as "Month DD, YYYY"
export function formatFullDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Unknown';
  }
}

// Get unique categories from all plugins
export function getAllCategories(plugins: Plugin[]): string[] {
  const categories = new Set<string>();
  plugins.forEach(p => {
    parseCategories(p.mctools_categorieslist).forEach(c => categories.add(c));
  });
  return Array.from(categories).sort();
}

// Get category color based on name
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Security': 'bg-red-500/10 text-red-600 border-red-200',
    'Data': 'bg-purple-500/10 text-purple-600 border-purple-200',
    'Development': 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
    'Solutions': 'bg-orange-500/10 text-orange-600 border-orange-200',
    'Customizations': 'bg-blue-500/10 text-blue-600 border-blue-200',
    'Plugins': 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
    'Workflows': 'bg-pink-500/10 text-pink-600 border-pink-200',
    'User Interface': 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    'Troubleshooting': 'bg-amber-500/10 text-amber-600 border-amber-200',
    'Comparison': 'bg-teal-500/10 text-teal-600 border-teal-200',
    'Administration': 'bg-slate-500/10 text-slate-600 border-slate-200',
    'Migration': 'bg-violet-500/10 text-violet-600 border-violet-200',
  };
  return colors[category] || 'bg-gray-500/10 text-gray-600 border-gray-200';
}

// Get category gradient for hero backgrounds
export function getCategoryGradient(categories: string[]): string {
  if (categories.includes('Security')) return 'from-red-500/20 to-red-600/10';
  if (categories.includes('Data')) return 'from-purple-500/20 to-purple-600/10';
  if (categories.includes('Development')) return 'from-cyan-500/20 to-cyan-600/10';
  if (categories.includes('Solutions')) return 'from-orange-500/20 to-orange-600/10';
  if (categories.includes('Customizations')) return 'from-blue-500/20 to-blue-600/10';
  return 'from-primary/20 to-primary/10';
}

// Filter plugins by criteria
export function filterPlugins(plugins: Plugin[], filters: {
  category?: string;
  author?: string;
  openSourceOnly?: boolean;
  mvpOnly?: boolean;
  search?: string;
}): Plugin[] {
  return plugins.filter(p => {
    if (filters.category && !parseCategories(p.mctools_categorieslist).includes(filters.category)) return false;
    if (filters.author && p.mctools_authors !== filters.author) return false;
    if (filters.openSourceOnly && !p.mctools_isopensource) return false;
    if (filters.mvpOnly && !(p as any)['contact-mctools_ismvp']) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const searchable = `${p.mctools_name} ${p.mctools_description} ${p.mctools_authors}`.toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}

// Sort plugins
export function sortPlugins(plugins: Plugin[], sortBy: 'downloads' | 'rating' | 'updated' | 'released' | 'name'): Plugin[] {
  return [...plugins].sort((a, b) => {
    switch (sortBy) {
      case 'downloads':
        return b.mctools_totaldownloadcount - a.mctools_totaldownloadcount;
      case 'rating':
        return parseFloat(b.mctools_averagefeedbackratingallversions) - parseFloat(a.mctools_averagefeedbackratingallversions);
      case 'updated':
        return new Date(b.mctools_latestreleasedate).getTime() - new Date(a.mctools_latestreleasedate).getTime();
      case 'released':
        return new Date(b.mctools_firstreleasedate).getTime() - new Date(a.mctools_firstreleasedate).getTime();
      case 'name':
        return a.mctools_name.localeCompare(b.mctools_name);
      default:
        return 0;
    }
  });
}

// Get recently updated plugins (within N days)
export function getRecentlyUpdated(plugins: Plugin[], days: number = 30): Plugin[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return plugins.filter(p => {
    try {
      return new Date(p.mctools_latestreleasedate) >= cutoff;
    } catch {
      return false;
    }
  }).sort((a, b) =>
    new Date(b.mctools_latestreleasedate).getTime() - new Date(a.mctools_latestreleasedate).getTime()
  );
}

// Get recently released plugins (within N days)
export function getRecentlyReleased(plugins: Plugin[], days: number = 90): Plugin[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return plugins.filter(p => {
    try {
      return new Date(p.mctools_firstreleasedate) >= cutoff;
    } catch {
      return false;
    }
  }).sort((a, b) =>
    new Date(b.mctools_firstreleasedate).getTime() - new Date(a.mctools_firstreleasedate).getTime()
  );
}

// Get top rated plugins (with minimum rating count)
export function getTopRated(plugins: Plugin[], minRatings: number = 3): Plugin[] {
  return plugins
    .filter(p => (p as any).mctools_totalfeedbackallversion >= minRatings)
    .sort((a, b) =>
      parseFloat(b.mctools_averagefeedbackratingallversions) - parseFloat(a.mctools_averagefeedbackratingallversions)
    );
}

// Get plugins by author
export function getPluginsByAuthor(plugins: Plugin[], author: string): Plugin[] {
  return plugins.filter(p => p.mctools_authors === author);
}

// Get plugins by category
export function getPluginsByCategory(plugins: Plugin[], category: string): Plugin[] {
  return plugins.filter(p => parseCategories(p.mctools_categorieslist).includes(category));
}

// Get open source plugins
export function getOpenSourcePlugins(plugins: Plugin[]): Plugin[] {
  return plugins.filter(p => p.mctools_isopensource);
}

// Get MVP developer plugins
export function getMvpPlugins(plugins: Plugin[]): Plugin[] {
  return plugins.filter(p => (p as any)['contact-mctools_ismvp']);
}

// Get plugins sorted by downloads
export function getMostPopular(plugins: Plugin[]): Plugin[] {
  return [...plugins].sort((a, b) => b.mctools_totaldownloadcount - a.mctools_totaldownloadcount);
}

// Generate slug from nuget ID for URL
export function generatePluginSlug(nugetId: string): string {
  return encodeURIComponent(nugetId);
}

// Find plugin by nuget ID
export function findPluginByNugetId(plugins: Plugin[], nugetId: string): Plugin | undefined {
  return plugins.find(p => (p as any).mctools_nugetid === nugetId);
}

// Find similar plugins (same category, different plugin)
export function getSimilarPlugins(plugins: Plugin[], plugin: Plugin, limit: number = 6): Plugin[] {
  const categories = parseCategories(plugin.mctools_categorieslist);
  if (categories.length === 0) return [];

  return plugins
    .filter(p => {
      if (p.mctools_pluginid === plugin.mctools_pluginid) return false;
      const pCategories = parseCategories(p.mctools_categorieslist);
      return pCategories.some(c => categories.includes(c));
    })
    .sort((a, b) => b.mctools_totaldownloadcount - a.mctools_totaldownloadcount)
    .slice(0, limit);
}

// Get featured plugins for hero section (high rated + popular + recent)
export function getFeaturedPlugins(plugins: Plugin[], limit: number = 5): Plugin[] {
  // Score based on rating, downloads (normalized), and recency
  const now = new Date().getTime();
  const maxDownloads = Math.max(...plugins.map(p => p.mctools_totaldownloadcount));

  const scored = plugins.map(p => {
    const rating = parseFloat(p.mctools_averagefeedbackratingallversions) || 0;
    const ratingCount = (p as any).mctools_totalfeedbackallversion || 0;
    const downloadsNorm = p.mctools_totaldownloadcount / maxDownloads;
    const daysSinceUpdate = (now - new Date(p.mctools_latestreleasedate).getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 1 - daysSinceUpdate / 365);

    // Weight: Rating (with confidence) > Downloads > Recency
    const score = (rating * Math.min(ratingCount / 10, 1)) * 0.4 +
                  downloadsNorm * 0.4 +
                  recencyScore * 0.2;

    return { plugin: p, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.plugin);
}

// Get all unique authors
export function getAllAuthors(plugins: Plugin[]): string[] {
  const authors = new Set<string>();
  plugins.forEach(p => authors.add(p.mctools_authors));
  return Array.from(authors).sort();
}

// Check if plugin was updated recently
export function isRecentlyUpdated(plugin: Plugin, days: number = 30): boolean {
  try {
    const updateDate = new Date(plugin.mctools_latestreleasedate);
    const now = new Date();
    const diffDays = (now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= days;
  } catch {
    return false;
  }
}
