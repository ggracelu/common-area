import { AppShell } from "@/components/app/AppShell";
import { BingoBoardDemo } from "@/components/bingo/BingoBoardDemo";

export default async function BingoPage() {
  return (
    <AppShell
      title="Bingo"
      description="A scrapbooky 3×3 passport of event stamps + bonus side quests. Demo progress is local-only."
    >
      <BingoBoardDemo />
    </AppShell>
  );
}
