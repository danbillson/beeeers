/**
 * Gravity calculations for brewing
 * Uses Palmer's mass-gravity-volume formula with PKL (Points per kg per L)
 */

export interface Fermentable {
  ppg: number; // Points per kg per L (PKL)
  amountKg: number;
  efficiency?: number; // Only for all-grain recipes
}

export interface GravityResult {
  og: number; // Original gravity (1.xxx format)
  fg: number; // Final gravity (1.xxx format)
}

/**
 * Calculate Original Gravity (OG) from fermentables
 * Formula: OG = 1 + (sum(ppg * amountKg * efficiency) / batchSizeL)
 * PPG values should be in points per kg per L (typically 30-40 for base malts)
 */
export function calculateOG(
  fermentables: Fermentable[],
  batchSizeL: number,
  efficiency: number = 1.0
): number {
  if (batchSizeL <= 0) return 1.0;

  const totalPoints = fermentables.reduce((sum, fermentable) => {
    const effectiveEfficiency = fermentable.efficiency ?? efficiency;
    return sum + fermentable.ppg * fermentable.amountKg * effectiveEfficiency;
  }, 0);

  // Convert points to gravity: 100 points = 1.000 gravity
  return 1 + totalPoints / 100 / batchSizeL;
}

/**
 * Calculate Final Gravity (FG) from OG and yeast attenuation
 * Formula: FG = OG - ((OG - 1) * attenuation / 100)
 */
export function calculateFG(og: number, attenuation: number): number {
  const ogPoints = og - 1;
  const attenuationDecimal = attenuation / 100;
  return og - ogPoints * attenuationDecimal;
}

/**
 * Calculate both OG and FG for a complete recipe
 */
export function calculateGravity(
  fermentables: Fermentable[],
  batchSizeL: number,
  efficiency: number,
  yeastAttenuation: number
): GravityResult {
  const og = calculateOG(fermentables, batchSizeL, efficiency);
  const fg = calculateFG(og, yeastAttenuation);

  return { og, fg };
}
