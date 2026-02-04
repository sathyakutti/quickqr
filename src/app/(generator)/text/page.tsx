import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free Text QR Code Generator";
const PAGE_DESCRIPTION =
  "Convert any text to a QR code for free. Encode messages, notes, or any plain text into a scannable QR code that works on every smartphone.";

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

export default function TextQRPage() {
  const faqs = [
    {
      question: "What is a text QR code?",
      answer:
        "A text QR code stores plain text data inside a scannable image. When scanned, the device displays the text on screen rather than opening a URL or triggering an action. It is useful for sharing short messages, serial numbers, or reference codes.",
    },
    {
      question: "How much text can a QR code hold?",
      answer:
        "A single QR code can store up to 4,296 alphanumeric characters or 2,953 bytes of binary data. For best scanning reliability, especially on printed materials, keeping text under 300 characters is recommended.",
    },
    {
      question: "Can I encode multi-line text?",
      answer:
        "Yes. The text field supports line breaks and special characters. The QR code will preserve the exact formatting you enter, including new lines and punctuation.",
    },
    {
      question: "What happens when someone scans a text QR code?",
      answer:
        "The scanner app displays the encoded text on screen. Most QR reader apps allow the user to copy the text, share it, or search for it online. Unlike URL QR codes, a text QR code does not open a browser automatically.",
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
              Type or paste any text and turn it into a QR code in seconds.
              Perfect for sharing messages, notes, and reference codes.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="basic" defaultType="text" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Convert Text to a QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Converting text to a QR code is one of the simplest and most versatile
            uses of QR technology. Unlike URL-based codes, a text QR code stores
            the message directly inside the image. This means it works completely
            offline and does not depend on any server or internet connection to
            display the content.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">
            Steps to Generate Your QR Code
          </h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Type or paste your text into the input field above.</li>
            <li>The QR code preview updates instantly as you type.</li>
            <li>Review the generated code and scan it to verify the content.</li>
            <li>Download the QR code as a PNG and use it anywhere.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">
            Popular Use Cases
          </h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>
              <strong className="text-foreground">Inventory labels</strong> — encode product serial
              numbers, SKUs, or batch codes for quick scanning.
            </li>
            <li>
              <strong className="text-foreground">Scavenger hunts</strong> — hide clues or riddles
              inside QR codes for interactive games.
            </li>
            <li>
              <strong className="text-foreground">Classroom activities</strong> — share answers,
              vocabulary words, or instructions with students.
            </li>
            <li>
              <strong className="text-foreground">Personal messages</strong> — encode a greeting,
              poem, or secret note for friends and family.
            </li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">
            About the Text QR Format
          </h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Text QR codes use the simplest encoding mode available in the QR standard.
            The raw text is embedded directly into the code without any URI scheme or
            special formatting. This makes them universally compatible — any QR scanner
            will decode the text correctly regardless of the operating system or app used.
            Error correction (typically Level M) ensures the code remains scannable even
            if up to 15% of the image is obscured or damaged.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-border bg-card"
              >
                <summary className="cursor-pointer select-none px-6 py-4 text-base font-medium text-foreground transition-colors hover:text-foreground/80">
                  {faq.question}
                </summary>
                <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-foreground">
            Related QR Code Generators
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/url" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
              URL QR Code
            </Link>
            <Link href="/email" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
              Email QR Code
            </Link>
            <Link href="/sms" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
              SMS QR Code
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" },
              { "@type": "ListItem", position: 2, name: "Basic", item: "https://quickqr.app" },
              { "@type": "ListItem", position: 3, name: "Text QR Code Generator", item: "https://quickqr.app/text" },
            ],
          }),
        }}
      />
    </>
  );
}
