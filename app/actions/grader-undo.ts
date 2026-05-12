"use server";

import {
  resetJourneyForGrader,
  undoBingoForGrader,
  undoDepositForGrader,
  undoMatchingForGrader,
  undoPicksForGrader,
  undoRevealForGrader,
} from "@/lib/grader-undo";

async function runUndo(action: () => Promise<void>) {
  try {
    await action();
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Undo failed.",
    };
  }
}

export async function undoDepositAction() {
  return runUndo(undoDepositForGrader);
}

export async function undoPicksAction() {
  return runUndo(undoPicksForGrader);
}

export async function undoMatchingAction() {
  return runUndo(undoMatchingForGrader);
}

export async function undoRevealAction() {
  return runUndo(undoRevealForGrader);
}

export async function undoBingoAction() {
  return runUndo(undoBingoForGrader);
}

export async function resetJourneyAction() {
  return runUndo(resetJourneyForGrader);
}
