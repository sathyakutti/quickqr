"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { epcSchema } from "@/lib/qr/types";

interface SepaFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function SepaForm({ onChange }: SepaFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    iban: "",
    bic: "",
    amount: "",
    currency: "EUR",
    reference: "",
    info: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, data: typeof formData) => {
      const result = epcSchema.safeParse(data);
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
        <Label htmlFor="sepa-name">
          Beneficiary Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="sepa-name"
          type="text"
          placeholder="Max Mustermann"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          maxLength={70}
          aria-required="true"
          aria-invalid={touched.name && !!errors.name}
          aria-describedby={errors.name ? "sepa-name-error" : undefined}
        />
        {touched.name && errors.name && (
          <p id="sepa-name-error" className="text-sm text-destructive" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sepa-iban">
          IBAN <span className="text-destructive">*</span>
        </Label>
        <Input
          id="sepa-iban"
          type="text"
          placeholder="DE89370400440532013000"
          value={formData.iban}
          onChange={(e) => updateField("iban", e.target.value.toUpperCase())}
          onBlur={() => handleBlur("iban")}
          aria-required="true"
          aria-invalid={touched.iban && !!errors.iban}
          aria-describedby={errors.iban ? "sepa-iban-error" : undefined}
        />
        {touched.iban && errors.iban && (
          <p id="sepa-iban-error" className="text-sm text-destructive" role="alert">
            {errors.iban}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sepa-bic">BIC / SWIFT Code</Label>
        <Input
          id="sepa-bic"
          type="text"
          placeholder="COBADEFFXXX"
          value={formData.bic}
          onChange={(e) => updateField("bic", e.target.value.toUpperCase())}
          onBlur={() => handleBlur("bic")}
          aria-describedby={errors.bic ? "sepa-bic-error" : undefined}
        />
        {touched.bic && errors.bic && (
          <p id="sepa-bic-error" className="text-sm text-destructive" role="alert">
            {errors.bic}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sepa-amount">Amount (EUR)</Label>
        <Input
          id="sepa-amount"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => updateField("amount", e.target.value)}
          onBlur={() => handleBlur("amount")}
          aria-describedby={errors.amount ? "sepa-amount-error" : "sepa-amount-hint"}
        />
        {touched.amount && errors.amount ? (
          <p id="sepa-amount-error" className="text-sm text-destructive" role="alert">
            {errors.amount}
          </p>
        ) : (
          <p id="sepa-amount-hint" className="text-sm text-muted-foreground">
            Between 0.01 and 999,999,999.99 EUR
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sepa-reference">Reference</Label>
        <Input
          id="sepa-reference"
          type="text"
          placeholder="Invoice 12345"
          value={formData.reference}
          onChange={(e) => updateField("reference", e.target.value)}
          onBlur={() => handleBlur("reference")}
          maxLength={35}
          aria-describedby={errors.reference ? "sepa-reference-error" : undefined}
        />
        {touched.reference && errors.reference && (
          <p id="sepa-reference-error" className="text-sm text-destructive" role="alert">
            {errors.reference}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sepa-info">Information</Label>
        <Input
          id="sepa-info"
          type="text"
          placeholder="Additional payment information"
          value={formData.info}
          onChange={(e) => updateField("info", e.target.value)}
          onBlur={() => handleBlur("info")}
          maxLength={70}
          aria-describedby={errors.info ? "sepa-info-error" : undefined}
        />
        {touched.info && errors.info && (
          <p id="sepa-info-error" className="text-sm text-destructive" role="alert">
            {errors.info}
          </p>
        )}
      </div>
    </div>
  );
}
