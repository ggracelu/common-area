import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function CrumbsSection() {
  return (
    <section id="crumbs" className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
        <Card className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(191,90,54,0.96),rgba(136,58,37,0.96))] text-[var(--color-background)]">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute bottom-5 left-5 h-12 w-12 rounded-[1rem] bg-white/14" />
          <div className="relative flex min-h-[300px] flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-sun)]">
                Resident lounge cat
              </p>
              <div className="mt-8 inline-flex h-28 w-28 items-center justify-center rounded-[2.5rem] bg-white/12 text-7xl shadow-[0_22px_40px_rgba(0,0,0,0.18)]">
                🐈
              </div>
            </div>
            <p className="max-w-xs text-lg leading-8">Crumbs saved you a spot.</p>
          </div>
        </Card>

        <div>
          <Badge>Meet Crumbs</Badge>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Dry, cozy, observant. Never trying too hard.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[color:rgba(37,34,30,0.74)]">
            Crumbs is Common Area&apos;s resident lounge cat: the creature who somehow lives in every
            good common room, café corner, and worn couch situation. Crumbs makes the brand feel
            lived-in, familiar, and quietly funny without making the product feel careless or unserious.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card className="bg-white/72">
              <h3 className="text-xl font-semibold">What Crumbs adds</h3>
              <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
                Familiarity, warmth, and the feeling that showing up for twenty minutes still counts.
              </p>
            </Card>
            <Card className="bg-white/72">
              <h3 className="text-xl font-semibold">What Crumbs never replaces</h3>
              <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
                Clear product rules, operational trust, accessible design, and respect for payments and privacy.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
