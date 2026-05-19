import type { AntiNetworkingIcebreaker } from "@/lib/chat-icebreaker";
import { demoData, getDemoEvent } from "@/lib/demo-data";
import type { DemoAppState } from "@/lib/demo-state";

export type SeasonChecklistItem = {
  id: string;
  label: string;
  detail?: string;
  done: boolean;
  href?: string;
};

export type SeasonChecklist = {
  seasonTitle: string;
  items: SeasonChecklistItem[];
  completedCount: number;
  totalCount: number;
};

function bingoTileIdForEvent(eventId: string): string | null {
  const tile = demoData.bingoTiles.find((t) => t.kind === "event" && t.eventId === eventId);
  return tile?.id ?? null;
}

function isEventAttended(eventId: string, completedTileIds: string[]): boolean {
  const tileId = bingoTileIdForEvent(eventId);
  if (!tileId) return false;
  return completedTileIds.includes(tileId);
}

export function buildSeasonChecklist({
  state,
  isSignedIn,
  chatIcebreaker,
}: {
  state: DemoAppState;
  isSignedIn: boolean;
  chatIcebreaker: AntiNetworkingIcebreaker | null;
}): SeasonChecklist {
  const { season } = demoData;
  const completedTileIds = state.bingo.completedTileIds;
  const challengeTiles = demoData.bingoTiles.filter((t) => t.kind === "challenge");
  const completedChallenges = challengeTiles.filter((t) => completedTileIds.includes(t.id));

  const signedUp =
    Boolean(state.selectionsCommittedAtISO) ||
    (state.depositStatus === "paid" && state.selectedEventIds.length >= season.requiredEventCount);

  const items: SeasonChecklistItem[] = [
    {
      id: "signup",
      label: "Sign up for the season",
      detail: signedUp
        ? "Deposit and activity picks on file."
        : `Pay deposit and pick ${season.requiredEventCount} activities.`,
      done: signedUp && isSignedIn,
      href: "/bingo",
    },
    {
      id: "chatroom",
      label: "Join the chatroom",
      detail: chatIcebreaker
        ? "Icebreaker posted — you're in."
        : "Answer one anti-networking icebreaker to unlock chat.",
      done: Boolean(chatIcebreaker),
      href: "/chat",
    },
  ];

  if (state.selectedEventIds.length === 0) {
    items.push({
      id: "picks-pending",
      label: "Choose your season activities",
      detail: `Pick ${season.requiredEventCount} on your bingo card.`,
      done: false,
      href: "/bingo",
    });
  } else {
    for (const eventId of state.selectedEventIds) {
      const event = getDemoEvent(eventId);
      const title = event?.title ?? "Season activity";
      const attended = isEventAttended(eventId, completedTileIds);
      items.push({
        id: `attend-${eventId}`,
        label: `Attend ${title}`,
        detail: attended
          ? "Stamped on your bingo card."
          : event?.startsAtISO
            ? new Date(event.startsAtISO).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            : "Stamp the matching square after you go.",
        done: attended,
        href: "/bingo",
      });
    }
  }

  const allChallengesDone =
    challengeTiles.length > 0 && completedChallenges.length === challengeTiles.length;

  items.push({
    id: "bonus-challenges",
    label: "Complete additional bingo challenges",
    detail:
      challengeTiles.length === 0
        ? "Bonus prompts unlock on your card."
        : `${completedChallenges.length} of ${challengeTiles.length} bonus prompts stamped`,
    done: allChallengesDone,
    href: "/bingo",
  });

  const completedCount = items.filter((item) => item.done).length;

  return {
    seasonTitle: season.name,
    items,
    completedCount,
    totalCount: items.length,
  };
}
