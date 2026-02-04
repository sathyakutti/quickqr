import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free Phone Number QR Code Generator";
const PAGE_DESCRIPTION =
  "Generate a free phone number QR code that dials a number when scanned. Add a click-to-call QR code to business cards, flyers, and signage.";

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

export default function PhoneQRPage() {
  const faqs = [
    {
      question: "What happens when someone scans a phone QR code?",
      answer:
        "The phone dialer opens with the encoded number pre-filled. The user simply taps the call button to connect. The call is not initiated automatically — the scanner always has to confirm.",
    },
    {
      question: "Should I include the country code?",
      answer:
        "Yes. Always include the international country code (e.g., +1 for US, +44 for UK, +91 for India) so the QR code works for anyone scanning it regardless of their location.",
    },
    {
      question: "Does this work on landlines and toll-free numbers?",
      answer:
        "It works with any dialable phone number, including landlines, mobile numbers, toll-free numbers, and even short codes. The tel: URI scheme is universally supported by all phone operating systems.",
    },
    {
      question: "Can I track how many people call via the QR code?",
      answer:
        "A static QR code does not provide analytics on its own. To track calls, consider using a dedicated tracking number or a dynamic QR code service that logs scan events.",
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
              Create a QR code that dials a phone number when scanned. Ideal for
              business cards, storefronts, and emergency contact information.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="basic" defaultType="phone" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create a Phone Number QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            A phone number QR code makes it effortless for anyone to call you. Instead
            of manually typing a number, the person scanning the code gets taken
            directly to their phone dialer. This is particularly valuable in contexts
            where speed matters, such as emergency contacts, roadside assistance
            numbers, or customer hotlines printed on products.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Enter the phone number with the international country code (e.g., +1 555 123 4567).</li>
            <li>The QR code preview appears instantly.</li>
            <li>Scan the code with your phone to verify it dials the correct number.</li>
            <li>Download and print the code wherever you need it.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Business cards</strong> — provide a quick-dial option alongside your printed number.</li>
            <li><strong className="text-foreground">Storefronts</strong> — display a QR code in the window so passersby can call after hours.</li>
            <li><strong className="text-foreground">Emergency signs</strong> — place in buildings, elevators, or public spaces for fast emergency dialing.</li>
            <li><strong className="text-foreground">Vehicle signage</strong> — let potential customers call your business from a van or truck wrap.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">About the tel: Format</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Phone QR codes use the <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">tel:</code> URI
            scheme defined in RFC 3966. The phone number is encoded in E.164 format with the
            international dialing prefix. When scanned, mobile operating systems detect the
            tel: scheme and open the native dialer. The user must tap the call button to
            initiate the call, so there is no risk of accidental dialing.
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
            <Link href="/sms" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">SMS QR Code</Link>
            <Link href="/email" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Email QR Code</Link>
            <Link href="/vcard" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">vCard QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Basic", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "Phone QR Code Generator", item: "https://quickqr.app/phone" }] }) }} />
    </>
  );
}
