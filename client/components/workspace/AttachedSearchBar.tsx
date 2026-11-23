"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  FileText,
  Cpu,
  Bot,
  ShieldCheck,
  Wrench,
  Database,
  Layers,
  Activity,
  Tag,
  Zap,
  Sliders,
  ChevronRight,
  CornerDownLeft,
  Sparkles,
  ArrowRight,
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
    id: "svc-telemetry",
    title: "Plant Asset Telemetry Desk",
    category: "service",
    categoryLabel: "Telemetry",
    description: "Live SCADA loop monitoring, vibration harmonics, and P&ID cross-references.",
    keywords: ["telemetry", "assets", "pump", "compressor", "scada", "modbus", "loop"],
    href: "/workspace/telemetry",
    badge: "Live",
  },
  {
    id: "svc-investigations",
    title: "Active Inquiries & Work Queue",
    category: "service",
    categoryLabel: "Work Queue",
    description: "Complete desk of ongoing engineering investigations, SOP procedures, and tasks.",
    keywords: ["inquiries", "investigations", "queue", "tasks", "work", "sop"],
    href: "/workspace/investigations",
    badge: "Queue",
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
    id: "svc-integrations",
    title: "Model Context Protocol (MCP) Integrations",
    category: "service",
    categoryLabel: "Integrations",
    description: "Google Workspace, Jira, Slack, Notion, GitHub, Glean Remote MCP, Context7 & databases.",
    keywords: ["integrations", "mcp", "google", "slack", "jira", "notion", "github", "glean", "context7"],
    href: "/workspace/integrations",
    badge: "New",
  },
  {
    id: "svc-voice",
    title: "Axios's Voice Copilot",
    category: "service",
    categoryLabel: "Voice Copilot",
    description: "Hands-free real-time industrial voice agent for field plant technicians with noise suppression.",
    keywords: ["voice", "audio", "speech", "mic", "talk", "handsfree", "field", "sound"],
    href: "/workspace/voice",
    badge: "New",
  },
  {
    id: "svc-issues",
    title: "Issues & Engineering Requests",
    category: "service",
    categoryLabel: "Work Orders",
    description: "Plant safety anomalies, work orders, engineering change requests, and maintenance tickets.",
    keywords: ["issues", "requests", "tickets", "anomalies", "work orders", "ecr", "incident"],
    href: "/workspace/issues",
    badge: "New",
  },
  {
    id: "svc-catalog",
    title: "Services & Components Catalog",
    category: "service",
    categoryLabel: "Directory",
    description: "Complete architectural directory of all Axios services, sub-components, and tools.",
    keywords: ["catalog", "services", "components", "architecture", "directory", "tools"],
    href: "/workspace/catalog",
    badge: "Directory",
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

  // ── Components & Pipelines ──
  {
    id: "comp-vector-index",
    title: "Dense Vector Indexer",
    category: "component",
    categoryLabel: "Component",
    description: "HNSW high-dimensional cosine similarity embeddings pipeline.",
    keywords: ["vector", "embeddings", "hnsw", "indexing", "retrieval"],
    href: "/workspace/catalog#retrieval-service",
    badge: "Retrieval",
  },
  {
    id: "comp-rrf",
    title: "Reciprocal Rank Fusion (RRF)",
    category: "component",
    categoryLabel: "Component",
    description: "Dynamic k=60 ranking fusion algorithm balancing sparse and dense relevance.",
    keywords: ["rrf", "rank", "fusion", "hybrid", "scoring"],
    href: "/workspace/catalog#retrieval-service",
    badge: "Algorithm",
  },
  {
    id: "comp-ocr-parser",
    title: "Document OCR & Table Extractor",
    category: "component",
    categoryLabel: "Component",
    description: "Tesseract & vision transformer OCR parsing P&ID drawings and equipment schedules.",
    keywords: ["ocr", "tables", "pdf", "parser", "tesseract"],
    href: "/workspace/catalog#ingestion-service",
    badge: "Ingestion",
  },
  {
    id: "comp-cad-symbol",
    title: "CAD & P&ID Region Detector",
    category: "component",
    categoryLabel: "Component",
    description: "Computer vision bounding box detector isolating valves, pumps, and pipe loops.",
    keywords: ["cad", "symbols", "detector", "valves", "p&id", "dwg"],
    href: "/workspace/catalog#ingestion-service",
    badge: "Ingestion",
  },
  {
    id: "comp-osha-auditor",
    title: "OSHA & ISO Regulatory Auditor",
    category: "component",
    categoryLabel: "Component",
    description: "Cross-checks plant SOP execution against OSHA 1910.119 and ISO 45001 clauses.",
    keywords: ["osha", "iso", "auditor", "safety", "clauses"],
    href: "/workspace/catalog#compliance-service",
    badge: "Compliance",
  },
  {
    id: "comp-fft-analyzer",
    title: "Vibration Spectrum FFT Analyzer",
    category: "component",
    categoryLabel: "Component",
    description: "Fast Fourier Transform vibration spectral density and harmonic frequency tracking.",
    keywords: ["vibration", "fft", "harmonics", "spectrum", "frequency"],
    href: "/workspace/catalog#maintenance-service",
    badge: "Maintenance",
  },

  // ── Document Corpus ──
  {
    id: "doc-pnd-4012",
    title: "P&ID Drawing PND-4012 (Rev C)",
    category: "document",
    categoryLabel: "Document",
    description: "High-pressure boiler feedwater loop with isolation valves V-101 through V-108.",
    keywords: ["pnd-4012", "p&id", "boiler", "feedwater", "drawing", "valves"],
    href: "/workspace/documents",
    badge: "PDF / CAD",
  },
  {
    id: "doc-sop-8842",
    title: "Standard Operating Procedure SOP-8842",
    category: "document",
    categoryLabel: "Document",
    description: "Centrifugal Pump P-101A emergency shutdown and lockout/tagout protocol.",
    keywords: ["sop-8842", "sop", "isolation", "pump", "lockout", "p-101a"],
    href: "/workspace/documents",
    badge: "Procedure",
  },
  {
    id: "doc-sop-3104",
    title: "Maintenance Manual SOP-3104",
    category: "document",
    categoryLabel: "Document",
    description: "Heat Exchanger E-204 shell-side chemical descaling flush protocol.",
    keywords: ["sop-3104", "descaling", "exchanger", "e-204", "flush", "chemical"],
    href: "/workspace/documents",
    badge: "Procedure",
  },
  {
    id: "doc-pnd-1048",
    title: "P&ID Drawing PND-1048 (Rev B)",
    category: "document",
    categoryLabel: "Document",
    description: "Multi-stage synthesis gas compressor C-302 loop and intercooler relief valves.",
    keywords: ["pnd-1048", "compressor", "c-302", "gas", "intercooler"],
    href: "/workspace/documents",
    badge: "PDF / CAD",
  },

  // ── Equipment Tags ──
  {
    id: "eq-p101a",
    title: "P-101A (Boiler Feedwater Pump)",
    category: "equipment",
    categoryLabel: "Plant Asset",
    description: "Discharge Pressure 142.4 PSI · 3,450 RPM · Vibration 1.8 mm/s RMS (Healthy).",
    keywords: ["p-101a", "pump", "feedwater", "boiler", "tag", "equipment"],
    href: "/workspace/telemetry",
    badge: "142 PSI",
  },
  {
    id: "eq-c302",
    title: "C-302 (Synthesis Gas Compressor)",
    category: "equipment",
    categoryLabel: "Plant Asset",
    description: "Discharge 48.6 bar · Stage 2 Temp 92.4°C · Vibration 2.1 mm/s RMS (Healthy).",
    keywords: ["c-302", "compressor", "gas", "synthesis", "tag", "equipment"],
    href: "/workspace/telemetry",
    badge: "48.6 bar",
  },
  {
    id: "eq-e204",
    title: "E-204 (Shell & Tube Heat Exchanger)",
    category: "equipment",
    categoryLabel: "Plant Asset",
    description: "Thermal differential ΔT 34.2°C · Process Flow 840 GPM · Shell pressure 18 bar.",
    keywords: ["e-204", "exchanger", "heat", "thermal", "tag", "equipment"],
    href: "/workspace/telemetry",
    badge: "ΔT 34°C",
  },
  {
    id: "eq-pt101",
    title: "PT-101 (Differential Pressure Transmitter)",
    category: "equipment",
    categoryLabel: "Plant Asset",
    description: "Loop Signal 14.2 mA · Range 0 - 200 mbar · ISA-TR84 Safety Instrumented Loop.",
    keywords: ["pt-101", "pressure", "transmitter", "safety", "sil", "tag"],
    href: "/workspace/telemetry",
    badge: "14.2 mA",
  },

  // ── Quick Actions ──
  {
    id: "act-copilot-new",
    title: "New Workforce Copilot Session",
    category: "action",
    categoryLabel: "Quick Action",
    description: "Open autonomous reasoning prompt console for grounded industrial assistance.",
    keywords: ["new", "copilot", "chat", "session", "ask", "assistant"],
    href: "/workspace/assistant",
    badge: "Alt+C",
  },
  {
    id: "act-upload-doc",
    title: "Upload & Ingest Engineering File",
    category: "action",
    categoryLabel: "Quick Action",
    description: "Upload P&ID PDF, CAD drawings, or SOPs into the OCR vector ingestion pipeline.",
    keywords: ["upload", "file", "ingest", "doc", "pdf", "cad"],
    href: "/workspace/documents",
    badge: "Action",
  },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "service", label: "Services" },
  { id: "component", label: "Components" },
  { id: "document", label: "Documents" },
  { id: "equipment", label: "Equipment Tags" },
  { id: "action", label: "Actions" },
];

export function AttachedSearchBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcut: ⌘K or / to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SEARCHABLE_ITEMS.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q);
      const kwMatch = item.keywords.some((k) => k.toLowerCase().includes(q));
      return titleMatch || descMatch || kwMatch;
    });
  }, [query, selectedCategory]);

  // Reset scroll and selection index on change
  useEffect(() => {
    setSelectedIndex(0);
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [query, selectedCategory, isOpen]);

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false);
    inputRef.current?.blur();
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (query.trim()) {
        setIsOpen(false);
        router.push(`/workspace/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const getItemIcon = (category: string) => {
    switch (category) {
      case "service":
        return <Cpu size={14} className="text-blue-600 shrink-0" />;
      case "component":
        return <Layers size={14} className="text-purple-600 shrink-0" />;
      case "document":
        return <FileText size={14} className="text-text-secondary shrink-0" />;
      case "equipment":
        return <Tag size={14} className="text-amber-600 shrink-0" />;
      case "action":
        return <Zap size={14} className="text-emerald-600 shrink-0" />;
      default:
        return <Search size={14} className="text-text-tertiary shrink-0" />;
    }
  };

  return (
    <>
      {/* High z-index backdrop overlay that dims all background main content */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 z-[90] backdrop-blur-[0.5px] transition-opacity"
        />
      )}

      {/* Main Search Container anchored in TopNav with high z-index */}
      <div
        ref={containerRef}
        className={cn(
          "relative flex-1 min-w-0 transition-all duration-200 z-[100]",
          isOpen ? "max-w-xl lg:max-w-2xl" : "max-w-md"
        )}
      >
        
        {/* The Search Input (AWS Console Style) */}
        <div
          className={cn(
            "relative flex items-center h-9 w-full rounded-sm border bg-bg-secondary transition-all shadow-2xs",
            isOpen
              ? "border-[#1F45EC] bg-bg-primary ring-2 ring-[#1F45EC]/20 shadow-lg"
              : "border-border-strong hover:border-text-primary hover:bg-bg-primary"
          )}
        >
          <div className="pl-3 text-text-tertiary">
            <Search size={14} className={isOpen ? "text-[#1F45EC]" : "text-text-tertiary"} />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search services, components, P&ID tags, docs..."
            className="w-full h-full pl-2.5 pr-16 text-xs text-text-primary bg-transparent placeholder:text-text-tertiary focus:outline-none"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="p-1 text-text-tertiary hover:text-text-primary rounded cursor-pointer"
              >
                <X size={12} />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono rounded border border-border-strong bg-bg-primary text-text-tertiary shadow-2xs">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* ── ATTACHED DROPDOWN PANEL (Anchored Directly Below Search Bar) ── */}
        {isOpen && (
          <div className="absolute top-[calc(100%+6px)] left-0 w-full min-w-[520px] max-w-[90vw] bg-bg-primary border border-border-strong rounded-sm shadow-2xl z-[100] overflow-hidden flex flex-col max-h-[460px] animate-in fade-in slide-in-from-top-1 duration-150">
            
            {/* Category Filter Pills (AWS Style) */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-bg-secondary border-b border-border-subtle overflow-x-auto scrollbar-none text-xs shrink-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-sm text-[11px] font-medium transition-colors shrink-0 cursor-pointer",
                    selectedCategory === cat.id
                      ? "bg-text-primary text-bg-primary font-semibold shadow-2xs"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Results List (Auto-scroll fixed) */}
            <div ref={listRef} className="flex-1 overflow-y-auto divide-y divide-border-subtle p-1.5">
              {results.length > 0 ? (
                results.slice(0, 10).map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "flex items-center justify-between gap-3 px-3 py-2 rounded-sm text-xs cursor-pointer transition-colors",
                        isSelected
                          ? "bg-bg-secondary text-text-primary font-medium"
                          : "text-text-secondary hover:bg-bg-secondary/70 hover:text-text-primary"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-sm bg-bg-primary border border-border-subtle flex items-center justify-center shrink-0">
                          {getItemIcon(item.category)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-text-primary truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-bg-tertiary text-text-tertiary border border-border-subtle shrink-0">
                              {item.categoryLabel}
                            </span>
                          </div>
                          <span className="text-[11px] text-text-tertiary line-clamp-1 mt-0.5">
                            {item.description}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-bg-tertiary text-text-tertiary border border-border-subtle">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight
                          size={14}
                          className={cn(
                            "transition-transform",
                            isSelected ? "text-[#1F45EC] translate-x-0.5" : "text-text-tertiary"
                          )}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-text-tertiary flex flex-col items-center gap-2">
                  <Search size={20} className="text-text-tertiary stroke-1" />
                  <span>No results found matching &ldquo;{query}&rdquo;</span>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push(`/workspace/search?q=${encodeURIComponent(query)}`);
                    }}
                    className="text-accent font-semibold hover:underline mt-1 cursor-pointer"
                  >
                    Search across full index corpus ↵
                  </button>
                </div>
              )}
            </div>

            {/* Dropdown Footer (AWS Style Keyboard Guide) */}
            <div className="px-3.5 py-2 bg-bg-secondary border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-tertiary shrink-0">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.2 rounded bg-bg-primary border border-border-strong text-[9px]">↑↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.2 rounded bg-bg-primary border border-border-strong text-[9px]">↵</kbd>
                  <span>select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.2 rounded bg-bg-primary border border-border-strong text-[9px]">esc</kbd>
                  <span>close</span>
                </span>
              </div>

              <Link
                href="/workspace/catalog"
                onClick={() => setIsOpen(false)}
                className="text-accent hover:underline flex items-center gap-0.5 font-semibold"
              >
                <span>Full Service Directory</span>
                <ChevronRight size={11} />
              </Link>
            </div>

          </div>
        )}

      </div>
    </>
  );
}
