"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Lock, Shield, Zap, Sparkles } from "lucide-react";

interface Pillar {
  id: string;
  title: string;
  headline: string;
  description: string;
  iconType: "corners" | "grid" | "lock" | "lightning";
  visualDetails: {
    type: "graph" | "synthesis" | "acl" | "efficiency";
    title: string;
    badge: string;
    content: any;
  };
}

const PILLARS: Pillar[] = [
  {
    id: "context",
    title: "Context.",
    headline: "Integrated across enterprise tools your business runs on.",
    description: "Axios indexes your institutional memory across code, tickets, SOPs, and telemetry into a continuously synchronized knowledge graph with sub-second change data capture.",
    iconType: "corners",
    visualDetails: {
      type: "graph",
      title: "Active Enterprise Knowledge Graph",
      badge: "3.4B+ Enterprise Nodes",
      content: [
        { label: "Engineering Architecture RFCs", type: "Google Docs / Confluence", color: "bg-blue-500" },
        { label: "SEC-9021 Vulnerability Ticket", type: "Jira / GitHub Issues", color: "bg-indigo-500" },
        { label: "Production Kubernetes Telemetry", type: "Prometheus / Datadog", color: "bg-emerald-500" },
        { label: "SOC-2 Type II Audit Framework", type: "Compliance Engine", color: "bg-amber-500" },
        { label: "Global Technical Lead Directory", type: "IAM Roles & Okta Directory", color: "bg-purple-500" },
      ],
    },
  },
  {
    id: "intelligence",
    title: "Intelligence.",
    headline: "The right model and level of reasoning for every task.",
    description: "Every response is synthesized with exact citation provenance. Our hybrid retrieval engine cross-references queries against authoritative enterprise sources, eliminating hallucinations.",
    iconType: "grid",
    visualDetails: {
      type: "synthesis",
      title: "Multi-Model Grounded Synthesis",
      badge: "Zero-Hallucination Guardrails",
      content: [
        { title: "Query Intent Deconstruction", status: "Semantic Vector & BM25 Hybrid Graph Search" },
        { title: "Deterministic Document Retrieval", status: "Top 12 authoritative passages fetched across permissions" },
        { title: "Cross-Reference Verification", status: "100% Citation Provenance Verified before generation" },
        { title: "Model Inference Routing", status: "Optimal cost & latency frontier model dynamically selected" },
      ],
    },
  },
  {
    id: "permissions",
    title: "Permissions.",
    headline: "Secure, permission-aware access built in from day one.",
    description: "AI in the enterprise is only as good as its access controls. Axios mirrors permissions at the document, channel, and user level in real time. Employees only ever see what they are authorized to access.",
    iconType: "lock",
    visualDetails: {
      type: "acl",
      title: "Real-Time Identity & ACL Gatekeeper",
      badge: "14ms ACL Sync Latency",
      content: [
        { role: "Executive VP", access: "All Operations + Strategic Financials", status: "Allowed", statusColor: "text-emerald-700 bg-emerald-50" },
        { role: "Staff Engineer", access: "Engineering Repos + Cluster Telemetry", status: "Allowed", statusColor: "text-emerald-700 bg-emerald-50" },
        { role: "External Contractor", access: "Restricted to Assigned Ticket SEC-9021", status: "Sandboxed", statusColor: "text-amber-700 bg-amber-50" },
        { role: "Unauthorized Scope", access: "Confidential Payroll & Compensation", status: "Blocked (403)", statusColor: "text-rose-700 bg-rose-50" },
      ],
    },
  },
  {
    id: "efficiency",
    title: "Efficiency.",
    headline: "Pre-connected enterprise context reduces token waste.",
    description: "AI adoption is accelerating, but AI costs are accelerating faster. Axios uses semantic vector caching and multi-model task routing to slash token expenditure by up to 60% without sacrificing quality.",
    iconType: "lightning",
    visualDetails: {
      type: "efficiency",
      title: "Dynamic Token Caching & Cost Routing",
      badge: "19.6B+ Tokens Saved YTD",
      content: [
        { label: "Semantic Cache Hit Rate", value: "48.2%", note: "Zero LLM inference calls required" },
        { label: "Model Routing Strategy", value: "Smart Hybrid", note: "Fast SLM for triage, Frontier for deep reasoning" },
        { label: "Monthly Compute Saved", value: "$42,800+", note: "Across 2,500 active enterprise seats" },
      ],
    },
  },
];

export function ValuePropositionSection() {
  const [selectedId, setSelectedId] = useState<string>("context");
  const activePillar = PILLARS.find((p) => p.id === selectedId) || PILLARS[0];

  return (
    <section id="problem-statement" className="border-t border-neutral-200 bg-white font-sans overflow-hidden">
      <div className="max-w-[1120px] mx-auto border-x border-neutral-200">
        
        {/* Top Row: Left 3-Line Heading + Right Token Savings Card (Matches Reference Exactly) */}
        <div className="px-6 sm:px-12 lg:px-16 xl:pl-20 py-12 sm:py-16 lg:py-20 flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-14">
          
          {/* Left: 3-Tier Bold Statement */}
          <div className="max-w-2xl">
            <h2 className="text-[34px] sm:text-[46px] lg:text-[54px] font-bold tracking-[-0.038em] leading-[1.08] text-neutral-900 font-sans">
              <span className="block text-neutral-900">AI adoption is accelerating.</span>
              <span className="block text-neutral-700">AI costs are accelerating faster.</span>
              <span className="block text-neutral-500">Axios is built for enterprise scale.</span>
            </h2>
          </div>

          {/* Right: Metric Card with Diagonal Hatch Pattern & Dotted Trend Curve */}
          <div className="relative rounded-lg border border-neutral-200/90 overflow-hidden p-6 sm:p-7 w-full lg:w-[480px] shrink-0 bg-white shadow-xs">
            {/* Fine Diagonal Hatch Pattern */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, #000000 0, #000000 0.8px, transparent 0.8px, transparent 7px)",
                opacity: 0.035,
              }}
            />

            <div className="relative z-10 flex flex-col justify-between min-h-[120px]">
              {/* Black Rounded Square Icon with Token Waves */}
              <div className="w-9 h-9 rounded-md bg-black text-white flex items-center justify-center shrink-0 shadow-xs mb-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="5" cy="12" r="2.5" />
                  <path d="M10 7.5c2.3 2.3 2.3 6.7 0 9" />
                  <path d="M14 4.5c3.8 3.8 3.8 11.2 0 15" />
                </svg>
              </div>

              {/* Text Label + Big Numeral */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-6">
                <div>
                  <p className="text-[13px] sm:text-[14px] text-neutral-600 font-normal font-sans leading-tight">
                    Average token<br /> savings YTD:
                  </p>
                </div>
                <div className="text-[34px] sm:text-[42px] font-bold text-neutral-900 tracking-[-0.03em] font-sans tabular-nums leading-none">
                  19,600,506,465
                </div>
              </div>
            </div>

            {/* Rising Dotted Trendline along Bottom */}
            <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none overflow-hidden">
              <svg viewBox="0 0 500 80" preserveAspectRatio="none" className="w-full h-full text-neutral-300">
                <path
                  d="M 0,72 Q 130,68 240,55 T 400,30 T 500,8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeDasharray="3 3"
                />
              </svg>
            </div>
          </div>

        </div>

        {/* Horizontal Hairline Divider */}
        <div className="border-t border-neutral-200" />

        {/* 4 Equal Interactive Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
          {PILLARS.map((pillar) => {
            const isSelected = selectedId === pillar.id;

            return (
              <button
                key={pillar.id}
                onClick={() => setSelectedId(pillar.id)}
                className={cn(
                  "p-6 sm:p-8 text-left transition-all duration-150 flex flex-col justify-start relative group cursor-pointer focus:outline-none",
                  isSelected ? "bg-[#FAFBFD]" : "bg-white hover:bg-[#FCFCFD]"
                )}
              >
                {/* Active Indicator Top Line */}
                {isSelected && (
                  <motion.div
                    layoutId="pillarActiveIndicator"
                    className="absolute top-0 left-0 right-0 h-[2px] bg-neutral-900"
                  />
                )}

                {/* Pillar Icon */}
                <div className="mb-5 text-neutral-800">
                  {pillar.iconType === "corners" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 8V4h4" />
                      <path d="M20 8V4h-4" />
                      <path d="M4 16v4h4" />
                      <path d="M20 16v4h-4" />
                    </svg>
                  )}
                  {pillar.iconType === "grid" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="8" cy="6" r="1.3" />
                      <circle cx="16" cy="6" r="1.3" />
                      <circle cx="8" cy="12" r="1.3" />
                      <circle cx="16" cy="12" r="1.3" />
                      <circle cx="8" cy="18" r="1.3" />
                      <circle cx="16" cy="18" r="1.3" />
                    </svg>
                  )}
                  {pillar.iconType === "lock" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                  )}
                  {pillar.iconType === "lightning" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  )}
                </div>

                {/* Title + Description Inline */}
                <p className="text-[14px] sm:text-[15px] leading-relaxed font-sans">
                  <span className="font-bold text-neutral-900 mr-1.5">{pillar.title}</span>
                  <span className="text-neutral-500 font-normal">{pillar.headline}</span>
                </p>
              </button>
            );
          })}
        </div>

        {/* Interactive Architecture Visualizer for Selected Pillar */}
        <div className="border-t border-neutral-200 bg-[#FAFAFC] p-6 sm:p-10 lg:p-12">
          <div className="max-w-4xl mx-auto rounded-lg border border-neutral-200/90 bg-white shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-neutral-100 gap-2">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#1F45EC] font-semibold block">
                  {activePillar.title} Architecture Explorer
                </span>
                <h4 className="text-base font-bold text-neutral-900 mt-0.5">
                  {activePillar.visualDetails.title}
                </h4>
              </div>
              <div className="px-2.5 py-0.5 rounded-md border border-neutral-200 bg-neutral-50 text-[11px] font-mono font-medium text-neutral-600 self-start sm:self-auto">
                {activePillar.visualDetails.badge}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activePillar.visualDetails.type === "graph" && (
                  <div className="space-y-2.5">
                    {activePillar.visualDetails.content.map((node: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-md bg-neutral-50/80 border border-neutral-200/70 text-xs sm:text-[13px]"
                      >
                        <div className="flex items-center gap-3 font-medium text-neutral-900">
                          <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", node.color)} />
                          <span>{node.label}</span>
                        </div>
                        <span className="font-mono text-neutral-400 text-[11px]">
                          {node.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activePillar.visualDetails.type === "synthesis" && (
                  <div className="space-y-3">
                    {activePillar.visualDetails.content.map((step: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-md bg-neutral-50/80 border border-neutral-200/70 flex items-start gap-3.5 text-xs sm:text-[13px]"
                      >
                        <div className="w-5 h-5 rounded-md bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900">{step.title}</div>
                          <div className="text-neutral-500 text-[11px] mt-0.5 font-mono">{step.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activePillar.visualDetails.type === "acl" && (
                  <div className="space-y-2.5">
                    {activePillar.visualDetails.content.map((row: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-md bg-neutral-50/80 border border-neutral-200/70 flex items-center justify-between text-xs sm:text-[13px]"
                      >
                        <div>
                          <span className="font-bold text-neutral-900 block">{row.role}</span>
                          <span className="text-neutral-500 text-[11px]">{row.access}</span>
                        </div>
                        <span className={cn("px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium", row.statusColor)}>
                          {row.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activePillar.visualDetails.type === "efficiency" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activePillar.visualDetails.content.map((stat: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-md bg-neutral-50/80 border border-neutral-200/70 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[11px] font-mono text-neutral-500 uppercase">{stat.label}</span>
                          <div className="text-xl sm:text-2xl font-bold text-neutral-900 font-sans mt-1">
                            {stat.value}
                          </div>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-2 font-mono">{stat.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
              <span className="text-neutral-500 font-sans">
                {activePillar.description}
              </span>
              <a
                href="/products/workforce-copilot"
                className="font-medium text-[#1F45EC] hover:text-[#1538D4] inline-flex items-center gap-1 shrink-0 ml-4"
              >
                Learn more <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
