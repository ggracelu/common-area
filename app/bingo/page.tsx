import { auth } from "@clerk/nextjs/server";
import { AppShell } from "@/components/app/AppShell";
import { BingoBoardDemo } from "@/components/bingo/BingoBoardDemo";
import { getSavedDemoEventIdsForUser } from "@/lib/activity-selections";
import { getBingoCompletionIdsForProfile } from "@/lib/bingo-progress";
import { ensureAuthenticatedProfile, getOnboardingSnapshotForClerkUser } from "@/lib/onboarding";

export const dynamic = "force-dynamic";

export default async function BingoPage() {
  let userId: string | null = null;
  try {
    const a = await auth();
    userId = a.userId ?? null;
  } catch {
    userId = null;
  }

  let serverSelections: string[] | undefined;
  let syncSelectionsToServer = false;
  let serverOnboarding = null;
  let serverBingoCompletions: string[] | undefined;

  if (userId) {
    try {
      await ensureAuthenticatedProfile();
      serverOnboarding = await getOnboardingSnapshotForClerkUser(userId);
      const loaded = await getSavedDemoEventIdsForUser(userId);
      if (loaded !== null) {
        serverSelections = loaded;
        syncSelectionsToServer = true;
      }
      if (serverOnboarding?.profileId) {
        serverBingoCompletions = await getBingoCompletionIdsForProfile(serverOnboarding.profileId);
      }
    } catch {
      serverSelections = undefined;
      serverOnboarding = null;
      serverBingoCompletions = undefined;
    }
  }

  return (
    <AppShell
      title="Season card"
      description="Choose 4 of 6 Chicago Summer 2026 activities, then use the same card for post-assignment bonus prompts."
      hideIntro
    >
      <BingoBoardDemo
        clerkUserId={userId}
        serverSelections={serverSelections}
        syncSelectionsToServer={syncSelectionsToServer}
        serverOnboarding={serverOnboarding}
        serverBingoCompletions={serverBingoCompletions}
      />
    </AppShell>
  );
}
