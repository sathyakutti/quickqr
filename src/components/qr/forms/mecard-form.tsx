"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mecardSchema } from "@/lib/qr/types";

interface MecardFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function MecardForm({ onChange }: MecardFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    url: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, data: typeof formData) => {
      const result = mecardSchema.safeParse(data);
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
        <Label htmlFor="mecard-name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="mecard-name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          aria-required="true"
          aria-invalid={touched.name && !!errors.name}
          aria-describedby={errors.name ? "mecard-name-error" : undefined}
        />
        {touched.name && errors.name && (
          <p id="mecard-name-error" className="text-sm text-destructive" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mecard-phone">Phone</Label>
        <Input
          id="mecard-phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
          aria-describedby={errors.phone ? "mecard-phone-error" : undefined}
        />
        {touched.phone && errors.phone && (
          <p id="mecard-phone-error" className="text-sm text-destructive" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mecard-email">Email</Label>
        <Input
          id="mecard-email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          aria-describedby={errors.email ? "mecard-email-error" : undefined}
        />
        {touched.email && errors.email && (
          <p id="mecard-email-error" className="text-sm text-destructive" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mecard-url">URL</Label>
        <Input
          id="mecard-url"
          type="url"
          placeholder="https://example.com"
          value={formData.url}
          onChange={(e) => updateField("url", e.target.value)}
          onBlur={() => handleBlur("url")}
          aria-describedby={errors.url ? "mecard-url-error" : undefined}
        />
        {touched.url && errors.url && (
          <p id="mecard-url-error" className="text-sm text-destructive" role="alert">
            {errors.url}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mecard-address">Address</Label>
        <Input
          id="mecard-address"
          type="text"
          placeholder="123 Main St, San Francisco, CA"
          value={formData.address}
          onChange={(e) => updateField("address", e.target.value)}
          onBlur={() => handleBlur("address")}
          aria-describedby={errors.address ? "mecard-address-error" : undefined}
        />
        {touched.address && errors.address && (
          <p id="mecard-address-error" className="text-sm text-destructive" role="alert">
            {errors.address}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mecard-note">Note</Label>
        <Textarea
          id="mecard-note"
          placeholder="Additional notes"
          value={formData.note}
          onChange={(e) => updateField("note", e.target.value)}
          onBlur={() => handleBlur("note")}
          rows={3}
          aria-describedby={errors.note ? "mecard-note-error" : undefined}
        />
        {touched.note && errors.note && (
          <p id="mecard-note-error" className="text-sm text-destructive" role="alert">
            {errors.note}
          </p>
        )}
      </div>
    </div>
  );
}
