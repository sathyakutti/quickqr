"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bitcoinSchema } from "@/lib/qr/types";

interface BitcoinFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function BitcoinForm({ onChange }: BitcoinFormProps) {
  const [formData, setFormData] = useState({
    address: "",
    amount: "",
    label: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, data: typeof formData) => {
      const result = bitcoinSchema.safeParse(data);
      if (!result.success) {
        const fieldError = result.error.issues.find((i) => i.path[0] === field);
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [field]: fieldError.message }));
        } else {
          setErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
          });
        }
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    []
  );

  const updateField = useCallback(
    (field: string, value: string) => {
      const next = { ...formData, [field]: value };
      setFormData(next);
      onChange(next);
    },
    [formData, onChange]
  );

  const handleBlur = useCallback(
    (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validate(field, formData);
    },
    [formData, validate]
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="btc-address">
          Bitcoin Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="btc-address"
          type="text"
          placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
          value={formData.address}
          onChange={(e) => updateField("address", e.target.value)}
          onBlur={() => handleBlur("address")}
          aria-required="true"
          aria-invalid={touched.address && !!errors.address}
          aria-describedby={errors.address ? "btc-address-error" : "btc-address-hint"}
        />
        {touched.address && errors.address ? (
          <p id="btc-address-error" className="text-sm text-destructive" role="alert">
            {errors.address}
          </p>
        ) : (
          <p id="btc-address-hint" className="text-sm text-muted-foreground">
            Starts with 1, 3, or bc1
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="btc-amount">Amount (BTC)</Label>
        <Input
          id="btc-amount"
          type="text"
          inputMode="decimal"
          placeholder="0.00000000"
          value={formData.amount}
          onChange={(e) => updateField("amount", e.target.value)}
          onBlur={() => handleBlur("amount")}
          aria-describedby={errors.amount ? "btc-amount-error" : "btc-amount-hint"}
        />
        {touched.amount && errors.amount ? (
          <p id="btc-amount-error" className="text-sm text-destructive" role="alert">
            {errors.amount}
          </p>
        ) : (
          <p id="btc-amount-hint" className="text-sm text-muted-foreground">
            Up to 8 decimal places
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="btc-label">Label</Label>
        <Input
          id="btc-label"
          type="text"
          placeholder="Payment label"
          value={formData.label}
          onChange={(e) => updateField("label", e.target.value)}
          onBlur={() => handleBlur("label")}
          aria-describedby={errors.label ? "btc-label-error" : undefined}
        />
        {touched.label && errors.label && (
          <p id="btc-label-error" className="text-sm text-destructive" role="alert">
            {errors.label}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="btc-message">Message</Label>
        <Input
          id="btc-message"
          type="text"
          placeholder="Payment message"
          value={formData.message}
          onChange={(e) => updateField("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          aria-describedby={errors.message ? "btc-message-error" : undefined}
        />
        {touched.message && errors.message && (
          <p id="btc-message-error" className="text-sm text-destructive" role="alert">
            {errors.message}
          </p>
        )}
      </div>
    </div>
  );
}
