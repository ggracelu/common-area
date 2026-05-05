"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { EventDetailDrawer } from "@/components/season/EventDetailDrawer";
import { demoData, getDemoBusiness, getDemoEvent } from "@/lib/demo-data";
import {
  loadDemoState,
  mailPostcardForMatching,
  setDepositStatus,
  tickMatchingForward,
  toggleSelectedEvent,
} from "@/lib/demo-state";

function formatTinyWhen(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", weekday: "short" }).format(d);
}

export function SeasonSelectDemo() {
  const [state, setState] = useState(() => loadDemoState());
  const [openEventId, setOpenEventId] = useState<string | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const next = tickMatchingForward();
      setState(next);
    }, 750);
    return () => window.clearInterval(interval);
  }, []);

  const events = demoData.events.slice().sort((a, b) => new Date(a.startsAtISO).getTime() - new Date(b.startsAtISO).getTime());
  const cohortEvents = events.filter((evt) => evt.countsTowardCohortEvents);
  const bonusEvents = events.filter((evt) => !evt.countsTowardCohortEvents);

  const limit = demoData.season.requiredEventCount;
  const canSelectMore = state.selectedEventIds.length < limit;
  const readyToMail = state.depositStatus === "paid" && state.selectedEventIds.length >= limit;

  const selected = useMemo(
    () => state.selectedEventIds.map((id) => getDemoEvent(id)).filter(Boolean),
    [state.selectedEventIds],
  );

  const openEvent = openEventId ? getDemoEvent(openEventId) : null;
  const openBusiness = openEvent ? getDemoBusiness(openEvent.businessId) : null;
  const openSelected = Boolean(openEventId && state.selectedEventIds.includes(openEventId));

  return (
    <div className="grid gap-6">
      <Card variant="scrapbook">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="butter">Pick your 4</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">Choose four cohort events for the season.</h2>
            <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
              These are the plans we match cohorts on. Bonus events are optional side quests.
            </p>
          </div>
          <Sticker>Hands busy helps.</Sticker>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Deposit</p>
            <p className="mt-3 text-2xl font-semibold">{state.depositStatus === "paid" ? "Paid" : "Not paid"}</p>
            <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.66)]">
              Demo toggle only. Real Stripe/webhook flow is not implemented.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant={state.depositStatus === "paid" ? "secondary" : "primary"} onClick={() => setState(setDepositStatus("paid"))}>
                Mark paid (demo)
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setState(setDepositStatus("pending"))}>
                Set pending
              </Button>
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Selected</p>
            <p className="mt-3 text-2xl font-semibold">
              {state.selectedEventIds.length} / {limit}
            </p>
            <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.66)]">We’ll aim for 2+ overlaps in your cohort.</p>
            <div className="mt-4">
              <Button
                size="sm"
                variant="primary"
                disabled={!readyToMail}
                onClick={() => setState(mailPostcardForMatching())}
              >
                Send postcard to matching
              </Button>
            </div>
            {!readyToMail ? (
              <p className="mt-3 text-xs text-[color:rgba(37,34,30,0.62)]">
                To mail it: mark deposit paid + pick four.
              </p>
            ) : null}
          </div>
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Matching status</p>
            <p className="mt-3 text-2xl font-semibold">
              {state.matching.status === "assigned"
                ? "Assigned"
                : state.matching.status === "pending"
                  ? "Sorting mail"
                  : state.matching.status === "mailing"
                    ? "Postcard sent"
                    : "Not started"}
            </p>
            <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.66)]">
              Matching happens after signups close (demo simulates a short delay).
            </p>
            <div className="mt-4">
              <Button href="/cohort" size="sm" variant="secondary">
                Go to cohort
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6">
          <Card variant="paper">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge variant="neutral">Cohort events</Badge>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">Your 4 picks (out of {cohortEvents.length})</h3>
                <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
                  Click an event to open details. Select up to four.
                </p>
              </div>
              <Sticker>Pick what you’d attend.</Sticker>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {cohortEvents.map((evt) => {
                const isSelected = state.selectedEventIds.includes(evt.id);
                return (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => setOpenEventId(evt.id)}
                    className={`group rounded-[1.5rem] border p-5 text-left transition-all ${
                      isSelected
                        ? "border-[var(--color-accent-dark)] bg-[color:rgba(191,90,54,0.08)] shadow-[0_18px_55px_rgba(52,36,24,0.10)]"
                        : "border-black/10 bg-white/75 hover:-translate-y-[1px] hover:shadow-[0_18px_55px_rgba(52,36,24,0.10)]"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                      {evt.neighborhood} • {formatTinyWhen(evt.startsAtISO)}
                    </p>
                    <p className="mt-3 text-xl font-semibold leading-7">{evt.title}</p>
                    <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.68)]">{evt.vibe}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] ${
                          isSelected ? "bg-[var(--color-accent-dark)] text-white" : "bg-black/5 text-black/70"
                        }`}
                      >
                        {isSelected ? "Selected" : "Open details"}
                      </span>
                      <span className="text-xs text-[color:rgba(37,34,30,0.55)]">{evt.cost}</span>
                      <span className="text-xs text-[color:rgba(37,34,30,0.55)]">Capacity {evt.capacity}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card variant="paper">
            <Badge variant="sky">Bonus side quests</Badge>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">Optional extras (don’t count toward your 4)</h3>
            <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
              These are for fun, not matching. Pin them if you want.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {bonusEvents.map((evt) => (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() => setOpenEventId(evt.id)}
                  className="rounded-[1.5rem] border border-black/10 bg-white/70 p-5 text-left transition-all hover:-translate-y-[1px] hover:shadow-[0_18px_55px_rgba(52,36,24,0.10)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">
                    Bonus • {formatTinyWhen(evt.startsAtISO)}
                  </p>
                  <p className="mt-3 text-xl font-semibold leading-7">{evt.title}</p>
                  <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.68)]">{evt.vibe}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <Card variant="scrapbook" className="h-fit">
          <Badge variant="rust">Your tray</Badge>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight">Selected events</h3>
          <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
            {selected.length === 0 ? "Pick events that feel doable. You can edit later." : "This is what you’re committing to show up for."}
          </p>
          <div className="mt-6 grid gap-3">
            {selected.length === 0 ? (
              <div className="rounded-[1.25rem] border border-dashed border-black/15 bg-white/60 p-5 text-sm text-[color:rgba(37,34,30,0.68)]">
                Nothing selected yet. Crumbs is neutral but slightly judgmental (affectionate).
              </div>
            ) : (
              selected.map((evt) => (
                <div key={evt!.id} className="rounded-[1.25rem] border border-black/10 bg-white/75 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                    {evt!.neighborhood} • {formatTinyWhen(evt!.startsAtISO)}
                  </p>
                  <p className="mt-2 text-base font-semibold">{evt!.title}</p>
                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const next = toggleSelectedEvent(evt!.id, limit);
                        setState(next);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <Sticker className="mt-6">The point is repeatable.</Sticker>
        </Card>
      </section>

      <EventDetailDrawer
        open={Boolean(openEvent)}
        event={openEvent}
        business={openBusiness}
        onClose={() => setOpenEventId(null)}
        selected={openSelected}
        canSelectMore={canSelectMore}
        onToggleSelect={() => {
          if (!openEvent) return;
          const next = toggleSelectedEvent(openEvent.id, limit);
          setState(next);
        }}
      />
    </div>
  );
}

