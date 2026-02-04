import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free Google Maps QR Code Generator";
const PAGE_DESCRIPTION =
  "Create a free Google Maps QR code that opens a specific location in Google Maps. Enter coordinates to generate a scannable code for navigation and directions.";

export function generateMetadata(): Metadata {
  return {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    openGraph: {
      title: `${PAGE_TITLE} | ${SITE_NAME}`,
      description: PAGE_DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: `${PAGE_TITLE} | ${SITE_NAME}`,
      description: PAGE_DESCRIPTION,
    },
  };
}

export default function GoogleMapsQRPage() {
  const faqs = [
    {
      question: "What is a Google Maps QR code?",
      answer:
        "A Google Maps QR code encodes a Google Maps URL with specific coordinates. When scanned, it opens Google Maps directly (either the app or website) and shows the pinned location with options for directions, Street View, and nearby places.",
    },
    {
      question: "How is this different from a geo: location QR code?",
      answer:
        "A geo: QR code uses the universal geo: URI scheme and opens the device's default map app. A Google Maps QR code uses a google.com/maps URL, which specifically targets Google Maps. If you want to ensure users see the location in Google Maps with all its features, use this option.",
    },
    {
      question: "Does this work if Google Maps is not installed?",
      answer:
        "Yes. If the Google Maps app is not installed, the link opens in the device's web browser at maps.google.com. The web version provides full map functionality including directions and Street View.",
    },
    {
      question: "Can I use a place name instead of coordinates?",
      answer:
        "This generator uses latitude and longitude for precision. If you need to link to a named place, you can use the URL QR code generator with a full Google Maps share link.",
    },
  ];

  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {PAGE_TITLE}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Generate a QR code that opens a pinned location directly in Google
              Maps. Perfect for business locations, event venues, and directions.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="location" defaultType="google-maps" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create a Google Maps QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            A Google Maps QR code is the easiest way to guide people to a specific
            location. Unlike a plain address, a QR code eliminates misinterpretation
            and gets the user straight to a map with a pin, satellite view, directions,
            and estimated travel times. This is especially valuable for locations that
            are hard to find by address alone, such as a specific building entrance,
            a parking lot, or a rural meeting point.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Enter the latitude of the location (e.g., 48.8566 for Paris).</li>
            <li>Enter the longitude (e.g., 2.3522 for Paris).</li>
            <li>The QR code generates instantly, encoding a Google Maps URL.</li>
            <li>Download and add the code to your website, business card, or printed directions.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Business storefronts</strong> — help customers navigate to your exact location.</li>
            <li><strong className="text-foreground">Wedding venues</strong> — include on invitations so guests can get driving directions.</li>
            <li><strong className="text-foreground">Delivery instructions</strong> — pin the exact drop-off point for couriers.</li>
            <li><strong className="text-foreground">Tourism guides</strong> — link tourists to points of interest on a walking tour.</li>
            <li><strong className="text-foreground">Construction sites</strong> — share the site location with contractors and suppliers.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">How It Works</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The QR code encodes a URL in the format{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">
              https://www.google.com/maps?q=latitude,longitude
            </code>. When scanned, the device opens Google Maps (app or browser) and
            places a pin at the coordinates. The user can then tap for turn-by-turn
            directions, view the location in satellite mode, or explore the surrounding
            area. This approach leverages Google Maps' rich feature set including real-time
            traffic data and Street View.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-lg border border-border bg-card">
                <summary className="cursor-pointer select-none px-6 py-4 text-base font-medium text-foreground transition-colors hover:text-foreground/80">{faq.question}</summary>
                <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-foreground">Related QR Code Generators</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/geo" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Location QR Code</Link>
            <Link href="/event" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Event QR Code</Link>
            <Link href="/url" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">URL QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Location", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "Google Maps QR Code Generator", item: "https://quickqr.app/google-maps" }] }) }} />
    </>
  );
}
