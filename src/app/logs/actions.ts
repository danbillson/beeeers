/**
 * Server actions for brew log management
 */

"use server";

import { db } from "@/db";
import { brewLogs } from "@/db/schema";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createBrewLog(recipeId: string, formData: FormData) {
  try {
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
    return { success: true, logId };
  } catch (error) {
    console.error("Error creating brew log:", error);
    return { success: false, error: "Failed to create brew log" };
  }
}

export async function updateBrewLog(logId: string, formData: FormData) {
  try {
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
    return { success: true };
  } catch (error) {
    console.error("Error updating brew log:", error);
    return { success: false, error: "Failed to update brew log" };
  }
}

export async function deleteBrewLog(logId: string) {
  try {
    await db.delete(brewLogs).where(eq(brewLogs.id, logId));

    revalidatePath("/logs");
    return { success: true };
  } catch (error) {
    console.error("Error deleting brew log:", error);
    return { success: false, error: "Failed to delete brew log" };
  }
}

