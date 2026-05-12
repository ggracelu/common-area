import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getStripe } from "@/lib/stripe";
import { getActiveSeason } from "@/lib/catalog";
import { createOrReusePendingDepositForCheckout } from "@/lib/deposits";
import { ensureProfileForClerk } from "@/lib/profile-sync";

export async function POST() {
  // Safety: if secrets aren't configured, don't attempt server auth/payment.
  if (!process.env.CLERK_SECRET_KEY || !process.env.SUPABASE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY) {
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

