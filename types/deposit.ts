export type DepositStatus = "pending" | "paid" | "refunded" | "failed";

export type Deposit = {
  id: string;
  profileId: string | null;
  seasonId: string;
  clerkUserId: string;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  amountCents: number;
  currency: string;
  status: DepositStatus;
  paidAt: string | null;
  failedAt: string | null;
  refundedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type JoinSeasonState =
  | { kind: "not_started" }
  | { kind: "deposit_pending"; depositId: string }
  | { kind: "deposit_paid"; depositId: string }
  | { kind: "deposit_failed"; depositId: string };
