import { NextResponse } from "next/server";
import { getPremiumStatus } from "@/lib/payments/premium";

/**
 * GET /api/premium/status
 *
 * Returns the current premium status from the encrypted cookie.
 * Used by client components to check if premium features should be unlocked.
 */
export async function GET() {
  const status = await getPremiumStatus();
  return NextResponse.json({
    isPremium: status !== null,
    provider: status?.provider ?? null,
  });
}
