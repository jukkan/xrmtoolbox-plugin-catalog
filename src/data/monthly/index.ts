export interface NewsletterRanking {
  totalDownloads: number;
  averageRating: number;
  ratingDelta: number | null;
  recencyDays: number;
  releaseDate: string;
}

export interface NewsletterPluginEntry {
  mctools_pluginid: string;
  name: string;
  author: string;
  ranking: NewsletterRanking;
}

export interface MonthlyNewsletter {
  month: string;
  generatedAt: string;
  counts: {
    newPlugins: number;
    updatedPlugins: number;
  };
  newPlugins: NewsletterPluginEntry[];
  updatedPlugins: NewsletterPluginEntry[];
}

const monthlyModules = import.meta.glob<MonthlyNewsletter>('./*.json', {
  eager: true,
  import: 'default'
});

export const monthlyNewsletters: MonthlyNewsletter[] = Object.values(monthlyModules).sort((a, b) =>
  b.month.localeCompare(a.month)
);

export const getMonthlyNewsletter = (month: string): MonthlyNewsletter | undefined =>
  monthlyNewsletters.find((newsletter) => newsletter.month === month);
