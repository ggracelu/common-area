import type { AssignmentStatus, DepositStatus, OnboardingStatus, SelectionStatus } from "@/types/profile";

export type OnboardingSnapshot = {
  configured: boolean;
  profileId: string | null;
  onboardingStatus: OnboardingStatus;
  depositStatus: DepositStatus;
  selectionStatus: SelectionStatus;
  assignmentStatus: AssignmentStatus;
  selectionCount: number;
  selectionLocked: boolean;
  cohortId: string | null;
  cohortSlug: string | null;
  cohortDemoId: string | null;
  cohortRevealSeen: boolean;
  selectedActivitySlugs: string[];
  roster: CohortRosterMember[];
};

export type CohortRosterMember = {
  profileId: string;
  displayName: string | null;
  isSeed: boolean;
  isSelf: boolean;
};
