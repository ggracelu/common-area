import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";

export default function SeasonSelectPage() {
  return (
    <AppShell
      title="Activity selection placeholder"
      description="This protected route is ready for the future 4-of-6 activity selection flow."
    >
      <Card variant="paper" className="max-w-3xl">
        <p className="text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
          Activity selection is not implemented yet. In a later phase, this page will load the
          current season, display 6 curated activities, and enforce exactly 4 user selections.
        </p>
        <Sticker className="mt-6">Pick four things. Crumbs picked zero, but he supports you.</Sticker>
      </Card>
    </AppShell>
  );
}
