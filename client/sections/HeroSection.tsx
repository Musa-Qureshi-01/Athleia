"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Bot,
  FileText,
  AudioLines,
  MoreHorizontal,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";
import { useAuthSession } from "@/lib/auth";

interface AppConnector {
  name: string;
  iconBg: string;
  dotColor: string;
}

const APPS: AppConnector[] = [
  { name: "Slack", iconBg: "bg-[#4A154B]", dotColor: "#E01E5A" },
  { name: "Google Drive", iconBg: "bg-emerald-100", dotColor: "#0F9D58" },
  { name: "Jira", iconBg: "bg-blue-100", dotColor: "#0052CC" },
  { name: "Confluence", iconBg: "bg-blue-50", dotColor: "#172B4D" },
  { name: "SharePoint", iconBg: "bg-sky-100", dotColor: "#0078D4" },
  { name: "GitHub", iconBg: "bg-neutral-100", dotColor: "#24292F" },
  { name: "Salesforce", iconBg: "bg-cyan-100", dotColor: "#00A1E0" },
];

const SEARCH_QUERIES = [
  "Find isolation procedure and P&ID drawing for boiler feed pump P-101A",
  "Summarize high-pressure steam valve ECO-8842 and outline calibration steps",
  "Audit cooling water maintenance SOPs against ISO 45001 & OSHA 1910 standards",
  "What caused vibration anomaly on Turbine Compressor C-302 during night shift?",
];

export function HeroSection() {
  const { isAuthenticated } = useAuthSession();
  const [displayText, setDisplayText] = useState("");
  const [queryIndex, setQueryIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [customInput, setCustomInput] = useState<string | null>(null);

  // Typewriter effect simulation matching Glean's live demo
  useEffect(() => {
    if (customInput !== null) return; // User is manually typing

    const currentTarget = SEARCH_QUERIES[queryIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting && charIndex <= currentTarget.length) {
      setDisplayText(currentTarget.substring(0, charIndex));
      timer = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, 38); // Natural human keystroke speed
    } else if (!isDeleting && charIndex > currentTarget.length) {
      // Pause at full text before deleting
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 3000);
    } else if (isDeleting && charIndex > 0) {
      setDisplayText(currentTarget.substring(0, charIndex));
      timer = setTimeout(() => {
        setCharIndex((prev) => prev - 1);
      }, 16); // Fast backspace
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setQueryIndex((prev) => (prev + 1) % SEARCH_QUERIES.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, queryIndex, customInput]);

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
    setDisplayText(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <section id="hero" className="relative pb-10 sm:pb-14 lg:pb-16 overflow-hidden bg-white font-sans">
      <div className="max-w-[1280px] mx-auto border-x border-neutral-200 px-4 sm:px-8 lg:px-12 pt-14 sm:pt-20 lg:pt-24 pb-0">
        
        {/* Top Centered Header Content */}
        <div className="text-center max-w-6xl mx-auto mb-10 sm:mb-14">
          
          {/* Eyebrow: Gray line exact text */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-[14px] sm:text-[15.5px] font-normal text-[#666666] tracking-tight mb-4 font-sans"
          >
            Enterprise AI that understands your company
          </motion.p>

          {/* Main Tagline: Guaranteed 2-line structure with extended horizontal width per user request */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] xl:text-[50px] font-semibold text-neutral-900 tracking-[-0.035em] leading-[1.14] mb-8 font-display max-w-[1140px] mx-auto"
          >
            <span className="block md:whitespace-nowrap">An intelligence layer for organizational knowledge</span>
            <span className="block md:whitespace-nowrap text-neutral-900">and industrial operations.</span>
          </motion.h1>

          {/* Primary Action Button: Boxy CTA with healthy roundness directly below headline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center justify-center mb-12 sm:mb-16"
          >
            {isAuthenticated ? (
              <Link
                href="/workspace"
                className="h-11 px-7 rounded-lg text-[14.5px] font-semibold bg-[#1F45EC] hover:bg-[#1538D4] text-white shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center cursor-pointer gap-2"
              >
                <LayoutDashboard size={16} />
                <span>Go to Dashboard</span>
                <ArrowRight size={15} />
              </Link>
            ) : (
              <Link
                href="/get-a-demo"
                className="h-11 px-7 rounded-lg text-[14.5px] font-semibold bg-[#1F45EC] hover:bg-[#1538D4] text-white shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center cursor-pointer"
              >
                Get a demo
              </Link>
            )}
          </motion.div>
        </div>

        {/* 3D Iridescent Fluid Ribbon Graphic Banner (Boxy corner with healthy roundness: rounded-md sm:rounded-lg) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="relative w-full max-w-[1240px] mx-auto rounded-md sm:rounded-lg overflow-hidden shadow-xl bg-[#0d1436] mb-2 sm:mb-4"
        >
          {/* High-Resolution Fluid Ribbon Background Image (Pristine 3D Artwork) */}
          <div className="relative w-full min-h-[340px] sm:min-h-[390px] lg:min-h-[420px] flex items-center justify-center overflow-hidden">
            <img
              src="/hero-fluid-ribbon.png?v=3"
              alt="Axios Enterprise Intelligence Ribbon"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            />

            {/* Central White Search Input Card (Boxy with healthy roundness: rounded-md sm:rounded-lg) */}
            <div className="relative z-10 max-w-[640px] w-[90%] sm:w-full mx-auto bg-white/95 backdrop-blur-md rounded-md sm:rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white p-3.5 sm:p-5">
              
              {/* Form Input Bar with Animated Typewriter Text */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2.5 pb-2.5 border-b border-neutral-100">
                <span className="text-lg sm:text-xl text-neutral-400 font-light select-none pl-1">
                  +
                </span>
                
                <div className="flex-1 flex items-center overflow-hidden">
                  <input
                    type="text"
                    value={displayText}
                    onChange={handleManualInput}
                    className="w-full text-[13px] sm:text-[14px] font-normal text-neutral-900 focus:outline-none bg-transparent placeholder:text-neutral-400"
                    placeholder="Ask anything across your company's tools..."
                  />
                  {customInput === null && (
                    <span className="inline-block w-0.5 h-4.5 bg-[#1F45EC] ml-0.5 animate-pulse shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-neutral-400 shrink-0">
                  {/* Sliders/Filter Icon */}
                  <button
                    type="button"
                    title="Filters"
                    className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal size={15} />
                  </button>
                  
                  {/* Waveform / Mic Button with healthy roundness */}
                  <button
                    type="submit"
                    className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-md bg-black hover:bg-neutral-800 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    title="Run AI audio reasoning"
                  >
                    <AudioLines size={14} />
                  </button>
                </div>
              </form>

              {/* App Connectors Strip */}
              <div className="pt-2.5 flex items-center justify-between flex-wrap gap-1.5">
                <div className="flex items-center flex-wrap gap-1.5">
                  {APPS.map((app, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-100/90 hover:bg-neutral-200/90 transition-colors text-[10.5px] sm:text-[11px] font-medium text-neutral-700 cursor-pointer"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: app.dotColor }}
                      />
                      <span>{app.name}</span>
                    </div>
                  ))}
                  
                  {/* More (...) Button */}
                  <button
                    type="button"
                    title="More integrations"
                    className="w-5 h-5 rounded-md bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
                  >
                    <MoreHorizontal size={13} />
                  </button>
                </div>

                <div className="text-[10px] sm:text-[10.5px] font-mono text-neutral-400 hidden sm:block">
                  275+ enterprise connectors
                </div>
              </div>

              {/* Interactive Search Response Preview (Appears when submitted) */}
              <AnimatePresence>
                {hasSearched && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 pt-3 border-t border-neutral-100 space-y-2.5"
                  >
                    <div className="p-3.5 rounded-md bg-blue-50/70 border border-blue-200/70 text-xs text-neutral-800 leading-relaxed">
                      <div className="flex items-center gap-1.5 font-bold text-[#1F45EC] mb-1.5 font-mono text-[11px]">
                        <Bot size={14} />
                        <span>AXIOS WORKFORCE INTELLIGENCE</span>
                      </div>
                      <p className="mb-2.5 text-[11.5px] sm:text-[12px] leading-relaxed">
                        Identified Engineering Change Order <strong className="text-neutral-900 font-semibold">ECO-8842</strong> affecting high-pressure boiler feed pump <strong className="text-neutral-900 font-semibold">P-101A</strong>. The relief valve cracking pressure threshold was verified at 1.1x design MAWP. Action: calibrate 4-20mA positioner loop on DCS rack 3B and inspect mechanical seal oil pressure before unit startup.
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-blue-200/40 text-[10.5px] font-mono text-neutral-600">
                        <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 flex items-center gap-1">
                          <FileText size={10} className="text-[#1F45EC]" />
                          P&amp;ID: DWG-8842-Boiler-Feed-Unit3
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 flex items-center gap-1">
                          <FileText size={10} className="text-[#1F45EC]" />
                          SOP: SOP-P101A-Pump-Isolation-Rev4
                        </span>
                        <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 flex items-center gap-1">
                          <FileText size={10} className="text-[#1F45EC]" />
                          Manual: API-610-Centrifugal-Pumps
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
