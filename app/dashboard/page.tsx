import { AppShell } from "@/components/app/AppShell";
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
      <main className="flex min-h-[calc(100vh-240px)] items-center justify-center px-2 py-6 md:px-0">
        <Card variant="scrapbook" className="w-full max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Summer 2026 season
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Ready to join a cohort?
          </h1>
          <p className="mt-5 text-lg leading-8 text-[color:rgba(37,34,30,0.74)]">
            Sign-ups are open now for our Summer 2026 season.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/bingo" variant="primary">
              Open the bingo card
            </Button>
          </div>

          <Sticker className="mt-7">
            Your bingo card is the whole flow: discover events, pick 4, then submit to start matching.
          </Sticker>
        </Card>
      </main>
    </AppShell>
  );
}
