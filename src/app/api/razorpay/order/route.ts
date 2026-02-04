export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import {
  createRazorpaySubscription,
  getRazorpayPlanId,
} from "@/lib/payments/razorpay";

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

    const planId = getRazorpayPlanId(interval);

    const subscription = await createRazorpaySubscription(
      planId,
      interval === "monthly" ? 12 : 1
    );

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create subscription";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
