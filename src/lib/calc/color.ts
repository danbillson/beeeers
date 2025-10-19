/**
 * Color calculations using the Morey equation.
 * Converts malt color contributions to SRM (Standard Reference Method).
 */

const LB_PER_KG = 2.2046226218;
const GAL_PER_L = 0.2641720524;
const EBC_PER_LOVIBOND = 2.65;
const SRM_PER_EBC = 1 / 1.97;

export type ColorUnit = "L" | "SRM" | "EBC";

export interface FermentableColor {
  amountKg: number;
  color: number;
  unit?: ColorUnit;
}

const toSRM = (color: number, unit: ColorUnit = "L"): number => {
  if (color <= 0) return 0;

  switch (unit) {
    case "SRM":
      return color;
    case "EBC":
      return color * SRM_PER_EBC;
    case "L":
    default:
      return color * EBC_PER_LOVIBOND * SRM_PER_EBC;
  }
};

/**
 * Calculate SRM using Morey equation
 * SRM = 1.4922 × MCU^0.6859
 * where MCU (metric) = Σ(weight_lb × color_srm) / volume_gal
 */
export function calculateSRM(
  fermentables: FermentableColor[],
  batchSizeL: number
): number {
  const batchGallons = batchSizeL * GAL_PER_L;
  if (batchGallons <= 0) return 0;

  const mcu = fermentables.reduce((sum, fermentable) => {
    if (fermentable.amountKg <= 0) return sum;
    const colorSRM = toSRM(fermentable.color, fermentable.unit);
    const weightLb = fermentable.amountKg * LB_PER_KG;
    return sum + weightLb * colorSRM;
  }, 0);

  const mcuPerGallon = mcu / batchGallons;
  if (mcuPerGallon <= 0) return 0;

  const srm = 1.4922 * Math.pow(mcuPerGallon, 0.6859);
  return Math.round(srm * 10) / 10;
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
