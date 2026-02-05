"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "Payment issue",
  "Premium subscription",
  "Technical problem",
  "Feature request",
  "General question",
] as const;

const PAYMENT_CATEGORIES = ["Payment issue", "Premium subscription"];

type Step = "email" | "otp" | "form";

export function SupportForm() {
  // OTP verification state
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Form state (shown after OTP verified)
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [paymentProvider, setPaymentProvider] = useState<string>("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const isPaymentCategory = PAYMENT_CATEGORIES.includes(category);

  // Step 1: Send OTP to email
  const handleSendOtp = useCallback(async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch("/api/support/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Verification code sent! Check your email.");
        setStep("otp");
      } else {
        toast.error(data.error || "Failed to send code. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setVerifying(false);
    }
  }, [email]);

  // Step 2: Verify OTP
  const handleVerifyOtp = useCallback(async () => {
    if (!otp.trim()) {
      toast.error("Please enter the verification code.");
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch("/api/support/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Email verified!");
        setStep("form");
      } else {
        toast.error(data.error || "Invalid code. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setVerifying(false);
    }
  }, [email, otp]);

  // Step 3: Submit support form
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!message.trim() || message.trim().length < 10) {
        toast.error("Please provide a message (at least 10 characters).");
        return;
      }

      setSending(true);
      try {
        const fullMessage = isPaymentCategory && paymentProvider
          ? `[Payment Provider: ${paymentProvider}]\n\n${message.trim()}`
          : message.trim();

        const res = await fetch("/api/support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            category,
            message: fullMessage,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setSent(true);
          toast.success("Message sent! We'll get back to you soon.");
        } else {
          toast.error(data.error || "Failed to send message. Please try again.");
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setSending(false);
      }
    },
    [name, email, category, message, paymentProvider, isPaymentCategory]
  );

  // Success state
  if (sent) {
    return (
      <div className="rounded-lg border border-primary bg-primary/5 p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Message sent!
        </h2>
        <p className="mt-2 text-muted-foreground">
          Thank you for reaching out. We&apos;ll respond to{" "}
          <span className="font-medium text-foreground">{email}</span> as soon
          as possible.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            setSent(false);
            setMessage("");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  // Step 1: Email input
  if (step === "email") {
    return (
      <div className="space-y-4">
        <div>
          <label
            htmlFor="support-email"
            className="block text-sm font-medium text-foreground"
          >
            Email <span className="text-destructive">*</span>
          </label>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ll send a verification code to confirm your email.
          </p>
          <input
            id="support-email"
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
            className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            autoFocus
          />
        </div>
        <Button
          className="w-full"
          onClick={handleSendOtp}
          disabled={verifying}
        >
          {verifying ? "Sending..." : "Send Verification Code"}
        </Button>
      </div>
    );
  }

  // Step 2: OTP verification
  if (step === "otp") {
    return (
      <div className="space-y-4">
        <div>
          <label
            htmlFor="support-otp"
            className="block text-sm font-medium text-foreground"
          >
            Verification Code
          </label>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the 6-digit code sent to {email}
          </p>
          <input
            id="support-otp"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
            className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-center tracking-widest placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            autoFocus
          />
        </div>
        <Button
          className="w-full"
          onClick={handleVerifyOtp}
          disabled={verifying}
        >
          {verifying ? "Verifying..." : "Verify"}
        </Button>
        <button
          type="button"
          onClick={() => {
            setStep("email");
            setOtp("");
          }}
          className="block mx-auto text-xs text-muted-foreground underline hover:text-foreground"
        >
          Use a different email
        </button>
      </div>
    );
  }

  // Step 3: Full support form (after OTP verified)
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-md bg-muted p-3 text-sm">
        <span className="text-muted-foreground">Verified email: </span>
        <span className="font-medium text-foreground">{email}</span>
      </div>

      <div>
        <label
          htmlFor="support-name"
          className="block text-sm font-medium text-foreground"
        >
          Name <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="support-name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div>
        <label
          htmlFor="support-category"
          className="block text-sm font-medium text-foreground"
        >
          Category
        </label>
        <select
          id="support-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {isPaymentCategory && (
        <div>
          <label
            htmlFor="support-provider"
            className="block text-sm font-medium text-foreground"
          >
            Payment Method
          </label>
          <select
            id="support-provider"
            value={paymentProvider}
            onChange={(e) => setPaymentProvider(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select payment method...</option>
            <option value="UPI (Razorpay)">UPI (Razorpay)</option>
            <option value="Card (Stripe)">Card (Stripe)</option>
          </select>
        </div>
      )}

      <div>
        <label
          htmlFor="support-message"
          className="block text-sm font-medium text-foreground"
        >
          Message <span className="text-destructive">*</span>
        </label>
        <textarea
          id="support-message"
          required
          rows={5}
          placeholder="Describe your issue or question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
        />
      </div>

      <Button type="submit" className="w-full" disabled={sending}>
        {sending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
