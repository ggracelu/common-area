"use client";

import { Crumbs } from "@/components/brand/Crumbs";
import { Sticker } from "@/components/ui/Sticker";

const DEFAULT_LINES = [
  "Crumbs saved you a spot.",
  "Showing up counts.",
  "Your couch will forgive you.",
  "You can leave after an hour.",
  "Community is mostly knowing where the snacks are.",
  "Crumbs is sorting the match pile. Slowly. With authority.",
];

export function CrumbsNote({
  title = "Crumbs note",
  lines = DEFAULT_LINES,
  pose = "sit",
}: {
  title?: string;
  lines?: string[];
  pose?: Parameters<typeof Crumbs>[0]["pose"];
}) {
  const idx = Math.abs(new Date().getDate()) % Math.max(1, lines.length);
  const line = lines[idx] ?? DEFAULT_LINES[0]!;

  return (
    <div className="flex flex-col gap-3 rounded-[1.8rem] border border-black/10 bg-white/65 p-5 shadow-[0_18px_55px_rgba(52,36,24,0.10)]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-black/55" style={{ fontFamily: "var(--font-mono)" }}>
          {title}
        </p>
        <Crumbs size="lg" pose={pose} expression="neutral" animated className="opacity-95" />
      </div>
      <p className="text-base font-medium leading-7 text-[color:rgba(37,34,30,0.78)]">{line}</p>
      <Sticker>Low pressure. Repeatable plans.</Sticker>
    </div>
  );
}

