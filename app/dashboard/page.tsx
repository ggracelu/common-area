import { AppShell } from "@/components/app/AppShell";
import { CrumbsNote } from "@/components/app/CrumbsNote";
import { JoinSeasonButton } from "@/components/season/JoinSeasonButton";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sticker } from "@/components/ui/Sticker";

export default async function DashboardPage() {
  return (
    <AppShell
      title="Dashboard"
      description=""
      hideIntro
    >
      <main className="mx-auto grid w-full max-w-5xl gap-6 px-3 py-6 md:px-0">
        <Card variant="scrapbook" className="w-full">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Summer 2026 season
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Your command center.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[color:rgba(37,34,30,0.74)]">
            Pick <span className="font-semibold">4 experiences</span> on your bingo card, then we match you into a 20-person cohort
            based on overlap after the one-week signup window closes.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/bingo" variant="primary">
              Open the bingo card
            </Button>
            <Button href="/cohort" variant="secondary">
              View cohort status
            </Button>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <Sticker>
              Deposit is a commitment signal, not a subscription. If Stripe isn’t configured here, you’ll stay in demo mode.
            </Sticker>
            <div className="sm:justify-self-end">
              <JoinSeasonButton />
            </div>
          </div>
        </Card>

        <CrumbsNote
          title="Crumbs note"
          pose="sit"
          lines={[
            "Crumbs saved you a spot.",
            "Showing up counts.",
            "You can leave after an hour.",
            "Your couch will forgive you.",
            "Crumbs is sorting the match pile. Slowly. With authority.",
          ]}
        />
      </main>
    </AppShell>
  );
}
