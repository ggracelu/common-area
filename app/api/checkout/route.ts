import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { getActiveSeason } from "@/lib/catalog";
import { createOrReusePendingDepositForCheckout } from "@/lib/deposits";

export async function POST() {
  try {
    // Require authenticated Clerk user
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Load active season
    const season = await getActiveSeason();

    if (!season) {
      return NextResponse.json({ error: "No active season" }, { status: 400 });
    }

    // Create or reuse pending deposit
    const deposit = await createOrReusePendingDepositForCheckout({
      clerkUserId,
      seasonId: season.id,
      profileId: null, // Will be populated when Clerk/Supabase claims are wired
    });

    // Create Stripe Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${season.name} Deposit`,
              description: season.tagline || "Turn your city into a campus.",
            },
            unit_amount: deposit.amountCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/dashboard?deposit=success`,
      cancel_url: `${appUrl}/season?deposit=cancelled`,
      metadata: {
        deposit_id: deposit.id,
        clerk_user_id: clerkUserId,
        season_id: season.id,
      },
    });

    // Update deposit with Stripe checkout session ID
    const { createSupabaseAdminClient } = await import("@/lib/supabase/server");
    const supabase = createSupabaseAdminClient();

    await supabase
      .from("deposits")
      .update({ stripe_checkout_session_id: checkoutSession.id })
      .eq("id", deposit.id);

    // Return session URL
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
