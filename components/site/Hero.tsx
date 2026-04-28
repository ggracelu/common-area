import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-10 sm:px-8 sm:pb-20 lg:px-10 lg:pt-14">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="relative">
          <div className="absolute -left-6 top-12 h-16 w-16 rounded-[1.75rem] bg-[var(--color-sun)]/75 blur-sm" />
          <Badge>Chicago season preview</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-[var(--color-foreground)] sm:text-6xl lg:text-8xl">
            Turn your city into a campus.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:rgba(37,34,30,0.78)] sm:text-xl">
            Find your people in familiar places. Common Area creates recurring, interest-driven
            cohorts so local spots start to feel like common rooms again.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/sign-up">Find your common area</Button>
            <Button href="#how-it-works" variant="secondary">
              See how it works
            </Button>
          </div>
          <p className="mt-5 text-sm font-medium text-[color:rgba(37,34,30,0.66)]">
            No swiping. Just recurring cohorts, familiar faces, and a reason to put on shoes.
          </p>
        </div>

        <Card className="relative overflow-hidden bg-[linear-gradient(160deg,rgba(255,255,255,0.94),rgba(248,226,196,0.78))]">
          <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-[var(--color-accent)]/15" />
          <div className="absolute bottom-6 left-6 h-14 w-14 rounded-[1.5rem] bg-[var(--color-sky)]/55" />
          <div className="relative">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                  Chicago spring term
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
                  A campus feeling after college.
                </h2>
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[var(--color-foreground)] text-4xl text-[var(--color-background)] shadow-[0_20px_40px_rgba(37,34,30,0.18)]">
                🐈
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white/80 p-4">
                <p className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Your commitment</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">$20</p>
                <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.7)]">
                  A small deposit keeps the room from being empty.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-white/80 p-4">
                <p className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Your picks</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">4 of 6</p>
                <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.7)]">
                  Shared interests, not random matching.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[1.5rem] bg-[var(--color-foreground)] p-5 text-[var(--color-background)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-sun)]">
                Cohort logic
              </p>
              <p className="mt-2 text-lg font-medium leading-7">
                About 15-20 people. Shared overlap. Enough consistency to make the city feel familiar.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
