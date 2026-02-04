#!/usr/bin/env npx tsx
/**
 * QuickQR MCP Server
 *
 * Exposes QR code generation as MCP tools that AI agents can invoke.
 * Supports all 19 QR types from the QuickQR website.
 *
 * Usage (stdio transport):
 *   npx tsx mcp/server.ts
 *
 * The server registers two tools:
 *   1. generate_qr — Encode data into a QR code string for any supported type
 *   2. list_qr_types — List all available QR code types and their parameters
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { QR_TYPE_IDS } from "../src/lib/qr/types.js";
import { encodeQRData } from "../src/lib/qr/formats.js";

const server = new McpServer({
  name: "quickqr",
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// Tool: generate_qr
// ---------------------------------------------------------------------------

server.tool(
  "generate_qr",
  "Generate a QR code encoded string from structured data. Returns the raw string that should be encoded into a QR code image. Supports 19 types: URL, text, WiFi, email, phone, SMS, vCard, MeCard, social link, UPI, SEPA/EPC, Pix, Bitcoin, Ethereum, PayPal, calendar event, geo location, Google Maps, and app store links.",
  {
    type: z.enum(QR_TYPE_IDS).describe(
      "The QR code type. One of: " + QR_TYPE_IDS.join(", ")
    ),
    data: z.record(z.string(), z.union([z.string(), z.boolean(), z.number()])).describe(
      "Key-value data for the QR type. See list_qr_types for required fields per type."
    ),
  },
  async ({ type, data }) => {
    try {
      const encoded = encodeQRData(type, data);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              qrType: type,
              encoded,
              note: "This is the raw string to encode into a QR code image. Any QR code library or app can render it.",
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Encoding failed";
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ success: false, error: message }),
          },
        ],
        isError: true,
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: list_qr_types
// ---------------------------------------------------------------------------

server.tool(
  "list_qr_types",
  "List all available QR code types with their required and optional fields, plus examples.",
  {},
  async () => {
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

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            availableTypes: QR_TYPE_IDS,
            types,
          }, null, 2),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("MCP server failed to start:", error);
  process.exit(1);
});
