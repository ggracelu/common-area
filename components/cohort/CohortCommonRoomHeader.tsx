"use client";

import { CrumbsTyping } from "@/components/app/CrumbsTyping";
import { Button } from "@/components/ui/Button";

import "@/components/cohort/cohort-scrapbook.css";

export function CohortJoinConversationButton() {
  return (
    <Button
      href="/chat"
      variant="primary"
      size="lg"
      data-testid="cohort-join-conversation"
      className="cohort-join-conversation-cta shrink-0 border-[var(--v16-lime)] bg-[linear-gradient(135deg,#0a0a0a_0%,#1a1a1a_55%,#0a0a0a_100%)] px-8 py-4 text-[0.78rem] shadow-[0_22px_70px_rgba(52,36,24,0.22)] ring-2 ring-[color:rgba(233,255,107,0.55)] hover:border-[var(--v16-lime)] hover:bg-black hover:ring-[color:rgba(233,255,107,0.75)]"
    >
      Join the conversation
    </Button>
  );
}

export function CohortJoinConversationCallout() {
  return (
    <div
      className="cohort-join-callout flex w-full flex-wrap items-center gap-4 rounded-[1.5rem] border border-black/12 bg-[linear-gradient(135deg,rgba(233,255,107,0.42),rgba(255,184,0,0.18),rgba(26,92,255,0.12))] px-5 py-4 shadow-[0_16px_48px_rgba(52,36,24,0.12)]"
      data-testid="cohort-join-callout"
    >
      <div className="min-w-0 flex-1">
        <p
          className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-black/70"
          style={{ fontFamily: "var(--v16-mono)" }}
        >
          Up next
        </p>
        <p className="mt-1 text-lg font-black uppercase tracking-[0.12em] text-black sm:text-xl">
          Join the conversation
        </p>
        <p className="mt-2 text-sm text-black/68">
          One-time anti-networking icebreaker, then say hi in the cohort chatroom.
        </p>
      </div>
      <CrumbsTyping size={72} />
    </div>
  );
}
