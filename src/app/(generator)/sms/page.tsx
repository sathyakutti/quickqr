import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free SMS QR Code Generator";
const PAGE_DESCRIPTION =
  "Create a free SMS QR code that opens a pre-filled text message when scanned. Perfect for opt-in campaigns, customer support, and quick feedback collection.";

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

export default function SMSQRPage() {
  const faqs = [
    {
      question: "What is an SMS QR code?",
      answer:
        "An SMS QR code opens the messaging app with a pre-filled phone number and optional message text. The user just needs to tap send. It uses the standard sms: or smsto: URI scheme supported by all smartphones.",
    },
    {
      question: "Can I pre-write the message?",
      answer:
        "Yes. You can set both the recipient phone number and a default message body. This is useful for keyword-based opt-in campaigns where the user needs to text a specific word to a short code.",
    },
    {
      question: "Does this work internationally?",
      answer:
        "It works anywhere as long as you include the international country code in the phone number. The recipient's messaging app will handle carrier routing automatically.",
    },
    {
      question: "Is the message sent automatically?",
      answer:
        "No. Scanning the QR code only opens the messaging app with pre-filled content. The user must manually tap the send button, ensuring they remain in full control.",
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
              Generate a QR code that opens a pre-composed text message. Great
              for SMS marketing, opt-in keywords, and instant customer feedback.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="basic" defaultType="sms" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create an SMS QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            An SMS QR code simplifies text-based interactions by pre-filling the
            recipient number and message body. Instead of asking customers to manually
            type a short code and keyword, you can hand them a scannable image that
            does all the work. This reduces errors and increases opt-in rates for
            marketing campaigns, appointment confirmations, and feedback requests.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Enter the recipient phone number with the country code.</li>
            <li>Optionally type a default message (e.g., &quot;JOIN&quot; for an opt-in campaign).</li>
            <li>The QR code preview updates instantly.</li>
            <li>Download and place the code on posters, packaging, or digital screens.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Opt-in campaigns</strong> — let customers subscribe to alerts by texting a keyword.</li>
            <li><strong className="text-foreground">Customer support</strong> — pre-fill a support number and category for faster routing.</li>
            <li><strong className="text-foreground">Appointment reminders</strong> — let patients confirm by texting &quot;YES&quot; to the clinic number.</li>
            <li><strong className="text-foreground">Event check-in</strong> — attendees text a code to register their arrival.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">About the SMS QR Format</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            SMS QR codes follow the <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">sms:</code> or{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">smsto:</code> URI scheme
            defined in RFC 5724. The phone number and message body are encoded as parameters.
            Both Android and iOS handle this scheme natively, opening the default messaging
            app with all fields ready to send.
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
            <Link href="/email" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Email QR Code</Link>
            <Link href="/text" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Text QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Basic", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "SMS QR Code Generator", item: "https://quickqr.app/sms" }] }) }} />
    </>
  );
}
