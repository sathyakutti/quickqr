import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { SupportForm } from "./support-form";

export const metadata: Metadata = {
  title: "Support",
  description: `Get help with ${SITE_NAME}. Contact us for payment issues, technical problems, or general questions.`,
};

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Contact Support
        </h1>
        <p className="mt-3 text-muted-foreground">
          Having an issue? Send us a message and we&apos;ll get back to you as
          soon as possible.
        </p>
      </div>

      <div className="mt-10">
        <SupportForm />
      </div>
    </div>
  );
}
