export type SeasonStatus = "draft" | "published" | "active" | "closed";

export type Season = {
  id: string;
  city: string;
  name: string;
  slug: string;
  status: SeasonStatus;
  tagline: string | null;
  description: string | null;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Activity = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  businessName: string;
  neighborhood: string | null;
  address: string | null;
  activityType: string | null;
  vibe: string | null;
  imageUrl: string | null;
  startsAt: string | null;
  endsAt: string | null;
  capacity: number | null;
  createdAt: string;
  updatedAt: string;
};

export type SeasonActivity = {
  id: string;
  seasonId: string;
  activityId: string;
  displayOrder: number;
  createdAt: string;
  activity: Activity;
};

export type SeasonWithActivities = Season & {
  activities: SeasonActivity[];
};
