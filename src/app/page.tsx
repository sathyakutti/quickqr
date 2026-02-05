import { QrCode, Zap, Shield, CreditCard, Globe, Smartphone, Download } from "lucide-react";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, FREE_DAILY_DOWNLOAD_LIMIT } from "@/lib/constants";
import { QR_CATEGORIES } from "@/lib/qr/categories";
import { QRGenerator } from "@/components/qr/qr-generator";
import Link from "next/link";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Generation",
    description: "QR codes generate in real-time as you type. No waiting, no page reloads.",
  },
  {
    icon: Shield,
    title: "No Signup Required",
    description: `Generate and download up to ${FREE_DAILY_DOWNLOAD_LIMIT} QR codes per day without creating an account.`,
  },
  {
    icon: CreditCard,
    title: "Payment QR Codes",
    description: "Support for UPI, SEPA, Pix, Bitcoin, Ethereum, and PayPal payment formats.",
  },
  {
    icon: Globe,
    title: "International Formats",
    description: "vCard, MeCard, iCal events, geo locations, and WiFi sharing — all standards-compliant.",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description: "Generated QR codes are scannable by any modern smartphone camera or QR reader app.",
  },
  {
    icon: Download,
    title: "High Quality Downloads",
    description: "Download as PNG for free. Premium users get SVG, PDF, and sizes up to 2000px.",
  },
] as const;

export default function HomePage() {
  const totalTypes = QR_CATEGORIES.reduce(
    (sum, cat) => sum + cat.types.length,
    0
  );

  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground">
              <QrCode className="size-4" aria-hidden="true" />
              <span>{totalTypes} QR code types across {QR_CATEGORIES.length} categories</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Free QR Code Generator
            </h1>
            <p className="mt-2 text-base text-muted-foreground sm:text-lg">
              {SITE_DESCRIPTION}
            </p>
          </div>
        </div>
      </section>

      {/* QR Generator Section */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" aria-label="QR code generator">
        <QRGenerator />
      </section>

      {/* Features Section */}
      <section
        className="border-t border-border bg-muted/30"
        aria-labelledby="features-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <h2
            id="features-heading"
            className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Why {SITE_NAME}?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-lg border border-border bg-card p-6"
                >
                  <Icon className="mb-3 size-6 text-muted-foreground" aria-hidden="true" />
                  <h3 className="mb-1 text-base font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Need more from your QR codes?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Upgrade to premium for custom colors, logo embedding, high-resolution downloads, and no watermark.
            </p>
            <Link
              href="/pricing"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            image: `${SITE_URL}/logo.jpeg`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "URL QR codes",
              "WiFi QR codes",
              "vCard QR codes",
              "UPI payment QR codes",
              "SEPA/EPC QR codes",
              "Pix payment QR codes",
              "Bitcoin QR codes",
              "Ethereum QR codes",
              "Calendar event QR codes",
              "Geo location QR codes",
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/logo.jpeg`,
            sameAs: [],
          }),
        }}
      />
    </>
  );
}
