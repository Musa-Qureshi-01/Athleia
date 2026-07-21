"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { Bot, ShieldCheck, Wrench, FileText, Zap, ArrowRight, Play, CheckCircle2, Search, Sliders } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const DEMO_TABS = [
  {
    id: "copilot",
    name: "Workforce Copilot",
    icon: Bot,
    tagline: "Natural Language AI Assistant for Plant Operations",
    query: "What is the suction pressure for Cooling Pump P-101A and what valve isolates line 6-CW-101?",
    response: "Centrifugal Pump P-101A operates with a standard suction pressure of 150 PSI [1]. Emergency Valve VLV-302 controls the primary isolation boundary on process line 6-CW-101-CS150 in Cooling Water Station 101 [2].",
    citations: [
      { doc: "PND-4012_PUMP_STATION_PID.pdf", section: "Page 1 • Equipment Overview Block", confidence: 0.96 },
      { doc: "SOP-8801_COOLING_VALVE_MANUAL.pdf", section: "Page 4 • Isolation Valve Index", confidence: 0.94 },
    ],
    tools: ["retrieval.bm25_vector", "knowledge.pid_tag_lookup"],
    latency: "0.22s",
  },
  {
    id: "compliance",
    name: "Compliance Intelligence",
    icon: ShieldCheck,
    tagline: "Autonomous ISO 45001 & OSHA Safety Auditor",
    query: "Scan SOP-2024 Startup Procedure against ISO 45001 safety lockout standards.",
    response: "Compliance scan completed across 14 safety rules. Found 1 high-severity policy gap: Lockout/Tagout energy isolation procedure lacks physical padlock verification step prior to energizing motor P-101A.",
    citations: [
      { doc: "ISO_45001_SAFETY_STANDARD_2024.pdf", section: "Section 8.1.2 • Hazard Elimination", confidence: 0.99 },
    ],
    tools: ["compliance.scan_sop", "rules.iso45001_evaluator"],
    latency: "0.38s",
  },
  {
    id: "maintenance",
    name: "Maintenance Telemetry",
    icon: Wrench,
    tagline: "Vibration Telemetry Anomaly Detection & MTBF Forecasting",
    query: "What are the latest vibration telemetry readings for Cooling Compressor C-301?",
    response: "Vibration telemetry sensor VIB-301B registered an anomalous RMS spike of 4.8 mm/s on drive bearing B-2 (Warning threshold: 4.5 mm/s). Recommended action: Schedule bearing lubrication audit within 48 operating hours.",
    citations: [
      { doc: "CMMS_ASSET_LEDGER_C301.pdf", section: "Bearing Health Ledger & MTBF Log", confidence: 0.95 },
    ],
    tools: ["maintenance.vibration_telemetry", "cmms.mtbf_ledger"],
    latency: "0.19s",
  },
];

export default function ProductDemoPage() {
  const [activeTabId, setActiveTabId] = useState("copilot");
  const activeTab = DEMO_TABS.find((t) => t.id === activeTabId)!;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 bg-bg-primary text-text-primary">
        <div className="container-editorial">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary font-semibold">
              Interactive Product Walkthrough
            </span>
            <h1 className="text-display text-text-primary leading-tight">
              Experience Athleia Intelligence in Action.
            </h1>
            <p className="text-body-lg text-text-secondary leading-relaxed">
              Test how Athleia parses operational queries, executes grounded tools, and returns step-level citation evidence in real-time.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex justify-center mb-10">
            <div className="flex p-1 rounded-sm bg-bg-secondary border border-border-subtle max-w-xl w-full">
              {DEMO_TABS.map((tab) => {
                const isSelected = activeTabId === tab.id;
                const IconComp = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-sm text-xs font-medium transition-all duration-200",
                      isSelected
                        ? "bg-bg-primary text-text-primary shadow-xs font-semibold"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    <IconComp size={15} className={cn(isSelected ? "text-accent" : "text-text-tertiary")} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Interactive Demo Preview Window */}
          <div className="max-w-4xl mx-auto rounded-sm border border-border-strong bg-bg-secondary shadow-2xl overflow-hidden">
            
            {/* Window Top Toolbar */}
            <div className="px-4 py-3 border-b border-border-subtle bg-bg-primary/90 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-error/40" />
                <div className="w-3 h-3 rounded-full bg-status-warning/40" />
                <div className="w-3 h-3 rounded-full bg-status-verified/40" />
                <span className="text-xs font-mono text-text-tertiary ml-2">
                  Athleia.ai Platform Demo • {activeTab.name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                Latency: {activeTab.latency}
              </span>
            </div>

            {/* Main Interactive Workspace Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="p-6 lg:p-8 space-y-6 bg-bg-primary"
              >
                {/* User Query Simulation Card */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary font-semibold">
                    Simulated Plant Query
                  </span>
                  <div className="p-3.5 rounded-sm border border-border-subtle bg-bg-secondary text-xs font-mono text-text-primary">
                    &gt; {activeTab.query}
                  </div>
                </div>

                {/* AI Response Card */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                    <Bot size={13} />
                    <span>Athleia Verified Grounded Response</span>
                  </span>
                  <div className="p-4 rounded-sm border border-border-strong bg-bg-secondary text-xs leading-relaxed text-text-primary shadow-xs">
                    {activeTab.response}
                  </div>
                </div>

                {/* Executed Tools Audit Pills */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary font-semibold">
                    Executed Audit Tools
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeTab.tools.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded text-[10px] font-mono bg-bg-secondary border border-border-subtle text-text-secondary flex items-center gap-1">
                        <Zap size={10} className="text-accent" />
                        <span>Tool: {t}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Citation Evidence Accordion */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary font-semibold">
                    Grounded Citation Evidence ({activeTab.citations.length})
                  </span>
                  <div className="space-y-2">
                    {activeTab.citations.map((c, cIdx) => (
                      <div key={cIdx} className="p-3 rounded-sm border border-border-subtle bg-bg-secondary flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-accent shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-text-primary">{c.doc}</span>
                            <span className="text-[10px] text-text-tertiary">{c.section}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-status-verified font-bold">
                          {(c.confidence * 100).toFixed(0)}% Confidence
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Demo Footer */}
            <div className="p-4 border-t border-border-subtle bg-bg-secondary flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-mono text-text-tertiary">
                Want to test your facility&apos;s actual document corpus?
              </span>
              <Link
                href="/contact"
                className="px-5 py-2 rounded-sm bg-text-primary text-bg-primary text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0"
              >
                <span>Schedule Live Plant Demo</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
