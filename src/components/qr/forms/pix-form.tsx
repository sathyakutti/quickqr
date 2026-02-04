"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pixSchema } from "@/lib/qr/types";

interface PixFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function PixForm({ onChange }: PixFormProps) {
  const [formData, setFormData] = useState({
    pixKey: "",
    name: "",
    city: "",
    amount: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, data: typeof formData) => {
      const result = pixSchema.safeParse(data);
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
        <Label htmlFor="pix-key">
          Pix Key <span className="text-destructive">*</span>
        </Label>
        <Input
          id="pix-key"
          type="text"
          placeholder="CPF, CNPJ, email, phone, or UUID"
          value={formData.pixKey}
          onChange={(e) => updateField("pixKey", e.target.value)}
          onBlur={() => handleBlur("pixKey")}
          aria-required="true"
          aria-invalid={touched.pixKey && !!errors.pixKey}
          aria-describedby={errors.pixKey ? "pix-key-error" : "pix-key-hint"}
        />
        {touched.pixKey && errors.pixKey ? (
          <p id="pix-key-error" className="text-sm text-destructive" role="alert">
            {errors.pixKey}
          </p>
        ) : (
          <p id="pix-key-hint" className="text-sm text-muted-foreground">
            Accepts CPF, CNPJ, email, phone number, or random key (UUID)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="pix-name">
          Receiver Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="pix-name"
          type="text"
          placeholder="Merchant name"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          maxLength={25}
          aria-required="true"
          aria-invalid={touched.name && !!errors.name}
          aria-describedby={errors.name ? "pix-name-error" : undefined}
        />
        {touched.name && errors.name && (
          <p id="pix-name-error" className="text-sm text-destructive" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="pix-city">
          City <span className="text-destructive">*</span>
        </Label>
        <Input
          id="pix-city"
          type="text"
          placeholder="Sao Paulo"
          value={formData.city}
          onChange={(e) => updateField("city", e.target.value)}
          onBlur={() => handleBlur("city")}
          maxLength={15}
          aria-required="true"
          aria-invalid={touched.city && !!errors.city}
          aria-describedby={errors.city ? "pix-city-error" : undefined}
        />
        {touched.city && errors.city && (
          <p id="pix-city-error" className="text-sm text-destructive" role="alert">
            {errors.city}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="pix-amount">Amount (BRL)</Label>
        <Input
          id="pix-amount"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => updateField("amount", e.target.value)}
          onBlur={() => handleBlur("amount")}
          aria-describedby={errors.amount ? "pix-amount-error" : undefined}
        />
        {touched.amount && errors.amount && (
          <p id="pix-amount-error" className="text-sm text-destructive" role="alert">
            {errors.amount}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="pix-description">Description</Label>
        <Input
          id="pix-description"
          type="text"
          placeholder="Payment description"
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          onBlur={() => handleBlur("description")}
          maxLength={25}
          aria-describedby={errors.description ? "pix-description-error" : undefined}
        />
        {touched.description && errors.description && (
          <p id="pix-description-error" className="text-sm text-destructive" role="alert">
            {errors.description}
          </p>
        )}
      </div>
    </div>
  );
}
