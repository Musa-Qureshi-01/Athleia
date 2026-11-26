"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  Lock,
  Layers,
  Database,
  Share2,
  ExternalLink,
  Bot,
  Send,
  Paperclip,
  X,
  MessageSquare,
  FileText,
  Users,
  GitBranch,
} from "lucide-react";
import { TopAnnouncementBar } from "@/components/layouts/TopAnnouncementBar";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { cn } from "@/lib/utils";

// Graph node definitions for interactive hero visualization
const HERO_GRAPH_NODES = [
  { id: "core", label: "Enterprise Core", x: 50, y: 52, color: "#3B82F6", size: 14, isRoot: true },
  { id: "memory", label: "Memory", x: 74, y: 44, color: "#FF7E4C", size: 10 },
  { id: "agents", label: "Independent agents", x: 56, y: 64, color: "#FF7E4C", size: 9 },
  { id: "autoroute", label: "Auto routing", x: 36, y: 18, color: "#FF7E4C", size: 10 },
  { id: "gateway", label: "AI Gateway", x: 88, y: 22, color: "#FF7E4C", size: 10 },
  { id: "transform", label: "Axios transform", x: 18, y: 34, color: "#FF7E4C", size: 9 },
  { id: "skills_mine", label: "Skills mining", x: 62, y: 28, color: "#FF7E4C", size: 9 },
  { id: "indexing", label: "Indexing Service", x: 92, y: 38, color: "#FF7E4C", size: 9 },
  { id: "go_feat", label: "GO Features", x: 42, y: 48, color: "#FF7E4C", size: 9 },
  { id: "skills_scan", label: "Skills scanning", x: 22, y: 62, color: "#FF7E4C", size: 8 },
  { id: "models", label: "Unified model management", x: 28, y: 84, color: "#FF7E4C", size: 9 },
  { id: "collab", label: "Collaborators", x: 94, y: 62, color: "#FF7E4C", size: 9 },
];

const HERO_GRAPH_EDGES = [
  ["core", "memory"],
  ["core", "agents"],
  ["core", "go_feat"],
  ["core", "skills_mine"],
  ["core", "models"],
  ["memory", "gateway"],
  ["memory", "indexing"],
  ["memory", "collab"],
  ["autoroute", "transform"],
  ["autoroute", "skills_mine"],
  ["transform", "go_feat"],
  ["skills_scan", "agents"],
  ["skills_scan", "transform"],
  ["agents", "models"],
  ["skills_mine", "gateway"],
];

export default function EnterpriseContextPage() {
  const [activeHoverNode, setActiveHoverNode] = useState<string | null>(null);
  const [showEntityPopup, setShowEntityPopup] = useState(true);
  const [activeTab, setActiveTab] = useState<"graph" | "chat">("chat");

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-[#1F45EC]/15 selection:text-[#1F45EC] font-sans antialiased">
      {/* 1. Top Announcement Bar */}
      <TopAnnouncementBar />

      {/* 2. Primary Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION: Give AI the context to work the way your company does.      */}
        {/* ========================================================================= */}
        <section className="relative pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 overflow-hidden bg-white border-b border-neutral-200">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-14">
            
            {/* Top Eyebrow Tag */}
            <div className="mb-4">
              <span className="text-[12px] sm:text-[13px] font-mono font-medium text-neutral-500 uppercase tracking-wider">
                Axios Enterprise Context
              </span>
            </div>

            {/* Hero Main Grid: Left Copy & CTA | Right Interactive Enterprise Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              
              {/* Left Column (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <h1 className="text-[38px] sm:text-[50px] lg:text-[58px] font-bold tracking-[-0.04em] leading-[1.05] text-neutral-900 font-sans">
                  Give AI the context to work the way your company does.
                </h1>

                <p className="text-[16px] sm:text-[17px] text-neutral-600 leading-relaxed font-sans max-w-lg">
                  Axios connects your apps and maps the relationships and processes within your company. Index your data once, then use it everywhere to produce ready-to-use outputs, surface strategic insights, and automate work.
                </p>

                <div className="pt-2 flex items-center gap-4">
                  <Link
                    href="/get-a-demo"
                    className="h-11 px-6 rounded-lg bg-black hover:bg-neutral-800 text-white font-semibold text-[14px] flex items-center justify-center transition-colors shadow-xs cursor-pointer whitespace-nowrap"
                  >
                    Get a demo
                  </Link>
                  <Link
                    href="#enterprise-graph"
                    className="h-11 px-5 rounded-lg border border-neutral-300 hover:border-neutral-400 text-neutral-800 font-medium text-[14px] flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Explore Enterprise Graph
                  </Link>
                </div>
              </div>

              {/* Right Column: Hero Visual — 3D Iridescent Wave + Interactive Enterprise Graph Card (7 cols) */}
              <div className="lg:col-span-7 relative">
                {/* 3D Iridescent Fluid Backdrop matching Glean Image 1 */}
                <div className="relative rounded-md overflow-hidden border border-neutral-200/80 shadow-xl bg-[#0F1117] p-2 sm:p-4">
                  
                  {/* Fluid Wave Texture in background */}
                  <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
                    <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-600/40 via-cyan-400/20 to-transparent blur-3xl" />
                    <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-purple-600/30 via-pink-500/20 to-transparent blur-3xl" />
                  </div>

                  {/* Dark Charcoal Graph Card matching Screenshot */}
                  <div className="relative rounded-md bg-[#141620]/95 border border-white/10 p-4 sm:p-6 min-h-[380px] sm:min-h-[440px] flex flex-col justify-between overflow-hidden">
                    
                    {/* Top Status Bar */}
                    <div className="flex items-center justify-between text-xs text-white/50 font-mono pb-3 border-b border-white/10 z-10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white/80 font-medium">Enterprise Knowledge Graph</span>
                      </div>
                      <span className="text-[11px]">1,000+ live relational signals</span>
                    </div>

                    {/* SVG Interactive Canvas */}
                    <div className="relative flex-1 my-3 select-none">
                      <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Connecting Arcs */}
                        {HERO_GRAPH_EDGES.map(([srcId, dstId], i) => {
                          const src = HERO_GRAPH_NODES.find((n) => n.id === srcId)!;
                          const dst = HERO_GRAPH_NODES.find((n) => n.id === dstId)!;
                          const isHighlighted = activeHoverNode === srcId || activeHoverNode === dstId;

                          return (
                            <line
                              key={i}
                              x1={src.x}
                              y1={src.y}
                              x2={dst.x}
                              y2={dst.y}
                              stroke={isHighlighted ? "rgba(255, 126, 76, 0.7)" : "rgba(255, 255, 255, 0.12)"}
                              strokeWidth={isHighlighted ? "0.6" : "0.3"}
                            />
                          );
                        })}
                      </svg>

                      {/* Render Nodes */}
                      {HERO_GRAPH_NODES.map((node) => {
                        const isHovered = activeHoverNode === node.id;

                        return (
                          <div
                            key={node.id}
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                            onMouseEnter={() => setActiveHoverNode(node.id)}
                            onMouseLeave={() => setActiveHoverNode(null)}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                          >
                            <div className="flex items-center gap-1.5">
                              {/* Glowing Dot */}
                              <div
                                style={{
                                  backgroundColor: node.color,
                                  boxShadow: isHovered
                                    ? `0 0 16px ${node.color}`
                                    : `0 0 8px ${node.color}66`,
                                }}
                                className={cn(
                                  "rounded-full transition-all duration-200",
                                  node.isRoot ? "w-3.5 h-3.5 ring-4 ring-blue-500/20" : "w-2.5 h-2.5"
                                )}
                              />

                              {/* Label */}
                              <span
                                className={cn(
                                  "text-[10.5px] sm:text-[11.5px] font-sans whitespace-nowrap transition-all duration-150",
                                  isHovered
                                    ? "text-white font-bold translate-x-0.5"
                                    : "text-white/70 font-normal group-hover:text-white"
                                )}
                              >
                                {node.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Metadata Bar */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50 z-10">
                      <span>Mapped across Okta, Slack, Google Drive, Jira &amp; Salesforce</span>
                      <span className="text-white/80">Deterministic ACL Verified</span>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* 3 Number Callout Bar (Matches Image 1 Exactly) */}
            <div className="mt-14 sm:mt-18 pt-10 border-t border-neutral-200">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                
                {/* 1st Metric: 275+ Connectors */}
                <div className="py-6 md:py-0 md:px-8 first:pl-0">
                  <div className="text-[44px] sm:text-[54px] font-bold text-neutral-900 tracking-[-0.04em] font-sans leading-none mb-3">
                    275+
                  </div>
                  <p className="text-[14px] sm:text-[15px] text-neutral-600 font-sans leading-relaxed">
                    Connectors across apps, documents, tickets, chat, and code
                  </p>
                </div>

                {/* 2nd Metric: 1000+ Signals */}
                <div className="py-6 md:py-0 md:px-8">
                  <div className="text-[44px] sm:text-[54px] font-bold text-neutral-900 tracking-[-0.04em] font-sans leading-none mb-3">
                    1000+
                  </div>
                  <p className="text-[14px] sm:text-[15px] text-neutral-600 font-sans leading-relaxed">
                    Signals in the Enterprise Graph mapping people, content, and relationships
                  </p>
                </div>

                {/* 3rd Metric: Any AI front doors */}
                <div className="py-6 md:py-0 md:px-8 last:pr-0">
                  <div className="text-[44px] sm:text-[54px] font-bold text-neutral-900 tracking-[-0.04em] font-sans leading-none mb-3">
                    Any
                  </div>
                  <p className="text-[14px] sm:text-[15px] text-neutral-600 font-sans leading-relaxed">
                    AI front doors that support Axios context via MCP, APIs, and custom integrations
                  </p>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: Enterprise Graph — Context with depth and breadth              */}
        {/* ========================================================================= */}
        <section id="enterprise-graph" className="py-16 sm:py-24 bg-[#FAFAFC] border-b border-neutral-200 font-sans">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-14">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
              
              {/* Left Column: Heading & Editorial Explanation (5 cols) */}
              <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-28">
                <span className="text-[12px] sm:text-[13px] font-mono font-medium text-neutral-500 uppercase tracking-wider block">
                  Enterprise Graph
                </span>

                <h2 className="text-[34px] sm:text-[44px] lg:text-[48px] font-bold text-neutral-900 tracking-[-0.035em] leading-[1.1] font-sans">
                  Context with depth and breadth
                </h2>

                <p className="text-[15px] sm:text-[16px] text-neutral-600 leading-relaxed font-sans">
                  Most AI tools see a slice of your data. Axios sees the full picture. With 275+ connectors, it builds an Enterprise Graph that captures not just content but the relationships between people, data, and activity across your organization.
                </p>

                {/* Value bullets */}
                <div className="space-y-3 pt-3">
                  <div className="flex items-start gap-3 text-xs sm:text-[13.5px] text-neutral-700">
                    <CheckCircle2 size={16} className="text-[#1F45EC] shrink-0 mt-0.5" />
                    <span>Discovers non-obvious cross-functional overlaps before duplicate work begins.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs sm:text-[13.5px] text-neutral-700">
                    <CheckCircle2 size={16} className="text-[#1F45EC] shrink-0 mt-0.5" />
                    <span>Respects source permission models down to document-level ACLs.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs sm:text-[13.5px] text-neutral-700">
                    <CheckCircle2 size={16} className="text-[#1F45EC] shrink-0 mt-0.5" />
                    <span>Surfaces who to talk to, what code to review, and what projects already exist.</span>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Fidelity Interactive Graph + Conversational UI Mockup (7 cols) */}
              <div className="lg:col-span-7">
                <div className="rounded-md border border-neutral-300/80 bg-white shadow-xl overflow-hidden">
                  
                  {/* Top Mockup Header Bar */}
                  <div className="px-5 py-3.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-500 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                      <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                      <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                      <span className="ml-2 font-semibold text-neutral-700">Axios Enterprise Assistant · Graph Inspector</span>
                    </div>
                    <span>Frasier Automotive Corp</span>
                  </div>

                  {/* Conversational Prompt Box */}
                  <div className="p-6 sm:p-8 space-y-6">
                    
                    {/* User Message Bubble */}
                    <div className="flex justify-end">
                      <div className="max-w-xl bg-neutral-100/90 rounded-md rounded-tr-sm px-5 py-3.5 text-[14px] sm:text-[15px] text-neutral-900 font-sans leading-relaxed">
                        Is anyone already building a way to predict which parts each dealership will run out of? Who should I talk to first?
                      </div>
                    </div>

                    {/* AI Response Bubble */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                        <span className="text-neutral-400">Show work &rsaquo;</span>
                      </div>

                      <div className="text-[14.5px] sm:text-[15.5px] text-neutral-800 leading-relaxed font-sans space-y-3">
                        <p>
                          Yes &mdash; two teams are already building versions of this, and they don&apos;t appear to know about each other. Start with these two people:
                        </p>

                        <ul className="space-y-3.5 pl-1">
                          <li className="flex items-start gap-2.5">
                            <span className="text-neutral-400 mt-1.5">•</span>
                            <div>
                              <strong className="font-semibold text-neutral-900 border-b border-dotted border-neutral-400">Maren Okonkwo</strong>
                              <span className="text-neutral-600"> &mdash; a data scientist and the only person contributing to both efforts. She is the single point of overlap between them, which makes her the fastest way to avoid repeating work that is already underway.</span>
                            </div>
                          </li>

                          <li className="flex items-start gap-2.5">
                            <span className="text-neutral-400 mt-1.5">•</span>
                            <div>
                              <strong className="font-semibold text-neutral-900 border-b border-dotted border-neutral-400">Devesh Kapadia</strong>
                              <span className="text-neutral-600"> &mdash; has the longest history here. He wrote the original parts demand model in March, and the newer team&apos;s approach doc appears to have arrived at similar assumptions independently, without citing his.</span>
                            </div>
                          </li>

                          <li className="flex items-start gap-2.5">
                            <span className="text-neutral-400 mt-1.5">•</span>
                            <div>
                              <span>Devesh&apos;s team runs </span>
                              
                              {/* Interactive Entity Trigger Button with Hover Card */}
                              <span className="relative inline-block">
                                <button
                                  onClick={() => setShowEntityPopup(!showEntityPopup)}
                                  className="font-bold text-neutral-900 border-b-2 border-neutral-900 hover:text-[#1F45EC] hover:border-[#1F45EC] transition-colors cursor-pointer"
                                >
                                  Dealer Inventory Signals
                                </button>

                                {/* Entity Details Hover Card (Matches Screenshot Image 3 Exactly) */}
                                <AnimatePresence>
                                  {showEntityPopup && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                      className="absolute left-0 top-full mt-2 w-[340px] sm:w-[380px] bg-white rounded-lg border border-neutral-200/90 shadow-2xl p-5 text-left z-30"
                                    >
                                      <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2">
                                        Generated by Axios from your enterprise knowledge
                                      </div>

                                      <div className="flex items-start gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-md bg-[#FF7E4C] text-white flex items-center justify-center font-bold text-sm shrink-0">
                                          D
                                        </div>
                                        <div>
                                          <h4 className="font-bold text-[15px] text-neutral-900 leading-tight">
                                            Dealer Inventory Signals
                                          </h4>
                                          <span className="text-xs text-neutral-500 font-mono">Project</span>
                                        </div>
                                      </div>

                                      <p className="text-[12.5px] text-neutral-600 leading-relaxed mb-4">
                                        Weekly per-dealer parts demand prediction built on point-of-sale and warranty-claim signals, used by Supply Chain Analytics to set regional replenishment targets and flag stockout risk ahead of seasonal peaks.
                                      </p>

                                      <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                                        <button className="w-full text-left p-2 rounded-md hover:bg-neutral-50 text-[12px] text-neutral-700 flex items-center justify-between cursor-pointer">
                                          <span>↳ What&apos;s the status of this project?</span>
                                          <ArrowRight size={12} className="text-neutral-400" />
                                        </button>
                                        <button className="w-full text-left p-2 rounded-md hover:bg-neutral-50 text-[12px] text-neutral-700 flex items-center justify-between cursor-pointer">
                                          <span>↳ Why does this project matter to Frasier Automotive?</span>
                                          <ArrowRight size={12} className="text-neutral-400" />
                                        </button>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </span>

                              <span> under Supply Chain Analytics to forecast stockout risk ahead of peak maintenance seasons.</span>
                            </div>
                          </li>
                        </ul>
                      </div>

                      {/* Source Badges */}
                      <div className="pt-3 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100">
                        <div className="flex items-center gap-2">
                          <span className="flex -space-x-1">
                            <span className="w-5 h-5 rounded-full bg-blue-100 border border-white flex items-center justify-center text-[9px] font-bold text-blue-700">S</span>
                            <span className="w-5 h-5 rounded-full bg-emerald-100 border border-white flex items-center justify-center text-[9px] font-bold text-emerald-700">D</span>
                            <span className="w-5 h-5 rounded-full bg-purple-100 border border-white flex items-center justify-center text-[9px] font-bold text-purple-700">J</span>
                          </span>
                          <span className="font-mono text-[11px]">3 verified sources</span>
                        </div>
                        <span className="font-mono text-[11px] text-neutral-400">Strict ACL Enforced</span>
                      </div>

                    </div>

                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: Proactive AI — Proactive AI that gets work done.              */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 bg-white border-b border-neutral-200 font-sans">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-14">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              
              {/* Left Column: Proactive Action & Draft Cards Mockup (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* 1st Proactive Card: Slack auto-routing message */}
                <div className="p-4 sm:p-5 rounded-lg border border-neutral-200 bg-neutral-50/70 shadow-xs hover:border-neutral-300 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-bold text-[13.5px] text-neutral-900">Update for #auto-routing</span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">Slack message draft</span>
                  </div>
                  <p className="text-[13px] text-neutral-600 leading-relaxed">
                    Nikhil asked about roadmap updates yesterday in #assistant-core. Drafted a message around your latest work on multi-tenant routing.
                  </p>
                </div>

                {/* 2nd Proactive Card: Email draft */}
                <div className="p-4 sm:p-5 rounded-lg border border-neutral-200 bg-neutral-50/70 shadow-xs hover:border-neutral-300 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="font-bold text-[13.5px] text-neutral-900">Reply to Amy about Acme&apos;s skills beta</span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">Gmail draft</span>
                  </div>
                  <p className="text-[13px] text-neutral-600 leading-relaxed">
                    Amy asked if Acme can be put on the beta list for skills yesterday. Drafted a response from rollout spec.
                  </p>
                </div>

                {/* 3rd Card: Active Message Composer Window matching Screenshot */}
                <div className="rounded-lg border border-neutral-300/90 bg-white shadow-lg p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100 text-xs">
                    <span className="font-bold text-neutral-800">New message</span>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-neutral-100 rounded text-neutral-400 hover:text-black">
                        <Paperclip size={14} />
                      </button>
                      <button className="h-7 px-3 rounded bg-black text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer">
                        <Send size={11} />
                        <span>Send email</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-600 space-y-1.5 font-mono">
                    <div>To: <span className="text-neutral-900 font-semibold font-sans">amy@acme.com</span></div>
                    <div>Subject: <span className="text-neutral-900 font-semibold font-sans">Re: Acme&apos;s access to skills beta</span></div>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded border border-neutral-100 text-[12.5px] text-neutral-700 leading-relaxed font-sans">
                    Hi Amy &mdash; yes, we&apos;ve flagged Acme for the tier-1 skills beta rollout next Tuesday. Your tenant ACLs will synchronize automatically with zero re-indexing needed. Let me know if you want the API keys early.
                  </div>
                </div>

              </div>

              {/* Right Column: Copy & Link (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                <span className="text-[12px] sm:text-[13px] font-mono font-medium text-neutral-500 uppercase tracking-wider block">
                  Proactive AI
                </span>

                <h2 className="text-[34px] sm:text-[44px] lg:text-[48px] font-bold text-neutral-900 tracking-[-0.035em] leading-[1.1] font-sans">
                  Proactive AI that gets work done.
                </h2>

                <p className="text-[15px] sm:text-[16px] text-neutral-600 leading-relaxed font-sans">
                  Proactive AI knows what to work on next. Axios builds a live view of your teams and projects, then, grounded in that context and scoped to each user&apos;s permissions, anticipates next steps like meeting prep or first drafts before you ask.
                </p>

                <div className="pt-2">
                  <Link
                    href="/get-a-demo"
                    className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-[#1F45EC] hover:text-[#1538D4] transition-colors group cursor-pointer"
                  >
                    <span>Explore Proactive AI</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: Context that goes to every AI front door                       */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-[#FAFBFD] border-b border-neutral-200 font-sans">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-14">
            
            <div className="max-w-3xl mb-12">
              <span className="text-[12px] sm:text-[13px] font-mono font-medium text-neutral-500 uppercase tracking-wider block mb-2">
                Universal Interoperability
              </span>
              <h2 className="text-[32px] sm:text-[42px] font-bold text-neutral-900 tracking-[-0.035em] leading-[1.12]">
                Context that goes to every AI front door.
              </h2>
              <p className="mt-3 text-[15px] sm:text-[16px] text-neutral-600 leading-relaxed">
                Whether your teams use Axios Assistant, ChatGPT Enterprise, Claude, Microsoft Copilot, or internal custom agents, Axios serves as the verified context backbone via Model Context Protocol (MCP) and real-time streaming APIs.
              </p>
            </div>

            {/* 4 Feature Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-lg bg-white border border-neutral-200/90 shadow-xs space-y-3">
                <div className="w-9 h-9 rounded-md bg-black text-white flex items-center justify-center font-bold text-xs">
                  MCP
                </div>
                <h3 className="font-bold text-[16px] text-neutral-900">
                  Model Context Protocol
                </h3>
                <p className="text-[13px] text-neutral-600 leading-relaxed">
                  First-class MCP host and server support. Inject enterprise knowledge directly into external AI tools safely.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white border border-neutral-200/90 shadow-xs space-y-3">
                <div className="w-9 h-9 rounded-md bg-black text-white flex items-center justify-center font-bold text-xs">
                  ACL
                </div>
                <h3 className="font-bold text-[16px] text-neutral-900">
                  Sub-14ms ACL Filtering
                </h3>
                <p className="text-[13px] text-neutral-600 leading-relaxed">
                  Real-time permission evaluation ensures no prompt or assistant ever sees records unauthorized to the user.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white border border-neutral-200/90 shadow-xs space-y-3">
                <div className="w-9 h-9 rounded-md bg-black text-white flex items-center justify-center font-bold text-xs">
                  SHA
                </div>
                <h3 className="font-bold text-[16px] text-neutral-900">
                  Verifiable Provenance
                </h3>
                <p className="text-[13px] text-neutral-600 leading-relaxed">
                  Every answer carries cryptographic source citations back to source documents, runbooks, and plant CAD files.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white border border-neutral-200/90 shadow-xs space-y-3">
                <div className="w-9 h-9 rounded-md bg-black text-white flex items-center justify-center font-bold text-xs">
                  -60%
                </div>
                <h3 className="font-bold text-[16px] text-neutral-900">
                  Token Cost Reduction
                </h3>
                <p className="text-[13px] text-neutral-600 leading-relaxed">
                  Semantic context caching and smart model routing eliminate repetitive context re-ingestion costs.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: Half-Page Conversion CTA (User Prompt: "in a half page...")   */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-24 bg-white font-sans overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-14">
            
            <div className="rounded-md bg-neutral-900 text-white p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              
              {/* Subtle ambient lighting */}
              <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-[#1F45EC]/30 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="text-[11px] sm:text-[12px] font-mono uppercase tracking-widest text-[#FF7E4C] font-bold block">
                  Deploy Enterprise Context
                </span>
                <h2 className="text-[32px] sm:text-[44px] lg:text-[48px] font-bold tracking-[-0.035em] leading-[1.08] text-white font-sans">
                  Put enterprise context to work with Axios.
                </h2>
                <p className="text-[15px] sm:text-[16px] text-neutral-300 leading-relaxed max-w-xl">
                  Connect your first data sources in under 15 minutes. Experience grounded enterprise search, autonomous workflows, and zero data retention.
                </p>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
                <Link
                  href="/get-a-demo"
                  className="h-12 px-7 rounded-lg bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-[14px] flex items-center justify-center transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Get a demo
                </Link>
                <Link
                  href="/contact"
                  className="h-12 px-6 rounded-lg border border-neutral-700 hover:border-neutral-500 text-white font-medium text-[14px] flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
                >
                  Contact engineering
                </Link>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
