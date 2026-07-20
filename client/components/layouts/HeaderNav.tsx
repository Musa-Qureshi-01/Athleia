"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function useActiveSection() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return active;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "border-b border-border-subtle" : "border-b border-transparent"
        )}
        style={{
          backgroundColor: scrolled ? "var(--nav-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
        }}
      >
        <div className="container-editorial">
          <div className="flex h-[56px] items-center justify-between gap-8">

            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group"
              aria-label="Athleia home"
            >
              {/* Brand icon */}
              <div className="w-6 h-6 shrink-0 transition-opacity duration-200 group-hover:opacity-80 rounded-[4px] overflow-hidden">
                <Image
                  src="/icon.png"
                  alt="Athleia"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-cover"
                  priority
                />
              </div>
              <span
                className="text-sm font-medium tracking-[0.06em] text-text-primary transition-opacity duration-200 group-hover:opacity-70"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                ATHLEIA
              </span>
            </Link>

            {/* ── Desktop nav links ── */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "relative px-3 py-1.5 text-sm rounded-sm transition-colors duration-150",
                      isActive
                        ? "text-text-primary"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-sm"
                        style={{ backgroundColor: "var(--bg-tertiary)" }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* ── Right group ── */}
            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggle />

              {/* Divider */}
              <div
                className="hidden lg:block w-px h-4 mx-1"
                style={{ backgroundColor: "var(--border-strong)" }}
              />

              {/* Sign in */}
              <Link
                href="/login"
                className="hidden lg:inline-flex items-center h-8 px-3 rounded-sm text-xs font-medium text-text-secondary hover:text-text-primary transition-colors duration-150"
              >
                Sign in
              </Link>

              {/* CTA */}
              <Link
                href="/contact"
                className={cn(
                  "hidden lg:inline-flex items-center gap-2 h-8 px-4 rounded-sm",
                  "text-xs font-medium tracking-wide",
                  "border border-border-strong text-text-primary",
                  "hover:bg-bg-secondary transition-colors duration-150"
                )}
              >
                Request demo
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                className={cn(
                  "lg:hidden w-8 h-8 flex items-center justify-center rounded-sm",
                  "text-text-secondary hover:text-text-primary transition-colors duration-150"
                )}
              >
                {mobileOpen
                  ? <X size={16} strokeWidth={1.75} />
                  : <Menu size={16} strokeWidth={1.75} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[56px] left-0 right-0 z-40 lg:hidden border-b border-border-subtle"
              style={{
                backgroundColor: "var(--bg-primary)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="container-editorial py-5 flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.href.replace("#", "");
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "px-3 py-2.5 rounded-sm text-sm transition-colors duration-150",
                        isActive
                          ? "text-text-primary font-medium"
                          : "text-text-secondary hover:text-text-primary"
                      )}
                      style={isActive ? { backgroundColor: "var(--bg-tertiary)" } : {}}
                    >
                      {link.label}
                    </a>
                  );
                })}

                {/* Mobile actions */}
                <div className="pt-4 mt-2 border-t border-border-subtle flex items-center gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center h-9 px-4 rounded-sm text-sm text-text-secondary hover:text-text-primary transition-colors border border-border-subtle"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center h-9 px-5 rounded-sm text-sm font-medium border border-border-strong text-text-primary hover:bg-bg-secondary transition-colors"
                  >
                    Request demo
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
