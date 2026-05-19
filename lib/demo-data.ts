/**
 * Demo-only app data for product surfaces.
 *
 * This file exists to make the signed-in experience feel real and demoable
 * before payments, cohort assignment, chat persistence, and bingo persistence
 * are implemented server-side.
 *
 * IMPORTANT:
 * - This is not a backend or a source of truth.
 * - Do not claim webhook-confirmed payments or realtime chat when using this data.
 * - Any per-user progress should be stored locally (demo state) and clearly labeled.
 */

export type DemoNeighborhood =
  | "Logan Square"
  | "Wicker Park"
  | "Pilsen"
  | "West Loop"
  | "Old Town"
  | "Lakeview"
  | "Hyde Park"
  | "Lincoln Square"
  | "Uptown"
  | "Ravenswood";

export type DemoVibeTag =
  | "low-pressure"
  | "hands-busy"
  | "structured-fun"
  | "food-forward"
  | "laughs"
  | "walk-and-talk"
  | "cozy"
  | "chatty"
  | "curious"
  | "creative"
  | "neighborhood-core";

export type DemoBusiness = {
  id: string;
  name: string;
  neighborhood: DemoNeighborhood;
  address: string;
  description: string;
  vibeTags: DemoVibeTag[];
  imageUrl?: string;
  costNote?: string;
};

export type DemoEventType =
  | "pottery"
  | "cooking"
  | "comedy"
  | "cafe"
  | "bookstore"
  | "board-games"
  | "walking-tour"
  | "flowers-craft";

export type DemoEvent = {
  id: string;
  title: string;
  businessId: string;
  neighborhood: DemoNeighborhood;
  address: string;
  startsAtISO: string;
  durationMinutes: number;
  cost: string;
  description: string;
  activityType: DemoEventType;
  vibe: string;
  vibeTags: DemoVibeTag[];
  capacity: number;
  imageUrl?: string;
  countsTowardCohortEvents: boolean;
  isBonusChallengeEvent: boolean;
};

export type DemoProfilePrompt = {
  question: string;
  answer: string;
};

export type DemoUser = {
  id: string;
  firstName: string;
  displayName: string; // first name + last initial, or nickname
  neighborhood: DemoNeighborhood;
  bio: string;
  commonRoomFact: string;
  prompt: DemoProfilePrompt;
  preferenceTags: DemoEventType[];
  avatar: { kind: "initials"; value: string };
  avatarImageUrl?: string;
};

export type DemoCohort = {
  id: string;
  name: string;
  slug: string;
  theme: string;
  /** Short phrase for welcome letter: “19 other ___ people”. */
  peopleDescriptor: string;
  vibeTags: DemoVibeTag[];
  memberIds: string[];
  sharedEventTypeOverlap: DemoEventType[];
  featuredEventIds: string[];
  whyThisCohortWorks: string[];
};

export type DemoBingoTileKind = "event" | "challenge" | "free";

export type DemoBingoTile = {
  id: string;
  kind: DemoBingoTileKind;
  title: string;
  description: string;
  points: number;
  eventId?: string;
  stampLabel: string;
  photo?: {
    url: string;
    alt: string;
    title: string;
    caption?: string;
  };
};

export type DemoChatMessage = {
  id: string;
  authorUserId: string; // "system" for Crumbs messages
  body: string;
  createdAtISO: string;
};

export type DemoChatThread = {
  cohortId: string;
  seededMessages: DemoChatMessage[];
};

const businesses: DemoBusiness[] = [
  {
    id: "biz_kiln_and_kettle",
    name: "Kiln & Kettle Studio",
    neighborhood: "Logan Square",
    address: "2543 N Milwaukee Ave, Chicago, IL",
    description: "A hands-busy pottery studio with aprons, playlists, and a very forgiving vibe.",
    vibeTags: ["hands-busy", "creative", "low-pressure", "neighborhood-core"],
    imageUrl:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=2200&q=80",
    costNote: "Clay + firing included.",
  },
  {
    id: "biz_table_argument",
    name: "Table Argument Cooking School",
    neighborhood: "West Loop",
    address: "1042 W Fulton Market, Chicago, IL",
    description:
      "Group cooking classes where the only competitive energy is about who chops onions fastest.",
    vibeTags: ["food-forward", "structured-fun", "chatty", "curious"],
    imageUrl:
      "https://images.unsplash.com/photo-1541544181051-e46601a2b4b4?auto=format&fit=crop&w=2200&q=80",
    costNote: "BYO curiosity. We handle the knives.",
  },
  {
    id: "biz_half_lit",
    name: "Half-Lit Comedy Room",
    neighborhood: "Old Town",
    address: "1627 N Wells St, Chicago, IL",
    description: "A small comedy room with big laughs and the social comfort of shared reactions.",
    vibeTags: ["laughs", "low-pressure", "structured-fun", "chatty"],
    imageUrl:
      "https://images.unsplash.com/photo-1525013066838-2a516dcd3b0b?auto=format&fit=crop&w=2200&q=80",
    costNote: "Two-drink minimum encouraged, not enforced by vibes.",
  },
  {
    id: "biz_cafe_warmth",
    name: "Warmthproof Café",
    neighborhood: "Wicker Park",
    address: "1530 N Damen Ave, Chicago, IL",
    description: "Coffee, pastries, and tables that make it normal to talk to someone new.",
    vibeTags: ["cozy", "low-pressure", "neighborhood-core", "chatty"],
    imageUrl:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=2200&q=80",
  },
  {
    id: "biz_margin_notes",
    name: "Margin Notes Bookshop",
    neighborhood: "Lincoln Square",
    address: "4619 N Lincoln Ave, Chicago, IL",
    description:
      "Used books, zines, and a bulletin board that feels like a campus hallway.",
    vibeTags: ["cozy", "curious", "neighborhood-core", "creative"],
    imageUrl:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=2200&q=80",
  },
  {
    id: "biz_dice_and_totes",
    name: "Dice & Totes Game Café",
    neighborhood: "Lakeview",
    address: "3021 N Clark St, Chicago, IL",
    description:
      "Board games + snacks + an excuse to laugh without needing a perfect opener.",
    vibeTags: ["structured-fun", "laughs", "low-pressure", "chatty"],
    imageUrl:
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=2200&q=80",
  },
  {
    id: "biz_pilsen_lines",
    name: "Pilsen Lines Walk Club",
    neighborhood: "Pilsen",
    address: "1800 S Blue Island Ave, Chicago, IL",
    description:
      "A mural route and walking tour that turns conversation into something you do while moving.",
    vibeTags: ["walk-and-talk", "curious", "low-pressure", "neighborhood-core"],
    imageUrl:
      "https://images.unsplash.com/photo-1520975958225-3f61c01fb1bb?auto=format&fit=crop&w=2200&q=80",
  },
  {
    id: "biz_petals_and_pins",
    name: "Petals & Pins Craft Bar",
    neighborhood: "Ravenswood",
    address: "4921 N Damen Ave, Chicago, IL",
    description:
      "Flower arranging meets craft-night chaos. You leave with something pretty and a new fact about someone.",
    vibeTags: ["creative", "hands-busy", "cozy", "chatty"],
    imageUrl:
      "https://images.unsplash.com/photo-1526045431048-f857369baa09?auto=format&fit=crop&w=2200&q=80",
    costNote: "Stems included. Dramatic ribbon optional.",
  },
];

// A single “season” worth of events (enough density to feel like a real catalog).
const events: DemoEvent[] = [
  {
    id: "evt_pottery_after_dark",
    title: "Pottery After Dark",
    businessId: "biz_kiln_and_kettle",
    neighborhood: "Logan Square",
    address: businesses[0].address,
    startsAtISO: "2026-06-10T23:00:00.000Z",
    durationMinutes: 105,
    cost: "$38",
    description:
      "Wheel basics + glaze snacks. You will absolutely make something crooked. That’s the point.",
    activityType: "pottery",
    vibe: "Messy hands, easy conversation, neighborhood energy.",
    vibeTags: ["hands-busy", "creative", "low-pressure", "neighborhood-core"],
    capacity: 18,
    imageUrl: businesses[0].imageUrl,
    countsTowardCohortEvents: true,
    isBonusChallengeEvent: false,
  },
  {
    id: "evt_clay_and_cafe",
    title: "Clay + Café Hang",
    businessId: "biz_kiln_and_kettle",
    neighborhood: "Logan Square",
    address: businesses[0].address,
    startsAtISO: "2026-06-18T00:00:00.000Z",
    durationMinutes: 90,
    cost: "$24",
    description:
      "Hand-building session, then a short walk for coffee. The best conversations happen while rinsing tools.",
    activityType: "pottery",
    vibe: "Hands busy, brain relaxed.",
    vibeTags: ["hands-busy", "walk-and-talk", "cozy", "low-pressure"],
    capacity: 22,
    countsTowardCohortEvents: true,
    isBonusChallengeEvent: false,
  },
  {
    id: "evt_weeknight_pasta",
    title: "Weeknight Pasta (No Ego Edition)",
    businessId: "biz_table_argument",
    neighborhood: "West Loop",
    address: businesses[1].address,
    startsAtISO: "2026-06-12T00:00:00.000Z",
    durationMinutes: 120,
    cost: "$45",
    description:
      "Make fresh pasta in pairs. You’ll do the thing where you pretend you’re not proud of your noodles. You are.",
    activityType: "cooking",
    vibe: "A shared table and a little chaos.",
    vibeTags: ["food-forward", "structured-fun", "chatty", "low-pressure"],
    capacity: 20,
    imageUrl: businesses[1].imageUrl,
    countsTowardCohortEvents: true,
    isBonusChallengeEvent: false,
  },
  {
    id: "evt_dumplings_and_gossip",
    title: "Dumplings + Neighborhood Lore",
    businessId: "biz_table_argument",
    neighborhood: "West Loop",
    address: businesses[1].address,
    startsAtISO: "2026-06-21T19:00:00.000Z",
    durationMinutes: 110,
    cost: "$42",
    description:
      "Fold dumplings, trade your most niche Chicago recommendation, and argue gently about the best corner store snack.",
    activityType: "cooking",
    vibe: "Food does some of the social work.",
    vibeTags: ["food-forward", "chatty", "curious", "low-pressure"],
    capacity: 18,
    countsTowardCohortEvents: true,
    isBonusChallengeEvent: false,
  },
  {
    id: "evt_small_room_comedy",
    title: "Small Room Comedy Night",
    businessId: "biz_half_lit",
    neighborhood: "Old Town",
    address: businesses[2].address,
    startsAtISO: "2026-06-14T01:00:00.000Z",
    durationMinutes: 95,
    cost: "$22",
    description:
      "A tight lineup and an even tighter room. Laughing together is the least awkward form of bonding.",
    activityType: "comedy",
    vibe: "Shared reactions, built-in conversation starter.",
    vibeTags: ["laughs", "structured-fun", "low-pressure"],
    capacity: 35,
    imageUrl: businesses[2].imageUrl,
    countsTowardCohortEvents: true,
    isBonusChallengeEvent: false,
  },
  {
    id: "evt_open_mic_mess",
    title: "Open Mic: The Brave Little Mess",
    businessId: "biz_half_lit",
    neighborhood: "Old Town",
    address: businesses[2].address,
    startsAtISO: "2026-06-23T00:30:00.000Z",
    durationMinutes: 90,
    cost: "$12",
    description:
      "Come watch. Optional: read a story, a poem, or a deeply unserious review of a sandwich.",
    activityType: "comedy",
    vibe: "Low-stakes courage and friendly heckles (the nice kind).",
    vibeTags: ["laughs", "creative", "low-pressure", "chatty"],
    capacity: 40,
    countsTowardCohortEvents: false,
    isBonusChallengeEvent: true,
  },
  {
    id: "evt_cafe_crawl",
    title: "Café Crawl: Three Cups, One Afternoon",
    businessId: "biz_cafe_warmth",
    neighborhood: "Wicker Park",
    address: businesses[3].address,
    startsAtISO: "2026-06-15T18:00:00.000Z",
    durationMinutes: 120,
    cost: "$15–$25",
    description:
      "Start with espresso, end with a weird seasonal pastry. Walking between cafés is the conversation buffer.",
    activityType: "cafe",
    vibe: "Cozy movement, low-pressure catch-up energy.",
    vibeTags: ["walk-and-talk", "cozy", "low-pressure", "neighborhood-core"],
    capacity: 24,
    imageUrl: businesses[3].imageUrl,
    countsTowardCohortEvents: true,
    isBonusChallengeEvent: false,
  },
  {
    id: "evt_bookstore_browsing",
    title: "Bookshop Browsing + Bulletin Board Spotting",
    businessId: "biz_margin_notes",
    neighborhood: "Lincoln Square",
    address: businesses[4].address,
    startsAtISO: "2026-06-16T23:30:00.000Z",
    durationMinutes: 75,
    cost: "Free (unless you cave)",
    description:
      "Browse, find a strange title, write a note for the flyer wall, and leave with a new micro-obsession.",
    activityType: "bookstore",
    vibe: "Curiosity with a side of paper textures.",
    vibeTags: ["cozy", "curious", "creative", "low-pressure"],
    capacity: 28,
    imageUrl: businesses[4].imageUrl,
    countsTowardCohortEvents: false,
    isBonusChallengeEvent: true,
  },
  {
    id: "evt_zines_and_stickers",
    title: "Zines, Stickers, and Overly Specific Recommendations",
    businessId: "biz_margin_notes",
    neighborhood: "Lincoln Square",
    address: businesses[4].address,
    startsAtISO: "2026-06-25T23:00:00.000Z",
    durationMinutes: 90,
    cost: "$0–$18",
    description:
      "Make a tiny zine page, swap stickers, and tell someone your most niche Chicago rec. No gatekeeping allowed.",
    activityType: "bookstore",
    vibe: "Campus club fair energy without the clipboard.",
    vibeTags: ["creative", "chatty", "curious", "low-pressure"],
    capacity: 22,
    countsTowardCohortEvents: false,
    isBonusChallengeEvent: true,
  },
  {
    id: "evt_board_game_bracket",
    title: "Board Game Night: No Rules Lawyers Allowed",
    businessId: "biz_dice_and_totes",
    neighborhood: "Lakeview",
    address: businesses[5].address,
    startsAtISO: "2026-06-19T00:00:00.000Z",
    durationMinutes: 120,
    cost: "$10 cover + snacks",
    description:
      "Pick a table, pick a game, and choose your emergency side-quest role: navigator, snack finder, hype person, documentarian.",
    activityType: "board-games",
    vibe: "Structured fun that makes conversation effortless.",
    vibeTags: ["structured-fun", "laughs", "chatty", "low-pressure"],
    capacity: 30,
    imageUrl: businesses[5].imageUrl,
    countsTowardCohortEvents: true,
    isBonusChallengeEvent: false,
  },
  {
    id: "evt_coop_game_quest",
    title: "Co-op Game Quest: Save the City (Gently)",
    businessId: "biz_dice_and_totes",
    neighborhood: "Lakeview",
    address: businesses[5].address,
    startsAtISO: "2026-06-28T20:00:00.000Z",
    durationMinutes: 105,
    cost: "$10 cover",
    description:
      "A co-op game night where teamwork is mandatory and taking it too seriously is banned.",
    activityType: "board-games",
    vibe: "Teamwork without corporate energy.",
    vibeTags: ["structured-fun", "laughs", "low-pressure"],
    capacity: 26,
    countsTowardCohortEvents: false,
    isBonusChallengeEvent: true,
  },
  {
    id: "evt_pilsen_mural_walk",
    title: "Mural Walk: Pilsen Lines",
    businessId: "biz_pilsen_lines",
    neighborhood: "Pilsen",
    address: businesses[6].address,
    startsAtISO: "2026-06-13T17:00:00.000Z",
    durationMinutes: 90,
    cost: "$0 (tips appreciated)",
    description:
      "A guided mural route with time for wandering. Bonus points if you name a campus cat you’d put on a flyer.",
    activityType: "walking-tour",
    vibe: "Walk-and-talk with color and context.",
    vibeTags: ["walk-and-talk", "curious", "neighborhood-core", "low-pressure"],
    capacity: 34,
    imageUrl: businesses[6].imageUrl,
    countsTowardCohortEvents: true,
    isBonusChallengeEvent: false,
  },
  {
    id: "evt_flower_bar_mess",
    title: "Flower Bar: Make Something Pretty (On Purpose)",
    businessId: "biz_petals_and_pins",
    neighborhood: "Ravenswood",
    address: businesses[7].address,
    startsAtISO: "2026-06-17T23:00:00.000Z",
    durationMinutes: 80,
    cost: "$32",
    description:
      "Arrange stems, trade chaotic comfort meals, and leave with a bouquet that looks like a personality test.",
    activityType: "flowers-craft",
    vibe: "Hands busy, nervous system calmer.",
    vibeTags: ["hands-busy", "creative", "cozy", "chatty"],
    capacity: 20,
    imageUrl: businesses[7].imageUrl,
    countsTowardCohortEvents: false,
    isBonusChallengeEvent: true,
  },
];

const firstNames = [
  "Ari",
  "Maya",
  "Jordan",
  "Sam",
  "Noah",
  "Leah",
  "Dev",
  "Talia",
  "Owen",
  "Rina",
  "Cam",
  "Jules",
  "Nina",
  "Eli",
  "Sasha",
  "Inez",
  "Miles",
  "Kira",
  "Kai",
  "Zoë",
];

const lastInitials = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R"];

const neighborhoods: DemoNeighborhood[] = [
  "Logan Square",
  "Wicker Park",
  "Pilsen",
  "West Loop",
  "Old Town",
  "Lakeview",
  "Hyde Park",
  "Lincoln Square",
  "Uptown",
  "Ravenswood",
];

const bios = [
  "New-ish to the neighborhood and trying to become a regular somewhere.",
  "Here for low-pressure plans and high-quality snacks.",
  "I like a plan that has a point (and an exit time).",
  "Down for crafts, walks, and laughing at dumb jokes.",
  "Trying to replace doomscrolling with leaving the house, gently.",
  "If it involves a bulletin board, I’m listening.",
];

const facts = [
  "Owns 14 tote bags and can justify every single one.",
  "Has a deeply unserious hometown legend they’ll tell if asked.",
  "Walk-home song is embarrassing, but it works.",
  "Can identify three neighborhoods by the smell of coffee alone.",
  "Chaotic comfort meal: cereal at 10pm. No regrets.",
  "Would absolutely start a fake student club for fun.",
];

const prompts: DemoProfilePrompt[] = [
  { question: "What would your fake student club be called?", answer: "The Committee for Snacks & Vibes." },
  { question: "Pick your emergency side-quest role.", answer: "Snack finder (with maps)." },
  { question: "Which snack best represents your communication style?", answer: "A polite chip with a surprise kick." },
  { question: "What useless talent are you bringing?", answer: "Naming cats like it’s a sport." },
  { question: "What object is in your dorm-room starter pack?", answer: "A stapler I’m weirdly protective of." },
];

function initialsFor(displayName: string) {
  return displayName
    .split(" ")
    .map((part) => part.slice(0, 1).toUpperCase())
    .join("")
    .slice(0, 2);
}

function rotate<T>(arr: T[], index: number) {
  const i = ((index % arr.length) + arr.length) % arr.length;
  return arr[i]!;
}

function buildDemoUsers(): DemoUser[] {
  const users: DemoUser[] = [];
  const preferencePools: DemoEventType[][] = [
    ["pottery", "flowers-craft", "bookstore", "cafe"],
    ["cooking", "comedy", "cafe", "walking-tour"],
    ["board-games", "cafe", "walking-tour", "bookstore"],
  ];

  for (let cohortIndex = 0; cohortIndex < 3; cohortIndex += 1) {
    for (let i = 0; i < 20; i += 1) {
      const baseName = rotate(firstNames, i + cohortIndex * 3);
      const initial = rotate(lastInitials, i + cohortIndex * 5);
      const displayName = `${baseName} ${initial}.`;
      const neighborhood = rotate(neighborhoods, i + cohortIndex * 2);
      const bio = rotate(bios, i + cohortIndex);
      const fact = rotate(facts, i + cohortIndex * 4);
      const prompt = rotate(prompts, i + cohortIndex * 2);
      const preferenceTags = rotate(preferencePools, cohortIndex);

      users.push({
        id: `usr_${cohortIndex + 1}_${String(i + 1).padStart(2, "0")}`,
        firstName: baseName,
        displayName,
        neighborhood,
        bio,
        commonRoomFact: fact,
        prompt,
        preferenceTags,
        avatar: { kind: "initials", value: initialsFor(displayName) },
        avatarImageUrl: `https://i.pravatar.cc/160?img=${((i + cohortIndex * 7) % 70) + 1}`,
      });
    }
  }

  return users;
}

const users = buildDemoUsers();

const cohorts: DemoCohort[] = [
  {
    id: "coh_art_room",
    name: "The Art Room Regulars",
    slug: "art-room-regulars",
    theme: "Pottery, cafe routes, and hands-busy plans that make talking easier.",
    peopleDescriptor: "creative",
    vibeTags: ["hands-busy", "creative", "cozy", "low-pressure"],
    memberIds: users.slice(0, 20).map((u) => u.id),
    sharedEventTypeOverlap: ["pottery", "cafe"],
    featuredEventIds: ["evt_pottery_after_dark", "evt_cafe_crawl", "evt_bookstore_browsing"],
    whyThisCohortWorks: [
      "You picked hands-busy activities (talking gets easier when your hands are occupied).",
      "You like cozy third places with repeatable routines (studio + café energy).",
      "Your cohort shares at least two overlapping activity types where the season mix allows it.",
    ],
  },
  {
    id: "coh_table_laughs",
    name: "Table + Laughs Department",
    slug: "table-and-laughs",
    theme: "Cooking, comedy, and the gentle power of shared reactions.",
    peopleDescriptor: "snack-happy",
    vibeTags: ["food-forward", "laughs", "chatty", "structured-fun"],
    memberIds: users.slice(20, 40).map((u) => u.id),
    sharedEventTypeOverlap: ["cooking", "comedy"],
    featuredEventIds: ["evt_weeknight_pasta", "evt_small_room_comedy", "evt_cafe_crawl"],
    whyThisCohortWorks: [
      "You picked food-forward plans (a shared table does some of the social work).",
      "Comedy is a built-in conversation starter (less pressure, more momentum).",
      "You share a food + laughs overlap with the group.",
    ],
  },
  {
    id: "coh_city_strollers",
    name: "Neighborhood Strollers Union",
    slug: "neighborhood-strollers",
    theme: "Walk-and-talk, games, and low-stakes plans that keep you moving.",
    peopleDescriptor: "curious",
    vibeTags: ["walk-and-talk", "structured-fun", "curious", "neighborhood-core"],
    memberIds: users.slice(40, 60).map((u) => u.id),
    sharedEventTypeOverlap: ["walking-tour", "board-games"],
    featuredEventIds: ["evt_pilsen_mural_walk", "evt_board_game_bracket", "evt_cafe_crawl"],
    whyThisCohortWorks: [
      "You picked plans with movement (walk-and-talk makes first hangs less intense).",
      "Games give the night a point (structured fun without corporate energy).",
      "You share a walks + games overlap with the group.",
    ],
  },
];

const bingoTiles: DemoBingoTile[] = [
  // 5x5 board, row-major. Center (index 12) is the Free space.
  // Activities (6 total) are color-coded and count toward the 4 picks.
  // Bonus challenges are gray.

  // Row 1
  {
    id: "tile_evt_pottery",
    kind: "event",
    title: "Pottery After Dark",
    description: "Wheel basics + glaze snacks. Crooked is allowed.",
    points: 25,
    eventId: "evt_pottery_after_dark",
    stampLabel: "CLAY HANDS",
  },
  {
    id: "tile_bonus_walk_home_song",
    kind: "challenge",
    title: "Find someone’s embarrassing walk-home song",
    description: "No judging (some judging).",
    points: 10,
    stampLabel: "AUDIO LORE",
    photo: {
      url: "https://images.unsplash.com/photo-1520975897531-0b89b4d8b3a0?auto=format&fit=crop&w=2200&q=80",
      alt: "A pair of headphones on a table.",
      title: "Audio lore",
      caption: "Photo via Unsplash.",
    },
  },
  {
    id: "tile_bonus_weird_dessert",
    kind: "challenge",
    title: "Split one weird dessert",
    description: "Leadership. Community. Sugar.",
    points: 10,
    stampLabel: "DESSERT QUEST",
    photo: {
      url: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=2200&q=80",
      alt: "A dessert on a plate.",
      title: "Dessert quest",
      caption: "Photo via Unsplash.",
    },
  },
  {
    id: "tile_evt_mural_walk",
    kind: "event",
    title: "Mural Walk: Pilsen Lines",
    description: "Walk-and-talk with color and context.",
    points: 20,
    eventId: "evt_pilsen_mural_walk",
    stampLabel: "CITY STROLL",
  },
  {
    id: "tile_bonus_tote_bags",
    kind: "challenge",
    title: "Spot the 14 tote bag person",
    description: "Bonus if they justify every one.",
    points: 8,
    stampLabel: "TOTE SPOTTER",
    photo: {
      url: "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=2200&q=80",
      alt: "A tote bag hanging from a chair.",
      title: "Tote spotter",
      caption: "Photo via Unsplash.",
    },
  },

  // Row 2
  {
    id: "tile_bonus_campus_cat",
    kind: "challenge",
    title: "Name a campus café cat",
    description: "Write it down. Important research.",
    points: 8,
    stampLabel: "CAT NAMING",
  },
  {
    id: "tile_evt_cafe_crawl",
    kind: "event",
    title: "Café Crawl",
    description: "Three cups. One afternoon.",
    points: 20,
    eventId: "evt_cafe_crawl",
    stampLabel: "CAFFEINATED",
  },
  {
    id: "tile_bonus_chaotic_meal",
    kind: "challenge",
    title: "Reveal chaotic comfort meal",
    description: "Cereal at 10pm counts.",
    points: 10,
    stampLabel: "MEAL LORE",
    photo: {
      url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=2200&q=80",
      alt: "A cozy meal on a table.",
      title: "Chaotic comfort meal",
      caption: "Photo via Unsplash.",
    },
  },
  {
    id: "tile_bonus_side_quest",
    kind: "challenge",
    title: "Start a side quest",
    description: "Tiny mission. Gentle stakes.",
    points: 15,
    stampLabel: "SIDE QUEST",
  },
  {
    id: "tile_evt_board_games",
    kind: "event",
    title: "Board Game Night",
    description: "No rules lawyers allowed.",
    points: 20,
    eventId: "evt_board_game_bracket",
    stampLabel: "GAME NIGHT",
  },

  // Row 3
  {
    id: "tile_bonus_farmers_market_cry",
    kind: "challenge",
    title: "Find who cries at a farmers market",
    description: "Respectfully.",
    points: 8,
    stampLabel: "SOFT HEART",
  },
  {
    id: "tile_bonus_neighbor_rec",
    kind: "challenge",
    title: "Trade niche Chicago recs",
    description: "Gatekeeping banned.",
    points: 10,
    stampLabel: "REC SWAP",
  },
  {
    id: "tile_free_space",
    kind: "free",
    title: "FREE SPACE",
    description: "Comes with joining a cohort.",
    points: 0,
    stampLabel: "JOINED",
  },
  {
    id: "tile_bonus_hometown_lore",
    kind: "challenge",
    title: "Extract hometown lore",
    description: "Deeply unserious required.",
    points: 10,
    stampLabel: "LORE DROP",
  },
  {
    id: "tile_evt_bookshop",
    kind: "challenge",
    title: "Bookshop bulletin-board spotting",
    description: "Bulletin board spotting encouraged.",
    points: 20,
    eventId: "evt_bookstore_browsing",
    stampLabel: "PAPER FIND",
  },

  // Row 4
  {
    id: "tile_bonus_which_room",
    kind: "challenge",
    title: "Claim a fictional room",
    description: "Be specific. Be dramatic.",
    points: 8,
    stampLabel: "ROOM CLAIM",
  },
  {
    id: "tile_evt_flower_bar",
    kind: "challenge",
    title: "Trade one tiny flower-market rec",
    description: "Make something pretty on purpose.",
    points: 20,
    eventId: "evt_flower_bar_mess",
    stampLabel: "STEM TIME",
  },
  {
    id: "tile_bonus_snack_style",
    kind: "challenge",
    title: "Snack = communication style",
    description: "This is science now.",
    points: 8,
    stampLabel: "SNACK SCI",
  },
  {
    id: "tile_bonus_dorm_pack",
    kind: "challenge",
    title: "Dorm-room starter pack object",
    description: "One object. No explanation.",
    points: 8,
    stampLabel: "STARTER PACK",
  },
  {
    id: "tile_bonus_make_a_note",
    kind: "challenge",
    title: "Leave a note on a bulletin board",
    description: "Flyer-wall energy.",
    points: 12,
    stampLabel: "BULLETIN",
    photo: {
      url: "https://images.unsplash.com/photo-1455885666463-38ecf1b5d55f?auto=format&fit=crop&w=2200&q=80",
      alt: "A bulletin board layered with notes and flyers.",
      title: "Bulletin board",
      caption: "Photo via Unsplash.",
    },
  },

  // Row 5
  {
    id: "tile_evt_pasta",
    kind: "event",
    title: "Weeknight Pasta",
    description: "Pairs. Noodles. Laughs.",
    points: 25,
    eventId: "evt_weeknight_pasta",
    stampLabel: "PASTA MODE",
  },
  {
    id: "tile_bonus_table_role",
    kind: "challenge",
    title: "Assign table roles",
    description: "Navigator, hype, snack finder…",
    points: 10,
    stampLabel: "ROLES",
  },
  {
    id: "tile_evt_comedy",
    kind: "event",
    title: "Small Room Comedy",
    description: "Laughing counts as bonding.",
    points: 20,
    eventId: "evt_small_room_comedy",
    stampLabel: "LOL RECEIPT",
  },
  {
    id: "tile_bonus_weird_title",
    kind: "challenge",
    title: "Find a weird book title",
    description: "Read it aloud confidently.",
    points: 10,
    stampLabel: "WEIRD TITLE",
  },
  {
    id: "tile_bonus_silly_club",
    kind: "challenge",
    title: "Invent a fake student club",
    description: "Name + mission statement.",
    points: 12,
    stampLabel: "CLUB FAIR",
  },
];

const chatThreads: DemoChatThread[] = [
  {
    cohortId: "coh_art_room",
    seededMessages: [
      {
        id: "msg_art_1",
        authorUserId: "system",
        body: "Crumbs here. This chat is a demo. Messages you send are saved on this device only.",
        createdAtISO: "2026-06-06T17:00:00.000Z",
      },
      {
        id: "msg_art_2",
        authorUserId: "usr_1_03",
        body: "hi! I’m Ari. if anyone has a favorite café chair (like, a specific chair), I want to hear about it.",
        createdAtISO: "2026-06-06T17:03:00.000Z",
      },
      {
        id: "msg_art_3",
        authorUserId: "usr_1_12",
        body: "I have a favorite chair AND it squeaks. it’s part of the experience.",
        createdAtISO: "2026-06-06T17:05:00.000Z",
      },
    ],
  },
  {
    cohortId: "coh_table_laughs",
    seededMessages: [
      {
        id: "msg_food_1",
        authorUserId: "system",
        body: "Crumbs is supervising. (Demo chat — saved locally.)",
        createdAtISO: "2026-06-06T18:00:00.000Z",
      },
      {
        id: "msg_food_2",
        authorUserId: "usr_2_07",
        body: "everyone drop your chaotic comfort meal. i’ll start: microwaved dumplings + too much chili crisp.",
        createdAtISO: "2026-06-06T18:02:00.000Z",
      },
      {
        id: "msg_food_3",
        authorUserId: "usr_2_15",
        body: "cereal at 10pm. the best meal. I will not be taking questions.",
        createdAtISO: "2026-06-06T18:06:00.000Z",
      },
    ],
  },
  {
    cohortId: "coh_city_strollers",
    seededMessages: [
      {
        id: "msg_walk_1",
        authorUserId: "system",
        body: "Demo chat. Crumbs filed the messages under “campus energy.”",
        createdAtISO: "2026-06-06T19:00:00.000Z",
      },
      {
        id: "msg_walk_2",
        authorUserId: "usr_3_04",
        body: "if we do the mural walk, can we make up extremely fake backstories for the murals? respectfully.",
        createdAtISO: "2026-06-06T19:05:00.000Z",
      },
      {
        id: "msg_walk_3",
        authorUserId: "usr_3_19",
        body: "yes. and I want one person assigned as “documentarian” for the fake lore.",
        createdAtISO: "2026-06-06T19:06:30.000Z",
      },
    ],
  },
];

export const demoData = {
  season: {
    id: "demo_season_summer_2026",
    name: "Chicago Summer 2026",
    durationWeeks: 6,
    depositDollars: 20,
    requiredEventCount: 4,
    availableEventCount: 6,
    signupWindowDays: 7,
  },
  businesses,
  events,
  users,
  cohorts,
  bingoTiles,
  chatThreads,
} as const;

export function getDemoBusiness(businessId: string) {
  return demoData.businesses.find((biz) => biz.id === businessId) ?? null;
}

export function getDemoEvent(eventId: string) {
  return demoData.events.find((evt) => evt.id === eventId) ?? null;
}

export function getDemoCohort(cohortId: string) {
  return demoData.cohorts.find((coh) => coh.id === cohortId) ?? null;
}

export function getDemoUser(userId: string) {
  return demoData.users.find((u) => u.id === userId) ?? null;
}

export function getDemoChatThread(cohortId: string) {
  return demoData.chatThreads.find((thread) => thread.cohortId === cohortId) ?? null;
}
