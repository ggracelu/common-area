"use client";

import type { BingoLine } from "@/lib/bingo-win";

import "@/components/bingo/bingo-win.css";

type BingoWinLinesOverlayProps = {
  lines: BingoLine[];
};

export function BingoWinLinesOverlay({ lines }: BingoWinLinesOverlayProps) {
  if (lines.length === 0) return null;

  return (
    <svg
      className="bingo-win-lines pointer-events-none absolute inset-0 z-30 h-full w-full"
      viewBox="0 0 5 5"
      preserveAspectRatio="none"
      aria-hidden
      data-testid="bingo-win-lines"
    >
      {lines.map((line) => {
        const points = line.cells
          .map((index) => {
            const row = Math.floor(index / 5);
            const col = index % 5;
            return `${col + 0.5},${row + 0.5}`;
          })
          .join(" ");

        return (
          <polyline
            key={`${line.type}-${line.index}`}
            points={points}
            fill="none"
            pathLength={1}
            stroke="currentColor"
            strokeWidth="0.14"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="bingo-win-line-stroke text-[#1a5cff]"
          />
        );
      })}
    </svg>
  );
}
