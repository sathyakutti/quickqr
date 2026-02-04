import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free Email QR Code Generator";
const PAGE_DESCRIPTION =
  "Generate a free email QR code that pre-fills the recipient, subject, and body. Make it easy for customers and contacts to reach you by email with a single scan.";

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

export default function EmailQRPage() {
  const faqs = [
    {
      question: "What is an email QR code?",
      answer:
        "An email QR code uses the mailto: URI scheme to encode a recipient email address along with an optional subject line and body text. Scanning it opens the user's default email app with all fields pre-filled.",
    },
    {
      question: "Can I pre-fill the subject and body?",
      answer:
        "Yes. The generator lets you set a default recipient, subject, and message body. All three fields are encoded into the QR code so the person scanning it only needs to tap send.",
    },
    {
      question: "Does the QR code work with Gmail, Outlook, and Apple Mail?",
      answer:
        "It works with any email client that is set as the default on the scanning device. This includes Gmail, Outlook, Apple Mail, Yahoo Mail, and others.",
    },
    {
      question: "Is there a limit on the message length?",
      answer:
        "While the QR standard supports thousands of characters, keeping the total mailto content under 300 characters produces the most reliable scans. For longer messages, consider linking to a contact form via a URL QR code instead.",
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
              Create a QR code that opens a pre-filled email when scanned.
              Perfect for customer support, feedback forms, and business cards.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="basic" defaultType="email" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create an Email QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            An email QR code is a simple way to remove friction from customer
            communication. Instead of asking people to type your email address
            correctly, you give them a code that opens their mail app with everything
            pre-filled. This is especially useful on printed materials where
            typos are common.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Enter the recipient email address in the To field.</li>
            <li>Optionally add a default subject line and message body.</li>
            <li>The QR code preview updates in real time as you fill in the fields.</li>
            <li>Download the generated code and add it to your print materials or signage.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Business cards</strong> — let contacts email you with one scan.</li>
            <li><strong className="text-foreground">Customer support</strong> — place on product packaging so users can report issues easily.</li>
            <li><strong className="text-foreground">Event feedback</strong> — collect post-event comments by pre-filling a subject like &quot;Event Feedback&quot;.</li>
            <li><strong className="text-foreground">Newsletters</strong> — let people subscribe by sending a pre-composed email to your list address.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">About the mailto: Format</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The email QR code uses the standard{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">mailto:</code>{" "}
            URI scheme defined in RFC 6068. The format encodes the recipient,
            subject, and body as URL-encoded parameters. Every major email client
            and mobile operating system recognizes this scheme, making it one of
            the most reliable QR code formats available.
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
            <Link href="/phone" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Phone QR Code</Link>
            <Link href="/sms" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">SMS QR Code</Link>
            <Link href="/vcard" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">vCard QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Basic", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "Email QR Code Generator", item: "https://quickqr.app/email" }] }) }} />
    </>
  );
}
