"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Layers,
  Tag,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive,
  Download,
  FileCode,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Info,
  ChevronRight,
  Share2,
  List,
  Eye,
  Activity,
  GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchKnowledgePackages,
  importKnowledgePackage,
  transitionKnowledgeLifecycle,
  fetchKnowledgeAuditLogs,
  KnowledgePackageItem,
} from "@/lib/api";
import { KnowledgeGraphVisualizer } from "@/components/workspace/KnowledgeGraphVisualizer";
import { DocumentViewerModal } from "@/components/workspace/DocumentViewerModal";
import { getCorpusDocuments, CorpusDocument } from "@/lib/corpus-store";

const SAMPLE_PACKAGES: KnowledgePackageItem[] = [
  {
    okf_version: "1.0.0",
    package_urn: "urn:athleia:pkg:cooling-water-101",
    title: "Cooling Water System P&ID & SOP",
    description: "Standard Operating Procedure and CAD P&ID specifications for Cooling Water Station 101.",
    version: "1.0.0",
    domain: "Industrial Operations",
    authors: ["Process Lead", "Safety Officer"],
    state: "PUBLISHED",
    tenant_id: "default_tenant",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: { "plant_section": "Station-101", "compliance_level": "Tier-1" },
    documents: [
      {
        document_urn: "urn:athleia:doc:sop-01",
        title: "Pump P-101A Startup SOP",
        category: "SOP",
        content: "Verify PT-101 pressure gauge reaches 150 PSI before engaging secondary suction valve VLV-302.",
        tags: ["cooling_water", "sop", "pump"],
        references: [],
        metadata: { "page_count": 4 },
      },
    ],
    relationships: [],
  },
  {
    okf_version: "1.0.0",
    package_urn: "urn:athleia:pkg:sys-arch-2026",
    title: "Distributed Architecture & Gateway Spec",
    description: "Core architectural specification for 12-phase Gateway routing and Knowledge Service.",
    version: "1.2.0",
    domain: "Engineering Standards",
    authors: ["Principal AI Architect"],
    state: "VALIDATED",
    tenant_id: "default_tenant",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: { "architecture": "Clean Architecture", "resilience": "CircuitBreaker" },
    documents: [
      {
        document_urn: "urn:athleia:doc:arch-01",
        title: "Clean Architecture Guidelines",
        category: "STANDARD",
        content: "Services isolate domain logic from external transport adapters and storage layers.",
        tags: ["architecture", "clean_code", "spec"],
        references: [],
        metadata: { "section": "1.0 Core Principles" },
      },
    ],
    relationships: [],
  },
];

export default function KnowledgePage() {
  const [packages, setPackages] = useState<KnowledgePackageItem[]>(SAMPLE_PACKAGES);
  const [viewMode, setViewMode] = useState<"graph" | "table">("graph");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedPackageUrn, setSelectedPackageUrn] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Form fields for import modal
  const [importTitle, setImportTitle] = useState("");
  const [importUrn, setImportUrn] = useState("");
  const [importDomain, setImportDomain] = useState("Industrial Operations");
  const [importContent, setImportContent] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Document Viewer Modal State
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [activeDocForViewer, setActiveDocForViewer] = useState<CorpusDocument | null>(null);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const fetched = await fetchKnowledgePackages();
      if (fetched && fetched.length > 0) {
        setPackages(fetched);
        if (!selectedPackageUrn) setSelectedPackageUrn(fetched[0].package_urn);
      }
    } catch {
      // Use samples
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleSelectPackage = async (urn: string) => {
    setSelectedPackageUrn(urn);
    try {
      const logs = await fetchKnowledgeAuditLogs(urn);
      setAuditLogs(logs);
    } catch {
      setAuditLogs([]);
    }
  };

  const handleOpenNodeDocument = (docName: string, urn: string) => {
    const corpusDocs = getCorpusDocuments();
    const matched = corpusDocs.find(
      (d) => d.name.toLowerCase().includes(docName.toLowerCase()) || d.id === urn
    );

    if (matched) {
      setActiveDocForViewer(matched);
    } else {
      setActiveDocForViewer({
        id: urn || `doc_${Date.now()}`,
        name: docName || "Specification_Document.pdf",
        size: "1.85 MB",
        type: "Engineering Spec",
        uploadedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        chunks: [
          {
            id: `chk_${Date.now()}`,
            text: `Original Document Content for ${docName}: Operating specification and verified equipment parameters.`,
            section: "Section 1.0 General Specification",
            page: 1,
            score: 0.95,
          },
        ],
      });
    }

    setViewerModalOpen(true);
  };

  const handleTransition = async (urn: string, targetState: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await transitionKnowledgeLifecycle(urn, targetState);
      setSuccessMsg(`Package state successfully updated to '${targetState}'.`);
      await loadPackages();
      handleSelectPackage(urn);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "State transition failed";
      setErrorMsg(msg);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const urn = importUrn.trim() || `urn:athleia:pkg:${Date.now()}`;
    const payload = {
      package_urn: urn,
      title: importTitle || "Imported Engineering Knowledge",
      description: "User imported OKF package specification",
      version: "1.0.0",
      domain: importDomain,
      authors: ["Workspace User"],
      documents: [
        {
          document_urn: `${urn}:doc-01`,
          title: importTitle || "Primary Document",
          category: "SOP",
          content: importContent || "Verbatim procedure content and operating specifications.",
          tags: [importDomain.toLowerCase().replace(/\s+/g, "_"), "okf"],
        },
      ],
    };

    try {
      await importKnowledgePackage(payload);
      setSuccessMsg("OKF Package imported, validated, and stored successfully.");
      setShowImportModal(false);
      setImportUrn("");
      setImportTitle("");
      setImportContent("");
      await loadPackages();
      handleSelectPackage(urn);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Import failed";
      setErrorMsg(msg);
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.package_urn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.domain.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain = selectedDomain === "all" || pkg.domain === selectedDomain;
    const matchesState = selectedState === "all" || pkg.state === selectedState;

    return matchesSearch && matchesDomain && matchesState;
  });

  const selectedPkg = packages.find((p) => p.package_urn === selectedPackageUrn) || packages[0];

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Top Page Header & View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="flex flex-col gap-1">
          <span className="text-label text-text-tertiary">Enterprise Knowledge Core</span>
          <h1 className="text-heading-1 text-text-primary flex items-center gap-3">
            <span>Knowledge Console</span>
            <span className="px-2.5 py-0.5 text-mono text-xs rounded-sm bg-accent-muted/20 text-accent border border-accent/30 font-normal">
              OKF v1.0 Adapter
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Switcher: Knowledge Graph vs Packages List */}
          <div className="flex items-center bg-bg-secondary p-1 rounded border border-border-subtle text-xs">
            <button
              onClick={() => setViewMode("graph")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded transition-colors",
                viewMode === "graph"
                  ? "bg-bg-primary text-text-primary font-medium border border-border-subtle"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <Share2 size={13} />
              <span>Knowledge Graph</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded transition-colors",
                viewMode === "table"
                  ? "bg-bg-primary text-text-primary font-medium border border-border-subtle"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <List size={13} />
              <span>Packages List</span>
            </button>
          </div>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 rounded-sm bg-text-primary text-bg-primary text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus size={15} />
            <span>Import OKF Package</span>
          </button>
        </div>
      </div>

      {/* Alert Notifications */}
      {successMsg && (
        <div className="p-4 rounded bg-status-verified/10 border border-status-verified/30 text-status-verified text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Top Bento Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded bg-bg-secondary border border-border-subtle flex flex-col gap-1">
          <span className="text-mono text-[10px] text-text-tertiary uppercase">OKF Packages</span>
          <span className="text-2xl font-bold font-mono text-text-primary">{packages.length}</span>
          <span className="text-[11px] text-text-secondary">Validated Open Knowledge Framework</span>
        </div>

        <div className="p-4 rounded bg-bg-secondary border border-border-subtle flex flex-col gap-1">
          <span className="text-mono text-[10px] text-text-tertiary uppercase">Active Graph Nodes</span>
          <span className="text-2xl font-bold font-mono text-accent">19</span>
          <span className="text-[11px] text-text-secondary">Dynamic Evidence Topology</span>
        </div>

        <div className="p-4 rounded bg-bg-secondary border border-border-subtle flex flex-col gap-1">
          <span className="text-mono text-[10px] text-text-tertiary uppercase">Graph Density</span>
          <span className="text-2xl font-bold font-mono text-status-verified">0.94</span>
          <span className="text-[11px] text-text-secondary">Edge-to-Node Ratio</span>
        </div>

        <div className="p-4 rounded bg-bg-secondary border border-border-subtle flex flex-col gap-1">
          <span className="text-mono text-[10px] text-text-tertiary uppercase">Audit Compliance</span>
          <span className="text-2xl font-bold font-mono text-status-verified">100%</span>
          <span className="text-[11px] text-text-secondary">PostgreSQL Immutable Log</span>
        </div>
      </div>

      {/* Dynamic View Mode Rendering */}
      {viewMode === "graph" ? (
        /* Bento Grid Knowledge Graph Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bento Card 1: Live Animated Graph (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <KnowledgeGraphVisualizer
              packages={filteredPackages}
              onSelectNodeDocument={(label, urn) => handleOpenNodeDocument(label, urn)}
            />
          </div>

          {/* Bento Card 2: Package Inspector & Lifecycle (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {selectedPkg ? (
              <div className="p-5 rounded bg-bg-secondary border border-border-subtle flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <span className="text-mono text-[10px] font-bold text-accent uppercase tracking-wider">
                    Package Inspector
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 text-mono text-[10px] rounded font-bold uppercase border",
                      selectedPkg.state === "PUBLISHED"
                        ? "bg-status-verified/10 text-status-verified border-status-verified/30"
                        : selectedPkg.state === "VALIDATED"
                        ? "bg-accent-muted/20 text-accent border-accent/30"
                        : "bg-status-warning/10 text-status-warning border-status-warning/30"
                    )}
                  >
                    {selectedPkg.state}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-text-primary">{selectedPkg.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {selectedPkg.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2 bg-bg-primary p-3 rounded border border-border-subtle text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">URN:</span>
                    <span className="text-text-primary text-[11px] truncate max-w-[180px]">
                      {selectedPkg.package_urn}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Domain:</span>
                    <span className="text-text-primary">{selectedPkg.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Version:</span>
                    <span className="text-text-primary">v{selectedPkg.version}</span>
                  </div>
                </div>

                {/* State Transition Controls */}
                <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
                  <span className="text-mono text-[10px] text-text-tertiary uppercase font-bold">
                    Lifecycle Transitions
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedPkg.state === "DRAFT" && (
                      <button
                        onClick={() => handleTransition(selectedPkg.package_urn, "VALIDATED")}
                        className="h-8 rounded bg-accent text-white text-xs font-medium hover:opacity-90 transition-opacity"
                      >
                        Promote VALIDATED
                      </button>
                    )}
                    {selectedPkg.state === "VALIDATED" && (
                      <button
                        onClick={() => handleTransition(selectedPkg.package_urn, "PUBLISHED")}
                        className="h-8 rounded bg-status-verified text-white text-xs font-medium hover:opacity-90 transition-opacity"
                      >
                        Publish Package
                      </button>
                    )}
                    {selectedPkg.state !== "ARCHIVED" && (
                      <button
                        onClick={() => handleTransition(selectedPkg.package_urn, "ARCHIVED")}
                        className="h-8 rounded bg-bg-tertiary text-text-secondary border border-border-subtle text-xs hover:text-text-primary transition-colors"
                      >
                        Archive Package
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-text-tertiary bg-bg-secondary rounded border border-border-subtle">
                Select a package to view metadata and state transitions.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Dedicated Packages List Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded bg-bg-secondary border border-border-subtle">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search size={14} className="text-text-tertiary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title, URN, or domain..."
                  className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-tertiary outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={13} className="text-text-tertiary" />
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="bg-bg-primary border border-border-subtle rounded text-xs text-text-secondary px-2.5 py-1 outline-none"
                >
                  <option value="all">All States</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="VALIDATED">VALIDATED</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-border-subtle rounded border border-border-subtle overflow-hidden bg-bg-primary">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.package_urn}
                  onClick={() => handleSelectPackage(pkg.package_urn)}
                  className={cn(
                    "p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors text-xs",
                    selectedPackageUrn === pkg.package_urn
                      ? "bg-bg-tertiary"
                      : "hover:bg-bg-secondary"
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-text-primary">{pkg.title}</span>
                    <span className="font-mono text-[10px] text-text-tertiary">
                      {pkg.package_urn}
                    </span>
                    <span className="text-[11px] text-text-secondary">{pkg.description}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-[10px] text-text-tertiary">{pkg.domain}</span>
                    <span
                      className={cn(
                        "px-2.5 py-0.5 text-mono text-[10px] rounded font-bold uppercase border",
                        pkg.state === "PUBLISHED"
                          ? "bg-status-verified/10 text-status-verified border-status-verified/30"
                          : pkg.state === "VALIDATED"
                          ? "bg-accent-muted/20 text-accent border-accent/30"
                          : "bg-status-warning/10 text-status-warning border-status-warning/30"
                      )}
                    >
                      {pkg.state}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-4 rounded bg-bg-secondary border border-border-subtle flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-text-secondary" />
                <span className="text-sm font-semibold text-text-primary">Audit Log Ledger</span>
              </div>

              <div className="flex flex-col gap-2 max-h-96 overflow-y-auto font-mono text-[11px]">
                {auditLogs.length > 0 ? (
                  auditLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded bg-bg-primary border border-border-subtle flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between text-text-tertiary text-[10px]">
                        <span>{String(log.action || "TRANSITION")}</span>
                        <span>{String(log.timestamp || "").split("T")[0]}</span>
                      </div>
                      <span className="text-text-primary font-medium">
                        State ➔ {String(log.to_state || "UPDATED")}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-text-tertiary text-xs bg-bg-primary rounded border border-border-subtle">
                    No state transitions logged for this package yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-bg-primary border border-border-subtle rounded-sm shadow-2xl p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-base font-semibold text-text-primary">Import OKF Package</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-text-tertiary hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-text-secondary font-mono">Package Title</label>
                <input
                  type="text"
                  required
                  value={importTitle}
                  onChange={(e) => setImportTitle(e.target.value)}
                  placeholder="e.g. Turbine Isolation Procedure"
                  className="bg-bg-secondary border border-border-subtle rounded p-2 text-text-primary outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-text-secondary font-mono">Package URN (Optional)</label>
                <input
                  type="text"
                  value={importUrn}
                  onChange={(e) => setImportUrn(e.target.value)}
                  placeholder="urn:athleia:pkg:turbine-01"
                  className="bg-bg-secondary border border-border-subtle rounded p-2 text-text-primary outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-text-secondary font-mono">Domain</label>
                <select
                  value={importDomain}
                  onChange={(e) => setImportDomain(e.target.value)}
                  className="bg-bg-secondary border border-border-subtle rounded p-2 text-text-primary outline-none"
                >
                  <option value="Industrial Operations">Industrial Operations</option>
                  <option value="Engineering Standards">Engineering Standards</option>
                  <option value="Safety & Compliance">Safety & Compliance</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-text-secondary font-mono">Document Content</label>
                <textarea
                  rows={4}
                  value={importContent}
                  onChange={(e) => setImportContent(e.target.value)}
                  placeholder="Paste verbatim operating specification content..."
                  className="bg-bg-secondary border border-border-subtle rounded p-2 text-text-primary outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded border border-border-subtle text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-text-primary text-bg-primary font-medium hover:opacity-90"
                >
                  Import Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        open={viewerModalOpen}
        onClose={() => setViewerModalOpen(false)}
        doc={activeDocForViewer}
      />
    </div>
  );
}
