import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free Location QR Code Generator";
const PAGE_DESCRIPTION =
  "Create a free location QR code using GPS coordinates. Generate a scannable code that opens a map pin on any smartphone using the standard geo: URI scheme.";

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

export default function GeoQRPage() {
  const faqs = [
    {
      question: "What is a location QR code?",
      answer:
        "A location QR code encodes GPS coordinates (latitude and longitude) using the geo: URI scheme defined in RFC 5870. When scanned, the device opens its default map application and drops a pin at the specified coordinates.",
    },
    {
      question: "Which map app will open?",
      answer:
        "The geo: URI opens the user's default map application. On Android, this is typically Google Maps. On iOS, it opens Apple Maps by default, though users who have changed their default may see a different app.",
    },
    {
      question: "How do I find the GPS coordinates for a location?",
      answer:
        "You can find coordinates by right-clicking a location in Google Maps and selecting the coordinates, or by searching for an address on Google Maps and copying the latitude/longitude from the URL. Many GPS apps also display your current coordinates.",
    },
    {
      question: "What is the difference between this and a Google Maps QR code?",
      answer:
        "A geo: QR code uses the universal standard URI scheme and opens the device's default map app. A Google Maps QR code encodes a specific Google Maps URL, which always opens in Google Maps. The geo: approach is more platform-neutral.",
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
              Encode GPS coordinates into a QR code that opens a map pin when
              scanned. Guide visitors to your exact location effortlessly.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="location" defaultType="geo" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create a Location QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            A location QR code converts GPS coordinates into a scannable image.
            This is an incredibly useful tool for guiding people to a specific
            place without requiring them to search for an address. Whether it is
            an office entrance, a trailhead, a parking spot, or an event venue,
            the QR code opens a map with a pin at the exact location.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Enter the latitude of your location (between -90 and 90).</li>
            <li>Enter the longitude of your location (between -180 and 180).</li>
            <li>The QR code preview updates in real time.</li>
            <li>Download and print the code on directions sheets, invitations, or signage.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Event invitations</strong> — include a QR code that takes guests directly to the venue on a map.</li>
            <li><strong className="text-foreground">Hiking trailheads</strong> — place at the start of a trail so hikers can save the coordinates.</li>
            <li><strong className="text-foreground">Real estate listings</strong> — let prospective buyers navigate to the property.</li>
            <li><strong className="text-foreground">Tourism signage</strong> — guide visitors to nearby attractions, parking, or transit stops.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">About the geo: URI Format</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Location QR codes use the{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">geo:</code>{" "}
            URI scheme defined in RFC 5870. The format is simply{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">geo:latitude,longitude</code>{" "}
            (e.g., <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">geo:40.7128,-74.0060</code>).
            This is a standards-based approach recognized by both Android and iOS,
            making it the most portable way to share a map location via QR code.
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
            <Link href="/google-maps" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Google Maps QR Code</Link>
            <Link href="/event" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Event QR Code</Link>
            <Link href="/url" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">URL QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Location", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "Location QR Code Generator", item: "https://quickqr.app/geo" }] }) }} />
    </>
  );
}
