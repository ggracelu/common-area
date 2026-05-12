import { BusinessOnboardingFlow } from "@/components/business/BusinessOnboardingFlow";
import { BusinessShell } from "@/components/business/BusinessShell";

export const dynamic = "force-dynamic";

export default function BusinessDashboardPage() {
  return (
    <BusinessShell>
      <BusinessOnboardingFlow />
    </BusinessShell>
  );
}
