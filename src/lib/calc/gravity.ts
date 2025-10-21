/**
 * Gravity calculations for brewing
 * Implements Palmer's mass–gravity–volume relationship with support for PPG/PKL inputs.
 */

const LB_PER_KG = 2.2046226218
const GAL_PER_L = 0.2641720524
const PKL_PER_PPG = LB_PER_KG * GAL_PER_L // ≈ 0.582
const PPG_PER_PKL = 1 / PKL_PER_PPG // ≈ 1.718

export type YieldUnit = "PPG" | "PKL"

export interface Fermentable {
  potential: number // Potential yield expressed in the specified unit
  amountKg: number
  efficiency?: number // Optional per-fermentable efficiency (1.0 for extracts)
  yieldUnit?: YieldUnit
}

export interface GravityResult {
  og: number // Original gravity (1.xxx format)
  fg: number // Final gravity (1.xxx format)
}

function toPPG(potential: number, unit: YieldUnit): number {
  return unit === "PKL" ? potential * PPG_PER_PKL : potential
}

/**
 * Calculate Original Gravity (OG) from fermentables
 * Formula (Tinseth/Palmer):
 *   GP_total = Σ( potential_ppg × weight_lb × efficiency )
 *   OG = 1 + (GP_total / batch_gallons) / 1000
 */
export function calculateOG(
  fermentables: Fermentable[],
  batchSizeL: number,
  defaultEfficiency: number = 1.0,
  defaultYieldUnit: YieldUnit = "PPG",
): number {
  const batchGallons = batchSizeL * GAL_PER_L
  if (batchGallons <= 0) return 1.0

  const totalPoints = fermentables.reduce((sum, fermentable) => {
    const efficiency = fermentable.efficiency ?? defaultEfficiency
    if (efficiency <= 0 || fermentable.amountKg <= 0) return sum

    const yieldUnit = fermentable.yieldUnit ?? defaultYieldUnit
    const potentialPPG = toPPG(fermentable.potential, yieldUnit)
    const weightLb = fermentable.amountKg * LB_PER_KG
    return sum + potentialPPG * weightLb * efficiency
  }, 0)

  const gravityPointsPerGallon = totalPoints / batchGallons
  return 1 + gravityPointsPerGallon / 1000
}

/**
 * Calculate Final Gravity (FG) from OG and yeast attenuation
 * Formula: FG = 1 + (OG - 1) × (1 - attenuation)
 */
export function calculateFG(og: number, attenuationPercent: number): number {
  const ogPoints = og - 1
  const attenuation = attenuationPercent / 100
  return 1 + ogPoints * (1 - attenuation)
}

/**
 * Calculate both OG and FG for a complete recipe
 */
export function calculateGravity(
  fermentables: Fermentable[],
  batchSizeL: number,
  brewhouseEfficiency: number,
  yeastAttenuation: number,
  defaultYieldUnit: YieldUnit = "PPG",
): GravityResult {
  const og = calculateOG(
    fermentables,
    batchSizeL,
    brewhouseEfficiency,
    defaultYieldUnit,
  )
  const fg = calculateFG(og, yeastAttenuation)

  return { og, fg }
}

/**
 * Calculate pre-boil (kettle) gravity using conservation of gravity points.
 * preboil_GP × preboil_volume = postboil_GP × postboil_volume
 */
export function calculatePreBoilGravity(
  postBoilOG: number,
  postBoilVolumeL: number,
  preBoilVolumeL: number,
): number {
  if (preBoilVolumeL <= 0 || postBoilVolumeL <= 0) {
    return postBoilOG
  }

  const postBoilPoints = Math.max(postBoilOG - 1, 0) * 1000
  const preBoilPoints = (postBoilPoints * postBoilVolumeL) / preBoilVolumeL || 0

  return 1 + preBoilPoints / 1000
}
