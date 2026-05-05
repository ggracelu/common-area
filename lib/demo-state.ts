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

const STORAGE_KEY = "common-area:demo-state:v1";

const defaultState: DemoAppState = {
  version: 1,
  updatedAtISO: new Date(0).toISOString(),
  depositStatus: "not_started",
  selectedEventIds: [],
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
    return { ...defaultState, ...state } as DemoAppState;
  } catch {
    return null;
  }
}

export function loadDemoState(): DemoAppState {
  if (typeof window === "undefined") return defaultState;
  const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY));
  return parsed ?? defaultState;
}

export function saveDemoState(next: DemoAppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function updateDemoState(updater: (prev: DemoAppState) => DemoAppState) {
  const prev = loadDemoState();
  const next = updater(prev);
  const stamped: DemoAppState = { ...next, updatedAtISO: new Date().toISOString() };
  saveDemoState(stamped);
  return stamped;
}

export function resetDemoState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function toggleDepositPaid(paid: boolean) {
  return updateDemoState((prev) => ({
    ...prev,
    depositStatus: paid ? "paid" : "pending",
  }));
}

export function setDepositStatus(status: DemoDepositStatus) {
  return updateDemoState((prev) => ({
    ...prev,
    depositStatus: status,
  }));
}

export function toggleSelectedEvent(eventId: string, limit = demoData.season.requiredEventCount) {
  return updateDemoState((prev) => {
    const exists = prev.selectedEventIds.includes(eventId);
    if (exists) {
      return { ...prev, selectedEventIds: prev.selectedEventIds.filter((id) => id !== eventId) };
    }
    if (prev.selectedEventIds.length >= limit) {
      return prev;
    }
    return { ...prev, selectedEventIds: [...prev.selectedEventIds, eventId] };
  });
}

export function clearSelections() {
  return updateDemoState((prev) => ({ ...prev, selectedEventIds: [] }));
}

export function toggleBingoTile(tileId: string) {
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
  });
}

export function addChatMessage(cohortId: string, body: string) {
  const trimmed = body.trim();
  if (!trimmed) return loadDemoState();

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
  });
}

export function getAssignedCohort(state: DemoAppState): DemoCohort | null {
  if (!state.matching.cohortId) return null;
  return getDemoCohort(state.matching.cohortId);
}

function inferCohortFromSelections(selectedEventIds: string[]) {
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

export function mailPostcardForMatching() {
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
  });
}

export function tickMatchingForward() {
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
  });
}

export function getBingoProgress(tiles: readonly DemoBingoTile[], state: DemoAppState) {
  const total = tiles.length;
  const completed = tiles.filter((tile) => state.bingo.completedTileIds.includes(tile.id)).length;
  const points = tiles
    .filter((tile) => state.bingo.completedTileIds.includes(tile.id))
    .reduce((sum, tile) => sum + tile.points, 0);

  return { total, completed, points };
}

