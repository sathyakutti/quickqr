import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free App Store QR Code Generator";
const PAGE_DESCRIPTION =
  "Generate a free app store QR code that links directly to your app listing. Create scannable codes for the Apple App Store, Google Play Store, or any app marketplace.";

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

export default function AppStoreQRPage() {
  const faqs = [
    {
      question: "What is an app store QR code?",
      answer:
        "An app store QR code encodes the direct URL to your app's listing on any app marketplace — Apple App Store, Google Play Store, Microsoft Store, Amazon Appstore, or others. Scanning the code takes the user directly to your app's download page.",
    },
    {
      question: "Which app stores are supported?",
      answer:
        "Any app store with a public URL works. Simply paste the full link to your app listing. Common stores include Apple App Store (apps.apple.com), Google Play Store (play.google.com), F-Droid, Samsung Galaxy Store, and Huawei AppGallery.",
    },
    {
      question: "Will the QR code open the store app or browser?",
      answer:
        "On most devices, the link will deep-link directly into the native store app if it is installed. If not, the link opens in the browser where the user can still view and download the app.",
    },
    {
      question: "Can I link to both iOS and Android with one QR code?",
      answer:
        "A single QR code can only encode one URL. To support multiple platforms, consider using a smart link service that detects the user's device and redirects to the appropriate store, then encode that smart link as the QR code.",
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
              Create a QR code that links directly to your app on any store.
              Drive downloads from print ads, packaging, and promotional materials.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="app" defaultType="app-store" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create an App Store QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            An app store QR code is one of the most effective tools for driving
            mobile app downloads from offline channels. By placing a scannable
            code on posters, product packaging, business cards, or advertisements,
            you eliminate the friction of asking users to search for your app
            manually. One scan takes them straight to the download page.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Find your app on the App Store or Google Play and copy the listing URL.</li>
            <li>Paste the full URL into the input field above.</li>
            <li>The QR code generates instantly in the preview panel.</li>
            <li>Download and use the code in your marketing materials, ads, or product packaging.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Product packaging</strong> — include a QR code for the companion app.</li>
            <li><strong className="text-foreground">Print advertisements</strong> — magazine and newspaper ads linking to the download page.</li>
            <li><strong className="text-foreground">Conference booths</strong> — let visitors download your app on the spot.</li>
            <li><strong className="text-foreground">Business cards</strong> — app developers can link to their latest app.</li>
            <li><strong className="text-foreground">In-store signage</strong> — retail stores promoting their mobile shopping app.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">How It Works</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The QR code encodes the direct URL to your app listing. Apple App Store
            links follow the format{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">
              https://apps.apple.com/app/id123456789
            </code>{" "}
            and Google Play links use{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">
              https://play.google.com/store/apps/details?id=com.example.app
            </code>. When scanned on a mobile device, the operating system recognizes
            the store URL and opens the native store app directly for a seamless
            download experience.
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
            <Link href="/url" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">URL QR Code</Link>
            <Link href="/social" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Social Media QR Code</Link>
            <Link href="/text" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Text QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "App", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "App Store QR Code Generator", item: "https://quickqr.app/app-store" }] }) }} />
    </>
  );
}
