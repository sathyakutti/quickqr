export const SITE_NAME = "QuickQR";
export const SITE_DESCRIPTION =
  "Free QR code generator for URLs, WiFi, vCards, payments (UPI, SEPA, Pix, Bitcoin), events, locations, and more. No signup required.";
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://quickqr.app";

export const FREE_DAILY_DOWNLOAD_LIMIT = 10;
export const FREE_DOWNLOAD_SIZE = 300;
export const PREMIUM_DOWNLOAD_SIZES = [300, 1000, 2000] as const;

export const PRICING = {
  monthly: {
    usd: 4.99,
    inr: 399,
  },
  yearly: {
    usd: 39.99,
    inr: 2999,
  },
} as const;
