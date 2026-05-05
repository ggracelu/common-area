import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { Deposit, DepositStatus } from "@/types/deposit";

type DepositRow = {
  id: string;
  profile_id: string | null;
  season_id: string;
  clerk_user_id: string;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  amount_cents: number;
  currency: string;
  status: DepositStatus;
  paid_at: string | null;
  failed_at: string | null;
  refunded_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapDeposit(row: DepositRow): Deposit {
  return {
    id: row.id,
    profileId: row.profile_id,
    seasonId: row.season_id,
    clerkUserId: row.clerk_user_id,
    stripeCheckoutSessionId: row.stripe_checkout_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    amountCents: row.amount_cents,
    currency: row.currency,
    status: row.status,
    paidAt: row.paid_at,
    failedAt: row.failed_at,
    refundedAt: row.refunded_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Get a deposit for a specific user and season.
 * Uses admin client to bypass RLS for server-side operations.
 */
export async function getDepositForUserAndSeason(
  clerkUserId: string,
  seasonId: string,
): Promise<Deposit | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("deposits")
    .select(
      "id, profile_id, season_id, clerk_user_id, stripe_checkout_session_id, stripe_payment_intent_id, amount_cents, currency, status, paid_at, failed_at, refunded_at, created_at, updated_at",
    )
    .eq("clerk_user_id", clerkUserId)
    .eq("season_id", seasonId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load deposit for user and season: ${error.message}`);
  }

  return data ? mapDeposit(data as DepositRow) : null;
}

/**
 * Create a new pending deposit or reuse an existing pending deposit.
 * Uses admin client to bypass RLS for server-side operations.
 */
export async function createOrReusePendingDepositForCheckout({
  clerkUserId,
  seasonId,
  profileId,
}: {
  clerkUserId: string;
  seasonId: string;
  profileId: string | null;
}): Promise<Deposit> {
  const supabase = createSupabaseAdminClient();

  // First, check if there's an existing pending deposit
  const existingDeposit = await getDepositForUserAndSeason(clerkUserId, seasonId);

  if (existingDeposit && existingDeposit.status === "pending") {
    return existingDeposit;
  }

  // Create a new pending deposit
  const { data, error } = await supabase
    .from("deposits")
    .insert({
      clerk_user_id: clerkUserId,
      season_id: seasonId,
      profile_id: profileId,
      amount_cents: 2000,
      currency: "usd",
      status: "pending",
    })
    .select(
      "id, profile_id, season_id, clerk_user_id, stripe_checkout_session_id, stripe_payment_intent_id, amount_cents, currency, status, paid_at, failed_at, refunded_at, created_at, updated_at",
    )
    .single();

  if (error) {
    throw new Error(`Failed to create deposit: ${error.message}`);
  }

  return mapDeposit(data as DepositRow);
}

/**
 * Mark a deposit as paid from a Stripe webhook.
 * Uses admin client to bypass RLS for server-side operations.
 */
export async function markDepositPaidFromStripeWebhook({
  depositId,
  stripeCheckoutSessionId,
  stripePaymentIntentId,
}: {
  depositId: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string;
}): Promise<void> {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("deposits")
    .update({
      status: "paid",
      stripe_checkout_session_id: stripeCheckoutSessionId,
      stripe_payment_intent_id: stripePaymentIntentId,
      paid_at: new Date().toISOString(),
    })
    .eq("id", depositId);

  if (error) {
    throw new Error(`Failed to mark deposit as paid: ${error.message}`);
  }
}

/**
 * Mark a deposit as failed from a Stripe webhook.
 * Uses admin client to bypass RLS for server-side operations.
 */
export async function markDepositFailedFromStripeWebhook({
  depositId,
  stripeCheckoutSessionId,
}: {
  depositId: string;
  stripeCheckoutSessionId: string;
}): Promise<void> {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("deposits")
    .update({
      status: "failed",
      stripe_checkout_session_id: stripeCheckoutSessionId,
      failed_at: new Date().toISOString(),
    })
    .eq("id", depositId);

  if (error) {
    throw new Error(`Failed to mark deposit as failed: ${error.message}`);
  }
}

/**
 * Check if a user has paid a deposit for a specific season.
 * Uses admin client to bypass RLS for server-side operations.
 */
export async function hasPaidDepositForSeason(
  clerkUserId: string,
  seasonId: string,
): Promise<boolean> {
  const deposit = await getDepositForUserAndSeason(clerkUserId, seasonId);
  return deposit?.status === "paid";
}
