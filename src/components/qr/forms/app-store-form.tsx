"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appStoreSchema } from "@/lib/qr/types";

interface AppStoreFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function AppStoreForm({ onChange }: AppStoreFormProps) {
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, value: string) => {
      const data = { url: field === "url" ? value : url };
      const result = appStoreSchema.safeParse(data);
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
        <Label htmlFor="appstore-url">
          App URL <span className="text-destructive">*</span>
        </Label>
        <Input
          id="appstore-url"
          type="url"
          placeholder="https://apps.apple.com/app/... or https://play.google.com/store/apps/..."
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => handleBlur("url", url)}
          aria-required="true"
          aria-invalid={touched.url && !!errors.url}
          aria-describedby={errors.url ? "appstore-url-error" : "appstore-url-hint"}
        />
        {touched.url && errors.url ? (
          <p id="appstore-url-error" className="text-sm text-destructive" role="alert">
            {errors.url}
          </p>
        ) : (
          <p id="appstore-url-hint" className="text-sm text-muted-foreground">
            Link to your app on the Apple App Store, Google Play Store, or any other app store
          </p>
        )}
      </div>
    </div>
  );
}
