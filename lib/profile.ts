import type { AssignmentStatus, DepositStatus, OnboardingStatus, ProfilePreview, SelectionStatus } from "@/types/profile";

type ClerkUserLike = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  imageUrl?: string | null;
  primaryEmailAddress?: {
    emailAddress: string;
  } | null;
};

function deriveOnboardingStatus(
  depositStatus: DepositStatus,
  selectionStatus: SelectionStatus,
  assignmentStatus: AssignmentStatus,
): OnboardingStatus {
  if (assignmentStatus === "assigned") {
    return "active";
  }

  if (selectionStatus === "completed") {
    return "assignment_pending";
  }

  if (depositStatus === "paid") {
    return "selection_pending";
  }

  return "deposit_pending";
}

export function buildProfilePreviewFromClerkUser(
  user: ClerkUserLike | null,
): ProfilePreview {
  const depositStatus: DepositStatus = "pending";
  const selectionStatus: SelectionStatus = "not_started";
  const assignmentStatus: AssignmentStatus = "not_started";

  return {
    id: null,
    clerkUserId: user?.id ?? null,
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    displayName:
      user?.fullName ??
      ([user?.firstName, user?.lastName].filter(Boolean).join(" ") || null),
    avatarUrl: user?.imageUrl ?? null,
    onboardingStatus: deriveOnboardingStatus(
      depositStatus,
      selectionStatus,
      assignmentStatus,
    ),
    depositStatus,
    selectionStatus,
    assignmentStatus,
    createdAt: null,
    updatedAt: null,
  };
}
