/**
 * Demo-only client state store.
 *
 * Persisted in localStorage so the app feels coherent across routes without
 * claiming any server-side durability. This is intentionally local-only.
 */

import type { DemoBingoTile, DemoCohort, DemoEventType } from "@/lib/demo-data";
import { demoData, getDemoCohort } from "@/lib/demo-data";

export type DemoDepositStatus = "not_started" | "pending" | "paid";
export type DemoMatchingStatus = "not_started" | "mailing" | "pending" | "assigned";

export type DemoAppState = {
  version: 1;
  updatedAtISO: string;
  depositStatus: DemoDepositStatus;
  selectedEventIds: string[];
  /** Set after the user completes the bingo submit flow (deposit / matching step). */
  selectionsCommittedAtISO: string | null;
  /** Cohort ids for which the envelope letter reveal has been dismissed. */
  seenCohortRevealIds: string[];
  /**
   * Set after finishing the Future-tab cohort letter on `/dashboard`. Demo only: unlocks the full
   * `/cohort` experience; until then, assignment stays “in progress” outside Future preview.
   */
  futureCohortLetterPreviewDone: boolean;
  matching: {
    status: DemoMatchingStatus;
    mailedAtISO: string | null;
    assignedAtISO: string | null;
    cohortId: string | null;
  };
  bingo: {
    completedTileIds: string[];
  };
  chat: {
    messagesByCohortId: Record<string, { id: string; body: string; createdAtISO: string }[]>;
  };
};

/** Legacy single key (pre–per-user isolation). Migrated once into `:anon`. */
const LEGACY_DEMO_STORAGE_KEY = "common-area:demo-state:v1";

/**
 * localStorage key for demo state. Signed-in users each get their own bucket so picks/matching
 * do not leak across Clerk accounts on the same browser.
 */
export function demoStorageKey(userId: string | null | undefined): string {
  if (userId) return `${LEGACY_DEMO_STORAGE_KEY}:user:${userId}`;
  return `${LEGACY_DEMO_STORAGE_KEY}:anon`;
}

const defaultState: DemoAppState = {
  version: 1,
  updatedAtISO: new Date(0).toISOString(),
  depositStatus: "not_started",
  selectedEventIds: [],
  selectionsCommittedAtISO: null,
  seenCohortRevealIds: [],
  futureCohortLetterPreviewDone: false,
  matching: {
    status: "not_started",
    mailedAtISO: null,
    assignedAtISO: null,
    cohortId: null,
  },
  bingo: {
    completedTileIds: [],
  },
  chat: {
    messagesByCohortId: {},
  },
};

function safeParse(json: string | null): DemoAppState | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const state = parsed as Partial<DemoAppState>;
    if (state.version !== 1) return null;
    const merged = { ...defaultState, ...state } as DemoAppState;
    if (!Array.isArray(merged.seenCohortRevealIds)) {
      merged.seenCohortRevealIds = [];
    }
    if (merged.selectionsCommittedAtISO === undefined) {
      merged.selectionsCommittedAtISO = null;
    }
    merged.futureCohortLetterPreviewDone =
      typeof state.futureCohortLetterPreviewDone === "boolean"
        ? state.futureCohortLetterPreviewDone
        : false;
    merged.matching = { ...defaultState.matching, ...(state.matching ?? {}) };
    merged.bingo = { ...defaultState.bingo, ...(state.bingo ?? {}) };
    merged.chat = { ...defaultState.chat, ...(state.chat ?? {}) };
    return merged;
  } catch {
    return null;
  }
}

function readDemoStorageRaw(userId: string | null | undefined): string | null {
  if (typeof window === "undefined") return null;
  const key = demoStorageKey(userId);
  let raw = window.localStorage.getItem(key);
  if (!raw && (userId == null || userId === "")) {
    raw = window.localStorage.getItem(LEGACY_DEMO_STORAGE_KEY);
    if (raw) {
      window.localStorage.setItem(key, raw);
      window.localStorage.removeItem(LEGACY_DEMO_STORAGE_KEY);
    }
  }
  return raw;
}

/** @param userId Clerk user id when signed in; omit or null for the anonymous device bucket. */
export function loadDemoState(userId: string | null | undefined = null): DemoAppState {
  if (typeof window === "undefined") return defaultState;
  const parsed = safeParse(readDemoStorageRaw(userId));
  return parsed ?? defaultState;
}

export function saveDemoState(next: DemoAppState, userId: string | null | undefined = null) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(demoStorageKey(userId), JSON.stringify(next));
}

export function updateDemoState(
  updater: (prev: DemoAppState) => DemoAppState,
  userId: string | null | undefined = null,
) {
  const prev = loadDemoState(userId);
  const next = updater(prev);
  const stamped: DemoAppState = { ...next, updatedAtISO: new Date().toISOString() };
  saveDemoState(stamped, userId);
  return stamped;
}

export function resetDemoState(userId: string | null | undefined = null) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(demoStorageKey(userId));
  if (userId == null || userId === "") {
    window.localStorage.removeItem(LEGACY_DEMO_STORAGE_KEY);
  }
}

export function toggleDepositPaid(paid: boolean, userId: string | null | undefined = null) {
  return updateDemoState((prev) => ({
    ...prev,
    depositStatus: paid ? "paid" : "pending",
  }), userId);
}

export function setDepositStatus(status: DemoDepositStatus, userId: string | null | undefined = null) {
  return updateDemoState((prev) => ({
    ...prev,
    depositStatus: status,
  }), userId);
}

export function toggleSelectedEvent(
  eventId: string,
  userId: string | null | undefined = null,
  limit = demoData.season.requiredEventCount,
) {
  return updateDemoState((prev) => {
    const exists = prev.selectedEventIds.includes(eventId);
    if (exists) {
      return { ...prev, selectedEventIds: prev.selectedEventIds.filter((id) => id !== eventId) };
    }
    if (prev.selectedEventIds.length >= limit) {
      return prev;
    }
    return { ...prev, selectedEventIds: [...prev.selectedEventIds, eventId] };
  }, userId);
}

export function clearSelections(userId: string | null | undefined = null) {
  return updateDemoState((prev) => ({ ...prev, selectedEventIds: [] }), userId);
}

export function toggleBingoTile(tileId: string, userId: string | null | undefined = null) {
  return updateDemoState((prev) => {
    const completed = prev.bingo.completedTileIds.includes(tileId);
    return {
      ...prev,
      bingo: {
        completedTileIds: completed
          ? prev.bingo.completedTileIds.filter((id) => id !== tileId)
          : [...prev.bingo.completedTileIds, tileId],
      },
    };
  }, userId);
}

export function addChatMessage(cohortId: string, body: string, userId: string | null | undefined = null) {
  const trimmed = body.trim();
  if (!trimmed) return loadDemoState(userId);

  return updateDemoState((prev) => {
    const bucket = prev.chat.messagesByCohortId[cohortId] ?? [];
    const msg = {
      id: `local_${Date.now()}`,
      body: trimmed,
      createdAtISO: new Date().toISOString(),
    };
    return {
      ...prev,
      chat: {
        messagesByCohortId: {
          ...prev.chat.messagesByCohortId,
          [cohortId]: [...bucket, msg].slice(-60),
        },
      },
    };
  }, userId);
}

export function getAssignedCohort(state: DemoAppState): DemoCohort | null {
  if (!state.matching.cohortId) return null;
  return getDemoCohort(state.matching.cohortId);
}

/** Demo-only: which cohort bucket fits the user’s picks (same logic as assignment). */
export function inferCohortFromSelections(selectedEventIds: string[]): string {
  const picked = selectedEventIds
    .map((id) => demoData.events.find((evt) => evt.id === id))
    .filter(Boolean);

  const types = new Set<DemoEventType>();
  picked.forEach((evt) => types.add(evt!.activityType));

  const hasCraft = types.has("pottery") || types.has("flowers-craft") || types.has("bookstore");
  const hasFoodLaughs = types.has("cooking") || types.has("comedy");
  const hasWalkGames = types.has("walking-tour") || types.has("board-games");

  if (hasCraft) return "coh_art_room";
  if (hasFoodLaughs) return "coh_table_laughs";
  if (hasWalkGames) return "coh_city_strollers";

  return "coh_city_strollers";
}

export function mailPostcardForMatching(userId: string | null | undefined = null) {
  const now = new Date();

  return updateDemoState((prev) => {
    if (prev.selectedEventIds.length < demoData.season.requiredEventCount) return prev;
    if (prev.depositStatus !== "paid") return prev;

    // If already assigned, don't reset.
    if (prev.matching.status === "assigned") return prev;

    return {
      ...prev,
      matching: {
        status: "mailing",
        mailedAtISO: now.toISOString(),
        assignedAtISO: null,
        cohortId: null,
      },
    };
  }, userId);
}

export function tickMatchingForward(userId: string | null | undefined = null) {
  return updateDemoState((prev) => {
    const mailed = prev.matching.mailedAtISO ? new Date(prev.matching.mailedAtISO).getTime() : null;
    if (!mailed) return prev;

    // After 4 seconds: pending.
    const elapsedMs = Date.now() - mailed;
    if (prev.matching.status === "mailing" && elapsedMs > 4000) {
      return { ...prev, matching: { ...prev.matching, status: "pending" } };
    }

    // After 9 seconds: assigned.
    if (elapsedMs > 9000 && prev.matching.status !== "assigned") {
      const cohortId = inferCohortFromSelections(prev.selectedEventIds);
      return {
        ...prev,
        matching: {
          status: "assigned",
          mailedAtISO: prev.matching.mailedAtISO,
          assignedAtISO: new Date().toISOString(),
          cohortId,
        },
      };
    }

    return prev;
  }, userId);
}

export function markSelectionsCommitted(userId: string | null | undefined = null) {
  return updateDemoState((prev) => {
    if (prev.selectionsCommittedAtISO) return prev;
    return { ...prev, selectionsCommittedAtISO: new Date().toISOString() };
  }, userId);
}

export function markCohortRevealSeen(cohortId: string, userId: string | null | undefined = null) {
  return updateDemoState((prev) => {
    if (prev.seenCohortRevealIds.includes(cohortId)) return prev;
    return {
      ...prev,
      seenCohortRevealIds: [...prev.seenCohortRevealIds, cohortId],
    };
  }, userId);
}

export function markFutureCohortLetterPreviewDone(userId: string | null | undefined = null) {
  return updateDemoState((prev) => {
    if (prev.futureCohortLetterPreviewDone) return prev;
    return { ...prev, futureCohortLetterPreviewDone: true };
  }, userId);
}

export function getBingoProgress(tiles: readonly DemoBingoTile[], state: DemoAppState) {
  const total = tiles.length;
  const completed = tiles.filter((tile) => state.bingo.completedTileIds.includes(tile.id)).length;
  const points = tiles
    .filter((tile) => state.bingo.completedTileIds.includes(tile.id))
    .reduce((sum, tile) => sum + tile.points, 0);

  return { total, completed, points };
}

