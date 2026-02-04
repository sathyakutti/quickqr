"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { upiSchema } from "@/lib/qr/types";

interface UpiFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function UpiForm({ onChange }: UpiFormProps) {
  const [formData, setFormData] = useState({
    vpa: "",
    name: "",
    amount: "",
    currency: "INR",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, data: typeof formData) => {
      const result = upiSchema.safeParse(data);
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
        <Label htmlFor="upi-vpa">
          VPA (UPI ID) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="upi-vpa"
          type="text"
          placeholder="username@bank"
          value={formData.vpa}
          onChange={(e) => updateField("vpa", e.target.value)}
          onBlur={() => handleBlur("vpa")}
          aria-required="true"
          aria-invalid={touched.vpa && !!errors.vpa}
          aria-describedby={errors.vpa ? "upi-vpa-error" : "upi-vpa-hint"}
        />
        {touched.vpa && errors.vpa ? (
          <p id="upi-vpa-error" className="text-sm text-destructive" role="alert">
            {errors.vpa}
          </p>
        ) : (
          <p id="upi-vpa-hint" className="text-sm text-muted-foreground">
            Your UPI ID with @suffix (e.g. name@upi, name@paytm)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="upi-name">
          Payee Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="upi-name"
          type="text"
          placeholder="Merchant or person name"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          aria-required="true"
          aria-invalid={touched.name && !!errors.name}
          aria-describedby={errors.name ? "upi-name-error" : undefined}
        />
        {touched.name && errors.name && (
          <p id="upi-name-error" className="text-sm text-destructive" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="upi-amount">Amount (INR)</Label>
        <Input
          id="upi-amount"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => updateField("amount", e.target.value)}
          onBlur={() => handleBlur("amount")}
          aria-describedby={errors.amount ? "upi-amount-error" : undefined}
        />
        {touched.amount && errors.amount && (
          <p id="upi-amount-error" className="text-sm text-destructive" role="alert">
            {errors.amount}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="upi-note">Note</Label>
        <Input
          id="upi-note"
          type="text"
          placeholder="Payment for..."
          value={formData.note}
          onChange={(e) => updateField("note", e.target.value)}
          onBlur={() => handleBlur("note")}
          aria-describedby={errors.note ? "upi-note-error" : undefined}
        />
        {touched.note && errors.note && (
          <p id="upi-note-error" className="text-sm text-destructive" role="alert">
            {errors.note}
          </p>
        )}
      </div>
    </div>
  );
}
