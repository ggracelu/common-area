import { AppShell } from "@/components/app/AppShell";
import { BingoBoardDemo } from "@/components/bingo/BingoBoardDemo";

export default async function BingoPage() {
  return (
    <AppShell
      title="Bingo"
      description="Select any 4 experiences. Your bingo card is the mechanism for discovery, sign-up, and bonus gamification."
    >
      <BingoBoardDemo />
    </AppShell>
  );
}
