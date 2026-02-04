"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

const THEME_CYCLE = ["light", "dark", "system"] as const;
type ThemeValue = (typeof THEME_CYCLE)[number];

const THEME_META: Record<ThemeValue, { icon: typeof Sun; label: string }> = {
  light: { icon: Sun, label: "Light" },
  dark: { icon: Moon, label: "Dark" },
  system: { icon: Monitor, label: "System" },
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled aria-hidden="true">
        <span className="sr-only">Loading theme toggle</span>
        <Sun className="size-4 opacity-50" />
      </Button>
    );
  }

  const current = (THEME_CYCLE.includes(theme as ThemeValue)
    ? theme
    : "system") as ThemeValue;
  const currentIndex = THEME_CYCLE.indexOf(current);
  const next = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];
  const { icon: Icon, label } = THEME_META[current];

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(next)}
      aria-label={`Current theme: ${label}. Click to switch to ${THEME_META[next].label}`}
    >
      <Icon className="size-4" />
    </Button>
  );
}
