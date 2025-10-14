/**
 * New Recipe Page
 * Create a new brewing recipe
 */

import { RecipeStatsBar } from "@/components/RecipeStatsBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft, Wheat, Beer, Thermometer } from "lucide-react";
import Link from "next/link";
import { useRecipeCalculations } from "@/hooks/use-recipe-calculations";

// Empty recipe template
const emptyRecipe = {
  id: "new",
  name: "",
  style: "",
  method: "all-grain" as const,
  batchSizeL: 10,
  boilSizeL: 12,
  efficiency: 75,
  boilTimeMin: 60,
  hopUtilizationMultiplier: 1.0,
  notes: "",
  fermentables: [],
  hops: [],
  yeast: { ingredient: { attenuationMin: 73, attenuationMax: 77 } },
  waterAdditions: [],
  baseWaterProfile: {
    ca: 0,
    mg: 0,
    na: 0,
    cl: 0,
    so4: 0,
    hco3: 0,
  },
  fermentationTempC: 20,
};

export default function NewRecipePage() {
  // Calculate stats using the hook
  const stats = useRecipeCalculations(emptyRecipe);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Stats Bar */}
      <RecipeStatsBar stats={stats} />

      {/* Recipe Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/recipes">
            <Button variant="outline" size="sm">
              <ArrowLeft />
              Back to Recipes
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">New Recipe</h1>
            <p className="text-muted-foreground">Create a new brewing recipe</p>
          </div>
        </div>
        <Button>
          <Save />
          Save Recipe
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Meta & Style Info */}
          <Card>
            <CardHeader>
              <CardTitle>Recipe Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel htmlFor="name">Recipe Name</FieldLabel>
                <Input id="name" placeholder="e.g., NEIPA 10L Batch" />
              </Field>
              <Field>
                <FieldLabel htmlFor="style">Style</FieldLabel>
                <Input id="style" placeholder="e.g., New England IPA" />
              </Field>
              <Field>
                <FieldLabel htmlFor="method">Method</FieldLabel>
                <Select defaultValue="all-grain">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-grain">All-Grain</SelectItem>
                    <SelectItem value="extract">Extract</SelectItem>
                    <SelectItem value="partial">Partial Mash</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="batchSize">Batch Size (L)</FieldLabel>
                  <Input id="batchSize" type="number" defaultValue={10} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="boilSize">Boil Size (L)</FieldLabel>
                  <Input id="boilSize" type="number" defaultValue={12} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="efficiency">Efficiency (%)</FieldLabel>
                  <Input id="efficiency" type="number" defaultValue={75} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="boilTime">Boil Time (min)</FieldLabel>
                  <Input id="boilTime" type="number" defaultValue={60} />
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* Fermentables */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Fermentables</CardTitle>
                <Button size="sm" variant="outline">
                  Add Fermentable
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Empty className="border-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Wheat />
                  </EmptyMedia>
                  <EmptyTitle>No fermentables added yet</EmptyTitle>
                  <EmptyDescription>
                    Add grains, extracts, or other fermentables to start
                    building your recipe
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CardContent>
          </Card>

          {/* Mash Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Mash Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Empty className="border-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Thermometer />
                  </EmptyMedia>
                  <EmptyTitle>No mash schedule defined</EmptyTitle>
                  <EmptyDescription>
                    Add fermentables to see mash calculations
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CardContent>
          </Card>

          {/* Yeast */}
          <Card>
            <CardHeader>
              <CardTitle>Yeast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Yeast Strain</FieldLabel>
                <Select defaultValue="">
                  <SelectTrigger>
                    <SelectValue placeholder="Select yeast strain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-05">US-05 (Safale)</SelectItem>
                    <SelectItem value="s-04">S-04 (Safale)</SelectItem>
                    <SelectItem value="wlp001">WLP001 (White Labs)</SelectItem>
                    <SelectItem value="kveik">Kveik (Lallemand)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="pitchAmount">Pitch Amount (g)</FieldLabel>
                <Input id="pitchAmount" type="number" placeholder="11" />
              </Field>
            </CardContent>
          </Card>

          {/* Priming */}
          <Card>
            <CardHeader>
              <CardTitle>Priming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel htmlFor="fermentationTemp">
                  Fermentation Temp (°C)
                </FieldLabel>
                <Input id="fermentationTemp" type="number" defaultValue={20} />
              </Field>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm space-y-1">
                  <div>Priming Sugar: {stats.primingSugar.amountG}g</div>
                  <div>Target CO₂: {stats.primingSugar.co2Volumes} volumes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Hops */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Hops</CardTitle>
                <Button size="sm" variant="outline">
                  Add Hop
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Empty className="border-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Beer />
                  </EmptyMedia>
                  <EmptyTitle>No hops added yet</EmptyTitle>
                  <EmptyDescription>
                    Add hop additions for bitterness, flavor, and aroma
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CardContent>
          </Card>

          {/* Water Chemistry */}
          <Card>
            <CardHeader>
              <CardTitle>Water Chemistry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Ca: {stats.ionProfile.ca} ppm</div>
                  <div>Mg: {stats.ionProfile.mg} ppm</div>
                  <div>Na: {stats.ionProfile.na} ppm</div>
                  <div>Cl: {stats.ionProfile.cl} ppm</div>
                  <div>SO₄: {stats.ionProfile.so4} ppm</div>
                  <div>HCO₃: {stats.ionProfile.hco3} ppm</div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Add Salt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add brewing notes, tips, or observations..."
                rows={6}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
