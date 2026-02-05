"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { QrCode, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/constants";
import { QR_CATEGORIES } from "@/lib/qr/categories";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        dropdownButtonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen((prev) => !prev);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm"
      role="banner"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 text-foreground",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "rounded-sm"
          )}
          aria-label={`${SITE_NAME} home`}
        >
          <QrCode className="size-6" />
          <span className="text-lg font-bold tracking-tight">{SITE_NAME}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {/* QR Categories Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              ref={dropdownButtonRef}
              type="button"
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium",
                "text-muted-foreground hover:text-foreground hover:bg-accent",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "transition-colors"
              )}
            >
              QR Types
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-200",
                  dropdownOpen && "rotate-180"
                )}
              />
            </button>

            {dropdownOpen && (
              <div
                role="menu"
                className={cn(
                  "absolute left-1/2 top-full mt-2 -translate-x-1/2",
                  "w-[640px] rounded-lg border border-border bg-popover p-4 shadow-lg",
                  "animate-in fade-in-0 zoom-in-95 duration-150"
                )}
              >
                <div className="grid grid-cols-3 gap-4">
                  {QR_CATEGORIES.map((category) => {
                    const CategoryIcon = category.icon;
                    return (
                      <div key={category.id}>
                        <div className="mb-2 flex items-center gap-2 px-2">
                          <CategoryIcon className="size-4 text-muted-foreground" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {category.label}
                          </span>
                        </div>
                        <ul role="group" aria-label={category.label}>
                          {category.types.map((type) => {
                            const TypeIcon = type.icon;
                            return (
                              <li key={type.id} role="none">
                                <Link
                                  href={`/${type.id}`}
                                  role="menuitem"
                                  onClick={() => setDropdownOpen(false)}
                                  className={cn(
                                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                                    "text-foreground hover:bg-accent hover:text-accent-foreground",
                                    "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    "transition-colors"
                                  )}
                                >
                                  <TypeIcon className="size-3.5 text-muted-foreground" />
                                  {type.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Link */}
          <Link
            href="/pricing"
            className={cn(
              "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium",
              "text-muted-foreground hover:text-foreground hover:bg-accent",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "transition-colors"
            )}
          >
            Pricing
          </Link>

          {/* Support Link */}
          <Link
            href="/support"
            className={cn(
              "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium",
              "text-muted-foreground hover:text-foreground hover:bg-accent",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "transition-colors"
            )}
          >
            Support
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
