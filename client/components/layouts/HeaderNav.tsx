"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ENTERPRISE_NAV_LINKS } from "@/lib/enterprise-data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "border-b border-border-subtle shadow-xs bg-bg-primary/90 backdrop-blur-md" : "bg-bg-primary/60 backdrop-blur-xs border-b border-transparent"
        )}
      >
        <div className="container-editorial">
          <div className="flex h-[60px] items-center justify-between gap-6">

            {/* Corporate Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 shrink-0 group"
              aria-label="Athleia.ai Enterprise Home"
            >
              <div className="w-7 h-7 rounded-[4px] overflow-hidden bg-accent/10 border border-accent/30 flex items-center justify-center p-0.5 group-hover:border-accent transition-colors">
                <Image
                  src="/icon.png"
                  alt="Athleia.ai"
                  width={28}
                  height={28}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-[0.1em] text-text-primary group-hover:opacity-85 transition-opacity font-mono">
                  ATHLEIA.AI
                </span>
                <span className="text-[9px] font-mono text-text-tertiary tracking-tight -mt-0.5">
                  ENTERPRISE PLATFORM
                </span>
              </div>
            </Link>

            {/* Clean Enterprise Nav Links */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation">
              {ENTERPRISE_NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "relative px-3.5 py-1.5 text-xs font-medium rounded-sm transition-colors duration-150",
                      isActive
                        ? "text-text-primary font-semibold"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-nav-bg"
                        className="absolute inset-0 rounded-sm bg-bg-tertiary/70"
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Group */}
            <div className="flex items-center gap-3 shrink-0">
              <ThemeToggle />

              {/* Sign In */}
              <Link
                href="/login"
                className="hidden lg:inline-flex items-center h-8.5 px-3.5 rounded-sm text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Sign in
              </Link>

              {/* Book Demo Primary CTA */}
              <Link
                href="/contact"
                className="hidden sm:inline-flex items-center gap-1.5 h-8.5 px-4 rounded-sm text-xs font-semibold bg-text-primary text-bg-primary hover:opacity-90 transition-opacity shadow-xs group"
              >
                <span>Book Demo</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle Navigation Menu"
                className="lg:hidden w-8.5 h-8.5 flex items-center justify-center rounded-sm text-text-secondary hover:text-text-primary border border-border-subtle"
              >
                {mobileOpen ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
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
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="fixed top-[60px] left-0 right-0 z-40 lg:hidden border-b border-border-subtle bg-bg-primary shadow-xl"
            >
              <div className="container-editorial py-6 flex flex-col gap-2">
                {ENTERPRISE_NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3.5 py-2.5 rounded-sm text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                  </Link>
                ))}

                <div className="pt-4 mt-2 border-t border-border-subtle flex flex-col gap-2.5">
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 h-9.5 px-4 rounded-sm text-xs font-semibold bg-text-primary text-bg-primary"
                  >
                    <span>Book Product Demo</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center h-9 px-4 rounded-sm text-xs text-text-secondary border border-border-subtle"
                  >
                    Sign in to Enterprise Workspace
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
