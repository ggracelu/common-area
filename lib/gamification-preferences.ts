import "server-only";

import { createServerSupabasePublicClient } from "@/lib/supabase/server";
import type { UserGamificationPreferences, PromptType } from "@/types/bingo";

// Type definitions for database rows
type UserGamificationPreferencesRow = {
  id: string;
  profile_id: string;
  notifications_enabled: boolean;
  max_active_prompts: number;
  prompt_types_enabled: string[];
  quiet_hours_start: string;
  quiet_hours_end: string;
  temporary_pause_until: string | null;
  created_at: string;
  updated_at: string;
};

function mapUserGamificationPreferences(
  row: UserGamificationPreferencesRow,
): UserGamificationPreferences {
  return {
    id: row.id,
    profileId: row.profile_id,
    notificationsEnabled: row.notifications_enabled,
    maxActivePrompts: row.max_active_prompts,
    promptTypesEnabled: row.prompt_types_enabled as PromptType[],
    quietHoursStart: row.quiet_hours_start,
    quietHoursEnd: row.quiet_hours_end,
    temporaryPauseUntil: row.temporary_pause_until,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Get user's gamification preferences
 */
export async function getUserGamificationPreferences(
  profileId: string,
): Promise<UserGamificationPreferences> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("user_gamification_preferences")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch gamification preferences: ${error.message}`);
  }

  // Return default preferences if none exist
  if (!data) {
    return getDefaultGamificationPreferences(profileId);
  }

  return mapUserGamificationPreferences(data as UserGamificationPreferencesRow);
}

/**
 * Get default gamification preferences
 */
export function getDefaultGamificationPreferences(
  profileId: string,
): UserGamificationPreferences {
  return {
    id: `default-${profileId}`,
    profileId,
    notificationsEnabled: true,
    maxActivePrompts: 3,
    promptTypesEnabled: [
      "icebreaker",
      "shared_experience",
      "discovery",
      "collaboration",
      "recognition",
    ],
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    temporaryPauseUntil: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Create or update user's gamification preferences
 */
export async function upsertGamificationPreferences(
  profileId: string,
  preferences: Partial<UserGamificationPreferences>,
): Promise<UserGamificationPreferences> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("user_gamification_preferences")
    .upsert({
      profile_id: profileId,
      notifications_enabled: preferences.notificationsEnabled ?? true,
      max_active_prompts: preferences.maxActivePrompts ?? 3,
      prompt_types_enabled:
        preferences.promptTypesEnabled ??
        (["icebreaker", "shared_experience", "discovery", "collaboration", "recognition"] as PromptType[]),
      quiet_hours_start: preferences.quietHoursStart ?? "22:00",
      quiet_hours_end: preferences.quietHoursEnd ?? "08:00",
      temporary_pause_until: preferences.temporaryPauseUntil ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to upsert gamification preferences: ${error.message}`);
  }

  return mapUserGamificationPreferences(data as UserGamificationPreferencesRow);
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  profileId: string,
  enabled: boolean,
): Promise<UserGamificationPreferences> {
  const current = await getUserGamificationPreferences(profileId);
  return upsertGamificationPreferences(profileId, {
    ...current,
    notificationsEnabled: enabled,
  });
}

/**
 * Update max active prompts
 */
export async function updateMaxActivePrompts(
  profileId: string,
  maxPrompts: number,
): Promise<UserGamificationPreferences> {
  const current = await getUserGamificationPreferences(profileId);
  return upsertGamificationPreferences(profileId, {
    ...current,
    maxActivePrompts: maxPrompts,
  });
}

/**
 * Update enabled prompt types
 */
export async function updatePromptTypesEnabled(
  profileId: string,
  promptTypes: PromptType[],
): Promise<UserGamificationPreferences> {
  const current = await getUserGamificationPreferences(profileId);
  return upsertGamificationPreferences(profileId, {
    ...current,
    promptTypesEnabled: promptTypes,
  });
}

/**
 * Update quiet hours
 */
export async function updateQuietHours(
  profileId: string,
  start: string,
  end: string,
): Promise<UserGamificationPreferences> {
  const current = await getUserGamificationPreferences(profileId);
  return upsertGamificationPreferences(profileId, {
    ...current,
    quietHoursStart: start,
    quietHoursEnd: end,
  });
}

/**
 * Set temporary pause
 */
export async function setTemporaryPause(
  profileId: string,
  until: Date | null,
): Promise<UserGamificationPreferences> {
  const current = await getUserGamificationPreferences(profileId);
  return upsertGamificationPreferences(profileId, {
    ...current,
    temporaryPauseUntil: until?.toISOString() ?? null,
  });
}

/**
 * Check if notifications should be sent based on preferences
 */
export async function shouldSendNotifications(
  profileId: string,
): Promise<boolean> {
  const preferences = await getUserGamificationPreferences(profileId);

  // Check if notifications are enabled
  if (!preferences.notificationsEnabled) {
    return false;
  }

  // Check if temporarily paused
  if (preferences.temporaryPauseUntil) {
    const pauseUntil = new Date(preferences.temporaryPauseUntil);
    if (pauseUntil > new Date()) {
      return false;
    }
  }

  // Check if within quiet hours
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [startHour, startMinute] = preferences.quietHoursStart.split(":").map(Number);
  const [endHour, endMinute] = preferences.quietHoursEnd.split(":").map(Number);

  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  // Handle overnight quiet hours (e.g., 22:00 to 08:00)
  if (startTime > endTime) {
    // Quiet hours span midnight
    if (currentTime >= startTime || currentTime < endTime) {
      return false;
    }
  } else {
    // Quiet hours within same day
    if (currentTime >= startTime && currentTime < endTime) {
      return false;
    }
  }

  return true;
}

/**
 * Check if a prompt type is enabled for a user
 */
export async function isPromptTypeEnabled(
  profileId: string,
  promptType: PromptType,
): Promise<boolean> {
  const preferences = await getUserGamificationPreferences(profileId);
  return preferences.promptTypesEnabled.includes(promptType);
}

/**
 * Get number of active prompts a user should see
 */
export async function getActivePromptCount(
  profileId: string,
): Promise<number> {
  const preferences = await getUserGamificationPreferences(profileId);
  return preferences.maxActivePrompts;
}
