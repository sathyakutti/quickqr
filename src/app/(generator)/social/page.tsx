import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free Social Media QR Code Generator";
const PAGE_DESCRIPTION =
  "Create a free social media QR code to share your profile link. Generate scannable codes for Instagram, Twitter, LinkedIn, TikTok, YouTube, and any social platform.";

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

export default function SocialQRPage() {
  const faqs = [
    {
      question: "What is a social media QR code?",
      answer:
        "A social media QR code encodes the URL of your social media profile into a scannable image. When someone scans it, they are taken directly to your profile page on Instagram, Twitter/X, LinkedIn, TikTok, YouTube, or any other platform.",
    },
    {
      question: "Which social platforms are supported?",
      answer:
        "Any platform with a profile URL works. This includes Instagram, Facebook, Twitter/X, LinkedIn, TikTok, YouTube, Snapchat, Pinterest, Reddit, Threads, Mastodon, and more. Simply paste your full profile URL.",
    },
    {
      question: "Does the QR code open the native app or browser?",
      answer:
        "It depends on the scanner's device. Most smartphones will open the corresponding native app if it is installed (e.g., the Instagram app for an Instagram link). If the app is not installed, the link opens in the default browser.",
    },
    {
      question: "Can I create QR codes for multiple platforms?",
      answer:
        "Each QR code links to one URL, so you would need to create a separate code for each platform. Alternatively, use a link-in-bio service URL that aggregates all your social profiles into one page.",
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
              Turn your social media profile URL into a scannable QR code. Grow
              your following from print materials, events, and in-store displays.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="social" defaultType="social" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create a Social Media QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            A social media QR code bridges the gap between your physical presence
            and your online profile. Whether you are a content creator handing out
            flyers at an event, a restaurant displaying its Instagram handle, or a
            business driving followers from product packaging, a QR code makes it
            effortless for people to find and follow you.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Copy your social media profile URL (e.g., https://instagram.com/yourhandle).</li>
            <li>Paste the URL into the input field above.</li>
            <li>The QR code generates instantly in the preview panel.</li>
            <li>Download the code and add it to your business card, flyer, or storefront display.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Influencer marketing</strong> — print QR codes on merchandise to grow your following.</li>
            <li><strong className="text-foreground">Restaurant table cards</strong> — let diners follow your page and share their experience.</li>
            <li><strong className="text-foreground">Event booths</strong> — display a large QR code so attendees can connect with you online.</li>
            <li><strong className="text-foreground">Product packaging</strong> — link customers to your brand's social accounts for updates and promotions.</li>
            <li><strong className="text-foreground">Job applications</strong> — share your LinkedIn profile on your printed résumé.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">How It Works</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The QR code simply encodes the URL of your social media profile. When
            scanned, the device opens the link. If the corresponding app (Instagram,
            TikTok, etc.) is installed, most phones will deep-link directly into the
            app for a seamless experience. The code is static and never expires, so
            it will keep working as long as your profile URL remains active.
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
            <Link href="/vcard" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">vCard QR Code</Link>
            <Link href="/app-store" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">App Store QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Social", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "Social Media QR Code Generator", item: "https://quickqr.app/social" }] }) }} />
    </>
  );
}
