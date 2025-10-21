/**
 * Zod validation schemas for brewing data
 */

import { z } from "zod"

// Ingredient validation
export const ingredientSchema = z.object({
  id: z.string(),
  kind: z.enum(["fermentable", "hop", "yeast", "adjunct"]),
  name: z.string().min(1),
  origin: z.string().optional(),
  ppg: z.number().min(0).optional(),
  colorLovibond: z.number().min(0).optional(),
  alphaAcid: z.number().min(0).max(100).optional(),
  attenuationMin: z.number().min(0).max(100).optional(),
  attenuationMax: z.number().min(0).max(100).optional(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Recipe fermentable
export const recipeFermentableSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  ingredientId: z.string(),
  amountKg: z.number().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Recipe hop
export const recipeHopSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  ingredientId: z.string(),
  amountG: z.number().min(0),
  timeMin: z.number().min(0),
  type: z.enum(["boil", "whirlpool", "dry-hop"]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Recipe yeast
export const recipeYeastSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  ingredientId: z.string(),
  pitchAmount: z.number().min(0).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Water addition
export const waterAdditionSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  name: z.string().min(1),
  amountG: z.number().min(0),
  ionType: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Other addition
export const otherAdditionSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  name: z.string().min(1),
  amountG: z.number().min(0),
  timeMin: z.number().min(0).optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Mash step
export const mashStepSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  step: z.number().min(1),
  temperatureC: z.number().min(30).max(100),
  durationMin: z.number().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Recipe schema
export const recipeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1),
  style: z.string().optional(),
  method: z.enum(["all-grain", "extract", "partial"]),
  batchSizeL: z.number().min(0.1),
  boilSizeL: z.number().min(0.1),
  efficiency: z.number().min(0).max(100),
  boilTimeMin: z.number().min(0),
  hopUtilizationMultiplier: z.number().min(0).default(1.0),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Create recipe input schema (for forms)
export const createRecipeInputSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  style: z.string().optional(),
  method: z.enum(["all-grain", "extract", "partial"]),
  batchSizeL: z.number().min(0.1, "Batch size must be at least 0.1L"),
  boilSizeL: z.number().min(0.1, "Boil size must be at least 0.1L"),
  efficiency: z.number().min(0).max(100, "Efficiency must be between 0-100%"),
  boilTimeMin: z.number().min(0, "Boil time must be positive"),
  hopUtilizationMultiplier: z.number().min(0).default(1.0),
  notes: z.string().optional(),
})

// Export TypeScript types
export type Ingredient = z.infer<typeof ingredientSchema>
export type RecipeFermentable = z.infer<typeof recipeFermentableSchema>
export type RecipeHop = z.infer<typeof recipeHopSchema>
export type RecipeYeast = z.infer<typeof recipeYeastSchema>
export type WaterAddition = z.infer<typeof waterAdditionSchema>
export type OtherAddition = z.infer<typeof otherAdditionSchema>
export type MashStep = z.infer<typeof mashStepSchema>
export type Recipe = z.infer<typeof recipeSchema>

export type CreateRecipeInput = z.infer<typeof createRecipeInputSchema>
