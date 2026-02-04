/**
 * Premium cookie management — Edge-compatible (Web Crypto API).
 * Uses AES-256-GCM for encryption and PBKDF2 for key derivation.
 */

import { cookies } from "next/headers";

const COOKIE_NAME = "quickqr_premium";

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

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const buffer = new ArrayBuffer(hex.length / 2);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function deriveKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("quickqr-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt premium payload into a cookie-safe string.
 */
export async function encryptPremiumPayload(
  payload: PremiumPayload
): Promise<string> {
  const secret = getCookieSecret();
  const key = await deriveKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  // Web Crypto AES-GCM appends 16-byte auth tag to ciphertext
  const encryptedBytes = new Uint8Array(encrypted);
  const ciphertext = encryptedBytes.slice(0, encryptedBytes.length - 16);
  const authTag = encryptedBytes.slice(encryptedBytes.length - 16);

  // Format: iv:authTag:ciphertext (all hex-encoded)
  return `${bytesToHex(iv)}:${bytesToHex(authTag)}:${bytesToHex(ciphertext)}`;
}

/**
 * Decrypt premium cookie value back to a payload.
 * Returns null if decryption fails (tampered/expired/invalid).
 */
export async function decryptPremiumPayload(
  value: string
): Promise<PremiumPayload | null> {
  try {
    const secret = getCookieSecret();
    const key = await deriveKey(secret);
    const [ivHex, authTagHex, encryptedHex] = value.split(":");

    if (!ivHex || !authTagHex || !encryptedHex) return null;

    const iv = hexToBytes(ivHex);
    const authTag = hexToBytes(authTagHex);
    const ciphertext = hexToBytes(encryptedHex);

    // Web Crypto expects ciphertext + authTag concatenated
    const combined = new Uint8Array(ciphertext.length + authTag.length);
    combined.set(ciphertext);
    combined.set(authTag, ciphertext.length);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      combined
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decrypted)) as PremiumPayload;
  } catch {
    return null;
  }
}

/**
 * Set the premium cookie after successful payment.
 */
export async function setPremiumCookie(
  payload: PremiumPayload
): Promise<void> {
  const cookieStore = await cookies();
  const encrypted = await encryptPremiumPayload(payload);

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

  const payload = await decryptPremiumPayload(cookie.value);
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
