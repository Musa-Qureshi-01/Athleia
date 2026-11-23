"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Minus,
  ArrowRight,
  ArrowUpRight,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BookingLogo,
  ZillowLogo,
  TimeLogo,
  EricssonLogo,
  GCashLogo,
  DBSLogo,
} from "@/components/visuals/CustomerLogos";

interface StoryItem {
  id: string;
  name: string;
  headline: string;
  logo: React.ElementType;
  summary: string;
  metrics: Array<{ value: string; label: string }>;
  image: string;
  imageAlt: string;
  linkText: string;
  linkHref: string;
}

const STORIES: StoryItem[] = [
  {
    id: "booking",
    name: "Booking.com",
    headline: "Booking.com scales AI across 14,000 employees with Axios.",
    logo: BookingLogo,
    summary:
      "Axios became Booking.com's first AI platform adopted company-wide, helping teams find answers faster and turn everyday work into practical AI workflows.",
    metrics: [
      { value: "14k", label: "Employees" },
      { value: "1st", label: "AI platform adopted worldwide" },
      { value: "500k+", label: "monthly survey responses" },
    ],
    image: "/images/platform-booking.png",
    imageAlt: "Booking.com global operations",
    linkText: "See customer story",
    linkHref: "/customers",
  },
  {
    id: "zillow",
    name: "Zillow",
    headline: "Zillow builds an AI-forward culture with Axios.",
    logo: ZillowLogo,
    summary:
      "Integrated Axios across architectural CAD repositories, GitHub blueprints, and internal engineering documentation, turning dense technical specs into instant, verified answers.",
    metrics: [
      { value: "3.8 hrs", label: "Saved per engineer weekly" },
      { value: "94%", label: "Engineering team adoption" },
      { value: "100+", label: "Repositories & architectures indexed" },
    ],
    image: "/images/platform-booking.png",
    imageAlt: "Zillow engineering architecture",
    linkText: "See customer story",
    linkHref: "/customers",
  },
  {
    id: "time",
    name: "TIME",
    headline: "TIME turns a century of archives into working knowledge.",
    logo: TimeLogo,
    summary:
      "Digitized and indexed 100+ years of historic journalism archives, field notes, and editorial drafts into an intelligent, semantic AI knowledge layer.",
    metrics: [
      { value: "100+ yrs", label: "Of journalism archives indexed" },
      { value: "1.2M", label: "Historical articles & drafts" },
      { value: "3.2x", label: "Faster investigative research speed" },
    ],
    image: "/images/leader-time.png",
    imageAlt: "TIME historic editorial archives",
    linkText: "See customer story",
    linkHref: "/customers",
  },
  {
    id: "ericsson",
    name: "Ericsson",
    headline: "Ericsson scales secure, contextual AI with Axios.",
    logo: EricssonLogo,
    summary:
      "Operating in telecommunications infrastructure requires zero tolerance for data leaks. Axios deployed with strict air-gapped VPC ACL isolation to serve global engineering operations.",
    metrics: [
      { value: "100%", label: "Zero-retention VPC compliance" },
      { value: "40+", label: "Global telecom clusters deployed" },
      { value: "<15ms", label: "ACL permission lookup latency" },
    ],
    image: "/images/platform-booking.png",
    imageAlt: "Ericsson telecom network security",
    linkText: "See customer story",
    linkHref: "/customers",
  },
  {
    id: "gcash",
    name: "GCash",
    headline: "GCash gives every team trusted context to move faster.",
    logo: GCashLogo,
    summary:
      "Handling high-consequence operations requires continuous compliance. Axios unifies financial runbooks, SOPs, and regulatory filings with verified audit provenance.",
    metrics: [
      { value: "52%", label: "Faster compliance & safety turnaround" },
      { value: "99.9%", label: "Data boundary isolation rate" },
      { value: "10k+", label: "Team members actively empowered" },
    ],
    image: "/images/platform-booking.png",
    imageAlt: "GCash regulatory compliance",
    linkText: "See customer story",
    linkHref: "/customers",
  },
];

interface LeaderCard {
  id: string;
  name: string;
  logo: React.ElementType;
  quote: string;
  author: string;
  title: string;
  image: string;
  isVideo?: boolean;
  bgGradient: string;
}

const LEADERS: LeaderCard[] = [
  {
    id: "dbs",
    name: "DBS",
    logo: DBSLogo,
    quote:
      "The vision was to marry enterprise knowledge with world knowledge to help employees work faster, smarter, better.",
    author: "Nimish Panchmatia",
    title: "CTO, DBS Bank",
    image: "/images/leader-dbs.png",
    isVideo: true,
    bgGradient: "from-black/95 via-black/45 to-black/20",
  },
  {
    id: "booking",
    name: "Booking.com",
    logo: BookingLogo,
    quote:
      "Axios helps you get work done, rather than just find information. The moment we launched Axios, there was so much positivity.",
    author: "Tadeu Faedrick",
    title: "Senior Engineer Manager, Booking.com",
    image: "/images/platform-booking.png",
    isVideo: false,
    bgGradient: "from-[#001D4A]/95 via-[#002B66]/70 to-[#003580]/40",
  },
  {
    id: "time",
    name: "TIME",
    logo: TimeLogo,
    quote:
      "Turning a century of archives into working knowledge with instant semantic precision across 100+ years of journalism.",
    author: "Burhan Hamid",
    title: "Chief Technology Officer, TIME",
    image: "/images/leader-time.png",
    isVideo: false,
    bgGradient: "from-black/95 via-neutral-900/70 to-neutral-800/40",
  },
  {
    id: "zillow",
    name: "Zillow",
    logo: ZillowLogo,
    quote:
      "Axios gave our engineering teams the power to search complex architectural blueprints and codebases in milliseconds with zero guesswork.",
    author: "David Vapnek",
    title: "VP of Technology, Zillow",
    image: "/images/platform-booking.png",
    isVideo: false,
    bgGradient: "from-[#003254]/95 via-[#004B7A]/75 to-[#0066A2]/40",
  },
  {
    id: "ericsson",
    name: "Ericsson",
    logo: EricssonLogo,
    quote:
      "The ability to mirror complex enterprise access permissions in sub-second latency made Axios the only platform we could trust.",
    author: "Helena Norrman",
    title: "Head of Operations, Ericsson",
    image: "/images/platform-booking.png",
    isVideo: false,
    bgGradient: "from-neutral-950/95 via-neutral-900/75 to-neutral-800/40",
  },
  {
    id: "gcash",
    name: "GCash",
    logo: GCashLogo,
    quote:
      "Continuous compliance and safety auditing with deterministic provenance gives our leadership full operational confidence.",
    author: "Executive Leadership",
    title: "Risk & Compliance Operations, GCash",
    image: "/images/platform-booking.png",
    isVideo: false,
    bgGradient: "from-[#003B95]/95 via-[#0051C7]/75 to-[#0066FF]/40",
  },
];

export function CustomerStoriesSection() {
  const [openId, setOpenId] = useState<string | null>("booking");
  const [activeLeaderIndex, setActiveLeaderIndex] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const handlePrevLeader = () => {
    setActiveLeaderIndex((prev) => (prev > 0 ? prev - 1 : LEADERS.length - 1));
    scrollSliderTo(activeLeaderIndex > 0 ? activeLeaderIndex - 1 : LEADERS.length - 1);
  };

  const handleNextLeader = () => {
    setActiveLeaderIndex((prev) => (prev < LEADERS.length - 1 ? prev + 1 : 0));
    scrollSliderTo(activeLeaderIndex < LEADERS.length - 1 ? activeLeaderIndex + 1 : 0);
  };

  const scrollSliderTo = (idx: number) => {
    if (sliderRef.current) {
      const card = sliderRef.current.children[idx] as HTMLElement;
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  };

  const selectLeader = (idx: number) => {
    setActiveLeaderIndex(idx);
    scrollSliderTo(idx);
  };

  return (
    <section
      id="customers"
      className="bg-white border-t border-neutral-200 font-sans overflow-hidden scroll-mt-10"
    >
      <div className="max-w-[1280px] mx-auto border-x border-neutral-200 px-6 sm:px-12 lg:px-16 xl:pl-20 py-16 sm:py-20 lg:py-24">
        
        {/* ======================================================== */}
        {/* PART 1: "One platform. Every team." Accordion Section    */}
        {/* ======================================================== */}
        <div className="pb-4 mb-8 border-b border-neutral-200">
          <span className="text-[12px] sm:text-[13px] font-mono font-medium text-neutral-500 uppercase tracking-wider">
            One platform. Every team.
          </span>
        </div>

        {/* Section Header Grid: Left Headline | Middle Subtitle | Right Action Button */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-14">
          <div className="max-w-xl">
            <h2 className="text-[34px] sm:text-[46px] lg:text-[52px] font-bold tracking-[-0.035em] text-neutral-900 leading-[1.08] font-sans">
              Transforming every department with Enterprise AI.
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-[15px] sm:text-[16px] text-neutral-600 leading-relaxed font-sans">
              From engineering to sales to support to HR — Axios helps every department move faster with trusted AI.
            </p>
          </div>

          <div>
            <Link
              href="/customers"
              className="h-10 px-5 rounded-full bg-black hover:bg-neutral-800 text-white text-[13.5px] font-semibold flex items-center justify-center transition-colors shadow-xs whitespace-nowrap cursor-pointer"
            >
              See customer stories
            </Link>
          </div>
        </div>

        {/* Boxed Customer Accordion with authentic Glean layout */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white overflow-hidden shadow-xs divide-y divide-neutral-200">
          {STORIES.map((story) => {
            const isOpen = openId === story.id;
            const LogoComp = story.logo;

            return (
              <div
                key={story.id}
                className={cn(
                  "transition-colors duration-200",
                  isOpen ? "bg-[#FAF8F5]" : "bg-white hover:bg-neutral-50/70"
                )}
              >
                {/* Header Row */}
                <button
                  onClick={() => toggleItem(story.id)}
                  className="w-full px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between gap-4 sm:gap-8 text-left cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                    {/* Toggle Circle: Solid dark for open (X/minus), outline with (+) for closed */}
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors",
                        isOpen
                          ? "bg-black text-white"
                          : "border border-neutral-300 text-neutral-600 bg-white"
                      )}
                    >
                      {isOpen ? (
                        <span className="text-[13px] font-bold leading-none select-none">✕</span>
                      ) : (
                        <Plus size={13} strokeWidth={2.5} />
                      )}
                    </div>

                    {/* Customer Brand Logo */}
                    <div className="w-24 sm:w-32 shrink-0 text-neutral-900 flex items-center">
                      <LogoComp className="h-5 sm:h-5.5 w-auto text-current" />
                    </div>

                    {/* Headline Statement */}
                    <p className="text-[14.5px] sm:text-[16px] font-medium text-neutral-900 font-sans tracking-tight truncate sm:whitespace-normal">
                      {story.headline}
                    </p>
                  </div>
                </button>

                {/* Expanded Content Drawer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 sm:px-8 sm:pb-10 pt-2 border-t border-neutral-200/50">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                          
                          {/* Left Column: 3 Metric Stats + Paragraph + Link */}
                          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                            
                            {/* 3 Metric Columns with vertical dividers */}
                            <div className="flex items-start gap-4 sm:gap-8 pt-2">
                              {story.metrics.map((m, idx) => (
                                <div key={idx} className="flex items-start gap-4 sm:gap-8">
                                  <div>
                                    <div className="text-[30px] sm:text-[38px] font-bold text-neutral-900 tracking-tight leading-none font-sans">
                                      {m.value}
                                    </div>
                                    <div className="text-[12px] sm:text-[13px] text-neutral-500 font-sans mt-2 leading-tight">
                                      {m.label}
                                    </div>
                                  </div>
                                  {idx < story.metrics.length - 1 && (
                                    <div className="w-px h-12 bg-neutral-200 shrink-0 self-center" />
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Body Paragraph */}
                            <p className="text-[14px] sm:text-[15px] text-neutral-600 leading-relaxed font-sans max-w-xl">
                              {story.summary}
                            </p>

                            {/* Customer Story CTA Link */}
                            <div>
                              <Link
                                href={story.linkHref}
                                className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-[#1F45EC] hover:underline group"
                              >
                                <span className="w-2 h-2 rounded-full bg-[#1F45EC] inline-block" />
                                <span>{story.linkText}</span>
                              </Link>
                            </div>
                          </div>

                          {/* Right Column: High Quality Image */}
                          <div className="lg:col-span-5">
                            <div className="rounded-xl overflow-hidden aspect-[4/3] relative border border-neutral-200/80 shadow-xs bg-neutral-100">
                              <img
                                src={story.image}
                                alt={story.imageAlt}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* PART 2: "Trusted by today's leaders" Slider / Carousel   */}
        {/* ======================================================== */}
        <div className="pt-20 sm:pt-28 mt-4">
          
          {/* Header Row: Title on Left, Pagination Indicators & Nav on Right */}
          <div className="flex items-center justify-between gap-6 mb-8 sm:mb-10">
            <h2 className="text-[28px] sm:text-[38px] lg:text-[44px] font-bold tracking-tight text-neutral-900 font-sans">
              Trusted by today&apos;s leaders
            </h2>

            <div className="flex items-center gap-4">
              {/* Dots and Active Capsule Bar */}
              <div className="hidden sm:flex items-center gap-1.5">
                {LEADERS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectLeader(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                      activeLeaderIndex === idx
                        ? "w-7 bg-neutral-900"
                        : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Chevrons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevLeader}
                  className="w-9 h-9 rounded-full border border-neutral-300 hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-black transition-colors cursor-pointer"
                  aria-label="Previous leader story"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextLeader}
                  className="w-9 h-9 rounded-full border border-neutral-300 hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-black transition-colors cursor-pointer"
                  aria-label="Next leader story"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Track */}
          <div
            ref={sliderRef}
            className="flex items-stretch gap-5 overflow-x-auto scrollbar-none pb-4 pt-1 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {LEADERS.map((leader, idx) => {
              const isSelected = activeLeaderIndex === idx;
              const LogoComp = leader.logo;

              return (
                <div
                  key={leader.id}
                  onClick={() => selectLeader(idx)}
                  className={cn(
                    "snap-center shrink-0 rounded-2xl relative overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between p-6 sm:p-8 select-none",
                    isSelected
                      ? "w-[85vw] sm:w-[580px] md:w-[640px] h-[400px] sm:h-[450px] shadow-lg ring-1 ring-black/10"
                      : "w-[240px] sm:w-[280px] md:w-[300px] h-[400px] sm:h-[450px] opacity-80 hover:opacity-100"
                  )}
                >
                  {/* Background Image & Gradient Overlay */}
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t",
                      leader.bgGradient
                    )}
                  />

                  {/* Top Bar: Brand Logo on Left, Action Circles on Right */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="text-white drop-shadow-sm">
                      <LogoComp className="h-5 sm:h-6 w-auto text-white" />
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected && leader.isVideo && (
                        <div className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all shadow-xs">
                          <Play size={13} className="ml-0.5 fill-white" />
                        </div>
                      )}
                      <div className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all shadow-xs">
                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Content: High-Impact Quote & Author */}
                  <div className="relative z-10 text-white">
                    <blockquote
                      className={cn(
                        "font-medium leading-snug drop-shadow-sm tracking-tight",
                        isSelected
                          ? "text-[16px] sm:text-[20px] max-w-xl"
                          : "text-[13.5px] line-clamp-4 text-white/90"
                      )}
                    >
                      &ldquo;{leader.quote}&rdquo;
                    </blockquote>

                    <div className="mt-4 pt-3 border-t border-white/20 flex flex-col">
                      <span className="text-[13px] sm:text-[14px] font-semibold text-white">
                        {leader.author}
                      </span>
                      <span className="text-[11px] sm:text-[12px] text-white/75 font-sans mt-0.5">
                        {leader.title}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
