"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { CohortChatDemo } from "@/components/cohort/CohortChatDemo";
import { ChatIcebreakerOnboarding } from "@/components/chat/ChatIcebreakerOnboarding";
import { Badge } from "@/components/ui/Badge";
import { loadChatIcebreaker } from "@/lib/chat-icebreaker";
import type { CohortChatLoadState } from "@/types/chat";
import type { OnboardingSnapshot } from "@/types/onboarding";

import "@/components/cohort/cohort-scrapbook.css";

type ChatroomExperienceProps = {
  serverOnboarding?: OnboardingSnapshot | null;
  serverChat?: CohortChatLoadState;
};

export function ChatroomExperience({
  serverOnboarding = null,
  serverChat = { status: "not_configured", messages: [] },
}: ChatroomExperienceProps) {
  const { userId } = useAuth();
  const { user } = useUser();
  const storageUserId = userId ?? null;
  const [hydrated, setHydrated] = useState(false);
  const [icebreakerDone, setIcebreakerDone] = useState(false);

  const userDisplayName = useMemo(
    () => user?.firstName ?? user?.fullName ?? user?.username ?? "You",
    [user?.firstName, user?.fullName, user?.username],
  );

  const icebreaker = useMemo(
    () => (hydrated && icebreakerDone ? loadChatIcebreaker(storageUserId) : null),
    [hydrated, icebreakerDone, storageUserId],
  );

  useEffect(() => {
    const id = window.setTimeout(() => {
      setIcebreakerDone(Boolean(loadChatIcebreaker(storageUserId)));
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [storageUserId]);

  if (!hydrated) {
    return (
      <div className="rounded-[1.5rem] border border-black/10 bg-white/80 p-6 text-sm text-black/65">
        Loading chatroom…
      </div>
    );
  }

  if (!icebreakerDone) {
    return (
      <ChatIcebreakerOnboarding
        userId={storageUserId}
        onComplete={() => setIcebreakerDone(true)}
      />
    );
  }

  return (
    <div className="grid gap-4" data-testid="chatroom-experience">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="moss">Moderated by Crumbs</Badge>
        <p className="text-sm text-black/65">Pick a channel on the left — post in #main.</p>
      </div>

      <CohortChatDemo
        serverOnboarding={serverOnboarding}
        serverChat={serverChat}
        variant="chatroom"
        userDisplayName={userDisplayName}
        icebreakerForIntro={icebreaker}
      />
    </div>
  );
}
