/**
 * Recipe Editor
 * Two-column layout with auto-calculating stats
 */

import { RecipeStatsBar } from "@/components/RecipeStatsBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2 } from "lucide-react";
import { useRecipeCalculations } from "@/hooks/use-recipe-calculations";

// Mock data for now
const mockRecipe = {
  id: "1",
  name: "NEIPA 10L Batch",
  style: "New England IPA",
  method: "all-grain" as const,
  batchSizeL: 10,
  boilSizeL: 12,
  efficiency: 75,
  boilTimeMin: 60,
  hopUtilizationMultiplier: 0.88,
  notes: "Hazy IPA with tropical fruit notes",
  fermentables: [
    { ingredient: { ppg: 3.0, colorLovibond: 2 }, amountKg: 2.5 },
    { ingredient: { ppg: 2.9, colorLovibond: 9 }, amountKg: 0.5 },
    { ingredient: { ppg: 3.0, colorLovibond: 2 }, amountKg: 0.3 },
  ],
  hops: [
    {
      ingredient: { alphaAcid: 12 },
      amountG: 15,
      timeMin: 60,
      type: "boil" as const,
    },
    {
      ingredient: { alphaAcid: 12 },
      amountG: 25,
      timeMin: 5,
      type: "whirlpool" as const,
    },
    {
      ingredient: { alphaAcid: 12 },
      amountG: 30,
      timeMin: 0,
      type: "dry-hop" as const,
    },
  ],
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

export default function RecipeEditorPage() {
  // Calculate stats using the hook
  const stats = useRecipeCalculations(mockRecipe);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Stats Bar */}
      <RecipeStatsBar stats={stats} />

      {/* Recipe Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{mockRecipe.name}</h1>
          <p className="text-muted-foreground">Edit your brewing recipe</p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
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
                <Input id="name" defaultValue={mockRecipe.name} />
              </Field>
              <Field>
                <FieldLabel htmlFor="style">Style</FieldLabel>
                <Input id="style" defaultValue={mockRecipe.style} />
              </Field>
              <Field>
                <FieldLabel htmlFor="method">Method</FieldLabel>
                <Select defaultValue={mockRecipe.method}>
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
                  <Input
                    id="batchSize"
                    type="number"
                    defaultValue={mockRecipe.batchSizeL}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="boilSize">Boil Size (L)</FieldLabel>
                  <Input
                    id="boilSize"
                    type="number"
                    defaultValue={mockRecipe.boilSizeL}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="efficiency">Efficiency (%)</FieldLabel>
                  <Input
                    id="efficiency"
                    type="number"
                    defaultValue={mockRecipe.efficiency}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="boilTime">Boil Time (min)</FieldLabel>
                  <Input
                    id="boilTime"
                    type="number"
                    defaultValue={mockRecipe.boilTimeMin}
                  />
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
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecipe.fermentables.map((fermentable, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <Select defaultValue="pale-2-row">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pale-2-row">Pale 2-Row</SelectItem>
                          <SelectItem value="munich">Munich</SelectItem>
                          <SelectItem value="wheat">Wheat Malt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        defaultValue={fermentable.amountKg}
                        placeholder="kg"
                      />
                    </div>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mash Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Mash Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-16">
                    <Input type="number" defaultValue="65" placeholder="°C" />
                  </div>
                  <div className="flex-1">
                    <FieldLabel>Single Infusion</FieldLabel>
                  </div>
                  <div className="w-20">
                    <Input type="number" defaultValue="60" placeholder="min" />
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="text-sm space-y-1">
                  <div>Mash Water: {stats.waterVolumes.mash}L</div>
                  <div>Sparge Water: {stats.waterVolumes.sparge}L</div>
                </div>
              </div>
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
                <Select defaultValue="us-05">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-05">US-05 (Safale)</SelectItem>
                    <SelectItem value="s-04">S-04 (Safale)</SelectItem>
                    <SelectItem value="wlp001">WLP001 (White Labs)</SelectItem>
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
                <Input
                  id="fermentationTemp"
                  type="number"
                  defaultValue={mockRecipe.fermentationTempC}
                />
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
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecipe.hops.map((hop, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <Select defaultValue="citra">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="citra">Citra</SelectItem>
                          <SelectItem value="mosaic">Mosaic</SelectItem>
                          <SelectItem value="cascade">Cascade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-20">
                      <Input
                        type="number"
                        defaultValue={hop.amountG}
                        placeholder="g"
                      />
                    </div>
                    <div className="w-20">
                      <Input
                        type="number"
                        defaultValue={hop.timeMin}
                        placeholder="min"
                      />
                    </div>
                    <div className="w-24">
                      <Select defaultValue={hop.type}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="boil">Boil</SelectItem>
                          <SelectItem value="whirlpool">Whirlpool</SelectItem>
                          <SelectItem value="dry-hop">Dry Hop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
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
                  <Plus className="w-4 h-4 mr-2" />
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
                defaultValue={mockRecipe.notes}
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
