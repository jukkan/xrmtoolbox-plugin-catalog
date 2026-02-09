export type ReviewStatus = 'draft' | 'in_review' | 'approved' | 'published';

export interface NewsletterSource {
  title: string;
  url?: string;
  type: 'plugin_catalog' | 'github' | 'docs' | 'blog' | 'community' | 'other';
  accessedAt: string;
  notes?: string;
}

export interface NewsletterHighlight {
  pluginId: string;
  pluginName: string;
  author?: string;
  version?: string;
  category?: string;
  summary: string;
  insight: string;
  sources: NewsletterSource[];
}

export interface AuthorResearch {
  authorName: string;
  profileUrl?: string;
  pluginCount?: number;
  notablePlugins?: string[];
  findings: string;
  sources: NewsletterSource[];
}

export interface NewsletterInsightDraft {
  month: string;
  highlights: NewsletterHighlight[];
  authorResearch: AuthorResearch[];
  useCaseSummary: string;
  editorialContext: string;
  confidence: number;
  reviewStatus: ReviewStatus;
  sources: NewsletterSource[];
}
