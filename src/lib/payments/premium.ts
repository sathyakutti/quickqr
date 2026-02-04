import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "quickqr_premium";
const ALGORITHM = "aes-256-gcm";

function getCookieSecret(): string {
  const secret = process.env.PREMIUM_COOKIE_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "PREMIUM_COOKIE_SECRET must be at least 32 characters"
    );
  }
  return secret;
}

export interface PremiumPayload {
  provider: "stripe" | "razorpay";
  customerId: string;
  subscriptionId: string;
  status: "active" | "cancelled" | "past_due";
  expiresAt: number; // Unix timestamp in seconds
}

/**
 * Encrypt premium payload into a cookie-safe string.
 */
export function encryptPremiumPayload(payload: PremiumPayload): string {
  const secret = getCookieSecret();
  const key = crypto.scryptSync(secret, "quickqr-salt", 32);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const json = JSON.stringify(payload);
  let encrypted = cipher.update(json, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  // Format: iv:authTag:encrypted
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypt premium cookie value back to a payload.
 * Returns null if decryption fails (tampered/expired/invalid).
 */
export function decryptPremiumPayload(
  value: string
): PremiumPayload | null {
  try {
    const secret = getCookieSecret();
    const key = crypto.scryptSync(secret, "quickqr-salt", 32);
    const [ivHex, authTagHex, encrypted] = value.split(":");

    if (!ivHex || !authTagHex || !encrypted) return null;

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted) as PremiumPayload;
  } catch {
    return null;
  }
}

/**
 * Set the premium cookie after successful payment.
 */
export async function setPremiumCookie(payload: PremiumPayload): Promise<void> {
  const cookieStore = await cookies();
  const encrypted = encryptPremiumPayload(payload);

  cookieStore.set(COOKIE_NAME, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 400, // 400 days (max allowed)
  });
}

/**
 * Clear the premium cookie (on subscription cancellation).
 */
export async function clearPremiumCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Read and validate the premium cookie.
 * Returns the payload if the user has an active premium subscription, null otherwise.
 */
export async function getPremiumStatus(): Promise<PremiumPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);

  if (!cookie?.value) return null;

  const payload = decryptPremiumPayload(cookie.value);
  if (!payload) return null;

  // Check if subscription is still active
  if (payload.status !== "active") return null;

  // Check if the cached expiry has passed
  const now = Math.floor(Date.now() / 1000);
  if (payload.expiresAt < now) {
    // Cookie expired — caller should re-verify with provider
    return null;
  }

  return payload;
}

/**
 * Simple boolean check for premium status (for use in components).
 */
export async function isPremium(): Promise<boolean> {
  const status = await getPremiumStatus();
  return status !== null;
}
