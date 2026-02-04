"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { phoneSchema } from "@/lib/qr/types";

interface PhoneFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function PhoneForm({ onChange }: PhoneFormProps) {
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, value: string) => {
      const data = { phone: field === "phone" ? value : phone };
      const result = phoneSchema.safeParse(data);
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
    [phone]
  );

  const handleChange = useCallback(
    (value: string) => {
      setPhone(value);
      onChange({ phone: value });
    },
    [onChange]
  );

  const handleBlur = useCallback(
    (field: string, value: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validate(field, value);
    },
    [validate]
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone-input">
          Phone Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="phone-input"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={phone}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => handleBlur("phone", phone)}
          aria-required="true"
          aria-invalid={touched.phone && !!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
        />
        {touched.phone && errors.phone ? (
          <p id="phone-error" className="text-sm text-destructive" role="alert">
            {errors.phone}
          </p>
        ) : (
          <p id="phone-hint" className="text-sm text-muted-foreground">
            Include the country code with + prefix (e.g. +1 for US)
          </p>
        )}
      </div>
    </div>
  );
}
