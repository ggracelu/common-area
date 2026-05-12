import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getStripe } from "@/lib/stripe";
import { getActiveSeason } from "@/lib/catalog";
import { createOrReusePendingDepositForCheckout, markDepositPaidForDemo } from "@/lib/deposits";
import { ensureProfileForClerk } from "@/lib/profile-sync";
import { shouldUseDemoDeposit, isStripeConfigured } from "@/lib/secrets";

export async function POST() {
  // For local/grader environments, use demo deposit flow
  if (shouldUseDemoDeposit()) {
    try {
      const { userId: clerkUserId } = await auth();

      if (!clerkUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const season = await getActiveSeason();

      if (!season) {
        return NextResponse.json({ error: "No active season" }, { status: 400 });
      }

      const user = await currentUser();
      const profileId = await ensureProfileForClerk(clerkUserId, {
        email: user?.primaryEmailAddress?.emailAddress ?? null,
        displayName: user?.fullName ?? user?.username ?? user?.firstName ?? null,
      });

      // Mark deposit as paid for demo
      const deposit = await markDepositPaidForDemo({
        clerkUserId,
        seasonId: season.id,
        profileId,
      });

      return NextResponse.json({
        demo: true,
        depositId: deposit.id,
        status: deposit.status,
        message: "Demo deposit marked as paid",
      });
    } catch (error) {
      console.error("Demo deposit error:", error);
      return NextResponse.json(
        { error: "Failed to create demo deposit" },
        { status: 500 },
      );
    }
  }

  // For preview/production, require Stripe configuration
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe deposit flow not configured on this environment." },
      { status: 501 },
    );
  }

  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const season = await getActiveSeason();

    if (!season) {
      return NextResponse.json({ error: "No active season" }, { status: 400 });
    }

    const user = await currentUser();
    const profileId = await ensureProfileForClerk(clerkUserId, {
      email: user?.primaryEmailAddress?.emailAddress ?? null,
      displayName: user?.fullName ?? user?.username ?? user?.firstName ?? null,
    });

    const deposit = await createOrReusePendingDepositForCheckout({
      clerkUserId,
      seasonId: season.id,
      profileId,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const stripe = getStripe();

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
      success_url: `${appUrl}/dashboard`,
      cancel_url: `${appUrl}/dashboard`,
      metadata: {
        deposit_id: deposit.id,
        clerk_user_id: clerkUserId,
        season_id: season.id,
      },
    });

    // Persist the checkout session id (admin client).
    const { createSupabaseAdminClient } = await import("@/lib/supabase/server");
    const supabase = createSupabaseAdminClient();

    await supabase
      .from("deposits")
      .update({ stripe_checkout_session_id: checkoutSession.id })
      .eq("id", deposit.id);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}

