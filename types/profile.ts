export type OnboardingStatus =
  | "created"
  | "deposit_pending"
  | "selection_pending"
  | "assignment_pending"
  | "active";

export type DepositStatus = "pending" | "paid" | "refunded" | "failed";

export type AssignmentStatus = "not_started" | "pending" | "assigned";

export type SelectionStatus = "not_started" | "in_progress" | "completed";

export type ProfilePreview = {
  id: null;
  clerkUserId: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  homeCity: string | null;
  onboardingStatus: OnboardingStatus;
  depositStatus: DepositStatus;
  selectionStatus: SelectionStatus;
  assignmentStatus: AssignmentStatus;
  createdAt: null;
  updatedAt: null;
};
