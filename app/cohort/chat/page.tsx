import { AppShell } from "@/components/app/AppShell";
import { CohortChatDemo } from "@/components/cohort/CohortChatDemo";

export default function CohortChatPage() {
  return (
    <AppShell
      title="Cohort chat"
      description="A cozy group chat shell with seeded messages (demo) and a local composer so it feels real while realtime is still future work."
    >
      <CohortChatDemo />
    </AppShell>
  );
}
