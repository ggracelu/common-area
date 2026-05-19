"use client";

import { CrumbsTyping } from "@/components/app/CrumbsTyping";
import { Button } from "@/components/ui/Button";

import "@/components/cohort/cohort-scrapbook.css";

/** Inline “UP NEXT” row: label, join CTA, typing Crumbs. */
export function CohortUpNextBar() {
  return (
    <div
      className="cohort-join-callout flex w-full flex-wrap items-center gap-3 rounded-[1.25rem] border border-black/12 bg-[linear-gradient(135deg,rgba(233,255,107,0.35),rgba(255,255,255,0.92))] px-4 py-3 shadow-[0_12px_40px_rgba(52,36,24,0.1)] sm:gap-4 sm:px-5"
      data-testid="cohort-join-callout"
    >
      <p
        className="shrink-0 text-sm font-black uppercase tracking-[0.22em] text-black sm:text-base"
        style={{ fontFamily: "var(--v16-mono)" }}
      >
        UP NEXT
      </p>
      <Button
        href="/chat"
        variant="primary"
        size="md"
        data-testid="cohort-join-conversation"
        className="cohort-join-conversation-cta shrink-0 border-black bg-black px-6 py-3 text-[0.72rem] shadow-[0_14px_40px_rgba(52,36,24,0.18)] ring-0 hover:border-black hover:bg-black/90"
      >
        Join the conversation
      </Button>
      <CrumbsTyping size={64} />
    </div>
  );
}
