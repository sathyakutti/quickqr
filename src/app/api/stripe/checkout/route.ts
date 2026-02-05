import { NextRequest, NextResponse } from "next/server";
import {
  createStripeCheckoutSession,
  getStripePriceId,
} from "@/lib/payments/stripe";
import { SITE_URL } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const interval = body.interval as "monthly" | "yearly";

    if (interval !== "monthly" && interval !== "yearly") {
      return NextResponse.json(
        { error: "Invalid interval. Must be 'monthly' or 'yearly'." },
        { status: 400 }
      );
    }

    const priceId = getStripePriceId(interval);

    const session = await createStripeCheckoutSession(
      priceId,
      `${SITE_URL}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      `${SITE_URL}/pricing?payment=cancelled`
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
