import { DepositSection } from "@/components/site/DepositSection";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getActiveSeasonWithActivities } from "@/lib/catalog";

function formatSeasonDates(start: string | null, end: string | null) {
  if (!start && !end) {
    return "Dates coming soon";
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (start && end) {
    return `${formatter.format(new Date(start))} - ${formatter.format(new Date(end))}`;
  }

  return formatter.format(new Date(start ?? end ?? ""));
}

function formatActivityDateTime(start: string | null, end: string | null) {
  if (!start) {
    return "Date coming soon";
  }

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const startDate = new Date(start);
  const startLabel = `${dateFormatter.format(startDate)} at ${timeFormatter.format(startDate)}`;

  if (!end) {
    return startLabel;
  }

  return `${startLabel} - ${timeFormatter.format(new Date(end))}`;
}

export default async function SeasonPage() {
  let state:
    | { kind: "ready"; season: Awaited<ReturnType<typeof getActiveSeasonWithActivities>> }
    | { kind: "error"; message: string };

  try {
    const season = await getActiveSeasonWithActivities();
    state = { kind: "ready", season };
  } catch (error) {
    state = {
      kind: "error",
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error prevented the season catalog from loading.",
    };
  }

  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {state.kind === "error" ? (
            <Card className="max-w-3xl bg-white/84">
              <Badge>Season unavailable</Badge>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                The season page is wired up, but Supabase still needs configuration.
              </h1>
              <p className="mt-5 text-lg leading-8 text-[color:rgba(37,34,30,0.74)]">
                {state.message}
              </p>
              <p className="mt-6 text-sm font-medium text-[color:rgba(37,34,30,0.68)]">
                Crumbs saved you a spot. The database just needs directions.
              </p>
            </Card>
          ) : !state.season ? (
            <Card className="max-w-3xl bg-white/84">
              <Badge>No active season</Badge>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                No Chicago season is active yet.
              </h1>
              <p className="mt-5 text-lg leading-8 text-[color:rgba(37,34,30,0.74)]">
                The catalog foundation is connected, but the database does not currently expose an
                active season. Run the seed SQL to load the Summer 2026 preview.
              </p>
            </Card>
          ) : (
            <>
              <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                <div className="max-w-3xl">
                  <Badge>Current season</Badge>
                  <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">
                    {state.season.name}
                  </h1>
                  <p className="mt-5 text-xl leading-8 text-[color:rgba(37,34,30,0.8)]">
                    {state.season.tagline ?? "Turn your city into a campus."}
                  </p>
                  <p className="mt-6 text-lg leading-8 text-[color:rgba(37,34,30,0.72)]">
                    {state.season.description ?? "Season details coming soon."}
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button href="/sign-up">Join the Chicago season</Button>
                    <Button href="/sign-in" variant="secondary">
                      Sign in
                    </Button>
                  </div>
                </div>

                <Card className="grid gap-4 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,226,196,0.82))]">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-[1.5rem] bg-white/88 p-4">
                      <p className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">City</p>
                      <p className="mt-3 text-2xl font-semibold">{state.season.city}</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-white/88 p-4">
                      <p className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Window</p>
                      <p className="mt-3 text-base font-semibold">
                        {formatSeasonDates(state.season.startsAt, state.season.endsAt)}
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] bg-white/88 p-4">
                      <p className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Activities</p>
                      <p className="mt-3 text-2xl font-semibold">{state.season.activities.length}</p>
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] bg-[var(--color-foreground)] p-5 text-[var(--color-background)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-sun)]">
                      Crumbs says
                    </p>
                    <p className="mt-3 text-lg font-medium leading-8">
                      Community is mostly showing up and knowing where the snacks are.
                    </p>
                  </div>
                </Card>
              </section>

              <section className="mt-16">
                <div className="max-w-3xl">
                  <Badge>Season activities</Badge>
                  <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                    Six local spots that start to feel like campus buildings.
                  </h2>
                </div>

                {state.season.activities.length === 0 ? (
                  <Card className="mt-10 max-w-3xl bg-white/84">
                    <p className="text-lg leading-8 text-[color:rgba(37,34,30,0.74)]">
                      This season exists, but no activities are attached yet.
                    </p>
                  </Card>
                ) : (
                  <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {state.season.activities.map((seasonActivity) => (
                      <Card key={seasonActivity.id} className="flex h-full flex-col justify-between bg-white/82">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                            {seasonActivity.activity.neighborhood ?? "Chicago"} •{" "}
                            {seasonActivity.activity.activityType ?? "Activity"}
                          </p>
                          <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                            {seasonActivity.activity.title}
                          </h3>
                          <p className="mt-3 text-sm font-medium text-[color:rgba(37,34,30,0.68)]">
                            {seasonActivity.activity.businessName}
                          </p>
                          <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
                            {seasonActivity.activity.description ?? "Description coming soon."}
                          </p>
                        </div>

                        <div className="mt-6 space-y-2 text-sm text-[color:rgba(37,34,30,0.68)]">
                          <p>{formatActivityDateTime(seasonActivity.activity.startsAt, seasonActivity.activity.endsAt)}</p>
                          <p>{seasonActivity.activity.vibe ?? "Vibe details coming soon."}</p>
                          {seasonActivity.activity.address ? <p>{seasonActivity.activity.address}</p> : null}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              <div className="mt-16">
                <DepositSection />
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
