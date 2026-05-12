import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { getActiveSeason } from "@/lib/catalog";
import { updateProfileOnboardingStatus } from "@/lib/onboarding";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_SECRET_KEY);
}

async function assertGraderUndoAllowed(): Promise<{ profileId: string; clerkUserId: string }> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured on this environment.");
  }

  const user = await currentUser();
  if (!user?.id) {
    throw new Error("Sign in to use grader undo controls.");
  }

  const graderEmail = process.env.GRADER_CLERK_EMAIL?.trim().toLowerCase();
  const userEmail = user.primaryEmailAddress?.emailAddress?.trim().toLowerCase();
  const allowed =
    process.env.NODE_ENV === "development" ||
    (graderEmail && userEmail && graderEmail === userEmail);

  if (!allowed) {
    throw new Error("Grader undo controls are limited to the shared grader account.");
  }

  const supabase = createSupabaseAdminClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load profile for undo: ${error.message}`);
  }

  if (!profile) {
    throw new Error("Profile not found for undo.");
  }

  return { profileId: (profile as { id: string }).id, clerkUserId: user.id };
}

export async function undoDepositForGrader(): Promise<void> {
  const { profileId } = await assertGraderUndoAllowed();
  const season = await getActiveSeason();
  if (!season) {
    throw new Error("No active season is available.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("deposits")
    .update({ status: "pending", paid_at: null })
    .eq("profile_id", profileId)
    .eq("season_id", season.id);

  if (error) {
    throw new Error(`Failed to undo deposit: ${error.message}`);
  }

  await updateProfileOnboardingStatus(profileId, "deposit_pending");
}

export async function undoPicksForGrader(): Promise<void> {
  const { profileId } = await assertGraderUndoAllowed();
  const season = await getActiveSeason();
  if (!season) {
    throw new Error("No active season is available.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("user_activity_choices")
    .delete()
    .eq("profile_id", profileId)
    .eq("season_id", season.id);

  if (error) {
    throw new Error(`Failed to undo activity picks: ${error.message}`);
  }

  await updateProfileOnboardingStatus(profileId, "selection_pending");
}

export async function undoMatchingForGrader(): Promise<void> {
  const { profileId } = await assertGraderUndoAllowed();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("cohort_members").delete().eq("profile_id", profileId);

  if (error) {
    throw new Error(`Failed to undo cohort matching: ${error.message}`);
  }

  await updateProfileOnboardingStatus(profileId, "assignment_pending");
}

export async function undoRevealForGrader(): Promise<void> {
  const { profileId } = await assertGraderUndoAllowed();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("cohort_members")
    .update({ reveal_seen_at: null })
    .eq("profile_id", profileId);

  if (error) {
    throw new Error(`Failed to undo cohort reveal: ${error.message}`);
  }
}

export async function undoBingoForGrader(): Promise<void> {
  const { profileId } = await assertGraderUndoAllowed();
  const season = await getActiveSeason();
  if (!season) {
    throw new Error("No active season is available.");
  }

  const supabase = createSupabaseAdminClient();
  const { data: card, error: cardError } = await supabase
    .from("bingo_cards")
    .select("id")
    .eq("profile_id", profileId)
    .eq("season_id", season.id)
    .maybeSingle();

  if (cardError) {
    throw new Error(`Failed to load bingo card for undo: ${cardError.message}`);
  }

  const cardId = (card as { id: string } | null)?.id;
  if (cardId) {
    const { error: completionError } = await supabase
      .from("bingo_completions")
      .delete()
      .eq("profile_id", profileId)
      .eq("bingo_card_id", cardId);

    if (completionError) {
      throw new Error(`Failed to undo bingo completions: ${completionError.message}`);
    }

    const { error: cardUpdateError } = await supabase
      .from("bingo_cards")
      .update({ completed_prompts: 0 })
      .eq("id", cardId);

    if (cardUpdateError) {
      throw new Error(`Failed to reset bingo card progress: ${cardUpdateError.message}`);
    }
  }
}

export async function resetJourneyForGrader(): Promise<void> {
  await undoBingoForGrader().catch(() => undefined);
  await undoRevealForGrader().catch(() => undefined);
  await undoMatchingForGrader().catch(() => undefined);
  await undoPicksForGrader().catch(() => undefined);
  await undoDepositForGrader();
}
