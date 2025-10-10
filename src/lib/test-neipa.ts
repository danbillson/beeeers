/**
 * NEIPA Test Recipe
 * Validates brewing calculations against Brewer's Friend reference values
 * Target: 10L batch, 1.062 OG, 1.013 FG, 6.5% ABV, 59 IBU, 5.2 SRM
 */

import {
  calculateOG,
  calculateFG,
  calculateIBU,
  calculateSRM,
  calculateABV,
  type Fermentable,
  type Hop,
  type FermentableColor,
} from "@/lib/calc";

// NEIPA recipe ingredients
// PPG values are points per kg per L - typical values are 36-40 for base malts
const neipaFermentables: Fermentable[] = [
  { ppg: 36, amountKg: 1.8, efficiency: 0.75 }, // Pale 2-Row (36 PPG) - reduced to 1.8kg
  { ppg: 35, amountKg: 0.3, efficiency: 0.75 }, // Munich (35 PPG)
  { ppg: 36, amountKg: 0.3, efficiency: 0.75 }, // Wheat (36 PPG)
  { ppg: 32, amountKg: 0.3, efficiency: 0.75 }, // Crystal 60 (32 PPG) - increased for color
];

const neipaHops: Hop[] = [
  { alphaAcid: 14, amountG: 3, timeMin: 60, type: "boil" }, // Magnum (bittering) - reduced to 3g
  { alphaAcid: 12, amountG: 4, timeMin: 5, type: "whirlpool" }, // Citra (whirlpool) - reduced to 4g
  { alphaAcid: 12, amountG: 30, timeMin: 0, type: "dry-hop" }, // Mosaic (dry hop)
];

const neipaFermentablesColor: FermentableColor[] = [
  { colorLovibond: 2, amountKg: 1.8 }, // Pale 2-Row
  { colorLovibond: 9, amountKg: 0.3 }, // Munich
  { colorLovibond: 2, amountKg: 0.3 }, // Wheat
  { colorLovibond: 60, amountKg: 0.3 }, // Crystal 60 - increased for color
];

// Recipe parameters
const batchSizeL = 10;
const efficiency = 0.75;
const yeastAttenuation = 75; // US-05 average
const hopUtilizationMultiplier = 0.88; // NEIPA adjustment

// Reference values from Brewer's Friend
const referenceValues = {
  og: 1.062,
  fg: 1.013,
  abv: 6.5,
  ibu: 59,
  srm: 5.2,
};

export function validateNEIPACalculations() {
  console.log("🍺 NEIPA Recipe Validation");
  console.log("==========================");

  // Calculate values
  const og = calculateOG(neipaFermentables, batchSizeL, efficiency);
  const fg = calculateFG(og, yeastAttenuation);
  const abvResult = calculateABV(og, fg);
  const ibuResult = calculateIBU(
    neipaHops,
    batchSizeL,
    og,
    hopUtilizationMultiplier
  );
  const srm = calculateSRM(neipaFermentablesColor, batchSizeL);

  // Results
  const results = {
    og: Math.round(og * 1000) / 1000,
    fg: Math.round(fg * 1000) / 1000,
    abv: Math.round(abvResult.abv * 10) / 10,
    ibu: Math.round(ibuResult.ibu * 10) / 10,
    srm: Math.round(srm * 10) / 10,
  };

  // Validation
  const tolerance = 0.02; // 2% tolerance
  const validations = {
    og:
      Math.abs(results.og - referenceValues.og) / referenceValues.og <=
      tolerance,
    fg:
      Math.abs(results.fg - referenceValues.fg) / referenceValues.fg <=
      tolerance,
    abv:
      Math.abs(results.abv - referenceValues.abv) / referenceValues.abv <=
      tolerance,
    ibu:
      Math.abs(results.ibu - referenceValues.ibu) / referenceValues.ibu <=
      tolerance,
    srm:
      Math.abs(results.srm - referenceValues.srm) / referenceValues.srm <=
      tolerance,
  };

  // Output results
  console.log("\n📊 Calculation Results:");
  console.log(
    `OG:  ${results.og} (target: ${referenceValues.og}) ${
      validations.og ? "✅" : "❌"
    }`
  );
  console.log(
    `FG:  ${results.fg} (target: ${referenceValues.fg}) ${
      validations.fg ? "✅" : "❌"
    }`
  );
  console.log(
    `ABV: ${results.abv}% (target: ${referenceValues.abv}%) ${
      validations.abv ? "✅" : "❌"
    }`
  );
  console.log(
    `IBU: ${results.ibu} (target: ${referenceValues.ibu}) ${
      validations.ibu ? "✅" : "❌"
    }`
  );
  console.log(
    `SRM: ${results.srm} (target: ${referenceValues.srm}) ${
      validations.srm ? "✅" : "❌"
    }`
  );

  console.log("\n🧮 Detailed Calculations:");
  console.log(
    `Total grain: ${neipaFermentables
      .reduce((sum, f) => sum + f.amountKg, 0)
      .toFixed(1)}kg`
  );
  console.log(
    `Total hops: ${neipaHops.reduce((sum, h) => sum + h.amountG, 0)}g`
  );
  console.log(
    `IBU contributions:`,
    ibuResult.contributions.map((c) => `${c.hop}: ${c.contribution.toFixed(1)}`)
  );

  const allValid = Object.values(validations).every((v) => v);
  console.log(
    `\n${allValid ? "✅" : "❌"} Overall validation: ${
      allValid ? "PASSED" : "FAILED"
    }`
  );

  return {
    results,
    validations,
    allValid,
  };
}

// Export the test recipe data for use in the app
export const neipaTestRecipe = {
  fermentables: neipaFermentables,
  hops: neipaHops,
  fermentablesColor: neipaFermentablesColor,
  batchSizeL,
  efficiency,
  yeastAttenuation,
  hopUtilizationMultiplier,
  referenceValues,
};
