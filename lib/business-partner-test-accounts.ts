import type { BusinessOnboardingState } from "@/lib/business-onboarding";

export type PartnerTestProfile = "grader" | "tester";

export function resolvePartnerTestProfile(email: string | null | undefined): PartnerTestProfile | null {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return null;

  const graderHint = process.env.NEXT_PUBLIC_PARTNER_GRADER_EMAIL_HINT?.trim().toLowerCase();
  const testerHint = process.env.NEXT_PUBLIC_PARTNER_TESTER_EMAIL_HINT?.trim().toLowerCase();

  if (graderHint && normalized === graderHint) {
    return "grader";
  }

  if (testerHint && normalized === testerHint) {
    return "tester";
  }

  return null;
}

export const partnerGraderOnboardingSample: BusinessOnboardingState = {
  businessName: "Grader's Coffee",
  neighborhood: "Wicker Park",
  category: "Coffee shop",
  contactEmail: "graders-coffee+clerk_test@example.com",
  eventTypes: ["Tasting or crawl", "Listening or performance"],
  frequency: "Biweekly",
  groupSize: "10–15 guests",
  subscriptionAcknowledged: true,
  completed: false,
};

export const partnerTesterOnboardingSample: BusinessOnboardingState = {
  businessName: "Crumbs Cafe",
  neighborhood: "Ukrainian Village",
  category: "Coffee shop",
  contactEmail: "crumbs-cafe+clerk_test@example.com",
  eventTypes: ["Hands-on workshop", "Open studio night"],
  frequency: "Weekly",
  groupSize: "6–10 guests",
  subscriptionAcknowledged: true,
  completed: false,
};

export function partnerOnboardingSampleForProfile(profile: PartnerTestProfile): BusinessOnboardingState {
  return profile === "grader" ? partnerGraderOnboardingSample : partnerTesterOnboardingSample;
}
