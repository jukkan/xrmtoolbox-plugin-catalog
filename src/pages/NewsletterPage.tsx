import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { SEO } from "@/components/SEO";
import { StoreLayout } from "@/components/store/StoreLayout";
import { Button } from "@/components/ui/button";
import { getMonthlyNewsletter, NewsletterPluginEntry } from "@/data/monthly";
import { rankMostNotableUpdatedTools } from "@/utils/newsletterScoring";
import pluginsData from "@/data/plugins.json";
import { Plugin } from "@/components/PluginCard";

const plugins: Plugin[] = pluginsData.value || [];

function formatMonth(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });
}

function PluginRow({ plugin }: { plugin: NewsletterPluginEntry }) {
  return (
    <li className="rounded-md border p-3">
      <div className="font-medium">{plugin.name}</div>
      <div className="text-sm text-muted-foreground">{plugin.author}</div>
      <div className="mt-1 text-xs text-muted-foreground">
        Downloads: {plugin.ranking.totalDownloads.toLocaleString()} · Rating: {plugin.ranking.averageRating || "N/A"}
      </div>
      <Button asChild variant="link" size="sm" className="px-0 mt-1 h-auto">
        <Link to={`/store?search=${encodeURIComponent(plugin.name)}`}>Search in catalog</Link>
      </Button>
    </li>
  );
}

export function NewsletterPage() {
  const { month = "" } = useParams();
  const newsletter = getMonthlyNewsletter(month);
  const isValidMonthParam = /^\d{4}-\d{2}$/.test(month);

  if (!isValidMonthParam || !newsletter) {
    return (
      <StoreLayout plugins={plugins} showHero={false}>
        <SEO
          title="Newsletter Not Found"
          description="The requested monthly newsletter could not be found."
          canonical={`/newsletter/${month}`}
        />
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Newsletter not found</h1>
          <p className="text-muted-foreground">No published newsletter exists for "{month}".</p>
          <Button asChild variant="outline" size="sm">
            <Link to="/newsletter">
              <ArrowLeft size={14} className="mr-2" />
              Back to archive
            </Link>
          </Button>
        </div>
      </StoreLayout>
    );
  }

  const monthLabel = formatMonth(newsletter.month);

  const notableUpdatedTools = rankMostNotableUpdatedTools(newsletter.updatedPlugins, newsletter.month, {
    topLimit: 8,
    maxPerAuthor: 1,
    maxPerCategory: 2,
  });

  return (
    <StoreLayout plugins={plugins} showHero={false}>
      <SEO
        title={`${monthLabel} Newsletter`}
        description={`Monthly XrmToolBox snapshot for ${monthLabel}: ${newsletter.counts.newPlugins} new and ${newsletter.counts.updatedPlugins} updated plugins.`}
        canonical={`/newsletter/${newsletter.month}`}
      />

      <div className="space-y-8">
        <header className="space-y-3">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link to="/newsletter">
              <ArrowLeft size={14} className="mr-2" />
              Back to archive
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <CalendarDays size={22} className="text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">{monthLabel}</h1>
          </div>
          <p className="text-muted-foreground">
            {newsletter.counts.newPlugins} new and {newsletter.counts.updatedPlugins} updated plugins.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">New plugins</h2>
          {newsletter.newPlugins.length === 0 ? (
            <p className="text-muted-foreground">No newly published plugins in this month.</p>
          ) : (
            <ul className="space-y-2">
              {newsletter.newPlugins.map((plugin) => (
                <PluginRow key={plugin.mctools_pluginid} plugin={plugin} />
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Most notable updated tools</h2>
          {notableUpdatedTools.length === 0 ? (
            <p className="text-muted-foreground">No notable updated tools matched this month's scoring thresholds.</p>
          ) : (
            <ul className="space-y-2">
              {notableUpdatedTools.map((entry) => (
                <li key={entry.plugin.mctools_pluginid} className="rounded-md border p-3">
                  <div className="font-medium">{entry.plugin.name}</div>
                  <div className="text-sm text-muted-foreground">{entry.plugin.author}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Score: {entry.score.toFixed(1)} · Downloads: {entry.plugin.ranking.totalDownloads.toLocaleString()} · Rating: {entry.plugin.ranking.averageRating || "N/A"}
                  </div>
                  <Button asChild variant="link" size="sm" className="px-0 mt-1 h-auto">
                    <Link to={`/store?search=${encodeURIComponent(entry.plugin.name)}`}>Search in catalog</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </StoreLayout>
  );
}
