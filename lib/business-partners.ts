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

export const partnerBusinesses: PartnerBusiness[] = [
  {
    id: "kiln-room",
    name: "The Kiln Room",
    neighborhood: "Logan Square",
    category: "Studio",
    hostSummary: "Weekly pottery nights with guided table seating and repeat cohorts.",
    cadence: "Weekly",
    groupSize: "12–18 guests",
    accent: "var(--v16-gold)",
  },
  {
    id: "north-roast",
    name: "North Roast",
    neighborhood: "Wicker Park",
    category: "Cafe",
    hostSummary: "Neighborhood coffee crawls that bring the same faces back on a rhythm.",
    cadence: "Biweekly",
    groupSize: "10–15 guests",
    accent: "var(--v16-magenta)",
  },
  {
    id: "pilsen-print",
    name: "Pilsen Print House",
    neighborhood: "Pilsen",
    category: "Gallery",
    hostSummary: "Mural walks and print workshops anchored in local artists.",
    cadence: "Monthly",
    groupSize: "15–20 guests",
    accent: "var(--v16-blue)",
  },
  {
    id: "common-vinyl",
    name: "Common Vinyl",
    neighborhood: "Ukrainian Village",
    category: "Listening room",
    hostSummary: "Low-pressure record nights with reserved tables for cohort check-ins.",
    cadence: "Biweekly",
    groupSize: "8–14 guests",
    accent: "var(--v16-lime)",
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
