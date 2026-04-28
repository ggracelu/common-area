import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function SeasonPreview() {
  return (
    <section id="season" className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="max-w-2xl">
          <Badge>Current season preview</Badge>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            This is what a Common Area season feels like before you even log in.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[color:rgba(37,34,30,0.74)]">
            A season is not an endless feed. It is a short window of recurring Chicago plans, local
            energy, and a cohort built to make familiar faces easier to find the second time.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#activities">Browse the season</Button>
            <Button href="/sign-up" variant="secondary">
              Save me a spot
            </Button>
          </div>
        </div>

        <Card className="grid gap-4 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(228,236,242,0.7))]">
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
          <div className="rounded-[1.5rem] bg-[var(--color-foreground)] p-5 text-[var(--color-background)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-sun)]">
              Core promise
            </p>
            <p className="mt-3 text-xl font-medium leading-8">
              Local spots become your campus buildings.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
