import "server-only";

import { createServerSupabasePublicClient } from "@/lib/supabase/server";

// Type definitions for presence
export interface Presence {
  profileId: string;
  displayName: string;
  avatarUrl: string | null;
  activityId: string | null;
  lastSeenAt: string;
  isOnline: boolean;
}

export interface BusinessPresence {
  activityId: string;
  activityName: string;
  businessName: string;
  neighborhood: string | null;
  presentMembers: Presence[];
  totalMembers: number;
}

/**
 * Get all cohort members currently present at a specific activity/business
 */
export async function getBusinessPresence(
  activityId: string,
  cohortId: string,
): Promise<BusinessPresence | null> {
  const supabase = createServerSupabasePublicClient();

  // Get activity details
  const { data: activity, error: activityError } = await supabase
    .from("activities")
    .select("id, title, business_name, neighborhood")
    .eq("id", activityId)
    .single();

  if (activityError) {
    throw new Error(`Failed to fetch activity: ${activityError.message}`);
  }

  // Get cohort members
  const { data: cohortMembers, error: membersError } = await supabase
    .from("cohort_members")
    .select("profile_id")
    .eq("cohort_id", cohortId);

  if (membersError) {
    throw new Error(`Failed to fetch cohort members: ${membersError.message}`);
  }

  const profileIds = cohortMembers?.map((m) => m.profile_id) ?? [];

  // Get profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", profileIds);

  if (profilesError) {
    throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
  }

  // For now, we'll return all members as "present"
  // In production, this would use real-time presence tracking via Supabase Realtime
  const presentMembers: Presence[] = (profiles ?? []).map((profile) => ({
    profileId: profile.id,
    displayName: profile.display_name ?? "Anonymous",
    avatarUrl: profile.avatar_url,
    activityId,
    lastSeenAt: new Date().toISOString(),
    isOnline: true,
  }));

  return {
    activityId: activity.id,
    activityName: activity.title,
    businessName: activity.business_name,
    neighborhood: activity.neighborhood,
    presentMembers,
    totalMembers: presentMembers.length,
  };
}

/**
 * Get all businesses with cohort members present
 */
export async function getAllBusinessPresence(
  cohortId: string,
): Promise<BusinessPresence[]> {
  const supabase = createServerSupabasePublicClient();

  // Get all activities for the current season
  const { data: activities, error: activitiesError } = await supabase
    .from("activities")
    .select("id, title, business_name, neighborhood")
    .order("title", { ascending: true });

  if (activitiesError) {
    throw new Error(`Failed to fetch activities: ${activitiesError.message}`);
  }

  // Get cohort members
  const { data: cohortMembers, error: membersError } = await supabase
    .from("cohort_members")
    .select("profile_id")
    .eq("cohort_id", cohortId);

  if (membersError) {
    throw new Error(`Failed to fetch cohort members: ${membersError.message}`);
  }

  const profileIds = cohortMembers?.map((m) => m.profile_id) ?? [];

  // Get profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", profileIds);

  if (profilesError) {
    throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
  }

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, p]),
  );

  // For each activity, create a presence object
  // In production, this would use real-time presence tracking
  return (activities ?? []).map((activity) => ({
    activityId: activity.id,
    activityName: activity.title,
    businessName: activity.business_name,
    neighborhood: activity.neighborhood,
    presentMembers: (profiles ?? []).map((profile) => ({
      profileId: profile.id,
      displayName: profile.display_name ?? "Anonymous",
      avatarUrl: profile.avatar_url,
      activityId: activity.id,
      lastSeenAt: new Date().toISOString(),
      isOnline: true,
    })),
    totalMembers: (profiles ?? []).length,
  }));
}

/**
 * Update user's presence at a location
 */
export async function updatePresence(
  profileId: string,
  activityId: string | null,
): Promise<void> {
  const supabase = createServerSupabasePublicClient();

  // In production, this would use Supabase Realtime to broadcast presence
  // For now, we'll just log the update
  console.log(`Updating presence for ${profileId} at ${activityId ?? "nowhere"}`);

  // Future implementation:
  // await supabase.channel('presence').track({
  //   profile_id: profileId,
  //   activity_id: activityId,
  //   last_seen_at: new Date().toISOString(),
  // });
}

/**
 * Get user's current presence
 */
export async function getUserPresence(
  profileId: string,
): Promise<Presence | null> {
  const supabase = createServerSupabasePublicClient();

  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .eq("id", profileId)
    .single();

  if (profileError) {
    throw new Error(`Failed to fetch profile: ${profileError.message}`);
  }

  // In production, this would fetch from real-time presence
  // For now, return a default presence
  return {
    profileId: profile.id,
    displayName: profile.display_name ?? "Anonymous",
    avatarUrl: profile.avatar_url,
    activityId: null,
    lastSeenAt: new Date().toISOString(),
    isOnline: false,
  };
}

/**
 * Check if any cohort members are at a specific business
 */
export async function hasCohortMembersAtBusiness(
  activityId: string,
  cohortId: string,
  excludeProfileId?: string,
): Promise<boolean> {
  const presence = await getBusinessPresence(activityId, cohortId);

  if (!presence) {
    return false;
  }

  if (excludeProfileId) {
    return presence.presentMembers.some(
      (m) => m.profileId !== excludeProfileId && m.isOnline,
    );
  }

  return presence.presentMembers.some((m) => m.isOnline);
}

/**
 * Get count of cohort members at a business
 */
export async function getCohortMemberCountAtBusiness(
  activityId: string,
  cohortId: string,
): Promise<number> {
  const presence = await getBusinessPresence(activityId, cohortId);

  if (!presence) {
    return 0;
  }

  return presence.presentMembers.filter((m) => m.isOnline).length;
}
