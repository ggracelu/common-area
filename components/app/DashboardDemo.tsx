"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { PostcardMatchAnimation } from "@/components/cohort/PostcardMatchAnimation";
import { CrumbsTyping } from "@/components/app/CrumbsTyping";
import { demoData } from "@/lib/demo-data";
import { loadDemoState, tickMatchingForward } from "@/lib/demo-state";

type ViewMode = "current" | "future";

export function DashboardDemo() {
  const [mode, setMode] = useState<ViewMode>("current");
  const [state, setState] = useState(() => loadDemoState());

  useEffect(() => {
    const id = window.setInterval(() => setState(tickMatchingForward()), 750);
    return () => window.clearInterval(id);
  }, []);

  const effectiveStatus = mode === "future" ? "assigned" : state.matching.status;
  const hasEnoughPicks = state.selectedEventIds.length >= demoData.season.requiredEventCount;
  const hasPaid = state.depositStatus === "paid";

  const headline =
    effectiveStatus === "assigned"
      ? "Your cohort is ready."
      : effectiveStatus === "pending" || effectiveStatus === "mailing"
        ? "Cohort matching is in process."
        : "Ready to join a cohort?";

  const sub =
    effectiveStatus === "assigned"
      ? "You’ve been matched based on overlap. Time to meet your common room."
      : effectiveStatus === "pending" || effectiveStatus === "mailing"
        ? "Sign-ups close after one week. Then we sort the match pile (slowly, with authority)."
        : "Open the bingo card to pick 4 experiences, submit, then secure your spot with the $20 deposit.";

  const statusChip =
    effectiveStatus === "assigned"
      ? "Cohort: ready"
      : effectiveStatus === "pending"
        ? "Matching: sorting"
        : effectiveStatus === "mailing"
          ? "Matching: in flight"
          : hasEnoughPicks
            ? "Picks: ready"
            : "Picks: choose 4";

  const canSeeMatching = effectiveStatus === "pending" || effectiveStatus === "mailing" || effectiveStatus === "assigned";

  const checklist = useMemo(() => {
    return [
      { label: "Pick 4 experiences", done: hasEnoughPicks },
      { label: "Secure your spot ($20 deposit)", done: hasPaid },
      { label: "Matching + cohort reveal", done: effectiveStatus === "assigned" },
    ];
  }, [hasEnoughPicks, hasPaid, effectiveStatus]);

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-6 px-3 py-6 md:px-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="butter">Summer 2026</Badge>
          <span className="rounded-full bg-black/5 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] text-black/70">
            {statusChip}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={mode === "current" ? "primary" : "secondary"}
            onClick={() => setMode("current")}
          >
            Current
          </Button>
          <Button
            size="sm"
            variant={mode === "future" ? "primary" : "secondary"}
            onClick={() => setMode("future")}
          >
            Future
          </Button>
        </div>
      </div>

      <Card variant="scrapbook" className="w-full">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{headline}</h1>
            <p className="mt-5 text-lg leading-8 text-[color:rgba(37,34,30,0.74)]">{sub}</p>
          </div>

          {effectiveStatus === "pending" || effectiveStatus === "mailing" ? (
            <div className="rounded-[1.8rem] border border-black/10 bg-white/70 p-4 shadow-[0_18px_55px_rgba(52,36,24,0.10)]">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-black/55" style={{ fontFamily: "var(--font-mono)" }}>
                Mailroom cam
              </p>
              <div className="mt-3 flex items-center gap-3">
                <CrumbsTyping size={64} />
                <p className="text-sm font-semibold text-black/70">
                  Crumbs is wearing glasses and “working.”
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {checklist.map((item) => (
            <div key={item.label} className="rounded-[1.5rem] bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold">{item.done ? "Done" : "Next"}</p>
              <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.66)]">
                {item.done ? "Nice." : "Small steps."}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button href="/bingo" variant="primary">
            Open the bingo card
          </Button>
          <Button href="/cohort" variant="secondary">
            View cohort
          </Button>
        </div>

        <Sticker className="mt-7">Showing up counts.</Sticker>
      </Card>

      {canSeeMatching ? (
        <PostcardMatchAnimation
          status={
            effectiveStatus === "mailing" ||
            effectiveStatus === "pending" ||
            effectiveStatus === "assigned"
              ? effectiveStatus
              : "pending"
          }
        />
      ) : null}
    </main>
  );
}

