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

