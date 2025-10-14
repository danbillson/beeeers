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
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function createRecipe(formData: FormData) {
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
  redirect(`/recipes/${recipeId}`);
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
