/**
 * Recipe Stats Bar
 * Fixed header showing calculated brewing stats as badges
 */

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface RecipeStats {
  og: number;
  fg: number;
  abv: number;
  ibu: number;
  srm: number;
}

interface RecipeStatsBarProps {
  stats: RecipeStats;
  className?: string;
}

export function RecipeStatsBar({ stats, className }: RecipeStatsBarProps) {
  return (
    <Card
      className={`sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Stats:
          </span>
          <Badge variant="outline">OG {stats.og}</Badge>
          <Badge variant="outline">FG {stats.fg}</Badge>
          <Badge variant="outline">{stats.abv}% ABV</Badge>
          <Badge variant="outline">{stats.ibu} IBU</Badge>
          <Badge variant="outline">{stats.srm} SRM</Badge>
        </div>
      </div>
    </Card>
  );
}
