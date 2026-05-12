export type BusinessEventTiming = "past" | "upcoming";

export type BusinessCalendarEvent = {
  id: string;
  title: string;
  timing: BusinessEventTiming;
  dateLabel: string;
  timeLabel: string;
  cohortName: string;
  guests: number;
  capacity: number;
  format: string;
  neighborhood: string;
  status: "Completed" | "Confirmed" | "Waitlist open";
  accent: string;
};

export type BusinessAnalyticsMetric = {
  id: string;
  label: string;
  value: string;
  note: string;
  accent: string;
};

export type BusinessDemographicSlice = {
  label: string;
  share: number;
  accent: string;
};

export type BusinessEventInsight = {
  id: string;
  title: string;
  attendanceRate: number;
  estimatedRevenueUsd: number;
  estimatedProfitUsd: number;
  repeatGuests: number;
  accent: string;
};

export type BusinessCollaborationPartner = {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  partnershipType: string;
  summary: string;
  accent: string;
};

export type BusinessGuestProfile = {
  id: string;
  name: string;
  neighborhood: string;
  visits: number;
  lastEvent: string;
  cohort: string;
  note: string;
  accent: string;
};

export const businessCalendarEvents: BusinessCalendarEvent[] = [
  {
    id: "past-crawl",
    title: "Wicker Park coffee crawl",
    timing: "past",
    dateLabel: "Apr 24, 2026",
    timeLabel: "6:30–8:30 PM",
    cohortName: "North Branch cohort",
    guests: 14,
    capacity: 16,
    format: "Tasting or crawl",
    neighborhood: "Wicker Park",
    status: "Completed",
    accent: "var(--v16-magenta)",
  },
  {
    id: "past-listening",
    title: "Listening room check-in",
    timing: "past",
    dateLabel: "May 3, 2026",
    timeLabel: "7:00–9:00 PM",
    cohortName: "Ukrainian Village cohort",
    guests: 11,
    capacity: 14,
    format: "Listening or performance",
    neighborhood: "Ukrainian Village",
    status: "Completed",
    accent: "var(--v16-lime)",
  },
  {
    id: "upcoming-latte",
    title: "Latte art standing night",
    timing: "upcoming",
    dateLabel: "May 18, 2026",
    timeLabel: "6:00–8:00 PM",
    cohortName: "Logan Square cohort",
    guests: 12,
    capacity: 15,
    format: "Hands-on workshop",
    neighborhood: "Logan Square",
    status: "Confirmed",
    accent: "var(--v16-gold)",
  },
  {
    id: "upcoming-crawl",
    title: "Neighborhood cafe crawl",
    timing: "upcoming",
    dateLabel: "May 29, 2026",
    timeLabel: "5:30–8:00 PM",
    cohortName: "Wicker Park cohort",
    guests: 9,
    capacity: 16,
    format: "Tasting or crawl",
    neighborhood: "Wicker Park",
    status: "Waitlist open",
    accent: "var(--v16-blue)",
  },
];

export const businessAnalyticsMetrics: BusinessAnalyticsMetric[] = [
  {
    id: "attendance",
    label: "Average attendance",
    value: "13 guests",
    note: "Across the last four hosted cohort nights.",
    accent: "var(--v16-blue)",
  },
  {
    id: "repeat",
    label: "Repeat guest rate",
    value: "68%",
    note: "Neighbors who returned within the same season.",
    accent: "var(--v16-lime)",
  },
  {
    id: "revenue",
    label: "Estimated revenue",
    value: "$2,840",
    note: "Preview totals from hosted tastings and workshop tickets.",
    accent: "var(--v16-gold)",
  },
  {
    id: "profit",
    label: "Estimated profit",
    value: "$1,120",
    note: "After ingredient, staffing, and room-prep costs.",
    accent: "var(--v16-magenta)",
  },
];

export const businessDemographics: BusinessDemographicSlice[] = [
  { label: "22–26", share: 38, accent: "var(--v16-blue)" },
  { label: "27–30", share: 34, accent: "var(--v16-magenta)" },
  { label: "31–35", share: 21, accent: "var(--v16-gold)" },
  { label: "36+", share: 7, accent: "var(--v16-lime)" },
];

export const businessNeighborhoodMix: BusinessDemographicSlice[] = [
  { label: "Wicker Park", share: 31, accent: "var(--v16-magenta)" },
  { label: "Logan Square", share: 24, accent: "var(--v16-gold)" },
  { label: "Ukrainian Village", share: 19, accent: "var(--v16-lime)" },
  { label: "Other Chicago", share: 26, accent: "var(--v16-blue)" },
];

export const businessEventInsights: BusinessEventInsight[] = [
  {
    id: "crawl",
    title: "Coffee crawl nights",
    attendanceRate: 88,
    estimatedRevenueUsd: 1180,
    estimatedProfitUsd: 460,
    repeatGuests: 9,
    accent: "var(--v16-magenta)",
  },
  {
    id: "workshop",
    title: "Hands-on workshops",
    attendanceRate: 80,
    estimatedRevenueUsd: 940,
    estimatedProfitUsd: 390,
    repeatGuests: 7,
    accent: "var(--v16-gold)",
  },
  {
    id: "listening",
    title: "Listening room nights",
    attendanceRate: 79,
    estimatedRevenueUsd: 720,
    estimatedProfitUsd: 270,
    repeatGuests: 6,
    accent: "var(--v16-lime)",
  },
];

export const businessCollaborationPartners: BusinessCollaborationPartner[] = [
  {
    id: "north-roast",
    name: "North Roast",
    category: "Cafe",
    neighborhood: "Wicker Park",
    partnershipType: "Cafe crawl stop",
    summary: "Pairs well for a two-stop crawl when your room needs a quieter pour-over contrast.",
    accent: "var(--v16-magenta)",
  },
  {
    id: "daily-crumb",
    name: "Daily Crumb Bakery",
    category: "Bakery",
    neighborhood: "Lakeview",
    partnershipType: "Pastry add-on",
    summary: "Strong fit for morning cohort tables that want a shared pastry flight before service.",
    accent: "var(--v16-lime)",
  },
  {
    id: "common-vinyl",
    name: "Common Vinyl",
    category: "Listening room",
    neighborhood: "Ukrainian Village",
    partnershipType: "After-coffee ritual",
    summary: "Useful when a crawl needs a low-pressure second room for familiar faces to linger.",
    accent: "var(--v16-blue)",
  },
];

export const businessGuestProfiles: BusinessGuestProfile[] = [
  {
    id: "maya",
    name: "Maya R.",
    neighborhood: "Wicker Park",
    visits: 4,
    lastEvent: "Wicker Park coffee crawl",
    cohort: "North Branch cohort",
    note: "Returns with the same two tablemates each crawl.",
    accent: "var(--v16-magenta)",
  },
  {
    id: "jordan",
    name: "Jordan K.",
    neighborhood: "Logan Square",
    visits: 3,
    lastEvent: "Latte art standing night",
    cohort: "Logan Square cohort",
    note: "Often brings one new neighbor after the second visit.",
    accent: "var(--v16-gold)",
  },
  {
    id: "sam",
    name: "Sam T.",
    neighborhood: "Ukrainian Village",
    visits: 2,
    lastEvent: "Listening room check-in",
    cohort: "Ukrainian Village cohort",
    note: "Prefers standing nights with a clear start time.",
    accent: "var(--v16-lime)",
  },
  {
    id: "priya",
    name: "Priya D.",
    neighborhood: "Lakeview",
    visits: 2,
    lastEvent: "Wicker Park coffee crawl",
    cohort: "Wicker Park cohort",
    note: "Met two other members through the crawl and returned the next week.",
    accent: "var(--v16-blue)",
  },
];

export function upcomingBusinessEvents(events: BusinessCalendarEvent[] = businessCalendarEvents) {
  return events.filter((event) => event.timing === "upcoming");
}

export function pastBusinessEvents(events: BusinessCalendarEvent[] = businessCalendarEvents) {
  return events.filter((event) => event.timing === "past");
}
