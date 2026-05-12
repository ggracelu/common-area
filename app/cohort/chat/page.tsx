import { auth } from "@clerk/nextjs/server";
import { AppShell } from "@/components/app/AppShell";
import { CohortChatDemo } from "@/components/cohort/CohortChatDemo";
import { getOnboardingSnapshotForClerkUser } from "@/lib/onboarding";

export const dynamic = "force-dynamic";

export default async function CohortChatPage() {
  let serverOnboarding = null;

  try {
    const { userId } = await auth();
    if (userId) {
      serverOnboarding = await getOnboardingSnapshotForClerkUser(userId);
    }
  } catch {
    serverOnboarding = null;
  }

  return (
    <AppShell
      title="Cohort chat"
      description="Demo-persisted chat on this device until Postgres + Realtime ship; seeded thread for atmosphere."
    >
      <CohortChatDemo serverOnboarding={serverOnboarding} />
    </AppShell>
  );
}
