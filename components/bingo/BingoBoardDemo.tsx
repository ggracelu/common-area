"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { demoData, getDemoBusiness, getDemoEvent } from "@/lib/demo-data";
import {
  getBingoProgress,
  loadDemoState,
  mailPostcardForMatching,
  setDepositStatus,
  toggleBingoTile,
  toggleSelectedEvent,
} from "@/lib/demo-state";

type OpenTile = { tileId: string } | null;

function formatDateTime(startsAtISO: string, durationMinutes: number) {
  const start = new Date(startsAtISO);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const dateFmt = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
  const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
  return `${dateFmt.format(start)} • ${timeFmt.format(start)}–${timeFmt.format(end)}`;
}

function tileColor(idx: number) {
  const colors = [
    "bg-[color:rgba(233,255,107,0.85)]",
    "bg-[color:rgba(26,92,255,0.18)]",
    "bg-[color:rgba(255,47,184,0.16)]",
    "bg-[color:rgba(255,184,0,0.22)]",
    "bg-[color:rgba(191,90,54,0.18)]",
    "bg-[color:rgba(191,212,223,0.55)]",
    "bg-[color:rgba(103,114,85,0.18)]",
    "bg-[color:rgba(232,194,184,0.42)]",
    "bg-[color:rgba(255,59,46,0.12)]",
  ];
  return colors[idx % colors.length]!;
}

export function BingoBoardDemo() {
  const [state, setState] = useState(() => loadDemoState());
  const [open, setOpen] = useState<OpenTile>(null);
  const tiles = demoData.bingoTiles;
  const progress = useMemo(() => getBingoProgress(tiles, state), [state, tiles]);

  const required = demoData.season.requiredEventCount;
  const selectedCount = state.selectedEventIds.length;
  const canSelectMore = selectedCount < required;
  const readyToMail = state.depositStatus === "paid" && selectedCount >= required;

  const openTile = open ? tiles.find((t) => t.id === open.tileId) ?? null : null;
  const openEvent = openTile?.eventId ? getDemoEvent(openTile.eventId) : null;
  const openBusiness = openEvent ? getDemoBusiness(openEvent.businessId) : null;

  return (
    <div className="grid gap-6">
      <Card variant="scrapbook" className="relative overflow-hidden">
        <div className="relative z-10">
          <Badge variant="butter">Bingo card</Badge>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Select any {required} experiences.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[color:rgba(37,34,30,0.74)]">
            Your $20 deposit becomes <span className="font-semibold">$5 discounts</span> off each event you complete.
            You’ll be matched with a cohort based on shared interests — aka the experiences you pick in common.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.6rem] bg-white/80 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-black/60">Selected</p>
              <p className="mt-3 text-2xl font-semibold">
                {selectedCount} / {required}
              </p>
              <p className="mt-2 text-sm text-black/60">Pick {required} experiences to join the cohort.</p>
            </div>
            <div className="rounded-[1.6rem] bg-white/80 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-black/60">Deposit</p>
              <p className="mt-3 text-2xl font-semibold">{state.depositStatus === "paid" ? "Paid" : "$20"}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={state.depositStatus === "paid" ? "secondary" : "primary"}
                  onClick={() => setState(setDepositStatus("paid"))}
                >
                  Mark paid (demo)
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setState(setDepositStatus("pending"))}>
                  Pending
                </Button>
              </div>
            </div>
            <div className="rounded-[1.6rem] bg-white/80 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-black/60">Bonus stamps</p>
              <p className="mt-3 text-2xl font-semibold">{progress.completed}</p>
              <p className="mt-2 text-sm text-black/60">Complete challenges for extra points.</p>
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="primary"
                  disabled={!readyToMail}
                  onClick={() => setState(mailPostcardForMatching())}
                >
                  Send to matching
                </Button>
              </div>
            </div>
          </div>
          <Sticker className="mt-7">Click a square. It pops open like a real scrapbooking disaster.</Sticker>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(233,255,107,0.45),transparent_62%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -bottom-28 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,47,184,0.20),transparent_62%)]"
        />
      </Card>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 rounded-[2.4rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.55),rgba(247,240,228,0.55))]" />
        <div className="relative rounded-[2.4rem] border border-black/10 bg-[color:rgba(255,255,255,0.70)] p-5 shadow-[0_28px_95px_rgba(52,36,24,0.10)] sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/60" style={{ fontFamily: "var(--font-mono)" }}>
              Construction-paper bingo
            </p>
            <span className="rounded-full bg-black/5 px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.22em] text-black/70">
              {selectedCount}/{required} selected
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {tiles.map((tile, idx) => {
              const stamped = state.bingo.completedTileIds.includes(tile.id);
              const selected = tile.eventId ? state.selectedEventIds.includes(tile.eventId) : false;
              const disabledSelect = tile.kind === "event" && tile.eventId && !selected && !canSelectMore;

              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => setOpen({ tileId: tile.id })}
                  className={[
                    "group relative overflow-hidden rounded-[1.6rem] border border-black/12 p-5 text-left shadow-[0_18px_55px_rgba(52,36,24,0.10)] transition-transform",
                    "hover:-translate-y-[2px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]",
                    tileColor(idx),
                    "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.55),transparent_55%)] before:content-['']",
                    disabledSelect ? "opacity-70" : "",
                  ].join(" ")}
                >
                  <div className="relative z-10">
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-black/70">
                      {tile.kind === "event" ? "Experience" : "Bonus"} • {tile.points} pts
                    </p>
                    <p className="mt-3 text-lg font-black leading-7 text-black">{tile.title}</p>
                    <p className="mt-2 text-sm leading-6 text-black/70">{tile.description}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-black/10 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] text-black/80">
                        {tile.stampLabel}
                      </span>
                      {selected ? (
                        <span className="rounded-full bg-black px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] text-white">
                          Selected
                        </span>
                      ) : null}
                      {stamped ? (
                        <span className="rounded-full bg-white/80 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] text-black">
                          Stamped
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {stamped ? (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-4 -rotate-12 rounded-[0.9rem] border border-black/60 bg-white/85 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] text-black shadow-[0_12px_30px_rgba(52,36,24,0.12)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      OK
                    </span>
                  ) : null}

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.55),transparent_60%)] transition-transform group-hover:scale-110"
                  />
                </button>
              );
            })}
          </div>

          <style>{`
            @media (prefers-reduced-motion: reduce) {
              .group { transition: none !important; }
              .group:hover { transform: none !important; }
            }
          `}</style>
        </div>
      </div>

      {openTile ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close tile details"
            onClick={() => setOpen(null)}
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          />
          <div className="absolute left-1/2 top-1/2 w-[min(92vw,46rem)] -translate-x-1/2 -translate-y-1/2 p-3">
            <div className="relative overflow-hidden rounded-[2rem] border border-black/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(247,240,228,0.92))] p-6 shadow-[0_28px_95px_rgba(0,0,0,0.22)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant={openTile.kind === "event" ? "butter" : "sky"}>
                    {openTile.kind === "event" ? "Experience" : "Bonus challenge"}
                  </Badge>
                  <h3 className="mt-4 text-3xl font-black tracking-tight">{openTile.title}</h3>
                  <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.74)]">{openTile.description}</p>
                </div>
                <Button variant="ghost" onClick={() => setOpen(null)}>
                  Close
                </Button>
              </div>

              {openEvent ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
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

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {openTile.kind === "event" && openTile.eventId ? (
                  <Button
                    variant={state.selectedEventIds.includes(openTile.eventId) ? "secondary" : "primary"}
                    disabled={!state.selectedEventIds.includes(openTile.eventId) && !canSelectMore}
                    onClick={() => {
                      const next = toggleSelectedEvent(openTile.eventId!, required);
                      setState(next);
                    }}
                  >
                    {state.selectedEventIds.includes(openTile.eventId) ? "Remove from my 4" : "Select (counts toward 4)"}
                  </Button>
                ) : null}
                <Button
                  variant={state.bingo.completedTileIds.includes(openTile.id) ? "secondary" : "sticker"}
                  onClick={() => setState(toggleBingoTile(openTile.id))}
                >
                  {state.bingo.completedTileIds.includes(openTile.id) ? "Unstamp" : "Stamp this square"}
                </Button>
                <Button href="/cohort" variant="ghost">
                  Go to cohort
                </Button>
              </div>

              {!state.selectedEventIds.includes(openTile.eventId ?? "") && !canSelectMore && openTile.kind === "event" ? (
                <p className="mt-4 text-sm text-black/60">You already selected {required}. Remove one to add another.</p>
              ) : null}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(26,92,255,0.20),transparent_62%)]"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

