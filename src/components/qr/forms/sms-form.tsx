"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { smsSchema } from "@/lib/qr/types";

interface SmsFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function SmsForm({ onChange }: SmsFormProps) {
  const [formData, setFormData] = useState({
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, data: typeof formData) => {
      const result = smsSchema.safeParse(data);
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
        <Label htmlFor="sms-phone">
          Phone Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="sms-phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
          aria-required="true"
          aria-invalid={touched.phone && !!errors.phone}
          aria-describedby={errors.phone ? "sms-phone-error" : undefined}
        />
        {touched.phone && errors.phone && (
          <p id="sms-phone-error" className="text-sm text-destructive" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sms-message">Message</Label>
        <Textarea
          id="sms-message"
          placeholder="Enter your message"
          value={formData.message}
          onChange={(e) => updateField("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          rows={4}
          aria-describedby={errors.message ? "sms-message-error" : undefined}
        />
        {touched.message && errors.message && (
          <p id="sms-message-error" className="text-sm text-destructive" role="alert">
            {errors.message}
          </p>
        )}
      </div>
    </div>
  );
}
