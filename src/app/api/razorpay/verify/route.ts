import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { setPremiumCookie } from "@/lib/payments/premium";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = body;

    if (
      !razorpay_payment_id ||
      !razorpay_subscription_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { error: "Missing required payment verification fields" },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpaySignature(
      razorpay_subscription_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Set premium cookie — expires in 35 days (will be refreshed by webhook)
    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 35;

    await setPremiumCookie({
      provider: "razorpay",
      customerId: razorpay_payment_id,
      subscriptionId: razorpay_subscription_id,
      status: "active",
      expiresAt,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Payment verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
