"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Polaroid } from "@/components/ui/Polaroid";
import { Sticker } from "@/components/ui/Sticker";
import { Crumbs } from "@/components/brand/Crumbs";
import { JoinSeasonButton } from "@/components/season/JoinSeasonButton";
import { GraderControlPanel } from "@/components/app/GraderControlPanel";
import { saveDemoActivitySelectionsAction } from "@/app/actions/activity-selections";
import { toggleBingoTileAction } from "@/app/actions/bingo";
import { demoData, getDemoBusiness, getDemoEvent } from "@/lib/demo-data";
import type { OnboardingSnapshot } from "@/types/onboarding";
import {
  getBingoProgress,
  getDefaultDemoState,
  loadDemoState,
  mailPostcardForMatching,
  markSelectionsCommitted,
  setDepositStatus,
  toggleBingoTile,
  toggleSelectedEvent,
} from "@/lib/demo-state";

type OpenTile = { tileId: string } | null;

function formatSavedClock(iso: string) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime()) || d.getUTCFullYear() < 2020) return "—";
    return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(d);
  } catch {
    return "—";
  }
}

function formatDateTime(startsAtISO: string, durationMinutes: number) {
  const start = new Date(startsAtISO);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const dateFmt = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
  const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
  return `${dateFmt.format(start)} • ${timeFmt.format(start)}–${timeFmt.format(end)}`;
}

function eventPaperColor(idx: number) {
  const colors = [
    "bg-[color:rgba(233,255,107,0.90)]",
    "bg-[color:rgba(255,184,0,0.26)]",
    "bg-[color:rgba(26,92,255,0.18)]",
    "bg-[color:rgba(255,47,184,0.16)]",
    "bg-[color:rgba(191,90,54,0.18)]",
    "bg-[color:rgba(191,212,223,0.60)]",
  ];
  return colors[idx % colors.length]!;
}

type BingoBoardDemoProps = {
  clerkUserId?: string | null;
  /** When set (including `[]`), hydrates picks from Supabase for signed-in users. */
  serverSelections?: string[];
  syncSelectionsToServer?: boolean;
  serverOnboarding?: OnboardingSnapshot | null;
  serverBingoCompletions?: string[];
};

function mergeServerSelections(local: ReturnType<typeof loadDemoState>, serverSelections: string[] | undefined) {
  if (serverSelections !== undefined) {
    return { ...local, selectedEventIds: serverSelections };
  }
  return local;
}

export function BingoBoardDemo({
  clerkUserId = null,
  serverSelections,
  syncSelectionsToServer = false,
  serverOnboarding = null,
  serverBingoCompletions,
}: BingoBoardDemoProps) {
  const { userId: authUserId } = useAuth();
  const router = useRouter();
  const storageUserId = clerkUserId ?? authUserId ?? null;

  const [state, setState] = useState(() =>
    mergeServerSelections(getDefaultDemoState(), serverSelections),
  );
  const [open, setOpen] = useState<OpenTile>(null);
  const [bonusStampFlashId, setBonusStampFlashId] = useState<string | null>(null);
  const [eggClicks, setEggClicks] = useState(0);
  const [submitPhase, setSubmitPhase] = useState<
    "card" | "fold1" | "fold2" | "insert" | "stripe"
  >("card");
  const [selectionSaveStatus, setSelectionSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [bonusSaveStatus, setBonusSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [depositRecordedLocally, setDepositRecordedLocally] = useState(false);
  const [autosaveStatusLabel, setAutosaveStatusLabel] = useState<string | null>(null);
  const skipFirstRemoteSave = useRef(true);
  const tiles = demoData.bingoTiles;
  const serverAuthoritative = Boolean(serverOnboarding?.configured);
  const completedTileIds = useMemo(
    () => (serverAuthoritative ? (serverBingoCompletions ?? []) : state.bingo.completedTileIds),
    [serverAuthoritative, serverBingoCompletions, state.bingo.completedTileIds],
  );
  const progressState = useMemo(
    () => ({
      ...state,
      bingo: { completedTileIds },
    }),
    [state, completedTileIds],
  );
  useMemo(() => getBingoProgress(tiles, progressState), [progressState, tiles]);

  const required = demoData.season.requiredEventCount;
  const available = demoData.season.availableEventCount;
  const selectedCount = state.selectedEventIds.length;
  const canSelectMore = selectedCount < required;
  const selectionLocked = serverAuthoritative
    ? Boolean(serverOnboarding?.selectionLocked)
    : Boolean(state.selectionsCommittedAtISO);
  const isCommitted = selectionLocked;
  useEffect(() => {
    setDepositRecordedLocally(false);
  }, [serverOnboarding?.depositStatus, storageUserId]);

  const depositPaid = serverAuthoritative
    ? serverOnboarding?.depositStatus === "paid" || depositRecordedLocally
    : state.depositStatus === "paid";
  const readyToMail = depositPaid && selectedCount >= required;
  const canDoBonusChallenges = serverAuthoritative
    ? serverOnboarding?.assignmentStatus === "assigned"
    : state.matching.status === "assigned";
  const showCrumbsEgg = eggClicks >= 5;

  const serverSelectionsKey = serverSelections === undefined ? "none" : serverSelections.join("|");

  useEffect(() => {
    skipFirstRemoteSave.current = true;
    const id = window.setTimeout(() => {
      setState(mergeServerSelections(loadDemoState(storageUserId), serverSelections));
    }, 0);
    return () => window.clearTimeout(id);
  }, [storageUserId, serverSelectionsKey, serverSelections]);

  useEffect(() => {
    setAutosaveStatusLabel(
      `${isCommitted ? "Locked in · " : "Autosaved · "}${formatSavedClock(state.updatedAtISO)}${
        isCommitted ? "" : ` · tap an activity tile, add it to your ${required} of ${available}`
      }`,
    );
  }, [isCommitted, required, available, state.updatedAtISO]);

  useEffect(() => {
    if (!syncSelectionsToServer) return;
    if (skipFirstRemoteSave.current) {
      skipFirstRemoteSave.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      setSelectionSaveStatus("saving");
      void (async () => {
        const res = await saveDemoActivitySelectionsAction(state.selectedEventIds);
        if (res.ok) {
          setSelectionSaveStatus("saved");
          window.setTimeout(() => setSelectionSaveStatus("idle"), 2000);
        } else {
          setSelectionSaveStatus("error");
        }
      })();
    }, 520);
    return () => window.clearTimeout(t);
  }, [state.selectedEventIds, syncSelectionsToServer]);

  const openTile = open ? tiles.find((t) => t.id === open.tileId) ?? null : null;
  const openEvent = openTile?.eventId ? getDemoEvent(openTile.eventId) : null;
  const openBusiness = openEvent ? getDemoBusiness(openEvent.businessId) : null;

  function stampTile(tileId: string, kind: (typeof tiles)[number]["kind"]) {
    const wasStamped = completedTileIds.includes(tileId);

    if (serverAuthoritative) {
      if (kind === "challenge" && !canDoBonusChallenges) {
        return;
      }

      setBonusSaveStatus("saving");
      void (async () => {
        const result = await toggleBingoTileAction(tileId, !wasStamped);
        if (result.ok) {
          setBonusSaveStatus("saved");
          router.refresh();
          window.setTimeout(() => setBonusSaveStatus("idle"), 2000);
          if (!wasStamped && kind === "challenge") {
            setBonusStampFlashId(tileId);
            window.setTimeout(() => {
              setBonusStampFlashId((current) => (current === tileId ? null : current));
            }, 650);
          }
          return;
        }

        setBonusSaveStatus("error");
      })();
      return;
    }

    const next = toggleBingoTile(tileId, storageUserId);
    setState(next);
    if (!wasStamped && kind === "challenge") {
      setBonusStampFlashId(tileId);
      window.setTimeout(() => {
        setBonusStampFlashId((current) => (current === tileId ? null : current));
      }, 650);
    }
  }

  function onSubmit() {
    if (selectedCount < required) return;
    setSubmitPhase("fold1");
    window.setTimeout(() => setSubmitPhase("fold2"), 520);
    window.setTimeout(() => setSubmitPhase("insert"), 980);
    window.setTimeout(() => {
      setSubmitPhase("stripe");
      setState(markSelectionsCommitted(storageUserId));
    }, 1500);
  }

  const selectedEventsPreview = useMemo(
    () => state.selectedEventIds.map((id) => getDemoEvent(id)).filter(Boolean),
    [state.selectedEventIds],
  );

  const depositHandoffStatus = depositPaid
    ? serverAuthoritative
      ? "Paid - server confirmed"
      : "Paid - local demo"
    : serverAuthoritative && serverOnboarding?.depositStatus === "failed"
      ? "Failed"
      : serverAuthoritative && serverOnboarding?.depositStatus === "refunded"
        ? "Refunded"
        : state.depositStatus === "pending" || serverOnboarding?.depositStatus === "pending"
          ? "Pending"
          : "Not started";
  const depositHandoffCopy = depositPaid
    ? serverAuthoritative
      ? "This paid state is persisted in Supabase after Stripe webhook confirmation or the documented grader server action."
      : "This paid state lives only in the local demo cache. It is not a production payment."
    : serverAuthoritative
      ? "Stripe checkout may redirect you away. This panel stays pending until the server record changes to paid."
      : "Use this only for local prototype review. Production payment state must come from the server.";

  return (
    <div className="mx-auto grid max-w-[980px] gap-4" data-testid="bingo-board">
      <GraderControlPanel storageUserId={storageUserId} showWhenConfigured={serverAuthoritative} />
      <div className="mx-auto w-full max-w-[760px] text-center">
        <p
          className={[
            "text-[0.72rem] font-black uppercase tracking-[0.22em]",
            isCommitted ? "text-emerald-800/90" : "text-amber-900/70",
          ].join(" ")}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {isCommitted ? "Locked-in passport" : "Draft signup card"}
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-black sm:text-3xl">
          {isCommitted ? `Your ${required} of ${available} selections` : `Pick any ${required} of ${available} experiences`}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[color:rgba(37,34,30,0.72)]">
          {isCommitted ? (
            serverAuthoritative ? (
              <>
                These picks are saved to your account and styled as your{" "}
                <span className="font-semibold">locked passport</span>. Bonus squares unlock after cohort assignment.
              </>
            ) : (
              <>
                These picks are saved on this device and styled as your{" "}
                <span className="font-semibold">locked passport</span>. Bonus squares unlock after cohort assignment.
              </>
            )
          ) : (
            <>
              The $20 deposit holds your place for Chicago Summer 2026. We match cohorts from your{" "}
              <span className="font-semibold">{required} of {available}</span> saved activity picks.
            </>
          )}
        </p>
        <p
          className="mt-2 text-xs font-semibold text-black/55"
          style={{ fontFamily: "var(--font-mono)" }}
          suppressHydrationWarning
        >
          {autosaveStatusLabel ?? (isCommitted ? "Locked in · —" : "Autosaved · —")}
        </p>
        {syncSelectionsToServer ? (
          <p className="mt-3 text-xs font-semibold text-black/55" style={{ fontFamily: "var(--font-mono)" }}>
            {selectionSaveStatus === "saving"
              ? "Saving picks to your account…"
              : selectionSaveStatus === "saved"
                ? "Saved to your account."
                : selectionSaveStatus === "error"
                  ? "Couldn’t save picks—check connection or try again."
                  : "Selections autosave to your account."}
          </p>
        ) : null}
        {serverAuthoritative && canDoBonusChallenges ? (
          <p
            className="mt-2 text-xs font-semibold text-black/55"
            style={{ fontFamily: "var(--font-mono)" }}
            data-testid="bingo-bonus-save-status"
          >
            {bonusSaveStatus === "saving"
              ? "Saving bonus stamps to your account…"
              : bonusSaveStatus === "saved"
                ? "Bonus stamp saved to your account."
                : bonusSaveStatus === "error"
                  ? "Couldn’t save bonus stamp—try again."
                  : "Bonus stamps save to your account after assignment."}
          </p>
        ) : null}
        {!isCommitted ? (
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold text-black/70 shadow-[0_18px_55px_rgba(52,36,24,0.10)]"
            onClick={() => setEggClicks((n) => n + 1)}
            aria-label="Bingo card note"
          >
            <span>Tip: pick overlap-y plans. Recognition happens on week 2.</span>
            {showCrumbsEgg ? <Crumbs size="sm" pose="sit" expression="neutral" animated /> : null}
          </button>
        ) : null}
      </div>

      {isCommitted && selectedEventsPreview.length > 0 ? (
        <div className="mx-auto w-full max-w-[760px] rounded-[1.5rem] border-2 border-emerald-800/25 bg-[linear-gradient(135deg,rgba(236,253,245,0.92),rgba(255,255,255,0.95))] p-5 text-left shadow-[0_18px_55px_rgba(16,185,129,0.12)]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-900/80" style={{ fontFamily: "var(--font-mono)" }}>
            Your selections
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {selectedEventsPreview.map((evt) => (
              <li
                key={evt!.id}
                className="rounded-[1.1rem] border border-black/8 bg-[color:rgba(247,240,228,0.65)] px-4 py-3 text-sm font-semibold text-black"
              >
                {evt!.title}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[760px]">
        <div className="relative mx-auto">
          {/* Sticker-ish decorations */}
          {!isCommitted ? (
            <>
              <div aria-hidden="true" className="pointer-events-none absolute -left-4 -top-5 hidden sm:block">
                <div className="scrap-sticker scrap-sticker-a">BONUS</div>
              </div>
              <div aria-hidden="true" className="pointer-events-none absolute -right-6 -bottom-6 hidden sm:block">
                <div className="scrap-sticker scrap-sticker-b">SHOW UP</div>
              </div>
            </>
          ) : null}

          {/* Craft board */}
          <div
            className={[
              "relative mx-auto overflow-hidden rounded-[2.2rem] border p-4 shadow-[0_28px_95px_rgba(52,36,24,0.14)]",
              isCommitted
                ? "border-2 border-emerald-800/30 bg-[linear-gradient(145deg,rgba(255,255,255,0.97),rgba(236,253,245,0.75))] shadow-[0_24px_70px_rgba(16,185,129,0.14)] ring-1 ring-emerald-600/15"
                : "border-2 border-dashed border-amber-900/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,251,235,0.85))]",
              !isCommitted
                ? "before:absolute before:inset-0 before:bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.02),rgba(0,0,0,0.02)_1px,transparent_1px,transparent_6px)] before:opacity-40 before:content-['']"
                : "",
            ].join(" ")}
          >
            {isCommitted ? (
              <div
                className="absolute right-4 top-4 z-20 rounded-full border border-emerald-800/25 bg-emerald-50 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-emerald-900 shadow-sm"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {serverAuthoritative ? "Account saved" : "Local demo saved"}
              </div>
            ) : null}
            {/* Little shapes (stars + squiggles) */}
            {!isCommitted ? (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <svg
                className="scrap-shape scrap-shape-star scrap-shape-a"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 4l7.2 20.2L60 24.7 43.2 37l6.6 20.8L32 46.3 14.2 57.8 20.8 37 4 24.7l20.8-.5L32 4Z"
                  stroke="rgba(0,0,0,0.55)"
                  strokeWidth="2.4"
                  fill="rgba(233,255,107,0.55)"
                />
              </svg>
              <svg
                className="scrap-shape scrap-shape-squig scrap-shape-b"
                viewBox="0 0 120 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="scrap-squiggle-path"
                  d="M6 36c10-16 22-16 32 0s22 16 32 0 22-16 32 0"
                  stroke="rgba(26,92,255,0.55)"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                />
              </svg>
              <svg
                className="scrap-shape scrap-shape-star scrap-shape-c"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 6l6.4 17.9 18.6.4-15 11 5.7 18.3L32 43.5 16.3 53.6 22 35.3 7 24.3l18.6-.4L32 6Z"
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="2.2"
                  fill="rgba(255,47,184,0.18)"
                />
              </svg>
              <svg
                className="scrap-shape scrap-shape-squig scrap-shape-d"
                viewBox="0 0 120 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="scrap-squiggle-path-2"
                  d="M8 22c12 14 24 14 36 0s24-14 36 0 24 14 36 0"
                  stroke="rgba(189,98,63,0.55)"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            ) : null}

            {/* Tape corners */}
            {!isCommitted ? (
              <>
                <div aria-hidden="true" className="scrap-tape scrap-tape-tl" />
                <div aria-hidden="true" className="scrap-tape scrap-tape-tr" />
                <div aria-hidden="true" className="scrap-tape scrap-tape-bl" />
                <div aria-hidden="true" className="scrap-tape scrap-tape-br" />
              </>
            ) : null}

            <div className="relative z-10 flex items-center justify-between gap-2 px-1 pb-3">
              <span className="rounded-full bg-black/5 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] text-black/70">
                {selectedCount}/{required} picks · {available} activities
              </span>
              <div className="flex items-center gap-2">
                {!serverAuthoritative ? (
                  <Button
                    size="sm"
                    variant={state.depositStatus === "paid" ? "secondary" : "sticker"}
                    onClick={() =>
                      setState(setDepositStatus(state.depositStatus === "paid" ? "pending" : "paid", storageUserId))
                    }
                  >
                    {state.depositStatus === "paid" ? "Local demo: paid" : "Local demo: mark paid"}
                  </Button>
                ) : (
                  <span
                    className="rounded-full bg-black/5 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.18em] text-black/65"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {depositPaid ? "Deposit: confirmed" : "Deposit: due"}
                  </span>
                )}
              </div>
            </div>

            {/* 5x5 grid */}
            <div className="relative z-10 grid grid-cols-5 gap-2">
              {tiles.map((tile, idx) => {
                const isFree = tile.kind === "free";
                const isBonus = tile.kind === "challenge";
                const isEvent = tile.kind === "event";
                const stamped = completedTileIds.includes(tile.id);
                const bonusJustStamped = isBonus && bonusStampFlashId === tile.id;
                const selected = tile.eventId ? state.selectedEventIds.includes(tile.eventId) : false;
                const disabledSelect =
                  isEvent && tile.eventId && !selected && (!canSelectMore || isCommitted);
                const isCenter = idx === 12 && isFree;
                const lockedBonus = isBonus && !canDoBonusChallenges;

                const paperClass = isBonus
                  ? "bg-[color:rgba(40,40,40,0.10)]"
                  : isFree
                    ? "bg-[color:rgba(255,255,255,0.82)]"
                    : eventPaperColor(idx);

                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => {
                      if (lockedBonus) return;
                      setOpen({ tileId: tile.id });
                    }}
                    disabled={lockedBonus}
                    className={[
                      "group relative aspect-square overflow-hidden rounded-[1.25rem] border border-black/12 p-3 text-left shadow-[0_14px_38px_rgba(52,36,24,0.12)]",
                      "transition-transform hover:-translate-y-[2px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]",
                      paperClass,
                      "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.55),transparent_58%)] before:content-['']",
                      isBonus ? "scrap-bonus" : "",
                      selected
                        ? "border-[3px] border-[var(--color-accent-dark)] shadow-[0_18px_55px_rgba(26,92,255,0.20)] ring-2 ring-[color:rgba(233,255,107,0.65)]"
                        : "",
                      disabledSelect ? "opacity-70" : "",
                      lockedBonus ? "opacity-60 cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div>
                        <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-black/65">
                          {isFree ? "Free" : isEvent ? "Activity" : "Bonus"}
                        </p>
                        <p className={`mt-2 font-black leading-5 text-black ${isCenter ? "text-base" : "text-[0.82rem]"}`}>
                          {tile.title}
                        </p>
                        <p className="mt-1 text-[0.7rem] leading-4 text-black/70 line-clamp-2">
                          {tile.description}
                        </p>
                      </div>

                      {isCenter ? (
                        <div className="mt-2">
                          <div className="scrap-star" aria-hidden="true" />
                          <p className="mt-2 text-[0.68rem] font-black uppercase tracking-[0.22em] text-black/70">
                            Joined
                          </p>
                        </div>
                      ) : (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {selected ? (
                            <span className="rounded-full bg-black px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.22em] text-white">
                              Selected
                            </span>
                          ) : null}
                          {stamped ? (
                            <span className="rounded-full bg-white/80 px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.22em] text-black">
                              Stamped
                            </span>
                          ) : null}
                          {lockedBonus ? (
                            <span className="rounded-full bg-black/10 px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.22em] text-black/70">
                              Locked
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>

                    {isCenter ? (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute right-2 top-2 -rotate-6 rounded-[0.85rem] border border-black/60 bg-[color:rgba(255,184,0,0.65)] px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.22em] text-black shadow-[0_12px_30px_rgba(52,36,24,0.18)]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        FREE
                      </span>
                    ) : stamped ? (
                      <span
                        aria-hidden="true"
                        className={[
                          "pointer-events-none absolute right-2 top-2 -rotate-12 rounded-[0.85rem] border border-black/60 bg-white/85 px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.22em] text-black shadow-[0_12px_30px_rgba(52,36,24,0.12)]",
                          isBonus && bonusJustStamped ? "scrap-stamp-pop" : "",
                        ].join(" ")}
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        OK
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <style>{`
              @media (prefers-reduced-motion: reduce) {
                .group { transition: none !important; }
                .group:hover { transform: none !important; }
                .scrap-sticker-a, .scrap-sticker-b { animation: none !important; }
                .scrap-star { animation: none !important; }
                .scrap-stamp-pop { animation: none !important; }
                .scrap-shape { animation: none !important; }
                .scrap-squiggle-path, .scrap-squiggle-path-2 { animation: none !important; stroke-dashoffset: 0 !important; }
              }

              /* Tape corners */
              .scrap-tape{
                position:absolute;
                width: 96px;
                height: 28px;
                background: linear-gradient(135deg, rgba(255,255,255,0.55), rgba(242,203,113,0.22));
                border: 1px solid rgba(0,0,0,0.10);
                box-shadow: 0 18px 55px rgba(52,36,24,0.12);
                opacity: 0.85;
                filter: saturate(0.95);
              }
              .scrap-tape-tl{ left: 18px; top: 12px; transform: rotate(-12deg); }
              .scrap-tape-tr{ right: 18px; top: 12px; transform: rotate(12deg); }
              .scrap-tape-bl{ left: 18px; bottom: 12px; transform: rotate(10deg); }
              .scrap-tape-br{ right: 18px; bottom: 12px; transform: rotate(-10deg); }

              /* Bonus stamp pop */
              .scrap-stamp-pop{
                animation: stampPop 520ms cubic-bezier(0.22, 1, 0.36, 1);
              }
              @keyframes stampPop{
                0%{ transform: translateY(-6px) rotate(-18deg) scale(0.78); opacity: 0; filter: blur(1px); }
                60%{ transform: translateY(0) rotate(-12deg) scale(1.08); opacity: 1; filter: blur(0px); }
                100%{ transform: translateY(0) rotate(-12deg) scale(1); opacity: 1; }
              }

              .scrap-sticker {
                display:inline-flex;
                align-items:center;
                justify-content:center;
                border-radius: 999px;
                border: 1px solid rgba(0,0,0,0.16);
                padding: 10px 14px;
                font-size: 0.72rem;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 0.22em;
                box-shadow: 0 18px 55px rgba(52,36,24,0.14);
                font-family: var(--font-mono);
              }
              .scrap-sticker-a {
                background: rgba(40,40,40,0.10);
                transform: rotate(-8deg);
                animation: stickerFloatA 6.5s ease-in-out infinite;
              }
              .scrap-sticker-b {
                background: rgba(233,255,107,0.70);
                transform: rotate(10deg);
                animation: stickerFloatB 7.2s ease-in-out infinite;
              }
              @keyframes stickerFloatA {
                0%, 100% { transform: translateY(0) rotate(-8deg); }
                50% { transform: translateY(-6px) rotate(-6deg); }
              }
              @keyframes stickerFloatB {
                0%, 100% { transform: translateY(0) rotate(10deg); }
                50% { transform: translateY(-7px) rotate(8deg); }
              }
              .scrap-star {
                width: 54px;
                height: 54px;
                margin-top: 6px;
                background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.9), rgba(255,184,0,0.92));
                clip-path: polygon(
                  50% 0%,
                  61% 35%,
                  98% 35%,
                  68% 57%,
                  79% 91%,
                  50% 70%,
                  21% 91%,
                  32% 57%,
                  2% 35%,
                  39% 35%
                );
                border: 1px solid rgba(0,0,0,0.22);
                box-shadow: 0 18px 55px rgba(52,36,24,0.18);
                animation: starPop 2.8s cubic-bezier(0.22, 1, 0.36, 1) infinite;
              }
              @keyframes starPop {
                0%, 100% { transform: scale(1) rotate(-2deg); }
                50% { transform: scale(1.08) rotate(2deg); }
              }

              /* Shapes */
              .scrap-shape{
                position:absolute;
                opacity: 0.9;
                filter: drop-shadow(0 18px 45px rgba(52,36,24,0.16));
                transform-origin: 50% 50%;
              }
              .scrap-shape-star{ width: 52px; height: 52px; }
              .scrap-shape-squig{ width: 118px; height: 56px; }

              .scrap-shape-a{ left: -6px; top: 92px; transform: rotate(-10deg); animation: shapeDriftA 6.8s ease-in-out infinite; }
              .scrap-shape-b{ right: -26px; top: 112px; transform: rotate(8deg); animation: shapeDriftB 7.4s ease-in-out infinite; }
              .scrap-shape-c{ right: 18px; bottom: 74px; transform: rotate(14deg); animation: shapeDriftC 8.2s ease-in-out infinite; }
              .scrap-shape-d{ left: 10px; bottom: 36px; transform: rotate(-6deg); animation: shapeDriftB 7.9s ease-in-out infinite; }

              @keyframes shapeDriftA{
                0%,100%{ transform: translateY(0) rotate(-10deg) scale(1); opacity: 0.88; }
                50%{ transform: translateY(-8px) rotate(-6deg) scale(1.03); opacity: 1; }
              }
              @keyframes shapeDriftB{
                0%,100%{ transform: translateY(0) rotate(8deg) scale(1); opacity: 0.86; }
                50%{ transform: translateY(-9px) rotate(5deg) scale(1.03); opacity: 1; }
              }
              @keyframes shapeDriftC{
                0%,100%{ transform: translateY(0) rotate(14deg) scale(1); opacity: 0.86; }
                50%{ transform: translateY(-7px) rotate(18deg) scale(1.02); opacity: 1; }
              }

              .scrap-squiggle-path{
                stroke-dasharray: 120;
                stroke-dashoffset: 120;
                animation: squigDraw 4.8s ease-in-out infinite;
              }
              .scrap-squiggle-path-2{
                stroke-dasharray: 120;
                stroke-dashoffset: 0;
                animation: squigDraw2 5.6s ease-in-out infinite;
              }
              @keyframes squigDraw{
                0%{ stroke-dashoffset: 120; opacity: 0.45; }
                45%{ stroke-dashoffset: 0; opacity: 0.9; }
                100%{ stroke-dashoffset: -120; opacity: 0.45; }
              }
              @keyframes squigDraw2{
                0%{ stroke-dashoffset: -120; opacity: 0.45; }
                45%{ stroke-dashoffset: 0; opacity: 0.9; }
                100%{ stroke-dashoffset: 120; opacity: 0.45; }
              }
            `}</style>
          </div>
        </div>
      </div>

      {!isCommitted ? (
        <div className="mx-auto flex w-full max-w-[760px] justify-center pt-1">
          <Button variant="primary" disabled={selectedCount < required} onClick={onSubmit}>
            Ready to submit
          </Button>
        </div>
      ) : null}

      {submitPhase !== "card" ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />

          {/* Step-by-step folding + envelope insert */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 w-[min(92vw,44rem)] -translate-x-1/2 -translate-y-1/2 p-3">
            <div className="relative mx-auto h-[360px] w-full">
              <div className={`scrap-fold-stage ${submitPhase}`}>
                <div className="scrap-fold-card" />
                <div className="scrap-fold-top" />
                <div className="scrap-fold-bottom" />
                <div className="scrap-fold-envelope" />
              </div>
            </div>
          </div>

          {/* Stripe prompt appears after insert */}
          {submitPhase === "stripe" ? (
            <div
              className="absolute left-1/2 top-1/2 w-[min(92vw,42rem)] -translate-x-1/2 -translate-y-1/2 p-3"
              data-testid="bingo-deposit-handoff"
              role="dialog"
              aria-modal="true"
              aria-labelledby="bingo-deposit-handoff-title"
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-black/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(247,240,228,0.94))] p-6 shadow-[0_28px_95px_rgba(0,0,0,0.22)]">
                <Badge variant="neutral">Summer 2026 deposit</Badge>
                <h3 id="bingo-deposit-handoff-title" className="mt-4 text-3xl font-black tracking-tight">Secure your spot for the season.</h3>
                <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.74)]">
                  Pay the <span className="font-semibold">$20 deposit</span> to hold your place. After sign-ups close,
                  matching runs from your {required} of {available} saved picks. Your cohort letter unlocks only after
                  the server records an assignment.
                </p>

                <div className="mt-5 flex items-center gap-3 rounded-[1.25rem] border border-black/8 bg-white/70 p-4">
                  <Crumbs size="sm" pose="sit" expression="neutral" animated />
                  <p className="text-sm font-medium text-black/70">
                    Crumbs note: deposit first, then we sort the match pile from your picks.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:items-end">
                  <div className="rounded-[1.8rem] border border-black/10 bg-white/75 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-black/60">Status</p>
                    <p className="mt-2 text-lg font-semibold" role={depositHandoffStatus === "Failed" ? "alert" : "status"} aria-live="polite">
                      {depositHandoffStatus}
                    </p>
                    <p className="mt-2 text-sm text-black/60">
                      {depositHandoffCopy}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <JoinSeasonButton
                      onDepositRecorded={() => {
                        setDepositRecordedLocally(true);
                        router.refresh();
                      }}
                    />
                    {!serverAuthoritative ? (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          const next = setDepositStatus("paid", storageUserId);
                          setState(next);
                        }}
                      >
                        Local demo: record paid
                      </Button>
                    ) : null}
                  </div>
                </div>

                {depositPaid ? (
                  <div className="mt-6 grid gap-3">
                    <Sticker>
                      {serverAuthoritative
                        ? "Matching runs from your saved picks on the dashboard."
                        : "Local demo matching is available on the dashboard and stays labeled as demo state."}
                    </Sticker>
                    {!serverAuthoritative ? (
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                          variant="primary"
                          disabled={!readyToMail}
                          onClick={() => {
                            setState(mailPostcardForMatching(storageUserId));
                            window.location.href = "/dashboard";
                          }}
                        >
                          Open demo matching
                        </Button>
                        <Button variant="ghost" onClick={() => setSubmitPhase("card")}>
                          Back to card
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button variant="ghost" onClick={() => setSubmitPhase("card")}>
                          Back to card
                        </Button>
                        <Button href="/dashboard" variant="primary">
                          Go to dashboard
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-6">
                    <Button variant="ghost" onClick={() => setSubmitPhase("card")}>
                      Not yet
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <style>{`
            @media (prefers-reduced-motion: reduce){
              .scrap-fold-stage, .scrap-fold-card, .scrap-fold-top, .scrap-fold-bottom { animation:none !important; transition:none !important; }
            }

            .scrap-fold-stage{
              position:absolute;
              left: 50%;
              top: 50%;
              width: min(520px, 86vw);
              height: 320px;
              transform: translate(-50%,-50%);
              perspective: 1200px;
              filter: drop-shadow(0 28px 95px rgba(0,0,0,0.22));
            }

            .scrap-fold-card{
              position:absolute;
              inset: 0;
              border-radius: 34px;
              border: 1px solid rgba(0,0,0,0.14);
              background:
                linear-gradient(135deg, rgba(255,255,255,0.92), rgba(247,240,228,0.92));
              box-shadow: 0 18px 55px rgba(52,36,24,0.16);
            }
            .scrap-fold-card:before{
              content:'';
              position:absolute;
              inset: 18px;
              border-radius: 24px;
              border: 1px dashed rgba(0,0,0,0.16);
              opacity: 0.55;
            }

            .scrap-fold-top, .scrap-fold-bottom{
              position:absolute;
              left: 0;
              right: 0;
              height: 50%;
              border-radius: 34px;
              background:
                linear-gradient(135deg, rgba(255,255,255,0.82), rgba(242,231,216,0.90));
              border: 1px solid rgba(0,0,0,0.12);
              transform-style: preserve-3d;
              opacity: 0;
            }
            .scrap-fold-top{ top: 0; transform-origin: top center; border-bottom: none; }
            .scrap-fold-bottom{ bottom: 0; transform-origin: bottom center; border-top: none; }

            .scrap-fold-envelope{
              position:absolute;
              left: 50%;
              top: 62%;
              width: min(460px, 84vw);
              height: 210px;
              transform: translate(-50%, -50%);
              border-radius: 32px;
              border: 1px solid rgba(0,0,0,0.14);
              background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(242,231,216,0.98));
              box-shadow: 0 28px 95px rgba(0,0,0,0.18);
              opacity: 0;
            }
            .scrap-fold-envelope:before{
              content:'';
              position:absolute;
              left: 18px; right: 18px; top: 18px; bottom: 18px;
              border-radius: 24px;
              border: 1px dashed rgba(0,0,0,0.16);
              opacity: 0.6;
            }
            .scrap-fold-envelope:after{
              content:'';
              position:absolute;
              left: 0; right: 0; top: 56px; height: 1px;
              background: rgba(0,0,0,0.14);
              transform: rotate(-1.2deg);
            }

            .scrap-fold-stage.fold1 .scrap-fold-top{
              opacity: 1;
              animation: foldTop 520ms cubic-bezier(0.22,1,0.36,1) both;
            }
            .scrap-fold-stage.fold2 .scrap-fold-top{
              opacity: 1;
              transform: rotateX(160deg);
            }
            .scrap-fold-stage.fold2 .scrap-fold-bottom{
              opacity: 1;
              animation: foldBottom 520ms cubic-bezier(0.22,1,0.36,1) both;
            }
            .scrap-fold-stage.insert .scrap-fold-top,
            .scrap-fold-stage.insert .scrap-fold-bottom{
              opacity: 1;
              transform: rotateX(160deg);
            }
            .scrap-fold-stage.insert .scrap-fold-envelope{
              opacity: 1;
              animation: envelopePop 240ms ease-out both;
            }
            .scrap-fold-stage.insert .scrap-fold-card{
              animation: slideIntoEnvelope 520ms cubic-bezier(0.22,1,0.36,1) both;
            }
            .scrap-fold-stage.stripe{
              opacity: 0;
              transform: translate(-50%,-50%) scale(0.98);
              transition: opacity 220ms ease;
            }

            @keyframes foldTop{
              0%{ transform: rotateX(0deg); }
              100%{ transform: rotateX(160deg); }
            }
            @keyframes foldBottom{
              0%{ transform: rotateX(0deg); }
              100%{ transform: rotateX(-160deg); }
            }
            @keyframes envelopePop{
              from{ transform: translate(-50%,-50%) scale(0.96); }
              to{ transform: translate(-50%,-50%) scale(1); }
            }
            @keyframes slideIntoEnvelope{
              0%{ transform: translateY(0) scale(1); opacity: 1; }
              100%{ transform: translateY(70px) scale(0.82); opacity: 0.15; }
            }
          `}</style>
        </div>
      ) : null}

      {openTile ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close tile details"
            onClick={() => setOpen(null)}
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          />
          <div className="absolute left-1/2 top-1/2 w-[min(92vw,52rem)] -translate-x-1/2 -translate-y-1/2 p-3">
            <div className="relative overflow-hidden rounded-[2rem] border border-black/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(247,240,228,0.92))] p-6 shadow-[0_28px_95px_rgba(0,0,0,0.22)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant={openTile.kind === "event" ? "butter" : openTile.kind === "free" ? "neutral" : "sky"}>
                    {openTile.kind === "event" ? "Activity" : openTile.kind === "free" ? "Free space" : "Bonus challenge"}
                  </Badge>
                  <h3 className="mt-4 text-3xl font-black tracking-tight">{openTile.title}</h3>
                  <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.74)]">{openTile.description}</p>
                </div>
                <Button variant="ghost" onClick={() => setOpen(null)} data-testid="bingo-tile-close">
                  Close
                </Button>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                <div className="grid gap-4">
                  {openEvent ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-black/10 bg-white/80 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-black/60">Hosted by</p>
                    <p className="mt-2 text-base font-semibold text-black">{openBusiness?.name ?? "Local host"}</p>
                    <p className="mt-1 text-sm text-black/60">{openEvent.neighborhood}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-black/10 bg-white/80 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-black/60">When</p>
                    <p className="mt-2 text-base font-semibold text-black">
                      {formatDateTime(openEvent.startsAtISO, openEvent.durationMinutes)}
                    </p>
                    <p className="mt-1 text-sm text-black/60">{openEvent.cost} • Capacity {openEvent.capacity}</p>
                  </div>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row">
                {openTile.kind === "event" && openTile.eventId ? (
                  isCommitted ? (
                    <p className="text-sm font-medium text-black/65">
                      Your {required} of {available} experiences are saved and locked in. Bonus prompts unlock after your cohort is
                      assigned.
                    </p>
                  ) : (
                    <Button
                      variant={state.selectedEventIds.includes(openTile.eventId) ? "secondary" : "primary"}
                      disabled={!state.selectedEventIds.includes(openTile.eventId) && !canSelectMore}
                      onClick={() => {
                        const next = toggleSelectedEvent(openTile.eventId!, storageUserId, required);
                        setState(next);
                      }}
                    >
                      {state.selectedEventIds.includes(openTile.eventId) ? `Remove from my ${required}` : `Select (counts toward ${required})`}
                    </Button>
                  )
                ) : null}
                <Button
                  variant={completedTileIds.includes(openTile.id) ? "secondary" : "sticker"}
                  disabled={openTile.kind === "free" || (openTile.kind === "challenge" && !canDoBonusChallenges)}
                  onClick={() => stampTile(openTile.id, openTile.kind)}
                >
                  {openTile.kind === "free"
                    ? "Free space"
                    : completedTileIds.includes(openTile.id)
                      ? "Unstamp"
                      : "Stamp this square"}
                </Button>
                <Button href="/cohort" variant="ghost">
                  Go to cohort
                </Button>
                  </div>

              {!state.selectedEventIds.includes(openTile.eventId ?? "") && !canSelectMore && openTile.kind === "event" ? (
                <p className="mt-4 text-sm text-black/60">You already selected {required}. Remove one to add another.</p>
              ) : null}
                </div>

                <div className="relative">
                  <div className="absolute -left-6 -top-6 hidden lg:block">
                    <Polaroid
                      title={openTile.photo?.title ?? (openBusiness ? `${openBusiness.name}` : "Common Area moment")}
                      caption={openTile.photo?.caption ?? (openEvent ? "Photo via Unsplash." : "Photo via Unsplash.")}
                      tilt="left"
                      className="w-[320px]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          openTile.photo?.url ??
                          openEvent?.imageUrl ??
                          openBusiness?.imageUrl ??
                          "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=2200&q=80"
                        }
                        alt={
                          openTile.photo?.alt ??
                          (openEvent ? `Photo representing ${openEvent.title}` : "Photo via Unsplash.")
                        }
                        loading="lazy"
                        decoding="async"
                        className="h-56 w-full object-cover"
                      />
                    </Polaroid>
                  </div>

                  <div className="lg:pt-[280px]">
                    <Card variant="paper" className="relative overflow-hidden">
                      <Badge variant="neutral">Sticker notes</Badge>
                      <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.74)]">
                        Activity squares count toward your {required} of {available}. Bonus prompts unlock after cohort assignment.
                      </p>
                      <div aria-hidden="true" className="pointer-events-none absolute -right-6 -top-6">
                        <div className="scrap-mini-sticker">WOW</div>
                      </div>
                      <div aria-hidden="true" className="pointer-events-none absolute -left-6 -bottom-6">
                        <div className="scrap-mini-sticker scrap-mini-sticker-2">OK</div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              <style>{`
                .scrap-mini-sticker{
                  display:inline-flex;
                  align-items:center;
                  justify-content:center;
                  width: 54px;
                  height: 54px;
                  border-radius: 14px;
                  border: 1px solid rgba(0,0,0,0.18);
                  background: rgba(255,47,184,0.18);
                  box-shadow: 0 18px 55px rgba(52,36,24,0.14);
                  font-family: var(--font-mono);
                  font-weight: 900;
                  letter-spacing: 0.18em;
                  transform: rotate(-8deg);
                  animation: miniStickerFloat 5.8s ease-in-out infinite;
                }
                .scrap-mini-sticker-2{
                  background: rgba(233,255,107,0.55);
                  transform: rotate(10deg);
                  animation-duration: 6.6s;
                }
                @keyframes miniStickerFloat{
                  0%,100%{ transform: translateY(0) rotate(-8deg); }
                  50%{ transform: translateY(-7px) rotate(-5deg); }
                }
                @media (prefers-reduced-motion: reduce){
                  .scrap-mini-sticker{ animation:none !important; }
                }
              `}</style>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
