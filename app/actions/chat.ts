"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { getOnboardingSnapshotForClerkUser } from "@/lib/onboarding";
import { mapChatRow } from "@/lib/cohort-chat";

export async function sendCohortChatMessageAction(body: string) {
  const trimmed = body.trim();
  if (!trimmed) {
    return { ok: false as const, error: "Write a message before sending." };
  }

  if (trimmed.length > 500) {
    return { ok: false as const, error: "Keep chat messages under 500 characters." };
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
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        cohort_id: snapshot.cohortId,
        profile_id: snapshot.profileId,
        body: trimmed,
      })
      .select("id, body, created_at, profile_id, profiles(display_name)")
      .single();

    if (error) {
      return { ok: false as const, error: `Message was not saved: ${error.message}` };
    }

    return {
      ok: true as const,
      message: mapChatRow(data as Parameters<typeof mapChatRow>[0], snapshot.profileId),
    };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Message was not saved.",
    };
  }
}
