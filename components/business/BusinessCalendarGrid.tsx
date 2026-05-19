"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  buildMonthGrid,
  businessCalendarEvents,
  businessCalendarMonthKeys,
  eventsForMonth,
  formatBusinessCalendarMonth,
  type BusinessCalendarEvent,
} from "@/lib/business-dashboard-demo";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function cellPaperColor(index: number) {
  const colors = [
    "bg-[color:rgba(233,255,107,0.90)]",
    "bg-[color:rgba(255,184,0,0.32)]",
    "bg-[color:rgba(26,92,255,0.20)]",
    "bg-[color:rgba(255,47,184,0.18)]",
    "bg-[color:rgba(191,90,54,0.20)]",
    "bg-[color:rgba(191,212,223,0.65)]",
  ];
  return colors[index % colors.length]!;
}

type BusinessCalendarGridProps = {
  events?: BusinessCalendarEvent[];
  initialMonthKey?: string;
};

export function BusinessCalendarGrid({
  events = businessCalendarEvents,
  initialMonthKey = "2026-05",
}: BusinessCalendarGridProps) {
  const [monthKey, setMonthKey] = useState(initialMonthKey);
  const [openEventId, setOpenEventId] = useState<string | null>(null);

  const monthEvents = useMemo(() => eventsForMonth(monthKey, events), [monthKey, events]);
  const eventsByDay = useMemo(() => {
    const map = new Map<number, BusinessCalendarEvent>();
    for (const event of monthEvents) {
      map.set(event.day, event);
    }
    return map;
  }, [monthEvents]);

  const grid = useMemo(() => buildMonthGrid(monthKey), [monthKey]);
  const openEvent = openEventId ? events.find((event) => event.id === openEventId) ?? null : null;

  const monthIndex = businessCalendarMonthKeys.indexOf(monthKey as (typeof businessCalendarMonthKeys)[number]);
  const canGoPrev = monthIndex > 0;
  const canGoNext = monthIndex >= 0 && monthIndex < businessCalendarMonthKeys.length - 1;

  return (
    <>
      <div
        className="rounded-[2rem] border border-black/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(247,240,228,0.92))] p-4 shadow-[0_18px_55px_rgba(52,36,24,0.12)] md:p-6"
        data-testid="business-calendar-grid"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/60">Season calendar</p>
            <h3 className="mt-1 text-xl font-black text-black">{formatBusinessCalendarMonth(monthKey)}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!canGoPrev}
              onClick={() => {
                if (canGoPrev) setMonthKey(businessCalendarMonthKeys[monthIndex - 1]!);
              }}
              data-testid="business-calendar-prev-month"
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!canGoNext}
              onClick={() => {
                if (canGoNext) setMonthKey(businessCalendarMonthKeys[monthIndex + 1]!);
              }}
              data-testid="business-calendar-next-month"
            >
              Next
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {WEEKDAY_LABELS.map((label) => (
            <p
              key={label}
              className="py-1 text-center text-[0.62rem] font-black uppercase tracking-[0.18em] text-black/50"
            >
              {label}
            </p>
          ))}

          {grid.map((day, index) => {
            if (day === null) {
              return (
                <div
                  key={`pad-${index}`}
                  aria-hidden="true"
                  className="aspect-square rounded-[1rem] border border-dashed border-black/8 bg-black/[0.03]"
                />
              );
            }

            const event = eventsByDay.get(day);
            if (!event) {
              return (
                <div
                  key={`empty-${monthKey}-${day}`}
                  className="relative aspect-square overflow-hidden rounded-[1rem] border border-black/8 bg-white/50 p-2"
                >
                  <span className="text-[0.7rem] font-black text-black/35">{day}</span>
                </div>
              );
            }

            const isPast = event.timing === "past";
            const paperClass = cellPaperColor(index);

            return (
              <button
                key={event.id}
                type="button"
                data-testid={`business-calendar-cell-${event.id}`}
                onClick={() => setOpenEventId(event.id)}
                className={[
                  "group relative aspect-square overflow-hidden rounded-[1.25rem] border border-black/12 p-2 text-left shadow-[0_14px_38px_rgba(52,36,24,0.12)]",
                  "transition-transform hover:-translate-y-[2px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]",
                  paperClass,
                  "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.55),transparent_58%)] before:content-['']",
                  isPast ? "opacity-80 saturate-[0.85]" : "",
                ].join(" ")}
                style={{ ["--v16-accent" as never]: event.accent }}
              >
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <span className="text-[0.65rem] font-black text-black/55">{day}</span>
                  <div>
                    <p className="text-[0.58rem] font-black uppercase tracking-[0.14em] text-black/60">
                      {isPast ? "Past" : "Up next"}
                    </p>
                    <p className="mt-1 line-clamp-3 text-[0.72rem] font-black leading-tight text-black">
                      {event.shortTitle}
                    </p>
                  </div>
                </div>
                {isPast ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-1.5 top-1.5 -rotate-12 rounded-[0.65rem] border border-black/50 bg-white/85 px-1.5 py-0.5 text-[0.55rem] font-black uppercase tracking-[0.14em] text-black"
                  >
                    Done
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-center text-xs text-black/55">Tap a colorful night to open details.</p>
      </div>

      {openEvent ? (
        <div className="fixed inset-0 z-50" data-testid="business-calendar-event-dialog">
          <button
            type="button"
            aria-label="Close event details"
            onClick={() => setOpenEventId(null)}
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
          />
          <div
            className="absolute left-1/2 top-1/2 w-[min(92vw,40rem)] -translate-x-1/2 -translate-y-1/2 p-3"
            role="dialog"
            aria-modal="true"
            aria-labelledby="business-calendar-event-title"
          >
            <div
              className="relative overflow-hidden rounded-[2rem] border border-black/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(247,240,228,0.94))] p-6 shadow-[0_28px_95px_rgba(0,0,0,0.22)]"
              style={{ ["--v16-accent" as never]: openEvent.accent }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant={openEvent.timing === "past" ? "neutral" : "butter"}>
                    {openEvent.timing === "past" ? "Past night" : "Upcoming"}
                  </Badge>
                  <h3
                    id="business-calendar-event-title"
                    className="mt-4 text-2xl font-black tracking-tight text-black md:text-3xl"
                  >
                    {openEvent.title}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-black/70">
                    {openEvent.dateLabel} · {openEvent.timeLabel}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setOpenEventId(null)}
                  data-testid="business-calendar-event-close"
                >
                  Close
                </Button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-black/10 bg-white/80 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-black/60">Cohort</p>
                  <p className="mt-2 text-base font-semibold text-black">{openEvent.cohortName}</p>
                  <p className="mt-1 text-sm text-black/60">{openEvent.neighborhood}</p>
                </div>
                <div className="rounded-[1.5rem] border border-black/10 bg-white/80 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-black/60">Guests</p>
                  <p className="mt-2 text-base font-semibold text-black">
                    {openEvent.guests}/{openEvent.capacity}
                  </p>
                  <p className="mt-1 text-sm text-black/60">{openEvent.status}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="v16-pill">{openEvent.format}</span>
                <span className="v16-pill">{openEvent.status}</span>
              </div>

              <p className="v16-small mt-4">
                Sample preview night — calendar data is illustrative until live cohort scheduling ships.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .group { transition: none !important; }
          .group:hover { transform: none !important; }
        }
      `}</style>
    </>
  );
}
