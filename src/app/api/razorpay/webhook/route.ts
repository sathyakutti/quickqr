import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature } from "@/lib/payments/razorpay";
import {
  setPremiumCookie,
  clearPremiumCookie,
} from "@/lib/payments/premium";

export const runtime = "edge";

interface RazorpayWebhookPayload {
  event: string;
  payload: {
    subscription?: {
      entity: {
        id: string;
        customer_id: string;
        status: string;
        current_end: number;
      };
    };
  };
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing x-razorpay-signature header" },
      { status: 400 }
    );
  }

  const isValid = await verifyRazorpayWebhookSignature(body, signature);
  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  const data: RazorpayWebhookPayload = JSON.parse(body);
  const subscription = data.payload.subscription?.entity;

  if (!subscription) {
    return NextResponse.json({ received: true });
  }

  switch (data.event) {
    case "subscription.activated":
    case "subscription.charged": {
      await setPremiumCookie({
        provider: "razorpay",
        customerId: subscription.customer_id,
        subscriptionId: subscription.id,
        status: "active",
        expiresAt: subscription.current_end,
      });
      break;
    }

    case "subscription.halted":
    case "subscription.cancelled": {
      await clearPremiumCookie();
      break;
    }

    case "subscription.pending": {
      await setPremiumCookie({
        provider: "razorpay",
        customerId: subscription.customer_id,
        subscriptionId: subscription.id,
        status: "past_due",
        expiresAt: subscription.current_end,
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
