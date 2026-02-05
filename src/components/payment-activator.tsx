"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Handles post-payment activation and success/cancel toasts.
 * Placed in the root layout so it works regardless of which page
 * the user lands on after payment.
 */
export function PaymentActivator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;

    const payment = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (!payment) return;
    handledRef.current = true;

    const cleanUrl = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      url.searchParams.delete("session_id");
      router.replace(url.pathname + url.search, { scroll: false });
    };

    if (payment === "success" && sessionId) {
      // Stripe: activate premium via browser request (sets cookie on user's browser)
      fetch("/api/stripe/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then(async (res) => {
          if (res.ok) {
            toast.success("Premium activated! Enjoy your subscription.");
          } else {
            // Webhook will handle it eventually
            toast.success("Payment received! Premium will activate shortly.");
          }
        })
        .catch(() => {
          toast.success("Payment received! Premium will activate shortly.");
        })
        .finally(cleanUrl);
    } else if (payment === "success") {
      // Razorpay (cookie already set by /api/razorpay/verify)
      toast.success("Payment received! Premium is now active.");
      cleanUrl();
    } else if (payment === "cancelled") {
      toast.error("Payment was cancelled. You have not been charged.");
      cleanUrl();
    }
  }, [searchParams, router]);

  return null;
}
