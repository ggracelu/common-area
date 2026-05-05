import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { markDepositPaidFromStripeWebhook, markDepositFailedFromStripeWebhook } from "@/lib/deposits";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Verify session payment status is paid or complete
        if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
          console.log(`Session ${session.id} not paid, skipping deposit update`);
          break;
        }

        // Read metadata
        const depositId = session.metadata?.deposit_id;
        const clerkUserId = session.metadata?.clerk_user_id;
        const seasonId = session.metadata?.season_id;

        if (!depositId || !clerkUserId || !seasonId) {
          console.error("Missing required metadata in checkout session", { depositId, clerkUserId, seasonId });
          break;
        }

        // Update deposit to paid
        await markDepositPaidFromStripeWebhook({
          depositId,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
        });

        console.log(`Deposit ${depositId} marked as paid for user ${clerkUserId} in season ${seasonId}`);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;

        // Read metadata
        const depositId = session.metadata?.deposit_id;

        if (!depositId) {
          console.error("Missing deposit_id in expired checkout session");
          break;
        }

        // Mark deposit as failed
        await markDepositFailedFromStripeWebhook({
          depositId,
          stripeCheckoutSessionId: session.id,
        });

        console.log(`Deposit ${depositId} marked as failed due to expired checkout session`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        // Find deposit by payment intent ID
        const { createSupabaseAdminClient } = await import("@/lib/supabase/server");
        const supabase = createSupabaseAdminClient();

        const { data: deposit } = await supabase
          .from("deposits")
          .select("id")
          .eq("stripe_payment_intent_id", paymentIntent.id)
          .maybeSingle();

        if (!deposit) {
          console.error(`No deposit found for payment intent ${paymentIntent.id}`);
          break;
        }

        // Mark deposit as failed
        await markDepositFailedFromStripeWebhook({
          depositId: deposit.id,
          stripeCheckoutSessionId: paymentIntent.id,
        });

        console.log(`Deposit ${deposit.id} marked as failed due to payment failure`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
