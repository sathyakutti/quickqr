import { NextRequest, NextResponse } from "next/server";
import {
  retrieveCheckoutSession,
  retrieveStripeSubscription,
} from "@/lib/payments/stripe";
import { setPremiumCookie } from "@/lib/payments/premium";
import { sendPaymentConfirmationEmail } from "@/lib/payments/email";

/**
 * POST /api/stripe/activate
 *
 * Called from the browser after Stripe checkout redirect.
 * Verifies the session was paid and sets the premium cookie
 * on the user's browser (unlike the webhook which goes to Stripe).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const session = await retrieveCheckoutSession(sessionId);

    if (
      session.payment_status !== "paid" ||
      !session.subscription ||
      !session.customer
    ) {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const subscription = await retrieveStripeSubscription(
      session.subscription
    );

    const expiresAt =
      subscription.items?.data?.[0]?.current_period_end ||
      Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;

    await setPremiumCookie({
      provider: "stripe",
      customerId: session.customer,
      subscriptionId: subscription.id,
      status: "active",
      expiresAt,
    });

    // Determine interval from the subscription's price ID
    const priceId = subscription.items?.data?.[0]?.price?.id;
    const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID;
    const interval: "monthly" | "yearly" =
      priceId === monthlyPriceId ? "monthly" : "yearly";

    // Send confirmation email (non-blocking)
    let emailSent = false;
    const customerEmail = session.customer_details?.email;
    if (customerEmail) {
      emailSent = await sendPaymentConfirmationEmail({
        email: customerEmail,
        plan: interval,
        provider: "stripe",
      });
    }

    return NextResponse.json({ success: true, emailSent });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Activation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
