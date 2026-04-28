import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/Card";

export default function SeasonSelectPage() {
  return (
    <AppShell
      title="Activity selection placeholder"
      description="This protected route is ready for the future 4-of-6 activity selection flow."
    >
      <Card className="max-w-3xl">
        <p className="text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
          Activity selection is not implemented yet. In a later phase, this page will load the
          current season, display 6 curated activities, and enforce exactly 4 user selections.
        </p>
      </Card>
    </AppShell>
  );
}
