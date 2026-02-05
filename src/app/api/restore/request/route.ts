import { NextRequest, NextResponse } from "next/server";
import {
  searchStripeCustomersByEmail,
  listActiveSubscriptions,
} from "@/lib/payments/stripe";
import { findRazorpaySubscriptionByEmail } from "@/lib/payments/razorpay";
import { setOtpCookie } from "@/lib/payments/premium";

/**
 * POST /api/restore/request
 *
 * Step 1 of OTP-verified restore flow:
 * - Checks if email has an active subscription
 * - Generates a 6-digit OTP
 * - Sends OTP via Resend
 * - Stores encrypted OTP token in httpOnly cookie
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

    const trimmedEmail = email.trim().toLowerCase();

    // Verify subscription exists before sending OTP
    let found = false;

    try {
      const customers = await searchStripeCustomersByEmail(trimmedEmail);
      for (const customer of customers.data) {
        const subs = await listActiveSubscriptions(customer.id);
        if (subs.data.length > 0) {
          found = true;
          break;
        }
      }
    } catch {
      // Stripe search failed, try Razorpay
    }

    if (!found) {
      try {
        const razorpaySub =
          await findRazorpaySubscriptionByEmail(trimmedEmail);
        if (razorpaySub) found = true;
      } catch {
        // Razorpay search failed
      }
    }

    if (!found) {
      return NextResponse.json(
        { error: "No active subscription found for this email" },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = String(
      Math.floor(100000 + Math.random() * 900000)
    );

    // Send OTP via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "QuickQR <noreply@quickqrcode.app>",
        to: [trimmedEmail],
        subject: "Your QuickQR verification code",
        text: `Your verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, you can safely ignore this email.`,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.json().catch(() => null);
      return NextResponse.json(
        {
          error:
            (err as { message?: string })?.message ||
            "Failed to send verification email",
        },
        { status: 500 }
      );
    }

    // Store encrypted OTP token in cookie (10 min expiry)
    await setOtpCookie({
      email: trimmedEmail,
      otp,
      expiresAt: Math.floor(Date.now() / 1000) + 60 * 10,
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send code";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
