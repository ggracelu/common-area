import type { DemoVibeTag } from "@/lib/demo-data";

const VIBE_TO_PEOPLE_ADJECTIVE: Record<DemoVibeTag, string> = {
  "low-pressure": "easygoing",
  "hands-busy": "hands-on",
  "structured-fun": "playful",
  "food-forward": "food-loving",
  laughs: "funny",
  "walk-and-talk": "outdoorsy",
  cozy: "cozy",
  curious: "curious",
  creative: "creative",
  chatty: "chatty",
  "neighborhood-core": "neighborhood-proud",
};

export function cohortPeopleAdjective(vibeTags: readonly DemoVibeTag[]): string {
  const first = vibeTags[0];
  if (first && VIBE_TO_PEOPLE_ADJECTIVE[first]) {
    return VIBE_TO_PEOPLE_ADJECTIVE[first]!;
  }
  return "great";
}
