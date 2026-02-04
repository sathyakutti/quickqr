"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { wifiSchema } from "@/lib/qr/types";

interface WifiFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function WifiForm({ onChange }: WifiFormProps) {
  const [formData, setFormData] = useState({
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, data: typeof formData) => {
      const result = wifiSchema.safeParse(data);
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
    (field: string, value: string | boolean) => {
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
        <Label htmlFor="wifi-ssid">
          Network Name (SSID) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="wifi-ssid"
          type="text"
          placeholder="MyNetwork"
          value={formData.ssid}
          onChange={(e) => updateField("ssid", e.target.value)}
          onBlur={() => handleBlur("ssid")}
          aria-required="true"
          aria-invalid={touched.ssid && !!errors.ssid}
          aria-describedby={errors.ssid ? "wifi-ssid-error" : undefined}
        />
        {touched.ssid && errors.ssid && (
          <p id="wifi-ssid-error" className="text-sm text-destructive" role="alert">
            {errors.ssid}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="wifi-password">Password</Label>
        <Input
          id="wifi-password"
          type="password"
          placeholder="Enter network password"
          value={formData.password}
          onChange={(e) => updateField("password", e.target.value)}
          onBlur={() => handleBlur("password")}
          aria-describedby={errors.password ? "wifi-password-error" : undefined}
        />
        {touched.password && errors.password && (
          <p id="wifi-password-error" className="text-sm text-destructive" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="wifi-encryption">Encryption</Label>
        <Select
          value={formData.encryption}
          onValueChange={(value) => updateField("encryption", value)}
        >
          <SelectTrigger id="wifi-encryption" className="w-full">
            <SelectValue placeholder="Select encryption type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WPA">WPA/WPA2</SelectItem>
            <SelectItem value="WEP">WEP</SelectItem>
            <SelectItem value="nopass">None (Open)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="wifi-hidden"
          checked={formData.hidden}
          onCheckedChange={(checked) => updateField("hidden", checked)}
          aria-label="Hidden network"
        />
        <Label htmlFor="wifi-hidden" className="cursor-pointer">
          Hidden network
        </Label>
      </div>
    </div>
  );
}
