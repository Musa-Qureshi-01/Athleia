"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  User,
  Sliders,
  LogOut,
  ChevronDown,
  Shield,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

interface TopNavProps {
  onOpenSearch?: () => void;
}

export function TopNav({ onOpenSearch }: TopNavProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="h-14 border-b border-border-subtle flex items-center justify-between px-6 shrink-0 z-20"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Search Input Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between h-9 px-3 rounded-sm border border-border-subtle bg-bg-secondary text-text-tertiary hover:text-text-secondary hover:border-border-strong transition-colors duration-150 text-sm"
        >
          <div className="flex items-center gap-2.5">
            <Search size={15} strokeWidth={1.75} className="text-text-tertiary" />
            <span className="text-xs">Search documents, tags, SOPs...</span>
          </div>
          <kbd
            className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded border border-border-strong bg-bg-primary text-text-tertiary"
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Gateway Status Badge */}
        <div
          className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-sm border border-border-subtle bg-bg-secondary text-xs text-text-secondary"
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--status-verified)" }} />
          <span className="text-mono text-[11px]">API Gateway Connected</span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

{/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 p-1 rounded-sm hover:bg-bg-secondary transition-colors duration-150"
          >
            <div
              className="w-7 h-7 rounded-sm flex items-center justify-center text-xs font-mono font-medium text-bg-primary"
              style={{ backgroundColor: "var(--text-primary)" }}
            >
              MQ
            </div>
            <span className="hidden lg:inline-block text-xs font-medium text-text-primary">
              Musa Qureshi
            </span>
            <ChevronDown size={13} className="text-text-tertiary hidden lg:inline-block" />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-sm border border-border-subtle shadow-xl p-1.5 z-50 flex flex-col gap-1"
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              <div className="px-2.5 py-2 border-b border-border-subtle flex flex-col">
                <span className="text-xs font-medium text-text-primary truncate">Musa Qureshi</span>
                <span className="text-mono text-[10px] text-text-tertiary truncate">musa@athleia.ai</span>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-text-secondary">
                  <Shield size={10} className="text-status-verified" />
                  <span>Enterprise Admin</span>
                </div>
              </div>

              <Link
                href="/workspace/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-sm transition-colors"
              >
                <Sliders size={14} className="text-text-tertiary" />
                <span>Preferences & Settings</span>
              </Link>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  router.push("/login");
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-status-error hover:bg-bg-secondary rounded-sm transition-colors w-full text-left"
              >
                <LogOut size={14} />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
