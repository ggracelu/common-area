import "server-only";

import { createServerSupabasePublicClient } from "@/lib/supabase/server";
import type { BusinessQuest, BusinessQuestCompletion } from "@/types/bingo";

// Type definitions for database rows
type BusinessQuestRow = {
  id: string;
  activity_id: string;
  season_id: string;
  quest_type: string;
  title: string;
  description: string | null;
  target_count: number;
  points: number;
  is_sponsored: boolean;
  created_at: string;
  updated_at: string;
};

type BusinessQuestCompletionRow = {
  id: string;
  profile_id: string;
  business_quest_id: string;
  current_count: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapBusinessQuest(row: BusinessQuestRow): BusinessQuest {
  return {
    id: row.id,
    activityId: row.activity_id,
    seasonId: row.season_id,
    questType: row.quest_type as any,
    title: row.title,
    description: row.description,
    targetCount: row.target_count,
    points: row.points,
    isSponsored: row.is_sponsored,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapBusinessQuestCompletion(
  row: BusinessQuestCompletionRow,
): BusinessQuestCompletion {
  return {
    id: row.id,
    profileId: row.profile_id,
    businessQuestId: row.business_quest_id,
    currentCount: row.current_count,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Get all quests for a season
 */
export async function getBusinessQuests(seasonId: string): Promise<BusinessQuest[]> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("business_quests")
    .select("*")
    .eq("season_id", seasonId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch business quests: ${error.message}`);
  }

  return ((data ?? []) as BusinessQuestRow[]).map(mapBusinessQuest);
}

/**
 * Get quests for a specific activity/business
 */
export async function getQuestsByActivity(
  activityId: string,
): Promise<BusinessQuest[]> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("business_quests")
    .select("*")
    .eq("activity_id", activityId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch quests by activity: ${error.message}`);
  }

  return ((data ?? []) as BusinessQuestRow[]).map(mapBusinessQuest);
}

/**
 * Get a specific quest by ID
 */
export async function getBusinessQuest(
  questId: string,
): Promise<BusinessQuest | null> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("business_quests")
    .select("*")
    .eq("id", questId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch business quest: ${error.message}`);
  }

  return data ? mapBusinessQuest(data as BusinessQuestRow) : null;
}

/**
 * Create a new business quest
 */
export async function createBusinessQuest(
  activityId: string,
  seasonId: string,
  questType: string,
  title: string,
  description?: string,
  targetCount: number,
  points: number = 5,
  isSponsored: boolean = false,
): Promise<BusinessQuest> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("business_quests")
    .insert({
      activity_id: activityId,
      season_id: seasonId,
      quest_type: questType,
      title,
      description: description ?? null,
      target_count: targetCount,
      points,
      is_sponsored: isSponsored,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create business quest: ${error.message}`);
  }

  return mapBusinessQuest(data as BusinessQuestRow);
}

/**
 * Get user's quest completions
 */
export async function getUserQuestCompletions(
  profileId: string,
): Promise<BusinessQuestCompletion[]> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("business_quest_completions")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch quest completions: ${error.message}`);
  }

  return ((data ?? []) as BusinessQuestCompletionRow[]).map(
    mapBusinessQuestCompletion,
  );
}

/**
 * Get user's completion for a specific quest
 */
export async function getUserQuestCompletion(
  profileId: string,
  questId: string,
): Promise<BusinessQuestCompletion | null> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("business_quest_completions")
    .select("*")
    .eq("profile_id", profileId)
    .eq("business_quest_id", questId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch quest completion: ${error.message}`);
  }

  return data ? mapBusinessQuestCompletion(data as BusinessQuestCompletionRow) : null;
}

/**
 * Update quest progress for a user
 */
export async function updateQuestProgress(
  profileId: string,
  questId: string,
  increment: number = 1,
): Promise<BusinessQuestCompletion> {
  const supabase = createServerSupabasePublicClient();

  // Get existing completion
  const { data: existingCompletion, error: fetchError } = await supabase
    .from("business_quest_completions")
    .select("*")
    .eq("profile_id", profileId)
    .eq("business_quest_id", questId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to fetch quest completion: ${fetchError.message}`);
  }

  // Get quest details
  const { data: quest, error: questError } = await supabase
    .from("business_quests")
    .select("*")
    .eq("id", questId)
    .single();

  if (questError) {
    throw new Error(`Failed to fetch quest: ${questError.message}`);
  }

  const targetCount = quest.target_count;
  const newCount = existingCompletion
    ? (existingCompletion.current_count ?? 0) + increment
    : increment;
  const isCompleted = newCount >= targetCount && !existingCompletion?.completed_at;

  if (existingCompletion) {
    // Update existing completion
    const updateData: any = {
      current_count: newCount,
    };

    if (isCompleted) {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error: updateError } = await supabase
      .from("business_quest_completions")
      .update(updateData)
      .eq("id", existingCompletion.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update quest completion: ${updateError.message}`);
    }

    return mapBusinessQuestCompletion(data as BusinessQuestCompletionRow);
  }

  // Create new completion
  const { data, error: createError } = await supabase
    .from("business_quest_completions")
    .insert({
      profile_id: profileId,
      business_quest_id: questId,
      current_count: newCount,
      completed_at: isCompleted ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (createError) {
    throw new Error(`Failed to create quest completion: ${createError.message}`);
  }

  return mapBusinessQuestCompletion(data as BusinessQuestCompletionRow);
}

/**
 * Complete a quest
 */
export async function completeQuest(
  profileId: string,
  questId: string,
): Promise<BusinessQuestCompletion> {
  const supabase = createServerSupabasePublicClient();

  // Get existing completion
  const { data: existingCompletion, error: fetchError } = await supabase
    .from("business_quest_completions")
    .select("*")
    .eq("profile_id", profileId)
    .eq("business_quest_id", questId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to fetch quest completion: ${fetchError.message}`);
  }

  if (existingCompletion) {
    // Update existing completion
    const { data, error: updateError } = await supabase
      .from("business_quest_completions")
      .update({
        completed_at: new Date().toISOString(),
      })
      .eq("id", existingCompletion.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to complete quest: ${updateError.message}`);
    }

    return mapBusinessQuestCompletion(data as BusinessQuestCompletionRow);
  }

  // Create new completion
  const { data, error: createError } = await supabase
    .from("business_quest_completions")
    .insert({
      profile_id: profileId,
      business_quest_id: questId,
      current_count: 0,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (createError) {
    throw new Error(`Failed to create quest completion: ${createError.message}`);
  }

  return mapBusinessQuestCompletion(data as BusinessQuestCompletionRow);
}

/**
 * Get quest progress percentage
 */
export function getQuestProgress(completion: BusinessQuestCompletion, quest: BusinessQuest): number {
  if (quest.targetCount === 0) return 0;
  return Math.min((completion.currentCount / quest.targetCount) * 100, 100);
}

/**
 * Check if a quest is completed
 */
export function isQuestCompleted(completion: BusinessQuestCompletion): boolean {
  return completion.completedAt !== null;
}

/**
 * Get remaining count for a quest
 */
export function getQuestRemaining(completion: BusinessQuestCompletion, quest: BusinessQuest): number {
  return Math.max(0, quest.targetCount - completion.currentCount);
}

/**
 * Create default quests for a new season
 */
export async function createDefaultBusinessQuests(
  activityId: string,
  seasonId: string,
): Promise<BusinessQuest[]> {
  const quests = [
    {
      questType: "regular",
      title: "The Regular",
      description: "Visit this business 3 times this season",
      targetCount: 3,
      points: 5,
    },
    {
      questType: "explorer",
      title: "The Explorer",
      description: "Try something new at this business",
      targetCount: 1,
      points: 3,
    },
    {
      questType: "connector",
      title: "The Connector",
      description: "Introduce two people at this business",
      targetCount: 1,
      points: 5,
    },
    {
      questType: "local",
      title: "The Local",
      description: "Learn a fact about this business from the staff",
      targetCount: 1,
      points: 3,
    },
  ];

  const createdQuests: BusinessQuest[] = [];

  for (const quest of quests) {
    const created = await createBusinessQuest(
      activityId,
      seasonId,
      quest.questType,
      quest.title,
      quest.description,
      quest.targetCount,
      quest.points,
    );
    createdQuests.push(created);
  }

  return createdQuests;
}
