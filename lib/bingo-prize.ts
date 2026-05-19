const PRIZE_REVEAL_PREFIX = "common-area:bingo-prize-revealed:v1";
const COUPON_PREFIX = "common-area:bingo-coupon:v1";

const COUPON_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function bingoPrizeRevealKey(userId: string | null | undefined): string {
  return `${PRIZE_REVEAL_PREFIX}:${userId ?? "anon"}`;
}

export function hasBingoPrizeBeenRevealed(userId: string | null | undefined): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(bingoPrizeRevealKey(userId)) === "1";
}

export function markBingoPrizeRevealed(userId: string | null | undefined): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(bingoPrizeRevealKey(userId), "1");
}

function generateCouponCode(): string {
  let suffix = "";
  for (let i = 0; i < 6; i += 1) {
    suffix += COUPON_ALPHABET[Math.floor(Math.random() * COUPON_ALPHABET.length)]!;
  }
  return `CA5-${suffix}`;
}

export function getOrCreateBingoCouponCode(userId: string | null | undefined): string {
  const key = `${COUPON_PREFIX}:${userId ?? "anon"}`;
  if (typeof window === "undefined") return "CA5-PREVIEW";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const code = generateCouponCode();
  window.localStorage.setItem(key, code);
  return code;
}
