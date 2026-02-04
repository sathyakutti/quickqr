export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/payments/stripe";
import {
  setPremiumCookie,
  clearPremiumCookie,
} from "@/lib/payments/premium";

/**
 * Extract current_period_end from a subscription.
 * In Stripe API 2026+, this lives on SubscriptionItem, not Subscription.
 */
function getSubscriptionPeriodEnd(subscription: Stripe.Subscription): number {
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

  let event: Stripe.Event;
  try {
    // Use constructEventAsync with SubtleCryptoProvider for Edge runtime
    event = await getStripe().webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription && session.customer) {
        const subscription = await getStripe().subscriptions.retrieve(
          session.subscription as string,
          { expand: ["items.data"] }
        );
        await setPremiumCookie({
          provider: "stripe",
          customerId: session.customer as string,
          subscriptionId: subscription.id,
          status: "active",
          expiresAt: getSubscriptionPeriodEnd(subscription),
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const status = subscription.status;
      const expiresAt = getSubscriptionPeriodEnd(subscription);

      if (status === "active") {
        await setPremiumCookie({
          provider: "stripe",
          customerId: subscription.customer as string,
          subscriptionId: subscription.id,
          status: "active",
          expiresAt,
        });
      } else if (status === "past_due") {
        await setPremiumCookie({
          provider: "stripe",
          customerId: subscription.customer as string,
          subscriptionId: subscription.id,
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
