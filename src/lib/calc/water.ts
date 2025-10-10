/**
 * Water chemistry calculations for brewing
 * Handles ion profiles and salt additions
 */

export interface IonProfile {
  ca: number; // Calcium (ppm)
  mg: number; // Magnesium (ppm)
  na: number; // Sodium (ppm)
  cl: number; // Chloride (ppm)
  so4: number; // Sulfate (ppm)
  hco3: number; // Bicarbonate (ppm)
}

export interface SaltAddition {
  name: string;
  amountG: number;
  ionType: "ca" | "mg" | "na" | "cl" | "so4" | "hco3";
}

/**
 * Calculate ion contribution from salt additions
 * Common brewing salts and their ion contributions
 */
const SALT_COMPOSITIONS: Record<string, Partial<IonProfile>> = {
  "Gypsum (CaSO4)": { ca: 147, so4: 349 }, // per 100g
  "Calcium Chloride (CaCl2)": { ca: 136, cl: 240 },
  "Epsom Salt (MgSO4)": { mg: 99, so4: 389 },
  "Table Salt (NaCl)": { na: 393, cl: 607 },
  "Chalk (CaCO3)": { ca: 400, hco3: 610 },
  "Baking Soda (NaHCO3)": { na: 274, hco3: 714 },
};

/**
 * Calculate ion profile from salt additions
 */
export function calculateWaterProfile(
  baseProfile: IonProfile,
  additions: SaltAddition[]
): IonProfile {
  const result = { ...baseProfile };

  additions.forEach((addition) => {
    const saltComposition = SALT_COMPOSITIONS[addition.name];
    if (!saltComposition) return;

    // Convert grams to ppm contribution (assuming 1L water = 1kg)
    const ppmPerGram = 1000; // 1g in 1L = 1000ppm

    Object.entries(saltComposition).forEach(([ion, contribution]) => {
      if (contribution && addition.ionType === ion) {
        const contributionPpm =
          (contribution / 100) * addition.amountG * ppmPerGram;
        result[ion as keyof IonProfile] += contributionPpm;
      }
    });
  });

  return {
    ca: Math.round(result.ca * 10) / 10,
    mg: Math.round(result.mg * 10) / 10,
    na: Math.round(result.na * 10) / 10,
    cl: Math.round(result.cl * 10) / 10,
    so4: Math.round(result.so4 * 10) / 10,
    hco3: Math.round(result.hco3 * 10) / 10,
  };
}

/**
 * Calculate mash pH estimation (simplified)
 * Based on residual alkalinity and malt acidity
 */
export function estimateMashpH(
  waterProfile: IonProfile,
  grainAcidity: number = -3.5 // Typical pale malt acidity
): number {
  // Residual alkalinity = HCO3 - (Ca/3.5 + Mg/7)
  const residualAlkalinity =
    waterProfile.hco3 - (waterProfile.ca / 3.5 + waterProfile.mg / 7);

  // Mash pH ≈ 5.7 + grain acidity + (residual alkalinity / 50)
  const mashpH = 5.7 + grainAcidity + residualAlkalinity / 50;

  return Math.round(mashpH * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate chloride to sulfate ratio
 * Affects mouthfeel and hop perception
 */
export function calculateClToSO4Ratio(waterProfile: IonProfile): number {
  if (waterProfile.so4 === 0) return Infinity;
  return Math.round((waterProfile.cl / waterProfile.so4) * 100) / 100;
}

/**
 * Get water profile description based on ion levels
 */
export function getWaterProfileDescription(waterProfile: IonProfile): string {
  const clToSO4 = calculateClToSO4Ratio(waterProfile);

  if (clToSO4 > 2) return "Malty, full-bodied";
  if (clToSO4 > 1) return "Balanced";
  if (clToSO4 > 0.5) return "Crisp, dry";
  return "Very crisp, hop-forward";
}
