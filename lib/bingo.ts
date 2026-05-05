import "server-only";

import { createServerSupabasePublicClient } from "@/lib/supabase/server";
import type {
  BingoCard,
  BingoCardWithPrompts,
  BingoCompletion,
  BingoPrompt,
  GamificationStats,
  UserAchievement,
  UserStreak,
} from "@/types/bingo";

// Type definitions for database rows
type BingoCardRow = {
  id: string;
  profile_id: string;
  season_id: string;
  cohort_id: string | null;
  total_prompts: number;
  completed_prompts: number;
  created_at: string;
  updated_at: string;
};

type BingoPromptRow = {
  id: string;
  season_id: string;
  activity_id: string | null;
  title: string;
  description: string | null;
  prompt_type: string;
  difficulty: string;
  requires_interaction: boolean;
  points: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type BingoCompletionRow = {
  id: string;
  profile_id: string;
  bingo_card_id: string;
  prompt_id: string;
  completed_at: string;
  notes: string | null;
};

type UserStreakRow = {
  id: string;
  profile_id: string;
  season_id: string;
  streak_type: string;
  current_count: number;
  best_count: number;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
};

type UserAchievementRow = {
  id: string;
  profile_id: string;
  season_id: string;
  achievement_type: string;
  title: string;
  description: string | null;
  icon_url: string | null;
  unlocked_at: string;
};

// Mapping functions
function mapBingoCard(row: BingoCardRow): BingoCard {
  return {
    id: row.id,
    profileId: row.profile_id,
    seasonId: row.season_id,
    cohortId: row.cohort_id,
    totalPrompts: row.total_prompts,
    completedPrompts: row.completed_prompts,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapBingoPrompt(row: BingoPromptRow): BingoPrompt {
  return {
    id: row.id,
    seasonId: row.season_id,
    activityId: row.activity_id,
    title: row.title,
    description: row.description,
    promptType: row.prompt_type as any,
    difficulty: row.difficulty as any,
    requiresInteraction: row.requires_interaction,
    points: row.points,
    displayOrder: row.display_order,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapBingoCompletion(row: BingoCompletionRow): BingoCompletion {
  return {
    id: row.id,
    profileId: row.profile_id,
    bingoCardId: row.bingo_card_id,
    promptId: row.prompt_id,
    completedAt: row.completed_at,
    notes: row.notes,
  };
}

function mapUserStreak(row: UserStreakRow): UserStreak {
  return {
    id: row.id,
    profileId: row.profile_id,
    seasonId: row.season_id,
    streakType: row.streak_type as any,
    currentCount: row.current_count,
    bestCount: row.best_count,
    lastActivityAt: row.last_activity_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapUserAchievement(row: UserAchievementRow): UserAchievement {
  return {
    id: row.id,
    profileId: row.profile_id,
    seasonId: row.season_id,
    achievementType: row.achievement_type as any,
    title: row.title,
    description: row.description,
    iconUrl: row.icon_url,
    unlockedAt: row.unlocked_at,
  };
}

// Core API functions

/**
 * Get or create a bingo card for a user in a season
 */
export async function getOrCreateBingoCard(
  profileId: string,
  seasonId: string,
): Promise<BingoCard> {
  const supabase = createServerSupabasePublicClient();

  // Try to get existing card
  const { data: existingCard, error: fetchError } = await supabase
    .from("bingo_cards")
    .select("*")
    .eq("profile_id", profileId)
    .eq("season_id", seasonId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to fetch bingo card: ${fetchError.message}`);
  }

  if (existingCard) {
    return mapBingoCard(existingCard as BingoCardRow);
  }

  // Create new card
  const { data: newCard, error: createError } = await supabase
    .from("bingo_cards")
    .insert({
      profile_id: profileId,
      season_id: seasonId,
      total_prompts: 0,
      completed_prompts: 0,
    })
    .select()
    .single();

  if (createError) {
    throw new Error(`Failed to create bingo card: ${createError.message}`);
  }

  return mapBingoCard(newCard as BingoCardRow);
}

/**
 * Get all active prompts for a season
 */
export async function getActivePrompts(seasonId: string): Promise<BingoPrompt[]> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("bingo_prompts")
    .select("*")
    .eq("season_id", seasonId)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch prompts: ${error.message}`);
  }

  return ((data ?? []) as BingoPromptRow[]).map(mapBingoPrompt);
}

/**
 * Get a bingo card with prompts and completion status
 */
export async function getBingoCardWithPrompts(
  profileId: string,
  seasonId: string,
): Promise<BingoCardWithPrompts> {
  const card = await getOrCreateBingoCard(profileId, seasonId);
  const prompts = await getActivePrompts(seasonId);

  // Get completions for this user
  const supabase = createServerSupabasePublicClient();
  const { data: completions, error: completionsError } = await supabase
    .from("bingo_completions")
    .select("prompt_id, completed_at")
    .eq("profile_id", profileId);

  if (completionsError) {
    throw new Error(`Failed to fetch completions: ${completionsError.message}`);
  }

  const completionMap = new Map(
    (completions ?? []).map((c) => [c.prompt_id, c.completed_at]),
  );

  const promptsWithStatus = prompts.map((prompt) => ({
    ...prompt,
    completed: completionMap.has(prompt.id),
    completedAt: completionMap.get(prompt.id),
  }));

  return {
    ...card,
    prompts: promptsWithStatus,
  };
}

/**
 * Complete a prompt
 */
export async function completePrompt(
  profileId: string,
  bingoCardId: string,
  promptId: string,
  notes?: string,
): Promise<BingoCompletion> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("bingo_completions")
    .insert({
      profile_id: profileId,
      bingo_card_id: bingoCardId,
      prompt_id: promptId,
      notes: notes ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to complete prompt: ${error.message}`);
  }

  // Update bingo card completion count
  const { error: updateError } = await supabase
    .from("bingo_cards")
    .update({
      completed_prompts: supabase.rpc("increment", { x: 1 }),
    })
    .eq("id", bingoCardId);

  if (updateError) {
    throw new Error(`Failed to update bingo card: ${updateError.message}`);
  }

  return mapBingoCompletion(data as BingoCompletionRow);
}

/**
 * Get user's streaks for a season
 */
export async function getUserStreaks(
  profileId: string,
  seasonId: string,
): Promise<UserStreak[]> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("profile_id", profileId)
    .eq("season_id", seasonId);

  if (error) {
    throw new Error(`Failed to fetch streaks: ${error.message}`);
  }

  return ((data ?? []) as UserStreakRow[]).map(mapUserStreak);
}

/**
 * Update a user's streak
 */
export async function updateStreak(
  profileId: string,
  seasonId: string,
  streakType: string,
  increment: boolean = true,
): Promise<UserStreak> {
  const supabase = createServerSupabasePublicClient();

  // Get existing streak
  const { data: existingStreak, error: fetchError } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("profile_id", profileId)
    .eq("season_id", seasonId)
    .eq("streak_type", streakType)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to fetch streak: ${fetchError.message}`);
  }

  const now = new Date().toISOString();

  if (existingStreak) {
    const currentCount = increment
      ? existingStreak.current_count + 1
      : existingStreak.current_count;
    const bestCount = Math.max(currentCount, existingStreak.best_count);

    const { data, error: updateError } = await supabase
      .from("user_streaks")
      .update({
        current_count: currentCount,
        best_count: bestCount,
        last_activity_at: now,
      })
      .eq("id", existingStreak.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update streak: ${updateError.message}`);
    }

    return mapUserStreak(data as UserStreakRow);
  }

  // Create new streak
  const { data, error: createError } = await supabase
    .from("user_streaks")
    .insert({
      profile_id: profileId,
      season_id: seasonId,
      streak_type: streakType,
      current_count: 1,
      best_count: 1,
      last_activity_at: now,
    })
    .select()
    .single();

  if (createError) {
    throw new Error(`Failed to create streak: ${createError.message}`);
  }

  return mapUserStreak(data as UserStreakRow);
}

/**
 * Get user's achievements for a season
 */
export async function getUserAchievements(
  profileId: string,
  seasonId: string,
): Promise<UserAchievement[]> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("profile_id", profileId)
    .eq("season_id", seasonId)
    .order("unlocked_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch achievements: ${error.message}`);
  }

  return ((data ?? []) as UserAchievementRow[]).map(mapUserAchievement);
}

/**
 * Unlock an achievement for a user
 */
export async function unlockAchievement(
  profileId: string,
  seasonId: string,
  achievementType: string,
  title: string,
  description?: string,
  iconUrl?: string,
): Promise<UserAchievement> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("user_achievements")
    .insert({
      profile_id: profileId,
      season_id: seasonId,
      achievement_type: achievementType,
      title,
      description: description ?? null,
      icon_url: iconUrl ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to unlock achievement: ${error.message}`);
  }

  return mapUserAchievement(data as UserAchievementRow);
}

/**
 * Get comprehensive gamification stats for a user
 */
export async function getGamificationStats(
  profileId: string,
  seasonId: string,
): Promise<GamificationStats> {
  const card = await getOrCreateBingoCard(profileId, seasonId);
  const streaks = await getUserStreaks(profileId, seasonId);
  const achievements = await getUserAchievements(profileId, seasonId);

  const completionRate =
    card.totalPrompts > 0 ? (card.completedPrompts / card.totalPrompts) * 100 : 0;

  return {
    totalPrompts: card.totalPrompts,
    completedPrompts: card.completedPrompts,
    completionRate,
    currentStreaks: streaks,
    achievements,
    activeChallenges: [], // Will be populated when cohort challenges are implemented
  };
}

/**
 * Get prompts filtered by type
 */
export async function getPromptsByType(
  seasonId: string,
  promptType: string,
): Promise<BingoPrompt[]> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("bingo_prompts")
    .select("*")
    .eq("season_id", seasonId)
    .eq("prompt_type", promptType)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch prompts by type: ${error.message}`);
  }

  return ((data ?? []) as BingoPromptRow[]).map(mapBingoPrompt);
}

/**
 * Get prompts for a specific activity/business
 */
export async function getPromptsByActivity(
  activityId: string,
): Promise<BingoPrompt[]> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("bingo_prompts")
    .select("*")
    .eq("activity_id", activityId)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch prompts by activity: ${error.message}`);
  }

  return ((data ?? []) as BingoPromptRow[]).map(mapBingoPrompt);
}
