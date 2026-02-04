import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME}. Learn how we handle your data.`,
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: February 2026
      </p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            1. Introduction
          </h2>
          <p className="text-muted-foreground">
            {SITE_NAME} (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the website at{" "}
            <span className="text-foreground">{SITE_URL}</span>. This Privacy
            Policy explains how we collect, use, and protect your information
            when you use our QR code generation service.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            2. Information We Collect
          </h2>
          <p className="text-muted-foreground">
            <strong className="text-foreground">QR Code Data:</strong> All QR code
            generation happens entirely in your browser. The data you enter into
            our forms (URLs, WiFi passwords, contact details, payment addresses,
            etc.) is never sent to or stored on our servers. Your data stays on
            your device.
          </p>
          <p className="mt-3 text-muted-foreground">
            <strong className="text-foreground">Payment Information:</strong> If
            you subscribe to our premium plan, payment processing is handled by
            our third-party payment providers (Stripe and Razorpay). We do not
            store credit card numbers or UPI IDs on our servers. We receive a
            customer identifier and subscription status from these providers.
          </p>
          <p className="mt-3 text-muted-foreground">
            <strong className="text-foreground">Usage Data:</strong> We may use
            cookies and analytics services to understand how visitors use our
            website. This may include pages visited, browser type, device type,
            and approximate geographic location.
          </p>
          <p className="mt-3 text-muted-foreground">
            <strong className="text-foreground">Advertising:</strong> We use
            Google AdSense to display advertisements to free-tier users. Google
            may use cookies to serve ads based on your browsing history. You can
            manage your ad preferences through Google&apos;s Ad Settings.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>To provide and maintain our QR code generation service</li>
            <li>To process premium subscription payments</li>
            <li>To display relevant advertisements to free-tier users</li>
            <li>To analyze usage patterns and improve our service</li>
            <li>To communicate with you about your subscription status</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            4. Data Storage
          </h2>
          <p className="text-muted-foreground">
            We do not operate a database for user data. QR code generation is
            entirely client-side. Premium subscription status is stored in an
            encrypted HTTP-only cookie on your browser. Download count tracking
            uses your browser&apos;s localStorage.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            5. Third-Party Services
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              <strong className="text-foreground">Stripe:</strong> For
              international card payments. See{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
              >
                Stripe&apos;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong className="text-foreground">Razorpay:</strong> For UPI
              payments in India. See{" "}
              <a
                href="https://razorpay.com/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
              >
                Razorpay&apos;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong className="text-foreground">Google AdSense:</strong> For
              serving advertisements. See{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
              >
                Google&apos;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong className="text-foreground">Cloudflare:</strong> For
              hosting and CDN. See{" "}
              <a
                href="https://www.cloudflare.com/privacypolicy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
              >
                Cloudflare&apos;s Privacy Policy
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            6. Cookies
          </h2>
          <p className="text-muted-foreground">
            We use the following cookies:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              <strong className="text-foreground">Premium subscription cookie</strong>{" "}
              — An encrypted HTTP-only cookie that stores your subscription
              status. Essential for premium features.
            </li>
            <li>
              <strong className="text-foreground">Theme preference</strong> — A
              cookie that remembers your light/dark mode preference.
            </li>
            <li>
              <strong className="text-foreground">Advertising cookies</strong>{" "}
              — Set by Google AdSense for ad personalization (free tier only).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            7. Your Rights
          </h2>
          <p className="text-muted-foreground">
            Since we do not store your QR code data, there is no personal data
            to request, modify, or delete from our systems. For payment-related
            data, you can manage your subscription through the customer portal
            or contact the relevant payment provider directly.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            8. Changes to This Policy
          </h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            9. Contact
          </h2>
          <p className="text-muted-foreground">
            If you have questions about this Privacy Policy, please contact us
            through our website.
          </p>
        </section>
      </div>
    </div>
  );
}
