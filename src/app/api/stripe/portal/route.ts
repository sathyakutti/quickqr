export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { createStripeBillingPortalSession } from "@/lib/payments/stripe";
import { getPremiumStatus } from "@/lib/payments/premium";
import { SITE_URL } from "@/lib/constants";

export async function POST(_request: NextRequest) {
  try {
    const premium = await getPremiumStatus();

    if (!premium || premium.provider !== "stripe") {
      return NextResponse.json(
        { error: "No active Stripe subscription found" },
        { status: 403 }
      );
    }

    const session = await createStripeBillingPortalSession(
      premium.customerId,
      `${SITE_URL}/pricing`
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create portal session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
