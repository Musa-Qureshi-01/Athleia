"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ClipboardList,
  AlertCircle,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  Plus,
  ArrowUpRight,
  Bot,
  User,
  Wrench,
  ShieldAlert,
  ChevronDown,
  X,
  Check,
  Tag,
  Sliders,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IssueItem {
  id: string;
  title: string;
  type: "anomaly" | "ecr" | "compliance" | "maintenance";
  typeLabel: string;
  priority: "p1" | "p2" | "p3" | "p4";
  priorityLabel: string;
  asset: string;
  assignee: string;
  department: string;
  status: "open" | "investigating" | "pending_review" | "resolved";
  statusLabel: string;
  created: string;
  groundedDoc: string;
  summary: string;
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Load real user submitted issues from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("axios_issues");
      if (saved) {
        setIssues(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const saveIssues = (updated: IssueItem[]) => {
    try {
      localStorage.setItem("axios_issues", JSON.stringify(updated));
    } catch {}
  };

  // New issue form state
  const [newTitle, setNewTitle] = useState("");
  const [newAsset, setNewAsset] = useState("P-101A");
  const [newPriority, setNewPriority] = useState<"p1" | "p2" | "p3">("p2");
  const [newType, setNewType] = useState<"anomaly" | "ecr" | "compliance" | "maintenance">("anomaly");
  const [newSummary, setNewSummary] = useState("");

  const filteredIssues = issues.filter((item) => {
    let matchesTab = true;
    if (selectedFilter === "p1") matchesTab = item.priority === "p1";
    else if (selectedFilter === "p2") matchesTab = item.priority === "p2";
    else if (selectedFilter === "open") matchesTab = item.status === "open" || item.status === "investigating";
    else if (selectedFilter === "resolved") matchesTab = item.status === "resolved";

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignee.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleCreateIssue = () => {
    if (!newTitle.trim()) return;

    const newIssue: IssueItem = {
      id: `ISS-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle.trim(),
      type: newType,
      typeLabel:
        newType === "anomaly"
          ? "Equipment Anomaly"
          : newType === "ecr"
          ? "Engineering Change"
          : newType === "compliance"
          ? "Regulatory Compliance"
          : "Predictive Maint",
      priority: newPriority,
      priorityLabel: newPriority === "p1" ? "P1 Critical" : newPriority === "p2" ? "P2 High" : "P3 Moderate",
      asset: newAsset.trim() || "Plant Asset",
      assignee: "Current User",
      department: "Plant Operations",
      status: "open",
      statusLabel: "Open",
      created: "Just now",
      groundedDoc: "Operational Log",
      summary: newSummary.trim() || "Issue logged for operational investigation and engineering dispatch.",
    };

    const next = [newIssue, ...issues];
    setIssues(next);
    saveIssues(next);
    setNewTitle("");
    setNewSummary("");
    setModalOpen(false);
  };

  return (
    <div className="flex-1 w-full bg-bg-primary text-text-primary">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 space-y-7">
        
        {/* Header (rounded-md, crisp) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-border-subtle">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#1F45EC]/10 text-[#1F45EC] border border-[#1F45EC]/20 flex items-center justify-center font-bold shadow-2xs">
                <ClipboardList size={16} />
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                Issues &amp; Engineering Requests
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#1F45EC]/15 text-[#1F45EC] border border-[#1F45EC]/30">
                New
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Track real plant floor equipment anomalies, safety non-conformances, and engineering change requests (ECR).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#1F45EC] hover:bg-[#1839C5] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus size={13} />
              <span>Create Issue / Request</span>
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All Items", count: issues.length },
              { id: "p1", label: "Critical P1", count: issues.filter((i) => i.priority === "p1").length },
              { id: "p2", label: "High P2", count: issues.filter((i) => i.priority === "p2").length },
              { id: "open", label: "Open & Active", count: issues.filter((i) => i.status === "open" || i.status === "investigating").length },
              { id: "resolved", label: "Resolved", count: issues.filter((i) => i.status === "resolved").length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5",
                  selectedFilter === tab.id
                    ? "bg-[#1F45EC] text-white shadow-2xs font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded text-[10px] font-mono",
                    selectedFilter === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-bg-tertiary text-text-tertiary"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px] sm:w-60">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, asset, or title..."
              className="w-full pl-9 pr-3 py-1.5 rounded-md border border-border-subtle bg-bg-secondary text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#1F45EC]"
            />
          </div>
        </div>

        {/* Real Issues Feed / Authentic Empty State */}
        {filteredIssues.length > 0 ? (
          <div className="space-y-3">
            {filteredIssues.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-border-subtle bg-bg-secondary hover:border-border-strong transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-2xs hover:shadow-xs"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[#1F45EC]">
                      {item.id}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider",
                        item.priority === "p1" && "bg-red-500/10 text-red-500 border border-red-500/25",
                        item.priority === "p2" && "bg-amber-500/10 text-amber-500 border border-amber-500/25",
                        item.priority === "p3" && "bg-blue-500/10 text-blue-500 border border-blue-500/25",
                        item.priority === "p4" && "bg-gray-500/10 text-gray-400 border border-gray-500/25"
                      )}
                    >
                      {item.priorityLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-bg-tertiary text-text-secondary border border-border-subtle text-[10px] font-mono">
                      Asset: {item.asset}
                    </span>
                    <span className="text-[10px] font-mono text-text-tertiary">
                      {item.typeLabel} · {item.created}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-[#1F45EC] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-text-tertiary pt-0.5">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      <span>{item.assignee}</span>
                    </span>
                    <span className="font-mono text-[#1F45EC]">
                      Grounded: {item.groundedDoc}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border-subtle">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1.5",
                      item.status === "open" && "bg-blue-500/10 text-blue-500 border border-blue-500/20",
                      item.status === "investigating" && "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                      item.status === "pending_review" && "bg-purple-500/10 text-purple-500 border border-purple-500/20",
                      item.status === "resolved" && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        item.status === "open" && "bg-blue-500",
                        item.status === "investigating" && "bg-amber-500 animate-pulse",
                        item.status === "pending_review" && "bg-purple-500",
                        item.status === "resolved" && "bg-emerald-500"
                      )}
                    />
                    {item.statusLabel}
                  </span>

                  <Link
                    href={`/workspace/assistant?prompt=${encodeURIComponent(`Analyze issue ${item.id}: ${item.title}`)}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-border-subtle hover:border-[#1F45EC] hover:bg-[#1F45EC]/10 text-xs font-medium text-text-primary hover:text-[#1F45EC] transition-all cursor-pointer"
                  >
                    <Bot size={13} className="text-[#1F45EC]" />
                    <span>Analyze</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 rounded-lg border border-border-subtle bg-bg-secondary text-center space-y-3">
            <div className="w-10 h-10 rounded-md bg-bg-primary border border-border-subtle flex items-center justify-center mx-auto text-text-tertiary">
              <FolderOpen size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-text-primary block">
                No active issues or requests
              </span>
              <p className="text-[11px] text-text-tertiary max-w-sm mx-auto mt-0.5">
                No plant anomalies, ECRs, or maintenance work orders have been logged yet.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#1F45EC] text-white text-xs font-semibold hover:bg-[#1839C5] transition-all shadow-xs cursor-pointer"
            >
              <Plus size={13} />
              <span>Log First Issue</span>
            </button>
          </div>
        )}

        {/* Modal for Creating New Issue (rounded-xl) */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-lg rounded-xl border border-border-strong bg-bg-primary p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <ClipboardList size={16} className="text-[#1F45EC]" />
                  <h3 className="text-sm font-bold text-text-primary">
                    Create Issue / Engineering Request
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-text-tertiary hover:text-text-primary rounded cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-text-secondary mb-1">
                    Issue / Request Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Pump P-101A Discharge Vibration Spike"
                    className="w-full p-2.5 rounded-md border border-border-subtle bg-bg-secondary text-text-primary focus:outline-none focus:border-[#1F45EC]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-text-secondary mb-1">
                      Request Type
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full p-2.5 rounded-md border border-border-subtle bg-bg-secondary text-text-primary focus:outline-none focus:border-[#1F45EC]"
                    >
                      <option value="anomaly">Equipment Anomaly</option>
                      <option value="ecr">Engineering Change (ECR)</option>
                      <option value="maintenance">Predictive Maintenance</option>
                      <option value="compliance">Regulatory Compliance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-text-secondary mb-1">
                      Priority Level
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full p-2.5 rounded-md border border-border-subtle bg-bg-secondary text-text-primary focus:outline-none focus:border-[#1F45EC]"
                    >
                      <option value="p1">P1 - Critical Safety/Trip</option>
                      <option value="p2">P2 - High Priority</option>
                      <option value="p3">P3 - Moderate / Normal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-text-secondary mb-1">
                    Target Equipment Asset Tag
                  </label>
                  <input
                    type="text"
                    value={newAsset}
                    onChange={(e) => setNewAsset(e.target.value)}
                    placeholder="e.g. P-101A, C-302, E-204"
                    className="w-full p-2.5 rounded-md border border-border-subtle bg-bg-secondary text-text-primary focus:outline-none focus:border-[#1F45EC]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-text-secondary mb-1">
                    Technical Description &amp; Observations
                  </label>
                  <textarea
                    rows={3}
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    placeholder="Detail the sensor readings, procedure step, or physical symptoms..."
                    className="w-full p-2.5 rounded-md border border-border-subtle bg-bg-secondary text-text-primary focus:outline-none focus:border-[#1F45EC] resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-md border border-border-subtle text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateIssue}
                  disabled={!newTitle.trim()}
                  className="px-4 py-1.5 rounded-md bg-[#1F45EC] text-white text-xs font-semibold hover:bg-[#1839C5] disabled:opacity-40 cursor-pointer"
                >
                  Submit Issue
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
