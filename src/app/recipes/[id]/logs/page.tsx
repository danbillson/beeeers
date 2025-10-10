/**
 * Brew Logs for a Recipe
 * Shows all brew sessions for a specific recipe
 */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Calendar, Eye } from "lucide-react";
import Link from "next/link";

// Mock data
const mockBrewLogs = [
  {
    id: "1",
    brewDate: "2024-01-15",
    measuredOG: 1.06,
    measuredFG: 1.012,
    actualABV: 6.3,
    fermentationTempC: 20,
    notes: "Great fermentation, slight off-flavor in finish",
    issues: ["slight-off-flavor"],
  },
  {
    id: "2",
    brewDate: "2024-01-01",
    measuredOG: 1.065,
    measuredFG: 1.014,
    actualABV: 6.7,
    fermentationTempC: 22,
    notes: "Perfect batch, tropical fruit notes prominent",
    issues: [],
  },
];

const mockRecipe = {
  id: "1",
  name: "NEIPA 10L Batch",
};

export default function RecipeLogsPage({ params }: { params: { id: string } }) {
  const recipe = mockRecipe;
  const brewLogs = mockBrewLogs;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{recipe.name} - Brew Logs</h1>
          <p className="text-muted-foreground">
            Track your brewing sessions and outcomes
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/recipes/${recipe.id}`}>
            <Button variant="outline">Back to Recipe</Button>
          </Link>
          <Link href={`/recipes/${recipe.id}/logs/new`}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Brew Log
            </Button>
          </Link>
        </div>
      </div>

      {/* Brew Logs Table */}
      {brewLogs.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Brew Sessions</CardTitle>
            <CardDescription>
              {brewLogs.length} brew session{brewLogs.length !== 1 ? "s" : ""}{" "}
              recorded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>OG</TableHead>
                  <TableHead>FG</TableHead>
                  <TableHead>ABV</TableHead>
                  <TableHead>Temp (°C)</TableHead>
                  <TableHead>Issues</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brewLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(log.brewDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.measuredOG}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.measuredFG}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{log.actualABV}%</Badge>
                    </TableCell>
                    <TableCell>{log.fermentationTempC}</TableCell>
                    <TableCell>
                      {log.issues.length > 0 ? (
                        <div className="flex gap-1">
                          {log.issues.map((issue) => (
                            <Badge
                              key={issue}
                              variant="destructive"
                              className="text-xs"
                            >
                              {issue.replace("-", " ")}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          None
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {log.notes || "No notes"}
                    </TableCell>
                    <TableCell>
                      <Link href={`/logs/${log.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="text-6xl">📊</div>
              <div>
                <h3 className="text-lg font-semibold">No brew logs yet</h3>
                <p className="text-muted-foreground">
                  Start brewing this recipe and log your first session
                </p>
              </div>
              <Link href={`/recipes/${recipe.id}/logs/new`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Log
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
