/**
 * Priming sugar calculations for carbonation
 */

export type PrimingSugarType = "sucrose" | "dextrose";

export interface PrimingResult {
  sugarAmountG: number;
  co2Volumes: number;
  residualCO2: number;
  sugarType: PrimingSugarType;
}

const SUGAR_FACTORS: Record<PrimingSugarType, number> = {
  sucrose: 3.49,
  dextrose: 4.04,
};

const RESIDUAL_CO2_TABLE = [
  { tempC: 0, volumes: 1.7 },
  { tempC: 4, volumes: 1.53 },
  { tempC: 7, volumes: 1.43 },
  { tempC: 10, volumes: 1.37 },
  { tempC: 13, volumes: 1.28 },
  { tempC: 16, volumes: 1.20 },
  { tempC: 18, volumes: 1.13 },
  { tempC: 21, volumes: 1.05 },
  { tempC: 24, volumes: 0.99 },
  { tempC: 27, volumes: 0.93 },
  { tempC: 30, volumes: 0.88 },
];

const interpolateResidualCO2 = (tempC: number): number => {
  if (tempC <= RESIDUAL_CO2_TABLE[0].tempC) {
    return RESIDUAL_CO2_TABLE[0].volumes;
  }

  for (let i = 1; i < RESIDUAL_CO2_TABLE.length; i += 1) {
    const lower = RESIDUAL_CO2_TABLE[i - 1];
    const upper = RESIDUAL_CO2_TABLE[i];

    if (tempC <= upper.tempC) {
      const fraction =
        (tempC - lower.tempC) / (upper.tempC - lower.tempC);
      return lower.volumes + fraction * (upper.volumes - lower.volumes);
    }
  }

  return RESIDUAL_CO2_TABLE[RESIDUAL_CO2_TABLE.length - 1].volumes;
};

function calculateResidualCO2(fermentationTempC: number): number {
  const residual = interpolateResidualCO2(fermentationTempC);
  return Math.round(residual * 100) / 100;
}

function roundToTenth(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Calculate priming sugar amount for a target CO₂ volume.
 */
export function calculatePrimingSugar(
  batchSizeL: number,
  targetCO2Volumes: number = 2.4,
  fermentationTempC: number = 20,
  sugarType: PrimingSugarType = "sucrose"
): PrimingResult {
  const residualCO2 = calculateResidualCO2(fermentationTempC);
  const co2Needed = Math.max(targetCO2Volumes - residualCO2, 0);

  const factor = SUGAR_FACTORS[sugarType] ?? SUGAR_FACTORS.sucrose;
  const sugarAmountG = roundToTenth(co2Needed * batchSizeL * factor);

  return {
    sugarAmountG,
    co2Volumes: targetCO2Volumes,
    residualCO2,
    sugarType,
  };
}

/**
 * Convenience wrapper to calculate priming sugar by sugar type.
 */
export function calculatePrimingSugarByType(
  batchSizeL: number,
  targetCO2Volumes: number = 2.4,
  fermentationTempC: number = 20,
  sugarType: PrimingSugarType = "sucrose"
): PrimingResult {
  return calculatePrimingSugar(
    batchSizeL,
    targetCO2Volumes,
    fermentationTempC,
    sugarType
  );
}
