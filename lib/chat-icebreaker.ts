export type AntiNetworkingIcebreakerKind = "snack" | "talent" | "unfun-fact";

export type AntiNetworkingIcebreaker = {
  kind: AntiNetworkingIcebreakerKind;
  prompt: string;
  answer: string;
  completedAtISO: string;
};

export const antiNetworkingIcebreakerOptions: Array<{
  kind: AntiNetworkingIcebreakerKind;
  title: string;
  prompt: string;
  placeholder: string;
}> = [
  {
    kind: "snack",
    title: "Underrated snack",
    prompt: "An underrated snack you swear by",
    placeholder: "e.g. frozen grapes with Tajín, gas-station string cheese…",
  },
  {
    kind: "talent",
    title: "Hyperspecific talent",
    prompt: "A useless or hyperspecific talent you have",
    placeholder: "e.g. can identify any CTA stop by smell alone…",
  },
  {
    kind: "unfun-fact",
    title: "Un-fun fact",
    prompt: "An un-fun fact (something very mundane about yourself or any topic)",
    placeholder: "e.g. I always drink room-temperature water…",
  },
];

const STORAGE_PREFIX = "common-area:chat-icebreaker:v1";

export function chatIcebreakerStorageKey(userId: string | null | undefined): string {
  if (userId) return `${STORAGE_PREFIX}:user:${userId}`;
  return `${STORAGE_PREFIX}:anon`;
}

export function loadChatIcebreaker(userId: string | null | undefined = null): AntiNetworkingIcebreaker | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(chatIcebreakerStorageKey(userId));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AntiNetworkingIcebreaker;
    if (!parsed?.kind || !parsed.answer?.trim()) return null;
    return {
      ...parsed,
      answer: parsed.answer.trim(),
    };
  } catch {
    return null;
  }
}

export function saveChatIcebreaker(
  payload: Omit<AntiNetworkingIcebreaker, "completedAtISO">,
  userId: string | null | undefined = null,
): AntiNetworkingIcebreaker {
  const record: AntiNetworkingIcebreaker = {
    ...payload,
    answer: payload.answer.trim(),
    completedAtISO: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(chatIcebreakerStorageKey(userId), JSON.stringify(record));
  }
  return record;
}

export function icebreakerLabel(kind: AntiNetworkingIcebreakerKind): string {
  return antiNetworkingIcebreakerOptions.find((option) => option.kind === kind)?.title ?? "Icebreaker";
}
