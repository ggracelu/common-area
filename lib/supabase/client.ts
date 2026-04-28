import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";

export function createBrowserSupabaseClient() {
  const { url, publishableKey } = getPublicSupabaseEnv();

  return createClient(url, publishableKey);
}
