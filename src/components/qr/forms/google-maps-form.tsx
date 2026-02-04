"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { googleMapsSchema } from "@/lib/qr/types";

interface GoogleMapsFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function GoogleMapsForm({ onChange }: GoogleMapsFormProps) {
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, data: typeof formData) => {
      const result = googleMapsSchema.safeParse(data);
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
        <Label htmlFor="gmaps-latitude">
          Latitude <span className="text-destructive">*</span>
        </Label>
        <Input
          id="gmaps-latitude"
          type="text"
          inputMode="decimal"
          placeholder="37.7749"
          value={formData.latitude}
          onChange={(e) => updateField("latitude", e.target.value)}
          onBlur={() => handleBlur("latitude")}
          aria-required="true"
          aria-invalid={touched.latitude && !!errors.latitude}
          aria-describedby={errors.latitude ? "gmaps-latitude-error" : "gmaps-latitude-hint"}
        />
        {touched.latitude && errors.latitude ? (
          <p id="gmaps-latitude-error" className="text-sm text-destructive" role="alert">
            {errors.latitude}
          </p>
        ) : (
          <p id="gmaps-latitude-hint" className="text-sm text-muted-foreground">
            Between -90 and 90
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="gmaps-longitude">
          Longitude <span className="text-destructive">*</span>
        </Label>
        <Input
          id="gmaps-longitude"
          type="text"
          inputMode="decimal"
          placeholder="-122.4194"
          value={formData.longitude}
          onChange={(e) => updateField("longitude", e.target.value)}
          onBlur={() => handleBlur("longitude")}
          aria-required="true"
          aria-invalid={touched.longitude && !!errors.longitude}
          aria-describedby={errors.longitude ? "gmaps-longitude-error" : "gmaps-longitude-hint"}
        />
        {touched.longitude && errors.longitude ? (
          <p id="gmaps-longitude-error" className="text-sm text-destructive" role="alert">
            {errors.longitude}
          </p>
        ) : (
          <p id="gmaps-longitude-hint" className="text-sm text-muted-foreground">
            Between -180 and 180
          </p>
        )}
      </div>
    </div>
  );
}
