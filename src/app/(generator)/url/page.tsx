import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free URL QR Code Generator";
const PAGE_DESCRIPTION =
  "Generate a free URL QR code instantly. Paste any website link and create a scannable QR code — perfect for sharing URLs on print materials, business cards, and more.";

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

export default function URLQRPage() {
  const faqs = [
    {
      question: "What is a URL QR code?",
      answer:
        "A URL QR code encodes a website address into a scannable image. When someone scans it with their phone camera or a QR reader app, they are taken directly to the encoded web page without having to type the URL manually.",
    },
    {
      question: "Can I use a URL QR code for any website?",
      answer:
        "Yes. You can encode any valid web address, including HTTP and HTTPS links, landing pages, social media profiles, online stores, YouTube videos, Google Forms, and more. The URL must begin with http:// or https://.",
    },
    {
      question: "Is there a character limit for URL QR codes?",
      answer:
        "QR codes can store up to about 2,953 bytes of data. In practice, URLs under 500 characters work best because shorter data produces a simpler QR pattern that scans more reliably, especially at smaller print sizes.",
    },
    {
      question: "Do URL QR codes expire?",
      answer:
        "Static QR codes like the ones generated here never expire. The URL is embedded directly in the image, so the code will work as long as the destination website remains online.",
    },
    {
      question: "Are the QR codes free to use commercially?",
      answer:
        "Absolutely. QR codes generated with QuickQR are free for both personal and commercial use. There are no watermarks on free downloads and no attribution is required.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {PAGE_TITLE}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Paste any website link and instantly generate a scannable QR code.
              Download it for free and use it anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Generator */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="basic" defaultType="url" />
      </section>

      {/* SEO Content */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create a URL QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            A URL QR code generator lets you convert any web address into a compact,
            scannable image. This is one of the most popular uses for QR codes because
            it bridges the gap between physical and digital media. Whether you are
            printing flyers, designing business cards, or creating product packaging,
            a URL QR code gives people a fast way to reach your website.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">
            Steps to Generate Your QR Code
          </h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>
              Enter the full URL of the website you want to link to, including
              <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">https://</code>.
            </li>
            <li>
              Watch the QR code preview update in real time as you type.
            </li>
            <li>
              Optionally verify the QR code by scanning it with your phone camera.
            </li>
            <li>
              Click the download button to save your QR code as a PNG image.
            </li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">
            Common Use Cases
          </h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>
              <strong className="text-foreground">Business cards</strong> — link to your portfolio,
              company website, or LinkedIn profile.
            </li>
            <li>
              <strong className="text-foreground">Marketing materials</strong> — drive traffic from
              posters, brochures, and flyers to a landing page.
            </li>
            <li>
              <strong className="text-foreground">Product packaging</strong> — send customers to
              instruction manuals, warranty registration, or review pages.
            </li>
            <li>
              <strong className="text-foreground">Restaurant menus</strong> — link diners to your
              online ordering system or digital menu.
            </li>
            <li>
              <strong className="text-foreground">Event signage</strong> — point attendees to
              schedules, maps, or registration forms.
            </li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">
            How URL QR Codes Work
          </h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            When you enter a URL into the generator, the text is encoded using the QR
            code standard (ISO/IEC 18004). The resulting black-and-white pattern stores
            the URL as binary data with built-in error correction. Most smartphone
            cameras recognize URLs automatically and offer to open them in a browser.
            Because the data is embedded directly in the image, these static QR codes
            work offline and never expire.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-border bg-card"
              >
                <summary className="cursor-pointer select-none px-6 py-4 text-base font-medium text-foreground transition-colors hover:text-foreground/80">
                  {faq.question}
                </summary>
                <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-foreground">
            Related QR Code Generators
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/wifi"
              className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              WiFi QR Code
            </Link>
            <Link
              href="/text"
              className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Text QR Code
            </Link>
            <Link
              href="/social"
              className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Social Media QR Code
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* JSON-LD Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://quickqr.app",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Basic",
                item: "https://quickqr.app",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "URL QR Code Generator",
                item: "https://quickqr.app/url",
              },
            ],
          }),
        }}
      />
    </>
  );
}
