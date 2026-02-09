import type { NewsletterPluginEntry } from "@/data/monthly";

export interface NewsletterScoringWeights {
  recency: number;
  downloads: number;
  rating: number;
  categoryDiversity: number;
  firstReleaseBonus: number;
}

export interface NewsletterScoringConfig {
  maxPerAuthor: number;
  maxPerCategory: number;
  ratingThreshold: number;
  topLimit: number;
  weights: NewsletterScoringWeights;
}

export interface ScoredNewsletterPlugin {
  plugin: NewsletterPluginEntry;
  score: number;
  breakdown: {
    recency: number;
    downloads: number;
    rating: number;
    categoryDiversity: number;
    firstReleaseBonus: number;
  };
}

export const defaultNewsletterScoringConfig: NewsletterScoringConfig = {
  maxPerAuthor: 1,
  maxPerCategory: 2,
  ratingThreshold: 4,
  topLimit: 10,
  weights: {
    recency: 30,
    downloads: 35,
    rating: 25,
    categoryDiversity: 10,
    firstReleaseBonus: 5,
  },
};

const safeNumber = (value: number | null | undefined): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const isInTargetMonth = (dateValue: string | null | undefined, month: string): boolean =>
  !!dateValue && dateValue.slice(0, 7) === month;

const getPrimaryCategory = (plugin: NewsletterPluginEntry): string =>
  plugin.categories?.[0]?.trim() || "Uncategorized";

const normalize01 = (value: number, maxValue: number): number => {
  if (!Number.isFinite(value) || maxValue <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(1, value / maxValue));
};

const buildBaseScores = (
  plugins: NewsletterPluginEntry[],
  month: string,
  config: NewsletterScoringConfig
): ScoredNewsletterPlugin[] => {
  const maxDownloads = Math.max(
    ...plugins.map((plugin) => Math.log10(safeNumber(plugin.ranking.totalDownloads) + 1)),
    1
  );

  return plugins
    .filter((plugin) => safeNumber(plugin.ranking.averageRating) >= config.ratingThreshold)
    .map((plugin) => {
      const rating = safeNumber(plugin.ranking.averageRating);
      const recency = isInTargetMonth(plugin.ranking.releaseDate, month) ? 1 : 0;
      const downloads = normalize01(Math.log10(safeNumber(plugin.ranking.totalDownloads) + 1), maxDownloads);
      const ratingScore = normalize01(rating, 5);
      const firstReleaseBonus = isInTargetMonth(plugin.ranking.firstReleaseDate, month) ? 1 : 0;

      const weightedRecency = recency * config.weights.recency;
      const weightedDownloads = downloads * config.weights.downloads;
      const weightedRating = ratingScore * config.weights.rating;
      const weightedFirstReleaseBonus = firstReleaseBonus * config.weights.firstReleaseBonus;

      return {
        plugin,
        score: weightedRecency + weightedDownloads + weightedRating + weightedFirstReleaseBonus,
        breakdown: {
          recency: weightedRecency,
          downloads: weightedDownloads,
          rating: weightedRating,
          categoryDiversity: 0,
          firstReleaseBonus: weightedFirstReleaseBonus,
        },
      } satisfies ScoredNewsletterPlugin;
    })
    .sort((a, b) => b.score - a.score || a.plugin.name.localeCompare(b.plugin.name));
};

export const rankMostNotableUpdatedTools = (
  plugins: NewsletterPluginEntry[],
  month: string,
  overrides: Partial<NewsletterScoringConfig> = {}
): ScoredNewsletterPlugin[] => {
  const config: NewsletterScoringConfig = {
    ...defaultNewsletterScoringConfig,
    ...overrides,
    weights: {
      ...defaultNewsletterScoringConfig.weights,
      ...(overrides.weights ?? {}),
    },
  };

  const candidates = buildBaseScores(plugins, month, config);
  const authorCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  const selected: ScoredNewsletterPlugin[] = [];

  for (const candidate of candidates) {
    if (selected.length >= config.topLimit) {
      break;
    }

    const author = candidate.plugin.author?.trim() || "Unknown";
    const category = getPrimaryCategory(candidate.plugin);
    const authorCount = authorCounts.get(author) ?? 0;
    const categoryCount = categoryCounts.get(category) ?? 0;

    if (authorCount >= config.maxPerAuthor || categoryCount >= config.maxPerCategory) {
      continue;
    }

    const hasCategoryAlready = categoryCount > 0;
    const categoryDiversityBonus = hasCategoryAlready ? 0 : config.weights.categoryDiversity;

    selected.push({
      ...candidate,
      score: Number((candidate.score + categoryDiversityBonus).toFixed(4)),
      breakdown: {
        ...candidate.breakdown,
        categoryDiversity: categoryDiversityBonus,
      },
    });

    authorCounts.set(author, authorCount + 1);
    categoryCounts.set(category, categoryCount + 1);
  }

  return selected.sort((a, b) => b.score - a.score || a.plugin.name.localeCompare(b.plugin.name));
};
