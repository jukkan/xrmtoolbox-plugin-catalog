import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StarRating } from "./StarRating";
import { Download, Github, Calendar, User } from "lucide-react";
import { format } from "date-fns";

export interface Plugin {
  mctools_pluginid: string;
  mctools_name: string;
  mctools_version: string;
  mctools_description: string;
  mctools_authors: string;
  mctools_categorieslist?: string;
  mctools_averagedownloadcount: string;
  mctools_totaldownloadcount: number;
  mctools_averagefeedbackratingallversions: string;
  mctools_downloadurl: string;
  mctools_firstreleasedate: string;
  mctools_isopensource: boolean;
  mctools_latestreleasedate: string;
  mctools_logourl?: string;
  mctools_projecturl: string;
  mctools_latestreleasenote: string;
}

interface PluginCardProps {
  plugin: Plugin;
  onViewDetails: (plugin: Plugin) => void;
}

export const PluginCard = ({ plugin, onViewDetails }: PluginCardProps) => {
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
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 group">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {plugin.mctools_logourl ? (
              <img 
                src={plugin.mctools_logourl} 
                alt={`${plugin.mctools_name} logo`}
                className="w-10 h-10 rounded-lg object-cover bg-muted"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {plugin.mctools_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {plugin.mctools_name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <User size={12} />
                {plugin.mctools_authors}
              </div>
            </div>
          </div>
          {plugin.mctools_projecturl && (
            <Button
              variant="outline"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                window.open(plugin.mctools_projecturl, '_blank');
              }}
            >
              <Github size={14} />
            </Button>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3">
          {plugin.mctools_description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
            {categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{categories.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="space-y-2">
          <StarRating rating={parseFloat(plugin.mctools_averagefeedbackratingallversions)} />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Download size={14} />
              {formatNumber(plugin.mctools_totaldownloadcount)}
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(plugin.mctools_latestreleasedate)}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => onViewDetails(plugin)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};