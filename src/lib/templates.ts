export type IngredientRef = {
  name: string;
  amount?: string;
  description?: string;
  usage?: string;
};

export type ProcessStep = {
  title: string;
  target: string;
  notes?: string;
};

export type Range = { min: number; max: number; unit: string };

export type BeerStyleTemplate = {
  id: string;
  name: string;
  styleFamily: "ale" | "lager" | "stout" | "mixed-fermentation" | "other";
  bjcp?: {
    category: string;
    code: string;
  };
  description: string;
  sensoryProfile: {
    aroma: string;
    flavor: string;
    appearance: string;
    mouthfeel: string;
    overallImpression?: string;
  };
  vitalStats: {
    og: Range;
    fg: Range;
    abv: Range;
    ibu: Range;
    srm: Range;
    attenuation?: Range;
    carbonationVolumes?: Range;
  };
  recommendedRecipe: {
    defaultBatchSizeL: number;
    method: "all-grain" | "partial" | "extract";
    efficiencyPct?: number;
    hopUtilizationMultiplier?: number;
    boilTimeMin?: number;
    mashProfile: ProcessStep[];
    fermentationProfile: ProcessStep[];
    conditioningProfile?: ProcessStep[];
  };
  waterProfile?: {
    baseProfileId?: string;
    preferredIonTargets?: Record<
      "ca" | "mg" | "na" | "cl" | "so4" | "hco3",
      number | Range
    >;
    adjustments?: string[];
  };
  keyIngredients: {
    baseMalts: IngredientRef[];
    specialtyMalts?: IngredientRef[];
    adjuncts?: IngredientRef[];
    hops: IngredientRef[];
    yeast: IngredientRef[];
    other?: IngredientRef[];
  };
  processGuidance?: {
    tips: string[];
    pitfalls?: string[];
    variations?: string[];
    foodPairings?: string[];
  };
  references?: {
    title: string;
    url: string;
    note?: string;
  }[];
};

export const beerStyleTemplates = {
  "american-pale-ale": {
    id: "american-pale-ale",
    name: "American Pale Ale",
    styleFamily: "ale",
    bjcp: { category: "18", code: "18B" },
    description:
      "Clean, hop-forward pale ale with a supportive malt backbone; versatile platform for American hops.",
    sensoryProfile: {
      aroma:
        "Moderate citrus/floral/pine hop aroma over low bready or lightly toasty malt.",
      flavor:
        "Hop-forward but balanced; clean fermentation; medium bitterness; dry to balanced finish.",
      appearance:
        "Pale gold to light amber; good clarity; white to off-white head.",
      mouthfeel: "Medium-light to medium body; medium carbonation.",
    },
    vitalStats: {
      og: { min: 1.045, max: 1.06, unit: "SG" },
      fg: { min: 1.01, max: 1.015, unit: "SG" },
      abv: { min: 4.8, max: 6.2, unit: "%" },
      ibu: { min: 30, max: 45, unit: "IBU" },
      srm: { min: 5, max: 10, unit: "SRM" },
    },
    recommendedRecipe: {
      defaultBatchSizeL: 20,
      method: "all-grain",
      efficiencyPct: 74,
      hopUtilizationMultiplier: 1.0,
      boilTimeMin: 60,
      mashProfile: [
        {
          title: "Saccharification",
          target: "66–67 °C for 60 min",
          notes: "Slightly higher temp if you want more body.",
        },
      ],
      fermentationProfile: [
        { title: "Primary", target: "18–20 °C until terminal gravity" },
        {
          title: "Cold Condition",
          target: "1–3 °C for 3–5 days",
          notes: "Drop bright; optional.",
        },
      ],
    },
    waterProfile: {
      preferredIonTargets: {
        ca: { min: 75, max: 125, unit: "ppm" },
        mg: { min: 5, max: 15, unit: "ppm" },
        na: { min: 0, max: 25, unit: "ppm" },
        cl: { min: 50, max: 100, unit: "ppm" },
        so4: { min: 150, max: 300, unit: "ppm" },
        hco3: { min: 0, max: 75, unit: "ppm" },
      },
      adjustments: [
        "Favor sulfate (2–4:1 SO₄:Cl⁻) for a crisper hop bite.",
        "Keep alkalinity low for pale color.",
      ],
    },
    keyIngredients: {
      baseMalts: [
        {
          name: "US 2-Row Pale",
          amount: "85–92%",
          description: "Clean, neutral base.",
        },
        {
          name: "Munich 10L",
          amount: "0–5%",
          description: "Light toast complexity (optional).",
        },
      ],
      specialtyMalts: [
        {
          name: "Crystal 20–60L",
          amount: "3–6%",
          description: "Color and balance; keep restrained.",
        },
      ],
      hops: [
        { name: "Cascade", usage: "Late/whirlpool/dry" },
        { name: "Centennial", usage: "Bittering/late" },
        { name: "Amarillo", usage: "Aroma" },
      ],
      yeast: [
        {
          name: "American Ale (US-05/1056/WLP001)",
          usage: "Primary",
          description: "Clean, attenuative.",
        },
      ],
    },
    processGuidance: {
      tips: [
        "60 min boil is sufficient; target firm but not harsh bitterness.",
        "Late hop additions and whirlpool shape flavor; keep crystal low for crisp finish.",
      ],
    },
  },

  "american-ipa": {
    id: "american-ipa",
    name: "American IPA",
    styleFamily: "ale",
    bjcp: { category: "21", code: "21A" },
    description:
      "Pronounced American hop character over a lean, clean malt base.",
    sensoryProfile: {
      aroma: "High hop aroma (citrus, pine, resin, tropical); low clean malt.",
      flavor:
        "Assertive hop flavor and bitterness; dry to medium-dry finish; very clean fermentation.",
      appearance: "Gold to light amber; good to brilliant clarity.",
      mouthfeel: "Medium-light to medium body; moderate carbonation.",
    },
    vitalStats: {
      og: { min: 1.056, max: 1.07, unit: "SG" },
      fg: { min: 1.008, max: 1.014, unit: "SG" },
      abv: { min: 6.0, max: 7.5, unit: "%" },
      ibu: { min: 40, max: 70, unit: "IBU" },
      srm: { min: 6, max: 14, unit: "SRM" },
    },
    recommendedRecipe: {
      defaultBatchSizeL: 20,
      method: "all-grain",
      efficiencyPct: 74,
      hopUtilizationMultiplier: 1.0,
      boilTimeMin: 60,
      mashProfile: [
        {
          title: "Saccharification",
          target: "65–66 °C for 60 min",
          notes: "Lower end for drier finish.",
        },
      ],
      fermentationProfile: [
        {
          title: "Primary",
          target: "18–20 °C",
          notes: "Dry hop post high-krausen 3–4 days.",
        },
      ],
    },
    waterProfile: {
      preferredIonTargets: {
        ca: { min: 75, max: 125, unit: "ppm" },
        mg: { min: 5, max: 20, unit: "ppm" },
        na: { min: 0, max: 25, unit: "ppm" },
        cl: { min: 40, max: 80, unit: "ppm" },
        so4: { min: 150, max: 300, unit: "ppm" },
        hco3: { min: 0, max: 75, unit: "ppm" },
      },
      adjustments: [
        "Sulfate-forward to sharpen bitterness.",
        "Keep TDS sensible (<~800 ppm total).",
      ],
    },
    keyIngredients: {
      baseMalts: [{ name: "US 2-Row Pale", amount: "90–95%" }],
      specialtyMalts: [
        {
          name: "Light Crystal 10–20L",
          amount: "0–4%",
          description: "Optional color tweak only.",
        },
      ],
      hops: [
        { name: "Centennial", usage: "Bittering/late" },
        { name: "Simcoe", usage: "Late/whirlpool" },
        { name: "Citra", usage: "Aroma/dry hop" },
      ],
      yeast: [{ name: "US-05/1056/WLP001", usage: "Primary" }],
    },
    processGuidance: {
      tips: ["Aggressive late hops; keep chloride modest for a crisp profile."],
      pitfalls: ["Too much crystal malt muddies bitterness."],
    },
  },

  "german-pils": {
    id: "german-pils",
    name: "German Pilsner",
    styleFamily: "lager",
    bjcp: { category: "5", code: "5D" },
    description:
      "Crisp, bitter, hop-forward pale lager with clean edges and dry finish.",
    sensoryProfile: {
      aroma: "Low grainy malt, medium-low spicy/floral noble hops.",
      flavor: "Firm bitterness, clean pils malt, dry finish.",
      appearance:
        "Straw to light gold, brilliant clarity, persistent white head.",
      mouthfeel: "Light body, medium carbonation, sharp finish.",
    },
    vitalStats: {
      og: { min: 1.044, max: 1.05, unit: "SG" },
      fg: { min: 1.008, max: 1.013, unit: "SG" },
      abv: { min: 4.4, max: 5.2, unit: "%" },
      ibu: { min: 25, max: 40, unit: "IBU" },
      srm: { min: 2, max: 4, unit: "SRM" },
    },
    recommendedRecipe: {
      defaultBatchSizeL: 20,
      method: "all-grain",
      efficiencyPct: 75,
      hopUtilizationMultiplier: 1.0,
      boilTimeMin: 90,
      mashProfile: [
        { title: "Beta-saccharification", target: "64–65 °C for 45–60 min" },
        { title: "Mash Out", target: "76 °C for 10 min" },
      ],
      fermentationProfile: [
        { title: "Primary", target: "9–10 °C for 10–12 days" },
        { title: "Diacetyl Rest", target: "15 °C for 24–48 h" },
        { title: "Lagering", target: "0–2 °C for 3–4 weeks" },
      ],
    },
    waterProfile: {
      preferredIonTargets: {
        ca: { min: 40, max: 60, unit: "ppm" },
        mg: { min: 5, max: 10, unit: "ppm" },
        na: { min: 5, max: 15, unit: "ppm" },
        cl: { min: 40, max: 50, unit: "ppm" },
        so4: { min: 80, max: 120, unit: "ppm" },
        hco3: { min: 0, max: 50, unit: "ppm" },
      },
      adjustments: [
        "Keep alkalinity low; soft-to-moderate sulfate to sharpen the finish.",
        "90-minute boil helps drive off DMS precursors.",
      ],
    },
    keyIngredients: {
      baseMalts: [{ name: "German Pilsner Malt", amount: "95–100%" }],
      hops: [
        { name: "Hallertau Mittelfrüh", usage: "First-wort/late" },
        { name: "Tettnang or Saaz", usage: "Late aroma" },
      ],
      yeast: [{ name: "German Lager (WY2124/W-34/70)", usage: "Primary" }],
    },
    processGuidance: {
      tips: ["High clarity; tight fermentation control; extended lagering."],
      variations: ["Light late-hop of Saphir for floral lift."],
    },
  },

  "munich-helles": {
    id: "munich-helles",
    name: "Munich Helles",
    styleFamily: "lager",
    bjcp: { category: "4", code: "4A" },
    description: "Soft, malt-accented pale lager with restrained bitterness.",
    sensoryProfile: {
      aroma: "Fresh pils malt, low floral hop.",
      flavor: "Bread-like malt dominates; bitterness supportive; clean finish.",
      appearance: "Pale straw to light gold; brilliant.",
      mouthfeel: "Medium-light body; smooth.",
    },
    vitalStats: {
      og: { min: 1.044, max: 1.048, unit: "SG" },
      fg: { min: 1.008, max: 1.012, unit: "SG" },
      abv: { min: 4.7, max: 5.4, unit: "%" },
      ibu: { min: 16, max: 22, unit: "IBU" },
      srm: { min: 3, max: 5, unit: "SRM" },
    },
    recommendedRecipe: {
      defaultBatchSizeL: 20,
      method: "all-grain",
      efficiencyPct: 75,
      boilTimeMin: 90,
      mashProfile: [
        { title: "Saccharification", target: "65 °C for 60 min" },
        { title: "Mash Out", target: "76 °C for 10 min" },
      ],
      fermentationProfile: [
        { title: "Primary", target: "9–10 °C for 10–12 days" },
        { title: "Diacetyl Rest", target: "15 °C for 24–48 h" },
        { title: "Lagering", target: "0–2 °C for 3–4 weeks" },
      ],
    },
    waterProfile: {
      preferredIonTargets: {
        ca: { min: 40, max: 60, unit: "ppm" },
        mg: { min: 5, max: 10, unit: "ppm" },
        na: { min: 5, max: 15, unit: "ppm" },
        cl: { min: 40, max: 60, unit: "ppm" },
        so4: { min: 40, max: 60, unit: "ppm" },
        hco3: { min: 0, max: 75, unit: "ppm" },
      },
      adjustments: [
        "Balanced SO₄:Cl⁻ ~1:1; keep minerals moderate to showcase malt.",
      ],
    },
    keyIngredients: {
      baseMalts: [{ name: "German Pilsner", amount: "90–100%" }],
      specialtyMalts: [
        {
          name: "Light Munich",
          amount: "0–10%",
          description: "Soft malt depth (optional).",
        },
      ],
      hops: [{ name: "Hallertau/Tettnang", usage: "Bittering & late" }],
      yeast: [{ name: "German Lager", usage: "Primary" }],
    },
  },

  "vienna-lager": {
    id: "vienna-lager",
    name: "Vienna Lager",
    styleFamily: "lager",
    bjcp: { category: "7", code: "7A" },
    description: "Toasty, elegant amber lager with balanced bitterness.",
    sensoryProfile: {
      aroma: "Clean malt with light toast; low floral/spicy hops.",
      flavor: "Moderate toasty malt, clean fermentation, balanced finish.",
      appearance: "Light amber to copper; brilliant.",
      mouthfeel: "Medium body, smooth.",
    },
    vitalStats: {
      og: { min: 1.048, max: 1.055, unit: "SG" },
      fg: { min: 1.01, max: 1.014, unit: "SG" },
      abv: { min: 4.7, max: 5.5, unit: "%" },
      ibu: { min: 18, max: 30, unit: "IBU" },
      srm: { min: 9, max: 15, unit: "SRM" },
    },
    recommendedRecipe: {
      defaultBatchSizeL: 20,
      method: "all-grain",
      efficiencyPct: 74,
      boilTimeMin: 60,
      mashProfile: [{ title: "Saccharification", target: "66 °C for 60 min" }],
      fermentationProfile: [
        { title: "Primary", target: "9–11 °C" },
        { title: "Lagering", target: "0–2 °C for 2–4 weeks" },
      ],
    },
    waterProfile: {
      adjustments: [
        "Keep alkalinity modest; balanced SO₄:Cl⁻; avoid excessive sulfate to preserve malt.",
      ],
    },
    keyIngredients: {
      baseMalts: [
        { name: "Vienna Malt", amount: "60–90%" },
        { name: "Pilsner", amount: "10–40%" },
      ],
      specialtyMalts: [{ name: "Munich 10L", amount: "0–20%" }],
      hops: [{ name: "Hallertau/Tettnang/Spalt", usage: "Bittering & late" }],
      yeast: [{ name: "Lager (WY2206/2124)", usage: "Primary" }],
    },
  },

  oktoberfest: {
    id: "oktoberfest",
    name: "Oktoberfest/Märzen",
    styleFamily: "lager",
    bjcp: { category: "6", code: "6A" },
    description:
      "Smooth, toasty amber lager; rich malt without caramel sweetness.",
    sensoryProfile: {
      aroma: "Toasty malt, light bread crust; low floral hops.",
      flavor: "Malt-rich, clean; bitterness just balances; dryish finish.",
      appearance: "Amber-orange; brilliant.",
      mouthfeel: "Medium body; smooth; moderate carbonation.",
    },
    vitalStats: {
      og: { min: 1.054, max: 1.06, unit: "SG" },
      fg: { min: 1.01, max: 1.014, unit: "SG" },
      abv: { min: 5.6, max: 6.3, unit: "%" },
      ibu: { min: 18, max: 24, unit: "IBU" },
      srm: { min: 7, max: 14, unit: "SRM" },
    },
    recommendedRecipe: {
      defaultBatchSizeL: 20,
      method: "all-grain",
      efficiencyPct: 74,
      boilTimeMin: 60,
      mashProfile: [{ title: "Saccharification", target: "66 °C for 60 min" }],
      fermentationProfile: [
        { title: "Primary", target: "9–11 °C" },
        { title: "Lagering", target: "0–2 °C for 4–6 weeks" },
      ],
    },
    keyIngredients: {
      baseMalts: [
        { name: "Munich", amount: "40–60%" },
        { name: "Vienna", amount: "20–40%" },
        { name: "Pilsner", amount: "0–20%" },
      ],
      hops: [{ name: "Hallertau/Tettnang", usage: "Bittering & late" }],
      yeast: [{ name: "German Lager", usage: "Primary" }],
    },
  },

  "dortmunder-export": {
    id: "dortmunder-export",
    name: "Dortmunder Export",
    styleFamily: "lager",
    bjcp: { category: "8", code: "8C" },
    description:
      "Robust pale lager with firm mineral backbone; fuller than German Pils, drier than Helles.",
    sensoryProfile: {
      aroma: "Pils malt with light mineral note; low noble hops.",
      flavor: "Rounded malt with firm, clean bitterness; mineral edge.",
      appearance: "Pale to deep gold; brilliant.",
      mouthfeel: "Medium body; smooth.",
    },
    vitalStats: {
      og: { min: 1.048, max: 1.056, unit: "SG" },
      fg: { min: 1.01, max: 1.015, unit: "SG" },
      abv: { min: 4.8, max: 6.0, unit: "%" },
      ibu: { min: 20, max: 30, unit: "IBU" },
      srm: { min: 4, max: 7, unit: "SRM" },
    },
    recommendedRecipe: {
      defaultBatchSizeL: 20,
      method: "all-grain",
      efficiencyPct: 75,
      boilTimeMin: 90,
      mashProfile: [{ title: "Saccharification", target: "65 °C for 60 min" }],
      fermentationProfile: [
        { title: "Primary", target: "9–11 °C" },
        { title: "Diacetyl Rest", target: "15 °C for 24–48 h" },
        { title: "Lagering", target: "0–2 °C for 3–4 weeks" },
      ],
    },
    waterProfile: {
      adjustments: [
        "Mineral-forward profile (higher TDS than Pils/Helles) for definition; avoid harsh sulfate levels.",
      ],
    },
    keyIngredients: {
      baseMalts: [{ name: "Pilsner", amount: "90–100%" }],
      specialtyMalts: [{ name: "Carahell® or light Munich", amount: "0–10%" }],
      hops: [
        { name: "Noble (Hallertau/Tettnang/Saaz)", usage: "Bittering & late" },
      ],
      yeast: [{ name: "German Lager", usage: "Primary" }],
    },
  },

  "english-porter": {
    id: "english-porter",
    name: "English Porter",
    styleFamily: "stout",
    bjcp: { category: "13", code: "13C" },
    description:
      "Moderate-strength dark ale with chocolate/toffee complexity and restrained roast.",
    sensoryProfile: {
      aroma: "Chocolate, toast, caramel; low floral/earthy hops.",
      flavor:
        "Malty with chocolate/toffee; moderate bitterness; balanced finish.",
      appearance: "Brown to dark brown with ruby highlights; tan head.",
      mouthfeel: "Medium body; smooth.",
    },
    vitalStats: {
      og: { min: 1.04, max: 1.052, unit: "SG" },
      fg: { min: 1.008, max: 1.014, unit: "SG" },
      abv: { min: 4.0, max: 5.4, unit: "%" },
      ibu: { min: 18, max: 35, unit: "IBU" },
      srm: { min: 20, max: 30, unit: "SRM" },
    },
    recommendedRecipe: {
      defaultBatchSizeL: 20,
      method: "all-grain",
      efficiencyPct: 72,
      boilTimeMin: 60,
      mashProfile: [
        { title: "Saccharification", target: "66–67 °C for 60 min" },
      ],
      fermentationProfile: [{ title: "Primary", target: "18–20 °C" }],
    },
    waterProfile: {
      adjustments: [
        "Balanced minerals; keep RA near neutral to support dark malts without harshness.",
      ],
    },
    keyIngredients: {
      baseMalts: [{ name: "Maris Otter", amount: "70–85%" }],
      specialtyMalts: [
        { name: "Crystal 60–80L", amount: "5–10%" },
        { name: "Chocolate Malt", amount: "3–6%" },
      ],
      hops: [{ name: "East Kent Goldings/Fuggles", usage: "Bittering & late" }],
      yeast: [{ name: "English Ale", usage: "Primary" }],
    },
  },

  "american-porter": {
    id: "american-porter",
    name: "American Porter",
    styleFamily: "stout",
    bjcp: { category: "20", code: "20A" },
    description:
      "Robust porter with more roast and bitterness than English versions.",
    sensoryProfile: {
      aroma: "Chocolate/coffee with American hop overlay optional.",
      flavor: "Richer roast; moderate-high bitterness; drier than English.",
      appearance: "Dark brown to black with ruby edges.",
      mouthfeel: "Medium body; moderate carbonation.",
    },
    vitalStats: {
      og: { min: 1.05, max: 1.07, unit: "SG" },
      fg: { min: 1.012, max: 1.016, unit: "SG" },
      abv: { min: 5.0, max: 7.0, unit: "%" },
      ibu: { min: 25, max: 50, unit: "IBU" },
      srm: { min: 20, max: 40, unit: "SRM" },
    },
    recommendedRecipe: {
      defaultBatchSizeL: 20,
      method: "all-grain",
      boilTimeMin: 60,
      mashProfile: [{ title: "Saccharification", target: "66 °C for 60 min" }],
      fermentationProfile: [{ title: "Primary", target: "18–20 °C" }],
    },
    keyIngredients: {
      baseMalts: [{ name: "US Pale Ale Malt", amount: "75–85%" }],
      specialtyMalts: [
        { name: "Crystal 60–80L", amount: "4–8%" },
        { name: "Chocolate / Blackprinz®", amount: "3–7%" },
      ],
      hops: [{ name: "Centennial/Willamette/EKG", usage: "Bittering & late" }],
      yeast: [{ name: "American or English Ale", usage: "Primary" }],
    },
  },

  "dry-irish-stout": {
    id: "dry-irish-stout",
    name: "Irish Stout (Dry)",
    styleFamily: "stout",
    bjcp: { category: "15", code: "15B" },
    description:
      "Roasty, bitter, and highly drinkable dark ale with a dry finish.",
    sensoryProfile: {
      aroma: "Roast coffee; low esters; low earthy hops.",
      flavor: "Assertive roast bitterness; dry finish; minimal sweet caramel.",
      appearance: "Jet black to very dark brown; tan head.",
      mouthfeel:
        "Light-medium body; medium-high carbonation or nitro smoothness.",
    },
    vitalStats: {
      og: { min: 1.036, max: 1.044, unit: "SG" },
      fg: { min: 1.007, max: 1.011, unit: "SG" },
      abv: { min: 4.0, max: 4.7, unit: "%" },
      ibu: { min: 25, max: 45, unit: "IBU" },
      srm: { min: 25, max: 40, unit: "SRM" },
    },
    recommendedRecipe: {
      defaultBatchSizeL: 20,
      method: "all-grain",
      mashProfile: [
        { title: "Saccharification", target: "66–67 °C for 60 min" },
      ],
      fermentationProfile: [{ title: "Primary", target: "18–20 °C" }],
    },
    keyIngredients: {
      baseMalts: [{ name: "Pale Ale or Maris Otter", amount: "70–80%" }],
      specialtyMalts: [
        {
          name: "Flaked Barley",
          amount: "10–15%",
          description: "Body and head.",
        },
        {
          name: "Roasted Barley",
          amount: "5–10%",
          description: "Signature roast bite.",
        },
      ],
      hops: [{ name: "Target/EKG", usage: "Bittering" }],
      yeast: [{ name: "Irish Ale", usage: "Primary" }],
    },
  },

  "american-stout": {
    id: "american-stout",
    name: "American Stout",
    styleFamily: "stout",
    bjcp: { category: "20", code: "20B" },
    description:
      "Bold roast and hop presence; fuller and more bitter than Irish stout.",
    sensoryProfile: {
      aroma: "Chocolate/coffee; American hops optional.",
      flavor: "Roast + moderate-high bitterness; firm finish.",
      appearance: "Dark brown to black; tan head.",
      mouthfeel: "Medium body.",
    },
    vitalStats: {
      og: { min: 1.05, max: 1.075, unit: "SG" },
      fg: { min: 1.01, max: 1.018, unit: "SG" },
      abv: { min: 5.0, max: 7.5, unit: "%" },
      ibu: { min: 35, max: 75, unit: "IBU" },
      srm: { min: 30, max: 40, unit: "SRM" },
    },
    recommendedRecipe: {
      defaultBatchSizeL: 20,
      method: "all-grain",
      mashProfile: [{ title: "Saccharification", target: "66 °C for 60 min" }],
      fermentationProfile: [{ title: "Primary", target: "18–20 °C" }],
    },
    keyIngredients: {
      baseMalts: [{ name: "US Pale Ale Malt", amount: "70–85%" }],
      specialtyMalts: [
        { name: "Roasted Barley/Chocolate", amount: "6–10%" },
        { name: "Crystal 40–80L", amount: "3–7%" },
      ],
      hops: [
        { name: "American High-alpha", usage: "Bittering & late (optional)" },
      ],
      yeast: [{ name: "American Ale", usage: "Primary" }],
    },
  },

  hefeweizen: {
    id: "hefeweizen",
    name: "German Wheat Beer (Hefeweizen)",
    styleFamily: "ale",
    bjcp: { category: "10", code: "10A" },
    description:
      "Refreshing, spritzy wheat beer with yeast-driven clove and banana.",
    sensoryProfile: {
      aroma: "Balance of phenolic clove and fruity banana; low floral hops.",
      flavor:
        "Lightly bready wheat; clove/banana yeast profile; low bitterness.",
      appearance: "Straw to gold; hazy; big mousse head.",
      mouthfeel: "Medium-light body; high carbonation.",
    },
    vitalStats: {
      og: { min: 1.044, max: 1.052, unit: "SG" },
      fg: { min: 1.008, max: 1.014, unit: "SG" },
      abv: { min: 4.9, max: 5.6, unit: "%" },
      ibu: { min: 8, max: 15, unit: "IBU" },
      srm: { min: 2, max: 6, unit: "SRM" },
      carbonationVolumes: { min: 2.7, max: 3.3, unit: "vol" },
    },
    recommendedRecipe: {
      defaultBatchSizeL: 20,
      method: "all-grain",
      mashProfile: [{ title: "Single Infusion", target: "66 °C for 60 min" }],
      fermentationProfile: [
        {
          title: "Primary",
          target: "17–20 °C",
          notes: "Cooler = more clove; warmer = more banana.",
        },
      ],
    },
    keyIngredients: {
      baseMalts: [
        { name: "Wheat Malt", amount: "50–70%" },
        { name: "Pilsner", amount: "30–50%" },
      ],
      hops: [{ name: "Hallertau/Tettnang", usage: "Bittering only" }],
      yeast: [{ name: "Weizen (3068/3638/WLP300)", usage: "Primary" }],
    },
  },

  "belgian-wit": {
    id: "belgian-wit",
    name: "Belgian Witbier",
    styleFamily: "ale",
    bjcp: { category: "24", code: "24A" },
    description:
      "Pale, hazy, spiced wheat ale with citrus and subtle coriander.",
    sensoryProfile: {
      aroma: "Citrus zest, light pepper/spice, bready wheat; low floral hops.",
      flavor: "Lightly tart wheat; orange and coriander; very low bitterness.",
      appearance: "Pale straw to light gold; milky haze; white pillowy head.",
      mouthfeel: "Creamy, medium-light; high carbonation.",
    },
    vitalStats: {
      og: { min: 1.044, max: 1.052, unit: "SG" },
      fg: { min: 1.008, max: 1.012, unit: "SG" },
      abv: { min: 4.5, max: 5.5, unit: "%" },
      ibu: { min: 8, max: 20, unit: "IBU" },
      srm: { min: 2, max: 4, unit: "SRM" },
    },
    recommendedRecipe: {
      defaultBatchSizeL: 20,
      method: "all-grain",
      mashProfile: [{ title: "Single Infusion", target: "66 °C for 60 min" }],
      fermentationProfile: [{ title: "Primary", target: "18–21 °C" }],
    },
    keyIngredients: {
      baseMalts: [{ name: "Pilsner", amount: "35–55%" }],
      adjuncts: [
        {
          name: "Unmalted Wheat",
          amount: "30–50%",
          description: "Traditional grist bulk.",
        },
        { name: "Oats (flaked)", amount: "0–10%" },
      ],
      hops: [{ name: "Saaz/Hallertau", usage: "Low bittering only" }],
      yeast: [{ name: "Belgian Wit Yeast", usage: "Primary" }],
      other: [
        { name: "Coriander", amount: "10–15 g per 20 L", usage: "Late boil" },
        {
          name: "Orange Peel (sweet/bitter)",
          amount: "10–15 g per 20 L",
          usage: "Late boil",
        },
      ],
    },
  },
} satisfies Record<string, BeerStyleTemplate>;
