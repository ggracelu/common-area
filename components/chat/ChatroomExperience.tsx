"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { CohortChatDemo } from "@/components/cohort/CohortChatDemo";
import { ChatIcebreakerOnboarding } from "@/components/chat/ChatIcebreakerOnboarding";
import { Badge } from "@/components/ui/Badge";
import { Crumbs } from "@/components/brand/Crumbs";
import { Sticker } from "@/components/ui/Sticker";
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
  const storageUserId = userId ?? null;
  const [hydrated, setHydrated] = useState(false);
  const [icebreakerDone, setIcebreakerDone] = useState(false);

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

  const icebreaker = loadChatIcebreaker(storageUserId);

  return (
    <div className="grid gap-6" data-testid="chatroom-experience">
      <div className="relative overflow-hidden rounded-[2rem] border border-black/12 bg-[linear-gradient(135deg,rgba(255,252,245,0.96),rgba(247,240,228,0.92))] p-5 shadow-[0_18px_55px_rgba(52,36,24,0.12)] md:p-6">
        <div aria-hidden="true" className="cohort-scrap-tape cohort-scrap-tape-tl" />
        <div aria-hidden="true" className="cohort-scrap-tape cohort-scrap-tape-br" />
        <div className="relative z-10 flex flex-wrap items-start gap-4">
          <Crumbs size="md" pose="nap" expression="sleepy" animated className="shrink-0" />
          <div className="min-w-0 flex-1">
            <Badge variant="moss">Moderated by Crumbs</Badge>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-black">Cohort chatroom</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
              Crumbs keeps things low-pressure: say hi, ask about plans, react to the season. No hustle culture, no
              LinkedIn voice.
            </p>
            {icebreaker ? (
              <p className="mt-3 rounded-[1rem] border border-black/10 bg-white/80 px-3 py-2 text-sm text-black/75">
                <span className="font-semibold text-black">Your icebreaker:</span> {icebreaker.answer}
              </p>
            ) : null}
          </div>
          <Sticker className="cohort-scrap-sticker-float shrink-0">Low stakes only</Sticker>
        </div>
      </div>

      <CohortChatDemo
        serverOnboarding={serverOnboarding}
        serverChat={serverChat}
        variant="chatroom"
      />
    </div>
  );
}
