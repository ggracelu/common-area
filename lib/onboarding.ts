import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { getActiveSeason } from "@/lib/catalog";
import { DEMO_EVENT_TO_ACTIVITY_SLUG } from "@/lib/demo-activity-slug-map";
import { ensureProfileForClerk } from "@/lib/profile-sync";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { AssignmentStatus, DepositStatus, OnboardingStatus, SelectionStatus } from "@/types/profile";
import type { CohortRosterMember, OnboardingSnapshot } from "@/types/onboarding";

const DEMO_COHORT_SLUG_TO_ID: Record<string, string> = {
  "art-room-regulars": "coh_art_room",
  "table-and-laughs": "coh_table_laughs",
  "neighborhood-strollers": "coh_city_strollers",
};

function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_SECRET_KEY);
}

function deriveStatuses({
  depositStatus,
  selectionCount,
  selectionLocked,
  assignmentStatus,
}: {
  depositStatus: DepositStatus;
  selectionCount: number;
  selectionLocked: boolean;
  assignmentStatus: AssignmentStatus;
}): {
  onboardingStatus: OnboardingStatus;
  selectionStatus: SelectionStatus;
} {
  if (assignmentStatus === "assigned") {
    return { onboardingStatus: "active", selectionStatus: "completed" };
  }

  if (selectionLocked || selectionCount >= 4) {
    return { onboardingStatus: "assignment_pending", selectionStatus: "completed" };
  }

  if (depositStatus === "paid") {
    return {
      onboardingStatus: "selection_pending",
      selectionStatus: selectionCount > 0 ? "in_progress" : "not_started",
    };
  }

  return {
    onboardingStatus: "deposit_pending",
    selectionStatus: selectionCount > 0 ? "in_progress" : "not_started",
  };
}

export async function ensureAuthenticatedProfile(): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const user = await currentUser();
  if (!user?.id) {
    return null;
  }

  return ensureProfileForClerk(user.id, {
    email: user.primaryEmailAddress?.emailAddress ?? null,
    displayName: user.fullName ?? user.username ?? user.firstName ?? null,
  });
}

export async function updateProfileOnboardingStatus(
  profileId: string,
  onboardingStatus: OnboardingStatus,
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_status: onboardingStatus })
    .eq("id", profileId);

  if (error) {
    throw new Error(`Failed to update onboarding status: ${error.message}`);
  }
}

export async function getOnboardingSnapshotForClerkUser(
  clerkUserId: string,
): Promise<OnboardingSnapshot | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const season = await getActiveSeason();
  if (!season) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, onboarding_status")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Failed to load profile: ${profileError.message}`);
  }

  if (!profile) {
    return {
      configured: true,
      profileId: null,
      onboardingStatus: "created",
      depositStatus: "pending",
      selectionStatus: "not_started",
      assignmentStatus: "not_started",
      selectionCount: 0,
      selectionLocked: false,
      cohortId: null,
      cohortSlug: null,
      cohortDemoId: null,
      cohortRevealSeen: false,
      selectedActivitySlugs: [],
      roster: [],
    };
  }

  const profileId = (profile as { id: string }).id;

  const { data: deposit, error: depositError } = await supabase
    .from("deposits")
    .select("status")
    .eq("profile_id", profileId)
    .eq("season_id", season.id)
    .maybeSingle();

  if (depositError) {
    throw new Error(`Failed to load deposit: ${depositError.message}`);
  }

  const depositStatus = ((deposit as { status?: DepositStatus } | null)?.status ??
    "pending") as DepositStatus;

  const { data: choiceRows, error: choicesError } = await supabase
    .from("user_activity_choices")
    .select("choice_rank, activity_id")
    .eq("profile_id", profileId)
    .eq("season_id", season.id)
    .order("choice_rank", { ascending: true });

  if (choicesError) {
    throw new Error(`Failed to load activity choices: ${choicesError.message}`);
  }

  const activityIds = (choiceRows ?? []).map((row) => (row as { activity_id: string }).activity_id);
  let selectedActivitySlugs: string[] = [];

  if (activityIds.length > 0) {
    const { data: activities, error: activitiesError } = await supabase
      .from("activities")
      .select("id, slug")
      .in("id", activityIds);

    if (activitiesError) {
      throw new Error(`Failed to load activities for choices: ${activitiesError.message}`);
    }

    const slugById = new Map(
      (activities ?? []).map((row) => [(row as { id: string }).id, (row as { slug: string }).slug]),
    );

    selectedActivitySlugs = (choiceRows ?? [])
      .map((row) => slugById.get((row as { activity_id: string }).activity_id))
      .filter((slug): slug is string => Boolean(slug));
  }

  const selectionCount = selectedActivitySlugs.length;
  const storedOnboarding = (profile as { onboarding_status: OnboardingStatus }).onboarding_status;
  const selectionLocked =
    storedOnboarding === "active" ||
    (storedOnboarding === "assignment_pending" && selectionCount >= 4) ||
    (depositStatus === "paid" && selectionCount >= 4);

  const { data: membership, error: membershipError } = await supabase
    .from("cohort_members")
    .select("cohort_id, reveal_seen_at, cohorts(id, slug)")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (membershipError) {
    throw new Error(`Failed to load cohort membership: ${membershipError.message}`);
  }

  const assignmentStatus: AssignmentStatus = membership ? "assigned" : selectionLocked ? "pending" : "not_started";
  const cohortRecord = (membership as { cohorts?: { id: string; slug: string }[] | { id: string; slug: string } | null } | null)
    ?.cohorts;
  const cohort = Array.isArray(cohortRecord) ? cohortRecord[0] : cohortRecord;
  const cohortId = cohort?.id ?? null;
  const cohortSlug = cohort?.slug ?? null;
  const cohortDemoId = cohortSlug ? DEMO_COHORT_SLUG_TO_ID[cohortSlug] ?? null : null;

  const derived = deriveStatuses({
    depositStatus,
    selectionCount,
    selectionLocked,
    assignmentStatus,
  });

  let roster: CohortRosterMember[] = [];
  if (cohortId) {
    const { data: rosterRows, error: rosterError } = await supabase
      .from("cohort_members")
      .select("profile_id, profiles(display_name, clerk_user_id)")
      .eq("cohort_id", cohortId);

    if (rosterError) {
      throw new Error(`Failed to load cohort roster: ${rosterError.message}`);
    }

    roster = (rosterRows ?? []).map((row) => {
      const profileData = (row as { profiles?: { display_name: string | null; clerk_user_id: string } | { display_name: string | null; clerk_user_id: string }[] | null }).profiles;
      const profileRow = Array.isArray(profileData) ? profileData[0] : profileData;
      const clerkId = profileRow?.clerk_user_id ?? "";
      return {
        profileId: (row as { profile_id: string }).profile_id,
        displayName: profileRow?.display_name ?? null,
        isSeed: clerkId.startsWith("seed:"),
        isSelf: (row as { profile_id: string }).profile_id === profileId,
      };
    });
  }

  return {
    configured: true,
    profileId,
    onboardingStatus: derived.onboardingStatus,
    depositStatus,
    selectionStatus: derived.selectionStatus,
    assignmentStatus,
    selectionCount,
    selectionLocked,
    cohortId,
    cohortSlug,
    cohortDemoId,
    cohortRevealSeen: Boolean((membership as { reveal_seen_at?: string | null } | null)?.reveal_seen_at),
    selectedActivitySlugs,
    roster,
  };
}

export function demoEventIdsFromSlugs(slugs: string[]): string[] {
  const reverse = Object.entries(DEMO_EVENT_TO_ACTIVITY_SLUG);
  return slugs
    .map((slug) => reverse.find(([, value]) => value === slug)?.[0])
    .filter((id): id is string => Boolean(id));
}
