"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emailSchema } from "@/lib/qr/types";

interface EmailFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function EmailForm({ onChange }: EmailFormProps) {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, data: typeof formData) => {
      const result = emailSchema.safeParse(data);
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
        <Label htmlFor="email-to">
          To <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email-to"
          type="email"
          placeholder="recipient@example.com"
          value={formData.to}
          onChange={(e) => updateField("to", e.target.value)}
          onBlur={() => handleBlur("to")}
          aria-required="true"
          aria-invalid={touched.to && !!errors.to}
          aria-describedby={errors.to ? "email-to-error" : undefined}
        />
        {touched.to && errors.to && (
          <p id="email-to-error" className="text-sm text-destructive" role="alert">
            {errors.to}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-subject">Subject</Label>
        <Input
          id="email-subject"
          type="text"
          placeholder="Email subject"
          value={formData.subject}
          onChange={(e) => updateField("subject", e.target.value)}
          onBlur={() => handleBlur("subject")}
          aria-describedby={errors.subject ? "email-subject-error" : undefined}
        />
        {touched.subject && errors.subject && (
          <p id="email-subject-error" className="text-sm text-destructive" role="alert">
            {errors.subject}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-body">Body</Label>
        <Textarea
          id="email-body"
          placeholder="Email body"
          value={formData.body}
          onChange={(e) => updateField("body", e.target.value)}
          onBlur={() => handleBlur("body")}
          rows={4}
          aria-describedby={errors.body ? "email-body-error" : undefined}
        />
        {touched.body && errors.body && (
          <p id="email-body-error" className="text-sm text-destructive" role="alert">
            {errors.body}
          </p>
        )}
      </div>
    </div>
  );
}
