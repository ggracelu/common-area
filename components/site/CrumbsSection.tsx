import { Card } from "@/components/ui/Card";
import { Polaroid } from "@/components/ui/Polaroid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Sticker } from "@/components/ui/Sticker";

export function CrumbsSection() {
  return (
    <section id="crumbs" className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
        <Polaroid
          title="Resident lounge cat"
          caption="Crumbs is not ignoring you. He is observing community formation."
          tilt="left"
          className="max-w-[24rem]"
        >
          <div className="grain-overlay flex min-h-[18rem] flex-col justify-between bg-[linear-gradient(180deg,rgba(189,98,63,0.94),rgba(103,114,85,0.92))] p-6 text-[var(--color-background)]">
            <div aria-hidden="true" className="text-7xl">🐈</div>
            <p className="max-w-xs text-lg leading-8">Crumbs saved you a spot.</p>
          </div>
        </Polaroid>

        <div>
          <SectionHeader
            eyebrow="Meet Crumbs"
            title="Dry, cozy, observant. Never trying too hard."
            description="Crumbs is Common Area&apos;s resident lounge cat: the creature who somehow lives in every good common room, café corner, and worn couch situation. Crumbs makes the brand feel lived-in, familiar, and quietly funny without making the product feel careless or unserious."
          />
          <Sticker className="mt-6">Showing up counts.</Sticker>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card variant="paper" className="lift-hover">
              <h3 className="text-xl font-semibold">What Crumbs adds</h3>
              <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
                Familiarity, warmth, and the feeling that showing up for twenty minutes still counts.
              </p>
            </Card>
            <Card variant="scrapbook" className="lift-hover">
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
