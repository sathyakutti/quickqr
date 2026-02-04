"use client";

import { useCallback, useRef } from "react";
import { getCategoryConfig } from "@/lib/qr/categories";
import type { QRCategory, QRType } from "@/lib/qr/types";
import { cn } from "@/lib/utils";

interface TypeSelectorProps {
  category: QRCategory;
  selectedType: QRType;
  onTypeChange: (type: QRType) => void;
}

export function TypeSelector({
  category,
  selectedType,
  onTypeChange,
}: TypeSelectorProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const categoryConfig = getCategoryConfig(category);
  const types = categoryConfig.types;

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const currentIndex = types.findIndex((t) => t.id === selectedType);
      let nextIndex = currentIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        nextIndex = (currentIndex + 1) % types.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        nextIndex = (currentIndex - 1 + types.length) % types.length;
      } else if (event.key === "Home") {
        event.preventDefault();
        nextIndex = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        nextIndex = types.length - 1;
      } else {
        return;
      }

      const nextType = types[nextIndex];
      onTypeChange(nextType.id);

      const group = groupRef.current;
      if (group) {
        const buttons = group.querySelectorAll<HTMLButtonElement>(
          '[role="radio"]'
        );
        buttons[nextIndex]?.focus();
      }
    },
    [types, selectedType, onTypeChange]
  );

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={`${categoryConfig.label} QR code types`}
      className="flex flex-wrap gap-2"
    >
      {types.map((typeConfig) => {
        const Icon = typeConfig.icon;
        const isSelected = typeConfig.id === selectedType;

        return (
          <button
            key={typeConfig.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={typeConfig.label}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onTypeChange(typeConfig.id)}
            onKeyDown={handleKeyDown}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            <span>{typeConfig.label}</span>
          </button>
        );
      })}
    </div>
  );
}
