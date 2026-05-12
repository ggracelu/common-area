"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  partnerOnboardingSampleForProfile,
  resolvePartnerTestProfile,
  type PartnerTestProfile,
} from "@/lib/business-partner-test-accounts";
import type { BusinessOnboardingState } from "@/lib/business-onboarding";

type BusinessPartnerTestControlsProps = {
  onReset: () => void;
  onApplySample: (state: BusinessOnboardingState) => void;
};

function profileLabel(profile: PartnerTestProfile) {
  return profile === "grader" ? "Grader's Coffee" : "Crumbs Cafe";
}

export function BusinessPartnerTestControls({ onReset, onApplySample }: BusinessPartnerTestControlsProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? null;
  const profile = resolvePartnerTestProfile(email);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const resetTestId = profile === "grader" ? "partner-grader-reset-onboarding" : profile === "tester" ? "partner-tester-reset-onboarding" : "partner-reset-onboarding";
  const sampleTestId =
    profile === "grader" ? "partner-grader-apply-sample-onboarding" : "partner-tester-apply-sample-onboarding";

  function handleReset() {
    const label = profile ? profileLabel(profile) : "this partner account";
    const confirmed = window.confirm(
      `Reset partner onboarding for ${label}? This clears browser-only preview answers for this Clerk user.`,
    );
    if (!confirmed) return;
    onReset();
  }

  function handleApplySample() {
    if (!profile) return;
    onApplySample(partnerOnboardingSampleForProfile(profile));
  }

  return (
    <Card className="border-dashed border-black/20 bg-white/90 p-5 md:p-6">
      <p className="v16-kicker">Partner testing controls</p>
      <h2 className="mt-2 text-base font-semibold text-black">
        {profile ? `${profileLabel(profile)} testing only` : "Partner preview testing only"}
      </h2>
      <p className="v16-small mt-2 max-w-2xl">
        These buttons exist for QA and manual grading. They clear or prefill browser-only partner onboarding state for
        this Clerk account. They are not production host tools.
      </p>
      {!profile && email ? (
        <p className="v16-small mt-2 max-w-2xl text-black/65">
          Signed in as <span className="font-semibold text-black">{email}</span>. Use a partner grader or tester account
          from <code className="rounded bg-black/5 px-1 py-0.5 text-xs">docs/GRADER_LOGIN.md</code> to apply sample
          answers.
        </p>
      ) : null}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {profile ? (
          <Button data-testid={sampleTestId} variant="secondary" onClick={handleApplySample}>
            Apply sample answers
          </Button>
        ) : null}
        <Button data-testid={resetTestId} variant="ghost" onClick={handleReset}>
          Reset partner onboarding
        </Button>
      </div>
    </Card>
  );
}
