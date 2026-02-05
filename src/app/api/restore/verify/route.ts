import { NextRequest, NextResponse } from "next/server";
import {
  searchStripeCustomersByEmail,
  listActiveSubscriptions,
} from "@/lib/payments/stripe";
import { findRazorpaySubscriptionByEmail } from "@/lib/payments/razorpay";
import {
  getOtpToken,
  clearOtpCookie,
  setPremiumCookie,
} from "@/lib/payments/premium";

/**
 * POST /api/restore/verify
 *
 * Step 2 of OTP-verified restore flow:
 * - Reads encrypted OTP token from cookie
 * - Verifies email + OTP + expiry
 * - If valid, sets premium cookie
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    // Read and decrypt OTP token from cookie
    const token = await getOtpToken();

    if (!token) {
      return NextResponse.json(
        { error: "No verification code found. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify email matches
    if (token.email !== trimmedEmail) {
      return NextResponse.json(
        { error: "Email does not match. Please request a new code." },
        { status: 400 }
      );
    }

    // Verify not expired
    const now = Math.floor(Date.now() / 1000);
    if (now > token.expiresAt) {
      await clearOtpCookie();
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP matches
    if (token.otp !== trimmedOtp) {
      return NextResponse.json(
        { error: "Invalid verification code. Please try again." },
        { status: 400 }
      );
    }

    // OTP verified — now find and restore the subscription
    // Try Stripe first
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

          await clearOtpCookie();
          return NextResponse.json({ success: true, provider: "stripe" });
        }
      }
    } catch {
      // Stripe failed, try Razorpay
    }

    // Try Razorpay
    try {
      const razorpaySub =
        await findRazorpaySubscriptionByEmail(trimmedEmail);
      if (razorpaySub) {
        await setPremiumCookie({
          provider: "razorpay",
          customerId: razorpaySub.customer_id || razorpaySub.id,
          subscriptionId: razorpaySub.id,
          status: "active",
          expiresAt: razorpaySub.current_end,
        });

        await clearOtpCookie();
        return NextResponse.json({ success: true, provider: "razorpay" });
      }
    } catch {
      // Razorpay failed
    }

    await clearOtpCookie();
    return NextResponse.json(
      { error: "Subscription no longer active" },
      { status: 404 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
