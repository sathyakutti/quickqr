import { NextRequest, NextResponse } from "next/server";
import {
  searchStripeCustomersByEmail,
  listActiveSubscriptions,
} from "@/lib/payments/stripe";
import { setPremiumCookie } from "@/lib/payments/premium";

/**
 * POST /api/restore
 *
 * Restores premium status for returning users on a new browser/device.
 * Searches Stripe for an active subscription by email and sets the cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Search Stripe for customers with this email
    const customers = await searchStripeCustomersByEmail(email.trim());

    if (!customers.data.length) {
      return NextResponse.json(
        { error: "No subscription found for this email" },
        { status: 404 }
      );
    }

    // Check each customer for active subscriptions
    for (const customer of customers.data) {
      const subs = await listActiveSubscriptions(customer.id);
      if (subs.data.length > 0) {
        const sub = subs.data[0];
        const expiresAt =
          sub.items?.data?.[0]?.current_period_end ||
          Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;

        await setPremiumCookie({
          provider: "stripe",
          customerId: customer.id,
          subscriptionId: sub.id,
          status: "active",
          expiresAt,
        });

        return NextResponse.json({ success: true, provider: "stripe" });
      }
    }

    return NextResponse.json(
      { error: "No active subscription found for this email" },
      { status: 404 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Restore failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
