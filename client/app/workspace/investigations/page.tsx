"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Search,
  Bot,
  ShieldCheck,
  Wrench,
  ChevronRight,
  Plus,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Tag,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveInvestigation {
  id: string;
  tag: string;
  title: string;
  module: "assistant" | "compliance" | "maintenance" | "search";
  moduleLabel: string;
  status: "Verified" | "Grounded" | "In Review" | "Nominal";
  statusColor: string;
  target: string;
  priority: "High" | "Medium" | "Low";
  updatedAt: string;
  href: string;
}

const INVESTIGATIONS: ActiveInvestigation[] = [
  {
    id: "inv-001",
    tag: "COP-410",
    title: "High-pressure boiler feedwater pump P-101A isolation procedure",
    module: "assistant",
    moduleLabel: "Workforce Copilot",
    status: "Grounded",
    statusColor: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    target: "PND-4012 / SOP-8842",
    priority: "High",
    updatedAt: "14m ago",
    href: "/workspace/assistant?prompt=isolation%20procedure%20for%20pump%20P-101A",
  },
  {
    id: "inv-002",
    tag: "ISO-45001",
    title: "Quarterly chemical storage & emergency shutoff valve compliance audit",
    module: "compliance",
    moduleLabel: "Compliance Core",
    status: "Verified",
    statusColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    target: "OSHA 1910.119 / ISO 45001",
    priority: "High",
    updatedAt: "38m ago",
    href: "/workspace/compliance",
  },
  {
    id: "inv-003",
    tag: "TEL-302",
    title: "Turbine Compressor C-302 bearing vibration frequency harmonics",
    module: "maintenance",
    moduleLabel: "Predictive Maintenance",
    status: "Nominal",
    statusColor: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    target: "Telemetry Loop C-302",
    priority: "Medium",
    updatedAt: "1h ago",
    href: "/workspace/maintenance",
  },
  {
    id: "inv-004",
    tag: "SOP-8842",
    title: "Reciprocal Rank Fusion hybrid retrieval on high-pressure steam valves",
    module: "search",
    moduleLabel: "Hybrid Search",
    status: "Verified",
    statusColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    target: "6 indexed passages",
    priority: "Medium",
    updatedAt: "3h ago",
    href: "/workspace/search?q=high-pressure%20steam%20valves",
  },
  {
    id: "inv-005",
    tag: "SOP-3104",
    title: "Heat Exchanger E-204 shell-side chemical descaling flush protocol",
    module: "assistant",
    moduleLabel: "Workforce Copilot",
    status: "Grounded",
    statusColor: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    target: "PND-2041 / SOP-3104",
    priority: "Medium",
    updatedAt: "4h ago",
    href: "/workspace/assistant?prompt=descaling%20procedure%20for%20E-204",
  },
  {
    id: "inv-006",
    tag: "CAL-101",
    title: "Differential pressure transmitter PT-101 4-20mA calibration audit",
    module: "compliance",
    moduleLabel: "Compliance Core",
    status: "Verified",
    statusColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    target: "ISA 5.1 / ISA-TR84",
    priority: "Low",
    updatedAt: "6h ago",
    href: "/workspace/compliance",
  },
  {
    id: "inv-007",
    tag: "MTBF-900",
    title: "Centrifugal pump bearing wear analysis & MTBF predictive lifespan model",
    module: "maintenance",
    moduleLabel: "Predictive Maintenance",
    status: "In Review",
    statusColor: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    target: "Asset Fleet Group A",
    priority: "High",
    updatedAt: "8h ago",
    href: "/workspace/maintenance",
  },
  {
    id: "inv-008",
    tag: "ING-202",
    title: "OCR table structure extraction for engineering valve schedule spec sheets",
    module: "search",
    moduleLabel: "Ingestion Core",
    status: "Verified",
    statusColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    target: "Doc: Valve-Schedule-Rev4.pdf",
    priority: "Low",
    updatedAt: "12h ago",
    href: "/workspace/documents",
  },
];

export default function InvestigationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    return INVESTIGATIONS.filter((item) => {
      if (statusFilter !== "all" && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      if (moduleFilter !== "all" && item.module !== moduleFilter) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.tag.toLowerCase().includes(q) ||
          item.target.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, statusFilter, moduleFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 font-sans min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary">
            <Link href="/workspace" className="text-text-secondary hover:text-text-primary transition-colors">
              Workspace
            </Link>
            <span>/</span>
            <span className="text-text-primary font-semibold">Active Inquiries & Queue</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-border-strong hidden sm:inline-block" />
          <span className="px-2 py-0.5 rounded-full border border-border-subtle bg-bg-secondary text-[11px] font-mono text-text-secondary">
            {INVESTIGATIONS.length} Total Procedures
          </span>
        </div>

        <Link
          href="/workspace/assistant"
          className="h-8.5 px-3.5 rounded-md bg-text-primary hover:opacity-90 text-bg-primary text-xs font-semibold transition-opacity flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus size={13} />
          <span>New Inquiry</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Filter inquiries by tag, equipment, or target..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-bg-primary border border-border-strong rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {["all", "grounded", "verified", "nominal", "in review"].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors shrink-0 cursor-pointer",
                statusFilter === st
                  ? "bg-text-primary text-bg-primary"
                  : "bg-bg-secondary text-text-secondary hover:text-text-primary border border-border-subtle"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Table */}
      <div className="rounded-lg border border-border-subtle bg-bg-primary overflow-x-auto shadow-xs">
        <div className="min-w-[680px]">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-bg-secondary border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold">
            <span className="col-span-1">ID</span>
            <span className="col-span-5">Investigation / Procedure Title</span>
            <span className="col-span-2">Module</span>
            <span className="col-span-2">Target Ref</span>
            <span className="col-span-1">Status</span>
            <span className="col-span-1 text-right">Action</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border-subtle">
            {paginated.length > 0 ? (
              paginated.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="grid grid-cols-12 gap-3 px-4 py-3.5 items-center hover:bg-bg-secondary/70 transition-colors text-xs group"
                >
                  {/* Tag */}
                  <span className="col-span-1 font-mono font-medium text-text-tertiary group-hover:text-text-primary transition-colors">
                    {item.tag}
                  </span>

                  {/* Title & Priority */}
                  <div className="col-span-5 flex flex-col min-w-0 pr-2">
                    <span className="font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[11px] font-mono text-text-tertiary">
                      Priority: {item.priority} · Updated {item.updatedAt}
                    </span>
                  </div>

                  {/* Module */}
                  <div className="col-span-2 flex items-center gap-1.5 text-text-secondary min-w-0">
                    {item.module === "assistant" && <Bot size={13} className="text-blue-500 shrink-0" />}
                    {item.module === "compliance" && <ShieldCheck size={13} className="text-emerald-500 shrink-0" />}
                    {item.module === "maintenance" && <Wrench size={13} className="text-purple-500 shrink-0" />}
                    {item.module === "search" && <Search size={13} className="text-text-tertiary shrink-0" />}
                    <span className="truncate">{item.moduleLabel}</span>
                  </div>

                  {/* Target */}
                  <div className="col-span-2 font-mono text-[11px] text-text-tertiary truncate">
                    {item.target}
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-1 flex items-center">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-mono font-semibold border", item.statusColor)}>
                      {item.status}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="col-span-1 flex items-center justify-end gap-1 text-[11px] font-mono text-text-tertiary">
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform text-accent" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-text-tertiary text-xs">
                No matching inquiries found for the selected filter.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-text-tertiary pt-2">
        <span>
          Showing {paginated.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(page * pageSize, filtered.length)} of {filtered.length} inquiries
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-2.5 py-1 rounded border border-border-subtle bg-bg-primary hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-mono"
          >
            Previous
          </button>
          <span className="font-mono px-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-2.5 py-1 rounded border border-border-subtle bg-bg-primary hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-mono"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
