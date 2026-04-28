import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Polaroid } from "@/components/ui/Polaroid";
import { Sticker } from "@/components/ui/Sticker";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-10 sm:px-8 sm:pb-20 lg:px-10 lg:pt-14">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="relative">
          <div aria-hidden="true" className="absolute -left-6 top-12 h-16 w-16 rounded-[1.75rem] bg-[var(--color-butter)]/75 blur-sm" />
          <Badge variant="sky">Chicago season preview</Badge>
          <h1 className="display-heading mt-6 max-w-4xl text-5xl font-semibold text-[var(--color-foreground)] sm:text-6xl lg:text-8xl">
            Turn your city into a campus.
          </h1>
          <p className="editorial-subhead mt-6 max-w-2xl sm:text-xl">
            Find your people in familiar places. Common Area creates recurring, interest-driven
            cohorts so local spots start to feel like common rooms again.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/sign-up" size="lg">Find your common area</Button>
            <Button href="#how-it-works" variant="secondary">
              See how it works
            </Button>
          </div>
          <p className="mt-5 max-w-xl text-sm font-medium text-[color:rgba(37,34,30,0.66)]">
            No swiping. Just recurring cohorts, familiar faces, and a reason to put on shoes.
          </p>
          <Sticker className="mt-6">
            Crumbs says your couch will forgive you.
          </Sticker>
        </div>

        <div className="relative grid gap-5 lg:pl-6">
          <Polaroid
            title="Common room logic"
            caption="Repeated presence beats first-impression theater."
            tilt="left"
            className="max-w-[26rem]"
          >
            <div className="grain-overlay flex min-h-[12rem] flex-col justify-between bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(242,231,216,0.92))] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-eyebrow">Chicago season</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
                    A campus feeling after college.
                  </h2>
                </div>
                <div aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-[1.6rem] bg-[var(--color-foreground)] text-3xl text-[var(--color-background)]">
                  🐈
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.25rem] bg-white/78 p-4">
                  <p className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Your commitment</p>
                  <p className="mt-2 text-3xl font-semibold">$20</p>
                </div>
                <div className="rounded-[1.25rem] bg-white/78 p-4">
                  <p className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Your picks</p>
                  <p className="mt-2 text-3xl font-semibold">4 of 6</p>
                </div>
              </div>
            </div>
          </Polaroid>

          <Card variant="scrapbook" className="paper-surface reveal-soft ml-auto max-w-[24rem]">
            <p className="section-eyebrow">Cohort logic</p>
            <p className="mt-3 text-lg font-medium leading-8">
              About 15-20 people. Shared overlap. Enough consistency to make the city feel familiar.
            </p>
            <Sticker className="mt-5">Crumbs saved you a spot.</Sticker>
          </Card>
        </div>
      </div>
    </section>
  );
}
