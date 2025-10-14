/**
 * Server actions for brew log management
 */

"use server";

import { db } from "@/db";
import { brewLogs } from "@/db/schema";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function createBrewLog(recipeId: string, formData: FormData) {
  const logId = nanoid();
  const now = new Date();

  const logData = {
    id: logId,
    recipeId,
    brewDate: new Date(formData.get("brewDate") as string),
    measuredOG: formData.get("measuredOG")
      ? parseFloat(formData.get("measuredOG") as string)
      : null,
    measuredFG: formData.get("measuredFG")
      ? parseFloat(formData.get("measuredFG") as string)
      : null,
    fermentationTempC: formData.get("fermentationTempC")
      ? parseFloat(formData.get("fermentationTempC") as string)
      : null,
    notes: formData.get("notes") as string,
    issues: formData.get("issues") as string, // JSON string of issue tags
    tastingNotes: formData.get("tastingNotes") as string,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(brewLogs).values(logData);

  revalidatePath(`/recipes/${recipeId}/logs`);
  revalidatePath(`/logs/${logId}`);
  redirect(`/logs/${logId}`);
}

export async function updateBrewLog(logId: string, formData: FormData) {
  const now = new Date();

  const logData = {
    brewDate: new Date(formData.get("brewDate") as string),
    measuredOG: formData.get("measuredOG")
      ? parseFloat(formData.get("measuredOG") as string)
      : null,
    measuredFG: formData.get("measuredFG")
      ? parseFloat(formData.get("measuredFG") as string)
      : null,
    fermentationTempC: formData.get("fermentationTempC")
      ? parseFloat(formData.get("fermentationTempC") as string)
      : null,
    notes: formData.get("notes") as string,
    issues: formData.get("issues") as string,
    tastingNotes: formData.get("tastingNotes") as string,
    updatedAt: now,
  };

  await db.update(brewLogs).set(logData).where(eq(brewLogs.id, logId));

  revalidatePath(`/logs/${logId}`);
}

export async function deleteBrewLog(logId: string, recipeId: string) {
  await db.delete(brewLogs).where(eq(brewLogs.id, logId));

  revalidatePath(`/recipes/${recipeId}/logs`);
  redirect(`/recipes/${recipeId}/logs`);
}
