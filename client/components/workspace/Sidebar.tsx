"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Search,
  Cpu,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Building2,
  BookOpen,
  ShieldCheck,
  Wrench,
  Crown,
  Bot,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/workspace",
    icon: LayoutDashboard,
  },
  {
    name: "Documents",
    href: "/workspace/documents",
    icon: FileText,
  },
  {
    name: "Search",
    href: "/workspace/search",
    icon: Search,
  },
  {
    name: "Intelligence",
    href: "/workspace/intelligence",
    icon: Cpu,
  },
  {
    name: "Maintenance",
    href: "/workspace/maintenance",
    icon: Wrench,
  },
  {
    name: "Knowledge",
    href: "/workspace/knowledge",
    icon: BookOpen,
  },
  {
    name: "Compliance",
    href: "/workspace/compliance",
    icon: ShieldCheck,
  },
  {
    name: "Workforce Copilot",
    href: "/workspace/assistant",
    icon: Bot,
    badge: "Alt+C",
  },
  {
    name: "Settings",
    href: "/workspace/settings",
    icon: Settings,
  },
];

import { NotificationBell } from "@/components/workspace/NotificationBell";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  // Read role from localStorage (client-side only)
  const userRole = typeof window !== "undefined"
    ? (() => { try { return JSON.parse(localStorage.getItem("athleia_user") || "{}").role || ""; } catch { return ""; } })()
    : "";
  const isSuperAdmin = userRole === "SUPER_ADMIN";

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col shrink-0 h-screen border-r border-border-subtle z-40 select-none overflow-visible"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Top Header & Logo */}
      <div className="h-14 flex items-center justify-between px-3.5 border-b border-border-subtle shrink-0">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-6 h-6 shrink-0 rounded-[4px] overflow-hidden">
            <Image
              src="/favicon.svg"
              alt="Athleia Logo"
              width={24}
              height={24}
              className="w-6 h-6 object-contain"
            />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-medium tracking-[0.06em] text-text-primary whitespace-nowrap"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ATHLEIA
            </motion.span>
          )}
        </Link>

        <div className="flex items-center gap-1">
          <NotificationBell />

          <button
            onClick={onToggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-sm text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors duration-150"
          >
            {collapsed ? (
              <PanelLeftOpen size={16} strokeWidth={1.75} />
            ) : (
              <PanelLeftClose size={16} strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Workspace Switcher */}
      <div className="p-2 border-b border-border-subtle shrink-0">
        <button
          onClick={() => setWorkspaceOpen((v) => !v)}
          className={cn(
            "w-full flex items-center justify-between p-1.5 rounded-sm text-left transition-colors duration-150",
            workspaceOpen ? "bg-bg-tertiary" : "hover:bg-bg-tertiary"
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-5 h-5 rounded-sm bg-bg-tertiary border border-border-strong flex items-center justify-center shrink-0">
              <Building2 size={12} className="text-text-secondary" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-text-primary truncate">
                  Plant 101 — Primary
                </span>
                <span className="text-[10px] text-mono text-text-tertiary truncate">
                  Enterprise Org
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <ChevronDown size={14} className="text-text-tertiary shrink-0" />
          )}
        </button>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/workspace" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={cn(
                "relative flex items-center gap-3 px-2.5 py-2 rounded-sm text-sm transition-colors duration-150 group",
                isActive
                  ? "text-text-primary font-medium bg-bg-tertiary"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
              )}
            >
              <Icon
                size={16}
                strokeWidth={1.75}
                className={cn(
                  "shrink-0 transition-colors duration-150",
                  isActive ? "text-accent" : "text-text-tertiary group-hover:text-text-primary"
                )}
              />
              {!collapsed && (
                <div className="flex items-center justify-between w-full min-w-0">
                  <span className="truncate whitespace-nowrap">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto px-1.5 py-0.2 text-[9px] font-mono rounded bg-bg-secondary text-text-tertiary border border-border-subtle group-hover:border-border-strong group-hover:text-text-secondary">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
              {isActive && (
                <span
                  className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-sm"
                  style={{ backgroundColor: "var(--accent)" }}
                />
              )}
            </Link>
          );
        })}

        {/* Super Admin only — Org Control Center */}
        {isSuperAdmin && (() => {
          const isActive = pathname === "/workspace/admin" || pathname.startsWith("/workspace/admin");
          return (
            <>
              <div className="mx-2 my-1 border-t border-border-subtle" />
              <Link
                href="/workspace/admin"
                title={collapsed ? "Admin" : undefined}
                className={cn(
                  "relative flex items-center gap-3 px-2.5 py-2 rounded-sm text-sm transition-colors duration-150 group",
                  isActive
                    ? "text-text-primary font-medium bg-bg-tertiary"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                )}
              >
                <Crown
                  size={16}
                  strokeWidth={1.75}
                  className={cn("shrink-0 transition-colors duration-150", isActive ? "" : "text-text-tertiary group-hover:text-text-primary")}
                  style={isActive ? { color: "#a78bfa" } : undefined}
                />
                {!collapsed && (
                  <span className="truncate whitespace-nowrap">Org Admin</span>
                )}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-sm" style={{ backgroundColor: "#a78bfa" }} />
                )}
              </Link>
            </>
          );
        })()}
      </nav>

      {/* Footer / User Profile & Connection Status */}
      <div className="p-3 border-t border-border-subtle shrink-0 flex flex-col gap-2">
        {!collapsed && (
          <div className="px-2 py-1.5 rounded-sm bg-bg-primary border border-border-subtle flex items-center justify-between">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-text-primary truncate">
                  {typeof window !== "undefined" && localStorage.getItem("athleia_user")
                    ? JSON.parse(localStorage.getItem("athleia_user")!).full_name
                    : "Athleia User"}
                </span>
                <span className="text-[9px] font-mono px-1 rounded bg-status-verified/10 text-status-verified font-bold border border-status-verified/20">
                  {typeof window !== "undefined" && localStorage.getItem("athleia_user")
                    ? JSON.parse(localStorage.getItem("athleia_user")!).role
                    : "SUPER_ADMIN"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-text-tertiary truncate">
                {typeof window !== "undefined" && localStorage.getItem("athleia_user")
                  ? JSON.parse(localStorage.getItem("athleia_user")!).email
                  : "admin@athleia.ai"}
              </span>
            </div>
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-2 rounded-sm p-1.5 text-mono text-xs",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span
              className="w-2 h-2 rounded-full shrink-0 animate-pulse"
              style={{ backgroundColor: "var(--status-verified)" }}
            />
            {!collapsed && (
              <span className="text-text-secondary text-[11px] truncate">
                Gateway 8000 · Auth 8008
              </span>
            )}
          </div>
          {!collapsed && (
            <Link
              href="/login"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("athleia_token");
                  localStorage.removeItem("athleia_user");
                }
              }}
              className="text-[10px] font-mono text-status-error hover:underline"
              title="Sign out"
            >
              Sign out
            </Link>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
