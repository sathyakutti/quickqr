"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { socialSchema } from "@/lib/qr/types";

interface SocialFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function SocialForm({ onChange }: SocialFormProps) {
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, value: string) => {
      const data = { url: field === "url" ? value : url };
      const result = socialSchema.safeParse(data);
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
      onChange({ url: value });
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
        <Label htmlFor="social-url">
          Social Profile URL <span className="text-destructive">*</span>
        </Label>
        <Input
          id="social-url"
          type="url"
          placeholder="https://twitter.com/username"
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => handleBlur("url", url)}
          aria-required="true"
          aria-invalid={touched.url && !!errors.url}
          aria-describedby={errors.url ? "social-url-error" : "social-url-hint"}
        />
        {touched.url && errors.url ? (
          <p id="social-url-error" className="text-sm text-destructive" role="alert">
            {errors.url}
          </p>
        ) : (
          <p id="social-url-hint" className="text-sm text-muted-foreground">
            Link to any social profile, Linktree, or bio page
          </p>
        )}
      </div>
    </div>
  );
}
