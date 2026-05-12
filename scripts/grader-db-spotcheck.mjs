#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { chromium } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i <= 0) continue;
    const key = trimmed.slice(0, i).trim();
    let value = trimmed.slice(i + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

async function pickActivityTile(page, index) {
  const tile = page.locator("button").filter({ hasText: "Activity" }).nth(index);
  await tile.click();
  const select = page.getByRole("button", { name: /Select \(counts toward 4\)/ });
  if (await select.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await select.click();
  }
  const close = page.getByTestId("bingo-tile-close");
  await close.click();
}

async function main() {
  loadEnvLocal();
  const email = process.env.GRADER_CLERK_EMAIL?.trim();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  const baseURL = process.env.PLAYWRIGHT_LOCAL_BASE_URL ?? "http://localhost:3000";
  const storage = path.join(process.cwd(), "e2e/fixtures/grader-storage.json");

  if (!email || !supabaseUrl || !secret || !fs.existsSync(storage)) {
    throw new Error("Missing grader env or storage state for DB spot-check.");
  }

  const supabase = createClient(supabaseUrl, secret, { auth: { persistSession: false } });
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: storage });
  const page = await context.newPage();
  page.on("dialog", (dialog) => dialog.accept());
  await page.emulateMedia({ reducedMotion: "reduce" });

  await page.goto(`${baseURL}/dashboard`);
  await page.getByTestId("grader-reset-journey").click();
  await page.getByTestId("grader-checklist-deposit").waitFor({ state: "visible", timeout: 30_000 });
  await page.getByTestId("grader-checklist-deposit").filter({ hasText: "Pending" }).waitFor({ timeout: 30_000 });
  await page.goto(`${baseURL}/bingo`);
  for (let i = 0; i < 4; i += 1) {
    await pickActivityTile(page, i);
  }
  await page.getByRole("button", { name: "Ready to submit" }).click();
  await page.getByTestId("join-season-deposit").waitFor({ state: "visible", timeout: 20_000 });
  await page.getByTestId("join-season-deposit").click();
  await page.getByTestId("bingo-deposit-handoff").getByText(/^Paid/).waitFor({ timeout: 60_000 });
  await page.goto(`${baseURL}/dashboard`);
  await page.getByTestId("grader-checklist-matching").filter({ hasText: "Done" }).waitFor({ timeout: 60_000 });
  await page.getByTestId("dashboard-tab-future").click();
  await page.getByTestId("cohort-reveal-letter").waitFor({ timeout: 30_000 });
  await page.getByRole("button", { name: "Enter your common room" }).click();
  await page.goto(`${baseURL}/bingo`);
  const bonusTile = page.locator("button").filter({ hasText: "Bonus" }).first();
  await bonusTile.click();
  await page.getByRole("button", { name: /stamp this square/i }).click();
  await page.getByTestId("bingo-bonus-save-status").filter({ hasText: /saved to your account/i }).waitFor({
    timeout: 30_000,
  });
  await page.reload();
  await bonusTile.click();
  await page.getByRole("button", { name: /unstamp/i }).waitFor({ timeout: 20_000 });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, onboarding_status")
    .eq("email", email)
    .maybeSingle();
  if (profileError || !profile) {
    throw new Error(profileError?.message ?? "Grader profile not found for DB spot-check.");
  }

  const profileId = profile.id;
  const [{ data: deposit }, { data: picks }, { data: membership }, { data: bingo }] = await Promise.all([
    supabase.from("deposits").select("status").eq("profile_id", profileId).maybeSingle(),
    supabase.from("user_activity_choices").select("id").eq("profile_id", profileId),
    supabase.from("cohort_members").select("cohort_id, reveal_seen_at").eq("profile_id", profileId).maybeSingle(),
    supabase.from("bingo_completions").select("id").eq("profile_id", profileId),
  ]);

  const summary = {
    onboarding_status: profile.onboarding_status,
    deposit_status: deposit?.status ?? null,
    pick_count: picks?.length ?? 0,
    cohort_assigned: Boolean(membership),
    reveal_seen: Boolean(membership?.reveal_seen_at),
    bingo_completion_count: bingo?.length ?? 0,
  };

  const ok =
    summary.deposit_status === "paid" &&
    summary.pick_count === 4 &&
    summary.cohort_assigned &&
    summary.reveal_seen &&
    summary.bingo_completion_count >= 1;

  console.log(JSON.stringify({ ok, summary }, null, 2));
  await browser.close();
  process.exit(ok ? 0 : 1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
