"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookingLogo,
  CanvaLogo,
  RedditLogo,
  DatabricksLogo,
  PinterestLogo,
  ZillowLogo,
  EricssonLogo,
  WealthsimpleLogo,
  IntercomLogo,
  WebflowLogo,
  MotiveLogo,
} from "@/components/visuals/CustomerLogos";

const LOGOS = [
  { Comp: BookingLogo, name: "Booking.com" },
  { Comp: CanvaLogo, name: "Canva" },
  { Comp: RedditLogo, name: "Reddit" },
  { Comp: DatabricksLogo, name: "Databricks" },
  { Comp: PinterestLogo, name: "Pinterest" },
  { Comp: ZillowLogo, name: "Zillow" },
  { Comp: EricssonLogo, name: "Ericsson" },
  { Comp: WealthsimpleLogo, name: "Wealthsimple" },
  { Comp: IntercomLogo, name: "Intercom" },
  { Comp: WebflowLogo, name: "Webflow" },
  { Comp: MotiveLogo, name: "Motive" },
];

export function CustomerLogosSection() {
  return (
    <section className="bg-white border-t border-neutral-200 overflow-hidden font-sans">
      <div className="max-w-[1120px] mx-auto border-x border-neutral-200">
        
        {/* 1. Top Logo Strip with Left Framed Grid Cell & Floating Animated Marquee */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-200 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200 items-center">
          
          {/* Left Cell (3 cols): "The world's leading enterprises put AI to work with Axios." */}
          <div className="lg:col-span-3 px-6 sm:px-8 py-6 sm:py-8 bg-white flex items-center z-20">
            <p className="text-[13.5px] sm:text-[14.5px] font-normal text-neutral-800 leading-snug">
              The world&apos;s leading enterprises put AI to work with Axios.
            </p>
          </div>

          {/* Right Cell (9 cols): Continuously Floating/Gliding Brands Bar */}
          <div className="lg:col-span-9 relative px-2 sm:px-4 py-6 sm:py-8 bg-white overflow-hidden">
            {/* Subtle edge fade gradient masks */}
            <div className="absolute left-0 inset-y-0 w-10 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-10 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

            {/* Floating Marquee Track */}
            <div className="flex overflow-hidden select-none">
              <motion.div
                className="flex items-center gap-10 sm:gap-14 shrink-0 pr-10 sm:pr-14 opacity-75 grayscale hover:grayscale-0 transition-all duration-300"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: 25,
                }}
              >
                {[...LOGOS, ...LOGOS].map((item, idx) => {
                  const Comp = item.Comp;
                  return (
                    <div key={idx} className="shrink-0 flex items-center justify-center hover:opacity-100 transition-opacity">
                      <Comp className="h-4 sm:h-5 w-auto text-neutral-800" />
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>

        </div>

        {/* 2. Axios:GO 2026 Conference Banner */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="rounded-md overflow-hidden shadow-lg border border-neutral-200/80 bg-gradient-to-r from-[#D95368] via-[#85329A] to-[#2E2888] text-white p-5 sm:p-8 lg:p-10 relative flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            
            {/* Ambient Lighting & 3D Ribbon Lighting overlay */}
            <div className="absolute inset-0 bg-radial from-white/15 via-transparent to-black/25 pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-80 h-80 rounded-full bg-rose-400/30 blur-3xl pointer-events-none" />

            {/* Left: Axios GO 2026 Logo Block */}
            <div className="relative z-10 flex flex-col select-none shrink-0 border-b lg:border-b-0 lg:border-r border-white/20 pb-4 lg:pb-0 lg:pr-10 text-center lg:text-left">
              <span className="text-[26px] sm:text-[34px] font-bold tracking-tight lowercase leading-none font-sans text-white">
                axios
              </span>
              <span className="text-[38px] sm:text-[50px] font-extrabold tracking-tight uppercase leading-none font-sans text-white">
                GO
              </span>
              <span className="text-[28px] sm:text-[36px] font-extrabold tracking-tight font-mono text-white/95 leading-none mt-1">
                2026
              </span>
            </div>

            {/* Right: Headline, Description & Actions */}
            <div className="relative z-10 flex-1 max-w-2xl space-y-2.5 sm:space-y-3 text-center lg:text-left">
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight font-sans">
                Elevate your AI expertise
              </h3>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-sans max-w-xl mx-auto lg:mx-0">
                See how engineering, reliability, and plant teams are deploying Axios copilots to troubleshoot machinery, audit safety SOPs, and run mission-critical workflows.
              </p>

              {/* Action Buttons - Centered and cleanly aligned on mobile */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
                <Link
                  href="/get-a-demo"
                  className="h-10 px-5 rounded-md text-xs sm:text-sm font-semibold bg-[#1F45EC] hover:bg-[#1538D4] text-white transition-all shadow-xs inline-flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <span>Register for Axios:GO replays</span>
                  <span className="text-sm font-bold">»</span>
                </Link>

                <Link
                  href="/resources"
                  className="h-10 px-4 rounded-md text-xs sm:text-sm font-medium border border-white/40 hover:bg-white/10 text-white transition-all cursor-pointer inline-flex items-center justify-center text-center"
                >
                  <span>Read the recap</span>
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
