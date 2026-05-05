import { AppShell } from "@/components/app/AppShell";
import { SeasonSelectDemo } from "@/components/season/SeasonSelectDemo";

export default function SeasonSelectPage() {
  return (
    <AppShell
      title="Pick events + collect stamps"
      description="Choose four cohort events, pin optional side quests, and send your postcard to matching."
    >
      <SeasonSelectDemo />
    </AppShell>
  );
}
