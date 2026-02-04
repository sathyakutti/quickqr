import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free Pix QR Code Generator";
const PAGE_DESCRIPTION =
  "Generate a free Pix QR code for instant payments in Brazil. Enter your Pix key, merchant name, and amount to create a scannable payment code.";

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

export default function PixQRPage() {
  const faqs = [
    {
      question: "What is a Pix QR code?",
      answer:
        "A Pix QR code encodes Brazilian instant payment details — your Pix key, merchant name, city, and optional amount — into a scannable image. Any Brazilian banking app that supports Pix can read it and initiate an instant transfer 24/7.",
    },
    {
      question: "What types of Pix keys are supported?",
      answer:
        "You can use any valid Pix key: CPF/CNPJ number, email address, phone number, or a random EVP (Endereço Virtual de Pagamento) key. Enter whichever key is registered with your bank.",
    },
    {
      question: "Is there a transaction limit?",
      answer:
        "Transaction limits are set by your bank, not by the QR code itself. The code can encode any amount, but the payer's bank may enforce daily or per-transaction limits based on their account settings.",
    },
    {
      question: "Can I create a Pix code without a fixed amount?",
      answer:
        "Yes. Leave the amount field empty to generate an open-value QR code. The payer can enter any amount when they scan it, which is useful for donations and tips.",
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
              Accept instant Pix payments in Brazil with a scannable QR code.
              Enter your Pix key and start collecting money in seconds.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="payment" defaultType="pix" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create a Pix QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Pix is Brazil's instant payment system launched by the Central Bank in
            November 2020. It allows real-time money transfers 24 hours a day, 7
            days a week, including weekends and holidays. A Pix QR code generator
            lets you create payment codes that any Brazilian banking app can read,
            making it effortless for customers to pay you.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Enter your Pix key (CPF, CNPJ, email, phone, or EVP key).</li>
            <li>Fill in your merchant/recipient name and city.</li>
            <li>Optionally set a fixed amount and a short description.</li>
            <li>Download and print the code for your store counter, invoice, or website.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Retail stores</strong> — display at the checkout as an alternative to card terminals.</li>
            <li><strong className="text-foreground">Online stores</strong> — show on the checkout page for instant bank-to-bank payment.</li>
            <li><strong className="text-foreground">Street vendors</strong> — accept cashless payments without any hardware.</li>
            <li><strong className="text-foreground">Donations and tips</strong> — use open-value codes for flexible amounts.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">About the Pix QR Format</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Pix QR codes follow the EMV QRCode specification adapted by the Central
            Bank of Brazil (BCB). The static QR code format (BR Code) encodes the
            merchant account info, country code, currency, and optional amount in a
            TLV (Tag-Length-Value) structure. This standardized format ensures
            interoperability across all participating banks and fintech apps.
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
            <Link href="/upi" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">UPI QR Code</Link>
            <Link href="/epc" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">SEPA/EPC QR Code</Link>
            <Link href="/paypal" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">PayPal QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Payment", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "Pix QR Code Generator", item: "https://quickqr.app/pix" }] }) }} />
    </>
  );
}
