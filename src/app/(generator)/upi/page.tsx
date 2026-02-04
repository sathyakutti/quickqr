import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free UPI QR Code Generator";
const PAGE_DESCRIPTION =
  "Generate a free UPI QR code for accepting payments in India. Enter your UPI VPA, payee name, and optional amount to create a scannable payment code instantly.";

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

export default function UPIQRPage() {
  const faqs = [
    {
      question: "What is a UPI QR code?",
      answer:
        "A UPI QR code encodes your Unified Payments Interface (UPI) details — your VPA (Virtual Payment Address), payee name, and an optional amount — into a scannable image. Anyone with a UPI-enabled app like Google Pay, PhonePe, or Paytm can scan it to pay you instantly.",
    },
    {
      question: "What is a VPA?",
      answer:
        "A VPA (Virtual Payment Address) is your UPI ID, formatted as username@bankname (e.g., john@okicici or shop@upi). It is like an email address for receiving payments and is linked to your bank account.",
    },
    {
      question: "Can I set a fixed amount?",
      answer:
        "Yes. You can pre-fill the payment amount in the QR code. The payer will see the amount when they scan it and can proceed without manually entering a figure. Leaving the amount blank lets the payer enter any amount they choose.",
    },
    {
      question: "Does this work with all UPI apps?",
      answer:
        "Yes. The generated code follows the official UPI deep-link specification, so it is compatible with Google Pay, PhonePe, Paytm, BHIM, Amazon Pay, and all other NPCI-certified UPI applications.",
    },
    {
      question: "Is this secure?",
      answer:
        "The QR code only contains your VPA and display name — it cannot access your bank account or initiate transactions on its own. The payer must authenticate the transaction in their UPI app using their PIN.",
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
              Accept payments instantly with a UPI QR code. Enter your VPA and
              let customers pay you directly from any UPI app.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="payment" defaultType="upi" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create a UPI QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            UPI (Unified Payments Interface) has become India's most popular digital
            payment method, processing billions of transactions every month. A UPI QR
            code generator lets merchants, freelancers, and individuals create scannable
            payment codes without needing a point-of-sale terminal or any special
            hardware. Just print the code and start accepting payments.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Enter your UPI VPA (e.g., yourname@upi) in the VPA field.</li>
            <li>Add your display name so payers can verify the recipient before sending money.</li>
            <li>Optionally set a fixed payment amount and a transaction note.</li>
            <li>Download the QR code and display it at your counter, website, or invoice.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Retail shops</strong> — print and laminate the QR code at the checkout counter.</li>
            <li><strong className="text-foreground">Street vendors</strong> — accept cashless payments without a card machine.</li>
            <li><strong className="text-foreground">Freelancers</strong> — add the code to invoices for instant payment collection.</li>
            <li><strong className="text-foreground">Donations</strong> — display on websites or posters to collect contributions.</li>
            <li><strong className="text-foreground">Event tickets</strong> — embed in booking confirmations for on-the-spot payment.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">About the UPI Deep-Link Format</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The QR code encodes a{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">upi://pay</code>{" "}
            deep link with query parameters for the VPA, payee name, amount, and
            transaction note. This format is defined by NPCI (National Payments
            Corporation of India) and is the same standard used by all major UPI
            apps. The code does not store any sensitive banking information.
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
            <Link href="/epc" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">SEPA/EPC QR Code</Link>
            <Link href="/pix" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Pix QR Code</Link>
            <Link href="/paypal" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">PayPal QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Payment", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "UPI QR Code Generator", item: "https://quickqr.app/upi" }] }) }} />
    </>
  );
}
