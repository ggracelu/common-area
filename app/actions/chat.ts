"use server";

import { auth } from "@clerk/nextjs/server";
import { sendCohortChatMessage } from "@/lib/chat";
import { getOnboardingSnapshotForClerkUser } from "@/lib/onboarding";

export async function sendCohortChatMessageAction(body: string) {
  const trimmed = body.trim();
  if (!trimmed) {
    return { ok: false as const, error: "Write a message before sending." };
  }

  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Sign in to send a cohort message." };
  }

  const snapshot = await getOnboardingSnapshotForClerkUser(userId);
  if (!snapshot?.profileId || snapshot.assignmentStatus !== "assigned" || !snapshot.cohortId) {
    return { ok: false as const, error: "Cohort chat unlocks after assignment." };
  }

  try {
    const message = await sendCohortChatMessage({
      profileId: snapshot.profileId,
      cohortId: snapshot.cohortId,
      body: trimmed,
    });

    return { ok: true as const, message };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Message was not saved.",
    };
  }
}
