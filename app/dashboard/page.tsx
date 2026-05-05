import { AppShell } from "@/components/app/AppShell";
import { DashboardDemo } from "@/components/app/DashboardDemo";

export default async function DashboardPage() {
  return (
    <AppShell
      title="Dashboard"
      description=""
      hideIntro
    >
      <DashboardDemo />
    </AppShell>
  );
}
