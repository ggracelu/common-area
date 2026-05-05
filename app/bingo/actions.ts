"use server";

import { revalidatePath } from "next/cache";
import { completePrompt as completePromptApi, updateStreak } from "@/lib/bingo";

/**
 * Server action to complete a prompt
 */
export async function completePrompt(
  profileId: string,
  bingoCardId: string,
  promptId: string,
  notes?: string,
) {
  try {
    // Complete the prompt
    await completePromptApi(profileId, bingoCardId, promptId, notes);

    // Update the prompt streak
    await updateStreak(profileId, bingoCardId, "prompt", true);

    // Revalidate the bingo page
    revalidatePath("/bingo");

    return { success: true };
  } catch (error) {
    console.error("Failed to complete prompt:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to complete prompt",
    };
  }
}

/**
 * Server action to update a streak
 */
export async function updateStreakAction(
  profileId: string,
  seasonId: string,
  streakType: string,
  increment: boolean = true,
) {
  try {
    await updateStreak(profileId, seasonId, streakType, increment);

    // Revalidate the bingo page
    revalidatePath("/bingo");

    return { success: true };
  } catch (error) {
    console.error("Failed to update streak:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update streak",
    };
  }
}
