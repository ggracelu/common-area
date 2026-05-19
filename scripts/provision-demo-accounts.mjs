#!/usr/bin/env node

/**
 * Provision all five member + five business demo Clerk accounts.
 * Reuses partner linkage logic from provision-partner-accounts.mjs.
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

const clerkSecret = process.env.CLERK_SECRET_KEY?.trim();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseSecret = process.env.SUPABASE_SECRET_KEY?.trim();

const DEMO_MEMBER_PASSWORD = process.env.DEMO_MEMBER_PASSWORD?.trim() ?? "CADemo-Member8!vT2wL6pX";
const DEMO_PARTNER_PASSWORD = process.env.DEMO_PARTNER_PASSWORD?.trim() ?? "CAPartner-Demo8!vT2wL6pX";

const memberAccounts = [
  { label: "Alex Chen (new grad)", email: "alex-newgrad+clerk_test@example.com", username: "alex-newgrad" },
  { label: "Jordan Lee (creative)", email: "jordan-creative+clerk_test@example.com", username: "jordan-creative" },
  { label: "Sam Ortiz (foodie)", email: "sam-foodie+clerk_test@example.com", username: "sam-foodie" },
  { label: "Priya Nair (Pilsen)", email: "priya-pilsen+clerk_test@example.com", username: "priya-pilsen" },
  { label: "Morgan Blake (reset)", email: "morgan-reset+clerk_test@example.com", username: "morgan-reset" },
];

const businessAccounts = [
  {
    label: "Grader's Coffee",
    email: "graders-coffee+clerk_test@example.com",
    username: "graders-coffee",
    partnerSlug: "graders-coffee",
    password:
      process.env.PARTNER_GRADER_CLERK_PASSWORD?.trim() ?? process.env.DEMO_PARTNER_PASSWORD?.trim() ?? DEMO_PARTNER_PASSWORD,
  },
  {
    label: "Crumbs Cafe",
    email: "crumbs-cafe+clerk_test@example.com",
    username: "crumbs-cafe",
    partnerSlug: null,
    password:
      process.env.PARTNER_TESTER_CLERK_PASSWORD?.trim() ?? process.env.DEMO_PARTNER_PASSWORD?.trim() ?? DEMO_PARTNER_PASSWORD,
  },
  {
    label: "The Kiln Room",
    email: "kiln-room+clerk_test@example.com",
    username: "kiln-room",
    partnerSlug: null,
    password: DEMO_PARTNER_PASSWORD,
  },
  {
    label: "Half Lit Listening Room",
    email: "half-lit+clerk_test@example.com",
    username: "half-lit",
    partnerSlug: null,
    password: DEMO_PARTNER_PASSWORD,
  },
  {
    label: "Margin Notes Bookshop",
    email: "margin-notes+clerk_test@example.com",
    username: "margin-notes",
    partnerSlug: null,
    password: DEMO_PARTNER_PASSWORD,
  },
];

if (!clerkSecret) {
  throw new Error("Missing CLERK_SECRET_KEY. Add it to .env.local before provisioning demo accounts.");
}

async function clerkRequest(path, init = {}) {
  const response = await fetch(`https://api.clerk.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${clerkSecret}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`Clerk ${path} failed (${response.status}): ${text}`);
  }
  return body;
}

function isVerified(address) {
  return address?.verification?.status === "verified";
}

async function ensureVerifiedEmails(userId) {
  const user = await clerkRequest(`/users/${userId}`);
  for (const address of user.email_addresses ?? []) {
    if (isVerified(address)) continue;
    await clerkRequest(`/email_addresses/${address.id}`, {
      method: "PATCH",
      body: JSON.stringify({ verified: true }),
    });
  }
}

async function getLinkedClerkUserId(partnerSlug) {
  if (!supabaseUrl || !supabaseSecret) return null;
  const supabase = createClient(supabaseUrl, supabaseSecret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await supabase
    .from("partner_businesses")
    .select("clerk_user_id")
    .eq("slug", partnerSlug)
    .maybeSingle();
  if (error) {
    throw new Error(`Failed to read partner_businesses linkage for ${partnerSlug}: ${error.message}`);
  }
  return data?.clerk_user_id ?? null;
}

async function linkPartnerBusiness(partnerSlug, clerkUserId) {
  const supabase = createClient(supabaseUrl, supabaseSecret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await supabase
    .from("partner_businesses")
    .update({ clerk_user_id: clerkUserId })
    .eq("slug", partnerSlug);
  if (error) {
    throw new Error(`Failed to link partner_businesses row for ${partnerSlug}: ${error.message}`);
  }
}

async function findOrCreateClerkUser(account, password) {
  const listed = await clerkRequest(`/users?email_address=${encodeURIComponent(account.email)}&limit=1`);
  const byEmail = listed?.[0];
  if (byEmail?.id) {
    await ensureVerifiedEmails(byEmail.id);
    return byEmail.id;
  }

  const linkedId = account.partnerSlug ? await getLinkedClerkUserId(account.partnerSlug) : null;
  if (linkedId) {
    await ensureVerifiedEmails(linkedId);
    return linkedId;
  }

  const createPayload = {
    email_address: [account.email],
    password,
    skip_password_checks: true,
    skip_password_requirement: true,
  };

  let created;
  try {
    created = await clerkRequest("/users", {
      method: "POST",
      body: JSON.stringify({ ...createPayload, username: account.username }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("username")) throw error;
    created = await clerkRequest("/users", {
      method: "POST",
      body: JSON.stringify(createPayload),
    });
  }

  await ensureVerifiedEmails(created.id);
  return created.id;
}

console.log("Provisioning member demo accounts…");
for (const account of memberAccounts) {
  const clerkUserId = await findOrCreateClerkUser(account, DEMO_MEMBER_PASSWORD);
  console.log(`  ${account.label}: ${account.email} (${clerkUserId})`);
}

console.log("\nProvisioning business demo accounts…");
for (const account of businessAccounts) {
  const clerkUserId = await findOrCreateClerkUser(account, account.password);
  if (account.partnerSlug) {
    await linkPartnerBusiness(account.partnerSlug, clerkUserId);
  }
  console.log(`  ${account.label}: ${account.email} (${clerkUserId})`);
}

console.log("\nDone.");
console.log("Member demos (all five):", DEMO_MEMBER_PASSWORD);
console.log("Business — Grader's Coffee:", businessAccounts[0].password);
console.log("Business — Crumbs Cafe:", businessAccounts[1].password);
console.log("Business — Kiln Room, Half Lit, Margin Notes:", DEMO_PARTNER_PASSWORD);
console.log("Clerk email verification code for all +clerk_test addresses: 424242");
console.log("Full credential tables: docs/DEMO_SCRIPT.md");
