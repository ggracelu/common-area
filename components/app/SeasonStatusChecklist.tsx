"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { SeasonChecklist } from "@/lib/season-checklist";
import type { DemoDepositStatus } from "@/lib/demo-state";

type SeasonStatusChecklistProps = {
  checklist: SeasonChecklist;
  depositStatus: DemoDepositStatus;
  isSignedIn: boolean;
};

function CheckIcon({ done }: { done: boolean }) {
  return (
    <span
      className={[
        "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[0.65rem] font-black",
        done
          ? "border-[#172018] bg-[#e9ff6b] text-[#172018]"
          : "border-black/20 bg-white/80 text-transparent",
      ].join(" ")}
      aria-hidden
    >
      ✓
    </span>
  );
}

export function SeasonStatusChecklist({ checklist, depositStatus, isSignedIn }: SeasonStatusChecklistProps) {
  const progressPct =
    checklist.totalCount > 0 ? Math.round((checklist.completedCount / checklist.totalCount) * 100) : 0;

  return (
    <Card variant="paper" className="h-full" data-testid="profile-season-status">
      <Badge variant="butter">Season status</Badge>
      <h2 className="mt-4 text-xl font-semibold tracking-tight">{checklist.seasonTitle}</h2>
      <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.62)]">
        {isSignedIn
          ? "Your checklist for this Chicago season."
          : "Sign in to save progress across devices when Supabase is configured."}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-[1.25rem] border border-black/10 bg-white/85 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/55">Progress</p>
          <p className="mt-1 text-lg font-black text-black">
            {checklist.completedCount}/{checklist.totalCount} tasks
          </p>
        </div>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-black/12 bg-[color:rgba(233,255,107,0.35)] text-sm font-black"
          aria-label={`${progressPct} percent complete`}
        >
          {progressPct}%
        </div>
      </div>

      <p className="mt-3 text-xs text-black/55">
        Deposit: <span className="font-semibold text-black/75">{depositStatus.replace("_", " ")}</span>
      </p>

      <ul className="mt-6 space-y-3" data-testid="profile-season-checklist">
        {checklist.items.map((item) => (
          <li key={item.id}>
            <div
              className={[
                "flex gap-3 rounded-[1.15rem] border px-3 py-3",
                item.done ? "border-black/8 bg-[color:rgba(233,255,107,0.2)]" : "border-black/10 bg-white/70",
              ].join(" ")}
            >
              <CheckIcon done={item.done} />
              <div className="min-w-0 flex-1">
                {item.href && !item.done ? (
                  <Link
                    href={item.href}
                    className="text-sm font-semibold text-black underline-offset-2 hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <p className="text-sm font-semibold text-black">{item.label}</p>
                )}
                {item.detail ? (
                  <p className="mt-1 text-xs leading-5 text-[color:rgba(37,34,30,0.62)]">{item.detail}</p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
