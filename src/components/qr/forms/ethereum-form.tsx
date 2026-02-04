"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ethereumSchema } from "@/lib/qr/types";

interface EthereumFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function EthereumForm({ onChange }: EthereumFormProps) {
  const [formData, setFormData] = useState({
    address: "",
    amount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, data: typeof formData) => {
      const result = ethereumSchema.safeParse(data);
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
        <Label htmlFor="eth-address">
          Ethereum Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="eth-address"
          type="text"
          placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f2bD08"
          value={formData.address}
          onChange={(e) => updateField("address", e.target.value)}
          onBlur={() => handleBlur("address")}
          aria-required="true"
          aria-invalid={touched.address && !!errors.address}
          aria-describedby={errors.address ? "eth-address-error" : "eth-address-hint"}
        />
        {touched.address && errors.address ? (
          <p id="eth-address-error" className="text-sm text-destructive" role="alert">
            {errors.address}
          </p>
        ) : (
          <p id="eth-address-hint" className="text-sm text-muted-foreground">
            Must start with 0x followed by 40 hexadecimal characters
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="eth-amount">Amount (ETH)</Label>
        <Input
          id="eth-amount"
          type="text"
          inputMode="decimal"
          placeholder="0.0"
          value={formData.amount}
          onChange={(e) => updateField("amount", e.target.value)}
          onBlur={() => handleBlur("amount")}
          aria-describedby={errors.amount ? "eth-amount-error" : undefined}
        />
        {touched.amount && errors.amount && (
          <p id="eth-amount-error" className="text-sm text-destructive" role="alert">
            {errors.amount}
          </p>
        )}
      </div>
    </div>
  );
}
