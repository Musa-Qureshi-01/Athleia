"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";

export function TopAnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Announcement"
      className="text-white text-[13px] sm:text-[14px] min-h-[44px] py-2.5 px-6 relative z-50 border-b border-white/10 font-sans tracking-tight flex items-center bg-[#02072F]"
      style={{
        backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.28) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      <div className="max-w-[1120px] w-full mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 pr-6 sm:pr-8 text-center text-xs sm:text-[13.5px] leading-normal">
        <span className="font-normal text-white/95">
          Release 2026.3: Multi-format P&amp;ID schematic ingestion, vibration telemetry anomaly correlation, and automated regulatory compliance auditing.
        </span>
        <Link
          href="/products/workforce-copilot"
          className="inline-flex items-center gap-1 font-medium text-white underline underline-offset-4 hover:text-white/80 transition-colors whitespace-nowrap group shrink-0"
        >
          <span>See what&apos;s new</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1.5 cursor-pointer rounded hover:bg-white/10"
        aria-label="Dismiss banner"
      >
        <X size={15} />
      </button>
    </aside>
  );
}
