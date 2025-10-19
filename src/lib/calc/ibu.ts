/**
 * IBU calculations using the Tinseth model.
 * Handles boil, whirlpool/hop-stand, and dry-hop additions.
 */

import { calculatePreBoilGravity } from "./gravity";

export type HopType = "boil" | "whirlpool" | "dry-hop";

export interface Hop {
  name?: string;
  alphaAcid: number; // Percentage (e.g., 12 for 12%)
  amountG: number; // Weight in grams
  timeMin: number; // Contact time in minutes
  type: HopType;
  temperatureC?: number; // Whirlpool/hop-stand temperature
}

export interface HopContribution {
  hop: string;
  contribution: number;
  utilization: number;
}

export interface IBUResult {
  ibu: number;
  contributions: HopContribution[];
  boilGravity: number;
}

export interface CalculateIBUArgs {
  finalVolumeL: number;
  preBoilVolumeL?: number;
  og: number;
  utilizationMultiplier?: number;
  defaultWhirlpoolTempC?: number;
  whirlpoolRetention?: number;
}

const UTILIZATION_GRAVITY_BASE = 0.000125;
const UTILIZATION_MULTIPLIER = 1.65;
const UTILIZATION_TIME_DIVISOR = 4.15;
const DEFAULT_WHIRLPOOL_TEMP_C = 80;
const DEFAULT_WHIRLPOOL_RETENTION = 0.75;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

function calculateTinsethUtilization(gravity: number, timeMin: number): number {
  if (timeMin <= 0) return 0;
  const gravityFactor = Math.pow(UTILIZATION_GRAVITY_BASE, gravity - 1);
  const timeFactor =
    (1 - Math.exp(-0.04 * timeMin)) / UTILIZATION_TIME_DIVISOR;
  return UTILIZATION_MULTIPLIER * gravityFactor * timeFactor;
}

function calculateWhirlpoolUtilization({
  gravity,
  timeMin,
  temperatureC,
  defaultTemperatureC,
  retention,
}: {
  gravity: number;
  timeMin: number;
  temperatureC?: number;
  defaultTemperatureC: number;
  retention: number;
}): number {
  const baseUtilization = calculateTinsethUtilization(gravity, timeMin);
  const temp =
    temperatureC ?? defaultTemperatureC ?? DEFAULT_WHIRLPOOL_TEMP_C;
  const tempFactor = clamp((temp - 60) / 40, 0, 1);
  return baseUtilization * tempFactor * retention;
}

function calculateHopIBU({
  hop,
  gravity,
  finalVolumeL,
  utilizationMultiplier,
  defaultWhirlpoolTempC,
  whirlpoolRetention,
}: {
  hop: Hop;
  gravity: number;
  finalVolumeL: number;
  utilizationMultiplier: number;
  defaultWhirlpoolTempC: number;
  whirlpoolRetention: number;
}): { ibu: number; utilization: number } {
  if (hop.type === "dry-hop" || finalVolumeL <= 0) {
    return { ibu: 0, utilization: 0 };
  }

  const baseUtilization =
    hop.type === "whirlpool"
      ? calculateWhirlpoolUtilization({
          gravity,
          timeMin: hop.timeMin,
          temperatureC: hop.temperatureC,
          defaultTemperatureC: defaultWhirlpoolTempC,
          retention: whirlpoolRetention,
        })
      : calculateTinsethUtilization(gravity, hop.timeMin);

  const utilization = baseUtilization * utilizationMultiplier;
  const ibu =
    (hop.alphaAcid / 100) *
    hop.amountG *
    utilization *
    (1000 / finalVolumeL);

  return { ibu, utilization };
}

/**
 * Calculate total IBU for a recipe.
 */
export function calculateIBU(
  hops: Hop[],
  {
    finalVolumeL,
    preBoilVolumeL,
    og,
    utilizationMultiplier = 1,
    defaultWhirlpoolTempC = DEFAULT_WHIRLPOOL_TEMP_C,
    whirlpoolRetention = DEFAULT_WHIRLPOOL_RETENTION,
  }: CalculateIBUArgs
): IBUResult {
  const effectivePreBoilVolumeL = preBoilVolumeL ?? finalVolumeL;

  const boilGravity = calculatePreBoilGravity(
    og,
    finalVolumeL,
    effectivePreBoilVolumeL
  );

  const contributions = hops.map((hop, index) => {
    const { ibu, utilization } = calculateHopIBU({
      hop,
      gravity: hop.type === "dry-hop" ? 1 : boilGravity,
      finalVolumeL,
      utilizationMultiplier,
      defaultWhirlpoolTempC,
      whirlpoolRetention,
    });

    return {
      hop: hop.name ?? `Hop ${index + 1}`,
      contribution: Math.max(0, ibu),
      utilization,
    };
  });

  const totalIBU = contributions.reduce(
    (sum, contribution) => sum + contribution.contribution,
    0
  );

  return {
    ibu: Math.round(totalIBU * 10) / 10,
    contributions,
    boilGravity,
  };
}
