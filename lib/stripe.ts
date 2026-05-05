import "server-only";

import Stripe from "stripe";

function getStripeSecretKey() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY. Add it to .env.local before using Stripe operations.",
    );
  }

  return secretKey;
}

export const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: "2026-04-22.dahlia",
});
