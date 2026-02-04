"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { geoSchema } from "@/lib/qr/types";

interface LocationFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function LocationForm({ onChange }: LocationFormProps) {
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, data: typeof formData) => {
      const result = geoSchema.safeParse(data);
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
        <Label htmlFor="geo-latitude">
          Latitude <span className="text-destructive">*</span>
        </Label>
        <Input
          id="geo-latitude"
          type="text"
          inputMode="decimal"
          placeholder="37.7749"
          value={formData.latitude}
          onChange={(e) => updateField("latitude", e.target.value)}
          onBlur={() => handleBlur("latitude")}
          aria-required="true"
          aria-invalid={touched.latitude && !!errors.latitude}
          aria-describedby={errors.latitude ? "geo-latitude-error" : "geo-latitude-hint"}
        />
        {touched.latitude && errors.latitude ? (
          <p id="geo-latitude-error" className="text-sm text-destructive" role="alert">
            {errors.latitude}
          </p>
        ) : (
          <p id="geo-latitude-hint" className="text-sm text-muted-foreground">
            Between -90 and 90
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="geo-longitude">
          Longitude <span className="text-destructive">*</span>
        </Label>
        <Input
          id="geo-longitude"
          type="text"
          inputMode="decimal"
          placeholder="-122.4194"
          value={formData.longitude}
          onChange={(e) => updateField("longitude", e.target.value)}
          onBlur={() => handleBlur("longitude")}
          aria-required="true"
          aria-invalid={touched.longitude && !!errors.longitude}
          aria-describedby={errors.longitude ? "geo-longitude-error" : "geo-longitude-hint"}
        />
        {touched.longitude && errors.longitude ? (
          <p id="geo-longitude-error" className="text-sm text-destructive" role="alert">
            {errors.longitude}
          </p>
        ) : (
          <p id="geo-longitude-hint" className="text-sm text-muted-foreground">
            Between -180 and 180
          </p>
        )}
      </div>
    </div>
  );
}
