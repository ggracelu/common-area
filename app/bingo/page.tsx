import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";

export default function BingoPage() {
  return (
    <AppShell
      title="Bingo placeholder"
      description="This protected route will later hold the seasonal bingo or scavenger-hunt rituals for the cohort."
    >
      <Card variant="paper" className="max-w-3xl">
        <p className="text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
          Bingo progress is not implemented yet. The auth guard and shell are in place so future
          engagement features can connect cleanly to the signed-in experience.
        </p>
        <Sticker className="mt-6">Side quests live here later.</Sticker>
      </Card>
    </AppShell>
  );
}
