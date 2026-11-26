"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Stethoscope,
  Cpu,
  ShoppingBag,
  Factory,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Radio,
  FileSearch,
  Sparkles,
  Layers,
  Wrench,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IndustryTab {
  id: string;
  name: string;
  icon: React.ElementType;
  heading: string;
  features: {
    icon: React.ElementType;
    text: string;
  }[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
  demo: {
    query: string;
    outputTitle: string;
    outputSummary: string;
    affectedRoles: string[];
    actionItems: string[];
    citations: { name: string; app: string }[];
  };
}

const INDUSTRIES: IndustryTab[] = [
  {
    id: "financial",
    name: "Financial Services",
    icon: Building2,
    heading: "Axios connects compliance policies, investment charters, and market filings for instant regulatory clearance.",
    features: [
      {
        icon: ShieldCheck,
        text: "Enforce strict role-based isolation of material non-public information (MNPI) across teams",
      },
      {
        icon: FileSearch,
        text: "Validate investment memos and syndicate allocations against internal fund covenants in real time",
      },
      {
        icon: Sparkles,
        text: "Synthesize cross-border regulatory policy updates with exact source audit provenance",
      },
    ],
    testimonial: {
      quote: "Axios has accelerated regulatory audit preparation and investment mandate verification across 34 jurisdictions.",
      author: "Chief Compliance Officer",
      role: "Tier-1 Asset Management Firm",
    },
    demo: {
      query: "Verify if Fund VIII can participate in the mezzanine debt syndication for Apex Holdings under Basel III covenants.",
      outputTitle: "Mandate Clearance Verified",
      outputSummary: "Under Section 4.2 of Fund VIII Investment Charter, mezzanine allocations are capped at 15% of NAV ($142M currently available). No conflict detected with Syndicate Rule 8.4.",
      affectedRoles: ["Investment Committee", "Risk Management", "Legal Counsel"],
      actionItems: [
        "Confirm remaining allocation limit within 48-hour syndication window",
        "Generate automated FINRA 2210 compliance clearance packet",
      ],
      citations: [
        { name: "Fund_VIII_Charter_Amended.pdf", app: "Veeva Vault" },
        { name: "Apex_Holdings_Covenant_Termsheet.docx", app: "SharePoint" },
      ],
    },
  },
  {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    icon: Stethoscope,
    heading: "Axios unifies clinical trials, regulatory protocols, and patient safety data with HIPAA-grade compliance.",
    features: [
      {
        icon: ShieldCheck,
        text: "Automate PHI/PII redaction across electronic health records and trial master files",
      },
      {
        icon: FileSearch,
        text: "Cross-reference inclusion/exclusion criteria across active oncology and rare disease protocols",
      },
      {
        icon: Sparkles,
        text: "Accelerate IND and 510(k) submission drafts with verified scientific citations",
      },
    ],
    testimonial: {
      quote: "Our clinical researchers query years of trial history in seconds without leaving our validated enterprise environment.",
      author: "VP of Clinical Operations",
      role: "Global Biotech Enterprise",
    },
    demo: {
      query: "Analyze hepatic safety exclusion criteria across all ongoing Phase II and Phase III oncology protocols.",
      outputTitle: "Cross-Protocol Hepatic Safety Analysis",
      outputSummary: "Identified 6 active protocols with uniform exclusion threshold: ALT/AST > 2.5x ULN (or > 5x ULN in patients with liver metastases). Protocol NCT04812 includes specific bilirubin safeguards.",
      affectedRoles: ["Principal Investigators", "Trial Safety Board", "Regulatory Affairs"],
      actionItems: [
        "Standardize AST/ALT monitoring intervals across trial sites",
        "Distribute updated patient screening checklist to clinical monitors",
      ],
      citations: [
        { name: "Protocol_NCT04812_Amend3.pdf", app: "Box" },
        { name: "Biomarker_Hepatic_Safety_Panel.xlsx", app: "Benchling" },
      ],
    },
  },
  {
    id: "retail",
    name: "Retail",
    icon: ShoppingBag,
    heading: "Axios links supplier contracts, merchandising plans, and logistics telemetry for agile omnichannel execution.",
    features: [
      {
        icon: Radio,
        text: "Detect supply chain SLA breaches and automated vendor penalty terms across distribution centers",
      },
      {
        icon: FileSearch,
        text: "Search visual planograms and merchandising directives instantly for field teams",
      },
      {
        icon: Sparkles,
        text: "Resolve inventory discrepancies between ERP and regional warehouse management systems",
      },
    ],
    testimonial: {
      quote: "Axios eliminates communication silos between store operations and regional logistics hubs during peak season.",
      author: "Head of Omnichannel Operations",
      role: "National Retailer",
    },
    demo: {
      query: "Review supplier penalty terms for cold-chain dairy deliveries exceeding 4-hour transit delays across Midwest fulfillment centers.",
      outputTitle: "Supplier SLA Penalty Analysis",
      outputSummary: "Under Supplier Master Agreement #441 (Section 9.3), transit delays over 4 hours forfeit demurrage and incur a 2.5% invoice deduction per incident. Notice must be filed within 48 hours.",
      affectedRoles: ["Logistics Operations", "Procurement Leads", "Store Managers"],
      actionItems: [
        "File automated demurrage credit notification to Vendor #441",
        "Re-route backup refrigerated inventory from Chicago DC",
      ],
      citations: [
        { name: "Midwest_Dairy_Master_Contract_2025.pdf", app: "SAP Ariba" },
        { name: "ColdChain_Telemetry_Nov.csv", app: "Snowflake" },
      ],
    },
  },
  {
    id: "technology",
    name: "Technology",
    icon: Cpu,
    heading: "Axios synchronizes architecture RFCs, code repos, and production incident runbooks in real time.",
    features: [
      {
        icon: Radio,
        text: "Perform semantic code and PR review search linked directly to architectural decisions",
      },
      {
        icon: Wrench,
        text: "Instantly retrieve targeted mitigation playbooks during P0/P1 production incidents",
      },
      {
        icon: Sparkles,
        text: "Accelerate engineer onboarding by answering systems questions with verified internal links",
      },
    ],
    testimonial: {
      quote: "Our engineers resolve on-call incidents 42% faster because Axios brings the exact runbook to the engineer immediately.",
      author: "VP of Engineering",
      role: "High-Growth Cloud Platform",
    },
    demo: {
      query: "Why did payment-service circuit breaker trip during the 02:00 UTC batch run, and what is the mitigation runbook?",
      outputTitle: "Incident Triage & Mitigation",
      outputSummary: "Circuit breaker tripped due to timeout spikes in Postgres replica pool during automated ledger reconciliation. Runbook #104: flush connection pool and temporarily throttle worker concurrency to 50%.",
      affectedRoles: ["On-Call SRE", "Payments Core Engineering", "Database Administrators"],
      actionItems: [
        "Execute Runbook #104 pool flush script",
        "Scale read replicas before 04:00 UTC secondary batch",
      ],
      citations: [
        { name: "RFC-218-Payment-Circuit-Breakers.md", app: "GitHub" },
        { name: "Runbook-104-Postgres-Mitigation.pdf", app: "Confluence" },
      ],
    },
  },
  {
    id: "industrials",
    name: "Industrials",
    icon: Factory,
    heading: "Axios connects engineering specs, maintenance history, and operational data to keep complex workflows moving.",
    features: [
      {
        icon: Radio,
        text: "Connect operations, engineering, and maintenance context for faster decisions",
      },
      {
        icon: FileSearch,
        text: "Troubleshoot issues, pull the right specs and procedures, and coordinate response during disruptions",
      },
      {
        icon: Sparkles,
        text: "Capture institutional knowledge so best practices get reused across teams",
      },
    ],
    testimonial: {
      quote: "Axios has put advanced AI that's easy to use into the hands of our engineering teams and plant operators, saving thousands of hours per month.",
      author: "Director of Reliability Engineering",
      role: "Global Industrial Operations",
    },
    demo: {
      query: "Summarize the latest technical change, identify who it affects, and outline what each team needs to do next.",
      outputTitle: "Engineering Change Order ECO-8842 Summary",
      outputSummary: "Upgraded digital electro-pneumatic positioner on high-pressure steam valve (MOV-401). Setpoint pressure tolerance narrowed from ±5% to ±1.5% to prevent thermal cavitation.",
      affectedRoles: ["Plant Operations", "Instrumentation Specialists", "Reliability Engineering"],
      actionItems: [
        "Calibrate 4-20mA loop signaling on DCS rack 3B before shift transition",
        "Sign off amended maintenance SOP-P401 in OpenText Documentum",
        "Verify dual-sensor fail-safe interlock status on SCADA console",
      ],
      citations: [
        { name: "PID-Drawing-Steam-Unit4-RevE.dwg", app: "AutoCAD Vault" },
        { name: "Maintenance_SOP_P401_Amended.pdf", app: "OpenText" },
        { name: "Fisher_Positioner_DVC6200_Manual.pdf", app: "Box" },
      ],
    },
  },
  {
    id: "consulting",
    name: "Consulting",
    icon: Briefcase,
    heading: "Axios mobilizes firm-wide intellectual property, past pitch decks, and benchmark databases while safeguarding client confidentiality.",
    features: [
      {
        icon: ShieldCheck,
        text: "Deliver cross-client air-gapped isolation with zero data leakage guarantees",
      },
      {
        icon: FileSearch,
        text: "Generate proposal drafts with verified client capability citations and metrics",
      },
      {
        icon: Sparkles,
        text: "Transfer engagement methodologies and financial models without starting from scratch",
      },
    ],
    testimonial: {
      quote: "Our partners assemble complex RFP proposals in a fraction of the time with full confidence in client sanitization.",
      author: "Senior Partner",
      role: "Global Strategy Advisory",
    },
    demo: {
      query: "Retrieve past cloud migration frameworks for tier-1 European banks including typical phase timelines and cost-optimization benchmarks.",
      outputTitle: "Cloud Migration Architecture Framework",
      outputSummary: "Found 4 past engagements (2023-2025). The standard 3-phase cloud transformation framework achieved a median 31% reduction in run-rate compute costs over 18 months.",
      affectedRoles: ["Engagement Partner", "Cloud Practice Lead", "Technical Architect"],
      actionItems: [
        "Import sanitized FinOps benchmark charts into client pitch deck",
        "Schedule architecture review with EMEA transformation lead",
      ],
      citations: [
        { name: "Cloud_Transformation_Playbook_v3.pptx", app: "Google Drive" },
        { name: "FinOps_Benchmark_Database_Q2.xlsx", app: "Internal Hub" },
      ],
    },
  },
];

export function IndustrySolutionsSection() {
  const [activeTab, setActiveTab] = useState<string>("industrials");
  const current = INDUSTRIES.find((ind) => ind.id === activeTab) || INDUSTRIES[4];

  return (
    <section id="industries" className="bg-white border-t border-neutral-200 font-sans overflow-hidden scroll-mt-10">
      <div className="max-w-[1120px] mx-auto border-x border-neutral-200 px-6 sm:px-12 lg:px-16 xl:pl-20 py-16 sm:py-20 lg:py-24">
        
        {/* Section Headline matching Reference Screenshot */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-[32px] sm:text-[44px] lg:text-[52px] font-bold tracking-[-0.035em] text-neutral-900 leading-[1.1] font-sans">
            Enterprise AI that speaks your industry&apos;s language.
          </h2>
        </div>

        {/* Industry Tabs Bar with Clean Hairline Underline */}
        <div className="border-b border-neutral-200 mb-10 sm:mb-14 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-8 sm:gap-12 min-w-[680px]">
            {INDUSTRIES.map((ind) => {
              const isActive = activeTab === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveTab(ind.id)}
                  className={cn(
                    "pb-3.5 text-[15px] sm:text-[16px] font-medium transition-colors relative cursor-pointer whitespace-nowrap",
                    isActive ? "text-[#1F45EC]" : "text-neutral-500 hover:text-neutral-900"
                  )}
                >
                  {ind.name}
                  {isActive && (
                    <motion.div
                      layoutId="industryTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1F45EC]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Responsive Layout matching Screenshot 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Context Card + Testimonial Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Value Proposition Card */}
            <div className="rounded-lg border border-neutral-200/90 bg-white p-8 sm:p-10 shadow-xs">
              <h3 className="text-[22px] sm:text-[26px] font-bold text-neutral-900 leading-[1.25] tracking-tight font-sans mb-8">
                {current.heading}
              </h3>

              {/* 3 Bullet Features */}
              <div className="space-y-6 divide-y divide-neutral-100">
                {current.features.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className={cn("flex items-start gap-4", idx > 0 && "pt-6")}>
                      <div className="w-8 h-8 rounded-md bg-neutral-50 border border-neutral-200/80 flex items-center justify-center shrink-0 text-neutral-800 shadow-2xs mt-0.5">
                        <Icon size={16} />
                      </div>
                      <p className="text-[14px] sm:text-[15px] text-neutral-700 leading-relaxed font-sans">
                        {feat.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Testimonial Quote Box */}
            <div className="rounded-lg border border-neutral-200/90 bg-[#FAFBFD] p-6 sm:p-8">
              <p className="text-[14px] sm:text-[15px] text-neutral-700 italic leading-relaxed font-serif">
                &ldquo;{current.testimonial.quote}&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs font-sans">
                <span className="font-bold text-neutral-900">{current.testimonial.author}</span>
                <span className="text-neutral-500">{current.testimonial.role}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Live Simulation Box (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-lg border border-neutral-200/90 bg-white shadow-md overflow-hidden flex flex-col">
              
              {/* Top: 3D Fluid Ribbon Graphic Header with Search Bar */}
              <div className="relative min-h-[140px] sm:min-h-[160px] flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-gradient-to-r from-[#1746ED] via-[#8637EB] to-[#EA5E8F]">
                <img
                  src="/hero-fluid-ribbon.png"
                  alt="Axios Fluid Ribbon"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none opacity-90"
                />
                
                {/* Frosted Glass Overlay */}
                <div className="absolute inset-0 bg-black/15 pointer-events-none" />

                {/* Central Floating Search Pill */}
                <div className="relative z-10 w-full max-w-[620px] bg-white/95 backdrop-blur-md rounded-md sm:rounded-lg shadow-xl border border-white/80 p-3.5 sm:p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-neutral-400 font-medium text-lg leading-none">+</span>
                    <span className="text-[13px] sm:text-[14px] text-neutral-800 font-sans truncate">
                      {current.demo.query}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-neutral-400">
                    <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <Search size={12} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Generated Live AI Answer & Actions */}
              <div className="p-6 sm:p-8 bg-[#FAFBFD]/60 flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-neutral-200/70 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-[#1F45EC] p-0.5">
                          <img src="/icon.png" alt="Axios" className="w-full h-full object-contain" />
                        </div>
                        <h4 className="text-[15px] font-bold text-neutral-900 font-sans">
                          {current.demo.outputTitle}
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Zero-Hallucination Verified
                      </span>
                    </div>

                    {/* Summary Text */}
                    <p className="text-[14px] text-neutral-700 leading-relaxed font-sans bg-white p-4 rounded-md border border-neutral-200/80 shadow-2xs">
                      {current.demo.outputSummary}
                    </p>

                    {/* Affected Roles Grid */}
                    <div>
                      <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-2 font-semibold">
                        Impacted Roles &amp; Teams
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {current.demo.affectedRoles.map((role, rIdx) => (
                          <span
                            key={rIdx}
                            className="px-3 py-1 rounded-md bg-neutral-100 text-neutral-800 text-[12px] font-medium font-sans border border-neutral-200"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Items Checklist */}
                    <div>
                      <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-2 font-semibold">
                        Automated Action Checklist
                      </span>
                      <div className="space-y-2">
                        {current.demo.actionItems.map((act, aIdx) => (
                          <div
                            key={aIdx}
                            className="flex items-center gap-2.5 text-[13px] text-neutral-800 bg-white p-2.5 rounded-md border border-neutral-200/70 font-sans"
                          >
                            <CheckCircle2 size={15} className="text-[#1F45EC] shrink-0" />
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Citations / Provenance */}
                    <div className="pt-2 border-t border-neutral-200/70 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-neutral-500 font-mono text-[11px]">
                        <span>Citations:</span>
                        {current.demo.citations.map((cite, cIdx) => (
                          <span key={cIdx} className="underline text-neutral-700 hover:text-black cursor-pointer">
                            {cite.name} ({cite.app})
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400">
                        Latency: 1.2s
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
