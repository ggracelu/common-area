"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { DemoNotice } from "@/components/app/DemoNotice";
import { demoData, getDemoEvent, getDemoCohort } from "@/lib/demo-data";
import {
  getBingoProgress,
  loadDemoState,
  mailPostcardForMatching,
  setDepositStatus,
  tickMatchingForward,
  toggleBingoTile,
} from "@/lib/demo-state";

function formatShortDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(d);
}

function formatTimeRange(startsAtISO: string, durationMinutes: number) {
  const start = new Date(startsAtISO);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
  return `${fmt.format(start)}–${fmt.format(end)}`;
}

export function DashboardHome() {
  const { user } = useUser();
  const greetingName = user?.firstName ?? user?.username ?? "friend";
  const [state, setState] = useState(() => loadDemoState());
  const assignedCohort = state.matching.cohortId ? getDemoCohort(state.matching.cohortId) : null;

  useEffect(() => {
    const interval = window.setInterval(() => {
      const next = tickMatchingForward();
      setState(next);
    }, 750);
    return () => window.clearInterval(interval);
  }, []);

  const selectedEvents = useMemo(
    () => state.selectedEventIds.map((id) => getDemoEvent(id)).filter(Boolean),
    [state.selectedEventIds],
  );

  const nextEvent = selectedEvents
    .slice()
    .sort((a, b) => new Date(a!.startsAtISO).getTime() - new Date(b!.startsAtISO).getTime())[0] ?? null;

  const bingoProgress = useMemo(() => getBingoProgress(demoData.bingoTiles, state), [state]);

  const readyToMatch =
    state.depositStatus === "paid" && state.selectedEventIds.length >= demoData.season.requiredEventCount;

  return (
    <div className="grid gap-6">
      <DemoNotice />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card variant="scrapbook">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge variant="neutral">Home base</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                Hi, {greetingName}. Ready for a campus week?
              </h2>
              <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
                You’re in the <span className="font-semibold">{demoData.season.name}</span>. The goal is simple: pick 4 plans,
                wait for matching, then keep showing up until familiar faces happen.
              </p>
            </div>
            <Sticker>Low pressure. Repeatable plans.</Sticker>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Deposit</p>
              <p className="mt-3 text-2xl font-semibold">
                {state.depositStatus === "paid" ? "Paid" : state.depositStatus === "pending" ? "Pending" : "Not started"}
              </p>
              <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.66)]">
                {demoData.season.depositDollars} dollars. Demo toggle below.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant={state.depositStatus === "paid" ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => {
                    const next = setDepositStatus("paid");
                    setState(next);
                  }}
                >
                  Mark paid (demo)
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const next = setDepositStatus("pending");
                    setState(next);
                  }}
                >
                  Set pending
                </Button>
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Event picks</p>
              <p className="mt-3 text-2xl font-semibold">
                {state.selectedEventIds.length} / {demoData.season.requiredEventCount}
              </p>
              <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.66)]">Pick 4 cohort events. We’ll match on overlap.</p>
              <div className="mt-4">
                <Button href="/season/select" variant="secondary" size="sm">
                  Pick events
                </Button>
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Bingo points</p>
              <p className="mt-3 text-2xl font-semibold">{bingoProgress.points}</p>
              <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.66)]">
                {bingoProgress.completed} / {bingoProgress.total} squares stamped.
              </p>
              <div className="mt-4">
                <Button href="/bingo" variant="secondary" size="sm">
                  Open bingo
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6">
          <Card variant="paper" className="lift-hover">
            <Badge variant="sky">Matching</Badge>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">
              {state.matching.status === "assigned"
                ? "Cohort assigned"
                : state.matching.status === "pending"
                  ? "We’re sorting the mail"
                  : state.matching.status === "mailing"
                    ? "Postcard in flight"
                    : "Not mailed yet"}
            </h3>
            <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
              Signups stay open for one week. After that, we match cohorts based on overlapping picks — then the common room appears.
            </p>

            {state.matching.status === "assigned" && assignedCohort ? (
              <div className="mt-6 rounded-[1.25rem] border border-black/10 bg-white/75 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">Your cohort</p>
                <p className="mt-2 text-xl font-semibold">{assignedCohort.name}</p>
                <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.68)]">{assignedCohort.theme}</p>
                <div className="mt-4 flex gap-2">
                  <Button href="/cohort" variant="secondary" size="sm">
                    Enter the common room
                  </Button>
                  <Button href="/cohort/chat" variant="ghost" size="sm">
                    Peek chat
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!readyToMatch}
                  onClick={() => {
                    const next = mailPostcardForMatching();
                    setState(next);
                  }}
                >
                  Send postcard to matching
                </Button>
                <Button href="/season/select" variant="secondary" size="sm">
                  Review picks
                </Button>
              </div>
            )}

            {!readyToMatch ? (
              <p className="mt-4 text-sm text-[color:rgba(37,34,30,0.62)]">
                To mail the postcard: mark deposit <span className="font-semibold">paid</span> (demo) and pick{" "}
                {demoData.season.requiredEventCount} events.
              </p>
            ) : null}
          </Card>

          <Card variant="paper" className="lift-hover">
            <Badge variant="neutral">Next up</Badge>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">
              {nextEvent ? nextEvent.title : "Pick something you’d actually attend."}
            </h3>
            {nextEvent ? (
              <div className="mt-4 space-y-2 text-sm text-[color:rgba(37,34,30,0.68)]">
                <p>
                  {formatShortDate(nextEvent.startsAtISO)} • {formatTimeRange(nextEvent.startsAtISO, nextEvent.durationMinutes)}
                </p>
                <p>
                  {nextEvent.neighborhood} • {nextEvent.cost}
                </p>
                <p className="text-base leading-7 text-[color:rgba(37,34,30,0.72)]">{nextEvent.description}</p>
                <div className="mt-4">
                  <Link
                    href="/season/select"
                    className="text-sm font-semibold text-[var(--color-accent-dark)] underline decoration-[var(--color-accent-soft)] underline-offset-4"
                  >
                    Open picks →
                  </Link>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
                Once you select events, we’ll show your upcoming week here (and keep the “should I go?” decision smaller).
              </p>
            )}
          </Card>
        </div>
      </section>

      <Card variant="paper">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="rust">Quick stamp</Badge>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">One small bingo square, right now</h3>
            <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
              If you complete one tiny social side quest, the rest gets easier. Pick a square to stamp.
            </p>
          </div>
          <Sticker>Small wins count.</Sticker>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {demoData.bingoTiles.slice(0, 3).map((tile) => {
            const done = state.bingo.completedTileIds.includes(tile.id);
            return (
              <button
                key={tile.id}
                type="button"
                onClick={() => setState(toggleBingoTile(tile.id))}
                className={`group rounded-[1.5rem] border p-4 text-left transition-all ${
                  done
                    ? "border-[var(--color-accent-dark)] bg-[color:rgba(191,90,54,0.08)] shadow-[0_18px_55px_rgba(52,36,24,0.10)]"
                    : "border-black/10 bg-white/75 hover:-translate-y-[1px] hover:shadow-[0_18px_55px_rgba(52,36,24,0.10)]"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">
                  {tile.kind === "challenge" ? "Bonus challenge" : "Event stamp"}
                </p>
                <p className="mt-3 text-lg font-semibold leading-7">{tile.title}</p>
                <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.68)]">{tile.description}</p>
                <div className="mt-4 inline-flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] ${
                      done ? "bg-[var(--color-accent-dark)] text-white" : "bg-black/5 text-black/70"
                    }`}
                  >
                    {done ? "Stamped" : "Stamp it"}
                  </span>
                  <span className="text-xs text-[color:rgba(37,34,30,0.55)]">{tile.points} pts</span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

