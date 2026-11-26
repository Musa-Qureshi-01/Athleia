"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PreFooterBanner() {
  return (
    <section className="bg-white border-t border-neutral-200 overflow-hidden relative font-sans">
      <div className="max-w-[1120px] mx-auto border-x border-neutral-200 px-8 sm:px-12 lg:px-16 py-16 sm:py-20 lg:py-24 flex flex-col md:flex-row items-center justify-between gap-8 relative">
        
        {/* Left Headline & Action matching Screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:gap-10 z-10">
          <h2 className="text-[32px] sm:text-[44px] lg:text-[52px] font-bold tracking-[-0.035em] text-neutral-900 font-sans leading-tight">
            See Enterprise AI in action
          </h2>

          <Link
            href="/get-a-demo"
            className="h-12 px-8 rounded-md text-[15px] font-semibold bg-black text-white hover:bg-neutral-800 transition-all flex items-center justify-center shadow-xs w-fit cursor-pointer shrink-0"
          >
            Get a demo
          </Link>
        </div>

        {/* Far Right: 3D Fluid Ribbon Graphic matching Screenshot */}
        <div className="w-64 h-32 md:w-80 md:h-40 rounded-full bg-gradient-to-tr from-[#00C6FF] via-[#1844EB] to-[#9B51E0] blur-xl opacity-60 pointer-events-none absolute right-6 top-1/2 -translate-y-1/2" />
        <div className="w-56 h-28 md:w-72 md:h-36 rounded-full border-[18px] border-[#1844EB]/30 border-t-[#00C6FF] border-r-[#9B51E0] rotate-45 pointer-events-none hidden sm:block absolute right-0 top-1/2 -translate-y-1/2" />

      </div>
    </section>
  );
}
