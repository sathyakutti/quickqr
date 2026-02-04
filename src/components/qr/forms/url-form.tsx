"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { urlSchema } from "@/lib/qr/types";

interface UrlFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function UrlForm({ onChange }: UrlFormProps) {
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, value: string) => {
      const data = { url: field === "url" ? value : url };
      const result = urlSchema.safeParse(data);
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
    [url]
  );

  const handleChange = useCallback(
    (value: string) => {
      setUrl(value);
      const data = { url: value };
      onChange(data);
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
        <Label htmlFor="url-input">
          URL <span className="text-destructive">*</span>
        </Label>
        <Input
          id="url-input"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => handleBlur("url", url)}
          aria-required="true"
          aria-invalid={touched.url && !!errors.url}
          aria-describedby={errors.url ? "url-error" : undefined}
        />
        {touched.url && errors.url && (
          <p id="url-error" className="text-sm text-destructive" role="alert">
            {errors.url}
          </p>
        )}
      </div>
    </div>
  );
}
