export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getStripe, getStripePriceId } from "@/lib/payments/stripe";
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

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${SITE_URL}/?payment=success`,
      cancel_url: `${SITE_URL}/pricing?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
