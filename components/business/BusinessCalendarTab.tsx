import { Card } from "@/components/ui/Card";
import {
  businessCalendarEvents,
  pastBusinessEvents,
  upcomingBusinessEvents,
  type BusinessCalendarEvent,
} from "@/lib/business-dashboard-demo";

function EventList({ title, events }: { title: string; events: BusinessCalendarEvent[] }) {
  return (
    <section>
      <p className="v16-kicker">{title}</p>
      <div className="mt-4 grid gap-4">
        {events.map((event) => (
          <Card key={event.id} className="p-5" style={{ ["--v16-accent" as never]: event.accent }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                  {event.dateLabel} · {event.timeLabel}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-black">{event.title}</h3>
                <p className="v16-small mt-2">
                  {event.cohortName} · {event.neighborhood}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:max-w-xs md:justify-end">
                <span className="v16-pill">{event.format}</span>
                <span className="v16-pill">
                  {event.guests}/{event.capacity} guests
                </span>
                <span className="v16-pill">{event.status}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function BusinessCalendarTab() {
  const upcoming = upcomingBusinessEvents(businessCalendarEvents);
  const past = pastBusinessEvents(businessCalendarEvents);

  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <p className="v16-kicker">Calendar</p>
        <h2 className="v16-h2 mt-2">Past and upcoming cohort nights</h2>
        <p className="v16-small mt-3">
          Preview schedule for standing nights, crawls, and workshops hosted with Common Area cohorts.
        </p>
      </section>

      <EventList title="Upcoming" events={upcoming} />
      <EventList title="Past" events={past} />
    </div>
  );
}
