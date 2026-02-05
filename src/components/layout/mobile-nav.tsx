"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QR_CATEGORIES } from "@/lib/qr/categories";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    onClose();
    setExpandedCategory(null);
  }, [onClose]);

  // Store the element that opened the menu so we can return focus to it
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      // Delay focus to allow the animation to start
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
    } else {
      triggerRef.current?.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Trap focus inside the overlay
  useEffect(() => {
    if (!isOpen) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    function handleFocusTrap(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const focusableElements = overlay!.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    document.addEventListener("keydown", handleFocusTrap);
    return () => document.removeEventListener("keydown", handleFocusTrap);
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function toggleCategory(categoryId: string) {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  }

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
      className={cn(
        "fixed inset-0 z-50 bg-background transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
      aria-hidden={!isOpen}
      inert={!isOpen ? true : undefined}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-lg font-semibold text-foreground">
            Navigation
          </span>
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="icon"
            onClick={handleClose}
            aria-label="Close navigation menu"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Navigation content */}
        <nav
          aria-label="Mobile navigation"
          className="flex-1 overflow-y-auto px-4 py-4"
        >
          <ul className="space-y-1" role="list">
            {QR_CATEGORIES.map((category) => {
              const isExpanded = expandedCategory === category.id;
              const CategoryIcon = category.icon;
              const sectionId = `mobile-nav-section-${category.id}`;

              return (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    aria-expanded={isExpanded}
                    aria-controls={sectionId}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-foreground",
                      "hover:bg-accent hover:text-accent-foreground",
                      "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      "transition-colors"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <CategoryIcon className="size-4 text-muted-foreground" />
                      {category.label}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  <ul
                    id={sectionId}
                    role="list"
                    className={cn(
                      "overflow-hidden transition-all duration-200 ease-in-out",
                      isExpanded
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    {category.types.map((type) => {
                      const TypeIcon = type.icon;
                      return (
                        <li key={type.id}>
                          <Link
                            href={`/${type.id}`}
                            onClick={handleClose}
                            className={cn(
                              "flex items-center gap-3 rounded-md py-2 pl-10 pr-3 text-sm",
                              "text-muted-foreground hover:text-foreground hover:bg-accent",
                              "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              "transition-colors"
                            )}
                          >
                            <TypeIcon className="size-3.5" />
                            {type.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}

            {/* Pricing link */}
            <li>
              <Link
                href="/pricing"
                onClick={handleClose}
                className={cn(
                  "flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium",
                  "text-foreground hover:bg-accent hover:text-accent-foreground",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "transition-colors"
                )}
              >
                Pricing
              </Link>
            </li>

            {/* Support link */}
            <li>
              <Link
                href="/support"
                onClick={handleClose}
                className={cn(
                  "flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium",
                  "text-foreground hover:bg-accent hover:text-accent-foreground",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "transition-colors"
                )}
              >
                Support
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
