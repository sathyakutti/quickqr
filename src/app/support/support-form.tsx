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

export function SupportForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email.trim()) {
        toast.error("Please enter your email address.");
        return;
      }
      if (!message.trim() || message.trim().length < 10) {
        toast.error("Please provide a message (at least 10 characters).");
        return;
      }

      setSending(true);
      try {
        const res = await fetch("/api/support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            category,
            message: message.trim(),
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
    [name, email, category, message]
  );

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          htmlFor="support-email"
          className="block text-sm font-medium text-foreground"
        >
          Email <span className="text-destructive">*</span>
        </label>
        <input
          id="support-email"
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
