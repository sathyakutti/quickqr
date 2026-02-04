"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { vcardSchema } from "@/lib/qr/types";
import { cn } from "@/lib/utils";

interface VcardFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function VcardForm({ onChange }: VcardFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    title: "",
    website: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, data: typeof formData) => {
      const result = vcardSchema.safeParse(data);
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

  const renderField = (
    id: string,
    field: string,
    label: string,
    options?: {
      required?: boolean;
      type?: string;
      placeholder?: string;
      className?: string;
    }
  ) => {
    const { required, type = "text", placeholder, className } = options ?? {};
    const errorId = `vcard-${field}-error`;
    const inputId = `vcard-${id}`;

    return (
      <div className={cn("space-y-2", className)}>
        <Label htmlFor={inputId}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
        <Input
          id={inputId}
          type={type}
          placeholder={placeholder ?? label}
          value={formData[field as keyof typeof formData]}
          onChange={(e) => updateField(field, e.target.value)}
          onBlur={() => handleBlur(field)}
          aria-required={required ? "true" : undefined}
          aria-invalid={touched[field] && !!errors[field]}
          aria-describedby={errors[field] ? errorId : undefined}
        />
        {touched[field] && errors[field] && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {errors[field]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {renderField("firstName", "firstName", "First Name", {
          required: true,
          placeholder: "John",
        })}
        {renderField("lastName", "lastName", "Last Name", {
          required: true,
          placeholder: "Doe",
        })}
      </div>

      {renderField("phone", "phone", "Phone", {
        type: "tel",
        placeholder: "+1 (555) 123-4567",
      })}

      {renderField("email", "email", "Email", {
        type: "email",
        placeholder: "john@example.com",
      })}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {renderField("company", "company", "Company", {
          placeholder: "Acme Inc.",
        })}
        {renderField("title", "title", "Job Title", {
          placeholder: "Software Engineer",
        })}
      </div>

      {renderField("website", "website", "Website", {
        type: "url",
        placeholder: "https://example.com",
      })}

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-foreground">Address</legend>

        {renderField("street", "street", "Street", {
          placeholder: "123 Main St",
        })}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderField("city", "city", "City", {
            placeholder: "San Francisco",
          })}
          {renderField("state", "state", "State / Province", {
            placeholder: "CA",
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderField("zip", "zip", "ZIP / Postal Code", {
            placeholder: "94102",
          })}
          {renderField("country", "country", "Country", {
            placeholder: "United States",
          })}
        </div>
      </fieldset>
    </div>
  );
}
