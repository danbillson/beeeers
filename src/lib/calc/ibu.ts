/**
 * IBU calculations using Tinseth formula
 * Handles boil hops, whirlpool hops, and ignores dry hops
 */

export interface Hop {
  alphaAcid: number; // Percentage (e.g., 12.5 for 12.5%)
  amountG: number; // Grams
  timeMin: number; // Minutes in boil or whirlpool
  type: "boil" | "whirlpool" | "dry-hop";
}

export interface IBUResult {
  ibu: number;
  contributions: Array<{
    hop: string;
    contribution: number;
    utilization: number;
  }>;
}

/**
 * Calculate hop utilization based on gravity and time (Tinseth formula)
 * Utilization = 1.65 * 0.000125^(OG - 1) * (1 - e^(-0.04 * time)) / 4.15
 */
function calculateUtilization(og: number, timeMin: number): number {
  const gravityFactor = Math.pow(0.000125, og - 1);
  const timeFactor = (1 - Math.exp(-0.04 * timeMin)) / 4.15;
  return 1.65 * gravityFactor * timeFactor;
}

/**
 * Calculate whirlpool utilization based on temperature
 * Assumes whirlpool at 80-100°C with reduced utilization
 */
function calculateWhirlpoolUtilization(
  og: number,
  timeMin: number,
  tempC: number = 85
): number {
  const baseUtilization = calculateUtilization(og, timeMin);
  // Temperature factor: higher temp = higher utilization
  const tempFactor = Math.max(0.1, Math.min(1.0, (tempC - 60) / 40));
  return baseUtilization * tempFactor;
}

/**
 * Calculate IBU contribution from a single hop addition
 */
function calculateHopContribution(
  hop: Hop,
  batchSizeL: number,
  og: number,
  utilizationMultiplier: number = 1.0
): number {
  if (hop.type === "dry-hop") return 0; // Dry hops don't contribute IBU

  let utilization: number;

  if (hop.type === "whirlpool") {
    utilization = calculateWhirlpoolUtilization(og, hop.timeMin);
  } else {
    utilization = calculateUtilization(og, hop.timeMin);
  }

  // Apply recipe-level utilization multiplier (e.g., for NEIPA)
  utilization *= utilizationMultiplier;

  // Tinseth formula: IBU = (AA% * Weight(g) * Utilization * 74.89) / Volume(L)
  const ibu = (hop.alphaAcid * hop.amountG * utilization * 74.89) / batchSizeL;

  return ibu;
}

/**
 * Calculate total IBU for a recipe
 */
export function calculateIBU(
  hops: Hop[],
  batchSizeL: number,
  og: number,
  utilizationMultiplier: number = 1.0
): IBUResult {
  const contributions = hops.map((hop, index) => {
    const contribution = calculateHopContribution(
      hop,
      batchSizeL,
      og,
      utilizationMultiplier
    );
    let utilization: number;

    if (hop.type === "whirlpool") {
      utilization = calculateWhirlpoolUtilization(og, hop.timeMin);
    } else {
      utilization = calculateUtilization(og, hop.timeMin);
    }

    return {
      hop: `Hop ${index + 1}`,
      contribution,
      utilization: utilization * utilizationMultiplier,
    };
  });

  const totalIBU = contributions.reduce((sum, c) => sum + c.contribution, 0);

  return {
    ibu: Math.round(totalIBU * 10) / 10, // Round to 1 decimal
    contributions,
  };
}
