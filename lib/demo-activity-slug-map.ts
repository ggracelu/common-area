/**
 * Maps demo bingo `eventId` values (lib/demo-data) to catalog `activities.slug` (Supabase seed).
 */

export const DEMO_EVENT_TO_ACTIVITY_SLUG: Record<string, string> = {
  evt_pottery_after_dark: "pottery-night-logan-square",
  evt_weeknight_pasta: "group-cooking-class-west-loop",
  evt_small_room_comedy: "comedy-show-old-town",
  evt_pilsen_mural_walk: "mural-walk-pilsen",
  evt_cafe_crawl: "coffee-crawl-wicker-park",
  evt_board_game_bracket: "board-game-night-lakeview",
  evt_bookstore_browsing: "bookshop-browsing-lincoln-square",
  evt_flower_bar_mess: "flower-bar-ravenswood",
};

export const ACTIVITY_SLUG_TO_DEMO_EVENT: Record<string, string> = Object.fromEntries(
  Object.entries(DEMO_EVENT_TO_ACTIVITY_SLUG).map(([demoId, slug]) => [slug, demoId]),
);

export function demoEventIdsToSlugs(demoEventIds: string[]): string[] {
  return demoEventIds.map((id) => {
    const slug = DEMO_EVENT_TO_ACTIVITY_SLUG[id];
    if (!slug) {
      throw new Error(`Unknown demo event id for catalog mapping: ${id}`);
    }
    return slug;
  });
}
