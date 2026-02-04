import type { Metadata } from "next";
import { SITE_NAME, PRICING, FREE_DAILY_DOWNLOAD_LIMIT } from "@/lib/constants";
import { PricingClient } from "@/components/pricing/pricing-client";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Upgrade to ${SITE_NAME} Premium for custom colors, logo embedding, high-resolution downloads, and no watermark. Plans start at $${PRICING.monthly.usd}/month.`,
  openGraph: {
    title: `Pricing | ${SITE_NAME}`,
    description: `Upgrade to ${SITE_NAME} Premium for custom colors, logo embedding, high-resolution downloads, and no watermark.`,
  },
};

const FREE_FEATURES = [
  "All 19 QR code types",
  `${FREE_DAILY_DOWNLOAD_LIMIT} downloads per day`,
  "PNG format (300px)",
  "Default QR style",
  "QuickQR watermark",
  "Ad-supported",
];

const PREMIUM_FEATURES = [
  "All 19 QR code types",
  "Unlimited downloads",
  "PNG, SVG, and PDF formats",
  "Up to 2000px resolution",
  "Custom foreground and background colors",
  "Upload your logo",
  "6 dot styles + 3 corner styles",
  "No watermark",
  "No ads",
  "Priority support",
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Generate QR codes for free, or upgrade for full customization
        </p>
      </div>

      <PricingClient
        freeFeatures={FREE_FEATURES}
        premiumFeatures={PREMIUM_FEATURES}
      />

      {/* FAQ */}
      <section className="mt-20" aria-labelledby="pricing-faq">
        <h2
          id="pricing-faq"
          className="mb-8 text-center text-2xl font-bold text-foreground"
        >
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-2xl space-y-4">
          <details className="group rounded-lg border border-border p-4">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              Can I use the free tier commercially?
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Yes. QR codes generated with the free tier can be used for any purpose, including commercial use. The only limitation is the &quot;Made with QuickQR&quot; watermark on downloaded images.
            </p>
          </details>
          <details className="group rounded-lg border border-border p-4">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              What payment methods do you accept?
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              We accept international credit/debit cards via Stripe, and UPI payments via Razorpay for users in India. Choose your preferred method on the checkout page.
            </p>
          </details>
          <details className="group rounded-lg border border-border p-4">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              Can I cancel my subscription anytime?
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Yes. You can cancel anytime from your account portal. Your premium features will remain active until the end of your current billing period.
            </p>
          </details>
          <details className="group rounded-lg border border-border p-4">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              Do QR codes expire?
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              No. All QR codes generated with {SITE_NAME} encode data directly into the image. They work forever and do not depend on our servers.
            </p>
          </details>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Can I use the free tier commercially?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. QR codes generated with the free tier can be used for any purpose, including commercial use. The only limitation is the \"Made with QuickQR\" watermark on downloaded images.",
                },
              },
              {
                "@type": "Question",
                name: "What payment methods do you accept?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We accept international credit/debit cards via Stripe, and UPI payments via Razorpay for users in India.",
                },
              },
              {
                "@type": "Question",
                name: "Can I cancel my subscription anytime?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. You can cancel anytime from your account portal. Your premium features will remain active until the end of your current billing period.",
                },
              },
              {
                "@type": "Question",
                name: "Do QR codes expire?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. All QR codes generated with QuickQR encode data directly into the image. They work forever and do not depend on our servers.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
