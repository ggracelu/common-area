import { currentUser } from "@clerk/nextjs/server";
import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { Button } from "@/components/ui/Button";
import { getActiveSeason } from "@/lib/catalog";
import { hasPaidDepositForSeason } from "@/lib/deposits";
import { JoinSeasonButton } from "@/components/season/JoinSeasonButton";

export default async function SeasonSelectPage() {
  const user = await currentUser();
  const season = await getActiveSeason();

  let hasPaidDeposit = false;

  if (user?.id && season) {
    hasPaidDeposit = await hasPaidDepositForSeason(user.id, season.id);
  }

  if (!hasPaidDeposit) {
    return (
      <AppShell
        title="Activity selection"
        description="Before you pick activities, join the season with your $20 deposit."
      >
        <Card variant="paper" className="max-w-3xl">
          <p className="text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
            Before you pick activities, join the season with your $20 deposit.
          </p>
          <div className="mt-6">
            <JoinSeasonButton />
          </div>
          <Sticker className="mt-6">Crumbs says: showing up counts. Your spot is still here.</Sticker>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Activity selection placeholder"
      description="This protected route is ready for the future 4-of-6 activity selection flow."
    >
      <Card variant="paper" className="max-w-3xl">
        <p className="text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
          Deposit confirmed. Activity selection comes next.
        </p>
        <Sticker className="mt-6">Pick four things. Crumbs picked zero, but he supports you.</Sticker>
      </Card>
    </AppShell>
  );
}
