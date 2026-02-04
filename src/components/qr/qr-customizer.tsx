"use client";

import { useState, useCallback, useRef, useEffect, type ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Crown, Upload, X, Palette } from "lucide-react";
import Link from "next/link";
import type { DotType, CornerSquareType, CornerDotType } from "qr-code-styling";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface QRCustomization {
  fgColor: string;
  bgColor: string;
  logoUrl: string | null;
  dotStyle: DotType;
  cornerSquareStyle: CornerSquareType;
  cornerDotStyle: CornerDotType;
}

interface QRCustomizerProps {
  isPremium?: boolean;
  onChange: (customization: QRCustomization) => void;
}

// ---------------------------------------------------------------------------
// Option definitions
// ---------------------------------------------------------------------------

interface StyleOption<T extends string> {
  value: T;
  label: string;
}

const DOT_STYLE_OPTIONS: StyleOption<DotType>[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "dots", label: "Dots" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy Rounded" },
  { value: "extra-rounded", label: "Extra Rounded" },
];

const CORNER_SQUARE_OPTIONS: StyleOption<CornerSquareType>[] = [
  { value: "square", label: "Square" },
  { value: "extra-rounded", label: "Rounded" },
  { value: "dot", label: "Dot" },
];

const CORNER_DOT_OPTIONS: StyleOption<CornerDotType>[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Dot" },
];

// ---------------------------------------------------------------------------
// Default customization values
// ---------------------------------------------------------------------------

const DEFAULT_CUSTOMIZATION: QRCustomization = {
  fgColor: "#000000",
  bgColor: "#ffffff",
  logoUrl: null,
  dotStyle: "square",
  cornerSquareStyle: "square",
  cornerDotStyle: "square",
};

// ---------------------------------------------------------------------------
// Helper: StyleChip — used for dot / corner style selectors
// ---------------------------------------------------------------------------

function StyleChip<T extends string>({
  option,
  selected,
  onSelect,
  groupName,
}: {
  option: StyleOption<T>;
  selected: boolean;
  onSelect: (value: T) => void;
  groupName: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${groupName}: ${option.label}`}
      onClick={() => onSelect(option.value)}
      className={`
        inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium
        transition-colors cursor-pointer select-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ${
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
        }
      `}
    >
      {option.label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// ColorPickerField — color input + text hex input
// ---------------------------------------------------------------------------

function ColorPickerField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  // Keep a local text state so the user can type freely
  const [textValue, setTextValue] = useState(value);

  // Sync if parent value changes externally
  useEffect(() => {
    setTextValue(value);
  }, [value]);

  const handleTextInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value;
      // Ensure it starts with #
      if (!raw.startsWith("#")) {
        raw = "#" + raw.replace(/^#+/, "");
      }
      // Limit to 7 chars (#RRGGBB)
      raw = raw.slice(0, 7);
      setTextValue(raw);
      if (/^#[0-9a-fA-F]{6}$/.test(raw)) {
        onChange(raw);
      }
    },
    [onChange]
  );

  const handleColorInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const hex = e.target.value;
      onChange(hex);
      setTextValue(hex);
    },
    [onChange]
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={`${id}-text`}>{label}</Label>
      <div className="flex items-center gap-2">
        <label
          htmlFor={`${id}-picker`}
          className="sr-only"
        >
          {label} color picker
        </label>
        <input
          id={`${id}-picker`}
          type="color"
          value={value}
          onChange={handleColorInput}
          aria-label={`${label} color picker`}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
        />
        <Input
          id={`${id}-text`}
          type="text"
          value={textValue}
          onChange={handleTextInput}
          placeholder="#000000"
          maxLength={7}
          aria-label={`${label} hex value`}
          className="font-mono"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// QRCustomizer — main component
// ---------------------------------------------------------------------------

export function QRCustomizer({ isPremium = false, onChange }: QRCustomizerProps) {
  const [customization, setCustomization] = useState<QRCustomization>(DEFAULT_CUSTOMIZATION);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Emit onChange whenever customization changes
  const emitChange = useCallback(
    (next: QRCustomization) => {
      setCustomization(next);
      onChange(next);
    },
    [onChange]
  );

  // --- Color handlers ---

  const handleFgColorChange = useCallback(
    (hex: string) => {
      emitChange({ ...customization, fgColor: hex });
    },
    [customization, emitChange]
  );

  const handleBgColorChange = useCallback(
    (hex: string) => {
      emitChange({ ...customization, bgColor: hex });
    },
    [customization, emitChange]
  );

  // --- Logo handlers ---

  const handleLogoUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/png") && !file.type.startsWith("image/jpeg")) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setLogoPreview(dataUrl);
        emitChange({ ...customization, logoUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    },
    [customization, emitChange]
  );

  const handleLogoRemove = useCallback(() => {
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    emitChange({ ...customization, logoUrl: null });
  }, [customization, emitChange]);

  // --- Style handlers ---

  const handleDotStyleChange = useCallback(
    (value: DotType) => {
      emitChange({ ...customization, dotStyle: value });
    },
    [customization, emitChange]
  );

  const handleCornerSquareChange = useCallback(
    (value: CornerSquareType) => {
      emitChange({ ...customization, cornerSquareStyle: value });
    },
    [customization, emitChange]
  );

  const handleCornerDotChange = useCallback(
    (value: CornerDotType) => {
      emitChange({ ...customization, cornerDotStyle: value });
    },
    [customization, emitChange]
  );

  return (
    <div className="relative">
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="size-4" aria-hidden="true" />
            Customize QR Code
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* ---- Colors ---- */}
          <section aria-labelledby="customizer-colors-heading">
            <h3 id="customizer-colors-heading" className="text-sm font-medium text-muted-foreground mb-3">
              Colors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorPickerField
                id="qr-fg-color"
                label="Foreground"
                value={customization.fgColor}
                onChange={handleFgColorChange}
              />
              <ColorPickerField
                id="qr-bg-color"
                label="Background"
                value={customization.bgColor}
                onChange={handleBgColorChange}
              />
            </div>
          </section>

          <Separator />

          {/* ---- Logo upload ---- */}
          <section aria-labelledby="customizer-logo-heading">
            <h3 id="customizer-logo-heading" className="text-sm font-medium text-muted-foreground mb-3">
              Logo
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload logo image"
                >
                  <Upload className="size-4" aria-hidden="true" />
                  Upload Logo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleLogoUpload}
                  className="sr-only"
                  aria-label="Logo file input"
                  tabIndex={-1}
                />
                <span className="text-xs text-muted-foreground">PNG or JPG</span>
              </div>

              {logoPreview && (
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-md border border-border overflow-hidden bg-background">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoPreview}
                      alt="Uploaded logo preview"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleLogoRemove}
                    aria-label="Remove uploaded logo"
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>
              )}
            </div>
          </section>

          <Separator />

          {/* ---- Dot style ---- */}
          <section aria-labelledby="customizer-dot-style-heading">
            <h3 id="customizer-dot-style-heading" className="text-sm font-medium text-muted-foreground mb-3">
              Dot Style
            </h3>
            <div
              role="radiogroup"
              aria-labelledby="customizer-dot-style-heading"
              className="flex flex-wrap gap-2"
            >
              {DOT_STYLE_OPTIONS.map((option) => (
                <StyleChip
                  key={option.value}
                  option={option}
                  selected={customization.dotStyle === option.value}
                  onSelect={handleDotStyleChange}
                  groupName="Dot style"
                />
              ))}
            </div>
          </section>

          <Separator />

          {/* ---- Corner square style ---- */}
          <section aria-labelledby="customizer-corner-square-heading">
            <h3 id="customizer-corner-square-heading" className="text-sm font-medium text-muted-foreground mb-3">
              Corner Square Style
            </h3>
            <div
              role="radiogroup"
              aria-labelledby="customizer-corner-square-heading"
              className="flex flex-wrap gap-2"
            >
              {CORNER_SQUARE_OPTIONS.map((option) => (
                <StyleChip
                  key={option.value}
                  option={option}
                  selected={customization.cornerSquareStyle === option.value}
                  onSelect={handleCornerSquareChange}
                  groupName="Corner square style"
                />
              ))}
            </div>
          </section>

          <Separator />

          {/* ---- Corner dot style ---- */}
          <section aria-labelledby="customizer-corner-dot-heading">
            <h3 id="customizer-corner-dot-heading" className="text-sm font-medium text-muted-foreground mb-3">
              Corner Dot Style
            </h3>
            <div
              role="radiogroup"
              aria-labelledby="customizer-corner-dot-heading"
              className="flex flex-wrap gap-2"
            >
              {CORNER_DOT_OPTIONS.map((option) => (
                <StyleChip
                  key={option.value}
                  option={option}
                  selected={customization.cornerDotStyle === option.value}
                  onSelect={handleCornerDotChange}
                  groupName="Corner dot style"
                />
              ))}
            </div>
          </section>
        </CardContent>
      </Card>

      {/* ---- Premium lock overlay ---- */}
      {!isPremium && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl"
          aria-label="Premium feature locked"
        >
          {/* Blur backdrop */}
          <div className="absolute inset-0 rounded-xl bg-background/60 backdrop-blur-sm" />

          {/* CTA content */}
          <div className="relative z-20 flex flex-col items-center gap-3 text-center px-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Crown className="size-6 text-primary" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Customize your QR code style
            </p>
            <p className="text-xs text-muted-foreground max-w-[240px]">
              Colors, logos, dot styles, and corner styles are available on the Premium plan.
            </p>
            <Button asChild size="sm">
              <Link href="/pricing" aria-label="Upgrade to Premium to unlock QR customization">
                <Crown className="size-4" aria-hidden="true" />
                Upgrade to Premium
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
