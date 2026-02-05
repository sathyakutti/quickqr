"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Smartphone, RotateCcw } from "lucide-react";
import { PRICING, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PricingClientProps {
  freeFeatures: string[];
  premiumFeatures: string[];
}

type PaymentMethod = "card" | "upi";
type BillingInterval = "monthly" | "yearly";

export function PricingClient({
  freeFeatures,
  premiumFeatures,
}: PricingClientProps) {
  const [interval, setInterval] = useState<BillingInterval>("yearly");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [restoreEmail, setRestoreEmail] = useState("");
  const [restoreOtp, setRestoreOtp] = useState("");
  const [restoreStep, setRestoreStep] = useState<"email" | "otp">("email");
  const [restoring, setRestoring] = useState(false);

  // Check current premium status
  useEffect(() => {
    fetch("/api/premium/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.isPremium) setIsPremium(true);
      })
      .catch(() => {});
  }, []);

  const handleSendCode = useCallback(async () => {
    if (!restoreEmail.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    setRestoring(true);
    try {
      const res = await fetch("/api/restore/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: restoreEmail.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Verification code sent! Check your email.");
        setRestoreStep("otp");
      } else {
        toast.error(data.error || "No active subscription found for this email.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setRestoring(false);
    }
  }, [restoreEmail]);

  const handleVerifyOtp = useCallback(async () => {
    if (!restoreOtp.trim()) {
      toast.error("Please enter the verification code.");
      return;
    }
    setRestoring(true);
    try {
      const res = await fetch("/api/restore/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: restoreEmail.trim(), otp: restoreOtp.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Premium restored! Refreshing...");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(data.error || "Verification failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setRestoring(false);
    }
  }, [restoreEmail, restoreOtp]);

  const price =
    paymentMethod === "upi"
      ? PRICING[interval].inr
      : PRICING[interval].usd;

  const currency = paymentMethod === "upi" ? "INR" : "USD";
  const symbol = paymentMethod === "upi" ? "\u20B9" : "$";

  const monthlyEquivalent =
    interval === "yearly"
      ? paymentMethod === "upi"
        ? Math.round(PRICING.yearly.inr / 12)
        : Math.round((PRICING.yearly.usd / 12) * 100) / 100
      : price;

  const yearlySavings =
    paymentMethod === "upi"
      ? PRICING.monthly.inr * 12 - PRICING.yearly.inr
      : Math.round((PRICING.monthly.usd * 12 - PRICING.yearly.usd) * 100) / 100;

  const handleCheckout = useCallback(async () => {
    setLoading(true);
    try {
      if (paymentMethod === "card") {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interval }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          toast.error(data?.error || `Checkout failed (${res.status}). Please try again.`);
          return;
        }
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        toast.error("Failed to start checkout. Please try again.");
      } else {
        const res = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interval }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          toast.error(data?.error || `Checkout failed (${res.status}). Please try again.`);
          return;
        }
        const data = await res.json();
        if (data.subscriptionId && data.keyId) {
          openRazorpayCheckout(data.subscriptionId, data.keyId);
          return;
        }
        toast.error("Failed to start checkout. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [paymentMethod, interval]);

  return (
    <div className="mt-12 space-y-8">
      {/* Billing interval toggle */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setInterval("monthly")}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            interval === "monthly"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setInterval("yearly")}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            interval === "yearly"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Yearly
          {interval === "yearly" && (
            <Badge variant="secondary" className="ml-2">
              Save {symbol}{yearlySavings}
            </Badge>
          )}
        </button>
      </div>

      {/* Active subscription banner */}
      {isPremium && (
        <div className="rounded-lg border border-primary bg-primary/5 p-4 text-center">
          <p className="text-sm font-medium text-primary">
            You have an active Premium subscription.
          </p>
          <a
            href="/#main-content"
            className="mt-1 inline-block text-sm text-muted-foreground underline hover:text-foreground"
          >
            Go create QR codes
          </a>
        </div>
      )}

      {/* Pricing cards */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Free plan */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-bold text-foreground">Free</h2>
            <div className="mt-2">
              <span className="text-4xl font-bold text-foreground">$0</span>
              <span className="text-muted-foreground">/forever</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Everything you need to generate basic QR codes
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3" role="list">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="mt-6 w-full" asChild>
              <a href="/#main-content">Get Started</a>
            </Button>
          </CardContent>
        </Card>

        {/* Premium plan */}
        <Card className="border-primary ring-1 ring-primary">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">Premium</h2>
              <Badge>Popular</Badge>
            </div>
            <div className="mt-2">
              <span className="text-4xl font-bold text-foreground">
                {symbol}{interval === "yearly" ? monthlyEquivalent : price}
              </span>
              <span className="text-muted-foreground">/month</span>
              {interval === "yearly" && (
                <span className="ml-2 text-sm text-muted-foreground">
                  billed {symbol}{price}/{currency === "INR" ? "yr" : "yr"}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Full customization, high-res downloads, no watermark
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3" role="list">
              {premiumFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Payment method toggle */}
            <div className="mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  paymentMethod === "card"
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={paymentMethod === "card"}
              >
                <CreditCard className="size-4" aria-hidden="true" />
                Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  paymentMethod === "upi"
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={paymentMethod === "upi"}
              >
                <Smartphone className="size-4" aria-hidden="true" />
                UPI
              </button>
            </div>

            <Button
              className="mt-4 w-full"
              onClick={handleCheckout}
              disabled={loading}
              aria-label={
                loading
                  ? "Processing checkout"
                  : `Subscribe to ${SITE_NAME} Premium with ${paymentMethod === "card" ? "card" : "UPI"}`
              }
            >
              {loading ? "Processing..." : "Subscribe Now"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Restore purchase section */}
      {!isPremium && (
        <div className="mt-8 rounded-lg border border-border p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
            <RotateCcw className="size-4" aria-hidden="true" />
            Already subscribed?
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {restoreStep === "email"
              ? "Enter the email you used to subscribe. We'll send a verification code."
              : `Enter the 6-digit code sent to ${restoreEmail}`}
          </p>

          {restoreStep === "email" ? (
            <div className="mt-3 flex items-center gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={restoreEmail}
                onChange={(e) => setRestoreEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleSendCode}
                disabled={restoring}
              >
                {restoring ? "Sending..." : "Send Code"}
              </Button>
            </div>
          ) : (
            <div className="mt-3 max-w-md mx-auto space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  value={restoreOtp}
                  onChange={(e) => setRestoreOtp(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-center tracking-widest placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleVerifyOtp}
                  disabled={restoring}
                >
                  {restoring ? "Verifying..." : "Verify"}
                </Button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRestoreStep("email");
                  setRestoreOtp("");
                }}
                className="text-xs text-muted-foreground underline hover:text-foreground"
              >
                Use a different email
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Open Razorpay checkout modal.
 * Razorpay.js is loaded dynamically on demand.
 */
function openRazorpayCheckout(subscriptionId: string, keyId: string) {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => {
    const options = {
      key: keyId,
      subscription_id: subscriptionId,
      name: SITE_NAME,
      description: "Premium Subscription",
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_subscription_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const res = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (res.ok) {
            window.location.href = "/?payment=success";
            return;
          }
        } catch {
          // Verification request failed, but payment was already made
        }
        // Payment succeeded (money deducted) — redirect even if verify had issues.
        // The webhook will handle setting premium status.
        window.location.href = "/?payment=success";
      },
      modal: {
        ondismiss: () => {
          toast.error("Payment was not completed. Please try again.");
        },
      },
      theme: {
        color: "#000000",
      },
    };
    // @ts-expect-error — Razorpay is loaded via script tag
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (resp: { error?: { description?: string } }) => {
      toast.error(resp.error?.description || "Payment failed. Please try again.");
    });
    rzp.open();
  };
  document.body.appendChild(script);
}
