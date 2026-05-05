import { AppShell } from "@/components/app/AppShell";
import { DashboardHome } from "@/components/app/DashboardHome";

export default async function DashboardPage() {
  return (
    <AppShell
      title="Dashboard"
      description="Your home base for the season: picks, progress, matching, and the small side quests that make strangers feel familiar."
    >
      <DashboardHome />
    </AppShell>
  );
}
