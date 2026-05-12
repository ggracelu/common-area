"use server";

import { auth } from "@clerk/nextjs/server";
import { toggleBingoTileForProfile } from "@/lib/bingo-progress";
import { getOnboardingSnapshotForClerkUser } from "@/lib/onboarding";

export async function toggleBingoTileAction(promptId: string, completed: boolean) {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Sign in to save bingo progress." };
  }

  const snapshot = await getOnboardingSnapshotForClerkUser(userId);
  if (!snapshot?.profileId) {
    return { ok: false as const, error: "Profile not found." };
  }

  if (snapshot.assignmentStatus !== "assigned") {
    return { ok: false as const, error: "Bingo bonus progress unlocks after cohort assignment." };
  }

  await toggleBingoTileForProfile({
    profileId: snapshot.profileId,
    promptId,
    completed,
    cohortId: snapshot.cohortId,
  });

  return { ok: true as const };
}
