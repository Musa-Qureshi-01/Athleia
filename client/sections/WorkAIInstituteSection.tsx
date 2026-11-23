"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { ArrowRight, X, Sparkles, BookOpen, Mic, HelpCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface InstituteItem {
  id: string;
  type: "Report" | "Podcast" | "Quiz";
  title: string;
  cta: string;
  accentColor: string;
  badge: string;
  visual: {
    title: string;
    subtitle: string;
    tag: string;
    bgGradient: string;
  };
}

const INSTITUTE_ITEMS: InstituteItem[] = [
  {
    id: "report",
    type: "Report",
    title: "The Work AI Index",
    cta: "View full report",
    accentColor: "#FF7E4C",
    badge: "Annual Benchmark",
    visual: {
      title: "The Work AI",
      subtitle: "Index 2026",
      tag: "Global Enterprise Report",
      bgGradient: "from-neutral-900 via-[#182030] to-[#0D1525]",
    },
  },
  {
    id: "podcast",
    type: "Podcast",
    title: "Intelligence: Real & Imagined",
    cta: "Listen to episode",
    accentColor: "#FF7E4C",
    badge: "Episode 14 · 38 min",
    visual: {
      title: "Intelligence",
      subtitle: "Real & Imagined",
      tag: "Axios Work AI Podcast",
      bgGradient: "from-[#1a1c24] via-[#241f2b] to-[#16202e]",
    },
  },
  {
    id: "quiz",
    type: "Quiz",
    title: "The AI BS Questionnaire",
    cta: "Take the quiz",
    accentColor: "#FF7E4C",
    badge: "3-Min Diagnostic",
    visual: {
      title: "The AI BS",
      subtitle: "Questionnaire",
      tag: "Enterprise Signal vs Hype",
      bgGradient: "from-[#111927] via-[#1a2333] to-[#131e1e]",
    },
  },
];

export function WorkAIInstituteSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(1); // Default to podcast (index 1) as seen in screenshot
  const [isMouseInside, setIsMouseInside] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState<InstituteItem | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse follower spring
  const mouseY = useSpring(120, { stiffness: 220, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    // Constrain to container height
    mouseY.set(Math.max(60, Math.min(rect.height - 80, relativeY)));
  };

  return (
    <section id="institute" className="bg-[#090A0F] text-white font-sans overflow-hidden border-t border-neutral-800/80 relative select-none">
      
      {/* Fine Perforated Grid Texture (Matches Reference Screenshot) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.16]"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="max-w-[1280px] mx-auto border-x border-white/10 px-6 sm:px-10 lg:px-14 py-16 sm:py-20 lg:py-24 relative z-10">
        
        {/* Top Eyebrow Header with Fine Hairline Divider */}
        <div className="pb-6 mb-12 border-b border-white/15 flex items-center justify-between">
          <span className="text-[12px] sm:text-[13px] font-mono tracking-wider text-white/70 uppercase">
            Leading voices in AI
          </span>

          {/* Armillary / Globe Monogram Icon matching Screenshot */}
          <div className="w-6 h-6 text-white/60">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
              <circle cx="12" cy="12" r="10" />
              <ellipse cx="12" cy="12" rx="10" ry="4" />
              <ellipse cx="12" cy="12" rx="4" ry="10" />
            </svg>
          </div>
        </div>

        {/* Top Content Row: Left "Work Ai INSTITUTE" + Main Heading + Right "Discover" Button */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-10 sm:pb-14">
          
          {/* Left Brand Identity: High-contrast Serif "Work Ai" + Bold Tracking "INSTITUTE" */}
          <div className="shrink-0 max-w-[200px]">
            <div className="flex flex-col">
              <span className="font-serif text-[34px] sm:text-[40px] font-normal tracking-tight text-white leading-none">
                Work Ai
              </span>
              <span className="text-[10px] sm:text-[10.5px] font-mono font-bold tracking-[0.24em] text-white/60 uppercase mt-1.5">
                INSTITUTE
              </span>
            </div>
          </div>

          {/* Middle Main Headline */}
          <div className="flex-1 max-w-2xl lg:px-6">
            <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] font-bold text-white tracking-[-0.035em] leading-[1.08] font-sans">
              We help you face<br />the future of work.
            </h2>
          </div>

          {/* Right Action Button: Crisp White Pill */}
          <div className="shrink-0 self-start lg:self-center">
            <button
              onClick={() => setActiveModalItem(INSTITUTE_ITEMS[0])}
              className="h-10 px-5 rounded-full bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-[13.5px] sm:text-[14px] transition-all shadow-sm cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              Discover Work AI Institute
            </button>
          </div>
        </div>

        {/* 3 Interactive Horizontal Rows with Smooth Cursor Follower Card */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsMouseInside(true)}
          onMouseLeave={() => {
            setIsMouseInside(false);
            setHoveredIndex(1); // default back to podcast
          }}
          className="relative border-t border-white/15"
        >
          {INSTITUTE_ITEMS.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            const isAnyHovered = hoveredIndex !== null;
            const isMuted = isAnyHovered && !isHovered;

            return (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                onMouseEnter={() => setHoveredIndex(idx)}
                className={cn(
                  "py-5 sm:py-7 border-b border-white/15 flex flex-col sm:flex-row sm:items-center justify-between items-start gap-2 sm:gap-4 transition-all duration-200 cursor-pointer group relative",
                  isMuted ? "opacity-40" : "opacity-100"
                )}
              >
                {/* Left: Category Type + Title */}
                <div className="flex items-center gap-2 sm:gap-3 text-[16px] sm:text-[18px] lg:text-[19px] font-sans">
                  <span
                    className={cn(
                      "font-normal transition-colors duration-150",
                      isHovered ? "text-[#FF7E4C]" : "text-white/50"
                    )}
                  >
                    {item.type}
                  </span>
                  <span className="text-white/40">·</span>
                  <span
                    className={cn(
                      "font-medium tracking-tight transition-colors duration-150",
                      isHovered ? "text-[#FF7E4C] font-semibold" : "text-white"
                    )}
                  >
                    {item.title}
                  </span>
                </div>

                {/* Right: CTA Text with Sliding Arrow */}
                <div className="flex items-center gap-2 text-[13.5px] sm:text-[14px]">
                  <span
                    className={cn(
                      "transition-colors duration-150",
                      isHovered ? "text-[#FF7E4C] font-medium" : "text-white/60"
                    )}
                  >
                    {item.cta}
                  </span>
                  
                  {/* Sliding Arrow Icon */}
                  <span
                    className={cn(
                      "transition-all duration-200 flex items-center",
                      isHovered
                        ? "opacity-100 translate-x-0 text-[#FF7E4C]"
                        : "opacity-0 -translate-x-2 text-white/40"
                    )}
                  >
                    <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            );
          })}

          {/* Floating Smooth Cursor Follower Card (Right Side, Tracking Mouse Y) */}
          <div className="hidden lg:block pointer-events-none absolute right-16 top-0 bottom-0 z-20">
            <motion.div
              style={{ y: mouseY }}
              className="-translate-y-1/2 w-[240px] h-[190px] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.65)] border border-white/15 backdrop-blur-xl relative"
            >
              <AnimatePresence mode="wait">
                {hoveredIndex !== null && (
                  <motion.div
                    key={INSTITUTE_ITEMS[hoveredIndex].id}
                    initial={{ opacity: 0, scale: 0.94, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -10 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br relative",
                      INSTITUTE_ITEMS[hoveredIndex].visual.bgGradient
                    )}
                  >
                    {/* Ambient Glow Orbs */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7E4C]/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

                    {/* Card Top Tag */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 px-2 py-0.5 rounded bg-white/10 border border-white/10">
                        {INSTITUTE_ITEMS[hoveredIndex].visual.tag}
                      </span>
                      {hoveredIndex === 1 && (
                        <span className="w-2 h-2 rounded-full bg-[#FF7E4C] animate-pulse" />
                      )}
                    </div>

                    {/* Card Center Titles (Exact typography from Screenshot) */}
                    <div className="relative z-10 my-auto">
                      <h4 className="text-[26px] font-bold text-white tracking-[-0.03em] leading-[1.05] font-sans">
                        {INSTITUTE_ITEMS[hoveredIndex].visual.title}
                      </h4>
                      <p className="text-[16px] text-white/85 font-medium tracking-tight mt-1 font-sans">
                        {INSTITUTE_ITEMS[hoveredIndex].visual.subtitle}
                      </p>
                    </div>

                    {/* Card Bottom Meta */}
                    <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
                      <span>{INSTITUTE_ITEMS[hoveredIndex].badge}</span>
                      <span className="text-[#FF7E4C] font-semibold flex items-center gap-1">
                        Explore &rarr;
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>

      </div>

      {/* Interactive Detail Modal for Institute Items */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0E1017] border border-neutral-700/80 rounded-xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="mb-6">
                <span className="text-[#FF7E4C] text-xs font-mono uppercase tracking-wider font-bold">
                  {activeModalItem.type} · {activeModalItem.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1.5">
                  {activeModalItem.title}
                </h3>
                <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                  Produced by the Work AI Institute — delivering empirical research, field insights, and technical frameworks on how top global enterprises deploy AI with verified context and deterministic security.
                </p>
              </div>

              {/* Modal Body Preview */}
              <div className="p-5 rounded-lg bg-white/[0.03] border border-white/10 space-y-4 my-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-[#FF7E4C]/20 border border-[#FF7E4C]/30 flex items-center justify-center text-[#FF7E4C]">
                    {activeModalItem.type === "Report" && <BookOpen size={20} />}
                    {activeModalItem.type === "Podcast" && <Mic size={20} />}
                    {activeModalItem.type === "Quiz" && <HelpCircle size={20} />}
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-[15px]">{activeModalItem.visual.title} {activeModalItem.visual.subtitle}</h5>
                    <p className="text-xs text-neutral-400 font-mono">Published by Axios Work AI Institute • 2026 Edition</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  Access comprehensive findings, raw benchmark charts, and executive interview transcripts directly from our research team.
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs text-neutral-400">
                  Direct access without form gates.
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveModalItem(null)}
                    className="px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <Link
                    href="/get-a-demo"
                    onClick={() => setActiveModalItem(null)}
                    className="px-4.5 py-2 rounded-md bg-[#FF7E4C] hover:bg-[#E56F40] text-black font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Request Executive Briefing</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
