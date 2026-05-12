"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  resetJourneyAction,
  undoBingoAction,
  undoDepositAction,
  undoMatchingAction,
  undoPicksAction,
  undoRevealAction,
} from "@/app/actions/grader-undo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  clearBingoProgress,
  clearFutureLetterPreview,
  clearMatchingState,
  clearSelections,
  resetDemoState,
  setDepositStatus,
} from "@/lib/demo-state";

type GraderControlPanelProps = {
  storageUserId: string | null;
  showWhenConfigured?: boolean;
};

type UndoKind = "deposit" | "picks" | "matching" | "reveal" | "bingo" | "reset";

const UNDO_ACTIONS: Record<Exclude<UndoKind, "reset">, () => Promise<{ ok: boolean; error?: string }>> = {
  deposit: undoDepositAction,
  picks: undoPicksAction,
  matching: undoMatchingAction,
  reveal: undoRevealAction,
  bingo: undoBingoAction,
};

function syncLocalUndo(kind: UndoKind, storageUserId: string | null) {
  if (kind === "reset") {
    resetDemoState(storageUserId);
    return;
  }

  if (kind === "deposit") {
    setDepositStatus("pending", storageUserId);
    return;
  }

  if (kind === "picks") {
    clearSelections(storageUserId);
    return;
  }

  if (kind === "matching") {
    clearMatchingState(storageUserId);
    return;
  }

  if (kind === "reveal") {
    clearFutureLetterPreview(storageUserId);
    return;
  }

  clearBingoProgress(storageUserId);
}

export function GraderControlPanel({ storageUserId, showWhenConfigured = true }: GraderControlPanelProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<UndoKind | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!showWhenConfigured) {
    return null;
  }

  async function runUndo(kind: UndoKind) {
    const label =
      kind === "reset"
        ? "Reset the full grader journey?"
        : `Undo ${kind} for this grader account?`;

    if (!window.confirm(label)) {
      return;
    }

    setBusy(kind);
    setError(null);

    const result =
      kind === "reset" ? await resetJourneyAction() : await UNDO_ACTIONS[kind]();

    if (!result.ok) {
      setError(result.error ?? "Undo failed.");
      setBusy(null);
      return;
    }

    syncLocalUndo(kind, storageUserId);
    router.refresh();
    setBusy(null);
  }

  return (
    <Card variant="paper" className="border border-dashed border-black/15 bg-white/70">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-black/55" style={{ fontFamily: "var(--font-mono)" }}>
        Grader controls
      </p>
      <p className="mt-2 text-sm text-[color:rgba(37,34,30,0.72)]">
        Undo persisted Supabase state and refresh local demo cache for QA reruns.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          data-testid="grader-undo-deposit"
          disabled={busy !== null}
          onClick={() => void runUndo("deposit")}
        >
          {busy === "deposit" ? "Undoing…" : "Undo deposit"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          data-testid="grader-undo-picks"
          disabled={busy !== null}
          onClick={() => void runUndo("picks")}
        >
          {busy === "picks" ? "Undoing…" : "Undo picks"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          data-testid="grader-undo-matching"
          disabled={busy !== null}
          onClick={() => void runUndo("matching")}
        >
          {busy === "matching" ? "Undoing…" : "Undo matching"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          data-testid="grader-undo-reveal"
          disabled={busy !== null}
          onClick={() => void runUndo("reveal")}
        >
          {busy === "reveal" ? "Undoing…" : "Undo reveal"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          data-testid="grader-undo-bingo"
          disabled={busy !== null}
          onClick={() => void runUndo("bingo")}
        >
          {busy === "bingo" ? "Undoing…" : "Undo bingo"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          data-testid="grader-reset-journey"
          disabled={busy !== null}
          onClick={() => void runUndo("reset")}
        >
          {busy === "reset" ? "Resetting…" : "Reset full journey"}
        </Button>
      </div>
      {error ? <p className="mt-3 text-sm text-red-800/80">{error}</p> : null}
    </Card>
  );
}
