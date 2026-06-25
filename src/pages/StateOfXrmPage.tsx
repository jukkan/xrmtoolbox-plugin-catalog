import { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, Star, Users, Package, Code2, TrendingUp, Zap } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { SEO } from "@/components/SEO";
import { Plugin } from "@/components/PluginCard";
import { parseCategories } from "@/utils/pluginUtils";
import pluginsData from "@/data/plugins.json";

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return count;
}

const C = {
  blue: "#4A9EFF",
  green: "#22C55E",
  purple: "#A855F7",
  amber: "#F59E0B",
  rose: "#F43F5E",
  teal: "#14B8A6",
  indigo: "#6366F1",
  orange: "#F97316",
  gray: "#E5E7EB",
};
const PALETTE = [C.blue, C.green, C.purple, C.amber, C.rose, C.teal, C.indigo, C.orange];

const GRID = "hsl(220 13% 91%)";
const TOOLTIP_STYLE = { borderRadius: "8px", border: `1px solid ${GRID}`, fontSize: 13 };

export function StateOfXrmPage() {
  const plugins: Plugin[] = useMemo(() => (pluginsData as any).value || [], []);

  const stats = useMemo(() => {
    const totalDownloads = plugins.reduce((s, p) => s + (p.mctools_totaldownloadcount || 0), 0);
    const openSource = plugins.filter((p) => p.mctools_isopensource).length;
    const mvp = plugins.filter((p) => (p as any)["contact-mctools_ismvp"]).length;
    const rated = plugins.filter((p) => parseFloat(p.mctools_averagefeedbackratingallversions) > 0);
    const avgRating =
      rated.length > 0
        ? rated.reduce((s, p) => s + parseFloat(p.mctools_averagefeedbackratingallversions), 0) / rated.length
        : 0;
    const authors = new Set(plugins.map((p) => p.mctools_authors)).size;
    const now = new Date();
    const cut90 = new Date(now);
    cut90.setDate(now.getDate() - 90);
    const cut30 = new Date(now);
    cut30.setDate(now.getDate() - 30);
    const newLast90 = plugins.filter(
      (p) => p.mctools_firstreleasedate && new Date(p.mctools_firstreleasedate) >= cut90
    ).length;
    const updatedLast30 = plugins.filter(
      (p) => p.mctools_latestreleasedate && new Date(p.mctools_latestreleasedate) >= cut30
    ).length;
    return { totalDownloads, openSource, mvp, avgRating, authors, newLast90, updatedLast30, ratedCount: rated.length };
  }, [plugins]);

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    plugins.forEach((p) => {
      parseCategories(p.mctools_categorieslist).forEach((c) => {
        cats[c] = (cats[c] || 0) + 1;
      });
    });
    return Object.entries(cats)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [plugins]);

  const authorData = useMemo(() => {
    const authors: Record<string, number> = {};
    plugins.forEach((p) => {
      const a = p.mctools_authors || "Unknown";
      authors[a] = (authors[a] || 0) + 1;
    });
    return Object.entries(authors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }, [plugins]);

  const monthlyData = useMemo(() => {
    const byMonth: Record<string, number> = {};
    plugins.forEach((p) => {
      if (p.mctools_firstreleasedate) {
        const m = p.mctools_firstreleasedate.slice(0, 7);
        byMonth[m] = (byMonth[m] || 0) + 1;
      }
    });
    return Object.entries(byMonth)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-13)
      .map(([month, count]) => {
        const [y, mo] = month.split("-");
        const label = new Date(parseInt(y), parseInt(mo) - 1).toLocaleString("en", {
          month: "short",
          year: "2-digit",
        });
        return { month: label, count };
      });
  }, [plugins]);

  const downloadLeaders = useMemo(() => {
    return [...plugins]
      .sort((a, b) => b.mctools_totaldownloadcount - a.mctools_totaldownloadcount)
      .slice(0, 10)
      .map((p) => ({
        name: p.mctools_name.length > 30 ? p.mctools_name.slice(0, 28) + "…" : p.mctools_name,
        downloads: p.mctools_totaldownloadcount,
      }));
  }, [plugins]);

  const openSourcePie = [
    { name: "Open Source", value: stats.openSource },
    { name: "Proprietary", value: plugins.length - stats.openSource },
  ];
  const mvpPie = [
    { name: "MVP-authored", value: stats.mvp },
    { name: "Community", value: plugins.length - stats.mvp },
  ];
  const ratedPie = [
    { name: "Rated", value: stats.ratedCount },
    { name: "Unrated", value: plugins.length - stats.ratedCount },
  ];

  const pluginCount = useCountUp(plugins.length);
  const dlMillions = useCountUp(Math.round((stats.totalDownloads / 1_000_000) * 10), 2000);
  const authorCount = useCountUp(stats.authors);

  const metricCards = [
    { icon: Package, label: "Total Plugins", value: plugins.length.toLocaleString(), color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40" },
    { icon: Users, label: "Contributors", value: stats.authors.toLocaleString(), color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/40" },
    { icon: Download, label: "Total Downloads", value: `${(stats.totalDownloads / 1_000_000).toFixed(1)}M`, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/40" },
    { icon: Code2, label: "Open Source", value: `${Math.round((stats.openSource / plugins.length) * 100)}%`, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/40" },
    { icon: Star, label: "Avg Rating", value: `${stats.avgRating.toFixed(2)}★`, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40" },
    { icon: TrendingUp, label: "New (90 days)", value: stats.newLast90.toString(), color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/40" },
  ];

  return (
    <StoreLayout plugins={plugins} showHero={false}>
      <SEO
        title="State of XRM — XrmToolBox Ecosystem"
        description={`${plugins.length} plugins, ${stats.authors} contributors, ${(stats.totalDownloads / 1_000_000).toFixed(1)}M downloads. The definitive snapshot of the XrmToolBox ecosystem.`}
        keywords="XrmToolBox ecosystem, Power Platform statistics, XRM community, plugin stats"
        canonical="/state"
      />

      <div className="-mx-4 md:-mx-8">

        {/* ── HERO ── */}
        <div className="gradient-hero text-white py-20 px-4 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-8 border border-white/30">
              <Zap size={13} />
              State of XRM · {new Date().getFullYear()}
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-5">
              The XrmToolBox<br className="hidden md:block" /> Ecosystem
            </h1>
            <p className="text-xl text-white/75 mb-14 max-w-xl mx-auto">
              A living snapshot of the community building the future of Power Platform development.
            </p>

            <div className="grid grid-cols-3 gap-4 md:gap-12 max-w-2xl mx-auto">
              {[
                { value: pluginCount.toLocaleString(), label: "Plugins" },
                { value: `${(dlMillions / 10).toFixed(1)}M`, label: "Downloads" },
                { value: authorCount.toLocaleString(), label: "Contributors" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-5xl md:text-6xl font-black tabular-nums drop-shadow-md">
                    {value}
                  </div>
                  <div className="text-white/60 mt-2 text-xs font-semibold uppercase tracking-widest">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 space-y-20">

          {/* ── KEY METRICS ── */}
          <section>
            <h2 className="text-2xl font-bold mb-6">By the numbers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {metricCards.map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="rounded-xl border bg-card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={color} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold tabular-nums">{value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── GROWTH TIMELINE ── */}
          <section>
            <h2 className="text-2xl font-bold mb-1">Community momentum</h2>
            <p className="text-muted-foreground text-sm mb-6">New plugins released each month (last 13 months)</p>
            <div className="rounded-xl border bg-card p-6">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.blue} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v: number) => [`${v} plugins`, "New this month"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={C.blue}
                    strokeWidth={2.5}
                    fill="url(#growthGrad)"
                    dot={{ fill: C.blue, r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* ── CATEGORIES + AUTHORS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            <section>
              <h2 className="text-2xl font-bold mb-1">Plugin categories</h2>
              <p className="text-muted-foreground text-sm mb-6">All {categoryData.length} categories by plugin count</p>
              <div className="rounded-xl border bg-card p-6">
                <ResponsiveContainer width="100%" height={460}>
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={GRID} />
                    <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      formatter={(v: number) => [`${v} plugins`, "Count"]}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-1">Top contributors</h2>
              <p className="text-muted-foreground text-sm mb-6">Most prolific authors by number of plugins</p>
              <div className="rounded-xl border bg-card p-6">
                <ResponsiveContainer width="100%" height={460}>
                  <BarChart data={authorData} layout="vertical" margin={{ top: 0, right: 50, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={GRID} />
                    <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      formatter={(v: number) => [`${v} plugins`, "Plugins"]}
                    />
                    <Bar
                      dataKey="count"
                      radius={[0, 4, 4, 0]}
                      label={{ position: "right", fontSize: 12, fontWeight: 600, fill: C.purple }}
                    >
                      {authorData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={C.purple}
                          fillOpacity={0.4 + 0.6 * ((i + 1) / authorData.length)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          {/* ── COMMUNITY HEALTH ── */}
          <section>
            <h2 className="text-2xl font-bold mb-1">Community health</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Openness, expertise, and engagement across the ecosystem
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {([
                {
                  title: "Open Source",
                  subtitle: `${stats.openSource} of ${plugins.length} plugins`,
                  pct: Math.round((stats.openSource / plugins.length) * 100),
                  data: openSourcePie,
                  colors: [C.green, C.gray],
                },
                {
                  title: "MVP-Authored",
                  subtitle: `${stats.mvp} of ${plugins.length} plugins`,
                  pct: Math.round((stats.mvp / plugins.length) * 100),
                  data: mvpPie,
                  colors: [C.amber, C.gray],
                },
                {
                  title: "User Ratings",
                  subtitle: `${stats.ratedCount} of ${plugins.length} rated`,
                  pct: Math.round((stats.ratedCount / plugins.length) * 100),
                  data: ratedPie,
                  colors: [C.blue, C.gray],
                },
              ] as const).map(({ title, subtitle, pct, data, colors }) => (
                <div key={title} className="rounded-xl border bg-card p-6 flex flex-col items-center text-center">
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 mb-2">{subtitle}</p>
                  <div className="relative">
                    <ResponsiveContainer width={180} height={180}>
                      <PieChart>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          innerRadius={58}
                          outerRadius={82}
                          paddingAngle={3}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                          strokeWidth={0}
                        >
                          {data.map((_, i) => (
                            <Cell key={i} fill={colors[i]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Centre label */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-3xl font-black" style={{ color: colors[0] }}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm mt-3">
                    {data.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                          style={{ background: colors[i] }}
                        />
                        <span className="text-muted-foreground">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── DOWNLOAD LEADERS ── */}
          <section>
            <h2 className="text-2xl font-bold mb-1">Download leaders</h2>
            <p className="text-muted-foreground text-sm mb-6">
              The 10 most-downloaded plugins of all time
            </p>
            <div className="rounded-xl border bg-card p-6">
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={downloadLeaders} layout="vertical" margin={{ top: 0, right: 70, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={GRID} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={190} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v: number) => [v.toLocaleString(), "Downloads"]}
                  />
                  <Bar
                    dataKey="downloads"
                    radius={[0, 4, 4, 0]}
                    label={{
                      position: "right",
                      fontSize: 11,
                      fontWeight: 600,
                      fill: C.green,
                      formatter: (v: number) => `${(v / 1000).toFixed(0)}K`,
                    }}
                  >
                    {downloadLeaders.map((_, i) => (
                      <Cell
                        key={i}
                        fill={C.green}
                        fillOpacity={0.4 + 0.6 * ((i + 1) / downloadLeaders.length)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* ── SUPPORT BANNER ── */}
          <div className="rounded-2xl gradient-hero text-white p-10 text-center">
            <div className="text-3xl mb-3">❤️</div>
            <h2 className="text-2xl font-bold mb-2">Support XrmToolBox</h2>
            <p className="text-white/75 mb-6 max-w-md mx-auto">
              XrmToolBox is a free, community-driven project. If it saves you time, consider supporting the team behind it.
            </p>
            <a
              href="https://www.xrmtoolbox.com/donators/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3 rounded-full hover:bg-white/90 transition-colors shadow-lg"
            >
              Become a donator →
            </a>
          </div>

          {/* ── BROWSE CTA ── */}
          <div className="rounded-2xl border bg-card p-10 text-center">
            <h2 className="text-3xl font-bold mb-3">Ready to explore?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Browse all {plugins.length} plugins, filter by category, and find the right tool for your Power Platform workflow.
            </p>
            <Link
              to="/store"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-10 py-4 rounded-full text-lg hover:bg-primary/90 transition-colors shadow-md"
            >
              Browse all plugins →
            </Link>
          </div>

          {/* ── DATA NOTE ── */}
          <div className="text-center text-xs text-muted-foreground pb-8">
            Data sourced from{" "}
            <a
              href="https://www.xrmtoolbox.com/_odata/plugins"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              xrmtoolbox.com
            </a>{" "}
            · Updated daily
          </div>

        </div>
      </div>
    </StoreLayout>
  );
}
