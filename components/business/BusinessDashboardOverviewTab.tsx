import { Card } from "@/components/ui/Card";
import {
  businessAnalyticsMetrics,
  upcomingBusinessEvents,
  type BusinessCalendarEvent,
} from "@/lib/business-dashboard-demo";
import type { BusinessOnboardingState } from "@/lib/business-onboarding";

type BusinessDashboardOverviewTabProps = {
  state: BusinessOnboardingState;
};

function EventPreviewCard({ event }: { event: BusinessCalendarEvent }) {
  return (
    <article
      className="rounded-[1.5rem] border border-black/10 bg-white/90 p-5"
      style={{ ["--v16-accent" as never]: event.accent }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">{event.dateLabel}</p>
      <h3 className="mt-2 text-lg font-semibold text-black">{event.title}</h3>
      <p className="v16-small mt-2">
        {event.timeLabel} · {event.cohortName}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="v16-pill">{event.format}</span>
        <span className="v16-pill">
          {event.guests}/{event.capacity} guests
        </span>
        <span className="v16-pill">{event.status}</span>
      </div>
    </article>
  );
}

export function BusinessDashboardOverviewTab({ state }: BusinessDashboardOverviewTabProps) {
  const upcoming = upcomingBusinessEvents().slice(0, 2);
  const headlineMetrics = businessAnalyticsMetrics.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="max-w-3xl">
        <p className="v16-kicker">Host dashboard</p>
        <h2 className="v16-h2 mt-2">{state.businessName || "Your business"}</h2>
        <p className="v16-small mt-3">
          Preview snapshot for {state.neighborhood || "your neighborhood"}: recurring cohort nights, repeat guests,
          and the standing rhythm you set during onboarding.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {headlineMetrics.map((metric) => (
          <Card key={metric.id} className="p-5" style={{ ["--v16-accent" as never]: metric.accent }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">{metric.label}</p>
            <p className="mt-2 text-2xl font-black text-black">{metric.value}</p>
            <p className="v16-small mt-2">{metric.note}</p>
          </Card>
        ))}
      </div>

      <section>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="v16-kicker">Upcoming events</p>
            <h3 className="v16-h2 mt-2">Up next on your calendar</h3>
          </div>
          <p className="v16-micro" data-testid="partner-dashboard-sample-label">
            Sample preview data only.
          </p>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {upcoming.map((event) => (
            <EventPreviewCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
