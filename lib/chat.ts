import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { CohortChatMessageView } from "@/types/chat";

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

export async function isCohortMember(profileId: string, cohortId: string): Promise<boolean> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("cohort_members")
    .select("id")
    .eq("profile_id", profileId)
    .eq("cohort_id", cohortId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to check cohort membership: ${error.message}`);
  }

  return Boolean(data);
}

export async function listCohortChatMessages({
  profileId,
  cohortId,
  limit = 80,
}: {
  profileId: string;
  cohortId: string;
  limit?: number;
}): Promise<CohortChatMessageView[]> {
  const isMember = await isCohortMember(profileId, cohortId);
  if (!isMember) {
    throw new Error("You are not a member of this cohort.");
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, body, created_at, profile_id, profiles(display_name)")
    .eq("cohort_id", cohortId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to load messages: ${error.message}`);
  }

  return ((data ?? []) as unknown as ChatMessageRow[]).map((row) => mapChatRow(row, profileId));
}

export async function sendCohortChatMessage({
  profileId,
  cohortId,
  body,
}: {
  profileId: string;
  cohortId: string;
  body: string;
}): Promise<CohortChatMessageView> {
  const trimmed = body.trim();
  if (!trimmed) {
    throw new Error("Message cannot be empty.");
  }

  if (trimmed.length > 500) {
    throw new Error("Keep chat messages under 500 characters.");
  }

  const isMember = await isCohortMember(profileId, cohortId);
  if (!isMember) {
    throw new Error("You are not a member of this cohort.");
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      cohort_id: cohortId,
      profile_id: profileId,
      body: trimmed,
    })
    .select("id, body, created_at, profile_id, profiles(display_name)")
    .single();

  if (error) {
    throw new Error(`Message was not saved: ${error.message}`);
  }

  return mapChatRow(data as unknown as ChatMessageRow, profileId);
}
