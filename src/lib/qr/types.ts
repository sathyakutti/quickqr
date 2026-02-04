import { z } from "zod";

// ---------------------------------------------------------------------------
// QR Type and Category union types
// ---------------------------------------------------------------------------

export const QR_TYPE_IDS = [
  "url",
  "text",
  "wifi",
  "email",
  "phone",
  "sms",
  "vcard",
  "mecard",
  "social",
  "upi",
  "epc",
  "pix",
  "bitcoin",
  "ethereum",
  "paypal",
  "event",
  "geo",
  "google-maps",
  "app-store",
] as const;

export type QRType = (typeof QR_TYPE_IDS)[number];

export const QR_CATEGORY_IDS = [
  "basic",
  "contact",
  "social",
  "payment",
  "event",
  "location",
  "app",
] as const;

export type QRCategory = (typeof QR_CATEGORY_IDS)[number];

// ---------------------------------------------------------------------------
// Zod schemas – one per QR type
// ---------------------------------------------------------------------------

export const urlSchema = z.object({
  url: z.string().url("Must be a valid URL"),
});
export type URLData = z.infer<typeof urlSchema>;

export const textSchema = z.object({
  text: z.string().min(1, "Text must not be empty"),
});
export type TextData = z.infer<typeof textSchema>;

export const wifiSchema = z.object({
  ssid: z.string().min(1, "SSID is required"),
  password: z.string(),
  encryption: z.enum(["WPA", "WEP", "nopass"]),
  hidden: z.boolean(),
});
export type WiFiData = z.infer<typeof wifiSchema>;

export const emailSchema = z.object({
  to: z.string().email("Must be a valid email address"),
  subject: z.string().optional(),
  body: z.string().optional(),
});
export type EmailData = z.infer<typeof emailSchema>;

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[\d\s\-().]+$/, "Must be a valid phone number"),
});
export type PhoneData = z.infer<typeof phoneSchema>;

export const smsSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[\d\s\-().]+$/, "Must be a valid phone number"),
  message: z.string().optional(),
});
export type SMSData = z.infer<typeof smsSchema>;

export const vcardSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  company: z.string().optional(),
  title: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});
export type VCardData = z.infer<typeof vcardSchema>;

export const mecardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  note: z.string().optional(),
});
export type MeCardData = z.infer<typeof mecardSchema>;

export const socialSchema = z.object({
  url: z.string().url("Must be a valid URL"),
});
export type SocialData = z.infer<typeof socialSchema>;

export const upiSchema = z.object({
  vpa: z
    .string()
    .min(1, "VPA is required")
    .regex(/^[\w.\-]+@[\w]+$/, "Must be a valid UPI VPA (e.g. user@bank)"),
  name: z.string().min(1, "Payee name is required"),
  amount: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
      "Amount must be a valid number with up to 2 decimal places"
    ),
  note: z.string().optional(),
});
export type UPIData = z.infer<typeof upiSchema>;

export const epcSchema = z.object({
  name: z.string().min(1, "Beneficiary name is required").max(70, "Name must be 70 characters or fewer"),
  iban: z
    .string()
    .min(1, "IBAN is required")
    .regex(
      /^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/,
      "Must be a valid IBAN (e.g. DE89370400440532013000)"
    ),
  bic: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(val),
      "Must be a valid BIC/SWIFT code"
    ),
  amount: z
    .string()
    .optional()
    .refine(
      (val) => !val || (/^\d+(\.\d{1,2})?$/.test(val) && parseFloat(val) >= 0.01 && parseFloat(val) <= 999999999.99),
      "Amount must be between 0.01 and 999999999.99"
    ),
  reference: z.string().max(35, "Reference must be 35 characters or fewer").optional(),
  info: z.string().max(70, "Info must be 70 characters or fewer").optional(),
});
export type EPCData = z.infer<typeof epcSchema>;

export const pixSchema = z.object({
  pixKey: z.string().min(1, "Pix key is required"),
  name: z.string().min(1, "Merchant name is required").max(25, "Name must be 25 characters or fewer"),
  city: z.string().min(1, "City is required").max(15, "City must be 15 characters or fewer"),
  amount: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
      "Amount must be a valid number with up to 2 decimal places"
    ),
  description: z.string().max(25, "Description must be 25 characters or fewer").optional(),
});
export type PixData = z.infer<typeof pixSchema>;

export const bitcoinSchema = z.object({
  address: z
    .string()
    .min(1, "Bitcoin address is required")
    .regex(
      /^(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{14,74})$/,
      "Must be a valid Bitcoin address (starts with 1, 3, or bc1)"
    ),
  amount: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d{1,8})?$/.test(val),
      "Amount must be a valid BTC value (up to 8 decimal places)"
    ),
  label: z.string().optional(),
  message: z.string().optional(),
});
export type BitcoinData = z.infer<typeof bitcoinSchema>;

export const ethereumSchema = z.object({
  address: z
    .string()
    .min(1, "Ethereum address is required")
    .regex(
      /^0x[a-fA-F0-9]{40}$/,
      "Must be a valid Ethereum address (0x followed by 40 hex characters)"
    ),
  amount: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d{1,18})?$/.test(val),
      "Amount must be a valid ETH value"
    ),
});
export type EthereumData = z.infer<typeof ethereumSchema>;

export const paypalSchema = z.object({
  username: z.string().min(1, "PayPal.me username is required"),
  amount: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
      "Amount must be a valid number with up to 2 decimal places"
    ),
  currency: z.string().optional(),
});
export type PayPalData = z.infer<typeof paypalSchema>;

export const eventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format"),
  startTime: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{2}:\d{2}$/.test(val),
      "Must be in HH:MM format"
    ),
  endDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
      "Must be in YYYY-MM-DD format"
    ),
  endTime: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{2}:\d{2}$/.test(val),
      "Must be in HH:MM format"
    ),
  location: z.string().optional(),
  description: z.string().optional(),
  allDay: z.boolean(),
});
export type EventData = z.infer<typeof eventSchema>;

export const geoSchema = z.object({
  latitude: z
    .string()
    .min(1, "Latitude is required")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= -90 && num <= 90;
      },
      "Latitude must be between -90 and 90"
    ),
  longitude: z
    .string()
    .min(1, "Longitude is required")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= -180 && num <= 180;
      },
      "Longitude must be between -180 and 180"
    ),
});
export type GeoData = z.infer<typeof geoSchema>;

export const googleMapsSchema = z.object({
  latitude: z
    .string()
    .min(1, "Latitude is required")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= -90 && num <= 90;
      },
      "Latitude must be between -90 and 90"
    ),
  longitude: z
    .string()
    .min(1, "Longitude is required")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= -180 && num <= 180;
      },
      "Longitude must be between -180 and 180"
    ),
});
export type GoogleMapsData = z.infer<typeof googleMapsSchema>;

export const appStoreSchema = z.object({
  url: z.string().url("Must be a valid URL"),
});
export type AppStoreData = z.infer<typeof appStoreSchema>;

// ---------------------------------------------------------------------------
// Schema lookup map – keyed by QRType for runtime access
// ---------------------------------------------------------------------------

export const QR_SCHEMAS = {
  url: urlSchema,
  text: textSchema,
  wifi: wifiSchema,
  email: emailSchema,
  phone: phoneSchema,
  sms: smsSchema,
  vcard: vcardSchema,
  mecard: mecardSchema,
  social: socialSchema,
  upi: upiSchema,
  epc: epcSchema,
  pix: pixSchema,
  bitcoin: bitcoinSchema,
  ethereum: ethereumSchema,
  paypal: paypalSchema,
  event: eventSchema,
  geo: geoSchema,
  "google-maps": googleMapsSchema,
  "app-store": appStoreSchema,
} as const satisfies Record<QRType, z.ZodType>;

// ---------------------------------------------------------------------------
// Convenience: inferred data union
// ---------------------------------------------------------------------------

export type QRDataMap = {
  url: URLData;
  text: TextData;
  wifi: WiFiData;
  email: EmailData;
  phone: PhoneData;
  sms: SMSData;
  vcard: VCardData;
  mecard: MeCardData;
  social: SocialData;
  upi: UPIData;
  epc: EPCData;
  pix: PixData;
  bitcoin: BitcoinData;
  ethereum: EthereumData;
  paypal: PayPalData;
  event: EventData;
  geo: GeoData;
  "google-maps": GoogleMapsData;
  "app-store": AppStoreData;
};
