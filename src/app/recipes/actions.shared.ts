import { z } from "zod";

export const hopTypeValues = ["boil", "whirlpool", "dry-hop"] as const;
export const recipeMethodValues = ["all-grain", "extract", "partial"] as const;
export const mashStepTypeValues = ["strike", "sparge", "mashout"] as const;

export const createRecipeActionSchema = z.object({
  userId: z.string().min(1, "User is required"),
  name: z.string().min(1, "Recipe name is required"),
  style: z.string().optional().nullable().default(null),
  method: z.enum(recipeMethodValues),
  batchSizeL: z.number().min(0.1, "Batch size must be at least 0.1L"),
  boilSizeL: z.number().min(0.1, "Boil size must be at least 0.1L"),
  efficiency: z.number().min(0).max(100),
  boilTimeMin: z.number().min(0),
  hopUtilizationMultiplier: z.number().min(0),
  notes: z.string().optional().nullable().default(null),
  fermentables: z
    .array(
      z.object({
        ingredientName: z.string().min(1, "Fermentable ingredient is required"),
        amountKg: z.number().positive("Amount must be greater than 0"),
      })
    )
    .default([]),
  hops: z
    .array(
      z.object({
        ingredientName: z.string().min(1, "Hop ingredient is required"),
        amountG: z.number().positive("Amount must be greater than 0"),
        timeMin: z.number().min(0),
        type: z.enum(hopTypeValues),
      })
    )
    .default([]),
  yeast: z
    .object({
      ingredientName: z.string().min(1, "Yeast ingredient is required"),
      pitchAmount: z.number().min(0).optional(),
    })
    .optional(),
  waterAdditions: z
    .array(
      z.object({
        name: z.string().min(1, "Salt name is required"),
        amountG: z.number().min(0),
      })
    )
    .default([]),
  mashSteps: z
    .array(
      z.object({
        stepType: z.enum(mashStepTypeValues),
        temperatureC: z.number().min(0),
        timeMin: z.number().min(0),
      })
    )
    .default([]),
});

export type CreateRecipeActionInput = z.infer<typeof createRecipeActionSchema>;
