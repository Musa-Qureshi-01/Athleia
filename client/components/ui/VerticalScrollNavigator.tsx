"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  name: string;
  targetId: string;
  iconType: "scan" | "lightbulb" | "security" | "chart" | "building" | "badge" | "layers";
}

const NAV_ITEMS: NavItem[] = [
  { id: "problem", name: "Problem Statement", targetId: "problem-statement", iconType: "scan" },
  { id: "solution", name: "Solution", targetId: "solution", iconType: "lightbulb" },
  { id: "security", name: "Security", targetId: "security", iconType: "security" },
  { id: "statistics", name: "Statistics", targetId: "statistics", iconType: "chart" },
  { id: "industries", name: "Industries", targetId: "industries", iconType: "building" },
  { id: "customers", name: "Customers", targetId: "customers", iconType: "badge" },
  { id: "platform", name: "Platform", targetId: "platform", iconType: "layers" },
];

export function VerticalScrollNavigator() {
  const [activeId, setActiveId] = useState<string>("problem");
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear smoothly after passing initial hero banner
      if (window.scrollY > 140) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Detect active section based on current viewport scroll position
      const scrollPos = window.scrollY + window.innerHeight * 0.45;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.targetId);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          if (top <= scrollPos) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (targetId: string, itemId: string) => {
    setActiveId(itemId);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!isVisible) return null;

  return (
    <nav
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        // Anchored lower down near the bottom (below headlines) along the website border line
        "fixed left-[max(10px,calc((100vw-1280px)/2-48px))] bottom-8 sm:bottom-12 z-40 hidden xl:flex flex-col select-none",
        "bg-white/95 backdrop-blur-xl border border-neutral-300/90 rounded-lg shadow-[0_10px_32px_rgba(0,0,0,0.12)] p-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden",
        isHovered ? "w-[215px]" : "w-[44px]"
      )}
      role="navigation"
      aria-label="Section shortcuts navigation"
    >
      {/* Subtle ambient bottom blue glow matching Glean */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-blue-100/40 via-transparent to-transparent pointer-events-none rounded-b-lg" />

      <div className="flex flex-col gap-1 relative z-10 w-full">
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.targetId, item.id)}
              title={item.name}
              aria-label={`Jump to ${item.name}`}
              className={cn(
                "flex items-center text-left transition-all duration-150 rounded-md cursor-pointer group focus:outline-none",
                isHovered ? "hover:bg-neutral-100/90 w-full pr-3" : "w-[34px] h-[34px] justify-center"
              )}
            >
              {/* Icon Box */}
              <div
                className={cn(
                  "w-[34px] h-[34px] rounded-md flex items-center justify-center shrink-0 transition-all duration-150",
                  isActive
                    ? "bg-black text-white shadow-xs"
                    : "bg-[#F3F4F6] text-neutral-600 group-hover:text-black group-hover:bg-[#E5E7EB]"
                )}
              >
                {/* 1. Problem Statement: Four-corner reticle with center dot */}
                {item.iconType === "scan" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 8V4h4" />
                    <path d="M20 8V4h-4" />
                    <path d="M4 16v4h4" />
                    <path d="M20 16v4h-4" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                )}

                {/* 2. Solution: Lightbulb */}
                {item.iconType === "lightbulb" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                  </svg>
                )}

                {/* 3. Security: Shield with Padlock / Keyhole */}
                {item.iconType === "security" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <circle cx="12" cy="11" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                )}

                {/* 4. Statistics: Trending Bar Chart with Upward Trend */}
                {item.iconType === "chart" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                    <path d="M3 13l5-5 5 4 8-8" strokeWidth="1.6" />
                  </svg>
                )}

                {/* 5. Industries: Office Building */}
                {item.iconType === "building" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

                {/* 6. Customers: User ID Badge */}
                {item.iconType === "badge" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="9" cy="10" r="2" />
                    <line x1="15" y1="8" x2="17" y2="8" />
                    <line x1="15" y1="12" x2="17" y2="12" />
                    <line x1="7" y1="16" x2="17" y2="16" />
                  </svg>
                )}

                {/* 7. Platform: 3 Stacked Layers */}
                {item.iconType === "layers" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                )}
              </div>

              {/* Text Label - revealed smoothly on hover with comfortable padding */}
              <span
                className={cn(
                  "ml-2.5 text-[13px] font-sans tracking-tight whitespace-nowrap transition-all duration-200",
                  isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none hidden",
                  isActive ? "font-bold text-neutral-900" : "font-medium text-neutral-700 group-hover:text-black"
                )}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
