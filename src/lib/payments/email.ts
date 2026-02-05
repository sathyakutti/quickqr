/**
 * Email helpers — sends transactional emails via Resend REST API.
 * Edge-compatible (fetch only, no npm packages).
 */

import { PRICING } from "@/lib/constants";

interface ConfirmationEmailParams {
  email: string;
  plan: "monthly" | "yearly";
  provider: "stripe" | "razorpay";
}

/**
 * Send a payment confirmation email after successful subscription.
 * Returns true on success, false on failure. Never throws.
 */
export async function sendPaymentConfirmationEmail(
  params: ConfirmationEmailParams
): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return false;

  const { email, plan, provider } = params;

  const isInr = provider === "razorpay";
  const price = isInr ? PRICING[plan].inr : PRICING[plan].usd;
  const symbol = isInr ? "\u20B9" : "$";
  const planLabel = plan === "monthly" ? "Monthly" : "Yearly";
  const period = plan === "monthly" ? "/mo" : "/yr";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "QuickQR <noreply@quickqrcode.app>",
        to: [email],
        subject: "Your QuickQR Premium subscription is confirmed",
        text: [
          "Hi there,",
          "",
          "Your QuickQR Premium subscription is now active!",
          "",
          `Plan: ${planLabel} Premium`,
          `Amount: ${symbol}${price}${period}`,
          "",
          "Restore premium on other devices:",
          "Visit quickqrcode.app/pricing, scroll to \"Already subscribed?\",",
          "and enter this email address. We'll send you a verification code.",
          "",
          "Need help? Reply to this email.",
          "",
          "— QuickQR",
          "https://quickqrcode.app",
        ].join("\n"),
      }),
    });

    return res.ok;
  } catch {
    return false;
  }
}
