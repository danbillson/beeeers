/**
 * Brew Log Editor
 * Edit or view a specific brew session
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";

// Mock data
const mockBrewLog = {
  id: "1",
  recipeId: "1",
  recipeName: "NEIPA 10L Batch",
  brewDate: "2024-01-15",
  measuredOG: 1.06,
  measuredFG: 1.012,
  actualABV: 6.3,
  fermentationTempC: 20,
  notes:
    "Great fermentation, slight off-flavor in finish. Next time try lowering fermentation temp to 18°C.",
  issues: ["slight-off-flavor"],
  tastingNotes:
    "Tropical fruit notes are prominent, but there's a slight astringency in the finish. Body is good, carbonation perfect.",
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

export default function BrewLogPage({ params }: { params: { id: string } }) {
  const brewLog = mockBrewLog;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/recipes/${brewLog.recipeId}/logs`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Logs
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {brewLog.recipeName} - Brew Log
            </h1>
            <p className="text-muted-foreground">
              <Calendar className="w-4 h-4 inline mr-2" />
              {new Date(brewLog.brewDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Log
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Measurements */}
        <div className="space-y-6">
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
                    type="number"
                    step="0.001"
                    defaultValue={brewLog.measuredOG}
                    placeholder="1.060"
                  />
                </div>
                <div>
                  <Label htmlFor="measuredFG">Measured FG</Label>
                  <Input
                    id="measuredFG"
                    type="number"
                    step="0.001"
                    defaultValue={brewLog.measuredFG}
                    placeholder="1.012"
                  />
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm">
                  <span className="text-muted-foreground">Calculated ABV:</span>
                  <Badge className="ml-2">{brewLog.actualABV}%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fermentation */}
          <Card>
            <CardHeader>
              <CardTitle>Fermentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fermentationTemp">
                  Fermentation Temperature (°C)
                </Label>
                <Input
                  id="fermentationTemp"
                  type="number"
                  defaultValue={brewLog.fermentationTempC}
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
                    <Checkbox
                      id={issue}
                      defaultChecked={brewLog.issues.includes(issue)}
                    />
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
                defaultValue={brewLog.notes}
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
                defaultValue={brewLog.tastingNotes}
                placeholder="Describe the final beer: appearance, aroma, flavor, mouthfeel..."
                rows={8}
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
