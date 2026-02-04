"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Smartphone } from "lucide-react";
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
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        toast.error(data.error || "Failed to start checkout. Please try again.");
      } else {
        const res = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interval }),
        });
        const data = await res.json();
        if (data.subscriptionId && data.keyId) {
          openRazorpayCheckout(data.subscriptionId, data.keyId);
          return;
        }
        toast.error(data.error || "Failed to start checkout. Please try again.");
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
        // Verify on backend
        const res = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });
        const data = await res.json();
        if (data.success) {
          window.location.href = "/?payment=success";
        }
      },
      theme: {
        color: "#000000",
      },
    };
    // @ts-expect-error — Razorpay is loaded via script tag
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  document.body.appendChild(script);
}
