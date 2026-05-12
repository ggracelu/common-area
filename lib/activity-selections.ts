import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { getActiveSeason } from "@/lib/catalog";
import {
  ACTIVITY_SLUG_TO_DEMO_EVENT,
  demoEventIdsToSlugs,
  DEMO_EVENT_TO_ACTIVITY_SLUG,
} from "@/lib/demo-activity-slug-map";
import { ensureProfileForClerk } from "@/lib/profile-sync";
import { getDepositForUserAndSeason } from "@/lib/deposits";
import { lockSelectionsForAssignment } from "@/lib/cohort-assignment";
import { updateProfileOnboardingStatus } from "@/lib/onboarding";

function isSupabaseSecretsConfigured() {
  return Boolean(process.env.SUPABASE_SECRET_KEY);
}

/**
 * Returns saved demo event ids, or `null` if Supabase is not configured (caller should keep local-only state).
 */
export async function getSavedDemoEventIdsForUser(clerkUserId: string): Promise<string[] | null> {
  try {
    if (!isSupabaseSecretsConfigured()) {
      return null;
    }

    const supabase = createSupabaseAdminClient();
    const season = await getActiveSeason();

    if (!season) {
      return [];
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle();

    if (profileError) {
      throw new Error(`Failed to load profile: ${profileError.message}`);
    }

    if (!profile) {
      return [];
    }

    const profileId = (profile as { id: string }).id;

    const { data: rows, error: choicesError } = await supabase
      .from("user_activity_choices")
      .select("choice_rank, activity_id")
      .eq("profile_id", profileId)
      .eq("season_id", season.id)
      .order("choice_rank", { ascending: true });

    if (choicesError) {
      throw new Error(`Failed to load activity choices: ${choicesError.message}`);
    }

    const activityIds = (rows ?? []).map((r) => (r as { activity_id: string }).activity_id);
    if (activityIds.length === 0) {
      return [];
    }

    const { data: actRows, error: actErr } = await supabase
      .from("activities")
      .select("id, slug")
      .in("id", activityIds);

    if (actErr) {
      throw new Error(`Failed to load activities for choices: ${actErr.message}`);
    }

    const idToSlug = new Map((actRows ?? []).map((r) => [(r as { id: string }).id, (r as { slug: string }).slug]));

    const demoIds: string[] = [];
    for (const row of rows ?? []) {
      const slug = idToSlug.get((row as { activity_id: string }).activity_id);
      if (!slug) continue;
      const demoId = ACTIVITY_SLUG_TO_DEMO_EVENT[slug];
      if (demoId) {
        demoIds.push(demoId);
      }
    }

    return demoIds;
  } catch {
    return null;
  }
}

export type SaveActivitySelectionsResult =
  | { ok: true; savedAt: string }
  | { ok: false; error: string };

/**
 * Replaces all activity choices for the active season (0–4 picks). Requires Clerk session.
 */
export async function saveDemoActivitySelectionsForAuthenticatedUser(
  demoEventIds: string[],
): Promise<SaveActivitySelectionsResult> {
  if (!isSupabaseSecretsConfigured()) {
    return { ok: false, error: "Supabase is not configured on this environment." };
  }

  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return { ok: false, error: "You need to be signed in to save picks to your account." };
  }

  const unique = [...new Set(demoEventIds)];

  if (unique.length !== demoEventIds.length) {
    return { ok: false, error: "Duplicate activity picks are not allowed." };
  }

  if (demoEventIds.length > 4) {
    return { ok: false, error: "Choose at most four experiences." };
  }

  for (const id of demoEventIds) {
    if (!DEMO_EVENT_TO_ACTIVITY_SLUG[id]) {
      return { ok: false, error: `Invalid activity selection: ${id}` };
    }
  }

  const user = await currentUser();
  const profileId = await ensureProfileForClerk(clerkUserId, {
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    displayName: user?.fullName ?? user?.username ?? user?.firstName ?? null,
  });

  const season = await getActiveSeason();

  if (!season) {
    return { ok: false, error: "No active season is available to save picks." };
  }

  const slugs = demoEventIdsToSlugs(demoEventIds);
  const supabase = createSupabaseAdminClient();

  const { data: activityRows, error: actError } = await supabase
    .from("activities")
    .select("id, slug")
    .in("slug", slugs);

  if (actError) {
    return { ok: false, error: `Failed to resolve activities: ${actError.message}` };
  }

  const slugToId = new Map((activityRows ?? []).map((r) => [(r as { slug: string }).slug, (r as { id: string }).id]));

  const { data: linkRows, error: linkError } = await supabase
    .from("season_activities")
    .select("activity_id")
    .eq("season_id", season.id)
    .in(
      "activity_id",
      slugs.map((s) => slugToId.get(s)).filter(Boolean) as string[],
    );

  if (linkError) {
    return { ok: false, error: `Failed to validate season activities: ${linkError.message}` };
  }

  const allowed = new Set((linkRows ?? []).map((r) => (r as { activity_id: string }).activity_id));
  const resolved: { activityId: string; rank: number }[] = [];

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i]!;
    const activityId = slugToId.get(slug);
    if (!activityId) {
      return { ok: false, error: `Activity not found in catalog: ${slug}` };
    }
    if (!allowed.has(activityId)) {
      return { ok: false, error: `Activity is not part of this season: ${slug}` };
    }
    resolved.push({ activityId, rank: i + 1 });
  }

  const { error: delError } = await supabase
    .from("user_activity_choices")
    .delete()
    .eq("profile_id", profileId)
    .eq("season_id", season.id);

  if (delError) {
    return { ok: false, error: `Failed to clear previous picks: ${delError.message}` };
  }

  if (resolved.length === 0) {
    return { ok: true, savedAt: new Date().toISOString() };
  }

  const { error: insError } = await supabase.from("user_activity_choices").insert(
    resolved.map((r) => ({
      profile_id: profileId,
      season_id: season.id,
      activity_id: r.activityId,
      choice_rank: r.rank,
    })),
  );

  if (insError) {
    return { ok: false, error: `Failed to save picks: ${insError.message}` };
  }

  const deposit = await getDepositForUserAndSeason(clerkUserId, season.id);
  if (resolved.length >= 4 && deposit?.status === "paid") {
    await lockSelectionsForAssignment(profileId);
  } else if (resolved.length > 0) {
    await updateProfileOnboardingStatus(profileId, deposit?.status === "paid" ? "selection_pending" : "deposit_pending");
  }

  return { ok: true, savedAt: new Date().toISOString() };
}
