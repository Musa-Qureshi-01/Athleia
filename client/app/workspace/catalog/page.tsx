"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Cpu,
  Layers,
  Search,
  Bot,
  ShieldCheck,
  Wrench,
  Database,
  FileText,
  Upload,
  Settings,
  Shield,
  Activity,
  ArrowRight,
  ExternalLink,
  Tag,
  CheckCircle2,
  Terminal,
  Server,
  Zap,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceDefinition {
  id: string;
  name: string;
  category: "Intelligence & Reasoning" | "Knowledge & Retrieval" | "Governance & Reliability" | "Platform & Security";
  description: string;
  route: string;
  status: "Operational" | "Active" | "Monitoring";
  components: Array<{
    name: string;
    description: string;
    type: "Engine" | "Algorithm" | "Pipeline" | "Model" | "Security";
    tag?: string;
  }>;
}

const SERVICES_CATALOG: ServiceDefinition[] = [
  {
    id: "svc-assistant",
    name: "Workforce Copilot & Conversational Agent",
    category: "Intelligence & Reasoning",
    description: "Autonomous multi-tool conversational assistant with citation verification, operator troubleshooting, and procedural guidance.",
    route: "/workspace/assistant",
    status: "Operational",
    components: [
      {
        name: "Conversational Agent Loop",
        description: "Orchestrates multi-turn dialogue, tool calls, and grounded evidence retrieval.",
        type: "Engine",
        tag: "ReAct Loop",
      },
      {
        name: "Citation Attribution Scorer",
        description: "Extracts document snippets, evaluates grounding scores, and highlights source pages.",
        type: "Security",
        tag: "Zero Hallucination",
      },
      {
        name: "Procedural Synthesis Engine",
        description: "Converts raw engineering P&ID documentation into step-by-step checklists.",
        type: "Engine",
      },
    ],
  },
  {
    id: "svc-retrieval",
    name: "Hybrid Semantic Retrieval Service",
    category: "Knowledge & Retrieval",
    description: "Multi-modal vector embeddings paired with BM25 lexical keyword matching and Reciprocal Rank Fusion.",
    route: "/workspace/search",
    status: "Operational",
    components: [
      {
        name: "Dense Vector Embedding Index",
        description: "384-dimensional dense semantic vectors with cosine similarity matching.",
        type: "Model",
        tag: "384-d Cosine",
      },
      {
        name: "BM25 Lexical Keyword Ranker",
        description: "Exact term frequency index optimized for technical equipment IDs and part numbers.",
        type: "Algorithm",
        tag: "Rank-BM25",
      },
      {
        name: "Reciprocal Rank Fusion (RRF)",
        description: "Merges dense semantic and BM25 sparse rankings with constant-dampened weights.",
        type: "Algorithm",
      },
      {
        name: "P&ID Coordinate Chunk Retriever",
        description: "Locates precise visual quadrant coordinates on CAD drawings for highlighted inspection.",
        type: "Pipeline",
      },
    ],
  },
  {
    id: "svc-reasoning",
    name: "Grounded Industrial Reasoning Service",
    category: "Intelligence & Reasoning",
    description: "Multi-tool execution and formal logic evaluation enforcing strict zero external knowledge policies.",
    route: "/workspace/intelligence",
    status: "Operational",
    components: [
      {
        name: "Zero External Knowledge Policy Guard",
        description: "Prevents LLM parametric hallucinations by rejecting queries without document grounding.",
        type: "Security",
        tag: "Boundary Enforcer",
      },
      {
        name: "Formal Claim Verifier",
        description: "Cross-checks mathematical units, pressure thresholds, and valve states against specs.",
        type: "Engine",
      },
    ],
  },
  {
    id: "svc-ingestion",
    name: "Document Ingestion & Parsing Pipeline",
    category: "Knowledge & Retrieval",
    description: "End-to-end OCR, multi-page PDF decomposition, table structure parsing, and CAD symbol extraction.",
    route: "/workspace/documents",
    status: "Operational",
    components: [
      {
        name: "P&ID Symbol Vectorizer",
        description: "Identifies valves, pumps, transmitters, and pipe connections in engineering drawings.",
        type: "Pipeline",
        tag: "CAD / P&ID",
      },
      {
        name: "Table & Schedule Reconstructor",
        description: "Preserves tabular structure in technical datasheets for precise relational querying.",
        type: "Pipeline",
      },
      {
        name: "Automated Metadata & Asset Tagger",
        description: "Extracts equipment tags (PT-101, P-101A) and builds relational linkage keys.",
        type: "Engine",
      },
    ],
  },
  {
    id: "svc-compliance",
    name: "Compliance Intelligence Core",
    category: "Governance & Reliability",
    description: "Automated regulatory audits checking operational SOPs against OSHA 1910 and ISO 45001 safety clauses.",
    route: "/workspace/compliance",
    status: "Operational",
    components: [
      {
        name: "Zero-Token Deterministic Rule Engine",
        description: "Evaluates exact regulatory requirements with sub-millisecond rule evaluation.",
        type: "Engine",
        tag: "Zero-Token",
      },
      {
        name: "OSHA 1910 Process Safety Standard",
        description: "Audits emergency isolation, hazardous chemical containment, and pressure limits.",
        type: "Security",
        tag: "OSHA 1910",
      },
      {
        name: "ISO 45001 Occupational Health Auditor",
        description: "Verifies mandatory operator safety sign-offs, protective equipment, and inspection intervals.",
        type: "Security",
        tag: "ISO 45001",
      },
    ],
  },
  {
    id: "svc-maintenance",
    name: "Predictive Maintenance & Reliability Service",
    category: "Governance & Reliability",
    description: "Real-time telemetry stream processing, vibration harmonic FFT decomposition, and MTBF forecasting.",
    route: "/workspace/maintenance",
    status: "Operational",
    components: [
      {
        name: "Vibration FFT Spectral Analyzer",
        description: "Identifies 1X, 2X, and high-frequency harmonics indicating unbalance and bearing wear.",
        type: "Algorithm",
        tag: "FFT Spectral",
      },
      {
        name: "Weibull Failure Rate Forecaster",
        description: "Estimates remaining useful life and failure probabilities before threshold breach.",
        type: "Model",
        tag: "MTBF Forecaster",
      },
      {
        name: "Telemetry Anomaly Trigger",
        description: "Monitors streaming pressure, temperature, and RPM sensors against nominal envelopes.",
        type: "Engine",
      },
    ],
  },
  {
    id: "svc-knowledge",
    name: "Enterprise Knowledge Base (Google OKF)",
    category: "Knowledge & Retrieval",
    description: "Standardized entity-relationship knowledge graph storing engineering taxonomies and component specs.",
    route: "/workspace/knowledge",
    status: "Operational",
    components: [
      {
        name: "Google OKF v1.0 Graph Standard",
        description: "Represents entities, relationships, attributes, and temporal validity intervals.",
        type: "Engine",
        tag: "Google OKF",
      },
      {
        name: "Relational Taxonomy Mapper",
        description: "Connects operational units (Boiler Plant 101) to sub-systems, pumps, and valves.",
        type: "Engine",
      },
    ],
  },
  {
    id: "svc-auth",
    name: "Authentication & Granular RBAC Service",
    category: "Platform & Security",
    description: "WorkOS Dual Authentication provider separating enterprise corporate accounts from demo sandboxes.",
    route: "/workspace/admin",
    status: "Operational",
    components: [
      {
        name: "WorkOS Dual Context Provider",
        description: "Cryptographically isolated JWT signature keys guaranteeing zero credential crossover.",
        type: "Security",
        tag: "WorkOS SSO",
      },
      {
        name: "Granular RBAC Enforcer",
        description: "Strict role enforcement across Super Admin, Engineer, Auditor, and Member tiers.",
        type: "Security",
        tag: "RBAC Enforcer",
      },
    ],
  },
];

export default function ServicesCatalogPage() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredServices = useMemo(() => {
    const q = searchFilter.toLowerCase().trim();
    return SERVICES_CATALOG.filter((svc) => {
      if (selectedCategory !== "all" && svc.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      const matchesSvc =
        svc.name.toLowerCase().includes(q) ||
        svc.description.toLowerCase().includes(q) ||
        svc.category.toLowerCase().includes(q);
      const matchesCmp = svc.components.some(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.tag && c.tag.toLowerCase().includes(q))
      );
      return matchesSvc || matchesCmp;
    });
  }, [searchFilter, selectedCategory]);

  const categories = [
    "all",
    "Intelligence & Reasoning",
    "Knowledge & Retrieval",
    "Governance & Reliability",
    "Platform & Security",
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-10 flex flex-col gap-8 font-sans">
      
      {/* ── 1. PAGE HEADER (Spacious & Architectural) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary">
            <Link href="/workspace" className="text-text-secondary hover:underline">
              Workspace
            </Link>
            <span>/</span>
            <span className="text-text-primary font-semibold">Services &amp; Components Catalog</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Enterprise Architecture &amp; Component Directory
          </h1>
          <p className="text-sm text-text-secondary max-w-2xl">
            Explore Axios&apos;s modular industrial intelligence services, underlying algorithms, ingestion pipelines, and security enforcers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full border border-border-subtle bg-bg-secondary text-xs font-mono text-text-secondary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{SERVICES_CATALOG.length} Core Services Operational</span>
          </span>
        </div>
      </div>

      {/* ── 2. SEARCH & CATEGORY FILTER TABS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter any service, engine, algorithm, or tool..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border-strong bg-bg-primary text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-text-tertiary hover:text-text-primary cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer",
                selectedCategory === cat
                  ? "bg-text-primary text-bg-primary font-semibold shadow-xs"
                  : "bg-bg-secondary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary border border-border-subtle"
              )}
            >
              {cat === "all" ? "All Services" : cat}
            </button>
          ))}
        </div>

      </div>

      {/* ── 3. SPACIOUS SERVICES & COMPONENTS CARDS LIST ── */}
      <div className="space-y-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((svc) => (
            <div
              key={svc.id}
              className="p-6 rounded-xl border border-border-subtle bg-bg-primary shadow-xs hover:border-border-strong transition-all flex flex-col gap-5"
            >
              {/* Service Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-border-subtle">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold">
                      {svc.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border-strong" />
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium">
                      {svc.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-text-primary">
                    {svc.name}
                  </h2>
                  <p className="text-xs text-text-secondary max-w-3xl leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                <Link
                  href={svc.route}
                  className="h-8.5 px-3.5 rounded-md bg-bg-secondary hover:bg-bg-tertiary border border-border-subtle text-xs font-semibold text-text-primary transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight size={13} className="text-accent" />
                </Link>
              </div>

              {/* Sub-components & Tools Grid */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold block">
                  Sub-Components &amp; Engineered Tools ({svc.components.length})
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {svc.components.map((cmp, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-lg border border-border-subtle bg-bg-secondary/60 hover:bg-bg-secondary transition-colors flex flex-col justify-between gap-2"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-text-primary truncate">
                            {cmp.name}
                          </span>
                          {cmp.tag && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-bg-primary border border-border-subtle text-text-tertiary shrink-0 font-medium">
                              {cmp.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-secondary leading-relaxed">
                          {cmp.description}
                        </p>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                        <span>Type: {cmp.type}</span>
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center rounded-xl border border-dashed border-border-subtle text-text-tertiary text-sm">
            No services or components matched &quot;{searchFilter}&quot;.
          </div>
        )}
      </div>

    </div>
  );
}
