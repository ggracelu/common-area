import { AppShell } from "@/components/app/AppShell";
import { CohortHome } from "@/components/cohort/CohortHome";

export default function CohortPage() {
  return (
    <AppShell
      title="Your cohort common room"
      description="This is the reveal: your 20-person cohort, shared overlaps, and the low-stakes prompts that make it easier to say hi."
    >
      <CohortHome />
    </AppShell>
  );
}
