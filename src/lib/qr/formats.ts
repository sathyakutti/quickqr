import type {
  QRType,
  QRDataMap,
  URLData,
  TextData,
  WiFiData,
  EmailData,
  PhoneData,
  SMSData,
  VCardData,
  MeCardData,
  SocialData,
  UPIData,
  EPCData,
  PixData,
  BitcoinData,
  EthereumData,
  PayPalData,
  EventData,
  GeoData,
  GoogleMapsData,
  AppStoreData,
} from "./types";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Escapes WiFi special characters (`;`, `,`, `:`, `\`) with a leading backslash
 * as required by the WIFI: URI scheme.
 */
function escapeWiFi(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/:/g, "\\:");
}

/**
 * Escapes MeCard special characters (`;`, `:`, `,`) with a leading backslash.
 */
function escapeMeCard(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/:/g, "\\:").replace(/,/g, "\\,");
}

/**
 * Formats a date string (YYYY-MM-DD) and optional time string (HH:MM) into an
 * iCal datetime string (yyyyMMddTHHmmss). If no time is provided, returns the
 * date-only format (yyyyMMdd).
 */
function formatICalDateTime(date: string, time?: string): string {
  const [year, month, day] = date.split("-");
  if (!time) {
    return `${year}${month}${day}`;
  }
  const [hours, minutes] = time.split(":");
  return `${year}${month}${day}T${hours}${minutes}00`;
}

/**
 * Folds long iCal lines at 75 octets as required by RFC 5545.
 */
function foldICalLine(line: string): string {
  const MAX_OCTETS = 75;
  if (line.length <= MAX_OCTETS) return line;
  const parts: string[] = [];
  parts.push(line.slice(0, MAX_OCTETS));
  let offset = MAX_OCTETS;
  while (offset < line.length) {
    // continuation lines start with a single space; net content = 74 octets
    parts.push(" " + line.slice(offset, offset + MAX_OCTETS - 1));
    offset += MAX_OCTETS - 1;
  }
  return parts.join("\r\n");
}

/**
 * Escapes a text value for use inside an iCal property (RFC 5545 Section 3.3.11).
 */
function escapeICalText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

// ---------------------------------------------------------------------------
// EMVCo / Pix helpers
// ---------------------------------------------------------------------------

/**
 * Builds a single EMVCo TLV field: [2-digit id][2-digit length][value].
 */
function tlv(id: string, value: string): string {
  const length = value.length.toString().padStart(2, "0");
  return `${id}${length}${value}`;
}

/**
 * CRC-16/CCITT-FALSE used by EMVCo (polynomial 0x1021, initial value 0xFFFF).
 * Operates on a UTF-8 byte sequence.
 */
function crc16(payload: string): string {
  const bytes = new TextEncoder().encode(payload);
  let crc = 0xffff;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i] << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// ---------------------------------------------------------------------------
// Public encoder functions
// ---------------------------------------------------------------------------

export function encodeURL(data: URLData): string {
  return data.url;
}

export function encodeText(data: TextData): string {
  return data.text;
}

export function encodeWiFi(data: WiFiData): string {
  const parts: string[] = [
    `T:${data.encryption}`,
    `S:${escapeWiFi(data.ssid)}`,
    `P:${escapeWiFi(data.password)}`,
  ];
  if (data.hidden) {
    parts.push("H:true");
  }
  return `WIFI:${parts.join(";")};;`;
}

export function encodeEmail(data: EmailData): string {
  const params: string[] = [];
  if (data.subject) {
    params.push(`subject=${encodeURIComponent(data.subject)}`);
  }
  if (data.body) {
    params.push(`body=${encodeURIComponent(data.body)}`);
  }
  const query = params.length > 0 ? `?${params.join("&")}` : "";
  return `mailto:${data.to}${query}`;
}

export function encodePhone(data: PhoneData): string {
  return `tel:${data.phone}`;
}

export function encodeSMS(data: SMSData): string {
  const message = data.message ?? "";
  return `smsto:${data.phone}:${message}`;
}

export function encodeVCard(data: VCardData): string {
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${data.lastName};${data.firstName};;;`,
    `FN:${data.firstName} ${data.lastName}`,
  ];

  if (data.phone) lines.push(`TEL:${data.phone}`);
  if (data.email) lines.push(`EMAIL:${data.email}`);
  if (data.company) lines.push(`ORG:${data.company}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.website) lines.push(`URL:${data.website}`);

  const hasAddress =
    data.street || data.city || data.state || data.zip || data.country;
  if (hasAddress) {
    // ADR:;;street;city;state;zip;country
    lines.push(
      `ADR:;;${data.street ?? ""};${data.city ?? ""};${data.state ?? ""};${data.zip ?? ""};${data.country ?? ""}`
    );
  }

  lines.push("END:VCARD");
  return lines.join("\n");
}

export function encodeMeCard(data: MeCardData): string {
  const parts: string[] = [`N:${escapeMeCard(data.name)}`];
  if (data.phone) parts.push(`TEL:${escapeMeCard(data.phone)}`);
  if (data.email) parts.push(`EMAIL:${escapeMeCard(data.email)}`);
  if (data.url) parts.push(`URL:${escapeMeCard(data.url)}`);
  if (data.address) parts.push(`ADR:${escapeMeCard(data.address)}`);
  if (data.note) parts.push(`NOTE:${escapeMeCard(data.note)}`);
  return `MECARD:${parts.join(";")};;`;
}

export function encodeSocial(data: SocialData): string {
  return data.url;
}

export function encodeUPI(data: UPIData): string {
  const params: string[] = [
    `pa=${encodeURIComponent(data.vpa)}`,
    `pn=${encodeURIComponent(data.name)}`,
  ];
  if (data.amount) {
    params.push(`am=${encodeURIComponent(data.amount)}`);
  }
  params.push("cu=INR");
  if (data.note) {
    params.push(`tn=${encodeURIComponent(data.note)}`);
  }
  return `upi://pay?${params.join("&")}`;
}

/**
 * Encodes data in the EPC QR code format (European Payments Council Quick
 * Response Code guidelines, version 002).
 *
 * The payload consists of exactly 12 lines separated by newlines:
 *   1. Service Tag: BCD
 *   2. Version: 002
 *   3. Character Set: 1 (UTF-8)
 *   4. Identification Code: SCT
 *   5. BIC of the beneficiary bank (optional in version 002)
 *   6. Name of the beneficiary (max 70 chars)
 *   7. IBAN of the beneficiary
 *   8. Amount in EUR format: EUR[amount] (e.g. EUR12.50), empty if not specified
 *   9. Purpose (4-char code) — left empty
 *  10. Structured Remittance Reference (max 35 chars)
 *  11. Unstructured Remittance Info — left empty when reference is present
 *  12. Beneficiary-to-originator information (max 70 chars)
 */
export function encodeEPC(data: EPCData): string {
  const amountField = data.amount ? `EUR${data.amount}` : "";
  const reference = data.reference ?? "";
  // If there is a structured reference, unstructured info goes to line 12.
  // If there is no structured reference, info can go to line 11.
  const unstructuredInfo = reference ? "" : (data.info ?? "");
  const beneficiaryInfo = reference ? (data.info ?? "") : "";

  const lines: string[] = [
    "BCD",                    // 1  Service Tag
    "002",                    // 2  Version
    "1",                      // 3  Character Set (UTF-8)
    "SCT",                    // 4  Identification Code
    data.bic ?? "",           // 5  BIC
    data.name,                // 6  Name
    data.iban,                // 7  IBAN
    amountField,              // 8  Amount
    "",                       // 9  Purpose
    reference,                // 10 Remittance Reference
    unstructuredInfo,         // 11 Unstructured Remittance Info
    beneficiaryInfo,          // 12 Beneficiary-to-originator info
  ];
  return lines.join("\n");
}

/**
 * Encodes a Pix payment QR code using the EMVCo static QR code standard (BR Code).
 *
 * Field layout (IDs per EMVCo + BCB):
 *   00 – Payload Format Indicator: "01"
 *   01 – Point of Initiation Method: "12" (static) or "11" (dynamic)
 *   26 – Merchant Account Information (template)
 *        └ 00 – GUI: "br.gov.bcb.pix"
 *        └ 01 – Pix Key
 *        └ 02 – Description (optional)
 *   52 – Merchant Category Code: "0000"
 *   53 – Transaction Currency: "986" (BRL)
 *   54 – Transaction Amount (optional)
 *   58 – Country Code: "BR"
 *   59 – Merchant Name
 *   60 – Merchant City
 *   62 – Additional Data Field Template
 *        └ 05 – Reference Label: "***"
 *   63 – CRC16 (4 hex chars)
 */
export function encodePix(data: PixData): string {
  // Build the Merchant Account Information (ID 26) sub-fields
  let merchantAccountSub =
    tlv("00", "br.gov.bcb.pix") + tlv("01", data.pixKey);
  if (data.description) {
    merchantAccountSub += tlv("02", data.description);
  }

  // Build the Additional Data Field Template (ID 62)
  const additionalData = tlv("05", "***");

  // Assemble the full payload (without CRC)
  let payload = "";
  payload += tlv("00", "01");                           // Payload Format Indicator
  payload += tlv("01", "12");                           // Point of Initiation Method (static)
  payload += tlv("26", merchantAccountSub);             // Merchant Account Info
  payload += tlv("52", "0000");                         // Merchant Category Code
  payload += tlv("53", "986");                          // Transaction Currency (BRL)
  if (data.amount) {
    payload += tlv("54", data.amount);                  // Transaction Amount
  }
  payload += tlv("58", "BR");                           // Country Code
  payload += tlv("59", data.name);                      // Merchant Name
  payload += tlv("60", data.city);                      // Merchant City
  payload += tlv("62", additionalData);                 // Additional Data Field

  // CRC placeholder: ID "63", length "04", then compute CRC over everything
  payload += "6304";
  const checksum = crc16(payload);
  payload += checksum;

  return payload;
}

/**
 * Encodes a Bitcoin payment URI per BIP 21.
 * Format: bitcoin:<address>[?amount=<amount>&label=<label>&message=<message>]
 */
export function encodeBitcoin(data: BitcoinData): string {
  const params: string[] = [];
  if (data.amount) {
    params.push(`amount=${encodeURIComponent(data.amount)}`);
  }
  if (data.label) {
    params.push(`label=${encodeURIComponent(data.label)}`);
  }
  if (data.message) {
    params.push(`message=${encodeURIComponent(data.message)}`);
  }
  const query = params.length > 0 ? `?${params.join("&")}` : "";
  return `bitcoin:${data.address}${query}`;
}

/**
 * Encodes an Ethereum payment URI per EIP-681.
 * Format: ethereum:<address>[?value=<wei>]
 *
 * The amount is specified in ETH and converted to Wei (1 ETH = 1e18 Wei).
 */
export function encodeEthereum(data: EthereumData): string {
  if (data.amount) {
    // Convert ETH to Wei. We use BigInt-safe string math to avoid
    // floating-point precision issues. Split on decimal, pad to 18 places.
    const weiStr = ethToWei(data.amount);
    return `ethereum:${data.address}?value=${weiStr}`;
  }
  return `ethereum:${data.address}`;
}

/**
 * Converts an ETH decimal string to a Wei integer string without floating-point
 * errors. Handles up to 18 decimal places of precision.
 */
function ethToWei(eth: string): string {
  const WEI_DECIMALS = 18;
  const parts = eth.split(".");
  const whole = parts[0] ?? "0";
  let fractional = parts[1] ?? "";

  // Pad or truncate fractional part to exactly 18 digits
  if (fractional.length > WEI_DECIMALS) {
    fractional = fractional.slice(0, WEI_DECIMALS);
  } else {
    fractional = fractional.padEnd(WEI_DECIMALS, "0");
  }

  // Concatenate and remove leading zeros (but keep at least "0")
  const combined = whole + fractional;
  const trimmed = combined.replace(/^0+/, "") || "0";
  return trimmed;
}

export function encodePayPal(data: PayPalData): string {
  const base = `https://paypal.me/${encodeURIComponent(data.username)}`;
  if (data.amount) {
    const currencySuffix = data.currency ? `/${data.currency}` : "";
    return `${base}/${data.amount}${currencySuffix}`;
  }
  return base;
}

/**
 * Encodes a calendar event in iCalendar (RFC 5545) format wrapped in a
 * VCALENDAR container.
 *
 * For all-day events, DTSTART and DTEND use VALUE=DATE (yyyyMMdd).
 * For timed events, DTSTART and DTEND use the form yyyyMMddTHHmmss.
 */
export function encodeEvent(data: EventData): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//QR Code Generator//EN",
    "BEGIN:VEVENT",
  ];

  lines.push(foldICalLine(`SUMMARY:${escapeICalText(data.title)}`));

  if (data.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${formatICalDateTime(data.startDate)}`);
    if (data.endDate) {
      // For all-day events, DTEND is exclusive, so we add 1 day.
      const endPlusOne = addOneDay(data.endDate);
      lines.push(`DTEND;VALUE=DATE:${formatICalDateTime(endPlusOne)}`);
    } else {
      const endPlusOne = addOneDay(data.startDate);
      lines.push(`DTEND;VALUE=DATE:${formatICalDateTime(endPlusOne)}`);
    }
  } else {
    const startDT = formatICalDateTime(data.startDate, data.startTime ?? "00:00");
    lines.push(`DTSTART:${startDT}`);
    if (data.endDate) {
      const endDT = formatICalDateTime(data.endDate, data.endTime ?? "00:00");
      lines.push(`DTEND:${endDT}`);
    } else if (data.endTime) {
      const endDT = formatICalDateTime(data.startDate, data.endTime);
      lines.push(`DTEND:${endDT}`);
    }
  }

  if (data.location) {
    lines.push(foldICalLine(`LOCATION:${escapeICalText(data.location)}`));
  }
  if (data.description) {
    lines.push(foldICalLine(`DESCRIPTION:${escapeICalText(data.description)}`));
  }

  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");
  return lines.join("\n");
}

/**
 * Adds one day to a YYYY-MM-DD date string. This is needed because iCal
 * all-day DTEND is exclusive (the event ends at the *start* of DTEND date).
 */
function addOneDay(dateStr: string): string {
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const date = new Date(
    parseInt(yearStr, 10),
    parseInt(monthStr, 10) - 1,
    parseInt(dayStr, 10)
  );
  date.setDate(date.getDate() + 1);
  const y = date.getFullYear().toString();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function encodeGeo(data: GeoData): string {
  return `geo:${data.latitude},${data.longitude}`;
}

export function encodeGoogleMaps(data: GoogleMapsData): string {
  return `https://maps.google.com/?q=${data.latitude},${data.longitude}`;
}

export function encodeAppStore(data: AppStoreData): string {
  return data.url;
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

const ENCODERS: { [K in QRType]: (data: QRDataMap[K]) => string } = {
  url: encodeURL,
  text: encodeText,
  wifi: encodeWiFi,
  email: encodeEmail,
  phone: encodePhone,
  sms: encodeSMS,
  vcard: encodeVCard,
  mecard: encodeMeCard,
  social: encodeSocial,
  upi: encodeUPI,
  epc: encodeEPC,
  pix: encodePix,
  bitcoin: encodeBitcoin,
  ethereum: encodeEthereum,
  paypal: encodePayPal,
  event: encodeEvent,
  geo: encodeGeo,
  "google-maps": encodeGoogleMaps,
  "app-store": encodeAppStore,
};

/**
 * Routes to the correct encoder based on QR type. Accepts unknown data so it
 * can be called from generic form handlers; the typed encoder will implicitly
 * rely on the data having the correct shape (validate with the corresponding
 * Zod schema before calling this).
 */
export function encodeQRData(type: QRType, data: unknown): string {
  const encoder = ENCODERS[type];
  if (!encoder) {
    throw new Error(`No encoder found for QR type: ${type}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (encoder as (d: any) => string)(data);
}
