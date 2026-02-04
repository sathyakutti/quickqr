import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free MeCard QR Code Generator";
const PAGE_DESCRIPTION =
  "Generate a free MeCard QR code to share contact information in a compact format. Encode your name, phone, email, and address into a lightweight scannable code.";

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

export default function MeCardQRPage() {
  const faqs = [
    {
      question: "What is MeCard format?",
      answer:
        "MeCard is a compact contact-sharing format originally developed by NTT DoCoMo in Japan. It encodes contact details like name, phone, email, URL, and address in a shorter string than vCard, resulting in a simpler and more scannable QR code pattern.",
    },
    {
      question: "Should I use MeCard or vCard?",
      answer:
        "If you need to share many fields (company, job title, full address), use vCard. If you only need basic contact info (name, phone, email) and want the smallest possible QR code, MeCard is a great choice. Both formats are widely supported.",
    },
    {
      question: "Does MeCard work on iPhones?",
      answer:
        "Yes. Both iOS and Android recognize MeCard-formatted QR codes. When scanned, the contacts app opens with the encoded fields ready to save.",
    },
    {
      question: "Can I add a note to the MeCard?",
      answer:
        "Yes. The MeCard format supports an optional NOTE field where you can add a short message or context, such as where you met the person or a brief description.",
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
              Share contact details with a lightweight MeCard QR code. Smaller
              and simpler than vCard, perfect for compact prints.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="contact" defaultType="mecard" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create a MeCard QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The MeCard format offers a compact alternative to vCard for sharing
            contact information via QR codes. Because MeCard uses less data than
            vCard, the resulting QR code has fewer modules (black/white squares),
            making it easier to scan at small sizes. This makes MeCard ideal for
            small business cards, stickers, and name badges where print space is limited.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Enter your name in the required name field.</li>
            <li>Add your phone number, email address, website URL, and address as needed.</li>
            <li>The QR code updates in real time as you type.</li>
            <li>Download the QR code and use it on business cards, stickers, or printed materials.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Mini business cards</strong> — the smaller QR pattern fits well on compact card designs.</li>
            <li><strong className="text-foreground">Conference lanyards</strong> — print a tiny code that attendees can scan to save your info.</li>
            <li><strong className="text-foreground">Stickers and labels</strong> — add contact information to product packaging or equipment tags.</li>
            <li><strong className="text-foreground">Résumés</strong> — include a MeCard code so recruiters can save your details quickly.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">About the MeCard Format</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            MeCard uses a simple key-value syntax beginning with{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">MECARD:</code> and
            ending with <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">;;</code>.
            Fields like <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">N:</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">TEL:</code>, and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">EMAIL:</code> are
            separated by semicolons. The compact encoding makes MeCard approximately
            30-50% shorter than an equivalent vCard, which translates to a less dense
            QR code pattern.
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
            <Link href="/vcard" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">vCard QR Code</Link>
            <Link href="/phone" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Phone QR Code</Link>
            <Link href="/email" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Email QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Contact", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "MeCard QR Code Generator", item: "https://quickqr.app/mecard" }] }) }} />
    </>
  );
}
