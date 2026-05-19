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
import { CrumbsTyping } from "@/components/app/CrumbsTyping";
import { demoData, getDemoCohort, getDemoEvent } from "@/lib/demo-data";
import { ACTIVITY_SLUG_TO_DEMO_EVENT } from "@/lib/demo-activity-slug-map";
import {
  assignDemoCohortFromSelections,
  getDefaultDemoState,
  inferCohortFromSelections,
  loadDemoState,
  markCohortRevealSeen,
  markFutureCohortLetterPreviewDone,
} from "@/lib/demo-state";
import type { OnboardingSnapshot } from "@/types/onboarding";

type ViewMode = "current" | "future";
type AssignmentRequestState = { status: "idle" | "running" | "error"; error?: string };
type AssignmentUiStatus = "not_started" | "ready" | "running" | "pending" | "assigned" | "error";

type DashboardDemoProps = {
  serverOnboarding?: OnboardingSnapshot | null;
};

export function DashboardDemo({ serverOnboarding = null }: DashboardDemoProps) {
  const router = useRouter();
  const { userId } = useAuth();
  const storageUserId = userId ?? null;
  const required = demoData.season.requiredEventCount;
  const available = demoData.season.availableEventCount;
  const [mode, setMode] = useState<ViewMode>("current");
  const [state, setState] = useState(() => getDefaultDemoState());
  const [assignmentRequest, setAssignmentRequest] = useState<AssignmentRequestState>({ status: "idle" });

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
    if (!serverAuthoritative) return;
    if (!hasPaid || !hasEnoughPicks) return;
    if (serverOnboarding?.assignmentStatus === "assigned") return;
    if (assignmentRequest.status === "running" || assignmentRequest.status === "error") return;

    void (async () => {
      setAssignmentRequest({ status: "running" });
      const result = await startCohortAssignmentAction();
      if (result.ok) {
        router.refresh();
        return;
      }
      setAssignmentRequest({ status: "error", error: result.error });
    })().catch((error) => {
      setAssignmentRequest({
        status: "error",
        error: error instanceof Error ? error.message : "Assignment failed.",
      });
    });
  }, [
    serverAuthoritative,
    hasPaid,
    hasEnoughPicks,
    serverOnboarding?.assignmentStatus,
    assignmentRequest.status,
    router,
  ]);

  const isFuturePreview = mode === "future";
  const letterPreviewDone = serverAuthoritative
    ? Boolean(serverOnboarding?.cohortRevealSeen)
    : state.futureCohortLetterPreviewDone;
  const liveStatus: AssignmentUiStatus = serverAuthoritative
    ? serverOnboarding?.assignmentStatus === "assigned"
      ? "assigned"
      : assignmentRequest.status === "error"
        ? "error"
        : assignmentRequest.status === "running"
          ? "running"
          : serverOnboarding?.assignmentStatus === "pending"
            ? "pending"
            : hasEnoughPicks && hasPaid
              ? "pending"
              : "not_started"
    : state.matching.status === "assigned"
      ? "assigned"
      : state.matching.status === "pending" || state.matching.status === "mailing"
        ? "pending"
        : hasEnoughPicks && hasPaid
          ? "ready"
          : "not_started";

  const assignmentReady = liveStatus === "assigned";
  const canSimulateCohortReveal =
    assignmentReady || (!serverAuthoritative && hasPaid && hasEnoughPicks);
  const showCohortReveal = isFuturePreview && canSimulateCohortReveal;
  const showMatchingInProgress =
    !isFuturePreview &&
    hasPaid &&
    hasEnoughPicks &&
    !letterPreviewDone &&
    (liveStatus === "pending" ||
      liveStatus === "running" ||
      liveStatus === "ready" ||
      assignmentReady);
  const currentMatchingBusy = showMatchingInProgress;

  const headline = isFuturePreview
    ? "Your cohort letter"
    : liveStatus === "assigned" && letterPreviewDone
      ? "Next: your cohort page."
      : liveStatus === "error"
        ? "Cohort matching needs attention."
      : currentMatchingBusy
        ? "Cohort matching is in progress."
        : liveStatus === "ready"
          ? "Ready for local demo assignment."
        : "Ready to join a cohort?";

  const isReadyToJoinHeadline =
    !isFuturePreview && liveStatus === "not_started" && !currentMatchingBusy;

  const sub = isFuturePreview
    ? canSimulateCohortReveal
      ? "Open your cohort letter when you're ready."
      : "Your letter unlocks after assignment."
    : liveStatus === "assigned" && letterPreviewDone
      ? "Head to your cohort for roster, chat, and bingo."
      : liveStatus === "error"
        ? assignmentRequest.error ?? "Try refreshing or retry assignment."
      : currentMatchingBusy
        ? "We're matching you from your saved picks. Check Future for your letter."
        : liveStatus === "ready"
          ? "Run local demo assignment to preview your reveal."
          : `Pick ${required} on the season card, then pay the $20 deposit.`;

  const statusChip = isFuturePreview
    ? "Preview: cohort reveal"
    : liveStatus === "assigned" && letterPreviewDone
      ? "Letter: opened"
    : liveStatus === "error"
      ? "Matching: error"
      : showMatchingInProgress
        ? liveStatus === "running"
          ? "Matching: running"
          : "Matching: sorting"
        : liveStatus === "assigned"
          ? "Matching: finalizing"
          : hasEnoughPicks
            ? `Picks: ${required} of ${available} ready`
            : `Picks: choose ${required} of ${available}`;

  const canSeeMatching = showMatchingInProgress;

  const cohortPageReady = serverAuthoritative
    ? serverOnboarding?.assignmentStatus === "assigned" && letterPreviewDone
    : state.matching.status === "assigned" && letterPreviewDone;
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
    { label: "Deposit", done: hasPaid, testId: "grader-checklist-deposit" },
    { label: `${required} of ${available} picks`, done: hasEnoughPicks, testId: "grader-checklist-picks" },
    {
      label: "Matching",
      done: assignmentReady && (letterPreviewDone || isFuturePreview),
      testId: "grader-checklist-matching",
    },
    { label: "Letter", done: letterPreviewDone, testId: "grader-checklist-letter" },
    { label: "Cohort room", done: cohortPageReady, testId: "grader-checklist-cohort" },
  ];

  function handleModeChange(next: ViewMode) {
    if (
      next === "future" &&
      !serverAuthoritative &&
      hasPaid &&
      hasEnoughPicks &&
      liveStatus !== "assigned"
    ) {
      setState(assignDemoCohortFromSelections(storageUserId));
    }
    setMode(next);
  }

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
        data-testid="grader-onboarding-checklist"
        className="flex flex-wrap gap-2 rounded-[1.25rem] border border-black/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(247,240,228,0.72))] p-3"
      >
        {seasonSteps.map((step, index) => (
          <li
            key={step.label}
            data-testid={step.testId}
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
            <span className="sr-only">{step.done ? "Done" : "Pending"}</span>
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
            onClick={() => handleModeChange("current")}
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
            onClick={() => handleModeChange("future")}
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
            <p className="mt-0.5 text-xs leading-snug text-black/55">Locked until assignment exists.</p>
          </button>
        </div>
      </div>

      {!isFuturePreview && liveStatus === "assigned" && !letterPreviewDone ? (
        <div
          className="rounded-[1.35rem] border border-[rgba(26,92,255,0.28)] bg-[linear-gradient(135deg,rgba(26,92,255,0.08),rgba(247,240,228,0.72))] p-5"
          role="alert"
          aria-live="polite"
        >
          <p className="text-xs font-black uppercase tracking-[0.22em] text-black/55" style={{ fontFamily: "var(--font-mono)" }}>
            Cohort reveal
          </p>
          <p className="mt-2 text-base font-semibold text-black">
            Your assignment is ready—open the Future tab to read your letter.
          </p>
          <div className="mt-4">
            <Button variant="primary" onClick={() => handleModeChange("future")}>
              Open Future tab
            </Button>
          </div>
        </div>
      ) : null}

      {showCohortReveal ? (
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
              handleModeChange("current");
              setState(loadDemoState(storageUserId));
            }}
          />
        </div>
      ) : null}

      {isFuturePreview && !canSimulateCohortReveal ? (
        <Card variant="paper" className="border border-dashed border-black/15 bg-white/78">
          <Badge variant={liveStatus === "error" ? "rust" : "neutral"}>Letter locked</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">No cohort letter yet.</h1>
          <p className="mt-5 text-lg leading-8 text-[color:rgba(37,34,30,0.74)]">{sub}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/bingo" variant="secondary">
              Open season card
            </Button>
            <Button variant="ghost" onClick={() => handleModeChange("current")}>
              Back to status
            </Button>
          </div>
        </Card>
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
              <h1
                className={
                  isReadyToJoinHeadline
                    ? "text-5xl font-black tracking-tight text-black sm:text-6xl"
                    : "text-4xl font-semibold tracking-tight sm:text-5xl"
                }
              >
                {headline}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[color:rgba(37,34,30,0.72)] sm:text-lg">{sub}</p>
            </div>

            {showMatchingInProgress ? (
              <div className="rounded-[1.8rem] border border-black/10 bg-white/70 p-4 shadow-[0_18px_55px_rgba(52,36,24,0.10)]">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-black/55" style={{ fontFamily: "var(--font-mono)" }}>
                  Mailroom cam
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <CrumbsTyping size={64} />
                  <p className="text-sm font-semibold text-black/70">Crumbs is on sorting duty.</p>
                </div>
              </div>
            ) : null}
          </div>

          {liveStatus === "error" ? (
            <div
              className="mt-6 flex flex-col gap-3 rounded-[1.25rem] border border-red-900/20 bg-red-50/80 p-4 text-sm font-semibold text-red-950 sm:flex-row sm:items-center sm:justify-between"
              role="alert"
            >
              <span>{assignmentRequest.error ?? "Assignment did not complete. Try refreshing the dashboard."}</span>
              <Button size="sm" variant="secondary" onClick={() => setAssignmentRequest({ status: "idle" })}>
                Retry assignment
              </Button>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/bingo" variant="primary">
              Open season card
            </Button>
            <Button href="/cohort" variant="secondary">
              View cohort
            </Button>
            {!serverAuthoritative && hasPaid && hasEnoughPicks && liveStatus !== "assigned" ? (
              <Button
                variant="ghost"
                onClick={() => {
                  setState(assignDemoCohortFromSelections(storageUserId));
                  handleModeChange("future");
                }}
              >
                Run local demo assignment
              </Button>
            ) : null}
          </div>

        </Card>
      ) : null}

      {canSeeMatching ? (
        <PostcardMatchAnimation
          status={assignmentReady && !letterPreviewDone ? "pending" : liveStatus}
          error={assignmentRequest.error}
        />
      ) : null}
    </main>
  );
}
