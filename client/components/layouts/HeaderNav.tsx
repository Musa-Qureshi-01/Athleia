"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, Bot, ArrowRight } from "lucide-react";
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
          scrolled ? "border-b border-border-subtle shadow-xs" : "border-b border-transparent"
        )}
        style={{
          backgroundColor: scrolled ? "var(--nav-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
        }}
      >
        <div className="container-editorial">
          <div className="flex h-[56px] items-center justify-between gap-6">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group"
              aria-label="Athleia home"
            >
              <div className="w-6 h-6 shrink-0 rounded-[4px] overflow-hidden">
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
                className="text-xs font-semibold tracking-[0.08em] text-text-primary transition-opacity duration-200 group-hover:opacity-80"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                ATHLEIA.AI
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.replace("#", "");
                const isExternalPage = link.href.startsWith("/");

                return isExternalPage ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "relative px-3 py-1.5 text-xs font-medium rounded-sm transition-colors duration-150",
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

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <ThemeToggle />

              {/* Sign in */}
              <Link
                href="/login"
                className="hidden lg:inline-flex items-center h-8 px-3 rounded-sm text-xs font-medium text-text-secondary hover:text-text-primary transition-colors duration-150"
              >
                Sign in
              </Link>

              {/* Request Demo */}
              <Link
                href="/contact"
                className="hidden lg:inline-flex items-center gap-1.5 h-8 px-3.5 rounded-sm text-xs font-medium border border-border-strong text-text-primary bg-bg-primary hover:bg-bg-secondary transition-colors duration-150"
              >
                Request demo
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                className="lg:hidden w-8 h-8 flex items-center justify-center rounded-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="fixed top-[56px] left-0 right-0 z-40 lg:hidden border-b border-border-subtle bg-bg-primary"
            >
              <div className="container-editorial py-5 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-sm text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-4 mt-2 border-t border-border-subtle flex flex-col gap-2">
                  <Link
                    href="/workspace/assistant"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 h-9 px-4 rounded-sm text-xs font-medium bg-text-primary text-bg-primary"
                  >
                    <Bot size={14} />
                    <span>Launch Workforce Copilot (Alt+C)</span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-2 rounded-sm text-xs text-text-secondary border border-border-subtle"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-2 rounded-sm text-xs font-medium border border-border-strong text-text-primary"
                    >
                      Request demo
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
