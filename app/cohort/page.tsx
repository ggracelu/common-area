import { AppShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/Card";

export default function CohortPage() {
  return (
    <AppShell
      title="Cohort placeholder"
      description="This protected route will hold the cohort overview once assignment logic and persistence are added."
    >
      <Card className="max-w-3xl">
        <p className="text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
          Your cohort is not available yet because the assignment engine and season workflow have not
          been built. This shell exists now so the authenticated navigation has stable destinations.
        </p>
      </Card>
    </AppShell>
  );
}
