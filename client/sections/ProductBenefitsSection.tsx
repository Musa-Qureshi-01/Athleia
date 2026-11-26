"use client";

import { motion } from "framer-motion";
import {
  Search,
  Bot,
  Workflow,
  ArrowRight,
  CheckCircle2,
  FileText,
  Layers,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export function ProductBenefitsSection() {
  return (
    <section id="platform" className="bg-white border-t border-neutral-200 font-sans overflow-hidden scroll-mt-10">
      <div className="max-w-[1120px] mx-auto border-x border-neutral-200">
        
        {/* Section Header */}
        <div className="px-6 sm:px-12 lg:px-16 xl:pl-20 pt-16 sm:pt-20 pb-12 border-b border-neutral-200">
          <span className="text-[12px] font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-3">
            Core Capabilities
          </span>
          <h2 className="text-[32px] sm:text-[46px] font-bold text-neutral-900 tracking-[-0.03em] leading-[1.1]">
            Three powerful ways Axios powers the modern enterprise workforce.
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
            Move from fragmented documents to intelligent action with unified search, autonomous agents, and deterministic work execution.
          </p>
        </div>

        {/* 3 Boxy Editorial Rows with Hairline Dividers */}
        <div className="divide-y divide-neutral-200">
          
          {/* ── BENEFIT 01: ENTERPRISE SEARCH ──────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200 items-stretch">
            
            {/* Text Description (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
              <div className="space-y-4">
                <span className="text-[12px] font-mono font-bold text-[#1F45EC] tracking-wider uppercase">
                  01 // UNIFIED SEARCH & DISCOVERY
                </span>
                <h3 className="text-[26px] sm:text-[34px] font-bold text-neutral-900 tracking-[-0.025em] leading-[1.15]">
                  Find anything across every app in milliseconds.
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Stop jumping between 15 different tools. Axios searches across Slack, Confluence, Jira, Google Drive, Salesforce, and legacy engineering databases with natural language understanding.
                </p>

                <div className="pt-2 space-y-2 text-xs sm:text-sm text-neutral-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Sub-250ms search latency across billions of records.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Personalized ranking based on team membership and project focus.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Exact citation attribution with source document pages.</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100">
                <Link
                  href="/get-a-demo"
                  className="text-sm font-semibold text-[#1F45EC] hover:underline inline-flex items-center gap-1.5"
                >
                  Explore Enterprise Search <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* UI Mockup (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 bg-[#FAFBFD]/60 flex items-center justify-center">
              <div className="w-full rounded-md border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 text-xs text-neutral-400 font-mono">
                  <Search size={14} className="text-[#1F45EC]" />
                  <span className="text-neutral-800 font-medium">
                    Search: &ldquo;Q3 boiler valve pressure compliance incident log&rdquo;
                  </span>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div className="p-3.5 rounded-md border border-neutral-200 bg-[#FAFAFA] flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                        <FileText size={13} className="text-blue-600" />
                        SOP-804: High Pressure Boiler Maintenance Manual (Rev 3)
                      </div>
                      <p className="text-[12px] text-neutral-500">
                        ...annual hydrostatic test threshold requires relief valves to crack at 1.1x design MAWP before startup...
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-blue-800 shrink-0 border border-blue-200">
                      Confluence
                    </span>
                  </div>

                  <div className="p-3.5 rounded-md border border-neutral-200 bg-[#FAFAFA] flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                        <FileText size={13} className="text-emerald-600" />
                        INC-4819: Relief Valve 4B Gasket Replacement Signoff
                      </div>
                      <p className="text-[12px] text-neutral-500">
                        Signed off by Chief Engineer on Sep 14. Replacement kit P/N 992-B installed with zero pressure loss.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 shrink-0 border border-emerald-200">
                      Jira Service
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── BENEFIT 02: AUTONOMOUS ENTERPRISE AGENTS ───── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200 items-stretch">
            
            {/* UI Mockup (7 cols) - Left on desktop */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 bg-[#FAFBFD]/60 flex items-center justify-center order-2 lg:order-1">
              <div className="w-full rounded-md border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-black text-white flex items-center justify-center">
                      <Bot size={13} />
                    </div>
                    <span className="text-xs font-bold text-neutral-900">
                      Axios Agent: Vendor Contract Risk Auditor
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                    Status: Active Loop
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-md bg-[#FAFAFA] border border-neutral-200 flex items-center justify-between">
                    <span className="text-neutral-700">1. Ingest Master Services Agreement (MSA)</span>
                    <span className="font-mono text-emerald-600 text-[11px] font-semibold">Completed (4.2s)</span>
                  </div>
                  <div className="p-3 rounded-md bg-[#FAFAFA] border border-neutral-200 flex items-center justify-between">
                    <span className="text-neutral-700">2. Cross-reference enterprise indemnity policy</span>
                    <span className="font-mono text-emerald-600 text-[11px] font-semibold">Flagged 2 Exceptions</span>
                  </div>
                  <div className="p-3 rounded-md bg-[#FAFAFA] border border-neutral-200 flex items-center justify-between">
                    <span className="text-neutral-700">3. Draft redline recommendations in Google Docs</span>
                    <span className="font-mono text-blue-600 text-[11px] font-semibold">Awaiting Signoff</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Description (5 cols) - Right on desktop */}
            <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white order-1 lg:order-2">
              <div className="space-y-4">
                <span className="text-[12px] font-mono font-bold text-[#1F45EC] tracking-wider uppercase">
                  02 // ENTERPRISE AI AGENTS
                </span>
                <h3 className="text-[26px] sm:text-[34px] font-bold text-neutral-900 tracking-[-0.025em] leading-[1.15]">
                  Build autonomous agents that execute multi-step workflows.
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Empower every team to create domain-specialized agents that connect to APIs, analyze enterprise documents, enforce governance guardrails, and execute tasks on their behalf.
                </p>

                <div className="pt-2 space-y-2 text-xs sm:text-sm text-neutral-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>No-code agent builder with full Python/TypeScript API access.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Human-in-the-loop approvals for sensitive data updates.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Zero training data contamination guarantee.</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100">
                <Link
                  href="/get-a-demo"
                  className="text-sm font-semibold text-[#1F45EC] hover:underline inline-flex items-center gap-1.5"
                >
                  Explore Axios Agents <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>

          {/* ── BENEFIT 03: WORKFLOW EXECUTION ────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200 items-stretch">
            
            {/* Text Description (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
              <div className="space-y-4">
                <span className="text-[12px] font-mono font-bold text-[#1F45EC] tracking-wider uppercase">
                  03 // DETERMINISTIC EXECUTION
                </span>
                <h3 className="text-[26px] sm:text-[34px] font-bold text-neutral-900 tracking-[-0.025em] leading-[1.15]">
                  Turn insights into audited, verified business outcomes.
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Axios connects with your enterprise tools to file bug reports, update CRM accounts, trigger CI/CD pipelines, and generate audit-ready documentation automatically.
                </p>

                <div className="pt-2 space-y-2 text-xs sm:text-sm text-neutral-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>End-to-end cryptographic audit trails for compliance.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Bidirectional sync with Jira, ServiceNow, and Salesforce.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>SOC-2 Type II, FedRAMP Aligned, and HIPAA compliant.</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100">
                <Link
                  href="/get-a-demo"
                  className="text-sm font-semibold text-[#1F45EC] hover:underline inline-flex items-center gap-1.5"
                >
                  See Enterprise Workflows <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* UI Mockup (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 bg-[#FAFBFD]/60 flex items-center justify-center">
              <div className="w-full rounded-md border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <span className="text-xs font-bold text-neutral-900">
                    Audit Execution Pipeline
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Run ID: #EX-9042
                  </span>
                </div>

                <div className="p-3.5 rounded-md bg-[#FAFAFA] border border-neutral-200 text-xs space-y-1.5">
                  <div className="font-bold text-neutral-900">Action: Jira Ticket Automated Resolution</div>
                  <div className="text-neutral-500 text-[11px]">Triggered via verified Slack thread approval from @security-lead</div>
                  <div className="font-mono text-emerald-600 text-[10px]">SHA-256: 8f9b...a102 | State: Persisted to Audit Ledger</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
