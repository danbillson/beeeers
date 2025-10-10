/**
 * New Brew Log Page
 * Create a new brew log for a recipe
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createBrewLog } from "@/app/logs/actions";

// Mock data
const mockRecipe = {
  id: "1",
  name: "NEIPA 10L Batch",
};

const issueOptions = [
  "oxidation",
  "low-carbonation",
  "stuck-fermentation",
  "slight-off-flavor",
  "too-sweet",
  "too-bitter",
  "cloudy",
  "over-carbonated",
];

export default function NewBrewLogPage({ params }: { params: { id: string } }) {
  const recipe = mockRecipe;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/recipes/${recipe.id}/logs`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Logs
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{recipe.name} - New Brew Log</h1>
            <p className="text-muted-foreground">Record your brewing session</p>
          </div>
        </div>
      </div>

      <form
        action={createBrewLog.bind(null, recipe.id)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Left Column - Measurements */}
        <div className="space-y-6">
          {/* Brew Date */}
          <Card>
            <CardHeader>
              <CardTitle>Brew Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="brewDate">Brew Date</Label>
                <Input
                  id="brewDate"
                  name="brewDate"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Gravity Readings */}
          <Card>
            <CardHeader>
              <CardTitle>Gravity Readings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="measuredOG">Measured OG</Label>
                  <Input
                    id="measuredOG"
                    name="measuredOG"
                    type="number"
                    step="0.001"
                    placeholder="1.060"
                  />
                </div>
                <div>
                  <Label htmlFor="measuredFG">Measured FG</Label>
                  <Input
                    id="measuredFG"
                    name="measuredFG"
                    type="number"
                    step="0.001"
                    placeholder="1.012"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fermentation */}
          <Card>
            <CardHeader>
              <CardTitle>Fermentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="fermentationTemp">
                  Fermentation Temperature (°C)
                </Label>
                <Input
                  id="fermentationTemp"
                  name="fermentationTempC"
                  type="number"
                  placeholder="20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Issues & Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {issueOptions.map((issue) => (
                  <div key={issue} className="flex items-center space-x-2">
                    <Checkbox id={issue} name="issues" value={issue} />
                    <Label
                      htmlFor={issue}
                      className="text-sm font-normal capitalize"
                    >
                      {issue.replace("-", " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Notes */}
        <div className="space-y-6">
          {/* Brew Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Brew Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="notes"
                placeholder="Record observations during brewing, fermentation, and packaging..."
                rows={8}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Tasting Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Tasting Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="tastingNotes"
                placeholder="Describe the final beer: appearance, aroma, flavor, mouthfeel..."
                rows={8}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Save Brew Log
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

