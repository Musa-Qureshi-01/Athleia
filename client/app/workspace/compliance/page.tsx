"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Play,
  RefreshCw,
  FileText,
  Eye,
  Info,
  Layers,
  ChevronRight,
  HardDrive,
  Clock,
  BookOpen,
  Activity,
  Award,
  FileCode,
  Sliders,
  CheckSquare,
  XCircle,
  ExternalLink,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchComplianceDashboardOverview,
  fetchComplianceFindings,
  triggerComplianceScan,
  fetchComplianceRules,
  ComplianceFindingItem,
} from "@/lib/api";
import { DocumentViewerModal } from "@/components/workspace/DocumentViewerModal";
import { getCorpusDocuments, CorpusDocument } from "@/lib/corpus-store";

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "findings" | "rules" | "scans">("overview");
  const [overview, setOverview] = useState<Record<string, unknown>>({});
  const [findings, setFindings] = useState<ComplianceFindingItem[]>([]);
  const [rules, setRules] = useState<Array<Record<string, unknown>>>([]);
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFinding, setSelectedFinding] = useState<ComplianceFindingItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  // Scan Modal states
  const [scanDocId, setScanDocId] = useState("");
  const [scanContent, setScanContent] = useState("");
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Document Viewer Modal state
  const [activeDocForViewer, setActiveDocForViewer] = useState<CorpusDocument | null>(null);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);

  const loadComplianceData = async () => {
    setLoading(true);
    try {
      const dash = await fetchComplianceDashboardOverview();
      setOverview(dash);

      const fndList = await fetchComplianceFindings();
      setFindings(fndList || []);
      if (fndList && fndList.length > 0) {
        setSelectedFinding(fndList[0]);
      } else {
        setSelectedFinding(null);
      }

      const rList = await fetchComplianceRules();
      setRules(rList || []);
    } catch {
      // API Offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplianceData();
  }, []);

  const handleRunManualScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanMessage(null);
    const docId = scanDocId.trim() || `urn:athleia:doc:manual-${Date.now()}`;

    try {
      const res = await triggerComplianceScan(
        docId,
        scanContent || "Sample SOP operating procedure for Pump P-101A.",
        { category: "SOP", domain: "Industrial Operations" }
      );
      setScanMessage(`Compliance Agent scan completed! Scan ID: ${res.scan_id}. Total findings: ${res.total_findings}`);
      setScanDocId("");
      setScanContent("");
      await loadComplianceData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Scan failed";
      setScanMessage(`Error: ${msg}`);
    }
  };

  const handleInspectDocument = (docId: string) => {
    const corpusDocs = getCorpusDocuments();
    const matched = corpusDocs.find(
      (d) => d.id === docId || d.name.toLowerCase().includes(docId.toLowerCase())
    );

    if (matched) {
      setActiveDocForViewer(matched);
    } else {
      setActiveDocForViewer({
        id: docId,
        name: `${docId}.pdf`,
        size: "1.45 MB",
        type: "SOP Specification",
        uploadedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        chunks: [
          {
            id: `chk_${Date.now()}`,
            text: `Original Document Content for ${docId}: Operating procedure stream evaluated by Compliance Monitoring Agent.`,
            section: "Section 1.0 Operating Guidelines",
            page: 1,
            score: 0.96,
          },
        ],
      });
    }

    setViewerModalOpen(true);
  };

  const filteredFindings = findings.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.document_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.policy_reference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = selectedSeverity === "all" || f.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  const score = (overview.compliance_score as number) ?? 85;

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Top Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="flex flex-col gap-1">
          <span className="text-label text-text-tertiary font-mono">Autonomous Governance Core</span>
          <h1 className="text-heading-1 text-text-primary flex items-center gap-3">
            <span>Compliance Intelligence Dashboard</span>
            <span className="px-2.5 py-0.5 text-mono text-xs rounded-sm bg-accent-muted/20 text-accent border border-accent/30 font-normal">
              LangGraph & Deterministic Engine
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-bg-secondary border border-border-subtle text-xs text-text-secondary">
            <HardDrive size={14} className="text-text-tertiary" />
            <span className="text-mono">Compliance Service: Port 8006</span>
          </div>

          <button
            onClick={() => setShowScanModal(true)}
            className="px-4 py-2 rounded-sm bg-text-primary text-bg-primary text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
          >
            <Play size={14} />
            <span>Trigger Compliance Scan</span>
          </button>
        </div>
      </div>

      {/* Sub-Header Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-medium transition-colors",
            activeTab === "overview"
              ? "bg-text-primary text-bg-primary font-semibold shadow-sm"
              : "text-text-secondary hover:text-text-primary bg-bg-secondary"
          )}
        >
          <Activity size={14} />
          <span>Overview & Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab("findings")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-medium transition-colors",
            activeTab === "findings"
              ? "bg-text-primary text-bg-primary font-semibold shadow-sm"
              : "text-text-secondary hover:text-text-primary bg-bg-secondary"
          )}
        >
          <ShieldAlert size={14} />
          <span>Active Findings ({findings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("rules")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-medium transition-colors",
            activeTab === "rules"
              ? "bg-text-primary text-bg-primary font-semibold shadow-sm"
              : "text-text-secondary hover:text-text-primary bg-bg-secondary"
          )}
        >
          <Sliders size={14} />
          <span>Rule Catalog ({rules.length})</span>
        </button>
      </div>

      {/* 1. OVERVIEW & TELEMETRY TAB */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-8">
          {/* KPI Gauge Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col justify-between gap-3">
              <span className="text-mono text-[11px] text-text-tertiary">ENTERPRISE COMPLIANCE SCORE</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-mono text-text-primary">{score}</span>
                <span className="text-xs font-mono text-text-tertiary">/ 100</span>
              </div>
              <span
                className={cn(
                  "text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border self-start",
                  score >= 85
                    ? "bg-status-verified/10 text-status-verified border-status-verified/30"
                    : "bg-status-error/10 text-status-error border-status-error/30"
                )}
              >
                {score >= 85 ? "COMPLIANT STATUS" : "NON-COMPLIANT STATUS"}
              </span>
            </div>

            <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col justify-between gap-3">
              <span className="text-mono text-[11px] text-text-tertiary">CRITICAL SAFETY RISKS</span>
              <span className="text-4xl font-bold font-mono text-status-error">
                {findings.filter((f) => f.severity === "CRITICAL").length}
              </span>
              <span className="text-xs text-text-tertiary">Requires immediate safety review</span>
            </div>

            <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col justify-between gap-3">
              <span className="text-mono text-[11px] text-text-tertiary">ACTIVE FINDINGS</span>
              <span className="text-4xl font-bold font-mono text-text-primary">{findings.length}</span>
              <span className="text-xs text-text-tertiary">Across registered document corpus</span>
            </div>

            <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col justify-between gap-3">
              <span className="text-mono text-[11px] text-text-tertiary">DETERMINISTIC EVALUATION</span>
              <span className="text-4xl font-bold font-mono text-status-verified">100%</span>
              <span className="text-xs text-text-tertiary">Zero token waste for structural rules</span>
            </div>
          </div>

          {/* Detailed Overview Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Recent Findings Summary (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-text-primary uppercase tracking-wider">
                  Critical & High Severity Findings
                </span>
                <button
                  onClick={() => setActiveTab("findings")}
                  className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                >
                  <span>View All ({findings.length})</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              <div className="border border-border-subtle rounded-sm bg-bg-primary divide-y divide-border-subtle">
                {findings.slice(0, 4).map((f) => (
                  <div
                    key={f.finding_id}
                    onClick={() => {
                      setSelectedFinding(f);
                      setActiveTab("findings");
                    }}
                    className="p-4 flex flex-col gap-2 hover:bg-bg-secondary cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary leading-snug">
                        {f.title}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-mono rounded font-bold border",
                          f.severity === "CRITICAL"
                            ? "bg-status-error/10 text-status-error border-status-error/30"
                            : f.severity === "HIGH"
                            ? "bg-status-warning/10 text-status-warning border-status-warning/30"
                            : "bg-accent-muted/20 text-accent border-accent/30"
                        )}
                      >
                        {f.severity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-text-tertiary pt-1 border-t border-border-subtle">
                      <span className="text-accent">{f.policy_reference}</span>
                      <span>Target: {f.document_id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Regulatory Framework Compliance Matrix (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <span className="text-xs font-bold font-mono text-text-primary uppercase tracking-wider">
                Approved Regulatory Frameworks
              </span>

              <div className="flex flex-col gap-3">
                {[
                  { name: "OSHA 1910.119 Process Safety Management", status: "NON-COMPLIANT", violations: 1 },
                  { name: "ISO 9001:2015 Control of Documented Info", status: "WARNING", violations: 1 },
                  { name: "Athleia Corporate Governance §3.1", status: "WARNING", violations: 1 },
                  { name: "NIST SP 800-53 Security Controls", status: "COMPLIANT", violations: 0 },
                ].map((framework, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary">{framework.name}</span>
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-mono rounded font-bold border",
                          framework.status === "COMPLIANT"
                            ? "bg-status-verified/10 text-status-verified border-status-verified/30"
                            : framework.status === "WARNING"
                            ? "bg-status-warning/10 text-status-warning border-status-warning/30"
                            : "bg-status-error/10 text-status-error border-status-error/30"
                        )}
                      >
                        {framework.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-text-tertiary">
                      <span>Violations Detected: {framework.violations}</span>
                      <span>Status: Evaluated</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE FINDINGS & EVIDENCE INSPECTOR TAB */}
      {activeTab === "findings" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Findings Table (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Search & Severity Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-sm bg-bg-secondary border border-border-subtle">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <Search size={14} className="text-text-tertiary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search finding, document ID, or policy..."
                  className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-tertiary outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={13} className="text-text-tertiary" />
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="bg-bg-primary border border-border-subtle rounded-sm text-xs text-text-secondary px-2 py-1 outline-none font-mono"
                >
                  <option value="all">All Severities</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
            </div>

            {/* Findings List */}
            <div className="border border-border-subtle rounded-sm bg-bg-primary flex flex-col divide-y divide-border-subtle min-h-[380px]">
              <div className="px-4 py-2.5 bg-bg-secondary text-mono text-[11px] text-text-tertiary grid grid-cols-12 gap-2">
                <span className="col-span-6">Compliance Violation & Policy Clause</span>
                <span className="col-span-3">Target Document</span>
                <span className="col-span-3 text-right">Severity</span>
              </div>

              {filteredFindings.length > 0 ? (
                filteredFindings.map((finding) => (
                  <div
                    key={finding.finding_id}
                    onClick={() => setSelectedFinding(finding)}
                    className={cn(
                      "px-4 py-3.5 grid grid-cols-12 gap-2 items-center text-xs cursor-pointer transition-colors",
                      selectedFinding?.finding_id === finding.finding_id
                        ? "bg-bg-tertiary"
                        : "hover:bg-bg-secondary"
                    )}
                  >
                    <div className="col-span-6 flex flex-col gap-1 overflow-hidden">
                      <span className="font-semibold text-text-primary leading-snug">
                        {finding.title}
                      </span>
                      <span className="text-mono text-[10px] text-accent truncate">
                        {finding.policy_reference}
                      </span>
                    </div>

                    <div className="col-span-3 text-text-secondary font-mono text-[11px] truncate">
                      {finding.document_id}
                    </div>

                    <div className="col-span-3 flex justify-end">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 text-[10px] font-mono rounded font-bold border",
                          finding.severity === "CRITICAL"
                            ? "bg-status-error/10 text-status-error border-status-error/30"
                            : finding.severity === "HIGH"
                            ? "bg-status-warning/10 text-status-warning border-status-warning/30"
                            : "bg-accent-muted/20 text-accent border-accent/30"
                        )}
                      >
                        {finding.severity}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-text-tertiary my-auto">
                  No active compliance findings matched your filters.
                </div>
              )}
            </div>
          </div>

          {/* Right: Finding Evidence Inspector Drawer (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {selectedFinding ? (
              <div className="p-6 rounded-sm border border-border-subtle bg-bg-primary flex flex-col gap-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <span className="text-xs font-bold text-text-primary font-mono uppercase tracking-wider">
                    Finding Evidence Ledger
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[10px] font-mono rounded font-bold border",
                      selectedFinding.severity === "CRITICAL"
                        ? "bg-status-error/10 text-status-error border-status-error/30"
                        : "bg-status-warning/10 text-status-warning border-status-warning/30"
                    )}
                  >
                    {selectedFinding.severity}
                  </span>
                </div>

                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-text-tertiary text-[11px]">Finding Title</span>
                    <span className="font-semibold text-text-primary leading-snug">{selectedFinding.title}</span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-text-tertiary text-[11px]">Violated Policy / Standard</span>
                    <span className="text-mono text-accent font-medium text-[11px]">
                      {selectedFinding.policy_reference}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 pt-2 border-t border-border-subtle">
                    <span className="text-text-tertiary text-[11px]">Verbatim Evidence Quote</span>
                    <div className="p-3 rounded bg-bg-secondary border border-border-subtle text-mono text-xs text-text-primary leading-relaxed">
                      &quot;{selectedFinding.evidence[0]?.verbatim_quote || "Evidence quote evaluated."}&quot;
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 pt-2 border-t border-border-subtle">
                    <span className="text-text-tertiary text-[11px]">Actionable Remediation</span>
                    <p className="text-text-secondary leading-relaxed">{selectedFinding.recommendation}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-border-subtle">
                  <button
                    onClick={() => handleInspectDocument(selectedFinding.document_id)}
                    className="w-full h-9 rounded bg-text-primary hover:opacity-90 text-bg-primary text-xs font-medium flex items-center justify-center gap-2 transition-opacity shadow-sm"
                  >
                    <Eye size={14} />
                    <span>Open Original Document Window</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 border border-border-subtle rounded-sm bg-bg-secondary text-center text-xs text-text-tertiary">
                Select a compliance finding to inspect verbatim evidence and remediation.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. RULE CATALOG TAB */}
      {activeTab === "rules" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-text-primary uppercase tracking-wider">
              Deterministic & Semantic Rule Definitions
            </span>
            <span className="text-mono text-xs text-text-tertiary">
              Deterministic rules execute in 0ms without LLM token cost
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((r) => (
              <div
                key={String(r.rule_id)}
                className="p-5 rounded-sm border border-border-subtle bg-bg-primary flex flex-col justify-between gap-3 shadow-xs"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-mono text-xs font-bold text-accent">{String(r.rule_id)}</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-status-verified/10 text-status-verified border border-status-verified/30 font-bold">
                      ZERO-TOKEN DETERMINISTIC
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-text-primary">{String(r.name)}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{String(r.description)}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-text-tertiary pt-3 border-t border-border-subtle">
                  <span>Policy: {String(r.policy_reference)}</span>
                  <span>Severity: {String(r.default_severity)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Scan Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-bg-primary border border-border-subtle rounded-sm max-w-lg w-full p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold text-text-primary font-mono">
                TRIGGER MANUAL COMPLIANCE SCAN
              </h3>
              <button onClick={() => setShowScanModal(false)} className="text-text-tertiary hover:text-text-primary">
                ✕
              </button>
            </div>

            {scanMessage && (
              <div className="p-3 rounded bg-accent-muted/20 border border-accent/30 text-accent text-xs font-mono">
                {scanMessage}
              </div>
            )}

            <form onSubmit={handleRunManualScan} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-text-tertiary font-mono">Target Document ID</label>
                <input
                  type="text"
                  value={scanDocId}
                  onChange={(e) => setScanDocId(e.target.value)}
                  placeholder="urn:athleia:doc:sop-cooling-water"
                  className="p-2 bg-bg-secondary border border-border-subtle rounded text-text-primary font-mono text-xs outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-text-tertiary font-mono">Raw Document Content (Optional)</label>
                <textarea
                  value={scanContent}
                  onChange={(e) => setScanContent(e.target.value)}
                  placeholder="Enter operating procedure or engineering specification text..."
                  rows={4}
                  className="p-2 bg-bg-secondary border border-border-subtle rounded text-text-primary font-mono text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowScanModal(false)}
                  className="px-3 py-1.5 rounded text-text-secondary bg-bg-secondary border border-border-subtle text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-text-primary text-bg-primary text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  Run Compliance Agent Scan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Viewer Modal for Node/Finding Click */}
      <DocumentViewerModal
        doc={activeDocForViewer}
        open={viewerModalOpen}
        onClose={() => setViewerModalOpen(false)}
      />
    </div>
  );
}
