import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free SEPA/EPC QR Code Generator";
const PAGE_DESCRIPTION =
  "Generate a free SEPA QR code for European bank transfers. Create an EPC QR code with IBAN, beneficiary name, and amount for instant credit transfer initiation.";

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

export default function EPCQRPage() {
  const faqs = [
    {
      question: "What is an EPC QR code?",
      answer:
        "An EPC (European Payments Council) QR code — also called a GiroCode or SEPA QR code — encodes the information needed to initiate a SEPA credit transfer. It includes the beneficiary name, IBAN, optional BIC, amount, and reference, allowing the payer's banking app to pre-fill all transfer fields.",
    },
    {
      question: "Which countries support EPC QR codes?",
      answer:
        "EPC QR codes are supported in all SEPA member countries across Europe, including Germany, France, the Netherlands, Belgium, Austria, Spain, Italy, and more. Most European banking apps recognize the EPC format natively.",
    },
    {
      question: "Is a BIC/SWIFT code required?",
      answer:
        "No. Since 2016, most SEPA transfers only require the IBAN. The BIC field is optional. However, including it can speed up processing for some banks.",
    },
    {
      question: "Can I set a specific amount?",
      answer:
        "Yes. You can pre-fill any amount between 0.01 and 999,999,999.99 EUR. The payer will see the amount when they scan the code in their banking app and can confirm the transfer with one tap.",
    },
    {
      question: "Is this the same as a GiroCode?",
      answer:
        "Yes. GiroCode is the German brand name for EPC QR codes. The underlying format (EPC069-12) is the same and is recognized by banking apps across all SEPA countries.",
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
              Create a SEPA payment QR code for European bank transfers. Payers
              scan the code with their banking app to initiate an instant transfer.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="payment" defaultType="epc" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create a SEPA/EPC QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The EPC QR code standard (EPC069-12) was developed by the European
            Payments Council to simplify SEPA credit transfers. Instead of
            manually entering an IBAN and beneficiary details, the payer simply
            scans the code with their mobile banking app and confirms the
            pre-filled transfer. This eliminates typos and dramatically reduces
            payment errors.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Enter the beneficiary name (the person or business receiving the payment).</li>
            <li>Enter the IBAN of the receiving bank account.</li>
            <li>Optionally add the BIC/SWIFT code, transfer amount, and a payment reference.</li>
            <li>Download the QR code and include it on invoices, donation pages, or checkout counters.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Invoices</strong> — print an EPC QR code on every invoice so clients can pay with a single scan.</li>
            <li><strong className="text-foreground">Donations</strong> — charities and churches use GiroCodes on flyers and collection envelopes.</li>
            <li><strong className="text-foreground">Rent collection</strong> — landlords include the code in monthly rent notices.</li>
            <li><strong className="text-foreground">Club membership fees</strong> — sports clubs and associations simplify annual fee collection.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">About the EPC Format</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The EPC QR code contains a structured, line-separated payload. Key fields
            include the service tag (BCD), character set, IBAN, beneficiary name,
            transfer amount in EUR, and an optional reference or free-text note. The
            code is always encoded using UTF-8 and follows the specification published
            by the European Payments Council. All SEPA-compliant banking apps in Europe
            can read and process this format.
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
            <Link href="/pix" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Pix QR Code</Link>
            <Link href="/bitcoin" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Bitcoin QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Payment", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "SEPA/EPC QR Code Generator", item: "https://quickqr.app/epc" }] }) }} />
    </>
  );
}
