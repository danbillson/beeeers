"use client"

import { nanoid } from "nanoid"
import { create } from "zustand"

export type RecipeMethod = "all-grain" | "extract" | "partial"

export type RecipeFormState = {
  name: string
  style: string
  method: RecipeMethod
  batchSizeL: number
  boilSizeL: number
  efficiency: number
  boilTimeMin: number
  hopUtilizationMultiplier: number
  fermentationTempC: number
  notes: string
}

export type FermentableEntry = {
  id: string
  optionId: string
  name: string
  origin: string
  amountKg: number
  potential: number
  potentialUnit?: "PPG" | "PKL"
  color: number
  colorUnit?: "L" | "SRM" | "EBC"
}

export type HopEntry = {
  id: string
  optionId: string
  name: string
  origin: string
  amountG: number
  timeMin: number
  type: "boil" | "whirlpool" | "dry-hop"
  alphaAcid: number
}

export type WaterAdditionEntry = {
  id: string
  optionId: string
  name: string
  amountG: number
  volumeL?: number
}

export type MashStepEntry = {
  id: string
  stepType: "strike" | "sparge" | "mashout"
  temperatureC: number
  timeMin: number
}

export const DEFAULT_WATER_PROFILE_ID = "reverse-osmosis"

type Updater<T> = (_previous: T) => T

type NewRecipeState = {
  formState: RecipeFormState
  fermentables: FermentableEntry[]
  hops: HopEntry[]
  waterProfileId: string
  waterAdditions: WaterAdditionEntry[]
  mashSteps: MashStepEntry[]
  setFormState: (_updater: Updater<RecipeFormState>) => void
  setFermentables: (_updater: Updater<FermentableEntry[]>) => void
  setHops: (_updater: Updater<HopEntry[]>) => void
  setWaterProfileId: (_id: string) => void
  setWaterAdditions: (_updater: Updater<WaterAdditionEntry[]>) => void
  setMashSteps: (_updater: Updater<MashStepEntry[]>) => void
  addMashStep: () => void
  reset: () => void
}

const initialFormState: RecipeFormState = {
  name: "",
  style: "",
  method: "all-grain",
  batchSizeL: 10,
  boilSizeL: 12,
  efficiency: 75,
  boilTimeMin: 60,
  hopUtilizationMultiplier: 1.0,
  fermentationTempC: 20,
  notes: "",
}

const createInitialState = (): Omit<
  NewRecipeState,
  | "setFormState"
  | "setFermentables"
  | "setHops"
  | "setWaterProfileId"
  | "setWaterAdditions"
  | "setMashSteps"
  | "addMashStep"
  | "reset"
> => ({
  formState: { ...initialFormState },
  fermentables: [],
  hops: [],
  waterProfileId: DEFAULT_WATER_PROFILE_ID,
  waterAdditions: [],
  mashSteps: [],
})

export const useNewRecipeStore = create<NewRecipeState>()((set) => ({
  ...createInitialState(),
  setFormState: (updater) =>
    set((state) => ({
      formState: updater(state.formState),
    })),
  setFermentables: (updater) =>
    set((state) => ({
      fermentables: updater(state.fermentables),
    })),
  setHops: (updater) =>
    set((state) => ({
      hops: updater(state.hops),
    })),
  setWaterProfileId: (id) =>
    set(() => ({
      waterProfileId: id,
    })),
  setWaterAdditions: (updater) =>
    set((state) => ({
      waterAdditions: updater(state.waterAdditions),
    })),
  setMashSteps: (updater) =>
    set((state) => ({
      mashSteps: updater(state.mashSteps),
    })),
  addMashStep: () =>
    set((state) => ({
      mashSteps: [
        ...state.mashSteps,
        {
          id: nanoid(),
          stepType:
            state.mashSteps.length > 0
              ? state.mashSteps[state.mashSteps.length - 1].stepType
              : "strike",
          temperatureC:
            state.mashSteps.length > 0
              ? state.mashSteps[state.mashSteps.length - 1].temperatureC
              : 66,
          timeMin:
            state.mashSteps.length > 0
              ? state.mashSteps[state.mashSteps.length - 1].timeMin
              : 60,
        },
      ],
    })),
  reset: () =>
    set(() => ({
      ...createInitialState(),
    })),
}))
