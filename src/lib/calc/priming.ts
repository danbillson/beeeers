/**
 * Priming sugar calculations for carbonation
 */

export interface PrimingResult {
  sugarAmountG: number;
  co2Volumes: number;
  residualCO2: number;
}

/**
 * Calculate residual CO2 based on fermentation temperature
 * Higher fermentation temperature = lower residual CO2
 */
function calculateResidualCO2(fermentationTempC: number): number {
  // Simplified formula based on temperature
  // More accurate formulas exist but this covers the basic range
  if (fermentationTempC <= 12) return 1.5; // Lager range
  if (fermentationTempC <= 18) return 1.0; // Ale range
  if (fermentationTempC <= 24) return 0.8; // Warm fermentation
  return 0.6; // Very warm fermentation
}

/**
 * Calculate priming sugar amount for target CO2 volumes
 * Uses sucrose as the standard priming sugar
 */
export function calculatePrimingSugar(
  batchSizeL: number,
  targetCO2Volumes: number = 2.4,
  fermentationTempC: number = 20
): PrimingResult {
  const residualCO2 = calculateResidualCO2(fermentationTempC);
  const co2Needed = targetCO2Volumes - residualCO2;

  // Sugar needed per liter (grams)
  // 1g sucrose produces ~0.5 volumes of CO2
  const sugarPerLiter = co2Needed / 0.5;
  const totalSugarG = sugarPerLiter * batchSizeL;

  return {
    sugarAmountG: Math.round(totalSugarG * 10) / 10, // Round to 1 decimal
    co2Volumes: targetCO2Volumes,
    residualCO2,
  };
}

/**
 * Calculate priming sugar for different sugar types
 */
export function calculatePrimingSugarByType(
  batchSizeL: number,
  targetCO2Volumes: number = 2.4,
  fermentationTempC: number = 20,
  sugarType: "sucrose" | "glucose" | "fructose" | "maltose" = "sucrose"
): PrimingResult {
  const residualCO2 = calculateResidualCO2(fermentationTempC);
  const co2Needed = targetCO2Volumes - residualCO2;

  // Different sugars have different efficiency
  const sugarEfficiency: Record<string, number> = {
    sucrose: 0.5,
    glucose: 0.5,
    fructose: 0.5,
    maltose: 0.6, // Less efficient
  };

  const efficiency = sugarEfficiency[sugarType];
  const sugarPerLiter = co2Needed / efficiency;
  const totalSugarG = sugarPerLiter * batchSizeL;

  return {
    sugarAmountG: Math.round(totalSugarG * 10) / 10,
    co2Volumes: targetCO2Volumes,
    residualCO2,
  };
}
