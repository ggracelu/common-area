import { Card } from "@/components/ui/Card";
import { PartnerDirectory } from "@/components/business/PartnerDirectory";
import { partnerBusinesses } from "@/lib/business-partners";
import { businessCollaborationPartners, businessGuestProfiles } from "@/lib/business-dashboard-demo";
import type { BusinessOnboardingState } from "@/lib/business-onboarding";

type BusinessCommunityTabProps = {
  state: BusinessOnboardingState;
};

export function BusinessCommunityTab({ state }: BusinessCommunityTabProps) {
  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <p className="v16-kicker">Community</p>
        <h2 className="v16-h2 mt-2">Partner with neighbors and recognize regulars</h2>
        <p className="v16-small mt-3">
          Preview how a host might pair with complementary businesses and remember the neighbors who return to your
          room.
        </p>
      </section>

      <section>
        <p className="v16-kicker">Cross-host partnerships</p>
        <h3 className="mt-2 text-lg font-semibold text-black">Businesses to pair with</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {businessCollaborationPartners.map((partner) => (
            <Card key={partner.id} className="p-5" style={{ ["--v16-accent" as never]: partner.accent }}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                {partner.neighborhood} · {partner.category}
              </p>
              <h4 className="mt-2 text-lg font-semibold text-black">{partner.name}</h4>
              <p className="mt-3 text-sm font-semibold text-black/70">{partner.partnershipType}</p>
              <p className="v16-small mt-3">{partner.summary}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <p className="v16-kicker">Guest profiles</p>
        <h3 className="mt-2 text-lg font-semibold text-black">Neighbors who have visited your events</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {businessGuestProfiles.map((guest) => (
            <Card key={guest.id} className="p-5" style={{ ["--v16-accent" as never]: guest.accent }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-black">{guest.name}</h4>
                  <p className="v16-small mt-1">{guest.neighborhood}</p>
                </div>
                <span className="v16-pill">{guest.visits} visits</span>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-black/60">Last event</dt>
                  <dd className="text-right font-medium text-black">{guest.lastEvent}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-black/60">Cohort</dt>
                  <dd className="text-right font-medium text-black">{guest.cohort}</dd>
                </div>
              </dl>
              <p className="v16-small mt-4">{guest.note}</p>
            </Card>
          ))}
        </div>
      </section>

      <PartnerDirectory businesses={partnerBusinesses} highlightName={state.businessName} />
    </div>
  );
}
