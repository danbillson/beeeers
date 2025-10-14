/**
 * Color calculations using Morey equation
 * Converts malt color contributions to SRM (Standard Reference Method)
 */

export interface FermentableColor {
  colorLovibond: number;
  amountKg: number;
}

/**
 * Calculate SRM using Morey equation
 * SRM = 1.4922 * (sum(MCU)^0.6859)
 * Where MCU = (Color * Weight) / Volume
 */
export function calculateSRM(
  fermentables: FermentableColor[],
  batchSizeL: number
): number {
  if (batchSizeL <= 0) return 0;

  // Calculate MCU (Malt Color Units) for each fermentable
  const mcu = fermentables.reduce((sum, fermentable) => {
    const mcuContribution =
      (fermentable.colorLovibond * fermentable.amountKg) / batchSizeL;
    return sum + mcuContribution;
  }, 0);

  // Apply Morey equation
  const srm = 1.4922 * Math.pow(mcu, 0.6859);

  return Math.round(srm * 10) / 10; // Round to 1 decimal place
}

/**
 * Get color description based on SRM value
 */
export function getColorDescription(srm: number): string {
  if (srm < 2) return "Straw";
  if (srm < 4) return "Yellow";
  if (srm < 6) return "Gold";
  if (srm < 9) return "Amber";
  if (srm < 14) return "Deep amber/Light copper";
  if (srm < 18) return "Copper";
  if (srm < 24) return "Deep copper/Light brown";
  if (srm < 35) return "Brown";
  if (srm < 40) return "Dark brown";
  return "Very dark brown/Black";
}
