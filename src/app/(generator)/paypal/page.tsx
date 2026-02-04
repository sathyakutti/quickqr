import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free PayPal QR Code Generator";
const PAGE_DESCRIPTION =
  "Create a free PayPal QR code to receive payments via PayPal.me. Enter your username and optional amount to generate a scannable payment link.";

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

export default function PayPalQRPage() {
  const faqs = [
    {
      question: "What is a PayPal QR code?",
      answer:
        "A PayPal QR code encodes your PayPal.me link into a scannable image. When someone scans it, they are directed to your PayPal.me page where they can send you a payment using their PayPal account, credit card, or debit card.",
    },
    {
      question: "Do I need a PayPal Business account?",
      answer:
        "No. Both personal and business PayPal accounts can create a PayPal.me link. However, business accounts get additional features like invoicing and reporting.",
    },
    {
      question: "Can I set a specific payment amount?",
      answer:
        "Yes. You can pre-fill an amount and currency in the PayPal.me link. When the payer opens the link, the amount appears automatically. They can still change it before sending.",
    },
    {
      question: "Does the payer need a PayPal account?",
      answer:
        "In most countries, PayPal.me allows payments from non-PayPal users via credit or debit card. However, having a PayPal account makes the process faster.",
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
              Generate a QR code linked to your PayPal.me page. Accept payments
              from anyone by sharing a simple scannable code.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="payment" defaultType="paypal" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create a PayPal QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            PayPal.me is a personal payment link that lets anyone send you money
            through PayPal. By encoding this link into a QR code, you make it
            effortless for customers, clients, or friends to pay you. This is
            especially useful for freelancers, small businesses, and anyone who
            accepts payments at events, markets, or in person.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Enter your PayPal.me username (the part after paypal.me/).</li>
            <li>Optionally set a default payment amount and currency.</li>
            <li>The QR code generates instantly in the preview panel.</li>
            <li>Download and add the code to invoices, your website, or printed signage.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Freelancers</strong> — include on invoices for quick and easy payment.</li>
            <li><strong className="text-foreground">Market vendors</strong> — display at your booth for cashless transactions.</li>
            <li><strong className="text-foreground">Charities</strong> — print on donation flyers and posters.</li>
            <li><strong className="text-foreground">Online creators</strong> — share on social media for tips and contributions.</li>
            <li><strong className="text-foreground">Event organizers</strong> — collect ticket payments or membership fees.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">How It Works</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The QR code encodes a{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">https://paypal.me/username/amount</code>{" "}
            URL. When scanned, the device opens this link in a browser, which
            redirects to PayPal's payment page. The payer can then complete the
            transaction using their PayPal balance, linked bank account, or card.
            The process is secure and handled entirely by PayPal's infrastructure.
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
            <Link href="/bitcoin" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Bitcoin QR Code</Link>
            <Link href="/ethereum" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Ethereum QR Code</Link>
            <Link href="/upi" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">UPI QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Payment", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "PayPal QR Code Generator", item: "https://quickqr.app/paypal" }] }) }} />
    </>
  );
}
