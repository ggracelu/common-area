import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";

type ProfileRow = {
  id: string;
};

/**
 * Ensures a profiles row exists for the Clerk user. Does not downgrade onboarding_status.
 */
export async function ensureProfileForClerk(
  clerkUserId: string,
  fields: { email: string | null; displayName: string | null },
): Promise<string> {
  const supabase = createSupabaseAdminClient();

  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (selectError) {
    throw new Error(`Failed to look up profile: ${selectError.message}`);
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        email: fields.email,
        display_name: fields.displayName,
      })
      .eq("id", (existing as ProfileRow).id);

    if (updateError) {
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }

    return (existing as ProfileRow).id;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("profiles")
    .insert({
      clerk_user_id: clerkUserId,
      email: fields.email,
      display_name: fields.displayName,
      onboarding_status: "deposit_pending",
    })
    .select("id")
    .single();

  if (insertError) {
    throw new Error(`Failed to create profile: ${insertError.message}`);
  }

  return (inserted as ProfileRow).id;
}
