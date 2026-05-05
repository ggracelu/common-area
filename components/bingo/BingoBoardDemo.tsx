"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Polaroid } from "@/components/ui/Polaroid";
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

export function BingoBoardDemo() {
  const [state, setState] = useState(() => loadDemoState());
  const [open, setOpen] = useState<OpenTile>(null);
  const [lastBonusStamp, setLastBonusStamp] = useState<{ tileId: string; at: number } | null>(null);
  const tiles = demoData.bingoTiles;
  useMemo(() => getBingoProgress(tiles, state), [state, tiles]);

  const required = demoData.season.requiredEventCount;
  const selectedCount = state.selectedEventIds.length;
  const canSelectMore = selectedCount < required;
  const readyToMail = state.depositStatus === "paid" && selectedCount >= required;

  const openTile = open ? tiles.find((t) => t.id === open.tileId) ?? null : null;
  const openEvent = openTile?.eventId ? getDemoEvent(openTile.eventId) : null;
  const openBusiness = openEvent ? getDemoBusiness(openEvent.businessId) : null;

  function stampTile(tileId: string, kind: (typeof tiles)[number]["kind"]) {
    const wasStamped = state.bingo.completedTileIds.includes(tileId);
    const next = toggleBingoTile(tileId);
    setState(next);
    if (!wasStamped && kind === "challenge") {
      setLastBonusStamp({ tileId, at: Date.now() });
    }
  }

  return (
    <div className="mx-auto grid max-w-[980px] gap-4">
      <div className="mx-auto w-full max-w-[760px] text-center">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-black/55" style={{ fontFamily: "var(--font-mono)" }}>
          Summer 2026 bingo card
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-black sm:text-3xl">
          Select any {required} experiences.
        </h2>
        <p className="mt-2 text-sm leading-6 text-[color:rgba(37,34,30,0.72)]">
          $20 deposit → <span className="font-semibold">$5 discounts</span> off each event you complete. We match cohorts based on shared picks.
        </p>
      </div>

      <div className="mx-auto w-full max-w-[760px]">
        <div className="relative mx-auto">
          {/* Sticker-ish decorations */}
          <div aria-hidden="true" className="pointer-events-none absolute -left-4 -top-5 hidden sm:block">
            <div className="scrap-sticker scrap-sticker-a">BONUS</div>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -right-6 -bottom-6 hidden sm:block">
            <div className="scrap-sticker scrap-sticker-b">SHOW UP</div>
          </div>

          {/* Craft board */}
          <div
            className={[
              "relative mx-auto overflow-hidden rounded-[2.2rem] border border-black/12 p-4 shadow-[0_28px_95px_rgba(52,36,24,0.14)]",
              "bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(247,240,228,0.78))]",
              "scrap-torn",
              "before:absolute before:inset-0 before:bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.02),rgba(0,0,0,0.02)_1px,transparent_1px,transparent_6px)] before:opacity-40 before:content-['']",
            ].join(" ")}
          >
            {/* Tape corners */}
            <div aria-hidden="true" className="scrap-tape scrap-tape-tl" />
            <div aria-hidden="true" className="scrap-tape scrap-tape-tr" />
            <div aria-hidden="true" className="scrap-tape scrap-tape-bl" />
            <div aria-hidden="true" className="scrap-tape scrap-tape-br" />

            <div className="relative z-10 flex items-center justify-between gap-2 px-1 pb-3">
              <span className="rounded-full bg-black/5 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] text-black/70">
                {selectedCount}/{required} selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={state.depositStatus === "paid" ? "secondary" : "sticker"}
                  onClick={() => setState(setDepositStatus(state.depositStatus === "paid" ? "pending" : "paid"))}
                >
                  {state.depositStatus === "paid" ? "Deposit: paid" : "Deposit: mark paid (demo)"}
                </Button>
              </div>
            </div>

            {/* 5x5 grid */}
            <div className="relative z-10 grid grid-cols-5 gap-2">
              {tiles.map((tile, idx) => {
                const isFree = tile.kind === "free";
                const isBonus = tile.kind === "challenge";
                const isEvent = tile.kind === "event";
                const stamped = state.bingo.completedTileIds.includes(tile.id);
                const bonusJustStamped =
                  Boolean(lastBonusStamp) &&
                  lastBonusStamp!.tileId === tile.id &&
                  Date.now() - lastBonusStamp!.at < 1400;
                const selected = tile.eventId ? state.selectedEventIds.includes(tile.eventId) : false;
                const disabledSelect = isEvent && tile.eventId && !selected && !canSelectMore;
                const isCenter = idx === 12 && isFree;

                const paperClass = isBonus
                  ? "bg-[color:rgba(40,40,40,0.10)]"
                  : isFree
                    ? "bg-[color:rgba(255,255,255,0.82)]"
                    : eventPaperColor(idx);

                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => setOpen({ tileId: tile.id })}
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
                          <span className="rounded-full bg-black/10 px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.22em] text-black/75">
                            {tile.stampLabel}
                          </span>
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
              }

              /* Torn paper edge */
              .scrap-torn{
                clip-path: polygon(
                  0% 6%,
                  4% 3%,
                  10% 5%,
                  16% 2%,
                  22% 5%,
                  28% 3%,
                  34% 5%,
                  40% 2%,
                  46% 4%,
                  52% 2%,
                  58% 5%,
                  64% 3%,
                  70% 5%,
                  76% 2%,
                  82% 5%,
                  88% 3%,
                  94% 5%,
                  100% 2%,
                  100% 100%,
                  94% 97%,
                  88% 99%,
                  82% 96%,
                  76% 99%,
                  70% 96%,
                  64% 99%,
                  58% 96%,
                  52% 99%,
                  46% 96%,
                  40% 99%,
                  34% 96%,
                  28% 99%,
                  22% 96%,
                  16% 99%,
                  10% 96%,
                  4% 99%,
                  0% 96%
                );
                box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06);
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
            `}</style>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[760px] justify-center pt-1">
        <Button
          variant="primary"
          disabled={!readyToMail}
          onClick={() => setState(mailPostcardForMatching())}
        >
          Ready to submit
        </Button>
      </div>

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
                <Button variant="ghost" onClick={() => setOpen(null)}>
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
                  disabled={openTile.kind === "free"}
                  onClick={() => stampTile(openTile.id, openTile.kind)}
                >
                  {openTile.kind === "free"
                    ? "Free space"
                    : state.bingo.completedTileIds.includes(openTile.id)
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
                        Tap this square in the card to select an experience, or stamp a bonus challenge for extra cred.
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

