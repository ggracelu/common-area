import "server-only";

import { createServerSupabasePublicClient } from "@/lib/supabase/server";
import type { CohortChallenge } from "@/types/bingo";

// Type definitions for database rows
type CohortChallengeRow = {
  id: string;
  cohort_id: string;
  challenge_type: string;
  title: string;
  description: string | null;
  target_count: number;
  current_count: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapCohortChallenge(row: CohortChallengeRow): CohortChallenge {
  return {
    id: row.id,
    cohortId: row.cohort_id,
    challengeType: row.challenge_type as any,
    title: row.title,
    description: row.description,
    targetCount: row.target_count,
    currentCount: row.current_count,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Get all challenges for a cohort
 */
export async function getCohortChallenges(
  cohortId: string,
): Promise<CohortChallenge[]> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("cohort_challenges")
    .select("*")
    .eq("cohort_id", cohortId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch cohort challenges: ${error.message}`);
  }

  return ((data ?? []) as CohortChallengeRow[]).map(mapCohortChallenge);
}

/**
 * Get active challenges for a cohort (not completed)
 */
export async function getActiveCohortChallenges(
  cohortId: string,
): Promise<CohortChallenge[]> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("cohort_challenges")
    .select("*")
    .eq("cohort_id", cohortId)
    .is("completed_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch active cohort challenges: ${error.message}`);
  }

  return ((data ?? []) as CohortChallengeRow[]).map(mapCohortChallenge);
}

/**
 * Get a specific challenge by ID
 */
export async function getCohortChallenge(
  challengeId: string,
): Promise<CohortChallenge | null> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("cohort_challenges")
    .select("*")
    .eq("id", challengeId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch cohort challenge: ${error.message}`);
  }

  return data ? mapCohortChallenge(data as CohortChallengeRow) : null;
}

/**
 * Create a new cohort challenge
 */
export async function createCohortChallenge(
  cohortId: string,
  challengeType: string,
  title: string,
  description?: string,
  targetCount: number,
): Promise<CohortChallenge> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("cohort_challenges")
    .insert({
      cohort_id: cohortId,
      challenge_type: challengeType,
      title,
      description: description ?? null,
      target_count: targetCount,
      current_count: 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create cohort challenge: ${error.message}`);
  }

  return mapCohortChallenge(data as CohortChallengeRow);
}

/**
 * Update challenge progress
 */
export async function updateChallengeProgress(
  challengeId: string,
  increment: number = 1,
): Promise<CohortChallenge> {
  const supabase = createServerSupabasePublicClient();

  // Get current challenge
  const { data: currentChallenge, error: fetchError } = await supabase
    .from("cohort_challenges")
    .select("*")
    .eq("id", challengeId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch challenge: ${fetchError.message}`);
  }

  const newCount = (currentChallenge.current_count ?? 0) + increment;
  const targetCount = currentChallenge.target_count;
  const isCompleted = newCount >= targetCount && !currentChallenge.completed_at;

  const updateData: any = {
    current_count: newCount,
  };

  if (isCompleted) {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error: updateError } = await supabase
    .from("cohort_challenges")
    .update(updateData)
    .eq("id", challengeId)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update challenge: ${updateError.message}`);
  }

  return mapCohortChallenge(data as CohortChallengeRow);
}

/**
 * Complete a challenge
 */
export async function completeChallenge(
  challengeId: string,
): Promise<CohortChallenge> {
  const supabase = createServerSupabasePublicClient();

  const { data, error } = await supabase
    .from("cohort_challenges")
    .update({
      completed_at: new Date().toISOString(),
    })
    .eq("id", challengeId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to complete challenge: ${error.message}`);
  }

  return mapCohortChallenge(data as CohortChallengeRow);
}

/**
 * Delete a challenge
 */
export async function deleteChallenge(challengeId: string): Promise<void> {
  const supabase = createServerSupabasePublicClient();

  const { error } = await supabase
    .from("cohort_challenges")
    .delete()
    .eq("id", challengeId);

  if (error) {
    throw new Error(`Failed to delete challenge: ${error.message}`);
  }
}

/**
 * Get challenge progress percentage
 */
export function getChallengeProgress(challenge: CohortChallenge): number {
  if (challenge.targetCount === 0) return 0;
  return Math.min(
    (challenge.currentCount / challenge.targetCount) * 100,
    100,
  );
}

/**
 * Check if a challenge is completed
 */
export function isChallengeCompleted(challenge: CohortChallenge): boolean {
  return challenge.completedAt !== null;
}

/**
 * Get remaining count for a challenge
 */
export function getChallengeRemaining(challenge: CohortChallenge): number {
  return Math.max(0, challenge.targetCount - challenge.currentCount);
}

/**
 * Create default challenges for a new cohort
 */
export async function createDefaultCohortChallenges(
  cohortId: string,
): Promise<CohortChallenge[]> {
  const challenges = [
    {
      challengeType: "weekly_prompts",
      title: "Weekly Prompt Challenge",
      description: "Complete at least 10 prompts as a cohort this week",
      targetCount: 10,
    },
    {
      challengeType: "visit_all_businesses",
      title: "Business Explorer",
      description: "Visit all 6 partner businesses as a cohort",
      targetCount: 6,
    },
    {
      challengeType: "total_completions",
      title: "Prompt Master",
      description: "Complete 50 total prompts as a cohort this season",
      targetCount: 50,
    },
    {
      challengeType: "meet_everyone",
      title: "Full Circle",
      description: "Have every cohort member complete at least one prompt",
      targetCount: 20, // Will be adjusted based on cohort size
    },
  ];

  const createdChallenges: CohortChallenge[] = [];

  for (const challenge of challenges) {
    const created = await createCohortChallenge(
      cohortId,
      challenge.challengeType,
      challenge.title,
      challenge.description,
      challenge.targetCount,
    );
    createdChallenges.push(created);
  }

  return createdChallenges;
}
