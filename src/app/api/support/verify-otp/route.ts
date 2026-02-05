import { NextRequest, NextResponse } from "next/server";
import { getOtpToken, clearOtpCookie } from "@/lib/payments/premium";

/**
 * POST /api/support/verify-otp
 *
 * Verifies the OTP for support form email verification.
 * On success, clears the OTP cookie (one-time use).
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

    // OTP verified — clear cookie
    await clearOtpCookie();

    return NextResponse.json({ verified: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
