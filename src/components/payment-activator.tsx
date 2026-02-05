"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";

/**
 * Handles post-payment activation, success dialog, and cancel toasts.
 * Placed in the root layout so it works regardless of which page
 * the user lands on after payment.
 */
export function PaymentActivator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handledRef = useRef(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

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
            setSuccessDialogOpen(true);
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
      setSuccessDialogOpen(true);
      cleanUrl();
    } else if (payment === "cancelled") {
      toast.error("Payment was cancelled. You have not been charged.");
      cleanUrl();
    }
  }, [searchParams, router]);

  return (
    <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Check className="size-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Payment Successful!</DialogTitle>
          <DialogDescription className="text-center">
            Your QuickQR Premium subscription is now active.
            A confirmation email has been sent to your inbox.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Restore on other devices:</p>
          <p className="mt-1">
            Visit the pricing page, scroll to &quot;Already subscribed?&quot;,
            and enter the email you used to subscribe.
          </p>
        </div>
        <DialogFooter>
          <Button
            className="w-full"
            onClick={() => {
              setSuccessDialogOpen(false);
              window.location.href = "/#main-content";
            }}
          >
            Start Creating QR Codes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
