import { auth } from "@clerk/nextjs/server";
import { AppShell } from "@/components/app/AppShell";
import { BingoBoardDemo } from "@/components/bingo/BingoBoardDemo";
import { getSavedDemoEventIdsForUser } from "@/lib/activity-selections";
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

  if (userId) {
    try {
      await ensureAuthenticatedProfile();
      serverOnboarding = await getOnboardingSnapshotForClerkUser(userId);
      const loaded = await getSavedDemoEventIdsForUser(userId);
      if (loaded !== null) {
        serverSelections = loaded;
        syncSelectionsToServer = true;
      }
    } catch {
      serverSelections = undefined;
      serverOnboarding = null;
    }
  }

  return (
    <AppShell
      title="Bingo"
      description="Select any 4 experiences. Your bingo card is the mechanism for discovery, sign-up, and bonus gamification."
      hideIntro
    >
      <BingoBoardDemo
        clerkUserId={userId}
        serverSelections={serverSelections}
        syncSelectionsToServer={syncSelectionsToServer}
        serverOnboarding={serverOnboarding}
      />
    </AppShell>
  );
}
