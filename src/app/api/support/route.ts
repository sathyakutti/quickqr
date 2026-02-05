import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/support
 *
 * Receives a support form submission and forwards it via Resend
 * to the site owner. The customer's email is never exposed — only
 * used as reply-to so the owner can respond directly.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, category, message } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a message (at least 10 characters)" },
        { status: 400 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const supportEmail = process.env.SUPPORT_FORWARD_EMAIL;
    if (!supportEmail) {
      return NextResponse.json(
        { error: "Support email not configured" },
        { status: 500 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name?.trim() || "Anonymous";
    const trimmedCategory = category?.trim() || "General";
    const trimmedMessage = message.trim();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "QuickQR Support <noreply@quickqrcode.app>",
        to: [supportEmail],
        reply_to: trimmedEmail,
        subject: `[QuickQR Support] ${trimmedCategory} — from ${trimmedName}`,
        text: [
          `New support request from QuickQR`,
          ``,
          `Name: ${trimmedName}`,
          `Email: ${trimmedEmail}`,
          `Category: ${trimmedCategory}`,
          ``,
          `Message:`,
          trimmedMessage,
          ``,
          `---`,
          `Reply directly to this email to respond to the customer.`,
        ].join("\n"),
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return NextResponse.json(
        {
          error:
            (err as { message?: string })?.message ||
            "Failed to send support request",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ sent: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send message";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
