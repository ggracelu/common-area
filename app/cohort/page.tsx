import { auth } from "@clerk/nextjs/server";
import { AppShell } from "@/components/app/AppShell";
import { CohortHome } from "@/components/cohort/CohortHome";
import { ensureAuthenticatedProfile, getOnboardingSnapshotForClerkUser } from "@/lib/onboarding";

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
      description="This is the reveal: your 20-person cohort, shared overlaps, and the low-stakes prompts that make it easier to say hi."
    >
      <CohortHome serverOnboarding={serverOnboarding} />
    </AppShell>
  );
}
