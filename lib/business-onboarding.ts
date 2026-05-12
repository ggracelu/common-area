import {
  partnerEventTypes,
  partnerFrequencies,
  partnerGroupSizes,
  type PartnerEventType,
  type PartnerFrequency,
  type PartnerGroupSize,
} from "@/lib/business-partners";

export type BusinessOnboardingState = {
  businessName: string;
  neighborhood: string;
  category: string;
  contactEmail: string;
  eventTypes: PartnerEventType[];
  frequency: PartnerFrequency | "";
  groupSize: PartnerGroupSize | "";
  subscriptionAcknowledged: boolean;
  completed: boolean;
};

export const defaultBusinessOnboardingState = (): BusinessOnboardingState => ({
  businessName: "",
  neighborhood: "",
  category: "",
  contactEmail: "",
  eventTypes: [],
  frequency: "",
  groupSize: "",
  subscriptionAcknowledged: false,
  completed: false,
});

const STORAGE_PREFIX = "common-area:business-onboarding:";

function storageKey(userId: string | null) {
  return `${STORAGE_PREFIX}${userId ?? "guest"}`;
}

export function loadBusinessOnboardingState(userId: string | null): BusinessOnboardingState {
  if (typeof window === "undefined") {
    return defaultBusinessOnboardingState();
  }

  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return defaultBusinessOnboardingState();
    const parsed = JSON.parse(raw) as Partial<BusinessOnboardingState>;
    return {
      ...defaultBusinessOnboardingState(),
      ...parsed,
      eventTypes: Array.isArray(parsed.eventTypes)
        ? parsed.eventTypes.filter((value): value is PartnerEventType =>
            partnerEventTypes.includes(value as PartnerEventType),
          )
        : [],
      frequency: partnerFrequencies.includes(parsed.frequency as PartnerFrequency)
        ? (parsed.frequency as PartnerFrequency)
        : "",
      groupSize: partnerGroupSizes.includes(parsed.groupSize as PartnerGroupSize)
        ? (parsed.groupSize as PartnerGroupSize)
        : "",
    };
  } catch {
    return defaultBusinessOnboardingState();
  }
}

export function saveBusinessOnboardingState(userId: string | null, state: BusinessOnboardingState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(userId), JSON.stringify(state));
}

export function clearBusinessOnboardingState(userId: string | null) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey(userId));
}

export function isBusinessBasicsComplete(state: BusinessOnboardingState) {
  return Boolean(
    state.businessName.trim() &&
      state.neighborhood.trim() &&
      state.category.trim() &&
      state.contactEmail.trim(),
  );
}

export function isBusinessHostingComplete(state: BusinessOnboardingState) {
  return Boolean(state.eventTypes.length > 0 && state.frequency && state.groupSize);
}

export function isBusinessOnboardingComplete(state: BusinessOnboardingState) {
  return (
    state.completed &&
    isBusinessBasicsComplete(state) &&
    isBusinessHostingComplete(state) &&
    state.subscriptionAcknowledged
  );
}
