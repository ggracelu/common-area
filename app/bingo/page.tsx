import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { Button } from "@/components/ui/Button";

export default async function BingoPage() {
  return (
    <AppShell
      title="Bingo placeholder"
      description="This protected route will later hold the seasonal bingo or scavenger-hunt rituals for the cohort."
    >
      <Card variant="paper" className="max-w-3xl">
        <p className="text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
          Bingo progress is not implemented yet. This shell exists so future seasonal rituals can connect cleanly to the signed-in experience.
        </p>
        <Sticker className="mt-6">Side quests live here later.</Sticker>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href="/dashboard" variant="secondary">
            Back to dashboard
          </Button>
          <Button href="/season" variant="ghost">
            Browse the season
          </Button>
        </div>
      </Card>
    </AppShell>
  );
}
