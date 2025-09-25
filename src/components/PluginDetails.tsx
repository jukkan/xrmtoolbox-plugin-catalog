import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "./StarRating";
import { Plugin } from "./PluginCard";
import { Download, Github, Calendar, User, Package, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface PluginDetailsProps {
  plugin: Plugin | null;
  open: boolean;
  onClose: () => void;
}

export const PluginDetails = ({ plugin, open, onClose }: PluginDetailsProps) => {
  if (!plugin) return null;

  const categories = plugin.mctools_categorieslist
    ? plugin.mctools_categorieslist.split(',').map(cat => cat.trim())
    : [];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start gap-4">
            {plugin.mctools_logourl ? (
              <img 
                src={plugin.mctools_logourl} 
                alt={`${plugin.mctools_name} logo`}
                className="w-16 h-16 rounded-xl object-cover bg-muted flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-xl">
                  {plugin.mctools_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl font-bold leading-tight">
                {plugin.mctools_name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <User size={16} />
                <span>{plugin.mctools_authors}</span>
                <span>•</span>
                <span>v{plugin.mctools_version}</span>
              </div>
              <div className="mt-3">
                <StarRating rating={parseFloat(plugin.mctools_averagefeedbackratingallversions)} size={20} />
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            {plugin.mctools_description}
          </p>

          {categories.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Categories</h4>
              <div className="flex flex-wrap gap-1">
                {categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Download size={16} className="text-muted-foreground" />
                <span className="font-medium">Total Downloads</span>
              </div>
              <p className="text-xl font-bold text-primary">
                {formatNumber(plugin.mctools_totaldownloadcount)}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-muted-foreground" />
                <span className="font-medium">Last Updated</span>
              </div>
              <p className="text-xl font-bold text-primary">
                {formatDate(plugin.mctools_latestreleasedate)}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-2">Latest Release Notes</h4>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {plugin.mctools_latestreleasenote || 'No release notes available.'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {plugin.mctools_projecturl && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open(plugin.mctools_projecturl, '_blank')}
              >
                <Github size={16} className="mr-2" />
                View on GitHub
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={() => window.open(plugin.mctools_downloadurl, '_blank')}
            >
              <ExternalLink size={16} className="mr-2" />
              Download Plugin
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">First Release:</span><br />
              {formatDate(plugin.mctools_firstreleasedate)}
            </div>
            <div>
              <span className="font-medium">Open Source:</span><br />
              {plugin.mctools_isopensource ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};