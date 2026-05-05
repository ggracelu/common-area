import { currentUser } from "@clerk/nextjs/server";
import { AppShell } from "@/components/app/AppShell";
import { BingoCard } from "@/components/bingo/BingoCard";
import { ProgressTracker } from "@/components/bingo/ProgressTracker";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { Button } from "@/components/ui/Button";
import { getActiveSeason } from "@/lib/catalog";
import { getBingoCardWithPrompts, getGamificationStats } from "@/lib/bingo";
import { completePrompt } from "./actions";
import type { BingoCardWithPrompts, GamificationStats } from "@/types/bingo";

export default async function BingoPage() {
  const user = await currentUser();

  if (!user) {
    return (
      <AppShell
        title="Sign In Required"
        description="Please sign in to access your bingo card"
      >
        <Card variant="paper" className="max-w-3xl">
          <p className="text-gray-600 mb-4">
            You need to be signed in to view your bingo card and complete prompts.
          </p>
          <Button href="/sign-in">Sign In</Button>
        </Card>
      </AppShell>
    );
  }

  // Get the active season
  const season = await getActiveSeason();

  if (!season) {
    return (
      <AppShell
        title="No Active Season"
        description="There's currently no active season"
      >
        <Card variant="paper" className="max-w-3xl">
          <p className="text-gray-600 mb-4">
            There's no active season right now. Check back later for new prompts!
          </p>
          <Button href="/dashboard">Back to Dashboard</Button>
        </Card>
      </AppShell>
    );
  }

  // For now, we'll use the clerk user ID as the profile ID
  // In production, you would fetch the actual profile from the database
  const profileId = user.id;

  try {
    // Get the user's bingo card with prompts
    const bingoCard = await getBingoCardWithPrompts(profileId, season.id);

    // Get the user's gamification stats
    const stats = await getGamificationStats(profileId, season.id);

    return (
      <AppShell
        title="Season Prompts"
        description="Complete prompts to build connections and earn achievements"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Bingo Card */}
          <div className="lg:col-span-2">
            <BingoCard
              bingoCard={bingoCard}
              onCompletePrompt={async (promptId) => {
                "use server";
                await completePrompt(profileId, bingoCard.id, promptId);
              }}
            />
          </div>

          {/* Sidebar with Progress */}
          <div className="lg:col-span-1">
            <ProgressTracker stats={stats} />

            <Card variant="paper" className="mt-6 p-6">
              <Sticker>
                Crumbs says: The hardest part is saying hello. After that, it's just conversation.
              </Sticker>
            </Card>
          </div>
        </div>
      </AppShell>
    );
  } catch (error) {
    console.error("Error loading bingo data:", error);

    return (
      <AppShell
        title="Error"
        description="Something went wrong loading your bingo card"
      >
        <Card variant="paper" className="max-w-3xl">
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : "Failed to load bingo data"}
          </p>
          <Button href="/dashboard">Back to Dashboard</Button>
        </Card>
      </AppShell>
    );
  }
}
