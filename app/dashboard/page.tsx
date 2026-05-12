import { auth } from "@clerk/nextjs/server";
import { AppShell } from "@/components/app/AppShell";
import { DashboardDemo } from "@/components/app/DashboardDemo";
import { ensureAuthenticatedProfile, getOnboardingSnapshotForClerkUser } from "@/lib/onboarding";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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
      title="Dashboard"
      description=""
      hideIntro
    >
      <DashboardDemo serverOnboarding={serverOnboarding} />
    </AppShell>
  );
}
