"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  LogOut,
  Lock,
  Layers,
  Blocks,
  Mic,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/workspace/NotificationBell";

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
    desktopOnly: true,
  },
  {
    name: "Search",
    href: "/workspace/search",
    icon: Search,
    desktopOnly: true,
  },
  {
    name: "Axios's Voice",
    href: "/workspace/voice",
    icon: Mic,
    badge: "New",
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
    desktopOnly: true,
  },
  {
    name: "Knowledge",
    href: "/workspace/knowledge",
    icon: BookOpen,
    desktopOnly: true,
  },
  {
    name: "Compliance",
    href: "/workspace/compliance",
    icon: ShieldCheck,
    desktopOnly: true,
  },
  {
    name: "Workforce Copilot",
    href: "/workspace/assistant",
    icon: Bot,
    badge: "Alt+C",
  },
  {
    name: "Integrations",
    href: "/workspace/integrations",
    icon: Blocks,
    badge: "New",
  },
  {
    name: "Issues & Requests",
    href: "/workspace/issues",
    icon: ClipboardList,
    badge: "New",
  },
  {
    name: "Service Directory",
    href: "/workspace/catalog",
    icon: Layers,
  },
  {
    name: "Settings",
    href: "/workspace/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [sidebarUser, setSidebarUser] = useState({
    fullName: "Axios Member",
    email: "user@axios.ai",
    role: "MEMBER",
    isDemo: false,
  });
  const [workspaceInfo, setWorkspaceInfo] = useState({
    name: "Axios Enterprise",
    category: "Enterprise Org",
  });

  // Read session and role dynamically
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const sessionType = localStorage.getItem("axios_session_type");
      const evalUser = localStorage.getItem("axios_eval_user");
      const storedUser = localStorage.getItem("axios_user");
      const orgUser = localStorage.getItem("axios_org_user");

      if (sessionType === "evolution" || evalUser) {
        const parsed = evalUser ? JSON.parse(evalUser) : {};
        setSidebarUser({
          fullName: parsed.fullName || parsed.full_name || "Evaluation Guest",
          email: parsed.email || "guest@evaluation.demo",
          role: "EVAL_SANDBOX",
          isDemo: true,
        });
        setWorkspaceInfo({
          name: "Evaluation Sandbox",
          category: "Interactive Preview",
        });
      } else if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const name = parsed.full_name || parsed.fullName || parsed.email?.split("@")[0] || "Axios User";
        const email = parsed.email || "user@axios.ai";
        const role = parsed.role || "MEMBER";
        setSidebarUser({
          fullName: name,
          email,
          role,
          isDemo: false,
        });
        setWorkspaceInfo({
          name: parsed.organization || parsed.org || "Axios Enterprise",
          category: "Enterprise Org",
        });
      } else if (orgUser) {
        const parsed = JSON.parse(orgUser);
        setWorkspaceInfo({
          name: parsed.org || "Axios Enterprise",
          category: "Enterprise Org",
        });
      }
    } catch (e) {
      console.error("Failed to parse sidebar session", e);
    }
  }, []);

  const isSuperAdmin = sidebarUser.role === "SUPER_ADMIN" || sidebarUser.role === "ADMIN";

  const initials = sidebarUser.fullName
    ? sidebarUser.fullName
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AX";

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("axios_token");
      localStorage.removeItem("axios_user");
      localStorage.removeItem("axios_eval_user");
      localStorage.removeItem("axios_session_type");
      localStorage.removeItem("axios_org_auth");
      localStorage.removeItem("axios_org_user");
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col shrink-0 h-full max-h-full border-r border-border-subtle z-40 select-none overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Top Header & Logo */}
      {collapsed ? (
        <div className="h-14 w-full flex items-center justify-center border-b border-border-subtle shrink-0 px-2">
          <button
            onClick={onToggle}
            title="Expand sidebar"
            className="w-10 h-10 rounded-md flex items-center justify-center text-[#1F45EC] hover:bg-bg-tertiary transition-colors group cursor-pointer"
          >
            <span className="text-[22px] font-bold tracking-tight font-sans lowercase group-hover:hidden select-none">
              a
            </span>
            <PanelLeftOpen size={18} strokeWidth={2} className="hidden group-hover:block" />
          </button>
        </div>
      ) : (
        <div className="relative h-14 w-full flex items-center justify-center border-b border-border-subtle shrink-0 px-4">
          <Link href="/" className="flex items-center justify-center group select-none">
            <span className="text-[24px] font-bold tracking-[-0.035em] text-[#1F45EC] font-sans lowercase leading-none group-hover:opacity-90 transition-opacity">
              axios
            </span>
          </Link>

          <button
            onClick={onToggle}
            title="Collapse sidebar"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors duration-150 cursor-pointer"
          >
            <PanelLeftClose size={16} strokeWidth={1.75} />
          </button>
        </div>
      )}

      {/* Workspace Switcher */}
      <div className="p-2 border-b border-border-subtle shrink-0">
        <button
          onClick={() => setWorkspaceOpen((v) => !v)}
          className={cn(
            "w-full flex items-center rounded-md transition-colors duration-150 cursor-pointer",
            collapsed ? "justify-center p-2" : "justify-between p-1.5",
            workspaceOpen ? "bg-bg-tertiary" : "hover:bg-bg-tertiary"
          )}
          title={collapsed ? workspaceInfo.name : undefined}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded-md bg-bg-tertiary border border-border-strong flex items-center justify-center shrink-0">
              <Building2 size={13} className="text-text-secondary" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-medium text-text-primary truncate">
                  {workspaceInfo.name}
                </span>
                <span className="text-[10px] font-mono text-text-tertiary truncate">
                  {workspaceInfo.category}
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
              title={collapsed ? `${item.name}${item.desktopOnly ? " (Desktop Only)" : ""}` : undefined}
              className={cn(
                "relative flex items-center rounded-md text-sm transition-colors duration-150 group",
                collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-2.5 py-2",
                isActive
                  ? "text-text-primary font-medium bg-bg-tertiary"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
              )}
            >
              <div className="relative shrink-0 flex items-center justify-center">
                <Icon
                  size={16}
                  strokeWidth={1.75}
                  className={cn(
                    "shrink-0 transition-colors duration-150",
                    isActive ? "text-[#1F45EC]" : "text-text-tertiary group-hover:text-text-primary"
                  )}
                />
                {item.desktopOnly && collapsed && (
                  <Lock size={9} className="absolute -bottom-1 -right-1 text-amber-500 bg-bg-secondary rounded-full p-0.5 md:hidden" />
                )}
              </div>

              {!collapsed && (
                <div className="flex items-center justify-between w-full min-w-0 gap-1.5">
                  <span className="truncate whitespace-nowrap">{item.name}</span>
                  {item.desktopOnly ? (
                    <span className="ml-auto px-1.5 py-0.5 text-[9px] font-mono rounded bg-amber-500/10 text-amber-500 border border-amber-500/25 flex items-center gap-1 shrink-0 md:hidden">
                      <Lock size={9} />
                      <span className="hidden sm:inline">Desktop</span>
                    </span>
                  ) : item.badge ? (
                    <span
                      className={cn(
                        "ml-auto px-1.5 py-0.2 text-[9px] font-mono rounded font-semibold",
                        item.badge === "New"
                          ? "bg-[#1F45EC]/15 text-[#1F45EC] border border-[#1F45EC]/30"
                          : "bg-bg-secondary text-text-tertiary border border-border-subtle group-hover:border-border-strong group-hover:text-text-secondary"
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </div>
              )}
              {isActive && (
                <span
                  className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-sm bg-[#1F45EC]"
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
                  "relative flex items-center rounded-md text-sm transition-colors duration-150 group",
                  collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-2.5 py-2",
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
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-sm bg-[#a78bfa]" />
                )}
              </Link>
            </>
          );
        })()}
      </nav>

      {/* Footer / User Profile & Status */}
      <div className="p-2.5 border-t border-border-subtle shrink-0 flex flex-col gap-2">
        {!collapsed ? (
          <div className="p-2 rounded-lg bg-bg-primary border border-border-subtle flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#1F45EC] text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-xs">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-text-primary truncate">
                  {sidebarUser.fullName}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">
                    {sidebarUser.isDemo ? "Evaluation Sandbox" : "Axios Enterprise"}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/login"
              onClick={handleSignOut}
              title="Sign out"
              className="p-1.5 rounded-md text-text-tertiary hover:text-status-error hover:bg-status-error/10 transition-colors cursor-pointer shrink-0"
            >
              <LogOut size={14} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <div
              title={`${sidebarUser.fullName} (${sidebarUser.isDemo ? "Evaluation Sandbox" : "Axios Enterprise"})`}
              className="relative w-8 h-8 rounded-full bg-[#1F45EC] text-white flex items-center justify-center text-xs font-semibold shadow-xs cursor-default"
            >
              {initials}
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <Link
              href="/login"
              onClick={handleSignOut}
              title="Sign out"
              className="p-1.5 rounded-md text-text-tertiary hover:text-status-error hover:bg-status-error/10 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
            </Link>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
