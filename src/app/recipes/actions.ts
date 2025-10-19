/**
 * Server actions for recipe management
 */

"use server";

import { db } from "@/db";
import {
  recipes,
  recipeFermentables,
  recipeHops,
  recipeYeast,
  recipeWaterAdditions,
  recipeOtherAdditions,
  mashSteps,
  ingredients,
} from "@/db/schema";
import { z } from "zod";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, inArray } from "drizzle-orm";
import { SALT_COMPOSITIONS } from "@/lib/calc/water";
import {
  createRecipeActionSchema,
  type CreateRecipeActionInput,
} from "@/app/recipes/actions.shared";

type CreateRecipeResult =
  | { ok: true; recipeId: string }
  | { ok: false; fieldErrors?: Record<string, string[]>; message?: string };

export async function createRecipe(
  input: CreateRecipeActionInput
): Promise<CreateRecipeResult> {
  try {
    const data = createRecipeActionSchema.parse(input);

    const recipeId = nanoid();
    const now = new Date();

    await db.insert(recipes).values({
      id: recipeId,
      userId: data.userId,
      name: data.name,
      style: data.style ?? null,
      method: data.method,
      batchSizeL: data.batchSizeL,
      boilSizeL: data.boilSizeL,
      efficiency: data.efficiency,
      boilTimeMin: data.boilTimeMin,
      hopUtilizationMultiplier: data.hopUtilizationMultiplier,
      notes: data.notes ?? null,
      createdAt: now,
      updatedAt: now,
    });

    if (data.fermentables.length > 0) {
      const fermentableIngredients = await db
        .select({ id: ingredients.id, name: ingredients.name })
        .from(ingredients)
        .where(
          and(
            inArray(
              ingredients.name,
              data.fermentables.map((item) => item.ingredientName)
            ),
            eq(ingredients.kind, "fermentable")
          )
        );

      const fermentableNameToId = new Map(
        fermentableIngredients.map((ingredient) => [
          ingredient.name,
          ingredient.id,
        ])
      );

      for (const item of data.fermentables) {
        if (!fermentableNameToId.has(item.ingredientName)) {
          return {
            ok: false,
            fieldErrors: {
              fermentables: [`Unknown fermentable: ${item.ingredientName}`],
            },
          };
        }
      }

      await db.insert(recipeFermentables).values(
        data.fermentables.map((item) => ({
          id: nanoid(),
          recipeId,
          ingredientId: fermentableNameToId.get(item.ingredientName)!,
          amountKg: item.amountKg,
          createdAt: now,
          updatedAt: now,
        }))
      );
    }

    if (data.hops.length > 0) {
      const hopIngredients = await db
        .select({ id: ingredients.id, name: ingredients.name })
        .from(ingredients)
        .where(
          and(
            inArray(
              ingredients.name,
              data.hops.map((item) => item.ingredientName)
            ),
            eq(ingredients.kind, "hop")
          )
        );

      const hopNameToId = new Map(
        hopIngredients.map((ingredient) => [ingredient.name, ingredient.id])
      );

      for (const item of data.hops) {
        if (!hopNameToId.has(item.ingredientName)) {
          return {
            ok: false,
            fieldErrors: {
              hops: [`Unknown hop: ${item.ingredientName}`],
            },
          };
        }
      }

      await db.insert(recipeHops).values(
        data.hops.map((item) => ({
          id: nanoid(),
          recipeId,
          ingredientId: hopNameToId.get(item.ingredientName)!,
          amountG: item.amountG,
          timeMin: item.timeMin,
          type: item.type,
          createdAt: now,
          updatedAt: now,
        }))
      );
    }

    if (data.yeast) {
      const yeastIngredient = await db
        .select({ id: ingredients.id, name: ingredients.name })
        .from(ingredients)
        .where(
          and(
            eq(ingredients.name, data.yeast.ingredientName),
            eq(ingredients.kind, "yeast")
          )
        )
        .limit(1);

      if (yeastIngredient.length === 0) {
        return {
          ok: false,
          fieldErrors: {
            yeast: [`Unknown yeast: ${data.yeast.ingredientName}`],
          },
        };
      }

      await db.insert(recipeYeast).values({
        id: nanoid(),
        recipeId,
        ingredientId: yeastIngredient[0]!.id,
        pitchAmount: data.yeast.pitchAmount,
        createdAt: now,
        updatedAt: now,
      });
    }

    if (data.waterAdditions.length > 0) {
      for (const addition of data.waterAdditions) {
        if (!SALT_COMPOSITIONS[addition.name]) {
          return {
            ok: false,
            fieldErrors: {
              waterAdditions: [`Unknown salt: ${addition.name}`],
            },
          };
        }
      }

      await db.insert(recipeWaterAdditions).values(
        data.waterAdditions.flatMap((item) => {
          const composition = SALT_COMPOSITIONS[item.name];
          return Object.keys(composition).map((ionType) => ({
            id: nanoid(),
            recipeId,
            name: item.name,
            amountG: item.amountG,
            ionType,
            createdAt: now,
            updatedAt: now,
          }));
        })
      );
    }

    if (data.mashSteps.length > 0) {
      await db.insert(mashSteps).values(
        data.mashSteps.map((item, index) => ({
          id: nanoid(),
          recipeId,
          step: index + 1,
          temperatureC: item.temperatureC,
          durationMin: item.timeMin,
          createdAt: now,
          updatedAt: now,
        }))
      );
    }

    revalidatePath("/recipes");
    return { ok: true, recipeId };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, fieldErrors: error.flatten().fieldErrors };
    }

    console.error("Failed to create recipe:", error);
    return { ok: false, message: "Unexpected error creating recipe" };
  }
}

export async function updateRecipe(recipeId: string, formData: FormData) {
  const now = new Date();

  const recipeData = {
    name: formData.get("name") as string,
    style: formData.get("style") as string,
    method: formData.get("method") as "all-grain" | "extract" | "partial",
    batchSizeL: parseFloat(formData.get("batchSizeL") as string),
    boilSizeL: parseFloat(formData.get("boilSizeL") as string),
    efficiency: parseFloat(formData.get("efficiency") as string),
    boilTimeMin: parseInt(formData.get("boilTimeMin") as string),
    hopUtilizationMultiplier:
      parseFloat(formData.get("hopUtilizationMultiplier") as string) || 1.0,
    notes: formData.get("notes") as string,
    updatedAt: now,
  };

  await db.update(recipes).set(recipeData).where(eq(recipes.id, recipeId));

  revalidatePath(`/recipes/${recipeId}`);
  revalidatePath("/recipes");
}

export async function deleteRecipe(recipeId: string) {
  // Delete related records first (due to foreign key constraints)
  await db
    .delete(recipeFermentables)
    .where(eq(recipeFermentables.recipeId, recipeId));
  await db.delete(recipeHops).where(eq(recipeHops.recipeId, recipeId));
  await db.delete(recipeYeast).where(eq(recipeYeast.recipeId, recipeId));
  await db
    .delete(recipeWaterAdditions)
    .where(eq(recipeWaterAdditions.recipeId, recipeId));
  await db
    .delete(recipeOtherAdditions)
    .where(eq(recipeOtherAdditions.recipeId, recipeId));
  await db.delete(mashSteps).where(eq(mashSteps.recipeId, recipeId));

  // Delete recipe
  await db.delete(recipes).where(eq(recipes.id, recipeId));

  revalidatePath("/recipes");
  redirect("/recipes");
}

export async function duplicateRecipe() {
  // TODO: Implement recipe duplication
  // This would involve:
  // 1. Fetch the original recipe and all related data
  // 2. Create new records with new IDs
  // 3. Update the name to indicate it's a copy
  throw new Error("Recipe duplication not yet implemented");
}
