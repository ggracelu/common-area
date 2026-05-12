import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { getActiveSeason } from "@/lib/catalog";
import { updateProfileOnboardingStatus } from "@/lib/onboarding";

const COHORT_SLUG_BY_ACTIVITY_SLUG: Record<string, string> = {
  "pottery-night-logan-square": "art-room-regulars",
  "bookshop-browsing-lincoln-square": "art-room-regulars",
  "flower-bar-ravenswood": "art-room-regulars",
  "group-cooking-class-west-loop": "table-and-laughs",
  "comedy-show-old-town": "table-and-laughs",
  "mural-walk-pilsen": "neighborhood-strollers",
  "coffee-crawl-wicker-park": "neighborhood-strollers",
  "board-game-night-lakeview": "neighborhood-strollers",
};

function pickCohortSlug(activitySlugs: string[]): string {
  const counts = new Map<string, number>();
  for (const slug of activitySlugs) {
    const cohortSlug = COHORT_SLUG_BY_ACTIVITY_SLUG[slug];
    if (!cohortSlug) continue;
    counts.set(cohortSlug, (counts.get(cohortSlug) ?? 0) + 1);
  }

  let bestSlug = "neighborhood-strollers";
  let bestCount = -1;
  for (const [slug, count] of counts) {
    if (count > bestCount) {
      bestSlug = slug;
      bestCount = count;
    }
  }

  return bestSlug;
}

export async function assignProfileToCohort(profileId: string): Promise<{
  cohortId: string;
  cohortSlug: string;
}> {
  const supabase = createSupabaseAdminClient();
  const season = await getActiveSeason();

  if (!season) {
    throw new Error("No active season is available for assignment.");
  }

  const { data: existingMembership, error: existingError } = await supabase
    .from("cohort_members")
    .select("cohort_id, cohorts(slug)")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Failed to check existing membership: ${existingError.message}`);
  }

  if (existingMembership) {
    const cohort = (existingMembership as { cohorts?: { slug: string } | { slug: string }[] | null }).cohorts;
    const slug = Array.isArray(cohort) ? cohort[0]?.slug : cohort?.slug;
    return {
      cohortId: (existingMembership as { cohort_id: string }).cohort_id,
      cohortSlug: slug ?? "neighborhood-strollers",
    };
  }

  const { data: choiceRows, error: choicesError } = await supabase
    .from("user_activity_choices")
    .select("activity_id")
    .eq("profile_id", profileId)
    .eq("season_id", season.id);

  if (choicesError) {
    throw new Error(`Failed to load choices for assignment: ${choicesError.message}`);
  }

  const activityIds = (choiceRows ?? []).map((row) => (row as { activity_id: string }).activity_id);
  if (activityIds.length < 4) {
    throw new Error("Assignment requires four saved activity choices.");
  }

  const { data: activities, error: activitiesError } = await supabase
    .from("activities")
    .select("slug")
    .in("id", activityIds);

  if (activitiesError) {
    throw new Error(`Failed to resolve activities for assignment: ${activitiesError.message}`);
  }

  const activitySlugs = (activities ?? []).map((row) => (row as { slug: string }).slug);
  const targetSlug = pickCohortSlug(activitySlugs);

  const { data: cohort, error: cohortError } = await supabase
    .from("cohorts")
    .select("id, slug, max_members")
    .eq("season_id", season.id)
    .eq("slug", targetSlug)
    .maybeSingle();

  if (cohortError) {
    throw new Error(`Failed to load target cohort: ${cohortError.message}`);
  }

  if (!cohort) {
    throw new Error(`No cohort found for slug ${targetSlug}.`);
  }

  const { count, error: countError } = await supabase
    .from("cohort_members")
    .select("id", { count: "exact", head: true })
    .eq("cohort_id", (cohort as { id: string }).id);

  if (countError) {
    throw new Error(`Failed to count cohort members: ${countError.message}`);
  }

  const maxMembers = (cohort as { max_members: number | null }).max_members ?? 20;
  if ((count ?? 0) >= maxMembers) {
    throw new Error("The best-fit cohort is full for this season.");
  }

  const { error: insertError } = await supabase.from("cohort_members").insert({
    cohort_id: (cohort as { id: string }).id,
    profile_id: profileId,
  });

  if (insertError) {
    throw new Error(`Failed to assign cohort membership: ${insertError.message}`);
  }

  await updateProfileOnboardingStatus(profileId, "active");

  return {
    cohortId: (cohort as { id: string }).id,
    cohortSlug: (cohort as { slug: string }).slug,
  };
}

export async function markCohortRevealSeen(profileId: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("cohort_members")
    .update({ reveal_seen_at: new Date().toISOString() })
    .eq("profile_id", profileId);

  if (error) {
    throw new Error(`Failed to mark cohort reveal seen: ${error.message}`);
  }
}

export async function lockSelectionsForAssignment(profileId: string): Promise<void> {
  await updateProfileOnboardingStatus(profileId, "assignment_pending");
}
