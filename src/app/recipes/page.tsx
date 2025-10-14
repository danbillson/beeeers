/**
 * Recipes Dashboard
 * Lists all recipes with quick stats and actions
 */

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Plus, Edit, Copy, Calendar, Beer } from "lucide-react";
import Link from "next/link";

// Mock data for now - will be replaced with real data fetching
const mockRecipes = [
  {
    id: "1",
    name: "NEIPA 10L Batch",
    style: "New England IPA",
    abv: 6.5,
    ibu: 59,
    og: 1.062,
    fg: 1.013,
    srm: 5.2,
    lastBrewed: "2024-01-15",
  },
  {
    id: "2",
    name: "Classic Pilsner",
    style: "German Pilsner",
    abv: 4.8,
    ibu: 35,
    og: 1.048,
    fg: 1.012,
    srm: 3.5,
    lastBrewed: null,
  },
];

export default function RecipesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recipes</h1>
          <p className="text-muted-foreground">
            Manage your brewing recipes and track your creations
          </p>
        </div>
        <Link href="/recipes/new">
          <Button>
            <Plus />
            New Recipe
          </Button>
        </Link>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockRecipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{recipe.name}</CardTitle>
                  <CardDescription>{recipe.style}</CardDescription>
                </div>
                <Badge variant="secondary">{recipe.abv}% ABV</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">OG:</span>
                  <span className="ml-2 font-medium">{recipe.og}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">FG:</span>
                  <span className="ml-2 font-medium">{recipe.fg}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">IBU:</span>
                  <span className="ml-2 font-medium">{recipe.ibu}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">SRM:</span>
                  <span className="ml-2 font-medium">{recipe.srm}</span>
                </div>
              </div>

              {/* Last Brewed */}
              {recipe.lastBrewed && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last brewed:{" "}
                  {new Date(recipe.lastBrewed).toLocaleDateString()}
                </div>
              )}

              {/* Actions */}
              <ButtonGroup className="w-full">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/recipes/${recipe.id}`} className="flex-1">
                    <Edit />
                    Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Copy />
                </Button>
              </ButtonGroup>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockRecipes.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Beer />
            </EmptyMedia>
            <EmptyTitle>No recipes yet</EmptyTitle>
            <EmptyDescription>
              Create your first brewing recipe to get started
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/recipes/new">
              <Button>
                <Plus />
                Create Recipe
              </Button>
            </Link>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
