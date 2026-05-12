import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Polaroid } from "@/components/ui/Polaroid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Sticker } from "@/components/ui/Sticker";

export function SeasonPreview() {
  return (
    <section id="season" className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="max-w-2xl">
          <SectionHeader
            eyebrow="Current season preview"
            title="This is what a Common Area season feels like before you even log in."
            description="A season is not an endless feed. It is a short window of recurring Chicago plans, local energy, and a cohort built to make familiar faces easier to find the second time."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#activities">Browse experiences</Button>
            <Button href="/sign-up" variant="ghost">
              Save me a spot
            </Button>
          </div>
          <Sticker className="mt-6">Local spots become your campus buildings.</Sticker>
        </div>

        <Card variant="scrapbook" className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white/88 p-4">
              <p className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Season city</p>
              <p className="mt-3 text-2xl font-semibold">Chicago</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/88 p-4">
              <p className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Activity picks</p>
              <p className="mt-3 text-2xl font-semibold">4 of 6</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/88 p-4">
              <p className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Cohort size</p>
              <p className="mt-3 text-2xl font-semibold">15-20</p>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-[1.5rem] bg-[var(--color-foreground)] p-5 text-[var(--color-background)]">
              <p className="section-eyebrow text-[var(--color-butter)]">Core promise</p>
              <p className="mt-3 text-xl font-medium leading-8">
                Local spots become your campus buildings.
              </p>
            </div>
            <Polaroid
              title="Common room note"
              caption="You can leave after an hour. Showing up still counts."
              tilt="right"
            >
              <div
                aria-hidden="true"
                className="flex min-h-[10rem] items-end justify-between bg-[linear-gradient(180deg,rgba(191,212,223,0.82),rgba(242,231,216,0.9))] p-4"
              >
                <div className="h-16 w-24 rounded-t-[1.2rem] bg-white/70" />
                <div className="text-5xl">🐈</div>
              </div>
            </Polaroid>
          </div>
        </Card>
      </div>
    </section>
  );
}
