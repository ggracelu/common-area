import type { OnboardingSnapshot } from "@/types/onboarding";

export type GraderOnboardingStage =
  | "signed_up"
  | "deposit_paid"
  | "picks_locked"
  | "assigned"
  | "reveal_seen"
  | "bingo_unlocked";

export type GraderChecklistItem = {
  stage: GraderOnboardingStage;
  label: string;
  done: boolean;
  testId: string;
  footnote?: string;
};

export function deriveGraderOnboardingStage(snapshot: OnboardingSnapshot | null): GraderOnboardingStage {
  if (!snapshot?.configured || snapshot.depositStatus !== "paid") {
    return "signed_up";
  }

  if (!snapshot.selectionLocked && snapshot.selectionCount < 4) {
    return "deposit_paid";
  }

  if (snapshot.assignmentStatus !== "assigned") {
    return "picks_locked";
  }

  if (!snapshot.cohortRevealSeen) {
    return "assigned";
  }

  return "bingo_unlocked";
}

export function buildGraderChecklist({
  snapshot,
  hasEnoughPicks,
  hasPaid,
  letterPreviewDone,
  cohortPageReady,
  bingoBonusReady,
}: {
  snapshot: OnboardingSnapshot | null;
  hasEnoughPicks: boolean;
  hasPaid: boolean;
  letterPreviewDone: boolean;
  cohortPageReady: boolean;
  bingoBonusReady: boolean;
}): GraderChecklistItem[] {
  const serverAuthoritative = Boolean(snapshot?.configured);

  if (serverAuthoritative) {
    return [
      {
        stage: "deposit_paid",
        label: "Secure your spot ($20 deposit)",
        done: snapshot?.depositStatus === "paid",
        testId: "grader-checklist-deposit",
      },
      {
        stage: "picks_locked",
        label: "Pick 4 experiences",
        done: Boolean(snapshot?.selectionLocked || (snapshot?.selectionCount ?? 0) >= 4),
        testId: "grader-checklist-picks",
      },
      {
        stage: "assigned",
        label: "Cohort matching",
        done: snapshot?.assignmentStatus === "assigned",
        testId: "grader-checklist-matching",
        footnote:
          snapshot?.assignmentStatus === "pending"
            ? "Matching is running from your saved picks."
            : undefined,
      },
      {
        stage: "reveal_seen",
        label: "Open your cohort letter",
        done: Boolean(snapshot?.cohortRevealSeen),
        testId: "grader-checklist-letter",
        footnote: snapshot?.cohortRevealSeen ? undefined : "Finish the Future tab letter to unlock your cohort page.",
      },
      {
        stage: "reveal_seen",
        label: "Visit your cohort room",
        done: cohortPageReady,
        testId: "grader-checklist-cohort",
      },
      {
        stage: "bingo_unlocked",
        label: "Bingo bonus tiles",
        done: bingoBonusReady,
        testId: "grader-checklist-bingo",
      },
    ];
  }

  return [
    {
      stage: "deposit_paid",
      label: "Secure your spot ($20 deposit)",
      done: hasPaid,
      testId: "grader-checklist-deposit",
    },
    {
      stage: "picks_locked",
      label: "Pick 4 experiences",
      done: hasEnoughPicks,
      testId: "grader-checklist-picks",
    },
    {
      stage: "assigned",
      label: "Cohort matching",
      done: letterPreviewDone || cohortPageReady,
      testId: "grader-checklist-matching",
    },
    {
      stage: "reveal_seen",
      label: "Open your cohort letter",
      done: letterPreviewDone,
      testId: "grader-checklist-letter",
      footnote: letterPreviewDone ? undefined : "Finish the Future tab letter to unlock your cohort page.",
    },
    {
      stage: "reveal_seen",
      label: "Visit your cohort room",
      done: cohortPageReady,
      testId: "grader-checklist-cohort",
    },
    {
      stage: "bingo_unlocked",
      label: "Bingo bonus tiles",
      done: bingoBonusReady,
      testId: "grader-checklist-bingo",
    },
  ];
}
