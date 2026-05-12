/**
 * Server Actions for Chat
 *
 * All chat operations go through server actions using the service role to ensure
 * proper authorization and RLS compliance. Client-side direct writes are blocked.
 */

import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { isServerBacked } from "@/lib/secrets";

export type ChatMessage = {
  id: string;
  cohortId: string;
  profileId: string;
  body: string;
  createdAt: string;
  displayName: string | null;
  isSelf: boolean;
};

export type SendMessageResult =
  | { ok: true; message: ChatMessage }
  | { ok: false; error: string };

export type GetMessagesResult =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; error: string };

/**
 * Checks if a user is a member of a cohort
 */
async function isUserCohortMember(
  profileId: string,
  cohortId: string,
): Promise<boolean> {
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

/**
 * Sends a message to a cohort chat
 * Only cohort members can send messages
 */
export async function sendChatMessage(
  cohortId: string,
  body: string,
): Promise<SendMessageResult> {
  if (!isServerBacked()) {
    return { ok: false, error: "Chat is not available in this environment." };
  }

  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return { ok: false, error: "You need to be signed in to send messages." };
  }

  if (!body || body.trim().length === 0) {
    return { ok: false, error: "Message cannot be empty." };
  }

  if (body.length > 500) {
    return { ok: false, error: "Message is too long (max 500 characters)." };
  }

  const user = await currentUser();
  const supabase = createSupabaseAdminClient();

  // Get the user's profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (profileError) {
    return { ok: false, error: `Failed to load profile: ${profileError.message}` };
  }

  if (!profile) {
    return { ok: false, error: "Profile not found." };
  }

  const profileId = (profile as { id: string }).id;
  const displayName = (profile as { display_name: string | null }).display_name;

  // Check if user is a member of the cohort
  const isMember = await isUserCohortMember(profileId, cohortId);
  if (!isMember) {
    return { ok: false, error: "You are not a member of this cohort." };
  }

  // Insert the message
  const { data: message, error: insertError } = await supabase
    .from("chat_messages")
    .insert({
      cohort_id: cohortId,
      profile_id: profileId,
      body: body.trim(),
    })
    .select("id, cohort_id, profile_id, body, created_at")
    .single();

  if (insertError) {
    return { ok: false, error: `Failed to send message: ${insertError.message}` };
  }

  return {
    ok: true,
    message: {
      id: (message as { id: string }).id,
      cohortId: (message as { cohort_id: string }).cohort_id,
      profileId: (message as { profile_id: string }).profile_id,
      body: (message as { body: string }).body,
      createdAt: (message as { created_at: string }).created_at,
      displayName,
      isSelf: true,
    },
  };
}

/**
 * Gets messages for a cohort chat
 * Only cohort members can read messages
 */
export async function getCohortChatMessages(
  cohortId: string,
  limit: number = 50,
): Promise<GetMessagesResult> {
  if (!isServerBacked()) {
    return { ok: false, error: "Chat is not available in this environment." };
  }

  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return { ok: false, error: "You need to be signed in to view messages." };
  }

  const supabase = createSupabaseAdminClient();

  // Get the user's profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (profileError) {
    return { ok: false, error: `Failed to load profile: ${profileError.message}` };
  }

  if (!profile) {
    return { ok: false, error: "Profile not found." };
  }

  const profileId = (profile as { id: string }).id;

  // Check if user is a member of the cohort
  const isMember = await isUserCohortMember(profileId, cohortId);
  if (!isMember) {
    return { ok: false, error: "You are not a member of this cohort." };
  }

  // Get messages with profile info
  const { data: messages, error: messagesError } = await supabase
    .from("chat_messages")
    .select(
      "id, cohort_id, profile_id, body, created_at, profiles(display_name)",
    )
    .eq("cohort_id", cohortId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (messagesError) {
    return { ok: false, error: `Failed to load messages: ${messagesError.message}` };
  }

  const chatMessages: ChatMessage[] = (messages ?? []).map((row) => {
    const profileData = (row as {
      profiles?: { display_name: string | null } | { display_name: string | null }[] | null;
    }).profiles;
    const profileRow = Array.isArray(profileData) ? profileData[0] : profileData;

    return {
      id: (row as { id: string }).id,
      cohortId: (row as { cohort_id: string }).cohort_id,
      profileId: (row as { profile_id: string }).profile_id,
      body: (row as { body: string }).body,
      createdAt: (row as { created_at: string }).created_at,
      displayName: profileRow?.display_name ?? null,
      isSelf: (row as { profile_id: string }).profile_id === profileId,
    };
  });

  // Reverse to show oldest first
  return { ok: true, messages: chatMessages.reverse() };
}
