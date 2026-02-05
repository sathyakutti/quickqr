import { NextRequest, NextResponse } from "next/server";
import { QR_TYPE_IDS } from "@/lib/qr/types";
import { encodeQRData } from "@/lib/qr/formats";

export const runtime = "edge";

/**
 * POST /api/qr
 *
 * Generate a QR code string from structured data.
 *
 * Body: { type: QRType, data: Record<string, unknown> }
 * Returns: { encoded: string, type: string }
 *
 * This is the REST API that the MCP server wraps.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || typeof type !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'type' field" },
        { status: 400 }
      );
    }

    if (!QR_TYPE_IDS.includes(type as (typeof QR_TYPE_IDS)[number])) {
      return NextResponse.json(
        {
          error: `Invalid QR type '${type}'. Valid types: ${QR_TYPE_IDS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Missing or invalid 'data' field — must be an object" },
        { status: 400 }
      );
    }

    const encoded = encodeQRData(type as (typeof QR_TYPE_IDS)[number], data);

    return NextResponse.json({
      encoded,
      type,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to encode QR data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/qr
 *
 * Returns the list of supported QR types and their required fields.
 */
export async function GET() {
  const types = {
    url: { fields: { url: "string (required)" }, example: { url: "https://example.com" } },
    text: { fields: { text: "string (required)" }, example: { text: "Hello World" } },
    wifi: {
      fields: { ssid: "string (required)", password: "string", encryption: "WPA | WPA2 | WEP | nopass", hidden: "boolean" },
      example: { ssid: "MyNetwork", password: "secret123", encryption: "WPA", hidden: false },
    },
    email: {
      fields: { to: "string (required)", subject: "string", body: "string" },
      example: { to: "hello@example.com", subject: "Hi", body: "Hello there" },
    },
    phone: { fields: { phone: "string (required)" }, example: { phone: "+1234567890" } },
    sms: {
      fields: { phone: "string (required)", message: "string" },
      example: { phone: "+1234567890", message: "Hello" },
    },
    vcard: {
      fields: { firstName: "string (required)", lastName: "string", phone: "string", email: "string", company: "string", title: "string", website: "string", address: "string" },
      example: { firstName: "John", lastName: "Doe", email: "john@example.com" },
    },
    mecard: {
      fields: { name: "string (required)", phone: "string", email: "string", url: "string", address: "string", note: "string" },
      example: { name: "John Doe", email: "john@example.com" },
    },
    social: { fields: { url: "string (required)" }, example: { url: "https://twitter.com/example" } },
    upi: {
      fields: { vpa: "string (required)", name: "string (required)", amount: "string", note: "string" },
      example: { vpa: "user@upi", name: "John Doe", amount: "100" },
    },
    epc: {
      fields: { name: "string (required)", iban: "string (required)", bic: "string", amount: "string", reference: "string", info: "string" },
      example: { name: "John Doe", iban: "DE89370400440532013000", amount: "100" },
    },
    pix: {
      fields: { pixKey: "string (required)", name: "string (required)", city: "string (required)", amount: "string", description: "string" },
      example: { pixKey: "12345678901", name: "John", city: "SAO PAULO" },
    },
    bitcoin: {
      fields: { address: "string (required)", amount: "string", label: "string", message: "string" },
      example: { address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" },
    },
    ethereum: {
      fields: { address: "string (required)", amount: "string" },
      example: { address: "0x32Be343B94f860124dC4fEe278FDCBD38C102D88" },
    },
    paypal: {
      fields: { username: "string (required)", amount: "string", currency: "string" },
      example: { username: "johndoe", amount: "25" },
    },
    event: {
      fields: { title: "string (required)", startDate: "string YYYY-MM-DD (required)", endDate: "string YYYY-MM-DD", startTime: "string HH:MM", endTime: "string HH:MM", location: "string", description: "string", allDay: "boolean" },
      example: { title: "Meeting", startDate: "2026-03-01", startTime: "10:00", endDate: "2026-03-01", endTime: "11:00" },
    },
    geo: {
      fields: { latitude: "string (required)", longitude: "string (required)" },
      example: { latitude: "40.7128", longitude: "-74.0060" },
    },
    "google-maps": {
      fields: { latitude: "string (required)", longitude: "string (required)" },
      example: { latitude: "40.7128", longitude: "-74.0060" },
    },
    "app-store": {
      fields: { url: "string (required)" },
      example: { url: "https://apps.apple.com/app/example/id123456789" },
    },
  };

  return NextResponse.json({
    availableTypes: QR_TYPE_IDS,
    types,
  });
}
