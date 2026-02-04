import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free Ethereum QR Code Generator";
const PAGE_DESCRIPTION =
  "Generate a free Ethereum QR code to receive ETH payments. Enter your wallet address and optional amount to create a scannable Ethereum payment request.";

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

export default function EthereumQRPage() {
  const faqs = [
    {
      question: "What is an Ethereum QR code?",
      answer:
        "An Ethereum QR code encodes your ETH wallet address (and optionally an amount) into a scannable image using the ethereum: URI scheme defined in EIP-681. Wallet apps like MetaMask, Trust Wallet, and Coinbase Wallet can scan it to pre-fill a transaction.",
    },
    {
      question: "What format should the address be in?",
      answer:
        "Enter a standard Ethereum address starting with 0x followed by 40 hexadecimal characters (e.g., 0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18). Both checksummed and lowercase addresses are accepted.",
    },
    {
      question: "Can I request a specific ETH amount?",
      answer:
        "Yes. Enter the amount in ETH (up to 18 decimal places) and it will be included in the URI. The sender's wallet will display the requested amount when they scan the code.",
    },
    {
      question: "Does this work for ERC-20 tokens?",
      answer:
        "This generator creates QR codes for native ETH transfers. For ERC-20 token transfers, you would need to encode additional contract data. The basic ethereum: address QR code works for receiving ETH on any Ethereum-compatible wallet.",
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
              Share your Ethereum wallet address as a scannable QR code. Receive
              ETH payments without the risk of address typos.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="payment" defaultType="ethereum" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create an Ethereum QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Ethereum addresses are 42-character hexadecimal strings that are
            virtually impossible to type correctly by hand. An Ethereum QR code
            eliminates this problem by encoding your address into a scannable
            image. Whether you are collecting payment for goods, receiving a
            peer-to-peer transfer, or accepting donations, a QR code makes
            the process fast and error-free.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Paste your Ethereum wallet address (0x...) into the address field.</li>
            <li>Optionally enter an ETH amount to request a specific payment.</li>
            <li>The QR code generates instantly in the preview.</li>
            <li>Download and share the code on your website, invoice, or in person.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Accepting ETH payments</strong> — display the code at checkout for crypto-friendly businesses.</li>
            <li><strong className="text-foreground">NFT sales</strong> — share your address for direct ETH transfers related to digital art.</li>
            <li><strong className="text-foreground">Developer tips</strong> — embed on your GitHub profile or project page for supporter donations.</li>
            <li><strong className="text-foreground">Peer-to-peer transfers</strong> — show the code on your phone so friends can send ETH instantly.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">About the Ethereum URI Format</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The QR code encodes an{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">ethereum:</code>{" "}
            URI following EIP-681. The address is included as the path, and the optional
            amount is specified via the <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">value</code> query
            parameter in wei or as an ETH decimal. This format is recognized by MetaMask,
            Trust Wallet, Coinbase Wallet, Rainbow, and most other Ethereum wallets.
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
            <Link href="/bitcoin" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Bitcoin QR Code</Link>
            <Link href="/paypal" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">PayPal QR Code</Link>
            <Link href="/epc" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">SEPA/EPC QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Payment", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "Ethereum QR Code Generator", item: "https://quickqr.app/ethereum" }] }) }} />
    </>
  );
}
