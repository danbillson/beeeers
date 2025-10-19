"use client";

/**
 * New Recipe Page
 * Create a new brewing recipe
 */

import { useState } from "react";
import { nanoid } from "nanoid";
import { Save, Wheat, Beer, Thermometer, Plus, Trash2 } from "lucide-react";
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
import { useRecipeCalculations } from "@/hooks/use-recipe-calculations";
import {
  SALT_COMPOSITIONS,
  type IonProfile,
  type SaltAddition,
  calculateClToSO4Ratio,
  getWaterProfileDescription,
} from "@/lib/calc/water";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

type RecipeMethod = "all-grain" | "extract" | "partial";

type FermentableOption = {
  id: string;
  name: string;
  origin: string;
  potential: number;
  potentialUnit?: "PPG" | "PKL";
  color: number;
  colorUnit?: "L" | "SRM" | "EBC";
  description: string;
};

type HopOption = {
  id: string;
  name: string;
  origin: string;
  alphaAcid: number;
  description: string;
};

type FermentableEntry = {
  id: string;
  optionId: string;
  name: string;
  origin: string;
  amountKg: number;
  potential: number;
  potentialUnit?: "PPG" | "PKL";
  color: number;
  colorUnit?: "L" | "SRM" | "EBC";
};

type HopEntry = {
  id: string;
  optionId: string;
  name: string;
  origin: string;
  amountG: number;
  timeMin: number;
  type: "boil" | "whirlpool" | "dry-hop";
  alphaAcid: number;
};

type RecipeFormState = {
  name: string;
  style: string;
  method: RecipeMethod;
  batchSizeL: number;
  boilSizeL: number;
  efficiency: number;
  boilTimeMin: number;
  hopUtilizationMultiplier: number;
  fermentationTempC: number;
  notes: string;
};

type WaterProfileOption = {
  id: string;
  name: string;
  description: string;
  profile: IonProfile;
};

type SaltOption = {
  id: string;
  name: string;
  description: string;
};

type WaterAdditionEntry = {
  id: string;
  optionId: string;
  name: string;
  amountG: number;
  volumeL?: number;
};

type MashStepEntry = {
  id: string;
  stepType: "strike" | "sparge";
  temperatureC: number;
  timeMin: number;
};

const FERMENTABLE_OPTIONS: FermentableOption[] = [
  {
    id: "pale-2-row",
    name: "Pale 2-Row",
    origin: "US",
    potential: 36,
    color: 2,
    description: "Base malt for most beer styles",
  },
  {
    id: "pilsner",
    name: "Pilsner",
    origin: "Germany",
    potential: 37,
    color: 1.5,
    description: "Light base malt for lagers and pilsners",
  },
  {
    id: "munich",
    name: "Munich",
    origin: "Germany",
    potential: 35,
    color: 9,
    description: "Malt with rich, toasty flavor",
  },
  {
    id: "crystal-60",
    name: "Crystal 60",
    origin: "UK",
    potential: 33,
    color: 60,
    description: "Caramel malt for sweetness and color",
  },
  {
    id: "wheat-malt",
    name: "Wheat Malt",
    origin: "Germany",
    potential: 38,
    color: 2,
    description: "Wheat malt for head retention and body",
  },
  {
    id: "vienna",
    name: "Vienna",
    origin: "Austria",
    potential: 35,
    color: 4,
    description: "Light amber malt with toasty notes",
  },
  {
    id: "carapils",
    name: "CaraPils",
    origin: "Germany",
    potential: 33,
    color: 2,
    description: "Dextrin malt for body and head retention",
  },
  {
    id: "chocolate",
    name: "Chocolate",
    origin: "UK",
    potential: 28,
    color: 350,
    description: "Dark roasted malt for chocolate flavor",
  },
  {
    id: "roasted-barley",
    name: "Roasted Barley",
    origin: "UK",
    potential: 25,
    color: 500,
    description: "Very dark malt for stout character",
  },
  {
    id: "flaked-oats",
    name: "Oats (Flaked)",
    origin: "US",
    potential: 33,
    color: 1,
    description: "Unmalted oats for smooth mouthfeel",
  },
];

const HOP_OPTIONS: HopOption[] = [
  {
    id: "citra",
    name: "Citra",
    origin: "US",
    alphaAcid: 12,
    description: "Tropical fruit, citrus, and passionfruit",
  },
  {
    id: "mosaic",
    name: "Mosaic",
    origin: "US",
    alphaAcid: 12,
    description: "Blueberry, tropical fruit, and citrus",
  },
  {
    id: "cascade",
    name: "Cascade",
    origin: "US",
    alphaAcid: 6,
    description: "Floral, spicy, and citrusy",
  },
  {
    id: "simcoe",
    name: "Simcoe",
    origin: "US",
    alphaAcid: 13,
    description: "Pine, earth, and citrus",
  },
  {
    id: "magnum",
    name: "Magnum",
    origin: "Germany",
    alphaAcid: 14,
    description: "Clean bittering hop with minimal aroma",
  },
  {
    id: "amarillo",
    name: "Amarillo",
    origin: "US",
    alphaAcid: 9,
    description: "Orange, grapefruit, and floral",
  },
  {
    id: "centennial",
    name: "Centennial",
    origin: "US",
    alphaAcid: 10,
    description: "Citrus and floral, similar to Cascade",
  },
  {
    id: "saaz",
    name: "Saaz",
    origin: "Czech Republic",
    alphaAcid: 4,
    description: "Classic noble hop, spicy and herbal",
  },
  {
    id: "hallertau",
    name: "Hallertau",
    origin: "Germany",
    alphaAcid: 5,
    description: "Noble hop with floral and spicy notes",
  },
];

const WATER_PROFILE_OPTIONS: WaterProfileOption[] = [
  {
    id: "reverse-osmosis",
    name: "Reverse Osmosis",
    description: "Neutral starting point with minimal minerals",
    profile: { ca: 0, mg: 0, na: 0, cl: 0, so4: 0, hco3: 0 },
  },
  {
    id: "pilsen",
    name: "Pilsen Lager",
    description: "Soft water ideal for delicate lagers",
    profile: { ca: 7, mg: 3, na: 2, cl: 5, so4: 5, hco3: 15 },
  },
  {
    id: "dortmund",
    name: "Dortmund Export",
    description: "Balanced European profile with elevated minerals",
    profile: { ca: 60, mg: 12, na: 40, cl: 60, so4: 120, hco3: 180 },
  },
  {
    id: "burton",
    name: "Burton-on-Trent",
    description: "High sulfate profile for assertive pale ales",
    profile: { ca: 275, mg: 40, na: 25, cl: 35, so4: 450, hco3: 300 },
  },
];

const DEFAULT_WATER_PROFILE_ID = WATER_PROFILE_OPTIONS[0].id;

const SALT_OPTIONS: SaltOption[] = [
  {
    id: "Gypsum (CaSO4·2H2O)",
    name: "Gypsum (CaSO4·2H2O)",
    description: "Adds calcium and sulfate for crisper bitterness",
  },
  {
    id: "Calcium Chloride (CaCl2·2H2O)",
    name: "Calcium Chloride (CaCl2·2H2O)",
    description: "Boosts calcium and chloride for malt roundness",
  },
  {
    id: "Epsom Salt (MgSO4·7H2O)",
    name: "Epsom Salt (MgSO4·7H2O)",
    description: "Raises magnesium and sulfate for hop expression",
  },
  {
    id: "Table Salt (NaCl)",
    name: "Table Salt (NaCl)",
    description: "Adds sodium and chloride for body",
  },
  {
    id: "Chalk (CaCO3)",
    name: "Chalk (CaCO3)",
    description: "Increases calcium and bicarbonate for dark beers",
  },
  {
    id: "Baking Soda (NaHCO3)",
    name: "Baking Soda (NaHCO3)",
    description: "Raises sodium and bicarbonate to balance acidity",
  },
];
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
  const [formState, setFormState] = useState<RecipeFormState>({
    name: "",
    style: "",
    method: "all-grain",
    batchSizeL: 10,
    boilSizeL: 12,
    efficiency: 75,
    boilTimeMin: 60,
    hopUtilizationMultiplier: 1.0,
    fermentationTempC: 20,
    notes: "",
  });
  const [fermentables, setFermentables] = useState<FermentableEntry[]>([]);
  const [hops, setHops] = useState<HopEntry[]>([]);
  const [waterProfileId, setWaterProfileId] = useState(
    DEFAULT_WATER_PROFILE_ID
  );
  const [waterAdditions, setWaterAdditions] = useState<WaterAdditionEntry[]>(
    []
  );
  const [mashSteps, setMashSteps] = useState<MashStepEntry[]>([]);

  const selectedWaterProfile =
    WATER_PROFILE_OPTIONS.find((option) => option.id === waterProfileId) ??
    WATER_PROFILE_OPTIONS[0];
  const baseWaterProfile = selectedWaterProfile.profile;
  const waterAdditionsForCalc: SaltAddition[] = waterAdditions.flatMap(
    (addition) => {
      const salt = SALT_COMPOSITIONS[addition.name];
      if (!salt || addition.amountG <= 0) {
        return [];
      }

      return Object.keys(salt).map((ion) => ({
        name: addition.name,
        amountG: addition.amountG,
        ionType: ion as SaltAddition["ionType"],
        volumeL: addition.volumeL ?? formState.batchSizeL,
      }));
    }
  );

  const stats = useRecipeCalculations({
    fermentables: fermentables.map((fermentable) => ({
      ingredient: {
        potential: fermentable.potential,
        potentialUnit: fermentable.potentialUnit ?? "PPG",
        color: fermentable.color,
        colorUnit: fermentable.colorUnit ?? "L",
      },
      amountKg: fermentable.amountKg,
    })),
    hops: hops.map((hop) => ({
      ingredient: { alphaAcid: hop.alphaAcid },
      amountG: hop.amountG,
      timeMin: hop.timeMin,
      type: hop.type,
      name: hop.name,
    })),
    yeast: emptyRecipe.yeast,
    waterAdditions: waterAdditionsForCalc,
    batchSizeL: formState.batchSizeL,
    boilSizeL: formState.boilSizeL,
    efficiency: formState.efficiency,
    boilTimeMin: formState.boilTimeMin,
    hopUtilizationMultiplier: formState.hopUtilizationMultiplier,
    baseWaterProfile,
    fermentationTempC: formState.fermentationTempC,
  });
  const chlorideToSulfateRatioValue = calculateClToSO4Ratio(stats.ionProfile);
  const chlorideToSulfateRatio =
    chlorideToSulfateRatioValue === Infinity
      ? "∞"
      : chlorideToSulfateRatioValue.toFixed(2);
  const waterProfileCharacter = getWaterProfileDescription(stats.ionProfile);

  function handleAddMashStep() {
    setMashSteps((previous) => [
      ...previous,
      {
        id: nanoid(),
        stepType:
          previous.length > 0
            ? previous[previous.length - 1].stepType
            : "strike",
        temperatureC:
          previous.length > 0 ? previous[previous.length - 1].temperatureC : 66,
        timeMin:
          previous.length > 0 ? previous[previous.length - 1].timeMin : 60,
      },
    ]);
  }

  function handleMashStepType(id: string, stepType: MashStepEntry["stepType"]) {
    setMashSteps((previous) =>
      previous.map((step) =>
        step.id === id
          ? {
              ...step,
              stepType,
            }
          : step
      )
    );
  }

  function handleMashStepTemperature(id: string, temperature: number) {
    setMashSteps((previous) =>
      previous.map((step) =>
        step.id === id
          ? { ...step, temperatureC: temperature < 0 ? 0 : temperature }
          : step
      )
    );
  }

  function handleMashStepTime(id: string, time: number) {
    setMashSteps((previous) =>
      previous.map((step) =>
        step.id === id ? { ...step, timeMin: time < 0 ? 0 : time } : step
      )
    );
  }

  function handleRemoveMashStep(id: string) {
    setMashSteps((previous) => previous.filter((step) => step.id !== id));
  }

  function handleAddFermentable() {
    const option = FERMENTABLE_OPTIONS[0];
    if (!option) {
      return;
    }

    setFermentables((previous) => [
      ...previous,
      {
        id: nanoid(),
        optionId: option.id,
        name: option.name,
        origin: option.origin,
        amountKg: 1,
        potential: option.potential,
        potentialUnit: option.potentialUnit,
        color: option.color,
        colorUnit: option.colorUnit,
      },
    ]);
  }

  function handleFermentableSelection(id: string, optionId: string) {
    const option = FERMENTABLE_OPTIONS.find((item) => item.id === optionId);
    if (!option) {
      return;
    }

    setFermentables((previous) =>
      previous.map((fermentable) =>
        fermentable.id === id
          ? {
              ...fermentable,
              optionId,
              name: option.name,
              origin: option.origin,
              potential: option.potential,
              potentialUnit: option.potentialUnit,
              color: option.color,
              colorUnit: option.colorUnit,
            }
          : fermentable
      )
    );
  }

  function handleFermentableAmount(id: string, amount: number) {
    setFermentables((previous) =>
      previous.map((fermentable) =>
        fermentable.id === id
          ? { ...fermentable, amountKg: amount < 0 ? 0 : amount }
          : fermentable
      )
    );
  }

  function handleRemoveFermentable(id: string) {
    setFermentables((previous) => previous.filter((item) => item.id !== id));
  }

  function handleAddHop() {
    const option = HOP_OPTIONS[0];
    if (!option) {
      return;
    }

    setHops((previous) => [
      ...previous,
      {
        id: nanoid(),
        optionId: option.id,
        name: option.name,
        origin: option.origin,
        amountG: 25,
        timeMin: 60,
        type: "boil",
        alphaAcid: option.alphaAcid,
      },
    ]);
  }

  function handleHopSelection(id: string, optionId: string) {
    const option = HOP_OPTIONS.find((item) => item.id === optionId);
    if (!option) {
      return;
    }

    setHops((previous) =>
      previous.map((hop) =>
        hop.id === id
          ? {
              ...hop,
              optionId,
              name: option.name,
              origin: option.origin,
              alphaAcid: option.alphaAcid,
            }
          : hop
      )
    );
  }

  function handleHopAmount(id: string, amount: number) {
    setHops((previous) =>
      previous.map((hop) =>
        hop.id === id ? { ...hop, amountG: amount < 0 ? 0 : amount } : hop
      )
    );
  }

  function handleHopTime(id: string, time: number) {
    setHops((previous) =>
      previous.map((hop) =>
        hop.id === id ? { ...hop, timeMin: time < 0 ? 0 : time } : hop
      )
    );
  }

  function handleHopType(id: string, type: HopEntry["type"]) {
    setHops((previous) =>
      previous.map((hop) => (hop.id === id ? { ...hop, type } : hop))
    );
  }

  function handleRemoveHop(id: string) {
    setHops((previous) => previous.filter((item) => item.id !== id));
  }

  function handleWaterProfileChange(id: string) {
    setWaterProfileId(id);
  }

  function handleAddWaterAddition() {
    const option = SALT_OPTIONS[0];
    if (!option) {
      return;
    }

    setWaterAdditions((previous) => [
      ...previous,
      {
        id: nanoid(),
        optionId: option.id,
        name: option.name,
        amountG: 1,
        volumeL: formState.batchSizeL,
      },
    ]);
  }

  function handleWaterAdditionSelection(id: string, optionId: string) {
    const option = SALT_OPTIONS.find((item) => item.id === optionId);
    if (!option) {
      return;
    }

    setWaterAdditions((previous) =>
      previous.map((addition) =>
        addition.id === id
          ? {
              ...addition,
              optionId,
              name: option.name,
            }
          : addition
      )
    );
  }

  function handleWaterAdditionAmount(id: string, amount: number) {
    setWaterAdditions((previous) =>
      previous.map((addition) =>
        addition.id === id
          ? { ...addition, amountG: amount < 0 ? 0 : amount }
          : addition
      )
    );
  }

  function handleRemoveWaterAddition(id: string) {
    setWaterAdditions((previous) => previous.filter((item) => item.id !== id));
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Stats Bar */}
      <RecipeStatsBar stats={stats} />

      {/* Recipe Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">New Recipe</h1>
          <p className="text-muted-foreground">Create a new brewing recipe</p>
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
                <Input
                  id="name"
                  placeholder="e.g., NEIPA 10L Batch"
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="style">Style</FieldLabel>
                <Input
                  id="style"
                  placeholder="e.g., New England IPA"
                  value={formState.style}
                  onChange={(event) =>
                    setFormState((previous) => ({
                      ...previous,
                      style: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="method">Method</FieldLabel>
                <Select
                  value={formState.method}
                  onValueChange={(value) =>
                    setFormState((previous) => ({
                      ...previous,
                      method: value as RecipeMethod,
                    }))
                  }
                >
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
                    min={0}
                    step={0.5}
                    value={formState.batchSizeL}
                    onChange={(event) =>
                      setFormState((previous) => ({
                        ...previous,
                        batchSizeL: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="boilSize">Boil Size (L)</FieldLabel>
                  <Input
                    id="boilSize"
                    type="number"
                    min={0}
                    step={0.5}
                    value={formState.boilSizeL}
                    onChange={(event) =>
                      setFormState((previous) => ({
                        ...previous,
                        boilSizeL: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="efficiency">Efficiency (%)</FieldLabel>
                  <Input
                    id="efficiency"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={formState.efficiency}
                    onChange={(event) =>
                      setFormState((previous) => ({
                        ...previous,
                        efficiency: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="boilTime">Boil Time (min)</FieldLabel>
                  <Input
                    id="boilTime"
                    type="number"
                    min={0}
                    step={5}
                    value={formState.boilTimeMin}
                    onChange={(event) =>
                      setFormState((previous) => ({
                        ...previous,
                        boilTimeMin: Number(event.target.value) || 0,
                      }))
                    }
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddFermentable}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Fermentable
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {fermentables.length === 0 ? (
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
              ) : (
                <div className="space-y-3">
                  {fermentables.map((fermentable) => (
                    <div
                      key={fermentable.id}
                      className="flex flex-wrap items-center gap-4 rounded-lg border p-3"
                    >
                      <div className="min-w-[200px] flex-1">
                        <Select
                          value={fermentable.optionId}
                          onValueChange={(value) =>
                            handleFermentableSelection(fermentable.id, value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select fermentable" />
                          </SelectTrigger>
                          <SelectContent
                            align="start"
                            className="min-w-[16rem]"
                          >
                            {FERMENTABLE_OPTIONS.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                <div className="flex gap-2 items-baseline">
                                  <div className="text-sm font-medium">
                                    {option.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {option.origin} • {option.color}°L
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full sm:w-32">
                        <InputGroup>
                          <InputGroupInput
                            type="number"
                            min={0}
                            step={0.1}
                            value={fermentable.amountKg}
                            onChange={(event) =>
                              handleFermentableAmount(
                                fermentable.id,
                                Number(event.target.value) || 0
                              )
                            }
                            aria-label="Fermentable amount (kg)"
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupText>kg</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleRemoveFermentable(fermentable.id)}
                        aria-label={`Remove ${fermentable.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mash Guidelines */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mash Schedule</CardTitle>
                <Button size="sm" variant="outline" onClick={handleAddMashStep}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Step
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mashSteps.length === 0 ? (
                <Empty className="border-0">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Thermometer />
                    </EmptyMedia>
                    <EmptyTitle>No mash steps added yet</EmptyTitle>
                    <EmptyDescription>
                      Use “Add Step” to capture each rest temperature and hold
                      time
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="space-y-3">
                  {mashSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex flex-wrap items-end gap-4 rounded-lg border p-3"
                    >
                      <div className="min-w-[160px] flex-1 space-y-1">
                        <FieldLabel className="text-xs text-muted-foreground">
                          Type
                        </FieldLabel>
                        <Select
                          value={step.stepType}
                          onValueChange={(value) =>
                            handleMashStepType(
                              step.id,
                              value as MashStepEntry["stepType"]
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select step type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="strike">Strike</SelectItem>
                            <SelectItem value="sparge">Sparge</SelectItem>
                            <SelectItem value="mashout">Mashout</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 min-w-[100px] space-y-1">
                        <FieldLabel className="text-xs text-muted-foreground">
                          Temperature
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            type="number"
                            step={0.5}
                            min={0}
                            value={step.temperatureC}
                            onChange={(event) =>
                              handleMashStepTemperature(
                                step.id,
                                Number(event.target.value) || 0
                              )
                            }
                            aria-label={`Mash step ${
                              index + 1
                            } temperature (°C)`}
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupText>°C</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                      <div className="flex-1 min-w-[100px] space-y-1">
                        <FieldLabel className="text-xs text-muted-foreground">
                          Time
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            type="number"
                            min={0}
                            step={5}
                            value={step.timeMin}
                            onChange={(event) =>
                              handleMashStepTime(
                                step.id,
                                Number(event.target.value) || 0
                              )
                            }
                            aria-label={`Mash step ${index + 1} time (minutes)`}
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupText>min</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleRemoveMashStep(step.id)}
                        aria-label={`Remove mash step ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
                  min={0}
                  value={formState.fermentationTempC}
                  onChange={(event) =>
                    setFormState((previous) => ({
                      ...previous,
                      fermentationTempC: Number(event.target.value) || 0,
                    }))
                  }
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
                <Button size="sm" variant="outline" onClick={handleAddHop}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Hop
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {hops.length === 0 ? (
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
              ) : (
                <div className="space-y-3">
                  {hops.map((hop) => (
                    <div
                      key={hop.id}
                      className="flex flex-wrap items-center gap-4 rounded-lg border p-3"
                    >
                      <div className="min-w-[160px] flex-1">
                        <Select
                          value={hop.optionId}
                          onValueChange={(value) =>
                            handleHopSelection(hop.id, value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select hop" />
                          </SelectTrigger>
                          <SelectContent
                            align="start"
                            className="min-w-[16rem]"
                          >
                            {HOP_OPTIONS.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                <div className="flex gap-2 items-baseline">
                                  <div className="text-sm font-medium">
                                    {option.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {option.origin} • {option.alphaAcid}% AA
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full sm:w-20">
                        <InputGroup>
                          <InputGroupInput
                            type="number"
                            min={0}
                            step={1}
                            value={hop.amountG}
                            onChange={(event) =>
                              handleHopAmount(
                                hop.id,
                                Number(event.target.value) || 0
                              )
                            }
                            aria-label="Hop amount (g)"
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupText>g</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                      <div className="w-full sm:min-w-[120px] sm:w-30">
                        <Select
                          value={hop.type}
                          onValueChange={(value) =>
                            handleHopType(hop.id, value as HopEntry["type"])
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent align="start">
                            <SelectItem value="boil">Boil</SelectItem>
                            <SelectItem value="whirlpool">Whirlpool</SelectItem>
                            <SelectItem value="dry-hop">Dry Hop</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full sm:w-24">
                        <InputGroup>
                          <InputGroupInput
                            type="number"
                            min={0}
                            step={5}
                            value={hop.timeMin}
                            onChange={(event) =>
                              handleHopTime(
                                hop.id,
                                Number(event.target.value) || 0
                              )
                            }
                            aria-label="Addition time (minutes)"
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupText>min</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleRemoveHop(hop.id)}
                        aria-label={`Remove ${hop.name}`}
                        className="ml-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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

          {/* Water Chemistry */}
          <Card>
            <CardHeader>
              <CardTitle>Water Chemistry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Field>
                <FieldLabel>Base Profile</FieldLabel>
                <Select
                  value={waterProfileId}
                  onValueChange={handleWaterProfileChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="Select water profile"
                      className="[&_.text-xs]:hidden"
                    />
                  </SelectTrigger>
                  <SelectContent align="start">
                    {WATER_PROFILE_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <span>{option.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Salt Additions</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddWaterAddition}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Salt
                  </Button>
                </div>
                {waterAdditions.length === 0 ? (
                  <Empty className="border-0">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Thermometer />
                      </EmptyMedia>
                      <EmptyTitle>No salts added yet</EmptyTitle>
                      <EmptyDescription>
                        Choose brewing salts to tailor your water profile
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <div className="space-y-3">
                    {waterAdditions.map((addition) => (
                      <div
                        key={addition.id}
                        className="flex flex-wrap items-center gap-3 rounded-lg border p-3"
                      >
                        <div className="min-w-[200px] flex-1">
                          <Select
                            value={addition.optionId}
                            onValueChange={(value) =>
                              handleWaterAdditionSelection(addition.id, value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select salt" />
                            </SelectTrigger>
                            <SelectContent align="start">
                              {SALT_OPTIONS.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  <span>{option.name}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-28">
                          <InputGroup>
                            <InputGroupInput
                              type="number"
                              min={0}
                              step={0.1}
                              value={addition.amountG}
                              onChange={(event) =>
                                handleWaterAdditionAmount(
                                  addition.id,
                                  Number(event.target.value) || 0
                                )
                              }
                              aria-label="Salt amount (g)"
                            />
                            <InputGroupAddon align="inline-end">
                              <InputGroupText>g</InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleRemoveWaterAddition(addition.id)}
                          aria-label={`Remove ${addition.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3 rounded-lg bg-muted p-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>Ca: {stats.ionProfile.ca} ppm</div>
                  <div>Mg: {stats.ionProfile.mg} ppm</div>
                  <div>Na: {stats.ionProfile.na} ppm</div>
                  <div>Cl: {stats.ionProfile.cl} ppm</div>
                  <div>SO₄: {stats.ionProfile.so4} ppm</div>
                  <div>HCO₃: {stats.ionProfile.hco3} ppm</div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                  <span>Cl:SO₄ Ratio: {chlorideToSulfateRatio}</span>
                  <span className="inline-flex h-1 w-1 rounded-full bg-border" />
                  <span>{waterProfileCharacter}</span>
                </div>
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
                value={formState.notes}
                onChange={(event) =>
                  setFormState((previous) => ({
                    ...previous,
                    notes: event.target.value,
                  }))
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
