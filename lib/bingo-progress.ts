import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { getActiveSeason } from "@/lib/catalog";

export async function getBingoCompletionIdsForProfile(profileId: string): Promise<string[]> {
  const supabase = createSupabaseAdminClient();
  const season = await getActiveSeason();
  if (!season) {
    return [];
  }

  const { data: card, error: cardError } = await supabase
    .from("bingo_cards")
    .select("id")
    .eq("profile_id", profileId)
    .eq("season_id", season.id)
    .maybeSingle();

  if (cardError) {
    throw new Error(`Failed to load bingo card: ${cardError.message}`);
  }

  if (!card) {
    return [];
  }

  const { data: completions, error: completionError } = await supabase
    .from("bingo_completions")
    .select("prompt_id")
    .eq("profile_id", profileId)
    .eq("bingo_card_id", (card as { id: string }).id);

  if (completionError) {
    throw new Error(`Failed to load bingo completions: ${completionError.message}`);
  }

  return (completions ?? []).map((row) => (row as { prompt_id: string }).prompt_id);
}

export async function toggleBingoTileForProfile({
  profileId,
  promptId,
  completed,
  cohortId,
}: {
  profileId: string;
  promptId: string;
  completed: boolean;
  cohortId: string | null;
}): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const season = await getActiveSeason();
  if (!season) {
    throw new Error("No active season is available.");
  }

  const { data: existingCard, error: cardLookupError } = await supabase
    .from("bingo_cards")
    .select("id, completed_prompts")
    .eq("profile_id", profileId)
    .eq("season_id", season.id)
    .maybeSingle();

  if (cardLookupError) {
    throw new Error(`Failed to load bingo card: ${cardLookupError.message}`);
  }

  let cardId = (existingCard as { id: string } | null)?.id;
  if (!cardId) {
    const { data: inserted, error: insertCardError } = await supabase
      .from("bingo_cards")
      .insert({
        profile_id: profileId,
        season_id: season.id,
        cohort_id: cohortId,
        total_prompts: 0,
        completed_prompts: 0,
      })
      .select("id")
      .single();

    if (insertCardError) {
      throw new Error(`Failed to create bingo card: ${insertCardError.message}`);
    }

    cardId = (inserted as { id: string }).id;
  }

  if (completed) {
    const { error: completionError } = await supabase.from("bingo_completions").upsert(
      {
        profile_id: profileId,
        bingo_card_id: cardId,
        prompt_id: promptId,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "profile_id,prompt_id" },
    );

    if (completionError) {
      throw new Error(`Failed to save bingo completion: ${completionError.message}`);
    }
  } else {
    const { error: deleteError } = await supabase
      .from("bingo_completions")
      .delete()
      .eq("profile_id", profileId)
      .eq("prompt_id", promptId);

    if (deleteError) {
      throw new Error(`Failed to remove bingo completion: ${deleteError.message}`);
    }
  }

  const { count, error: countError } = await supabase
    .from("bingo_completions")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", profileId)
    .eq("bingo_card_id", cardId);

  if (countError) {
    throw new Error(`Failed to count bingo completions: ${countError.message}`);
  }

  const { error: updateCardError } = await supabase
    .from("bingo_cards")
    .update({ completed_prompts: count ?? 0 })
    .eq("id", cardId);

  if (updateCardError) {
    throw new Error(`Failed to update bingo card progress: ${updateCardError.message}`);
  }
}
