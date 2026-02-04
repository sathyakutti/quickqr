import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free WiFi QR Code Generator";
const PAGE_DESCRIPTION =
  "Create a free WiFi QR code so guests can connect to your network instantly. Enter your SSID, password, and encryption type to generate a scannable code.";

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

export default function WiFiQRPage() {
  const faqs = [
    {
      question: "How does a WiFi QR code work?",
      answer:
        "A WiFi QR code stores your network name (SSID), password, and encryption type in a standardized format. When someone scans it, their phone automatically offers to join the network without any manual typing.",
    },
    {
      question: "Is it safe to share my WiFi password via QR code?",
      answer:
        "The QR code is generated entirely in your browser — your password never leaves your device. However, anyone who scans the printed code will gain access to the network, so display it only in trusted locations.",
    },
    {
      question: "Which encryption types are supported?",
      answer:
        "The generator supports WPA/WPA2 (most common for home and business networks), WEP (legacy), and open networks with no password. Select the option that matches your router configuration.",
    },
    {
      question: "Does this work on both iPhone and Android?",
      answer:
        "Yes. iPhones running iOS 11 or later and virtually all modern Android devices can scan WiFi QR codes directly from the built-in camera app. No third-party scanner is needed.",
    },
    {
      question: "Can I use this for a hidden network?",
      answer:
        "Absolutely. Toggle the hidden network option and the generated QR code will include the hidden flag, telling the scanning device to connect even though the SSID is not broadcast.",
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
              Let guests connect to your WiFi with a single scan. No more
              spelling out passwords letter by letter.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="basic" defaultType="wifi" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create a WiFi QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            A WiFi QR code generator takes your wireless network credentials and
            encodes them into a compact image. This eliminates the hassle of
            dictating long, complex passwords to visitors. The QR code uses the
            widely supported <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">WIFI:</code> URI
            scheme that both iOS and Android recognize natively.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">
            Steps to Generate Your QR Code
          </h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Enter your network name (SSID) exactly as it appears on your router.</li>
            <li>Type your WiFi password and select the correct encryption type (WPA/WPA2 is most common).</li>
            <li>If your network is hidden, enable the hidden network toggle.</li>
            <li>Download the generated QR code and print it for your lobby, guest room, or office.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">
            Common Use Cases
          </h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>
              <strong className="text-foreground">Hotels and Airbnbs</strong> — place a framed QR
              code on the bedside table so guests can connect instantly.
            </li>
            <li>
              <strong className="text-foreground">Coffee shops and restaurants</strong> — display
              the code at the counter or on table tents instead of writing the password on a chalkboard.
            </li>
            <li>
              <strong className="text-foreground">Offices and coworking spaces</strong> — share the
              guest network securely without emailing credentials.
            </li>
            <li>
              <strong className="text-foreground">Home parties</strong> — print a small card so
              friends can get online without asking for the password.
            </li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">
            How the WiFi QR Format Works
          </h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The code follows the format{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">
              WIFI:T:WPA;S:NetworkName;P:Password;H:false;;
            </code>. The <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">T</code> field
            specifies encryption, <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">S</code> is
            the SSID, <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">P</code> is the
            password, and <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">H</code> indicates
            whether the network is hidden. This format was originally proposed by Google
            for Android and is now universally supported across mobile platforms.
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
              <details key={faq.question} className="group rounded-lg border border-border bg-card">
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
          <h2 className="text-lg font-semibold text-foreground">Related QR Code Generators</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/url" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">URL QR Code</Link>
            <Link href="/text" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Text QR Code</Link>
            <Link href="/vcard" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">vCard QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Basic", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "WiFi QR Code Generator", item: "https://quickqr.app/wifi" }] }) }} />
    </>
  );
}
