"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { markCohortRevealSeenAction, startCohortAssignmentAction } from "@/app/actions/onboarding";
import { GraderControlPanel } from "@/components/app/GraderControlPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CohortRevealLetter } from "@/components/cohort/CohortRevealLetter";
import { PostcardMatchAnimation } from "@/components/cohort/PostcardMatchAnimation";
import { CrumbsNote } from "@/components/app/CrumbsNote";
import { CrumbsTyping } from "@/components/app/CrumbsTyping";
import { demoData, getDemoCohort, getDemoEvent } from "@/lib/demo-data";
import { ACTIVITY_SLUG_TO_DEMO_EVENT } from "@/lib/demo-activity-slug-map";
import { buildGraderChecklist } from "@/lib/grader-onboarding";
import {
  inferCohortFromSelections,
  loadDemoState,
  mailPostcardForMatching,
  markCohortRevealSeen,
  markFutureCohortLetterPreviewDone,
  tickMatchingForward,
} from "@/lib/demo-state";
import type { OnboardingSnapshot } from "@/types/onboarding";

type ViewMode = "current" | "future";

type ChecklistRow = { label: string; done: boolean; footnote?: string; testId: string };

type DashboardDemoProps = {
  serverOnboarding?: OnboardingSnapshot | null;
};

export function DashboardDemo({ serverOnboarding = null }: DashboardDemoProps) {
  const router = useRouter();
  const { userId } = useAuth();
  const storageUserId = userId ?? null;
  const required = demoData.season.requiredEventCount;
  const [mode, setMode] = useState<ViewMode>("current");
  const [state, setState] = useState(() => loadDemoState(storageUserId));

  const serverAuthoritative = Boolean(serverOnboarding?.configured);
  const hasEnoughPicks = serverAuthoritative
    ? (serverOnboarding?.selectionCount ?? 0) >= required
    : state.selectedEventIds.length >= required;
  const hasPaid = serverAuthoritative
    ? serverOnboarding?.depositStatus === "paid"
    : state.depositStatus === "paid";

  useEffect(() => {
    const id = window.setTimeout(() => {
      setState(loadDemoState(storageUserId));
    }, 0);
    return () => window.clearTimeout(id);
  }, [storageUserId]);

  useEffect(() => {
    if (serverAuthoritative) return;
    const id = window.setInterval(() => setState(tickMatchingForward(storageUserId)), 750);
    return () => window.clearInterval(id);
  }, [storageUserId, serverAuthoritative]);

  /** Demo: once deposit + 4 picks exist, start matching so Current shows cohort matching in progress. */
  useEffect(() => {
    if (serverAuthoritative) return;
    if (mode !== "current") return;
    const id = window.setTimeout(() => {
      const s = loadDemoState(storageUserId);
      if (
        s.depositStatus === "paid" &&
        s.selectedEventIds.length >= required &&
        s.matching.status === "not_started"
      ) {
        setState(mailPostcardForMatching(storageUserId));
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, [
    mode,
    storageUserId,
    required,
    state.depositStatus,
    state.selectedEventIds.length,
    state.matching.status,
    serverAuthoritative,
  ]);

  useEffect(() => {
    if (!serverAuthoritative) return;
    if (!hasPaid || !hasEnoughPicks) return;
    if (serverOnboarding?.assignmentStatus === "assigned") return;

    void (async () => {
      const result = await startCohortAssignmentAction();
      if (result.ok) {
        router.refresh();
      }
    })().catch(() => undefined);
  }, [serverAuthoritative, hasPaid, hasEnoughPicks, serverOnboarding?.assignmentStatus, router]);

  const isFuturePreview = mode === "future";
  const letterPreviewDone = serverAuthoritative
    ? Boolean(serverOnboarding?.cohortRevealSeen)
    : state.futureCohortLetterPreviewDone;
  const liveStatus = serverAuthoritative
    ? serverOnboarding?.assignmentStatus === "assigned"
      ? "assigned"
      : serverOnboarding?.assignmentStatus === "pending"
        ? "pending"
        : hasEnoughPicks && hasPaid
          ? "mailing"
          : "not_started"
    : state.matching.status;

  const currentMatchingBusy =
    liveStatus === "pending" || liveStatus === "mailing" || (liveStatus === "assigned" && !letterPreviewDone);

  const headline = isFuturePreview
    ? "Your cohort letter"
    : liveStatus === "assigned" && letterPreviewDone
      ? "Next: your cohort page."
      : currentMatchingBusy
        ? "Cohort matching is in progress."
        : "Ready to join a cohort?";

  const sub = isFuturePreview
    ? serverAuthoritative
      ? "Open the envelope to read your assignment—copy reflects your saved picks and cohort match."
      : "Open the envelope to read your assignment—preview copy based on your bingo picks."
    : liveStatus === "assigned" && letterPreviewDone
      ? "You’ve opened your Future preview letter. Visit Cohort for your roster, overlaps, and chat."
      : currentMatchingBusy
        ? "Sign-ups close after one week. We’re sorting the match pile now—hang tight. Your assignment preview is under Future."
        : "Open the bingo card to pick 4 experiences, submit, then secure your spot with the $20 deposit.";

  const statusChip = isFuturePreview
    ? "Preview: cohort reveal"
    : liveStatus === "assigned" && letterPreviewDone
      ? "Letter: opened"
      : liveStatus === "pending"
        ? "Matching: sorting"
        : liveStatus === "mailing"
          ? "Matching: in flight"
          : liveStatus === "assigned"
            ? "Matching: finalizing"
            : hasEnoughPicks
              ? "Picks: ready"
              : "Picks: choose 4";

  const canSeeMatching =
    !isFuturePreview &&
    (liveStatus === "pending" ||
      liveStatus === "mailing" ||
      (liveStatus === "assigned" && !letterPreviewDone));

  const cohortPageReady = serverAuthoritative
    ? serverOnboarding?.assignmentStatus === "assigned" && letterPreviewDone
    : letterPreviewDone;
  const bingoBonusReady = serverAuthoritative
    ? serverOnboarding?.assignmentStatus === "assigned"
    : state.matching.status === "assigned";

  const checklist: ChecklistRow[] = useMemo(() => {
    if (isFuturePreview) {
      return buildGraderChecklist({
        snapshot: serverOnboarding,
        hasEnoughPicks: true,
        hasPaid: true,
        letterPreviewDone: true,
        cohortPageReady: true,
        bingoBonusReady: true,
      }).map((item) => ({ ...item, done: true, footnote: "Preview" }));
    }

    return buildGraderChecklist({
      snapshot: serverOnboarding,
      hasEnoughPicks,
      hasPaid,
      letterPreviewDone,
      cohortPageReady,
      bingoBonusReady,
    });
  }, [
    isFuturePreview,
    serverOnboarding,
    hasEnoughPicks,
    hasPaid,
    letterPreviewDone,
    cohortPageReady,
    bingoBonusReady,
  ]);

  const futureLetter = useMemo(() => {
    const serverPickIds =
      serverAuthoritative && (serverOnboarding?.selectedActivitySlugs.length ?? 0) > 0
        ? serverOnboarding!.selectedActivitySlugs
            .map((slug) => ACTIVITY_SLUG_TO_DEMO_EVENT[slug])
            .filter((id): id is string => Boolean(id))
        : [];
    const pickIds =
      serverPickIds.length >= required
        ? serverPickIds
        : state.selectedEventIds.length >= required
          ? state.selectedEventIds
          : demoData.events.filter((e) => e.countsTowardCohortEvents).slice(0, required).map((e) => e.id);
    const cohortId =
      serverAuthoritative && serverOnboarding?.cohortDemoId
        ? serverOnboarding.cohortDemoId
        : inferCohortFromSelections(pickIds);
    const cohort = getDemoCohort(cohortId);
    const evA = getDemoEvent(pickIds[0] ?? "");
    const evB = getDemoEvent(pickIds[1] ?? "");
    return {
      cohortId,
      cohortName: cohort?.name ?? "Your cohort",
      eventTitleA: evA?.title ?? "your first pick",
      eventTitleB: evB?.title ?? "your second pick",
      peopleAdjective: cohort?.peopleDescriptor ?? "wonderful",
    };
  }, [state.selectedEventIds, required, serverAuthoritative, serverOnboarding]);

  const seasonSteps = [
    { label: "Deposit", done: hasPaid },
    { label: "Four picks", done: hasEnoughPicks },
    {
      label: "Matching",
      done: liveStatus === "assigned" || liveStatus === "pending" || liveStatus === "mailing",
    },
    { label: "Letter", done: letterPreviewDone },
    { label: "Cohort room", done: cohortPageReady },
  ];

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-6 px-3 py-6 md:px-0">
      <GraderControlPanel storageUserId={storageUserId} showWhenConfigured={serverAuthoritative} />
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="butter">Summer 2026</Badge>
        <span className="rounded-full bg-black/5 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] text-black/70">
          {statusChip}
        </span>
        {isFuturePreview ? (
          <Badge variant="sky" className="rounded-full">
            Demo: future
          </Badge>
        ) : serverAuthoritative ? (
          <Badge variant="neutral" className="rounded-full">
            Saved to your account
          </Badge>
        ) : (
          <Badge variant="neutral" className="rounded-full">
            Local demo cache
          </Badge>
        )}
      </div>

      <ol
        aria-label="Summer 2026 season progress"
        className="flex flex-wrap gap-2 rounded-[1.25rem] border border-black/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(247,240,228,0.72))] p-3"
      >
        {seasonSteps.map((step, index) => (
          <li
            key={step.label}
            className={[
              "flex min-w-[5.5rem] flex-1 items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold",
              step.done
                ? "bg-[color:rgba(233,255,107,0.45)] text-black"
                : "bg-white/70 text-black/55",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className={[
                "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-black",
                step.done ? "border-black/20 bg-white text-black" : "border-black/12 bg-black/5 text-black/45",
              ].join(" ")}
            >
              {step.done ? "✓" : index + 1}
            </span>
            <span>{step.label}</span>
          </li>
        ))}
      </ol>

      <div
        className={[
          "rounded-[1.35rem] border p-1.5 shadow-[0_14px_40px_rgba(52,36,24,0.06)]",
          isFuturePreview
            ? "border-[rgba(26,92,255,0.28)] bg-[linear-gradient(135deg,rgba(26,92,255,0.08),rgba(247,240,228,0.55))]"
            : "border-black/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(247,240,228,0.65))]",
        ].join(" ")}
        role="tablist"
        aria-label="Dashboard view"
      >
        <div className="grid grid-cols-2 gap-1 sm:flex sm:rounded-[1.1rem]">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "current"}
            data-testid="dashboard-tab-current"
            onClick={() => setMode("current")}
            className={[
              "w-full rounded-[1.05rem] px-4 py-3 text-left transition-all sm:min-w-0 sm:flex-1",
              mode === "current"
                ? "bg-white shadow-[0_12px_32px_rgba(52,36,24,0.12)] ring-1 ring-black/10"
                : "bg-transparent text-black/55 hover:bg-white/40 hover:text-black/80",
            ].join(" ")}
          >
            <p
              className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-black/50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Current
            </p>
            <p className="mt-1 text-sm font-semibold text-black">Matching &amp; status</p>
            <p className="mt-0.5 text-xs leading-snug text-black/55">Cohort matching in progress when you’re queued.</p>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "future"}
            data-testid="dashboard-tab-future"
            onClick={() => setMode("future")}
            className={[
              "w-full rounded-[1.05rem] px-4 py-3 text-left transition-all sm:min-w-0 sm:flex-1",
              mode === "future"
                ? "bg-white shadow-[0_12px_32px_rgba(26,92,255,0.15)] ring-2 ring-[rgba(26,92,255,0.35)]"
                : "bg-transparent text-black/55 hover:bg-white/40 hover:text-black/80",
            ].join(" ")}
          >
            <p
              className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-black/50"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Future
            </p>
            <p className="mt-1 text-sm font-semibold text-black">Cohort reveal</p>
            <p className="mt-0.5 text-xs leading-snug text-black/55">Envelope → letter → welcome copy.</p>
          </button>
        </div>
      </div>

      {!isFuturePreview && liveStatus === "assigned" && !letterPreviewDone ? (
        <div
          className="rounded-[1.35rem] border border-[rgba(26,92,255,0.28)] bg-[linear-gradient(135deg,rgba(26,92,255,0.08),rgba(247,240,228,0.72))] p-5"
          role="status"
        >
          <p className="text-xs font-black uppercase tracking-[0.22em] text-black/55" style={{ fontFamily: "var(--font-mono)" }}>
            Cohort reveal
          </p>
          <p className="mt-2 text-base font-semibold text-black">
            Your assignment is ready—open the Future tab to read your letter.
          </p>
          <div className="mt-4">
            <Button variant="primary" onClick={() => setMode("future")}>
              Open Future tab
            </Button>
          </div>
        </div>
      ) : null}

      {isFuturePreview ? (
        <div data-testid="cohort-reveal-letter">
          <CohortRevealLetter
            cohortId={futureLetter.cohortId}
            cohortName={futureLetter.cohortName}
            eventTitleA={futureLetter.eventTitleA}
            eventTitleB={futureLetter.eventTitleB}
            peopleAdjective={futureLetter.peopleAdjective}
            onComplete={() => {
              if (serverAuthoritative) {
                void markCohortRevealSeenAction().then(() => router.refresh());
              } else {
                markFutureCohortLetterPreviewDone(storageUserId);
                markCohortRevealSeen(futureLetter.cohortId, storageUserId);
              }
              setMode("current");
              setState(loadDemoState(storageUserId));
            }}
          />
        </div>
      ) : null}

      {!isFuturePreview ? (
        <Card
          variant="paper"
          data-demo-dashboard-mode={mode}
          className={[
            "w-full transition-shadow",
            "border border-black/10",
          ].join(" ")}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{headline}</h1>
              <p className="mt-5 text-lg leading-8 text-[color:rgba(37,34,30,0.74)]">{sub}</p>
            </div>

            {(liveStatus === "pending" || liveStatus === "mailing") ? (
              <div className="rounded-[1.8rem] border border-black/10 bg-white/70 p-4 shadow-[0_18px_55px_rgba(52,36,24,0.10)]">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-black/55" style={{ fontFamily: "var(--font-mono)" }}>
                  Mailroom cam
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <CrumbsTyping size={64} />
                  <p className="text-sm font-semibold text-black/70">Crumbs is on sorting duty.</p>
                </div>
              </div>
            ) : liveStatus === "assigned" && !letterPreviewDone ? (
              <div className="rounded-[1.8rem] border border-[rgba(26,92,255,0.22)] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(247,240,228,0.88))] p-4 shadow-[0_18px_55px_rgba(26,92,255,0.12)]">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-black/55" style={{ fontFamily: "var(--font-mono)" }}>
                  Letter ready
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <CrumbsTyping size={64} />
                  <p className="text-sm font-semibold text-black/75">
                    Your cohort letter is sealed under the Future tab.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <ul className="mt-8 divide-y divide-black/10 border-t border-black/10" data-testid="grader-onboarding-checklist">
            {checklist.map((item) => (
              <li
                key={item.testId}
                data-testid={item.testId}
                className={[
                  "flex flex-wrap items-center justify-between gap-4 py-3 text-sm",
                  item.done ? "text-[color:rgba(37,34,30,0.82)]" : "text-[color:rgba(37,34,30,0.68)]",
                ].join(" ")}
              >
                <span>
                  {item.label}
                  {item.footnote ? (
                    <span className="mt-1 block text-[0.7rem] font-normal text-black/45">{item.footnote}</span>
                  ) : null}
                </span>
                <span
                  className={[
                    "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                    item.done ? "bg-[color:rgba(233,255,107,0.45)] text-black" : "bg-black/5 text-black/45",
                  ].join(" ")}
                >
                  {item.done ? "Done" : "Pending"}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/bingo" variant="primary">
              Open the bingo card
            </Button>
            <Button href="/cohort" variant="secondary">
              View cohort
            </Button>
          </div>

          {!hasPaid || !hasEnoughPicks ? (
            <div className="mt-8">
              <CrumbsNote
                title="Season note"
                lines={[
                  "Start on the bingo card—four picks, then the $20 deposit.",
                  "Overlap on week two is the whole point.",
                  "Crumbs will hold your spot while you decide.",
                ]}
                pose="curious"
              />
            </div>
          ) : null}
        </Card>
      ) : null}

      {canSeeMatching ? (
        <PostcardMatchAnimation
          status={
            liveStatus === "assigned" && !letterPreviewDone
              ? "pending"
              : liveStatus === "mailing" || liveStatus === "pending"
                ? liveStatus
                : "pending"
          }
        />
      ) : null}
    </main>
  );
}
