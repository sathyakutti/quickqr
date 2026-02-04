import {
  type LucideIcon,
  Globe,
  Type,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  Contact,
  CreditCard,
  Calendar,
  MapPin,
  Smartphone,
  Link,
  Bitcoin,
  Banknote,
  QrCode,
  Share2,
  IndianRupee,
  Euro,
  Wallet,
  Navigation,
  Store,
} from "lucide-react";
import type { QRType, QRCategory } from "./types";

// ---------------------------------------------------------------------------
// Per-type configuration
// ---------------------------------------------------------------------------

export interface QRTypeConfig {
  id: QRType;
  label: string;
  icon: LucideIcon;
  description: string;
}

// ---------------------------------------------------------------------------
// Category configuration (with nested types)
// ---------------------------------------------------------------------------

export interface QRCategoryConfig {
  id: QRCategory;
  label: string;
  icon: LucideIcon;
  types: QRTypeConfig[];
}

// ---------------------------------------------------------------------------
// Category & type definitions
// ---------------------------------------------------------------------------

export const QR_CATEGORIES: QRCategoryConfig[] = [
  {
    id: "basic",
    label: "Basic",
    icon: QrCode,
    types: [
      {
        id: "url",
        label: "URL",
        icon: Globe,
        description: "Encode a website link into a QR code",
      },
      {
        id: "text",
        label: "Text",
        icon: Type,
        description: "Encode plain text into a QR code",
      },
      {
        id: "wifi",
        label: "WiFi",
        icon: Wifi,
        description: "Share WiFi credentials via QR code",
      },
      {
        id: "email",
        label: "Email",
        icon: Mail,
        description: "Pre-compose an email with recipient, subject, and body",
      },
      {
        id: "phone",
        label: "Phone",
        icon: Phone,
        description: "Dial a phone number when scanned",
      },
      {
        id: "sms",
        label: "SMS",
        icon: MessageSquare,
        description: "Pre-compose an SMS message to a phone number",
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    icon: Contact,
    types: [
      {
        id: "vcard",
        label: "vCard",
        icon: Contact,
        description: "Share a full contact card (vCard 3.0 format)",
      },
      {
        id: "mecard",
        label: "MeCard",
        icon: Contact,
        description: "Share a contact using the compact MeCard format",
      },
    ],
  },
  {
    id: "social",
    label: "Social",
    icon: Share2,
    types: [
      {
        id: "social",
        label: "Social Link",
        icon: Link,
        description: "Share a social media profile link",
      },
    ],
  },
  {
    id: "payment",
    label: "Payment",
    icon: CreditCard,
    types: [
      {
        id: "upi",
        label: "UPI",
        icon: IndianRupee,
        description: "Generate a UPI payment QR code (India)",
      },
      {
        id: "epc",
        label: "EPC / SEPA",
        icon: Euro,
        description: "Generate an EPC QR code for SEPA credit transfers (EU)",
      },
      {
        id: "pix",
        label: "Pix",
        icon: Banknote,
        description: "Generate a Pix payment QR code (Brazil)",
      },
      {
        id: "bitcoin",
        label: "Bitcoin",
        icon: Bitcoin,
        description: "Generate a Bitcoin payment request (BIP21)",
      },
      {
        id: "ethereum",
        label: "Ethereum",
        icon: Wallet,
        description: "Generate an Ethereum payment request",
      },
      {
        id: "paypal",
        label: "PayPal",
        icon: CreditCard,
        description: "Generate a PayPal.me payment link",
      },
    ],
  },
  {
    id: "event",
    label: "Event",
    icon: Calendar,
    types: [
      {
        id: "event",
        label: "Calendar Event",
        icon: Calendar,
        description: "Create a calendar event (iCal / vEvent format)",
      },
    ],
  },
  {
    id: "location",
    label: "Location",
    icon: MapPin,
    types: [
      {
        id: "geo",
        label: "Geo Location",
        icon: Navigation,
        description: "Encode GPS coordinates using the geo: URI scheme",
      },
      {
        id: "google-maps",
        label: "Google Maps",
        icon: MapPin,
        description: "Link to a location on Google Maps",
      },
    ],
  },
  {
    id: "app",
    label: "App",
    icon: Smartphone,
    types: [
      {
        id: "app-store",
        label: "App Store",
        icon: Store,
        description: "Link to an app on any app store",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Pre-built lookup maps (computed once at module load)
// ---------------------------------------------------------------------------

const typeToCategory = new Map<QRType, QRCategory>();
const typeConfigMap = new Map<QRType, QRTypeConfig>();
const categoryConfigMap = new Map<QRCategory, QRCategoryConfig>();

for (const category of QR_CATEGORIES) {
  categoryConfigMap.set(category.id, category);
  for (const typeConfig of category.types) {
    typeToCategory.set(typeConfig.id, category.id);
    typeConfigMap.set(typeConfig.id, typeConfig);
  }
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Returns the category ID that a given QR type belongs to.
 */
export function getCategoryForType(type: QRType): QRCategory {
  const category = typeToCategory.get(type);
  if (!category) {
    throw new Error(`Unknown QR type: ${type}`);
  }
  return category;
}

/**
 * Returns the full type configuration for a given QR type.
 */
export function getTypeConfig(type: QRType): QRTypeConfig {
  const config = typeConfigMap.get(type);
  if (!config) {
    throw new Error(`Unknown QR type: ${type}`);
  }
  return config;
}

/**
 * Returns the full category configuration (including nested types) for a given
 * category ID.
 */
export function getCategoryConfig(category: QRCategory): QRCategoryConfig {
  const config = categoryConfigMap.get(category);
  if (!config) {
    throw new Error(`Unknown QR category: ${category}`);
  }
  return config;
}
