"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("athleia-theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initial = (saved as "light" | "dark") || preferred;
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("athleia-theme", next);
  };

  if (!mounted) {
    return <div className={cn("w-8 h-8", className)} />;
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-sm",
        "text-text-secondary hover:text-text-primary",
        "transition-colors duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
        className
      )}
    >
      {theme === "light" ? (
        <Moon size={15} strokeWidth={1.5} />
      ) : (
        <Sun size={15} strokeWidth={1.5} />
      )}
    </button>
  );
}
