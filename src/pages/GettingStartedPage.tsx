import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronRight, ExternalLink, Sparkles, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SEO } from "@/components/SEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  sections,
  benefits,
  useCases,
  installSteps,
  pluginSteps,
  connectionSteps,
  starterPlugins,
  pluginProTips,
  connectionTips,
  faqs,
  resourceLinks,
  callouts,
} from "@/data/gettingStartedContent";
import pluginsData from "@/data/plugins.json";

// Get actual plugin count
const pluginCount = pluginsData.value?.length || 380;

// Types
type CalloutType = 'warning' | 'tip' | 'info' | 'success';

interface CalloutProps {
  type: CalloutType;
  title: string;
  content: string;
}

interface StepProps {
  num: number;
  title: string;
  detail: string;
}

// CalloutBox Component
function CalloutBox({ type, title, content }: CalloutProps) {
  const styles: Record<CalloutType, { bg: string; border: string; icon: string }> = {
    warning: { bg: 'bg-red-50', border: 'border-red-200', icon: '⚠️' },
    tip: { bg: 'bg-amber-50', border: 'border-amber-200', icon: '💡' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'ℹ️' },
    success: { bg: 'bg-green-50', border: 'border-green-200', icon: '✓' },
  };

  const style = styles[type];

  return (
    <div className={cn(
      "rounded-xl border-2 p-4",
      style.bg,
      style.border
    )}>
      <div className="flex gap-3">
        <span className="text-xl shrink-0">{style.icon}</span>
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-700">{content}</p>
        </div>
      </div>
    </div>
  );
}

// NumberedStep Component
function NumberedStep({ num, title, detail }: StepProps) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
        {num}
      </div>
      <div className="flex-1 pt-1">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{detail}</p>
      </div>
    </div>
  );
}

// BenefitCard Component
function BenefitCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-4 hover:shadow-md transition-shadow">
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className="font-semibold text-foreground mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

// Tab Navigation Component
function TabNavigation({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap"
    >
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onTabChange(section.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
            activeTab === section.id
              ? "bg-blue-500 text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          <span>{section.icon}</span>
          <span>{section.label}</span>
        </button>
      ))}
    </div>
  );
}

// Starter Pack Grid
function StarterPackGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {starterPlugins.map((plugin) => (
        <Link
          key={plugin.nugetId}
          to={`/store/plugin/${encodeURIComponent(plugin.nugetId)}`}
          className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border/50 hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center text-blue-600 font-bold">
            {plugin.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-medium text-foreground text-sm group-hover:text-blue-600 transition-colors truncate">
              {plugin.name}
            </h5>
            <p className="text-xs text-muted-foreground truncate">{plugin.author}</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
        </Link>
      ))}
    </div>
  );
}

// Section Components
function WhatIsItSection() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-card rounded-xl border border-border/50 p-4">
          <div className="text-3xl md:text-4xl font-bold text-blue-600">{pluginCount}+</div>
          <div className="text-sm text-muted-foreground mt-1">Plugins Available</div>
        </div>
        <div className="bg-card rounded-xl border border-border/50 p-4">
          <div className="text-3xl md:text-4xl font-bold text-green-600">Free</div>
          <div className="text-sm text-muted-foreground mt-1">Open Source Core</div>
        </div>
        <div className="bg-card rounded-xl border border-border/50 p-4">
          <div className="text-3xl md:text-4xl font-bold text-purple-600">2012</div>
          <div className="text-sm text-muted-foreground mt-1">Community Since</div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <p className="text-lg text-foreground leading-relaxed">
          <strong>XrmToolBox</strong> is a free Windows application that connects to Microsoft Dataverse
          (the database behind Power Apps, Dynamics 365, and Power Platform). It's a host for{" "}
          <strong>{pluginCount}+ community-built plugins</strong> that help you query data, manage schemas,
          migrate configurations, debug plugins, and perform tasks the standard UI doesn't support.
        </p>
      </div>

      {/* IDE Analogy */}
      <CalloutBox {...callouts.ideAnalogy} />

      {/* Resources */}
      <div className="bg-slate-50 rounded-xl p-6">
        <h4 className="font-semibold text-foreground mb-4">Official Resources</h4>
        <div className="flex flex-wrap gap-3">
          {resourceLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-border/50 text-sm font-medium text-foreground hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
              <ExternalLink size={14} className="text-muted-foreground" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function WhyUseItSection() {
  return (
    <div className="space-y-8">
      {/* Benefits Grid */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Key Benefits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.title} {...benefit} />
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-slate-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Popular Use Cases</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {useCases.map((useCase, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-sm text-foreground">{useCase}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function InstallationSection() {
  return (
    <div className="space-y-6">
      {/* Steps */}
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Installation Steps</h3>
        <div className="space-y-6">
          {installSteps.map((step) => (
            <NumberedStep key={step.num} {...step} />
          ))}
        </div>
      </div>

      {/* Warning */}
      <CalloutBox {...callouts.unblockWarning} />

      {/* Download Button */}
      <div className="text-center">
        <a
          href="https://www.xrmtoolbox.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
        >
          Download XrmToolBox
          <ExternalLink size={18} />
        </a>
      </div>
    </div>
  );
}

function GettingPluginsSection() {
  return (
    <div className="space-y-8">
      {/* Steps */}
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">How to Install Plugins</h3>
        <div className="space-y-6">
          {pluginSteps.map((step) => (
            <NumberedStep key={step.num} {...step} />
          ))}
        </div>
      </div>

      {/* Starter Pack */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Essential Starter Pack</h3>
        <p className="text-sm text-muted-foreground mb-4">
          New to XrmToolBox? Start with these highly-rated, well-maintained plugins:
        </p>
        <StarterPackGrid />
      </div>

      {/* Pro Tips */}
      <div className="bg-amber-50 rounded-xl border-2 border-amber-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>💡</span> Pro Tips
        </h4>
        <ul className="space-y-2">
          {pluginProTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-amber-600 mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ConnectionsSection() {
  return (
    <div className="space-y-8">
      {/* Steps */}
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Creating a Connection</h3>
        <div className="space-y-6">
          {connectionSteps.map((step) => (
            <NumberedStep key={step.num} {...step} />
          ))}
        </div>
      </div>

      {/* Security Note */}
      <CalloutBox {...callouts.securityNote} />

      {/* Connection File Tips */}
      <div className="bg-slate-50 rounded-xl p-6">
        <h4 className="font-semibold text-foreground mb-4">Managing Connection Files</h4>
        <p className="text-sm text-muted-foreground mb-4">
          XrmToolBox stores connections in files that can be organized and shared:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {connectionTips.map((tip) => (
            <div key={tip.label} className="bg-white rounded-lg border border-border/50 p-4">
              <h5 className="font-medium text-foreground text-sm mb-1">{tip.label}</h5>
              <p className="text-xs text-muted-foreground">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQSection() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`} className="border-b border-border/50 last:border-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 text-left">
                <span className="font-medium text-foreground">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* More Help */}
      <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6 text-center">
        <h4 className="font-semibold text-gray-900 mb-2">Need More Help?</h4>
        <p className="text-sm text-gray-700 mb-4">
          Check the official documentation or join the community discussions.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="https://www.xrmtoolbox.com/documentation/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-blue-200 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors"
          >
            📖 Documentation
            <ExternalLink size={14} />
          </a>
          <a
            href="https://github.com/MscrmTools/XrmToolBox"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-blue-200 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors"
          >
            💻 GitHub
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export function GettingStartedPage() {
  const [activeTab, setActiveTab] = useState('what');

  const renderSection = () => {
    switch (activeTab) {
      case 'what':
        return <WhatIsItSection />;
      case 'why':
        return <WhyUseItSection />;
      case 'install':
        return <InstallationSection />;
      case 'plugins':
        return <GettingPluginsSection />;
      case 'connect':
        return <ConnectionsSection />;
      case 'faq':
        return <FAQSection />;
      default:
        return <WhatIsItSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Getting Started with XrmToolBox"
        description="Learn how to install and use XrmToolBox for Microsoft Power Platform and Dynamics 365 development. Step-by-step guide to getting started with plugins and connections."
        keywords="XrmToolBox getting started, installation guide, Power Platform tutorial, Dynamics 365 tools, XrmToolBox plugins"
        canonical="/getting-started"
      />
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Back Button */}
            <Link
              to="/store"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline font-medium">Back to Store</span>
            </Link>

            {/* Title */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg">Getting Started</span>
            </div>

            {/* Spacer for alignment */}
            <div className="w-[100px] hidden sm:block" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="gradient-hero text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Introduction to XrmToolBox
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Your essential toolkit for Microsoft Power Platform and Dynamics 365 development
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-border/50 sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {renderSection()}
      </main>

      {/* About this site Section */}
      <div className="bg-slate-100 border-t border-border/50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
            About this site
          </h2>
          <div className="bg-white rounded-xl border border-border/50 p-6 space-y-4">
            <p className="text-foreground leading-relaxed">
              You are browsing a site hosted on GitHub Pages, built on top of a daily updated feed of plugin details from the official XrmToolBox.com website. It offers a modern experience for accessing information on the tools, yet it hosts no data of its own whatsoever.
            </p>
            <p className="text-foreground leading-relaxed">
              The purpose of the Plugin Catalog site is to help the community of Power Platform and Dynamics 365 makers, admins and developers discover the amazing tools built by the community. The tool ecosystem has been made possible by the work of Tanguy Touzard, owner and creator of{" "}
              <a
                href="https://github.com/MscrmTools/XrmToolBox"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                XrmToolBox
              </a>
              .👏
            </p>
            <p className="text-foreground leading-relaxed">
              For info about this Catalog site in particular (not the tools nor The Box), go to its{" "}
              <a
                href="https://github.com/jukkan/xrmtoolbox-plugin-catalog/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                GitHub repo
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="gradient-hero text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to explore plugins?
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-xl mx-auto">
            Browse {pluginCount}+ plugins to supercharge your Power Platform workflow
          </p>
          <Link
            to="/store"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Browse Plugin Catalog
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>

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
              <p>{pluginCount.toLocaleString()} plugins available</p>
              <p className="text-xs mt-1">Data refreshed regularly from XrmToolBox.com</p>
              <p className="text-xs mt-1">
                Catalog site created by{" "}
                <a
                  href="https://jukkan.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Jukka Niiranen
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
