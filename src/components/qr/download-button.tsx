"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Crown } from "lucide-react";
import { FREE_DAILY_DOWNLOAD_LIMIT, FREE_DOWNLOAD_SIZE } from "@/lib/constants";
import type QRCodeStyling from "qr-code-styling";
import Link from "next/link";

interface DownloadButtonProps {
  qrData: string;
  disabled?: boolean;
  isPremium?: boolean;
}

interface DownloadTracker {
  date: string;
  count: number;
}

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function getDownloadTracker(): DownloadTracker {
  try {
    const raw = localStorage.getItem("quickqr_downloads");
    if (raw) {
      const parsed: DownloadTracker = JSON.parse(raw);
      if (parsed.date === getTodayString()) {
        return parsed;
      }
    }
  } catch {
    // Corrupted or missing localStorage, start fresh
  }
  return { date: getTodayString(), count: 0 };
}

function incrementDownloadCount(): DownloadTracker {
  const tracker = getDownloadTracker();
  tracker.count += 1;
  localStorage.setItem("quickqr_downloads", JSON.stringify(tracker));
  return tracker;
}

export function DownloadButton({ qrData, disabled, isPremium }: DownloadButtonProps) {
  const [tracker, setTracker] = useState<DownloadTracker>({
    date: getTodayString(),
    count: 0,
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);
  const [QRCodeStylingClass, setQRCodeStylingClass] = useState<
    typeof QRCodeStyling | null
  >(null);

  // Load download tracker from localStorage on mount
  useEffect(() => {
    setTracker(getDownloadTracker());
  }, []);

  // Dynamically import qr-code-styling
  useEffect(() => {
    let cancelled = false;
    import("qr-code-styling").then((mod) => {
      if (!cancelled) {
        setQRCodeStylingClass(() => mod.default);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const remaining = Math.max(0, FREE_DAILY_DOWNLOAD_LIMIT - tracker.count);
  const isLimitReached = !isPremium && remaining <= 0;

  const handleDownload = useCallback(async () => {
    if (!QRCodeStylingClass || !qrData || isLimitReached || isDownloading) return;

    setIsDownloading(true);

    try {
      // Create a fresh QR code instance for download
      const qrCode = new QRCodeStylingClass({
        width: FREE_DOWNLOAD_SIZE,
        height: FREE_DOWNLOAD_SIZE,
        data: qrData,
        dotsOptions: { type: "square", color: "#000000" },
        backgroundOptions: { color: "#ffffff" },
        imageOptions: { crossOrigin: "anonymous", margin: 6 },
        ...(isPremium ? {} : { image: "/branding.svg" }),
      });
      qrInstanceRef.current = qrCode;

      // Get the QR code as a blob (in the browser this is always a Blob)
      const rawData = await qrCode.getRawData("png");
      if (!rawData) {
        setIsDownloading(false);
        return;
      }

      // In browser context, getRawData returns a Blob. Cast for TypeScript.
      const blob = rawData as Blob;

      // Create an image from the QR blob
      const qrImageUrl = URL.createObjectURL(blob);
      const qrImage = new Image();

      await new Promise<void>((resolve, reject) => {
        qrImage.onload = () => resolve();
        qrImage.onerror = () => reject(new Error("Failed to load QR image"));
        qrImage.src = qrImageUrl;
      });

      let finalBlob: Blob | null;

      if (isPremium) {
        // Premium: no watermark, use QR blob directly
        finalBlob = blob;
        URL.revokeObjectURL(qrImageUrl);
      } else {
        // Free: add watermark text below QR code
        const watermarkHeight = 28;
        const canvas = document.createElement("canvas");
        canvas.width = FREE_DOWNLOAD_SIZE;
        canvas.height = FREE_DOWNLOAD_SIZE + watermarkHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(qrImageUrl);
          setIsDownloading(false);
          return;
        }

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(qrImage, 0, 0, FREE_DOWNLOAD_SIZE, FREE_DOWNLOAD_SIZE);

        ctx.fillStyle = "#9ca3af";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          "https://quickqrcode.app",
          FREE_DOWNLOAD_SIZE / 2,
          FREE_DOWNLOAD_SIZE + watermarkHeight / 2
        );

        finalBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), "image/png");
        });

        URL.revokeObjectURL(qrImageUrl);
      }

      if (!finalBlob) {
        setIsDownloading(false);
        return;
      }

      const downloadUrl = URL.createObjectURL(finalBlob);
      const timestamp = Date.now();
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = `quickqr-qrcode-${timestamp}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(downloadUrl);

      // Update download count
      const updated = incrementDownloadCount();
      setTracker({ ...updated });
    } catch {
      // Download failed silently; user can retry
    } finally {
      setIsDownloading(false);
    }
  }, [QRCodeStylingClass, qrData, isLimitReached, isDownloading]);

  if (isLimitReached) {
    return (
      <div className="flex flex-col items-center gap-2 w-full mt-4">
        <Button asChild className="w-full" variant="secondary">
          <Link href="/pricing" aria-label="Upgrade to premium for unlimited downloads">
            <Crown className="size-4" aria-hidden="true" />
            <span>Upgrade for unlimited downloads</span>
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          Daily free download limit reached ({FREE_DAILY_DOWNLOAD_LIMIT}/{FREE_DAILY_DOWNLOAD_LIMIT})
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full mt-4">
      <Button
        onClick={handleDownload}
        disabled={disabled || !qrData || isDownloading}
        className="w-full"
        aria-label={
          isDownloading
            ? "Downloading QR code"
            : isPremium
              ? "Download QR code as PNG"
              : `Download QR code as PNG. ${remaining} of ${FREE_DAILY_DOWNLOAD_LIMIT} downloads remaining today`
        }
      >
        <Download className="size-4" aria-hidden="true" />
        <span>{isDownloading ? "Downloading..." : "Download PNG"}</span>
      </Button>
      {!isPremium && (
        <p className="text-xs text-muted-foreground">
          {remaining}/{FREE_DAILY_DOWNLOAD_LIMIT} downloads remaining today
        </p>
      )}
    </div>
  );
}
