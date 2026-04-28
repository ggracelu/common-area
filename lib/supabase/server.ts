import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";

function getSupabaseSecretKey() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "Missing SUPABASE_SECRET_KEY. Add it to .env.local before using server-controlled Supabase operations.",
    );
  }

  return secretKey;
}

export function createServerSupabasePublicClient() {
  const { url, publishableKey } = getPublicSupabaseEnv();

  return createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createSupabaseAdminClient() {
  const { url } = getPublicSupabaseEnv();
  const secretKey = getSupabaseSecretKey();

  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
