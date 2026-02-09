import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { SEO } from "@/components/SEO";
import { StoreLayout } from "@/components/store/StoreLayout";
import { Button } from "@/components/ui/button";
import { monthlyNewsletters } from "@/data/monthly";
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

export function NewsletterArchivePage() {
  return (
    <StoreLayout plugins={plugins} showHero={false}>
      <SEO
        title="Monthly Newsletter Archive"
        description="Browse monthly XrmToolBox plugin newsletter snapshots with new and updated tools."
        canonical="/newsletter"
      />

      <div className="space-y-6">
        <header className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="text-primary" size={22} />
            <h1 className="text-2xl md:text-3xl font-bold">Newsletter Archive</h1>
          </div>
          <p className="text-muted-foreground">
            Static monthly snapshots generated from checked-in newsletter JSON.
          </p>
        </header>

        {monthlyNewsletters.length === 0 ? (
          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            No monthly newsletters published yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {monthlyNewsletters.map((newsletter) => (
              <article key={newsletter.month} className="rounded-lg border p-5 space-y-3">
                <h2 className="text-lg font-semibold">{formatMonth(newsletter.month)}</h2>
                <p className="text-sm text-muted-foreground">
                  {newsletter.counts.newPlugins} new / {newsletter.counts.updatedPlugins} updated plugins
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/newsletter/${newsletter.month}`}>
                    View newsletter
                    <ArrowRight size={14} className="ml-2" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
