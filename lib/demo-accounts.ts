import type { BusinessOnboardingState } from "@/lib/business-onboarding";

/** Clerk accepts this OTP for any `+clerk_test@example.com` address in development instances. */
export const CLERK_TEST_VERIFICATION_CODE = "424242";

/** Shared passwords for provisioned demo accounts (documented in docs/DEMO_ACCOUNTS.md). */
export const DEMO_MEMBER_PASSWORD = "CADemo-Member8!vT2wL6pX";
export const DEMO_PARTNER_PASSWORD = "CAPartner-Demo8!vT2wL6pX";

/** Primary member grader (not a +clerk_test address; OTP does not apply). */
export const GRADER_MEMBER_EMAIL = "grader@example.com";
export const GRADER_MEMBER_PASSWORD = "CAgr8r-9Qm!vT2wL6pX";

/** Legacy partner grader/tester passwords (match .env.example). */
export const PARTNER_GRADER_PASSWORD = "CAPartner-8Qm!vT2wL6pX";
export const PARTNER_TESTER_PASSWORD = "CAPartner-Cr7m!vT2wL6pX";

export function businessDemoPassword(personaId: string): string {
  if (personaId === "graders-coffee") return PARTNER_GRADER_PASSWORD;
  if (personaId === "crumbs-cafe") return PARTNER_TESTER_PASSWORD;
  return DEMO_PARTNER_PASSWORD;
}

export function isClerkTestEmail(email: string | null | undefined): boolean {
  return Boolean(email?.toLowerCase().includes("+clerk_test@"));
}

export type MemberDemoPersona = {
  id: string;
  audienceGroup: string;
  displayName: string;
  email: string;
  neighborhood: string;
  tagline: string;
};

export type BusinessDemoPersona = {
  id: string;
  audienceGroup: string;
  businessName: string;
  email: string;
  username: string;
  neighborhood: string;
  category: string;
  partnerSlug: string | null;
  onboardingSample: BusinessOnboardingState;
};

export const memberDemoPersonas: MemberDemoPersona[] = [
  {
    id: "new-grad",
    audienceGroup: "New grad, first year in Chicago",
    displayName: "Alex Chen",
    email: "alex-newgrad+clerk_test@example.com",
    neighborhood: "South Loop",
    tagline: "Wants a campus rhythm after college, not another apps-only social life.",
  },
  {
    id: "creative",
    audienceGroup: "Wicker Park creative",
    displayName: "Jordan Lee",
    email: "jordan-creative+clerk_test@example.com",
    neighborhood: "Wicker Park",
    tagline: "Pottery, cafes, and low-pressure nights with the same faces.",
  },
  {
    id: "foodie",
    audienceGroup: "Logan Square food & culture",
    displayName: "Sam Ortiz",
    email: "sam-foodie+clerk_test@example.com",
    neighborhood: "Logan Square",
    tagline: "Cohort nights built around cooking, comedy, and neighborhood walks.",
  },
  {
    id: "explorer",
    audienceGroup: "Pilsen neighborhood explorer",
    displayName: "Priya Nair",
    email: "priya-pilsen+clerk_test@example.com",
    neighborhood: "Pilsen",
    tagline: "New to the city; wants recurring plans anchored in real places.",
  },
  {
    id: "reset",
    audienceGroup: "Lakeview social reset",
    displayName: "Morgan Blake",
    email: "morgan-reset+clerk_test@example.com",
    neighborhood: "Lakeview",
    tagline: "Tired of one-off meetups; looking for a standing social season.",
  },
];

export const businessDemoPersonas: BusinessDemoPersona[] = [
  {
    id: "graders-coffee",
    audienceGroup: "Wicker Park coffee host",
    businessName: "Grader's Coffee",
    email: "graders-coffee+clerk_test@example.com",
    username: "graders-coffee",
    neighborhood: "Wicker Park",
    category: "Coffee shop",
    partnerSlug: "graders-coffee",
    onboardingSample: {
      businessName: "Grader's Coffee",
      neighborhood: "Wicker Park",
      category: "Coffee shop",
      contactEmail: "graders-coffee+clerk_test@example.com",
      eventTypes: ["Tasting or crawl", "Listening or performance"],
      frequency: "Biweekly",
      groupSize: "10–15 guests",
      subscriptionAcknowledged: true,
      completed: false,
    },
  },
  {
    id: "crumbs-cafe",
    audienceGroup: "Ukrainian Village cafe & workshop",
    businessName: "Crumbs Cafe",
    email: "crumbs-cafe+clerk_test@example.com",
    username: "crumbs-cafe",
    neighborhood: "Ukrainian Village",
    category: "Coffee shop",
    partnerSlug: null,
    onboardingSample: {
      businessName: "Crumbs Cafe",
      neighborhood: "Ukrainian Village",
      category: "Coffee shop",
      contactEmail: "crumbs-cafe+clerk_test@example.com",
      eventTypes: ["Hands-on workshop", "Open studio night"],
      frequency: "Weekly",
      groupSize: "6–10 guests",
      subscriptionAcknowledged: true,
      completed: false,
    },
  },
  {
    id: "kiln-room",
    audienceGroup: "Logan Square ceramics studio",
    businessName: "The Kiln Room",
    email: "kiln-room+clerk_test@example.com",
    username: "kiln-room",
    neighborhood: "Logan Square",
    category: "Ceramics studio",
    partnerSlug: null,
    onboardingSample: {
      businessName: "The Kiln Room",
      neighborhood: "Logan Square",
      category: "Ceramics studio",
      contactEmail: "kiln-room+clerk_test@example.com",
      eventTypes: ["Hands-on workshop", "Open studio night"],
      frequency: "Weekly",
      groupSize: "10–15 guests",
      subscriptionAcknowledged: true,
      completed: false,
    },
  },
  {
    id: "half-lit",
    audienceGroup: "Wicker Park comedy & listening room",
    businessName: "Half Lit Listening Room",
    email: "half-lit+clerk_test@example.com",
    username: "half-lit",
    neighborhood: "Wicker Park",
    category: "Listening room",
    partnerSlug: null,
    onboardingSample: {
      businessName: "Half Lit Listening Room",
      neighborhood: "Wicker Park",
      category: "Listening room",
      contactEmail: "half-lit+clerk_test@example.com",
      eventTypes: ["Listening or performance", "Tasting or crawl"],
      frequency: "Biweekly",
      groupSize: "15–20 guests",
      subscriptionAcknowledged: true,
      completed: false,
    },
  },
  {
    id: "margin-notes",
    audienceGroup: "Pilsen bookshop & community room",
    businessName: "Margin Notes Bookshop",
    email: "margin-notes+clerk_test@example.com",
    username: "margin-notes",
    neighborhood: "Pilsen",
    category: "Bookshop",
    partnerSlug: null,
    onboardingSample: {
      businessName: "Margin Notes Bookshop",
      neighborhood: "Pilsen",
      category: "Bookshop",
      contactEmail: "margin-notes+clerk_test@example.com",
      eventTypes: ["Open studio night", "Hands-on workshop"],
      frequency: "Monthly",
      groupSize: "10–15 guests",
      subscriptionAcknowledged: true,
      completed: false,
    },
  },
];

const memberEmailSet = new Set(memberDemoPersonas.map((persona) => persona.email.toLowerCase()));
const businessEmailSet = new Set(businessDemoPersonas.map((persona) => persona.email.toLowerCase()));

export function findMemberDemoPersona(email: string | null | undefined): MemberDemoPersona | null {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return null;
  return memberDemoPersonas.find((persona) => persona.email.toLowerCase() === normalized) ?? null;
}

export function findBusinessDemoPersona(email: string | null | undefined): BusinessDemoPersona | null {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return null;
  return businessDemoPersonas.find((persona) => persona.email.toLowerCase() === normalized) ?? null;
}

export function isDemoMemberEmail(email: string | null | undefined): boolean {
  const normalized = email?.trim().toLowerCase();
  return Boolean(normalized && memberEmailSet.has(normalized));
}

export function isDemoBusinessEmail(email: string | null | undefined): boolean {
  const normalized = email?.trim().toLowerCase();
  return Boolean(normalized && businessEmailSet.has(normalized));
}

/** Show demo account panels on auth pages when enabled (default on in development). */
export function demoAccountHintsEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_SHOW_DEMO_ACCOUNT_HINTS?.trim().toLowerCase();
  if (flag === "false" || flag === "0") return false;
  if (flag === "true" || flag === "1") return true;
  return process.env.NODE_ENV === "development";
}
