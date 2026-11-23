"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DockItem {
  id: string;
  label: string;
  targetId: string;
  icon: "corners" | "lightbulb" | "shield" | "chart" | "building" | "badge" | "layers";
}

const DOCK_ITEMS: DockItem[] = [
  { id: "context", label: "Context", targetId: "features", icon: "corners" },
  { id: "intelligence", label: "Intelligence", targetId: "features", icon: "lightbulb" },
  { id: "permissions", label: "Permissions", targetId: "features", icon: "shield" },
  { id: "efficiency", label: "Efficiency & Metrics", targetId: "features", icon: "chart" },
  { id: "enterprise", label: "Enterprise Solutions", targetId: "solutions", icon: "building" },
  { id: "workforce", label: "Workforce & Agents", targetId: "platform", icon: "badge" },
  { id: "integrations", label: "Integrations & Ecosystem", targetId: "integrations", icon: "layers" },
];

export function FloatingSideDock() {
  const [activeId, setActiveId] = useState<string>("context");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show dock after scrolling past the hero (250px+)
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (item: DockItem) => {
    setActiveId(item.id);
    const el = document.getElementById(item.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Section shortcuts"
      className="fixed left-3 sm:left-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center bg-white/95 backdrop-blur-md border border-neutral-300 rounded-lg p-1 shadow-md w-[38px] gap-1 transition-opacity duration-300"
    >
      {DOCK_ITEMS.map((item) => {
        const isActive = activeId === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            title={item.label}
            aria-label={item.label}
            className={cn(
              "w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150 cursor-pointer group relative",
              isActive
                ? "bg-black text-white shadow-xs"
                : "bg-[#EEEEEE] hover:bg-[#E0E0E0] text-neutral-800"
            )}
          >
            {item.icon === "corners" && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 8V4h4" />
                <path d="M20 8V4h-4" />
                <path d="M4 16v4h4" />
                <path d="M20 16v4h-4" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            )}

            {item.icon === "lightbulb" && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
            )}

            {item.icon === "shield" && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <circle cx="12" cy="11" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            )}

            {item.icon === "chart" && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
                <path d="M3 13l5-5 5 4 8-8" strokeWidth="1.6" />
              </svg>
            )}

            {item.icon === "building" && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <line x1="9" y1="6" x2="9" y2="6.01" />
                <line x1="15" y1="6" x2="15" y2="6.01" />
                <line x1="9" y1="10" x2="9" y2="10.01" />
                <line x1="15" y1="10" x2="15" y2="10.01" />
                <line x1="9" y1="14" x2="9" y2="14.01" />
                <line x1="15" y1="14" x2="15" y2="14.01" />
                <line x1="9" y1="18" x2="15" y2="18" />
              </svg>
            )}

            {item.icon === "badge" && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="9" cy="10" r="2" />
                <line x1="15" y1="8" x2="17" y2="8" />
                <line x1="15" y1="12" x2="17" y2="12" />
                <line x1="7" y1="16" x2="17" y2="16" />
              </svg>
            )}

            {item.icon === "layers" && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            )}

            {/* Hover Tooltip */}
            <span className="absolute left-full ml-2.5 px-2 py-1 bg-neutral-900 text-white text-[11px] font-sans font-medium rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              {item.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
