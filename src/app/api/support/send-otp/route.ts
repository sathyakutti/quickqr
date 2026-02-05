import { NextRequest, NextResponse } from "next/server";
import { setOtpCookie } from "@/lib/payments/premium";

/**
 * POST /api/support/send-otp
 *
 * Sends a 6-digit OTP to the provided email for support form verification.
 * Stores encrypted OTP in httpOnly cookie (reuses restore OTP infrastructure).
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

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

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
        subject: "Your QuickQR support verification code",
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
