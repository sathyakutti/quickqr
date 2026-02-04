"use client";

import { useState, useEffect, useCallback, useMemo, type ComponentType } from "react";
import { CategoryTabs } from "@/components/qr/category-tabs";
import { TypeSelector } from "@/components/qr/type-selector";
import { QRPreview } from "@/components/qr/qr-preview";
import { QRCustomizer, type QRCustomization } from "@/components/qr/qr-customizer";
import { DownloadButton } from "@/components/qr/download-button";
import { QR_CATEGORIES, getCategoryConfig } from "@/lib/qr/categories";
import { encodeQRData } from "@/lib/qr/formats";
import type { QRCategory, QRType } from "@/lib/qr/types";

import { UrlForm } from "@/components/qr/forms/url-form";
import { TextForm } from "@/components/qr/forms/text-form";
import { WifiForm } from "@/components/qr/forms/wifi-form";
import { EmailForm } from "@/components/qr/forms/email-form";
import { PhoneForm } from "@/components/qr/forms/phone-form";
import { SmsForm } from "@/components/qr/forms/sms-form";
import { VcardForm } from "@/components/qr/forms/vcard-form";
import { MecardForm } from "@/components/qr/forms/mecard-form";
import { SocialForm } from "@/components/qr/forms/social-form";
import { UpiForm } from "@/components/qr/forms/upi-form";
import { SepaForm } from "@/components/qr/forms/sepa-form";
import { PixForm } from "@/components/qr/forms/pix-form";
import { BitcoinForm } from "@/components/qr/forms/bitcoin-form";
import { EthereumForm } from "@/components/qr/forms/ethereum-form";
import { PaypalForm } from "@/components/qr/forms/paypal-form";
import { EventForm } from "@/components/qr/forms/event-form";
import { LocationForm } from "@/components/qr/forms/location-form";
import { GoogleMapsForm } from "@/components/qr/forms/google-maps-form";
import { AppStoreForm } from "@/components/qr/forms/app-store-form";

// ---------------------------------------------------------------------------
// Form component props type
// ---------------------------------------------------------------------------

interface FormComponentProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

// ---------------------------------------------------------------------------
// Map each QRType to its form component
// ---------------------------------------------------------------------------

const FORM_COMPONENTS: Record<QRType, ComponentType<FormComponentProps>> = {
  url: UrlForm,
  text: TextForm,
  wifi: WifiForm,
  email: EmailForm,
  phone: PhoneForm,
  sms: SmsForm,
  vcard: VcardForm,
  mecard: MecardForm,
  social: SocialForm,
  upi: UpiForm,
  epc: SepaForm,
  pix: PixForm,
  bitcoin: BitcoinForm,
  ethereum: EthereumForm,
  paypal: PaypalForm,
  event: EventForm,
  geo: LocationForm,
  "google-maps": GoogleMapsForm,
  "app-store": AppStoreForm,
};

// ---------------------------------------------------------------------------
// QR Generator props
// ---------------------------------------------------------------------------

interface QRGeneratorProps {
  defaultCategory?: QRCategory;
  defaultType?: QRType;
}

// ---------------------------------------------------------------------------
// QR Generator component
// ---------------------------------------------------------------------------

export function QRGenerator({ defaultCategory, defaultType }: QRGeneratorProps) {
  const initialCategory = defaultCategory ?? QR_CATEGORIES[0].id;
  const initialType =
    defaultType ?? getCategoryConfig(initialCategory).types[0].id;

  const [selectedCategory, setSelectedCategory] =
    useState<QRCategory>(initialCategory);
  const [selectedType, setSelectedType] = useState<QRType>(initialType);
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [qrString, setQrString] = useState("");
  const [customization, setCustomization] = useState<QRCustomization>({
    fgColor: "#000000",
    bgColor: "#ffffff",
    logoUrl: null,
    dotStyle: "square",
    cornerSquareStyle: "square",
    cornerDotStyle: "square",
  });

  // When category changes, auto-select first type in that category
  const handleCategoryChange = useCallback(
    (category: QRCategory) => {
      setSelectedCategory(category);
      const categoryConfig = getCategoryConfig(category);
      const firstType = categoryConfig.types[0].id;
      setSelectedType(firstType);
      setFormData({});
      setQrString("");
    },
    []
  );

  // When type changes, reset form data and clear QR string
  const handleTypeChange = useCallback((type: QRType) => {
    setSelectedType(type);
    setFormData({});
    setQrString("");
  }, []);

  // When form data changes, store it
  const handleFormChange = useCallback(
    (data: Record<string, string | boolean>) => {
      setFormData(data);
    },
    []
  );

  // When QR customization changes, store it
  const handleCustomizationChange = useCallback(
    (next: QRCustomization) => {
      setCustomization(next);
    },
    []
  );

  // Encode QR data when selectedType or formData changes
  useEffect(() => {
    // Check if formData has any non-empty values worth encoding
    const hasData = Object.values(formData).some((value) => {
      if (typeof value === "string") return value.trim().length > 0;
      if (typeof value === "boolean") return true;
      return false;
    });

    if (!hasData) {
      setQrString("");
      return;
    }

    try {
      const encoded = encodeQRData(selectedType, formData);
      setQrString(encoded);
    } catch {
      // Encoding failed (invalid data shape), keep previous qrString or clear it
      // Do not update qrString on encoding failure
    }
  }, [selectedType, formData]);

  // Get the correct form component for the current type
  const FormComponent = useMemo(
    () => FORM_COMPONENTS[selectedType],
    [selectedType]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 overflow-hidden">
      <div className="flex flex-col gap-6 min-w-0">
        <CategoryTabs
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <TypeSelector
          category={selectedCategory}
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
        />
        <div
          aria-live="polite"
          aria-atomic="true"
          className="min-h-0"
        >
          <FormComponent
            key={selectedType}
            onChange={handleFormChange}
          />
        </div>
        <QRCustomizer
          isPremium={false}
          onChange={handleCustomizationChange}
        />
      </div>
      <div className="lg:sticky lg:top-24 flex flex-col gap-0 self-start min-w-0">
        <QRPreview
          data={qrString}
          fgColor={customization.fgColor}
          bgColor={customization.bgColor}
          logoUrl={customization.logoUrl ?? undefined}
          dotStyle={customization.dotStyle}
          cornerSquareStyle={customization.cornerSquareStyle}
          cornerDotStyle={customization.cornerDotStyle}
        />
        <DownloadButton qrData={qrString} />
      </div>
    </div>
  );
}
