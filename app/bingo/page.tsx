"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { BingoCard } from "@/components/bingo/BingoCard";
import { ProgressTracker } from "@/components/bingo/ProgressTracker";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import type { BingoCardWithPrompts, GamificationStats } from "@/types/bingo";

export default function BingoPage() {
  const [bingoCard, setBingoCard] = useState<BingoCardWithPrompts | null>(null);
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBingoData();
  }, []);

  const loadBingoData = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, we'll use mock data since we don't have user authentication
      // In production, this would fetch from the API using the user's profile ID
      const mockBingoCard: BingoCardWithPrompts = {
        id: "mock-card-1",
        profileId: "mock-profile-1",
        seasonId: "mock-season-1",
        cohortId: "mock-cohort-1",
        totalPrompts: 12,
        completedPrompts: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        prompts: [
          {
            id: "prompt-1",
            seasonId: "mock-season-1",
            activityId: null,
            title: "Ask someone about their favorite neighborhood spot",
            description:
              "Find someone in your cohort and ask them what their favorite place in the neighborhood is.",
            promptType: "icebreaker",
            difficulty: "easy",
            requiresInteraction: true,
            points: 1,
            displayOrder: 1,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: true,
            completedAt: new Date().toISOString(),
          },
          {
            id: "prompt-2",
            seasonId: "mock-season-1",
            activityId: null,
            title: "Order the same drink as someone else",
            description:
              "Notice what someone else is ordering and try it yourself. It's a simple way to share an experience.",
            promptType: "shared_experience",
            difficulty: "easy",
            requiresInteraction: false,
            points: 1,
            displayOrder: 2,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: true,
            completedAt: new Date().toISOString(),
          },
          {
            id: "prompt-3",
            seasonId: "mock-season-1",
            activityId: null,
            title: "Find a hidden detail in this space",
            description:
              "Look around and find something interesting that others might have missed. Share it with someone.",
            promptType: "discovery",
            difficulty: "medium",
            requiresInteraction: false,
            points: 2,
            displayOrder: 3,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: true,
            completedAt: new Date().toISOString(),
          },
          {
            id: "prompt-4",
            seasonId: "mock-season-1",
            activityId: null,
            title: "Help someone complete their prompt",
            description:
              "If you see someone working on a prompt, offer to help them out.",
            promptType: "collaboration",
            difficulty: "medium",
            requiresInteraction: true,
            points: 2,
            displayOrder: 4,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: false,
          },
          {
            id: "prompt-5",
            seasonId: "mock-season-1",
            activityId: null,
            title: "Wave at someone you've seen before",
            description:
              "Recognize a familiar face from your cohort and give them a friendly wave.",
            promptType: "recognition",
            difficulty: "easy",
            requiresInteraction: false,
            points: 1,
            displayOrder: 5,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: false,
          },
          {
            id: "prompt-6",
            seasonId: "mock-season-1",
            activityId: null,
            title: "Share a story about your neighborhood",
            description:
              "Tell someone about a memorable experience you've had in this neighborhood.",
            promptType: "icebreaker",
            difficulty: "medium",
            requiresInteraction: true,
            points: 2,
            displayOrder: 6,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: false,
          },
          {
            id: "prompt-7",
            seasonId: "mock-season-1",
            activityId: null,
            title: "Try a new activity at a local business",
            description:
              "Visit one of our partner businesses and try something you've never done before.",
            promptType: "discovery",
            difficulty: "medium",
            requiresInteraction: false,
            points: 2,
            displayOrder: 7,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: false,
          },
          {
            id: "prompt-8",
            seasonId: "mock-season-1",
            activityId: null,
            title: "Introduce two people to each other",
            description:
              "If you know two people who haven't met, introduce them and help start a conversation.",
            promptType: "collaboration",
            difficulty: "hard",
            requiresInteraction: true,
            points: 3,
            displayOrder: 8,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: false,
          },
          {
            id: "prompt-9",
            seasonId: "mock-season-1",
            activityId: null,
            title: "Learn a fact about a local business",
            description:
              "Ask the staff at one of our partner businesses about their history or something interesting about the place.",
            promptType: "discovery",
            difficulty: "easy",
            requiresInteraction: true,
            points: 1,
            displayOrder: 9,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: false,
          },
          {
            id: "prompt-10",
            seasonId: "mock-season-1",
            activityId: null,
            title: "Compliment someone on their choice",
            description:
              "Notice something someone has chosen (drink, activity, outfit) and give them a genuine compliment.",
            promptType: "recognition",
            difficulty: "easy",
            requiresInteraction: true,
            points: 1,
            displayOrder: 10,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: false,
          },
          {
            id: "prompt-11",
            seasonId: "mock-season-1",
            activityId: null,
            title: "Share your favorite thing about this place",
            description:
              "Tell someone what you love most about this particular venue or neighborhood.",
            promptType: "shared_experience",
            difficulty: "easy",
            requiresInteraction: true,
            points: 1,
            displayOrder: 11,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: false,
          },
          {
            id: "prompt-12",
            seasonId: "mock-season-1",
            activityId: null,
            title: "Take a group photo with your cohort",
            description:
              "Gather some cohort members and capture a moment together. It's a great way to build memories.",
            promptType: "collaboration",
            difficulty: "medium",
            requiresInteraction: true,
            points: 2,
            displayOrder: 12,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: false,
          },
        ],
      };

      const mockStats: GamificationStats = {
        totalPrompts: 12,
        completedPrompts: 3,
        completionRate: 25,
        currentStreaks: [
          {
            id: "streak-1",
            profileId: "mock-profile-1",
            seasonId: "mock-season-1",
            streakType: "prompt",
            currentCount: 3,
            bestCount: 5,
            lastActivityAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "streak-2",
            profileId: "mock-profile-1",
            seasonId: "mock-season-1",
            streakType: "attendance",
            currentCount: 2,
            bestCount: 4,
            lastActivityAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        achievements: [
          {
            id: "achievement-1",
            profileId: "mock-profile-1",
            seasonId: "mock-season-1",
            achievementType: "first_prompt",
            title: "First Steps",
            description: "Complete your first prompt",
            iconUrl: null,
            unlockedAt: new Date().toISOString(),
          },
        ],
        activeChallenges: [],
      };

      setBingoCard(mockBingoCard);
      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bingo data");
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePrompt = async (promptId: string) => {
    try {
      // In production, this would call the server action
      // For now, we'll just update the local state
      if (bingoCard) {
        const updatedPrompts = bingoCard.prompts.map((prompt) =>
          prompt.id === promptId
            ? { ...prompt, completed: true, completedAt: new Date().toISOString() }
            : prompt,
        );

        const completedCount = updatedPrompts.filter((p) => p.completed).length;

        setBingoCard({
          ...bingoCard,
          prompts: updatedPrompts,
          completedPrompts: completedCount,
        });

        if (stats) {
          setStats({
            ...stats,
            completedPrompts: completedCount,
            completionRate: (completedCount / stats.totalPrompts) * 100,
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete prompt");
    }
  };

  if (loading) {
    return (
      <AppShell
        title="Loading..."
        description="Loading your bingo card"
      >
        <Card variant="paper" className="max-w-3xl">
          <p className="text-gray-600">Loading your prompts...</p>
        </Card>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell
        title="Error"
        description="Something went wrong"
      >
        <Card variant="paper" className="max-w-3xl">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadBingoData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Season Prompts"
      description="Complete prompts to build connections and earn achievements"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bingo Card */}
        <div className="lg:col-span-2">
          {bingoCard && (
            <BingoCard
              bingoCard={bingoCard}
              onCompletePrompt={handleCompletePrompt}
              loading={loading}
            />
          )}
        </div>

        {/* Sidebar with Progress */}
        <div className="lg:col-span-1">
          {stats && <ProgressTracker stats={stats} />}

          <Card variant="paper" className="mt-6 p-6">
            <Sticker>
              Crumbs says: The hardest part is saying hello. After that, it's just conversation.
            </Sticker>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
