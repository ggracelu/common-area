import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";

export default function CohortChatPage() {
  return (
    <AppShell
      title="Cohort chat placeholder"
      description="This protected route is reserved for the future realtime cohort conversation space."
    >
      <Card variant="paper" className="max-w-3xl">
        <p className="text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
          Chat is not implemented in Phase 3. The route is protected now so the later Realtime work
          can drop into an authenticated shell without changing navigation structure.
        </p>
        <Sticker className="mt-6">Say hi before Crumbs starts narrating the silence.</Sticker>
      </Card>
    </AppShell>
  );
}
