#!/usr/bin/env node

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

const accounts = [
  {
    label: "Grader's Coffee",
    email: process.env.PARTNER_GRADER_CLERK_EMAIL?.trim() ?? "graders-coffee+clerk_test@example.com",
    password: process.env.PARTNER_GRADER_CLERK_PASSWORD?.trim() ?? "CAPartner-8Qm!vT2wL6pX",
    username: "graders-coffee",
    partnerSlug: "graders-coffee",
  },
  {
    label: "Crumbs Cafe",
    email: process.env.PARTNER_TESTER_CLERK_EMAIL?.trim() ?? "crumbs-cafe+clerk_test@example.com",
    password: process.env.PARTNER_TESTER_CLERK_PASSWORD?.trim() ?? "CAPartner-Cr7m!vT2wL6pX",
    username: "crumbs-cafe",
    partnerSlug: null,
  },
];

if (!clerkSecret) {
  throw new Error("Missing CLERK_SECRET_KEY. Add it to .env.local before provisioning partner accounts.");
}

if (!supabaseUrl || !supabaseSecret) {
  throw new Error("Missing Supabase URL or SUPABASE_SECRET_KEY for partner account linkage.");
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
  const addresses = user.email_addresses ?? [];

  for (const address of addresses) {
    if (isVerified(address)) continue;
    await clerkRequest(`/email_addresses/${address.id}`, {
      method: "PATCH",
      body: JSON.stringify({ verified: true }),
    });
  }
}

async function getLinkedClerkUserId(partnerSlug) {
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

async function ensurePrimaryEmail(userId, email) {
  const user = await clerkRequest(`/users/${userId}`);
  const hasEmail = user.email_addresses?.some((address) => address.email_address === email);
  if (hasEmail) {
    return;
  }

  await clerkRequest("/email_addresses", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      email_address: email,
      verified: true,
      primary: true,
    }),
  });
}

async function findOrCreateClerkUser(account) {
  const listed = await clerkRequest(`/users?email_address=${encodeURIComponent(account.email)}&limit=1`);
  const byEmail = listed?.[0];
  if (byEmail?.id) {
    await ensureVerifiedEmails(byEmail.id);
    return byEmail.id;
  }

  const linkedId = account.partnerSlug ? await getLinkedClerkUserId(account.partnerSlug) : null;
  if (linkedId) {
    await ensurePrimaryEmail(linkedId, account.email);
    await ensureVerifiedEmails(linkedId);
    return linkedId;
  }

  const createPayload = {
    email_address: [account.email],
    password: account.password,
    skip_password_checks: true,
    skip_password_requirement: true,
  };

  let created;
  try {
    created = await clerkRequest("/users", {
      method: "POST",
      body: JSON.stringify({
        ...createPayload,
        username: account.username,
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("username")) {
      throw error;
    }

    created = await clerkRequest("/users", {
      method: "POST",
      body: JSON.stringify(createPayload),
    });
  }

  await ensureVerifiedEmails(created.id);
  return created.id;
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

for (const account of accounts) {
  const clerkUserId = await findOrCreateClerkUser(account);
  if (account.partnerSlug) {
    await linkPartnerBusiness(account.partnerSlug, clerkUserId);
  }

  console.log(`Provisioned ${account.label}.`);
  console.log(`  Email: ${account.email}`);
  console.log(`  Clerk user id: ${clerkUserId}`);
  if (account.partnerSlug) {
    console.log(`  Linked partner slug: ${account.partnerSlug}`);
  }
}

console.log("If Clerk prompts for email verification in the UI, use code 424242 for +clerk_test addresses.");
