/**
 * Recipe calculation hook
 * Memoizes brewing calculations for real-time updates
 */

import { useMemo } from "react";
import {
  calculateOG,
  calculateFG,
  calculateIBU,
  calculateSRM,
  calculateABV,
  calculatePrimingSugar,
  calculateWaterProfile,
  type Fermentable,
  type Hop,
  type FermentableColor,
  type IonProfile,
  type SaltAddition,
} from "@/lib/calc";

export interface RecipeCalculationData {
  fermentables: Array<{
    ingredient: {
      potential?: number;
      ppg?: number;
      potentialUnit?: "PPG" | "PKL";
      color?: number;
      colorLovibond?: number;
      colorUnit?: "L" | "SRM" | "EBC";
      efficiencyOverride?: number;
    };
    amountKg: number;
    efficiencyOverride?: number;
  }>;
  hops: Array<{
    ingredient: { alphaAcid: number };
    amountG: number;
    timeMin: number;
    type: "boil" | "whirlpool" | "dry-hop";
    name?: string;
    temperatureC?: number;
  }>;
  yeast: {
    ingredient: { attenuationMin: number; attenuationMax: number };
  };
  waterAdditions: Array<{
    name: string;
    amountG: number;
    ionType: string;
    volumeL?: number;
  }>;
  batchSizeL: number;
  boilSizeL: number;
  efficiency: number;
  boilTimeMin: number;
  hopUtilizationMultiplier: number;
  baseWaterProfile?: IonProfile;
  fermentationTempC?: number;
}

export interface RecipeCalculations {
  og: number;
  fg: number;
  abv: number;
  ibu: number;
  srm: number;
  waterVolumes: {
    mash: number;
    sparge: number;
  };
  ionProfile: IonProfile;
  primingSugar: {
    amountG: number;
    co2Volumes: number;
  };
}

const DEFAULT_BASE_WATER: IonProfile = {
  ca: 0,
  mg: 0,
  na: 0,
  cl: 0,
  so4: 0,
  hco3: 0,
};

export function useRecipeCalculations(
  data: RecipeCalculationData
): RecipeCalculations {
  return useMemo(() => {
    // Extract fermentables for gravity and color calculations
    const fermentables: Fermentable[] = data.fermentables.map((f) => {
      const potential =
        f.ingredient.potential ?? f.ingredient.ppg ?? 0;

      return {
        potential,
        yieldUnit: f.ingredient.potentialUnit ?? "PPG",
        amountKg: f.amountKg,
        efficiency:
          f.efficiencyOverride ??
          f.ingredient.efficiencyOverride ??
          data.efficiency / 100,
      };
    });

    const fermentablesColor: FermentableColor[] = data.fermentables.map(
      (f) => ({
        color:
          f.ingredient.color ?? f.ingredient.colorLovibond ?? 0,
        unit: f.ingredient.colorUnit ?? "L",
        amountKg: f.amountKg,
      })
    );

    // Extract hops for IBU calculation
    const hops: Hop[] = data.hops.map((h) => ({
      name: h.name,
      alphaAcid: h.ingredient.alphaAcid,
      amountG: h.amountG,
      timeMin: h.timeMin,
      type: h.type,
      temperatureC: h.temperatureC,
    }));

    // Calculate gravity
    const og = calculateOG(
      fermentables,
      data.batchSizeL,
      data.efficiency / 100
    );

    // Use average yeast attenuation
    const yeastAttenuation =
      (data.yeast.ingredient.attenuationMin +
        data.yeast.ingredient.attenuationMax) /
      2;
    const fg = calculateFG(og, yeastAttenuation);

    // Calculate other metrics
    const abvResult = calculateABV(og, fg);
    const ibuResult = calculateIBU(hops, {
      finalVolumeL: data.batchSizeL,
      preBoilVolumeL: data.boilSizeL,
      og,
      utilizationMultiplier: data.hopUtilizationMultiplier,
    });
    const srm = calculateSRM(fermentablesColor, data.batchSizeL);

    // Calculate water volumes (simplified)
    const grainAbsorption = 1.0; // L per kg
    const totalGrainKg = data.fermentables.reduce(
      (sum, f) => sum + f.amountKg,
      0
    );
    const mashWater = totalGrainKg * grainAbsorption;
    const spargeWater = Math.max(data.boilSizeL - mashWater, 0);

    // Calculate water chemistry
    const baseProfile = data.baseWaterProfile ?? DEFAULT_BASE_WATER;
    const saltAdditions: SaltAddition[] = data.waterAdditions.map((wa) => ({
      name: wa.name,
      amountG: wa.amountG,
      ionType: wa.ionType as "ca" | "mg" | "na" | "cl" | "so4" | "hco3",
      volumeL: wa.volumeL ?? data.batchSizeL,
    }));
    const ionProfile = calculateWaterProfile(baseProfile, saltAdditions);

    // Calculate priming sugar
    const primingResult = calculatePrimingSugar(
      data.batchSizeL,
      2.4, // Target CO2 volumes
      data.fermentationTempC ?? 20
    );

    return {
      og: Math.round(og * 1000) / 1000, // Round to 3 decimal places
      fg: Math.round(fg * 1000) / 1000,
      abv: abvResult.abv,
      ibu: Math.round(ibuResult.ibu * 10) / 10, // Round to 1 decimal
      srm: Math.round(srm * 10) / 10,
      waterVolumes: {
        mash: Math.round(mashWater * 10) / 10,
        sparge: Math.round(spargeWater * 10) / 10,
      },
      ionProfile,
      primingSugar: {
        amountG: primingResult.sugarAmountG,
        co2Volumes: primingResult.co2Volumes,
      },
    };
  }, [
    data.fermentables,
    data.hops,
    data.yeast,
    data.waterAdditions,
    data.batchSizeL,
    data.boilSizeL,
    data.efficiency,
    data.hopUtilizationMultiplier,
    data.baseWaterProfile,
    data.fermentationTempC,
  ]);
}
