/**
 * Stripe helpers — Edge-compatible (Web Crypto API + fetch).
 * No `stripe` npm package — uses Stripe REST API directly.
 */

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSHA256(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(message)
  );
  return bytesToHex(new Uint8Array(signature));
}

function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY environment variable is required");
  }
  return key;
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

/**
 * Make a request to the Stripe REST API.
 */
async function stripeRequest<T>(
  endpoint: string,
  params?: Record<string, string>,
  method: "GET" | "POST" = "POST"
): Promise<T> {
  const key = getStripeSecretKey();
  const url = `https://api.stripe.com/v1${endpoint}`;

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  if (params && method === "POST") {
    options.body = new URLSearchParams(params).toString();
  }

  const response = await fetch(
    method === "GET" && params
      ? `${url}?${new URLSearchParams(params).toString()}`
      : url,
    options
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { error?: { message?: string } }).error?.message ||
        `Stripe API error (${response.status})`
    );
  }

  return response.json() as Promise<T>;
}

/**
 * Create a Stripe Checkout Session.
 */
export async function createStripeCheckoutSession(
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ url: string }> {
  return stripeRequest<{ url: string }>("/checkout/sessions", {
    mode: "subscription",
    "payment_method_types[0]": "card",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

/**
 * Create a Stripe Billing Portal Session.
 */
export async function createStripeBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<{ url: string }> {
  return stripeRequest<{ url: string }>("/billing_portal/sessions", {
    customer: customerId,
    return_url: returnUrl,
  });
}

interface StripeSubscriptionItem {
  current_period_end?: number;
}

interface StripeSubscription {
  id: string;
  status: string;
  customer: string;
  items: {
    data: StripeSubscriptionItem[];
  };
}

/**
 * Retrieve a Stripe Subscription.
 */
export async function retrieveStripeSubscription(
  subscriptionId: string
): Promise<StripeSubscription> {
  return stripeRequest<StripeSubscription>(
    `/subscriptions/${subscriptionId}`,
    { "expand[0]": "items.data" },
    "GET"
  );
}

/**
 * Verify Stripe webhook signature using Web Crypto API.
 * Returns the parsed event body if valid, throws if invalid.
 */
export async function verifyStripeWebhookSignature(
  body: string,
  signatureHeader: string,
  secret: string
): Promise<StripeWebhookEvent> {
  const parts = signatureHeader.split(",").reduce(
    (acc, part) => {
      const [key, value] = part.split("=");
      if (key === "t") acc.timestamp = value;
      if (key === "v1") acc.signatures.push(value);
      return acc;
    },
    { timestamp: "", signatures: [] as string[] }
  );

  if (!parts.timestamp || parts.signatures.length === 0) {
    throw new Error("Invalid Stripe signature header format");
  }

  const signedPayload = `${parts.timestamp}.${body}`;
  const expectedSignature = await hmacSHA256(secret, signedPayload);

  const isValid = parts.signatures.some((sig) => sig === expectedSignature);
  if (!isValid) {
    throw new Error("Invalid Stripe webhook signature");
  }

  // Optionally check timestamp tolerance (5 min)
  const tolerance = 300;
  const timestampAge =
    Math.floor(Date.now() / 1000) - parseInt(parts.timestamp, 10);
  if (Math.abs(timestampAge) > tolerance) {
    throw new Error("Stripe webhook timestamp outside tolerance");
  }

  return JSON.parse(body) as StripeWebhookEvent;
}

// Stripe webhook event types used in our webhook handler
export interface StripeWebhookEvent {
  type: string;
  data: {
    object: {
      id: string;
      subscription?: string;
      customer?: string;
      status?: string;
      items?: {
        data: StripeSubscriptionItem[];
      };
    };
  };
}
