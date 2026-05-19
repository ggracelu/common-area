import { BusinessCalendarGrid } from "@/components/business/BusinessCalendarGrid";
import { PartnerSampleDataNotice } from "@/components/business/PartnerSampleDataNotice";

export function BusinessCalendarTab() {
  return (
    <div className="space-y-8">
      <section className="max-w-3xl">
        <p className="v16-kicker">Calendar</p>
        <h2 className="v16-h2 mt-2">Your cohort nights at a glance</h2>
        <p className="v16-small mt-3">
          Tap a colorful tile to open the night — same scrapbook energy as the member bingo card, built for your host
          schedule.
        </p>
        <div className="mt-4">
          <PartnerSampleDataNotice />
        </div>
      </section>

      <BusinessCalendarGrid />
    </div>
  );
}
