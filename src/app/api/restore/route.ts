import { NextRequest, NextResponse } from "next/server";
import {
  searchStripeCustomersByEmail,
  listActiveSubscriptions,
} from "@/lib/payments/stripe";
import { findRazorpaySubscriptionByEmail } from "@/lib/payments/razorpay";
import { setPremiumCookie } from "@/lib/payments/premium";

/**
 * POST /api/restore
 *
 * Restores premium status for returning users on a new browser/device.
 * Searches both Stripe and Razorpay for an active subscription by email.
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

    const trimmedEmail = email.trim();

    // 1. Try Stripe first
    try {
      const customers = await searchStripeCustomersByEmail(trimmedEmail);
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
    } catch {
      // Stripe search failed, continue to Razorpay
    }

    // 2. Try Razorpay
    try {
      const razorpaySub = await findRazorpaySubscriptionByEmail(trimmedEmail);
      if (razorpaySub) {
        await setPremiumCookie({
          provider: "razorpay",
          customerId: razorpaySub.customer_id || razorpaySub.id,
          subscriptionId: razorpaySub.id,
          status: "active",
          expiresAt: razorpaySub.current_end,
        });

        return NextResponse.json({ success: true, provider: "razorpay" });
      }
    } catch {
      // Razorpay search failed
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
