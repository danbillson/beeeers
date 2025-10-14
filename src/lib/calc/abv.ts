/**
 * Alcohol by Volume (ABV) calculations
 */

export interface ABVResult {
  abv: number; // Percentage
  alcoholContent: number; // Grams per liter
}

/**
 * Calculate ABV using the standard formula
 * ABV = (OG - FG) × 131.25
 */
export function calculateABV(og: number, fg: number): ABVResult {
  const abv = (og - fg) * 131.25;
  const alcoholContent = (og - fg) * 1000; // Approximate grams per liter

  return {
    abv: Math.round(abv * 10) / 10, // Round to 1 decimal place
    alcoholContent: Math.round(alcoholContent * 10) / 10,
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
