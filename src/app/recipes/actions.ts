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
} from "@/db/schema";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createRecipe(formData: FormData) {
  try {
    const recipeId = nanoid();
    const now = new Date();

    // Extract recipe data from form
    const recipeData = {
      id: recipeId,
      userId: "user-1", // TODO: Get from session
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
      createdAt: now,
      updatedAt: now,
    };

    // Insert recipe
    await db.insert(recipes).values(recipeData);

    revalidatePath("/recipes");
    return { success: true, recipeId };
  } catch (error) {
    console.error("Error creating recipe:", error);
    return { success: false, error: "Failed to create recipe" };
  }
}

export async function updateRecipe(recipeId: string, formData: FormData) {
  try {
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
    return { success: true };
  } catch (error) {
    console.error("Error updating recipe:", error);
    return { success: false, error: "Failed to update recipe" };
  }
}

export async function deleteRecipe(recipeId: string) {
  try {
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
    return { success: true };
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return { success: false, error: "Failed to delete recipe" };
  }
}

export async function duplicateRecipe(recipeId: string) {
  try {
    // TODO: Implement recipe duplication
    // This would involve:
    // 1. Fetch the original recipe and all related data
    // 2. Create new records with new IDs
    // 3. Update the name to indicate it's a copy

    return { success: true, message: "Recipe duplication not yet implemented" };
  } catch (error) {
    console.error("Error duplicating recipe:", error);
    return { success: false, error: "Failed to duplicate recipe" };
  }
}
