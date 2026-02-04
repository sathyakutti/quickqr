"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "quickqr_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background p-4 shadow-lg sm:flex sm:items-center sm:justify-between sm:gap-4 sm:px-6"
    >
      <p className="text-sm text-muted-foreground">
        We use cookies for essential functionality and to display advertisements.
        By continuing to use this site, you consent to our use of cookies.{" "}
        <a
          href="/legal/privacy"
          className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
        >
          Privacy Policy
        </a>
      </p>
      <div className="mt-3 flex gap-2 sm:mt-0 sm:shrink-0">
        <Button size="sm" onClick={accept}>
          Accept
        </Button>
        <Button size="sm" variant="outline" onClick={decline}>
          Decline
        </Button>
      </div>
    </div>
  );
}
