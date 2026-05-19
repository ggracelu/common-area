const STORAGE_PREFIX = "common-area:cohort-common-room-welcome:v1";

export function cohortCommonRoomWelcomeKey(
  userId: string | null | undefined,
  cohortId: string,
): string {
  return `${STORAGE_PREFIX}:${userId ?? "anon"}:${cohortId}`;
}

export function hasSeenCohortCommonRoomWelcome(
  userId: string | null | undefined,
  cohortId: string,
): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(cohortCommonRoomWelcomeKey(userId, cohortId)) === "1";
}

export function markCohortCommonRoomWelcomeSeen(
  userId: string | null | undefined,
  cohortId: string,
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(cohortCommonRoomWelcomeKey(userId, cohortId), "1");
}
