import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required");
    }
    _stripe = new Stripe(key, {
      apiVersion: "2026-01-28.clover",
      typescript: true,
    });
  }
  return _stripe;
}

export function getStripePriceId(interval: "monthly" | "yearly"): string {
  const envKey =
    interval === "monthly"
      ? "STRIPE_MONTHLY_PRICE_ID"
      : "STRIPE_YEARLY_PRICE_ID";
  const priceId = process.env[envKey];
  if (!priceId) {
    throw new Error(`${envKey} environment variable is required`);
  }
  return priceId;
}
