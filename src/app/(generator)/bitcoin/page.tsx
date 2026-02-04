import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free Bitcoin QR Code Generator";
const PAGE_DESCRIPTION =
  "Generate a free Bitcoin QR code for receiving BTC payments. Enter your Bitcoin address, optional amount, and label to create a BIP21-compliant payment request.";

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

export default function BitcoinQRPage() {
  const faqs = [
    {
      question: "What is a Bitcoin QR code?",
      answer:
        "A Bitcoin QR code encodes a BIP21 payment URI containing your Bitcoin address, an optional amount in BTC, and an optional label or message. Scanning it with a Bitcoin wallet app pre-fills all payment details so the sender can confirm and broadcast the transaction.",
    },
    {
      question: "Which address formats are supported?",
      answer:
        "The generator supports all standard Bitcoin address formats: Legacy (starting with 1), SegWit P2SH (starting with 3), and Native SegWit / Bech32 (starting with bc1). All three are valid BIP21 addresses.",
    },
    {
      question: "Is this compatible with all Bitcoin wallets?",
      answer:
        "Yes. The BIP21 URI scheme is the universal standard for Bitcoin payment requests and is supported by virtually every Bitcoin wallet including Electrum, BlueWallet, Muun, Ledger Live, and Trezor Suite.",
    },
    {
      question: "Can I request a specific BTC amount?",
      answer:
        "Yes. Enter the amount in BTC (up to 8 decimal places) and it will be encoded in the URI. The sender's wallet will display the requested amount. Leaving it blank allows the sender to choose any amount.",
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
              Create a Bitcoin payment QR code in seconds. Share your BTC address
              as a scannable code for easy cryptocurrency transactions.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="payment" defaultType="bitcoin" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create a Bitcoin QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            A Bitcoin QR code generator makes it easy to share your wallet address
            without the risk of copy-paste errors. Bitcoin addresses are long strings
            of letters and numbers that are nearly impossible to type manually. By
            encoding the address in a QR code using the BIP21 standard, you enable
            senders to pay you with a single scan from their wallet app.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Paste your Bitcoin wallet address into the address field.</li>
            <li>Optionally specify a BTC amount, label, and message.</li>
            <li>The QR code generates instantly in the preview panel.</li>
            <li>Download and share the code on your website, invoice, or printed materials.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Accepting payments</strong> — merchants display the code at checkout for BTC payments.</li>
            <li><strong className="text-foreground">Donations</strong> — content creators and open-source projects embed the code on their websites.</li>
            <li><strong className="text-foreground">Peer-to-peer transfers</strong> — share the code in person so friends can send BTC without typing addresses.</li>
            <li><strong className="text-foreground">Invoicing</strong> — attach a payment QR code to crypto invoices for easy settlement.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">About the BIP21 Format</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The QR code encodes a{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">bitcoin:</code>{" "}
            URI following BIP21 (Bitcoin Improvement Proposal 21). The URI includes the
            address as the path and optional query parameters for amount, label, and
            message. This is the standard recognized by all major Bitcoin wallets and
            ensures seamless interoperability across the ecosystem.
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
            <Link href="/ethereum" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Ethereum QR Code</Link>
            <Link href="/paypal" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">PayPal QR Code</Link>
            <Link href="/upi" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">UPI QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Payment", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "Bitcoin QR Code Generator", item: "https://quickqr.app/bitcoin" }] }) }} />
    </>
  );
}
