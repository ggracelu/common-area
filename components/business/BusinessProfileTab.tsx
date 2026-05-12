import { Card } from "@/components/ui/Card";
import type { BusinessOnboardingState } from "@/lib/business-onboarding";

type BusinessProfileTabProps = {
  state: BusinessOnboardingState;
};

export function BusinessProfileTab({ state }: BusinessProfileTabProps) {
  return (
    <div className="space-y-8">
      <section className="max-w-3xl">
        <p className="v16-kicker">Profile</p>
        <h2 className="v16-h2 mt-2">Your host profile</h2>
        <p className="v16-small mt-3">
          Preview details from partner onboarding. Production hosts will eventually sync this with persisted partner
          records.
        </p>
      </section>

      <Card variant="paper" className="p-6 md:p-8">
        <p className="v16-kicker">Your business</p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">Name</dt>
            <dd className="mt-1 text-base font-semibold text-black">{state.businessName}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">Neighborhood</dt>
            <dd className="mt-1 text-base font-semibold text-black">{state.neighborhood}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">Category</dt>
            <dd className="mt-1 text-base font-semibold text-black">{state.category}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">Contact</dt>
            <dd className="mt-1 text-base font-semibold text-black">{state.contactEmail}</dd>
          </div>
        </dl>

        <div className="mt-8 border-t border-black/10 pt-6">
          <p className="v16-kicker">Hosting preferences</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {state.eventTypes.map((eventType) => (
              <span key={eventType} className="v16-pill">
                {eventType}
              </span>
            ))}
          </div>
          <p className="v16-small mt-4">
            {state.frequency} · {state.groupSize}
          </p>
        </div>
      </Card>
    </div>
  );
}
