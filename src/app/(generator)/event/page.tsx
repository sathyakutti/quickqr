import type { Metadata } from "next";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";
import { SITE_NAME } from "@/lib/constants";

const PAGE_TITLE = "Free Event QR Code Generator";
const PAGE_DESCRIPTION =
  "Generate a free calendar event QR code. Create a scannable code that adds an event with title, date, time, location, and description directly to any calendar app.";

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

export default function EventQRPage() {
  const faqs = [
    {
      question: "What is a calendar event QR code?",
      answer:
        "A calendar event QR code encodes event details — title, start/end date and time, location, and description — in the iCalendar (vEvent) format. When scanned, the phone offers to add the event directly to the user's calendar app.",
    },
    {
      question: "Which calendar apps are supported?",
      answer:
        "The iCalendar format is supported by virtually all calendar apps: Apple Calendar, Google Calendar, Microsoft Outlook, Samsung Calendar, and others. When scanned, the device's default calendar app opens with all event details pre-filled.",
    },
    {
      question: "Can I create all-day events?",
      answer:
        "Yes. Toggle the all-day option and the generated code will encode a date-only event without specific start and end times. This is useful for holidays, deadlines, and multi-day conferences.",
    },
    {
      question: "Is there a limit on the description length?",
      answer:
        "While the QR standard supports thousands of characters, keeping your total event data under 500 characters produces the most scannable code. For detailed agendas, consider linking to a webpage in the description field.",
    },
    {
      question: "Does this set reminders automatically?",
      answer:
        "Reminders depend on the user's calendar app settings. The QR code encodes the event itself, and the calendar app applies the user's default reminder rules.",
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
              Create a QR code that adds an event to any calendar app. Share
              event details effortlessly on invitations, posters, and tickets.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <QRGenerator defaultCategory="event" defaultType="event" />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How to Create a Calendar Event QR Code
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            A calendar event QR code takes the friction out of event promotion.
            Instead of asking attendees to manually create a calendar entry, you
            give them a code that does it in one scan. This is invaluable for
            conferences, workshops, meetups, weddings, and any occasion where you
            want people to remember the date and show up.
          </p>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Steps to Generate Your QR Code</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Enter the event title, start date, and start time.</li>
            <li>Optionally add an end date/time, location, and description.</li>
            <li>Toggle all-day if the event does not have specific times.</li>
            <li>Download the QR code and add it to your invitations, posters, or event website.</li>
          </ol>

          <h3 className="mt-10 text-xl font-semibold text-foreground">Common Use Cases</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li><strong className="text-foreground">Conference invitations</strong> — let attendees add sessions to their calendar from a printed schedule.</li>
            <li><strong className="text-foreground">Wedding invitations</strong> — include a QR code so guests save the date instantly.</li>
            <li><strong className="text-foreground">Classroom schedules</strong> — students scan to add exam dates or assignment deadlines.</li>
            <li><strong className="text-foreground">Concert tickets</strong> — embed the show date and venue on the ticket itself.</li>
            <li><strong className="text-foreground">Recurring meetups</strong> — print on community board flyers so new members save the next date.</li>
          </ul>

          <h3 className="mt-10 text-xl font-semibold text-foreground">About the iCalendar Format</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The event QR code uses the iCalendar / vEvent format (RFC 5545). The encoded
            text begins with{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">BEGIN:VEVENT</code>{" "}
            and includes properties like SUMMARY (title), DTSTART (start datetime),
            DTEND (end datetime), LOCATION, and DESCRIPTION. This format has been the
            calendar interchange standard since 1998 and is universally supported.
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
            <Link href="/geo" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Location QR Code</Link>
            <Link href="/url" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">URL QR Code</Link>
            <Link href="/text" className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">Text QR Code</Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://quickqr.app" }, { "@type": "ListItem", position: 2, name: "Event", item: "https://quickqr.app" }, { "@type": "ListItem", position: 3, name: "Event QR Code Generator", item: "https://quickqr.app/event" }] }) }} />
    </>
  );
}
