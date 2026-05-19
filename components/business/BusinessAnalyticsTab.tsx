import { PartnerSampleDataNotice } from "@/components/business/PartnerSampleDataNotice";
import { Card } from "@/components/ui/Card";
import {
  businessAnalyticsMetrics,
  businessDemographics,
  businessEventInsights,
  businessNeighborhoodMix,
} from "@/lib/business-dashboard-demo";

function ShareBar({ label, share, accent }: { label: string; share: number; accent: string }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-black">{label}</span>
        <span className="text-black/60">{share}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/8">
        <div
          className="h-full rounded-full"
          style={{ width: `${share}%`, background: `color-mix(in srgb, ${accent} 72%, white 28%)` }}
        />
      </div>
    </div>
  );
}

export function BusinessAnalyticsTab() {
  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <p className="v16-kicker">Analytics</p>
        <h2 className="v16-h2 mt-2">Event performance and guest mix</h2>
        <p className="v16-small mt-3">
          Illustrative attendance, revenue, and neighborhood signals for your host room. Numbers are sample preview
          data only.
        </p>
        <div className="mt-4">
          <PartnerSampleDataNotice />
        </div>
      </section>

      <Card variant="paper" className="p-5 md:p-6" style={{ ["--v16-accent" as never]: "var(--v16-lime)" }}>
        <p className="v16-kicker">Season insight</p>
        <p className="mt-2 text-lg font-semibold text-black">
          Repeat guests are up 40% after your second crawl — neighbors are starting to recognize each other at the bar.
        </p>
        <p className="v16-small mt-2">Sample insight for partner preview; not live analytics.</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {businessAnalyticsMetrics.map((metric) => (
          <Card key={metric.id} className="p-5" style={{ ["--v16-accent" as never]: metric.accent }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">{metric.label}</p>
            <p className="mt-2 text-2xl font-black text-black">{metric.value}</p>
            <p className="v16-small mt-2">{metric.note}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <p className="v16-kicker">Age mix</p>
          <h3 className="mt-2 text-lg font-semibold text-black">Who keeps coming back</h3>
          <div className="mt-5 space-y-4">
            {businessDemographics.map((slice) => (
              <ShareBar key={slice.label} label={slice.label} share={slice.share} accent={slice.accent} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="v16-kicker">Neighborhood mix</p>
          <h3 className="mt-2 text-lg font-semibold text-black">Where your regulars live</h3>
          <div className="mt-5 space-y-4">
            {businessNeighborhoodMix.map((slice) => (
              <ShareBar key={slice.label} label={slice.label} share={slice.share} accent={slice.accent} />
            ))}
          </div>
        </Card>
      </div>

      <section>
        <p className="v16-kicker">Event insights</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {businessEventInsights.map((insight) => (
            <Card key={insight.id} className="p-5" style={{ ["--v16-accent" as never]: insight.accent }}>
              <h3 className="text-lg font-semibold text-black">{insight.title}</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-black/60">Attendance rate</dt>
                  <dd className="font-semibold text-black">{insight.attendanceRate}%</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-black/60">Estimated revenue</dt>
                  <dd className="font-semibold text-black">${insight.estimatedRevenueUsd.toLocaleString()}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-black/60">Estimated profit</dt>
                  <dd className="font-semibold text-black">${insight.estimatedProfitUsd.toLocaleString()}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-black/60">Repeat guests</dt>
                  <dd className="font-semibold text-black">{insight.repeatGuests}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
