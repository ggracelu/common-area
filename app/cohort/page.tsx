import { auth } from "@clerk/nextjs/server";
import { Crumbs } from "@/components/brand/Crumbs";
import { AppShell } from "@/components/app/AppShell";
import {
  CohortJoinConversationButton,
  CohortJoinConversationCallout,
} from "@/components/cohort/CohortCommonRoomHeader";
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
      titleAside={<Crumbs size="md" pose="nap" expression="sleepy" animated className="cohort-scrap-sticker-float" />}
      titleAction={<CohortJoinConversationButton />}
      titleCallout={<CohortJoinConversationCallout />}
    >
      <CohortHome serverOnboarding={serverOnboarding} />
    </AppShell>
  );
}
