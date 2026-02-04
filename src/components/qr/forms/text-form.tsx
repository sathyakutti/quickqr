"use client";

import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { textSchema } from "@/lib/qr/types";

interface TextFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function TextForm({ onChange }: TextFormProps) {
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, value: string) => {
      const data = { text: field === "text" ? value : text };
      const result = textSchema.safeParse(data);
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
    [text]
  );

  const handleChange = useCallback(
    (value: string) => {
      setText(value);
      onChange({ text: value });
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
        <Label htmlFor="text-input">
          Text <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="text-input"
          placeholder="Enter your text here"
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => handleBlur("text", text)}
          rows={5}
          aria-required="true"
          aria-invalid={touched.text && !!errors.text}
          aria-describedby={errors.text ? "text-error" : undefined}
        />
        {touched.text && errors.text && (
          <p id="text-error" className="text-sm text-destructive" role="alert">
            {errors.text}
          </p>
        )}
      </div>
    </div>
  );
}
