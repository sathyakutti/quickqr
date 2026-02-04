"use client";

import { useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QR_CATEGORIES } from "@/lib/qr/categories";
import type { QRCategory } from "@/lib/qr/types";

interface CategoryTabsProps {
  selectedCategory: QRCategory;
  onCategoryChange: (category: QRCategory) => void;
}

export function CategoryTabs({
  selectedCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  const handleValueChange = useCallback(
    (value: string) => {
      onCategoryChange(value as QRCategory);
    },
    [onCategoryChange]
  );

  return (
    <Tabs
      value={selectedCategory}
      onValueChange={handleValueChange}
      className="w-full"
    >
      <div className="overflow-x-auto -mx-1 px-1 scrollbar-thin">
        <TabsList
          className="inline-flex w-full min-w-max"
          aria-label="QR code categories"
        >
          {QR_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                aria-label={`${category.label} category`}
                className="gap-1.5"
              >
                <Icon className="size-4" aria-hidden="true" />
                <span>{category.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
    </Tabs>
  );
}
