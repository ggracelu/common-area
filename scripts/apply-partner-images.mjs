#!/usr/bin/env node
/**
 * Applies partner gallery Unsplash URLs (same as migration 202605120005).
 * Loads .env.local — point at local or hosted Supabase via NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(path) {
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // Optional local env file.
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseSecret = process.env.SUPABASE_SECRET_KEY?.trim();

const images = {
  "graders-coffee":
    "https://images.unsplash.com/photo-1495474472287-4d776bcee65f?auto=format&fit=crop&w=1600&q=80",
  "lantern-ladle":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
  "ruby-room-bar":
    "https://images.unsplash.com/photo-1572116463494-4433d6a4f3e2?auto=format&fit=crop&w=1600&q=80",
  "daily-crumb-bakery":
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80",
  "kiln-kiln-studio":
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1600&q=80",
  "stillpoint-yoga":
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80",
  "reach-climbing":
    "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1600&q=80",
  "south-loop-boxing":
    "https://images.unsplash.com/photo-1549719386-69df31e82f2d?auto=format&fit=crop&w=1600&q=80",
  "north-branch-tavern":
    "https://images.unsplash.com/photo-1514933659908-005e4a119257?auto=format&fit=crop&w=1600&q=80",
  "harvest-table":
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
};

if (!supabaseUrl || !supabaseSecret) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseSecret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let updated = 0;
let failed = 0;

for (const [slug, image_url] of Object.entries(images)) {
  const { data, error } = await supabase
    .from("partner_businesses")
    .update({ image_url, updated_at: new Date().toISOString() })
    .eq("slug", slug)
    .select("slug");

  if (error) {
    console.error(`FAIL ${slug}:`, error.message);
    failed += 1;
  } else if (!data?.length) {
    console.warn(`SKIP ${slug}: no matching row`);
  } else {
    console.log(`OK ${slug}`);
    updated += 1;
  }
}

console.log(`Done — ${updated} updated, ${failed} failed (${supabaseUrl})`);
process.exit(failed > 0 ? 1 : 0);
