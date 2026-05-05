"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { DemoBusiness, DemoEvent } from "@/lib/demo-data";

type EventDetailDrawerProps = {
  open: boolean;
  event: DemoEvent | null;
  business: DemoBusiness | null;
  onClose: () => void;
  onToggleSelect: () => void;
  selected: boolean;
  canSelectMore: boolean;
};

function formatDateTime(startsAtISO: string, durationMinutes: number) {
  const start = new Date(startsAtISO);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const dateFmt = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" });
  const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
  return `${dateFmt.format(start)} • ${timeFmt.format(start)}–${timeFmt.format(end)}`;
}

export function EventDetailDrawer({
  open,
  event,
  business,
  onClose,
  onToggleSelect,
  selected,
  canSelectMore,
}: EventDetailDrawerProps) {
  if (!open || !event) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close event details"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl p-4 sm:p-6">
        <Card variant="scrapbook" className="h-full overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant={event.isBonusChallengeEvent ? "sky" : "butter"}>
                {event.isBonusChallengeEvent ? "Bonus" : "Counts toward 4"}
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">{event.title}</h2>
              <p className="mt-3 text-sm font-medium text-[color:rgba(37,34,30,0.68)]">
                Hosted by <span className="font-semibold">{business?.name ?? event.neighborhood}</span>
              </p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>

          {event.imageUrl ? (
            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-black/10 bg-white/80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.imageUrl}
                alt={`Photo representing ${event.title}`}
                className="h-56 w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">When</p>
              <p className="mt-2 text-sm font-semibold">{formatDateTime(event.startsAtISO, event.durationMinutes)}</p>
            </div>
            <div className="rounded-[1.25rem] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Where</p>
              <p className="mt-2 text-sm font-semibold">{event.neighborhood}</p>
              <p className="mt-1 text-sm text-[color:rgba(37,34,30,0.68)]">{event.address}</p>
            </div>
            <div className="rounded-[1.25rem] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Cost</p>
              <p className="mt-2 text-sm font-semibold">{event.cost}</p>
              <p className="mt-1 text-xs text-[color:rgba(37,34,30,0.62)]">Capacity {event.capacity}</p>
            </div>
            <div className="rounded-[1.25rem] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:rgba(37,34,30,0.65)]">Why it works socially</p>
              <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.72)]">
                {event.activityType === "walking-tour"
                  ? "Walking gives you a conversation buffer. You can look at things while you talk."
                  : event.activityType === "board-games"
                    ? "Games make it normal to laugh with strangers without needing a perfect opener."
                    : event.activityType === "pottery" || event.activityType === "flowers-craft"
                      ? "Hands busy = less pressure. The room does some of the social work."
                      : "Shared attention makes conversation easier than a blank table."}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-black/10 bg-white/75 p-5">
            <p className="text-base leading-7 text-[color:rgba(37,34,30,0.74)]">{event.description}</p>
            <p className="mt-3 text-sm text-[color:rgba(37,34,30,0.62)]">{event.vibe}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {event.vibeTags.slice(0, 6).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[0.72rem] font-semibold text-black/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              variant={selected ? "secondary" : "primary"}
              disabled={!selected && !canSelectMore && event.countsTowardCohortEvents}
              onClick={onToggleSelect}
            >
              {event.countsTowardCohortEvents
                ? selected
                  ? "Remove from my 4"
                  : "Add to my 4"
                : selected
                  ? "Unpin"
                  : "Pin (bonus)"}
            </Button>
            <Button variant="ghost" href="/bingo">
              Open bingo
            </Button>
          </div>
          {!selected && !canSelectMore && event.countsTowardCohortEvents ? (
            <p className="mt-3 text-sm text-[color:rgba(37,34,30,0.62)]">
              You already picked four cohort events. Remove one to add another.
            </p>
          ) : null}
        </Card>
      </div>
    </div>
  );
}

