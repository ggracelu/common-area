"use server";

import { auth } from "@clerk/nextjs/server";
import { getActiveSeason } from "@/lib/catalog";
import { assignProfileToCohort, lockSelectionsForAssignment, markCohortRevealSeen } from "@/lib/cohort-assignment";
import { markDepositPaidForDemo } from "@/lib/deposits";
import { ensureAuthenticatedProfile, getOnboardingSnapshotForClerkUser } from "@/lib/onboarding";

export async function ensureProfileAction() {
  const profileId = await ensureAuthenticatedProfile();
  return { profileId };
}

export async function getOnboardingSnapshotAction() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  return getOnboardingSnapshotForClerkUser(userId);
}

export async function markMockDepositPaidAction() {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Sign in to secure your spot." };
  }

  const profileId = await ensureAuthenticatedProfile();
  if (!profileId) {
    return { ok: false as const, error: "Supabase is not configured on this environment." };
  }

  const season = await getActiveSeason();
  if (!season) {
    return { ok: false as const, error: "No active season is available." };
  }

  await markDepositPaidForDemo({
    clerkUserId: userId,
    seasonId: season.id,
    profileId,
  });

  return { ok: true as const };
}

export async function startCohortAssignmentAction() {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Sign in to start matching." };
  }

  const snapshot = await getOnboardingSnapshotForClerkUser(userId);
  if (!snapshot?.profileId) {
    return { ok: false as const, error: "Profile not found." };
  }

  if (snapshot.depositStatus !== "paid") {
    return { ok: false as const, error: "Pay the seasonal deposit before matching." };
  }

  if (snapshot.selectionCount < 4) {
    return { ok: false as const, error: "Choose four experiences before matching." };
  }

  await lockSelectionsForAssignment(snapshot.profileId);
  const assignment = await assignProfileToCohort(snapshot.profileId);

  return {
    ok: true as const,
    cohortId: assignment.cohortId,
    cohortSlug: assignment.cohortSlug,
  };
}

export async function markCohortRevealSeenAction() {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Sign in to continue." };
  }

  const snapshot = await getOnboardingSnapshotForClerkUser(userId);
  if (!snapshot?.profileId) {
    return { ok: false as const, error: "Profile not found." };
  }

  await markCohortRevealSeen(snapshot.profileId);
  return { ok: true as const };
}
