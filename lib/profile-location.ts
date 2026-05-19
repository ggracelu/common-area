const STORAGE_PREFIX = "common-area:profile-location:v1";

export function profileLocationStorageKey(userId: string | null | undefined): string {
  if (userId) return `${STORAGE_PREFIX}:user:${userId}`;
  return `${STORAGE_PREFIX}:anon`;
}

export function loadProfileLocation(userId: string | null | undefined = null): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(profileLocationStorageKey(userId))?.trim() ?? "";
}

export function saveProfileLocation(value: string, userId: string | null | undefined = null): string {
  if (typeof window === "undefined") return value.trim();
  const trimmed = value.trim();
  window.localStorage.setItem(profileLocationStorageKey(userId), trimmed);
  return trimmed;
}
