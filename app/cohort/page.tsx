import { auth } from "@clerk/nextjs/server";
import { AppShell } from "@/components/app/AppShell";
import { CohortUpNextBar } from "@/components/cohort/CohortCommonRoomHeader";
import { CohortHome } from "@/components/cohort/CohortHome";
import { ensureAuthenticatedProfile, getOnboardingSnapshotForClerkUser } from "@/lib/onboarding";

import "@/components/cohort/cohort-scrapbook.css";

export const dynamic = "force-dynamic";

export default async function CohortPage() {
  let serverOnboarding = null;
  try {
    const { userId } = await auth();
    if (userId) {
      await ensureAuthenticatedProfile();
      serverOnboarding = await getOnboardingSnapshotForClerkUser(userId);
    }
  } catch {
    serverOnboarding = null;
  }

  return (
    <AppShell
      title="Your cohort common room"
      description="This is the reveal: your 20-person cohort, shared overlaps, and the low-stakes rhythm that makes familiar faces."
      titleCallout={<CohortUpNextBar />}
    >
      <CohortHome serverOnboarding={serverOnboarding} />
    </AppShell>
  );
}
