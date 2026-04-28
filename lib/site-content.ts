import type { Activity, FaqItem, Highlight, NavLink, Step } from "@/types/site";

export const navLinks: NavLink[] = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Season", href: "#season" },
  { label: "Wally", href: "#wally" },
  { label: "FAQ", href: "#faq" },
];

export const steps: Step[] = [
  {
    eyebrow: "Step 1",
    title: "Join the Chicago season",
    description:
      "Sign up for the current season and grab a spot before the cohort closes.",
  },
  {
    eyebrow: "Step 2",
    title: "Pick 4 activities",
    description:
      "Choose four curated plans built around real neighborhoods, real businesses, and real reasons to leave the house.",
  },
  {
    eyebrow: "Step 3",
    title: "Meet the same people twice",
    description:
      "Get placed into a cohort of 15-20 people with overlapping picks so the second hello feels easier than the first.",
  },
];

export const exampleActivities: Activity[] = [
  {
    title: "Pottery night in Logan Square",
    neighborhood: "Logan Square",
    vibe: "Messy hands, easy conversation, neighborhood energy.",
  },
  {
    title: "Group cooking class in West Loop",
    neighborhood: "West Loop",
    vibe: "A little chaos, a shared table, and something to laugh about later.",
  },
  {
    title: "Comedy show in Old Town",
    neighborhood: "Old Town",
    vibe: "Low-pressure social momentum with built-in conversation starters.",
  },
  {
    title: "Mural walk in Pilsen",
    neighborhood: "Pilsen",
    vibe: "A city-feeling plan with movement, color, and room to wander.",
  },
  {
    title: "Coffee crawl in Wicker Park",
    neighborhood: "Wicker Park",
    vibe: "Three cafes, one afternoon, and no pressure to be interesting on demand.",
  },
  {
    title: "Board game night in Lakeview",
    neighborhood: "Lakeview",
    vibe: "Structured fun for people who like having a point to the night.",
  },
];

export const cohortHighlights: Highlight[] = [
  {
    title: "Repeated interaction beats first-impression theater",
    description:
      "WhyNot is designed around familiar faces, not perfect bios. You do not need to win the room in thirty seconds.",
  },
  {
    title: "Chicago does the heavy lifting",
    description:
      "Neighborhood-led plans give people something to do, somewhere to go, and something concrete to talk about.",
  },
  {
    title: "Low pressure, not low intention",
    description:
      "The structure helps people actually show up, while the tone stays playful and welcoming.",
  },
];

export const depositHighlights: Highlight[] = [
  {
    title: "$20 keeps the season real",
    description:
      "The seasonal deposit is there to create commitment, reduce flaking, and help cohorts form around people who plan to participate.",
  },
  {
    title: "One season, one simple decision",
    description:
      "No subscriptions, no endless unlocking. The MVP asks for one clear yes to one season in Chicago.",
  },
];

export const faqs: FaqItem[] = [
  {
    question: "Is WhyNot a dating app?",
    answer:
      "No. WhyNot is a seasonal social platform for friendship, community, and repeated low-pressure interaction around local activities.",
  },
  {
    question: "Why cohorts instead of matching?",
    answer:
      "Cohorts remove the pressure of one-to-one judgment and give people repeated chances to connect through shared plans.",
  },
  {
    question: "What happens after I pick activities?",
    answer:
      "You get placed into a cohort of about 15-20 people who share overlapping activities, ideally at least two in common where possible.",
  },
  {
    question: "Are these real Chicago activities?",
    answer:
      "For now, the landing page uses static preview content. The real season and activity catalog come in later phases.",
  },
  {
    question: "Can I sign up right now?",
    answer:
      "Not yet. This phase establishes the public brand and landing experience before auth, payments, and season flows are built.",
  },
];
