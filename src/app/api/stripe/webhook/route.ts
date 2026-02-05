import { NextRequest, NextResponse } from "next/server";
import {
  verifyStripeWebhookSignature,
  retrieveStripeSubscription,
} from "@/lib/payments/stripe";
import {
  setPremiumCookie,
  clearPremiumCookie,
} from "@/lib/payments/premium";

/**
 * Extract current_period_end from a subscription.
 */
function getSubscriptionPeriodEnd(subscription: {
  items?: { data: Array<{ current_period_end?: number }> };
}): number {
  const firstItem = subscription.items?.data?.[0];
  if (firstItem?.current_period_end) {
    return firstItem.current_period_end;
  }
  // Fallback: 30 days from now
  return Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event;
  try {
    event = await verifyStripeWebhookSignature(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const obj = event.data.object;

  switch (event.type) {
    case "checkout.session.completed": {
      if (obj.subscription && obj.customer) {
        const subscription = await retrieveStripeSubscription(
          obj.subscription as string
        );
        await setPremiumCookie({
          provider: "stripe",
          customerId: obj.customer as string,
          subscriptionId: subscription.id,
          status: "active",
          expiresAt: getSubscriptionPeriodEnd(subscription),
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const status = obj.status;
      const expiresAt = getSubscriptionPeriodEnd(obj);

      if (status === "active") {
        await setPremiumCookie({
          provider: "stripe",
          customerId: obj.customer as string,
          subscriptionId: obj.id,
          status: "active",
          expiresAt,
        });
      } else if (status === "past_due") {
        await setPremiumCookie({
          provider: "stripe",
          customerId: obj.customer as string,
          subscriptionId: obj.id,
          status: "past_due",
          expiresAt,
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      await clearPremiumCookie();
      break;
    }
  }

  return NextResponse.json({ received: true });
}
