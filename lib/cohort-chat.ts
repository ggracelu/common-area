import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { CohortChatLoadState, CohortChatMessageView } from "@/types/chat";
import type { OnboardingSnapshot } from "@/types/onboarding";

type ChatMessageRow = {
  id: string;
  body: string;
  created_at: string;
  profile_id: string;
  profiles?: { display_name: string | null } | { display_name: string | null }[] | null;
};

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((part) => part.slice(0, 1).toUpperCase())
    .join("")
    .slice(0, 2) || "CA";
}

function profileName(row: ChatMessageRow, selfProfileId: string) {
  if (row.profile_id === selfProfileId) {
    return "You";
  }

  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  return profile?.display_name ?? "Cohort member";
}

export function mapChatRow(row: ChatMessageRow, selfProfileId: string): CohortChatMessageView {
  const authorName = profileName(row, selfProfileId);
  return {
    id: row.id,
    body: row.body,
    createdAtISO: row.created_at,
    authorName,
    authorInitials: initialsFor(authorName),
    isSelf: row.profile_id === selfProfileId,
  };
}

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
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, body, created_at, profile_id, profiles(display_name)")
      .eq("cohort_id", snapshot.cohortId)
      .order("created_at", { ascending: true })
      .limit(80);

    if (error) {
      return {
        status: "error",
        messages: [],
        error: `Chat persistence is not available yet: ${error.message}`,
      };
    }

    return {
      status: "ready",
      messages: ((data ?? []) as unknown as ChatMessageRow[]).map((row) =>
        mapChatRow(row, snapshot.profileId!),
      ),
    };
  } catch (error) {
    return {
      status: "error",
      messages: [],
      error: error instanceof Error ? error.message : "Chat persistence is not available yet.",
    };
  }
}
