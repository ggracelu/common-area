import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import {
  markDepositFailedFromStripeWebhook,
  markDepositPaidFromStripeWebhook,
} from "@/lib/deposits";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.SUPABASE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe webhook not configured on this environment." },
      { status: 501 },
    );
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
          break;
        }

        const depositId = session.metadata?.deposit_id;

        if (!depositId) break;

        await markDepositPaidFromStripeWebhook({
          depositId,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
        });
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const depositId = session.metadata?.deposit_id;
        if (!depositId) break;

        await markDepositFailedFromStripeWebhook({
          depositId,
          stripeCheckoutSessionId: session.id,
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

