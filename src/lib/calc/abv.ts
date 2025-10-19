/**
 * Alcohol by Volume (ABV) calculations
 */

export type ABVFormula = "standard" | "advanced";

export interface ABVResult {
  abv: number; // Selected method percentage
  method: ABVFormula;
  abvStandard: number;
  abvAdvanced: number;
  alcoholContent: number; // Grams per liter (approximate)
}

const ROUND_TO_ONE_DECIMAL = (value: number): number =>
  Math.round(value * 10) / 10;

/**
 * Calculate ABV using common brewing formulas.
 * - Standard: (OG - FG) × 131.25
 * - Advanced: (76.08 × (OG − FG) / (1.775 − OG)) × (FG / 0.794)
 */
export function calculateABV(
  og: number,
  fg: number,
  method: ABVFormula = "advanced"
): ABVResult {
  const delta = og - fg;
  const abvStandardRaw = delta * 131.25;
  const advancedDenominator = 1.775 - og;
  const abvAdvancedRaw =
    advancedDenominator > 0
      ? ((76.08 * delta) / advancedDenominator) * (fg / 0.794)
      : 0;

  const abvStandardClamped = Math.max(abvStandardRaw, 0);
  const abvAdvancedClamped = Math.max(abvAdvancedRaw, 0);

  const selected =
    method === "advanced" ? abvAdvancedClamped : abvStandardClamped;

  const alcoholContentRaw = delta * 1000; // g/L approximation

  return {
    abv: ROUND_TO_ONE_DECIMAL(selected),
    method,
    abvStandard: ROUND_TO_ONE_DECIMAL(abvStandardClamped),
    abvAdvanced: ROUND_TO_ONE_DECIMAL(abvAdvancedClamped),
    alcoholContent: ROUND_TO_ONE_DECIMAL(Math.max(alcoholContentRaw, 0)),
  };
}

/**
 * Calculate alcohol content in grams for a given batch size
 */
export function calculateTotalAlcohol(
  abvResult: ABVResult,
  batchSizeL: number
): number {
  return abvResult.alcoholContent * batchSizeL;
}
