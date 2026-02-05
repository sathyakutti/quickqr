/**
 * Razorpay helpers — Edge-compatible (Web Crypto API + fetch).
 * No Node.js `crypto` or `razorpay` npm package.
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

/**
 * Create a Razorpay subscription via the REST API.
 */
export async function createRazorpaySubscription(
  planId: string,
  totalCount: number
): Promise<{ id: string }> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error(
      "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are required"
    );
  }

  const auth = btoa(`${keyId}:${keySecret}`);
  const response = await fetch("https://api.razorpay.com/v1/subscriptions", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: planId,
      total_count: totalCount,
      customer_notify: 1,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { error?: { description?: string } }).error?.description ||
        "Failed to create Razorpay subscription"
    );
  }

  return response.json() as Promise<{ id: string }>;
}

export function getRazorpayPlanId(interval: "monthly" | "yearly"): string {
  const envKey =
    interval === "monthly"
      ? "RAZORPAY_MONTHLY_PLAN_ID"
      : "RAZORPAY_YEARLY_PLAN_ID";
  const planId = process.env[envKey];
  if (!planId) {
    throw new Error(`${envKey} environment variable is required`);
  }
  return planId;
}

/**
 * Generic Razorpay API GET request.
 */
async function razorpayGet<T>(endpoint: string): Promise<T> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured");
  }
  const auth = btoa(`${keyId}:${keySecret}`);
  const res = await fetch(`https://api.razorpay.com/v1${endpoint}`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!res.ok) {
    throw new Error(`Razorpay API error (${res.status})`);
  }
  return res.json() as Promise<T>;
}

interface RazorpaySubscription {
  id: string;
  status: string;
  customer_id?: string;
  current_end: number;
}

/**
 * Find an active Razorpay subscription by customer email.
 * Lists all subscriptions and checks associated customer emails.
 */
export async function findRazorpaySubscriptionByEmail(
  email: string
): Promise<RazorpaySubscription | null> {
  const subs = await razorpayGet<{ items: RazorpaySubscription[] }>(
    "/subscriptions?count=100"
  );

  for (const sub of subs.items) {
    if (sub.status !== "active" && sub.status !== "authenticated") continue;
    if (!sub.customer_id) continue;

    try {
      const customer = await razorpayGet<{ id: string; email?: string }>(
        `/customers/${sub.customer_id}`
      );
      if (customer.email?.toLowerCase() === email.toLowerCase()) {
        return sub;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = await hmacSHA256(secret, body);
  return expectedSignature === signature;
}

export async function verifyRazorpayWebhookSignature(
  body: string,
  signature: string
): Promise<boolean> {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;

  const expectedSignature = await hmacSHA256(secret, body);
  return expectedSignature === signature;
}
