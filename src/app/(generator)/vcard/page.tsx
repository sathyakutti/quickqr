import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free vCard QR Code Generator";
const PAGE_DESCRIPTION =
  "Generate a free vCard QR code to share your contact details instantly. Encode your name, phone, email, company, and address into a scannable QR code.";

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

export default function VCardQRPage() {
  const faqs = [
    {
      question: "What is a vCard QR code?",
      answer:
        "A vCard QR code encodes contact information in the vCard 3.0 standard. When scanned, the phone offers to save the contact with all fields pre-filled — name, phone number, email, company, job title, website, and mailing address.",
    },
    {
      question: "What is the difference between vCard and MeCard?",
      answer:
        "vCard (VCF) is the international standard supported by all platforms. It supports more fields including job title, company, website, and full address. MeCard is a simpler, more compact format originally developed by NTT DoCoMo in Japan. For maximum compatibility and detail, vCard is the recommended choice.",
    },
    {
      question: "Can I include a photo in the vCard QR code?",
      answer:
        "Photos are not included in the QR code because they significantly increase data size, making the QR pattern too complex to scan reliably. The contact fields (name, phone, email, etc.) are encoded in plain text, which keeps the code compact.",
    },
    {
      question: "Does this work with all phones?",
      answer:
        "Yes. Both iOS and Android recognize vCard data natively. When a user scans the code, their contacts app opens automatically with the option to save the new contact.",
    },
    {
      question: "Which fields are required?",
      answer:
        "Only the first name and last name are required. All other fields (phone, email, company, title, website, address) are optional and will be included in the QR code only if you fill them in.",
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
              Share your full contact card with a single scan. Generate a vCard
              QR code with your name, phone, email, and more.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="contact" defaultType="vcard" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create a vCard QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            A vCard QR code generator converts your contact details into a compact,
            scannable image. This is the modern alternative to exchanging paper
            business cards. The vCard format is an open standard (RFC 6350) supported
            by every major contacts application, including Apple Contacts, Google
            Contacts, and Microsoft Outlook.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Enter your first name, last name, and any additional contact details you want to share.</li>
            <li>The QR code preview updates in real time as you complete each field.</li>
            <li>Scan the code with your own phone to verify all contact information is correct.</li>
            <li>Download the QR code and add it to your business card, email signature, or name badge.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Business cards</strong> — print a QR code on the back so contacts can save your info with one scan.</li>
            <li><strong className="text-foreground">Conference name badges</strong> — let attendees exchange contact information without juggling physical cards.</li>
            <li><strong className="text-foreground">Email signatures</strong> — embed a small QR code image so recipients can save your details instantly.</li>
            <li><strong className="text-foreground">Real estate signs</strong> — let prospective buyers save the agent's contact information on the spot.</li>
            <li><strong className="text-foreground">Trade show booths</strong> — display a large QR code so visitors can grab your details as they walk by.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">About the vCard Format</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The vCard (Virtual Contact File) format uses a structured text format beginning
            with <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">BEGIN:VCARD</code> and
            ending with <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">END:VCARD</code>.
            Each field is represented as a property-value pair, such as{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">TEL:+1234567890</code>.
            This generator uses vCard version 3.0, which provides the best balance of
            feature support and cross-platform compatibility.
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
            <Link href="/mecard" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">MeCard QR Code</Link>
            <Link href="/email" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Email QR Code</Link>
            <Link href="/phone" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Phone QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Contact", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "vCard QR Code Generator", item: "https://quickqr.app/vcard" }] }) }} />
    </>
  );
}
