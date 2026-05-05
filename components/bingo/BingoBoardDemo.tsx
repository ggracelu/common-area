"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { demoData } from "@/lib/demo-data";
import { getBingoProgress, loadDemoState, toggleBingoTile } from "@/lib/demo-state";

function hasLine(completed: boolean[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return lines.some((line) => line.every((idx) => completed[idx]));
}

export function BingoBoardDemo() {
  const [state, setState] = useState(() => loadDemoState());
  const tiles = demoData.bingoTiles;
  const progress = useMemo(() => getBingoProgress(tiles, state), [state, tiles]);

  const completedFlags = tiles.map((tile) => state.bingo.completedTileIds.includes(tile.id));
  const gotLine = hasLine(completedFlags);
  const fullyStamped = progress.completed === progress.total;

  return (
    <div className="grid gap-6">
      <Card variant="scrapbook">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="butter">Bingo passport</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">Collect stamps. Become a regular.</h2>
            <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
              This is a demo board: event stamps + bonus challenges. Toggling a tile is local-only.
            </p>
          </div>
          <Sticker>Side quests help.</Sticker>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Stamped</p>
            <p className="mt-3 text-2xl font-semibold">
              {progress.completed} / {progress.total}
            </p>
            <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.66)]">Keep it small. Keep it repeatable.</p>
          </div>
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Points</p>
            <p className="mt-3 text-2xl font-semibold">{progress.points}</p>
            <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.66)]">Common room cred (fake but motivating).</p>
          </div>
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Badges</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] ${progress.completed > 0 ? "bg-[var(--color-accent-dark)] text-white" : "bg-black/5 text-black/70"}`}>
                First stamp
              </span>
              <span className={`rounded-full px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] ${gotLine ? "bg-[var(--color-accent-dark)] text-white" : "bg-black/5 text-black/70"}`}>
                Line
              </span>
              <span className={`rounded-full px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] ${fullyStamped ? "bg-[var(--color-accent-dark)] text-white" : "bg-black/5 text-black/70"}`}>
                Full card
              </span>
            </div>
            <p className="mt-3 text-xs text-[color:rgba(37,34,30,0.62)]">Demo-only badges. Real achievements will be persisted later.</p>
          </div>
        </div>
      </Card>

      <Card variant="paper">
        <Badge variant="neutral">3×3 card</Badge>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight">Stamp squares as you go.</h3>
        <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
          Click a square to stamp it. Completed squares get a “rubber stamp” moment.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {tiles.map((tile) => {
            const done = state.bingo.completedTileIds.includes(tile.id);
            return (
              <button
                key={tile.id}
                type="button"
                onClick={() => setState(toggleBingoTile(tile.id))}
                className={`relative rounded-[1.5rem] border p-5 text-left transition-all ${
                  done
                    ? "border-[var(--color-accent-dark)] bg-[color:rgba(191,90,54,0.10)] shadow-[0_18px_55px_rgba(52,36,24,0.10)]"
                    : "border-black/10 bg-white/75 hover:-translate-y-[1px] hover:shadow-[0_18px_55px_rgba(52,36,24,0.10)]"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">
                  {tile.kind === "event" ? "Event" : "Challenge"} • {tile.points} pts
                </p>
                <p className="mt-3 text-lg font-semibold leading-7">{tile.title}</p>
                <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.68)]">{tile.description}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-black/5 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] text-black/70">
                    {tile.stampLabel}
                  </span>
                  {done ? (
                    <span className="rounded-full bg-[var(--color-accent-dark)] px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] text-white">
                      Stamped
                    </span>
                  ) : null}
                </div>
                {done ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-4 -rotate-12 rounded-[0.9rem] border border-[var(--color-accent-dark)] bg-white/80 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em] text-[var(--color-accent-dark)] shadow-[0_12px_30px_rgba(52,36,24,0.12)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    OK
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/dashboard" variant="secondary">
            Back to dashboard
          </Button>
          <Button href="/cohort/chat" variant="ghost">
            Say hi in chat
          </Button>
        </div>
      </Card>
    </div>
  );
}

