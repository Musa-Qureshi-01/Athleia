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
  Bot,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NotificationBell } from "@/components/workspace/NotificationBell";
import { AttachedSearchBar } from "@/components/workspace/AttachedSearchBar";
import { cn } from "@/lib/utils";

interface TopNavProps {
  onOpenSearch?: () => void;
}

export function TopNav({ onOpenSearch }: TopNavProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    fullName: string;
    email: string;
    role: string;
    initials: string;
    isDemo: boolean;
  }>({
    fullName: "Axios Member",
    email: "user@axios.ai",
    role: "Member",
    initials: "AM",
    isDemo: false,
  });

  const profileRef = useRef<HTMLDivElement>(null);

  // Dynamically load real authenticated user profile
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const sessionType = localStorage.getItem("axios_session_type");
      const storedUser = localStorage.getItem("axios_user");
      const evalUser = localStorage.getItem("axios_eval_user");

      if (sessionType === "evolution" || evalUser) {
        const parsed = evalUser ? JSON.parse(evalUser) : {};
        const name = parsed.fullName || parsed.full_name || "Evaluation Guest";
        const email = parsed.email || parsed.demo_email || "guest@evaluation.demo";
        const initials = name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "EG";
        setCurrentUser({
          fullName: name,
          email,
          role: "Evaluation Sandbox",
          initials,
          isDemo: true,
        });
      } else if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const name = parsed.full_name || parsed.fullName || parsed.email?.split("@")[0] || "Axios User";
        const email = parsed.email || "";
        const role = parsed.role ? parsed.role.replace(/_/g, " ") : "Enterprise Member";
        const initials = name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "AU";
        setCurrentUser({
          fullName: name,
          email,
          role,
          initials,
          isDemo: false,
        });
      }
    } catch (e) {
      console.error("Failed to parse user session", e);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("axios_token");
    localStorage.removeItem("axios_user");
    localStorage.removeItem("axios_eval_user");
    localStorage.removeItem("axios_session_type");
    localStorage.removeItem("axios_org_auth");
    localStorage.removeItem("axios_org_user");
    setProfileOpen(false);
    router.push("/login");
  };

  // Global keyboard shortcut listener for Alt+C (Workforce Copilot)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey && (e.key === "c" || e.key === "C" || e.key === "a" || e.key === "A")) {
        e.preventDefault();
        router.push("/workspace/assistant");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

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
      className="relative h-14 border-b border-border-subtle flex items-center justify-between px-3.5 sm:px-6 shrink-0 z-50 gap-2 sm:gap-3"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* AWS Console Style Attached Global Search Bar */}
      <AttachedSearchBar />

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Enterprise Status Badge */}
        <div
          className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-sm border border-border-subtle bg-bg-secondary text-xs text-text-secondary"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-mono text-[11px] font-medium">Enterprise Active</span>
        </div>

        {/* Workforce Copilot Quick Launch Button */}
        <button
          onClick={() => router.push("/workspace/assistant")}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-sm bg-black hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer shrink-0"
          title="Open Axios Workforce Copilot (Shortcut: Alt+C)"
        >
          <Bot size={14} className="text-blue-400 shrink-0" />
          <span className="hidden lg:inline">Workforce Copilot</span>
          <kbd className="hidden 2xl:inline-flex items-center px-1.5 py-0.2 text-[9px] font-mono rounded-xs bg-neutral-800 text-neutral-300 border border-neutral-700">
            Alt+C
          </kbd>
        </button>

        {/* Real-time Notifications Bell */}
        <NotificationBell />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile Dropdown */}
        <div className="relative shrink-0" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-1.5 p-1 rounded-sm hover:bg-bg-secondary transition-colors duration-150 cursor-pointer"
          >
            <div
              className="w-7 h-7 rounded-sm flex items-center justify-center text-xs font-mono font-medium text-bg-primary shrink-0"
              style={{ backgroundColor: "var(--text-primary)" }}
            >
              {currentUser.initials}
            </div>
            <span className="hidden xl:inline-block text-xs font-medium text-text-primary truncate max-w-[120px]">
              {currentUser.fullName}
            </span>
            <ChevronDown size={13} className="text-text-tertiary hidden xl:inline-block shrink-0" />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-sm border border-border-subtle shadow-xl p-1.5 z-50 flex flex-col gap-1"
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              <div className="px-2.5 py-2 border-b border-border-subtle flex flex-col">
                <span className="text-xs font-medium text-text-primary truncate">{currentUser.fullName}</span>
                <span className="text-mono text-[10px] text-text-tertiary truncate">{currentUser.email}</span>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-text-secondary">
                  <Shield size={10} className={currentUser.isDemo ? "text-amber-500" : "text-status-verified"} />
                  <span>{currentUser.role}</span>
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
                onClick={handleSignOut}
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-status-error hover:bg-bg-secondary rounded-sm transition-colors w-full text-left cursor-pointer"
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
