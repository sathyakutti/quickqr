import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${SITE_NAME}. Read the terms governing your use of our QR code generator.`,
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: February 2026
      </p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p className="text-muted-foreground">
            By accessing or using {SITE_NAME} at{" "}
            <span className="text-foreground">{SITE_URL}</span>, you agree to be
            bound by these Terms of Service. If you do not agree with any part of
            these terms, you must not use our service.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            2. Description of Service
          </h2>
          <p className="text-muted-foreground">
            {SITE_NAME} provides a browser-based QR code generation tool. All QR
            code generation happens on your device. We offer both a free tier with
            basic functionality and a paid premium tier with additional features
            such as custom styling, logo embedding, and high-resolution downloads.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            3. Free Tier
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Access to all QR code types</li>
            <li>Limited to 10 downloads per day</li>
            <li>PNG format at 300px resolution</li>
            <li>Downloads include a &quot;Made with QuickQR&quot; watermark</li>
            <li>Advertisements are displayed</li>
            <li>No account or registration required</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            4. Premium Subscription
          </h2>
          <p className="text-muted-foreground">
            The premium subscription is billed on a recurring basis (monthly or
            yearly) through Stripe (for card payments) or Razorpay (for UPI
            payments). By subscribing, you authorize the recurring charge.
          </p>
          <p className="mt-3 text-muted-foreground">
            You may cancel your subscription at any time. Upon cancellation, your
            premium features will remain active until the end of your current
            billing period. No refunds are provided for partial billing periods.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            5. Acceptable Use
          </h2>
          <p className="text-muted-foreground">
            You agree not to use {SITE_NAME} to generate QR codes that:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Link to malware, phishing pages, or fraudulent content</li>
            <li>Contain illegal content in your jurisdiction</li>
            <li>Infringe on the intellectual property rights of others</li>
            <li>Facilitate scams or deceptive practices</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            6. Intellectual Property
          </h2>
          <p className="text-muted-foreground">
            QR codes you generate using {SITE_NAME} are yours to use for any
            lawful purpose, including commercial use. The {SITE_NAME} brand,
            logo, website design, and underlying code remain our intellectual
            property.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            7. Disclaimer of Warranties
          </h2>
          <p className="text-muted-foreground">
            {SITE_NAME} is provided &quot;as is&quot; without warranties of any kind,
            express or implied. We do not guarantee that QR codes generated will
            be scannable by all devices or readers. We are not responsible for
            the content encoded in QR codes you generate.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            8. Limitation of Liability
          </h2>
          <p className="text-muted-foreground">
            To the maximum extent permitted by law, {SITE_NAME} and its operators
            shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the
            service. Our total liability shall not exceed the amount you paid for
            the service in the 12 months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            9. Changes to Terms
          </h2>
          <p className="text-muted-foreground">
            We reserve the right to modify these terms at any time. Changes will
            be posted on this page. Continued use of {SITE_NAME} after changes
            constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            10. Contact
          </h2>
          <p className="text-muted-foreground">
            If you have questions about these Terms of Service, please contact us
            through our website.
          </p>
        </section>
      </div>
    </div>
  );
}
