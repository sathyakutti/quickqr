"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type QRCodeStyling from "qr-code-styling";
import type { DotType, CornerDotType, CornerSquareType, Options } from "qr-code-styling";

const FREE_BRANDING_IMAGE = "/branding.svg";

interface QRPreviewProps {
  data: string;
  size?: number;
  isPremium?: boolean;
  fgColor?: string;
  bgColor?: string;
  logoUrl?: string;
  dotStyle?: DotType;
  cornerSquareStyle?: CornerSquareType;
  cornerDotStyle?: CornerDotType;
}

export function QRPreview({
  data,
  size = 300,
  isPremium = false,
  fgColor = "#000000",
  bgColor = "#ffffff",
  logoUrl,
  dotStyle = "square",
  cornerSquareStyle = "square",
  cornerDotStyle = "square",
}: QRPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const [QRCodeStylingClass, setQRCodeStylingClass] = useState<
    typeof QRCodeStyling | null
  >(null);

  // Dynamically import qr-code-styling (browser-only library)
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

  // Determine which image to embed in the QR center
  const centerImage = isPremium ? logoUrl || undefined : FREE_BRANDING_IMAGE;

  // Create or update the QR code instance
  useEffect(() => {
    if (!QRCodeStylingClass || !containerRef.current) return;

    const options: Partial<Options> = {
      width: size,
      height: size,
      data: data || undefined,
      dotsOptions: {
        type: dotStyle,
        color: fgColor,
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        type: cornerSquareStyle,
      },
      cornersDotOptions: {
        type: cornerDotStyle,
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 6,
      },
      image: centerImage,
    };

    if (qrRef.current) {
      qrRef.current.update(options);
    } else {
      const qrCode = new QRCodeStylingClass(options);
      qrRef.current = qrCode;
      containerRef.current.innerHTML = "";
      qrCode.append(containerRef.current);
    }
  }, [
    QRCodeStylingClass,
    data,
    size,
    centerImage,
    fgColor,
    bgColor,
    dotStyle,
    cornerSquareStyle,
    cornerDotStyle,
  ]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      qrRef.current = null;
    };
  }, []);

  return (
    <Card className="bg-card border border-border rounded-lg">
      <CardContent className="flex flex-col items-center gap-3 p-6">
        {data ? (
          <div
            ref={containerRef}
            aria-label="Generated QR code preview"
            role="img"
            className="w-full max-w-[300px] aspect-square [&>canvas]:!w-full [&>canvas]:!h-full [&>svg]:!w-full [&>svg]:!h-full"
          />
        ) : (
          <div
            ref={containerRef}
            className="flex items-center justify-center text-muted-foreground text-sm w-full max-w-[300px] aspect-square"
            aria-label="QR code preview placeholder"
            role="img"
          >
            Enter data to generate QR code
          </div>
        )}
        <p className="text-sm text-muted-foreground">Preview</p>
      </CardContent>
    </Card>
  );
}
