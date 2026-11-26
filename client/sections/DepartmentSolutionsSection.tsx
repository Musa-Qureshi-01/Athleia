"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  TrendingUp,
  DollarSign,
  Users2,
  Wrench,
  Headphones,
  Scale,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Bot
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  icon: React.ElementType;
  eyebrow: string;
  headline: string;
  description: string;
  tools: string[];
  metric: string;
  metricLabel: string;
  samplePrompt: string;
  sampleAnswer: string;
}

const DEPARTMENTS: Department[] = [
  {
    id: "engineering",
    name: "Engineering",
    icon: Code2,
    eyebrow: "SYSTEMS & ARCHITECTURE",
    headline: "Instant codebase context, runbooks, and incident retro lookup.",
    description: "Connect GitHub, Jira, Confluence, and Datadog. Engineers ask architectural questions in natural language and receive verified code references without interrupting senior teammates.",
    tools: ["GitHub", "Jira", "Datadog", "Notion", "Linear"],
    metric: "4.2 hrs",
    metricLabel: "Reclaimed weekly per developer",
    samplePrompt: "Why did payment webhook worker trip the circuit breaker during the 02:00 UTC batch run?",
    sampleAnswer: "The circuit breaker tripped due to connection pool saturation in the Postgres read replica. Execute Runbook #104: flush pool and throttle concurrency to 50%."
  },
  {
    id: "sales",
    name: "Sales & RevOps",
    icon: TrendingUp,
    eyebrow: "PIPELINE & DEAL EXECUTION",
    headline: "Automate account prep, competitor battlecards, and RFP responses.",
    description: "Arm account executives with real-time deal intelligence synthesized from Salesforce, Gong call transcripts, pitch decks, and technical security docs.",
    tools: ["Salesforce", "Gong", "HubSpot", "Google Slides", "Slack"],
    metric: "68%",
    metricLabel: "Faster RFP submission velocity",
    samplePrompt: "What were the primary procurement security objections raised by Acme Financial in our last QBR?",
    sampleAnswer: "Acme requested clarification on SOC 2 Type II data residency for EU employee records and our backup encryption frequency (addressed in Exhibit C)."
  },
  {
    id: "finance",
    name: "Finance & Accounting",
    icon: DollarSign,
    eyebrow: "FINOPS & AUDIT READINESS",
    headline: "Reconcile vendor contracts, invoice discrepancies, and audit schedules.",
    description: "Unify NetSuite, Workday, Excel sheets, and procurement contracts. Finance teams instantly cross-check payment terms and verify budget variance drivers.",
    tools: ["NetSuite", "Workday", "Coupa", "Excel", "SharePoint"],
    metric: "82%",
    metricLabel: "Faster audit evidence collection",
    samplePrompt: "Which enterprise contracts are up for auto-renewal in Q1 with more than 5% price escalators?",
    sampleAnswer: "Identified 3 master agreements: Snowflake (renewing Feb 15, +6%), Datadog (renewing Mar 1, +5.5%), and Salesforce Cloud (renewing Mar 28, +5%)."
  },
  {
    id: "support",
    name: "Customer Support",
    icon: Headphones,
    eyebrow: "AGENT TRIAGE & CSAT",
    headline: "Resolve tier-3 technical tickets without escalating to engineers.",
    description: "Support agents resolve complex customer queries by querying product documentation, engineering bug trackers, and past resolution threads in real time.",
    tools: ["Zendesk", "Intercom", "Jira Service Desk", "Confluence"],
    metric: "-44%",
    metricLabel: "Reduction in mean time to resolve (MTTR)",
    samplePrompt: "What is the certified workaround for error code 503-E on Samsung Tizen Smart TVs?",
    sampleAnswer: "Error 503-E indicates a DRM key renewal timeout. Advise customer to power-cycle app and verify firmware v1402+. Hotfix released in patch 2.4.1."
  },
  {
    id: "legal",
    name: "Legal & Compliance",
    icon: Scale,
    eyebrow: "CONTRACT GOVERNANCE",
    headline: "Search thousands of master agreements for indemnification clauses.",
    description: "Legal teams query historical NDAs, master services agreements, and vendor DPAs to identify non-standard language and exposure without manual review.",
    tools: ["Ironclad", "DocuSign", "Box", "SharePoint", "Google Drive"],
    metric: "90%",
    metricLabel: "Accelerated contract clause review",
    samplePrompt: "Identify all customer agreements with unlimited liability or non-standard governing law provisions.",
    sampleAnswer: "Scanned 1,420 active contracts. 4 customer agreements contain bespoke uncapped liability riders for IP infringement under Delaware jurisdiction."
  },
  {
    id: "hr",
    name: "People & HR",
    icon: Users2,
    eyebrow: "WORKFORCE ENABLEMENT",
    headline: "Automate policy FAQs, benefits lookups, and global onboarding.",
    description: "Employees get instant, accurate answers about parental leave, expense policies, and healthcare coverage directly in Slack or Teams.",
    tools: ["Workday", "BambooHR", "Slack", "Notion", "Microsoft Teams"],
    metric: "-72%",
    metricLabel: "Drop in repetitive HR support tickets",
    samplePrompt: "What is the global remote stipend policy and expense reimbursement window for UK employees?",
    sampleAnswer: "UK employees receive an annual home office allowance of £500, claimable via Expensify within 60 days of purchase under Account Code 6401."
  }
];

export function DepartmentSolutionsSection() {
  const [activeDept, setActiveDept] = useState("engineering");
  const current = DEPARTMENTS.find((d) => d.id === activeDept) || DEPARTMENTS[0];
  const Icon = current.icon;

  return (
    <section className="py-24 lg:py-32 bg-white border-b border-neutral-200 font-sans">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EEF1FF] text-[#1844EB] text-xs font-mono font-medium mb-4">
            <Sparkles size={13} />
            <span>SOLUTIONS BY DEPARTMENT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.12] mb-5">
            Empower every team with{" "}
            <span className="text-[#1844EB]">instant institutional context.</span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            Axios breaks functional silos, giving every department a personalized AI assistant grounded in their specialized tools and authoritative documentation.
          </p>
        </div>

        {/* Department Switcher Tabs (Boxy with healthy roundness) */}
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto pb-4 mb-10 scrollbar-none gap-2">
          <div className="inline-flex p-1 bg-neutral-100 rounded-lg max-w-full">
            {DEPARTMENTS.map((dept) => {
              const DeptIcon = dept.icon;
              const isActive = dept.id === activeDept;
              return (
                <button
                  key={dept.id}
                  onClick={() => setActiveDept(dept.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-white text-black shadow-xs font-semibold"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  <DeptIcon size={15} className={isActive ? "text-[#1844EB]" : "text-neutral-400"} />
                  <span>{dept.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Department Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#FBFBFC] border border-neutral-200 rounded-lg p-6 sm:p-10 lg:p-12 shadow-sm"
          >
            {/* Left Narrative Column (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-semibold text-[#1844EB] uppercase tracking-wider block mb-2">
                  {current.eyebrow}
                </span>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-4 leading-snug">
                  {current.headline}
                </h3>

                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-8">
                  {current.description}
                </p>

                {/* Connected Department Tools */}
                <div className="mb-8">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-2.5">
                    CONNECTED DEPARTMENT SOURCES
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {current.tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-neutral-800 shadow-2xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold font-mono text-neutral-900 block leading-tight">
                    {current.metric}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    {current.metricLabel}
                  </span>
                </div>

                <a
                  href="/get-a-demo"
                  className="inline-flex items-center gap-2 px-4.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-black text-white hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  <span>See {current.name} Demo</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Right Product Mockup Column (6 cols) */}
            <div className="lg:col-span-6">
              <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-md">
                
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-[#EEF1FF] text-[#1844EB] flex items-center justify-center">
                      <Icon size={16} />
                    </div>
                    <span className="text-xs font-bold text-neutral-900">
                      Axios for {current.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Live Connector Active
                  </span>
                </div>

                {/* Natural Query Bubble */}
                <div className="p-3.5 bg-neutral-50 rounded-md border border-neutral-100 mb-4 text-xs font-medium text-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400 block mb-1">
                    VERIFIED NATURAL LANGUAGE QUERY
                  </span>
                  &ldquo;{current.samplePrompt}&rdquo;
                </div>

                {/* AI Synthesized Answer */}
                <div className="p-4 bg-[#EEF1FF]/50 border border-blue-200/60 rounded-md text-xs sm:text-sm text-neutral-800 leading-relaxed mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1844EB] mb-2 font-mono">
                    <Bot size={14} />
                    <span>SYNTHESIS WITH PERMISSION ENFORCEMENT</span>
                  </div>
                  {current.sampleAnswer}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-2 border-t border-neutral-100">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    Strict Role-Based Isolation
                  </span>
                  <span>Latency: 160ms</span>
                </div>

              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}

