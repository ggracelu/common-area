export type PartnerBusiness = {
  id: string;
  name: string;
  neighborhood: string;
  category: string;
  hostSummary: string;
  cadence: string;
  groupSize: string;
  accent: string;
  imageUrl?: string;
  isGrader?: boolean;
};

/** Curated Unsplash photos (auto=format, crop) — keep in sync with supabase/seed_partner_businesses.sql */
const unsplash = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=1600&q=80`;

export const partnerBusinesses: PartnerBusiness[] = [
  {
    id: "graders-coffee",
    name: "Grader's Coffee",
    neighborhood: "Wicker Park",
    category: "Coffee shop",
    hostSummary:
      "A neighborhood cafe that hosts biweekly coffee crawls and quiet morning cohort tables.",
    cadence: "Biweekly",
    groupSize: "10–15 guests",
    accent: "var(--v16-magenta)",
    imageUrl: unsplash("1495474472287-4d776bcee65f"),
    isGrader: true,
  },
  {
    id: "lantern-ladle",
    name: "Lantern & Ladle",
    neighborhood: "West Loop",
    category: "Restaurant",
    hostSummary:
      "Shared-table suppers where the same cohort returns for a standing Thursday dinner ritual.",
    cadence: "Weekly",
    groupSize: "15–20 guests",
    accent: "var(--v16-gold)",
    imageUrl: unsplash("1517248135467-4c7edcad34c4"),
  },
  {
    id: "ruby-room-bar",
    name: "Ruby Room Bar",
    neighborhood: "Logan Square",
    category: "Bar",
    hostSummary:
      "Low-key listening nights with reserved bar rail seating for familiar cohort faces.",
    cadence: "Biweekly",
    groupSize: "12–18 guests",
    accent: "var(--v16-red)",
    imageUrl: unsplash("1572116463494-4433d6a4f3e2"),
  },
  {
    id: "daily-crumb-bakery",
    name: "Daily Crumb Bakery",
    neighborhood: "Lakeview",
    category: "Bakery",
    hostSummary:
      "Morning pastry labs where neighbors learn lamination and return for the same warm counter.",
    cadence: "Weekly",
    groupSize: "8–12 guests",
    accent: "var(--v16-lime)",
    imageUrl: unsplash("1509440159596-0249088772ff"),
  },
  {
    id: "kiln-kiln-studio",
    name: "Kiln & Kiln Studio",
    neighborhood: "Pilsen",
    category: "Pottery studio",
    hostSummary:
      "Hands-on wheel nights with repeat table assignments so the studio feels like a campus craft room.",
    cadence: "Weekly",
    groupSize: "12–18 guests",
    accent: "var(--v16-gold)",
    imageUrl: unsplash("1578662996442-48f60103fc96"),
  },
  {
    id: "stillpoint-yoga",
    name: "Stillpoint Yoga",
    neighborhood: "Ravenswood",
    category: "Yoga studio",
    hostSummary:
      "Sunday reset flows with cohort check-ins before class and tea in the lobby after.",
    cadence: "Weekly",
    groupSize: "10–16 guests",
    accent: "var(--v16-blue)",
    imageUrl: unsplash("1544367567-0f2fcb009e0b"),
  },
  {
    id: "reach-climbing",
    name: "Reach Climbing",
    neighborhood: "Avondale",
    category: "Climbing gym",
    hostSummary:
      "Belay partner nights that pair cohort members on the same wall until names stick.",
    cadence: "Biweekly",
    groupSize: "10–14 guests",
    accent: "var(--v16-blue)",
    imageUrl: unsplash("1522163182402-834f871fd851"),
  },
  {
    id: "south-loop-boxing",
    name: "South Loop Boxing Club",
    neighborhood: "Bridgeport",
    category: "Boxing gym",
    hostSummary:
      "Technical bag rounds and cohort corner introductions that keep the room familiar, not intimidating.",
    cadence: "Biweekly",
    groupSize: "8–12 guests",
    accent: "var(--v16-red)",
    imageUrl: unsplash("1549719386-69df31e82f2d"),
  },
  {
    id: "north-branch-tavern",
    name: "North Branch Tavern",
    neighborhood: "Lincoln Park",
    category: "Bar",
    hostSummary:
      "Neighborhood trivia with standing tables for cohort teams who want a recurring Wednesday ritual.",
    cadence: "Weekly",
    groupSize: "15–20 guests",
    accent: "var(--v16-magenta)",
    imageUrl: unsplash("1514933659908-005e4a119257"),
  },
  {
    id: "harvest-table",
    name: "Harvest Table",
    neighborhood: "Andersonville",
    category: "Restaurant",
    hostSummary:
      "Seasonal tasting menus with a dedicated long table for returning cohort neighbors.",
    cadence: "Monthly",
    groupSize: "12–16 guests",
    accent: "var(--v16-lime)",
    imageUrl: unsplash("1414235077428-338989a2e8c0"),
  },
];

export const partnerEventTypes = [
  "Hands-on workshop",
  "Tasting or crawl",
  "Neighborhood walk",
  "Open studio night",
  "Game or trivia night",
  "Listening or performance",
] as const;

export type PartnerEventType = (typeof partnerEventTypes)[number];

export const partnerFrequencies = ["Weekly", "Biweekly", "Monthly", "Seasonal pop-up"] as const;

export type PartnerFrequency = (typeof partnerFrequencies)[number];

export const partnerGroupSizes = ["6–10 guests", "10–15 guests", "15–20 guests", "20+ guests"] as const;

export type PartnerGroupSize = (typeof partnerGroupSizes)[number];

export const partnerMonthlyFeeUsd = 149;

/** Minimum cards per marquee half so the track is wider than the viewport (seamless loop). */
export function expandPartnerMarqueeRow(
  businesses: PartnerBusiness[],
  minItems = 8,
): PartnerBusiness[] {
  if (!businesses.length) {
    return [];
  }
  const row: PartnerBusiness[] = [];
  while (row.length < minItems) {
    for (const business of businesses) {
      row.push(business);
      if (row.length >= minItems) {
        break;
      }
    }
  }
  return row;
}
