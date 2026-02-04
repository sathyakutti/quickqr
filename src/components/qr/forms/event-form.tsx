"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { eventSchema } from "@/lib/qr/types";

interface EventFormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export function EventForm({ onChange }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    description: "",
    allDay: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(
    (field: string, data: typeof formData) => {
      const result = eventSchema.safeParse(data);
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
      if (field === "allDay" && value === true) {
        next.startTime = "";
        next.endTime = "";
      }
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
        <Label htmlFor="event-title">
          Event Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="event-title"
          type="text"
          placeholder="Team Meeting"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
          onBlur={() => handleBlur("title")}
          aria-required="true"
          aria-invalid={touched.title && !!errors.title}
          aria-describedby={errors.title ? "event-title-error" : undefined}
        />
        {touched.title && errors.title && (
          <p id="event-title-error" className="text-sm text-destructive" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="event-allday"
          checked={formData.allDay}
          onCheckedChange={(checked) => updateField("allDay", checked)}
          aria-label="All-day event"
        />
        <Label htmlFor="event-allday" className="cursor-pointer">
          All-day event
        </Label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="event-start-date">
            Start Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="event-start-date"
            type="date"
            value={formData.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
            onBlur={() => handleBlur("startDate")}
            aria-required="true"
            aria-invalid={touched.startDate && !!errors.startDate}
            aria-describedby={errors.startDate ? "event-start-date-error" : undefined}
          />
          {touched.startDate && errors.startDate && (
            <p id="event-start-date-error" className="text-sm text-destructive" role="alert">
              {errors.startDate}
            </p>
          )}
        </div>

        {!formData.allDay && (
          <div className="space-y-2">
            <Label htmlFor="event-start-time">Start Time</Label>
            <Input
              id="event-start-time"
              type="time"
              value={formData.startTime}
              onChange={(e) => updateField("startTime", e.target.value)}
              onBlur={() => handleBlur("startTime")}
              aria-describedby={errors.startTime ? "event-start-time-error" : undefined}
            />
            {touched.startTime && errors.startTime && (
              <p id="event-start-time-error" className="text-sm text-destructive" role="alert">
                {errors.startTime}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="event-end-date">End Date</Label>
          <Input
            id="event-end-date"
            type="date"
            value={formData.endDate}
            onChange={(e) => updateField("endDate", e.target.value)}
            onBlur={() => handleBlur("endDate")}
            aria-describedby={errors.endDate ? "event-end-date-error" : undefined}
          />
          {touched.endDate && errors.endDate && (
            <p id="event-end-date-error" className="text-sm text-destructive" role="alert">
              {errors.endDate}
            </p>
          )}
        </div>

        {!formData.allDay && (
          <div className="space-y-2">
            <Label htmlFor="event-end-time">End Time</Label>
            <Input
              id="event-end-time"
              type="time"
              value={formData.endTime}
              onChange={(e) => updateField("endTime", e.target.value)}
              onBlur={() => handleBlur("endTime")}
              aria-describedby={errors.endTime ? "event-end-time-error" : undefined}
            />
            {touched.endTime && errors.endTime && (
              <p id="event-end-time-error" className="text-sm text-destructive" role="alert">
                {errors.endTime}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-location">Location</Label>
        <Input
          id="event-location"
          type="text"
          placeholder="Conference Room A"
          value={formData.location}
          onChange={(e) => updateField("location", e.target.value)}
          onBlur={() => handleBlur("location")}
          aria-describedby={errors.location ? "event-location-error" : undefined}
        />
        {touched.location && errors.location && (
          <p id="event-location-error" className="text-sm text-destructive" role="alert">
            {errors.location}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-description">Description</Label>
        <Textarea
          id="event-description"
          placeholder="Event description and details"
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          onBlur={() => handleBlur("description")}
          rows={4}
          aria-describedby={errors.description ? "event-description-error" : undefined}
        />
        {touched.description && errors.description && (
          <p id="event-description-error" className="text-sm text-destructive" role="alert">
            {errors.description}
          </p>
        )}
      </div>
    </div>
  );
}
