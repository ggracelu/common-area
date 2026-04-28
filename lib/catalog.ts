import "server-only";

import { createServerSupabasePublicClient } from "@/lib/supabase/server";
import type { Activity, Season, SeasonActivity, SeasonWithActivities } from "@/types/catalog";

type SeasonRow = {
  id: string;
  city: string;
  name: string;
  slug: string;
  status: Season["status"];
  tagline: string | null;
  description: string | null;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
};

type ActivityRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  business_name: string;
  neighborhood: string | null;
  address: string | null;
  activity_type: string | null;
  vibe: string | null;
  image_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  capacity: number | null;
  created_at: string;
  updated_at: string;
};

type SeasonActivityRow = {
  id: string;
  season_id: string;
  activity_id: string;
  display_order: number;
  created_at: string;
  activity: ActivityRow[] | null;
};

function mapSeason(row: SeasonRow): Season {
  return {
    id: row.id,
    city: row.city,
    name: row.name,
    slug: row.slug,
    status: row.status,
    tagline: row.tagline,
    description: row.description,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    businessName: row.business_name,
    neighborhood: row.neighborhood,
    address: row.address,
    activityType: row.activity_type,
    vibe: row.vibe,
    imageUrl: row.image_url,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    capacity: row.capacity,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSeasonActivity(row: SeasonActivityRow): SeasonActivity {
  const activityRow = row.activity?.[0];

  if (!activityRow) {
    throw new Error("Season activity query returned a row without an attached activity.");
  }

  return {
    id: row.id,
    seasonId: row.season_id,
    activityId: row.activity_id,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    activity: mapActivity(activityRow),
  };
}

export async function getActiveSeason(): Promise<Season | null> {
  const supabase = createServerSupabasePublicClient();
  const { data, error } = await supabase
    .from("seasons")
    .select(
      "id, city, name, slug, status, tagline, description, starts_at, ends_at, created_at, updated_at",
    )
    .eq("status", "active")
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load the active season from Supabase: ${error.message}`);
  }

  return data ? mapSeason(data as SeasonRow) : null;
}

export async function getSeasonBySlug(slug: string): Promise<Season | null> {
  const supabase = createServerSupabasePublicClient();
  const { data, error } = await supabase
    .from("seasons")
    .select(
      "id, city, name, slug, status, tagline, description, starts_at, ends_at, created_at, updated_at",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load season "${slug}" from Supabase: ${error.message}`);
  }

  return data ? mapSeason(data as SeasonRow) : null;
}

export async function getSeasonActivities(
  seasonId: string,
): Promise<SeasonActivity[]> {
  const supabase = createServerSupabasePublicClient();
  const { data, error } = await supabase
    .from("season_activities")
    .select(
      "id, season_id, activity_id, display_order, created_at, activity:activities(id, title, slug, description, business_name, neighborhood, address, activity_type, vibe, image_url, starts_at, ends_at, capacity, created_at, updated_at)",
    )
    .eq("season_id", seasonId)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to load season activities from Supabase: ${error.message}`);
  }

  return ((data ?? []) as unknown as SeasonActivityRow[]).map(mapSeasonActivity);
}

export async function getActiveSeasonWithActivities(): Promise<SeasonWithActivities | null> {
  const season = await getActiveSeason();

  if (!season) {
    return null;
  }

  const activities = await getSeasonActivities(season.id);

  return {
    ...season,
    activities,
  };
}
