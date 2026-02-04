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
import { paypalSchema } from "@/lib/qr/types";

interface PaypalFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function PaypalForm({ onChange }: PaypalFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    amount: "",
    currency: "USD",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, data: typeof formData) => {
      const result = paypalSchema.safeParse(data);
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
        <Label htmlFor="paypal-username">
          PayPal.me Username <span className="text-destructive">*</span>
        </Label>
        <Input
          id="paypal-username"
          type="text"
          placeholder="johndoe"
          value={formData.username}
          onChange={(e) => updateField("username", e.target.value)}
          onBlur={() => handleBlur("username")}
          aria-required="true"
          aria-invalid={touched.username && !!errors.username}
          aria-describedby={errors.username ? "paypal-username-error" : "paypal-username-hint"}
        />
        {touched.username && errors.username ? (
          <p id="paypal-username-error" className="text-sm text-destructive" role="alert">
            {errors.username}
          </p>
        ) : (
          <p id="paypal-username-hint" className="text-sm text-muted-foreground">
            Your PayPal.me link will be paypal.me/{formData.username || "username"}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="paypal-amount">Amount</Label>
        <Input
          id="paypal-amount"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => updateField("amount", e.target.value)}
          onBlur={() => handleBlur("amount")}
          aria-describedby={errors.amount ? "paypal-amount-error" : undefined}
        />
        {touched.amount && errors.amount && (
          <p id="paypal-amount-error" className="text-sm text-destructive" role="alert">
            {errors.amount}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="paypal-currency">Currency</Label>
        <Select
          value={formData.currency}
          onValueChange={(value) => updateField("currency", value)}
        >
          <SelectTrigger id="paypal-currency" className="w-full">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD - US Dollar</SelectItem>
            <SelectItem value="EUR">EUR - Euro</SelectItem>
            <SelectItem value="GBP">GBP - British Pound</SelectItem>
            <SelectItem value="INR">INR - Indian Rupee</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
