import "server-only";

import { listCohortChatMessages } from "@/lib/chat";
import type { CohortChatLoadState } from "@/types/chat";
import type { OnboardingSnapshot } from "@/types/onboarding";

export async function getCohortChatMessagesForSnapshot(
  snapshot: OnboardingSnapshot | null,
): Promise<CohortChatLoadState> {
  if (!snapshot?.configured) {
    return { status: "not_configured", messages: [] };
  }

  if (!snapshot.profileId || snapshot.assignmentStatus !== "assigned" || !snapshot.cohortId) {
    return { status: "not_assigned", messages: [] };
  }

  try {
    const messages = await listCohortChatMessages({
      profileId: snapshot.profileId,
      cohortId: snapshot.cohortId,
    });

    return {
      status: "ready",
      messages,
    };
  } catch (error) {
    return {
      status: "error",
      messages: [],
      error: error instanceof Error ? error.message : "Chat persistence is not available yet.",
    };
  }
}
