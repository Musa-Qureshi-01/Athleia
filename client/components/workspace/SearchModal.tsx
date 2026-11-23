"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  FileText,
  Cpu,
  ArrowRight,
  CornerDownLeft,
  Bot,
  ShieldCheck,
  Wrench,
  Database,
  Upload,
  Settings,
  Shield,
  Layers,
  Activity,
  Tag,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchItem {
  id: string;
  title: string;
  category: "service" | "component" | "document" | "equipment" | "action";
  categoryLabel: string;
  description: string;
  keywords: string[];
  href: string;
  badge?: string;
}

const SEARCHABLE_ITEMS: SearchItem[] = [
  // ── Services ──
  {
    id: "svc-assistant",
    title: "Workforce Copilot",
    category: "service",
    categoryLabel: "Core Service",
    description: "Autonomous multi-tool conversational assistant with grounded citation attribution.",
    keywords: ["copilot", "assistant", "ai", "chat", "reasoning", "help", "sop"],
    href: "/workspace/assistant",
    badge: "Alt+C",
  },
  {
    id: "svc-search",
    title: "Hybrid Semantic Search",
    category: "service",
    categoryLabel: "Core Service",
    description: "Dense vector embeddings combined with BM25 exact keyword matching and RRF.",
    keywords: ["search", "semantic", "retrieval", "vector", "bm25", "find", "query"],
    href: "/workspace/search",
    badge: "⌘K",
  },
  {
    id: "svc-documents",
    title: "Document Ingestion & Corpus",
    category: "service",
    categoryLabel: "Core Service",
    description: "Multi-format OCR, table extraction, and CAD P&ID symbol vectorization.",
    keywords: ["documents", "ingest", "upload", "pdf", "cad", "p&id", "corpus"],
    href: "/workspace/documents",
    badge: "Ingestion",
  },
  {
    id: "svc-compliance",
    title: "Compliance Intelligence Core",
    category: "service",
    categoryLabel: "Core Service",
    description: "Automated regulatory audits against OSHA 1910 and ISO 45001 safety clauses.",
    keywords: ["compliance", "audit", "osha", "iso", "regulations", "safety", "rules"],
    href: "/workspace/compliance",
    badge: "Governance",
  },
  {
    id: "svc-maintenance",
    title: "Predictive Maintenance & Reliability",
    category: "service",
    categoryLabel: "Core Service",
    description: "Real-time telemetry monitoring, vibration FFT analysis, and MTBF forecasting.",
    keywords: ["maintenance", "telemetry", "vibration", "mtbf", "fft", "sensor", "equipment"],
    href: "/workspace/maintenance",
    badge: "Predictive",
  },
  {
    id: "svc-knowledge",
    title: "Enterprise Knowledge Base",
    category: "service",
    categoryLabel: "Core Service",
    description: "Google OKF v1.0 standard representation and entity-relationship graph mapping.",
    keywords: ["knowledge", "graph", "okf", "entities", "taxonomy", "specifications"],
    href: "/workspace/knowledge",
    badge: "Knowledge",
  },
  {
    id: "svc-intelligence",
    title: "Grounded Reasoning Engine",
    category: "service",
    categoryLabel: "Core Service",
    description: "Multi-step verification pipeline with formal citation scoring and zero hallucination.",
    keywords: ["reasoning", "intelligence", "grounded", "eval", "citations", "verify"],
    href: "/workspace/intelligence",
    badge: "Reasoning",
  },
  {
    id: "svc-catalog",
    title: "Services & Components Catalog",
    category: "service",
    categoryLabel: "Directory",
    description: "Complete architectural directory of all Axios services, sub-components, and tools.",
    keywords: ["catalog", "services", "components", "architecture", "directory", "tools"],
    href: "/workspace/catalog",
    badge: "New Page",
  },
  {
    id: "svc-admin",
    title: "Organization Admin & RBAC",
    category: "service",
    categoryLabel: "Administration",
    description: "Manage enterprise user roles, permissions, WorkOS directory sync, and user access.",
    keywords: ["admin", "users", "rbac", "roles", "permissions", "team", "organization"],
    href: "/workspace/admin",
    badge: "Admin",
  },
  {
    id: "svc-settings",
    title: "Preferences & Workstation Settings",
    category: "service",
    categoryLabel: "Settings",
    description: "Configure themes, system defaults, notification thresholds, and security preferences.",
    keywords: ["settings", "preferences", "config", "account", "profile", "theme"],
    href: "/workspace/settings",
  },

  // ── Components & Tools ──
  {
    id: "cmp-pid-parser",
    title: "P&ID Symbol Extractor & CAD Ingestion",
    category: "component",
    categoryLabel: "Component / Ingestion",
    description: "Vectorizes instrument bubbles, valves, actuators, and piping process flow lines.",
    keywords: ["pid", "cad", "symbols", "valves", "piping", "schematics", "ocr"],
    href: "/workspace/documents",
    badge: "Tool",
  },
  {
    id: "cmp-bm25",
    title: "Dense Vector & BM25 Hybrid Fusion",
    category: "component",
    categoryLabel: "Component / Search",
    description: "Reciprocal Rank Fusion pairing 384-dimensional dense vectors with exact lexical matching.",
    keywords: ["bm25", "rrf", "dense", "vector", "lexical", "hybrid", "ranking"],
    href: "/workspace/search",
    badge: "Algorithm",
  },
  {
    id: "cmp-citation-scorer",
    title: "Citation Attribution & Grounding Verifier",
    category: "component",
    categoryLabel: "Component / Reasoning",
    description: "Scores evidence snippets to guarantee answers are grounded strictly in source docs.",
    keywords: ["citation", "attribution", "confidence", "grounding", "evidence", "proof"],
    href: "/workspace/intelligence",
    badge: "Security",
  },
  {
    id: "cmp-osha-engine",
    title: "OSHA 1910 & ISO 45001 Rule Engine",
    category: "component",
    categoryLabel: "Component / Compliance",
    description: "Zero-token deterministic policy evaluator checking chemical and pressure safety clauses.",
    keywords: ["osha", "iso", "iso45001", "safety", "clauses", "rules", "violation"],
    href: "/workspace/compliance",
    badge: "Rule Engine",
  },
  {
    id: "cmp-vibration-fft",
    title: "Vibration FFT Harmonics Analyzer",
    category: "component",
    categoryLabel: "Component / Maintenance",
    description: "Fast Fourier Transform spectral decomposition for bearing failure and misalignment.",
    keywords: ["fft", "vibration", "harmonics", "bearing", "frequency", "telemetry"],
    href: "/workspace/maintenance",
    badge: "Analytics",
  },
  {
    id: "cmp-mtbf-forecaster",
    title: "MTBF Equipment Reliability Forecaster",
    category: "component",
    categoryLabel: "Component / Maintenance",
    description: "Weibull failure rate modeling and mean time between failure remaining days calculation.",
    keywords: ["mtbf", "weibull", "reliability", "forecasting", "anomaly", "prediction"],
    href: "/workspace/maintenance",
    badge: "Predictor",
  },
  {
    id: "cmp-workos-auth",
    title: "WorkOS Dual Authentication Provider",
    category: "component",
    categoryLabel: "Component / Security",
    description: "Cryptographically isolated authentication contexts for corporate SSO and demo sandboxes.",
    keywords: ["workos", "auth", "sso", "jwt", "login", "security", "credentials"],
    href: "/workspace/settings",
    badge: "Security",
  },

  // ── Equipment & Plant Tags ──
  {
    id: "eq-p101a",
    title: "Pump P-101A (Boiler Feedwater)",
    category: "equipment",
    categoryLabel: "Plant Asset",
    description: "Centrifugal boiler feed pump. Nominal suction pressure: 4.2 bar. Location: Station 101.",
    keywords: ["p101a", "p-101a", "pump", "boiler", "feedwater", "station 101"],
    href: "/workspace/assistant?prompt=Find%20isolation%20procedure%20for%20pump%20P-101A",
    badge: "Tag: P-101A",
  },
  {
    id: "eq-c302",
    title: "Turbine Compressor C-302",
    category: "equipment",
    categoryLabel: "Plant Asset",
    description: "High-pressure gas turbine compressor. Bearing vibration: 1.8 mm/s RMS (Nominal).",
    keywords: ["c302", "c-302", "compressor", "turbine", "vibration"],
    href: "/workspace/maintenance",
    badge: "Tag: C-302",
  },
  {
    id: "eq-pt101",
    title: "Pressure Transmitter PT-101",
    category: "equipment",
    categoryLabel: "Plant Asset",
    description: "Suction line pressure transmitter. Operating range: 0-10 bar (4-20mA loop).",
    keywords: ["pt101", "pt-101", "transmitter", "pressure", "suction"],
    href: "/workspace/search?q=PT-101%20pressure%20transmitter",
    badge: "Tag: PT-101",
  },
  {
    id: "eq-eco8842",
    title: "Steam Isolation Valve ECO-8842",
    category: "equipment",
    categoryLabel: "Plant Asset",
    description: "Emergency high-pressure steam isolation gate valve with pneumatic actuator.",
    keywords: ["eco8842", "eco-8842", "valve", "steam", "isolation", "actuator"],
    href: "/workspace/assistant?prompt=Summarize%20ECO-8842%20valve%20lockout%20procedure",
    badge: "Tag: ECO-8842",
  },

  // ── Corpus Documents ──
  {
    id: "doc-arch-spec",
    title: "System_Architecture_&_Design_Specification.pdf",
    category: "document",
    categoryLabel: "Engineering Spec",
    description: "Enterprise Distributed Architecture, Microservice Gateway topology, and circuit breakers.",
    keywords: ["architecture", "spec", "system design", "gateway", "microservices"],
    href: "/workspace/search?q=System_Architecture",
    badge: "1.85 MB",
  },
  {
    id: "doc-pid-4012",
    title: "PND-4012_PUMP_STATION_PID.pdf",
    category: "document",
    categoryLabel: "P&ID Schematic",
    description: "Cooling Water Station 101 P&ID schematic detailing Pump P-101A and PT-101.",
    keywords: ["pnd-4012", "pnd", "pid", "cooling water", "schematic"],
    href: "/workspace/search?q=PND-4012",
    badge: "3.20 MB",
  },
  {
    id: "doc-sop-shutdown",
    title: "SOP_Emergency_Shutdown_Protocol.pdf",
    category: "document",
    categoryLabel: "Operating SOP",
    description: "Level 1-3 emergency shutdown triggers, valve interlocks, and flare depressurization.",
    keywords: ["sop", "shutdown", "emergency", "protocol", "interlocks", "safety"],
    href: "/workspace/search?q=Emergency_Shutdown",
    badge: "920 KB",
  },

  // ── Quick Actions ──
  {
    id: "act-new-query",
    title: "Ask Workforce Copilot a Question",
    category: "action",
    categoryLabel: "Quick Action",
    description: "Launch conversational reasoning agent to cross-reference procedures and telemetry.",
    keywords: ["ask", "new", "copilot", "query", "question", "chat"],
    href: "/workspace/assistant",
    badge: "Alt+C",
  },
  {
    id: "act-upload-doc",
    title: "Upload & Ingest New Document / P&ID",
    category: "action",
    categoryLabel: "Quick Action",
    description: "Add a PDF, CAD schematic, or technical datasheet to the enterprise vector index.",
    keywords: ["upload", "add", "import", "ingest", "new document"],
    href: "/workspace/documents",
    badge: "Upload",
  },
  {
    id: "act-run-audit",
    title: "Run Real-Time Compliance Audit",
    category: "action",
    categoryLabel: "Quick Action",
    description: "Execute zero-token policy check against OSHA 1910 and ISO 45001 safety clauses.",
    keywords: ["audit", "run audit", "check compliance", "osha audit"],
    href: "/workspace/compliance",
    badge: "Audit",
  },
];

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "service" | "component" | "document" | "equipment" | "action">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  // Global shortcut listeners (⌘K, Ctrl+K, Escape, Arrows)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (open) onClose();
      }
      if (e.key === "Escape" && open) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Filtered Results
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return SEARCHABLE_ITEMS.filter((item) => {
      if (selectedFilter !== "all" && item.category !== selectedFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.keywords.some((kw) => kw.toLowerCase().includes(q))
      );
    });
  }, [query, selectedFilter]);

  // Handle arrow key navigation in search list
  const handleKeyDownInList = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (query.trim()) {
        onClose();
        router.push(`/workspace/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleSelect = (item: SearchItem) => {
    onClose();
    router.push(item.href);
  };

  const getItemIcon = (category: string) => {
    switch (category) {
      case "service":
        return <Cpu size={14} className="text-blue-600" />;
      case "component":
        return <Layers size={14} className="text-purple-600" />;
      case "document":
        return <FileText size={14} className="text-text-secondary" />;
      case "equipment":
        return <Tag size={14} className="text-amber-600" />;
      case "action":
        return <Zap size={14} className="text-emerald-600" />;
      default:
        return <Search size={14} className="text-text-tertiary" />;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
            onClick={onClose}
          />

          {/* Dialog Container */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -6 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl rounded-xl border border-border-strong shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[82vh]"
              style={{ backgroundColor: "var(--bg-primary)" }}
              onKeyDown={handleKeyDownInList}
            >
              {/* Form Input Header */}
              <div className="flex items-center gap-3 px-4 h-13 border-b border-border-subtle shrink-0">
                <Search size={18} className="text-text-tertiary shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Search any service, component, document, or equipment tag (e.g. P-101A)..."
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    className="text-text-tertiary hover:text-text-primary p-1 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-2 py-0.5 text-[10px] font-mono text-text-tertiary border border-border-subtle rounded hover:text-text-primary cursor-pointer"
                >
                  ESC
                </button>
              </div>

              {/* Category Filter Pills (Glean & Linear style) */}
              <div className="px-4 py-2 border-b border-border-subtle bg-bg-secondary/60 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
                {[
                  { key: "all", label: "All Items" },
                  { key: "service", label: "Services (10)" },
                  { key: "component", label: "Components (7)" },
                  { key: "document", label: "Documents (3)" },
                  { key: "equipment", label: "Plant Tags (4)" },
                  { key: "action", label: "Actions (3)" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(tab.key as any);
                      setSelectedIndex(0);
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer",
                      selectedFilter === tab.key
                        ? "bg-text-primary text-bg-primary font-semibold shadow-2xs"
                        : "text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Results List */}
              <div className="p-2 overflow-y-auto flex-1 divide-y divide-border-subtle/40">
                {results.length > 0 ? (
                  results.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between gap-3 transition-colors cursor-pointer",
                          isSelected
                            ? "bg-bg-tertiary border border-border-strong text-text-primary"
                            : "hover:bg-bg-secondary border border-transparent text-text-secondary"
                        )}
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="p-2 rounded-md bg-bg-secondary border border-border-subtle shrink-0 mt-0.5">
                            {getItemIcon(item.category)}
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={cn("text-xs font-semibold truncate", isSelected ? "text-accent" : "text-text-primary")}>
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-bg-secondary border border-border-subtle text-text-tertiary font-semibold shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-text-tertiary truncate mt-0.5">
                              {item.description}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider hidden sm:inline-block">
                            {item.categoryLabel}
                          </span>
                          <ArrowRight size={13} className={cn("transition-transform", isSelected ? "text-accent translate-x-0.5" : "text-text-tertiary")} />
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                    <Search size={22} className="text-text-tertiary" />
                    <span className="text-xs text-text-secondary font-medium">
                      No matching services, components, or documents found for &quot;{query}&quot;
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        router.push(`/workspace/search?q=${encodeURIComponent(query)}`);
                      }}
                      className="mt-2 text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Search full index for &quot;{query}&quot;</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-border-subtle bg-bg-secondary flex items-center justify-between text-[11px] font-mono text-text-tertiary shrink-0">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.2 rounded border border-border-subtle bg-bg-primary text-[9px]">↑</kbd>
                    <kbd className="px-1 py-0.2 rounded border border-border-subtle bg-bg-primary text-[9px]">↓</kbd>
                    <span className="ml-1 text-[10px]">Navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.2 rounded border border-border-subtle bg-bg-primary text-[9px]">↵</kbd>
                    <span className="ml-1 text-[10px]">Open</span>
                  </span>
                </div>
                <span>Axios Unified Omni-Search</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
