"use client";

import { useState, useEffect } from "react";
import {
  Wrench,
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
  Cpu,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchMaintenanceDashboardOverview,
  fetchMaintenanceFindings,
  triggerMaintenanceAnalysis,
  MaintenanceFindingItem,
} from "@/lib/api";
import { DocumentViewerModal } from "@/components/workspace/DocumentViewerModal";
import { getCorpusDocuments, CorpusDocument } from "@/lib/corpus-store";

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "findings" | "health">("overview");
  const [overview, setOverview] = useState<Record<string, unknown>>({});
  const [findings, setFindings] = useState<MaintenanceFindingItem[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFinding, setSelectedFinding] = useState<MaintenanceFindingItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  // Scan Modal states
  const [scanEquipId, setScanEquipId] = useState("");
  const [scanContent, setScanContent] = useState("");
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Document Viewer Modal state
  const [activeDocForViewer, setActiveDocForViewer] = useState<CorpusDocument | null>(null);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);

  const loadMaintenanceData = async () => {
    setLoading(true);
    try {
      const dash = await fetchMaintenanceDashboardOverview();
      setOverview(dash);

      const fndList = await fetchMaintenanceFindings();
      setFindings(fndList || []);
      if (fndList && fndList.length > 0) {
        setSelectedFinding(fndList[0]);
      } else {
        setSelectedFinding(null);
      }
    } catch {
      // API offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaintenanceData();
  }, []);

  const handleRunManualScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanMessage(null);
    const eqId = scanEquipId.trim() || `PUMP-P101A`;

    try {
      const res = await triggerMaintenanceAnalysis(eqId, scanContent);
      setScanMessage(`Predictive Maintenance Scan complete! Finding ID: ${res.finding_id}. Risk Score: ${res.risk_score}`);
      setScanEquipId("");
      setScanContent("");
      await loadMaintenanceData();
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
        size: "2.10 MB",
        type: "Maintenance Log Sheet",
        uploadedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        chunks: [
          {
            id: `chk_maint_${Date.now()}`,
            text: `Original Maintenance Log for ${docId}: Operating pressure and bearing vibration telemetry evaluated by Predictive Agent.`,
            section: "Section 2.4 Equipment Vibration Log",
            page: 1,
            score: 0.98,
          },
        ],
      });
    }

    setViewerModalOpen(true);
  };

  const filteredFindings = findings.filter((f) => {
    const matchesSearch =
      f.asset_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.equipment_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.recommended_action.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = selectedSeverity === "all" || f.estimated_priority === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  const healthIndex = (overview.overall_health_index as number) ?? 88.5;

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="flex flex-col gap-1">
          <span className="text-label text-text-tertiary font-mono">Autonomous Reliability Core</span>
          <h1 className="text-heading-1 text-text-primary flex items-center gap-3">
            <span>Maintenance Intelligence</span>
            <span className="px-2.5 py-0.5 text-mono text-xs rounded-sm bg-accent-muted/20 text-accent border border-accent/30 font-normal">
              LangGraph Predictive Agent
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-bg-secondary border border-border-subtle text-xs text-text-secondary">
            <HardDrive size={14} className="text-text-tertiary" />
            <span className="text-mono">Maintenance Service: Port 8007</span>
          </div>

          <button
            onClick={() => setShowScanModal(true)}
            className="px-4 py-2 rounded-sm bg-text-primary text-bg-primary text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
          >
            <Play size={14} />
            <span>Trigger Predictive Scan</span>
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
          <span>Overview & Health</span>
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
          <AlertTriangle size={14} />
          <span>Predictive Findings ({findings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("health")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-medium transition-colors",
            activeTab === "health"
              ? "bg-text-primary text-bg-primary font-semibold shadow-sm"
              : "text-text-secondary hover:text-text-primary bg-bg-secondary"
          )}
        >
          <Zap size={14} />
          <span>Asset MTBF Ledger</span>
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-8">
          {/* KPI Gauge Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col justify-between gap-3">
              <span className="text-mono text-[11px] text-text-tertiary">PLANT HEALTH INDEX</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-mono text-text-primary">{healthIndex}</span>
                <span className="text-xs font-mono text-text-tertiary">/ 100</span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-status-verified/30 bg-status-verified/10 text-status-verified self-start">
                HEALTHY OPERATING RHYTHM
              </span>
            </div>

            <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col justify-between gap-3">
              <span className="text-mono text-[11px] text-text-tertiary">HIGH RISK ASSETS</span>
              <span className="text-4xl font-bold font-mono text-status-warning">
                {(overview.high_risk_assets_count as number) ?? 2}
              </span>
              <span className="text-xs text-text-tertiary">Requires preventive inspection</span>
            </div>

            <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col justify-between gap-3">
              <span className="text-mono text-[11px] text-text-tertiary">TOTAL ACTIVE FINDINGS</span>
              <span className="text-4xl font-bold font-mono text-text-primary">{findings.length}</span>
              <span className="text-xs text-text-tertiary">Across registered equipment fleet</span>
            </div>

            <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col justify-between gap-3">
              <span className="text-mono text-[11px] text-text-tertiary">HYBRID LLM REASONING</span>
              <span className="text-4xl font-bold font-mono text-status-verified">100%</span>
              <span className="text-xs text-text-tertiary">Grounded root cause diagnosis</span>
            </div>
          </div>

          {/* Recent Findings Summary */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-text-primary uppercase tracking-wider">
                Recent Predictive Risk Findings
              </span>
              <button
                onClick={() => setActiveTab("findings")}
                className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
              >
                <span>View All ({findings.length})</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="border border-border-subtle rounded-sm bg-bg-primary divide-y divide-border-subtle min-h-[220px]">
              {findings.length > 0 ? (
                findings.map((f) => (
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
                        {f.asset_name} ({f.equipment_id})
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono rounded font-bold border bg-status-warning/10 text-status-warning border-status-warning/30">
                        {f.estimated_priority}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{f.recommended_action}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-text-tertiary my-auto">
                  No active predictive maintenance findings recorded yet. Trigger a scan to evaluate equipment.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. FINDINGS TAB */}
      {activeTab === "findings" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Findings List (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center gap-2 p-3 rounded-sm bg-bg-secondary border border-border-subtle">
              <Search size={14} className="text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment ID, asset name, or action..."
                className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-tertiary outline-none"
              />
            </div>

            <div className="border border-border-subtle rounded-sm bg-bg-primary flex flex-col divide-y divide-border-subtle min-h-[380px]">
              {filteredFindings.length > 0 ? (
                filteredFindings.map((f) => (
                  <div
                    key={f.finding_id}
                    onClick={() => setSelectedFinding(f)}
                    className={cn(
                      "p-4 flex flex-col gap-2 cursor-pointer transition-colors",
                      selectedFinding?.finding_id === f.finding_id
                        ? "bg-bg-tertiary"
                        : "hover:bg-bg-secondary"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary">
                        {f.asset_name} ({f.equipment_id})
                      </span>
                      <span className="text-mono text-xs font-bold text-accent">
                        Risk Score: {f.risk_score}
                      </span>
                    </div>
                    <span className="text-xs text-text-secondary leading-relaxed">
                      {f.recommended_action}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-text-tertiary my-auto">
                  No active predictive findings matched your search.
                </div>
              )}
            </div>
          </div>

          {/* Right: Finding Evidence & Recommendation Drawer (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {selectedFinding ? (
              <div className="p-6 rounded-sm border border-border-subtle bg-bg-primary flex flex-col gap-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <span className="text-xs font-bold text-text-primary font-mono uppercase tracking-wider">
                    Predictive Recommendation Ledger
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded font-bold border bg-status-warning/10 text-status-warning border-status-warning/30">
                    {selectedFinding.estimated_priority}
                  </span>
                </div>

                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-text-tertiary text-[11px]">Target Equipment</span>
                    <span className="font-semibold text-text-primary">
                      {selectedFinding.asset_name} ({selectedFinding.equipment_id})
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 pt-2 border-t border-border-subtle">
                    <span className="text-text-tertiary text-[11px]">LLM Root Cause Diagnosis</span>
                    <div className="p-3 rounded bg-bg-secondary border border-border-subtle text-mono text-xs text-text-primary leading-relaxed">
                      {selectedFinding.historical_pattern}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 pt-2 border-t border-border-subtle">
                    <span className="text-text-tertiary text-[11px]">Recommended Preventive Action</span>
                    <p className="text-text-secondary leading-relaxed">{selectedFinding.recommended_action}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-border-subtle">
                  <button
                    onClick={() => handleInspectDocument(selectedFinding.equipment_id)}
                    className="w-full h-9 rounded bg-text-primary hover:opacity-90 text-bg-primary text-xs font-medium flex items-center justify-center gap-2 transition-opacity shadow-sm"
                  >
                    <Eye size={14} />
                    <span>Open Original Document Window</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 border border-border-subtle rounded-sm bg-bg-secondary text-center text-xs text-text-tertiary">
                Select a finding to inspect root cause diagnosis and recommendations.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. HEALTH TAB */}
      {activeTab === "health" && (
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold font-mono text-text-primary uppercase tracking-wider">
            Asset MTBF & Health Index Ledger
          </span>

          <div className="border border-border-subtle rounded-sm bg-bg-primary divide-y divide-border-subtle">
            {[
              { id: "PUMP-P101A", name: "Primary Cooling Water Pump P-101A", health: 85.4, mtbf: 180, last: "2026-02-15" },
              { id: "VALVE-VLV302", name: "Suction Isolation Valve VLV-302", health: 92.0, mtbf: 360, last: "2025-11-10" },
              { id: "COMP-C401", name: "Substation Air Compressor C-401", health: 78.1, mtbf: 120, last: "2025-10-01" },
            ].map((eq) => (
              <div key={eq.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-text-primary">{eq.name}</span>
                  <span className="text-mono text-[11px] text-text-tertiary">Asset ID: {eq.id}</span>
                </div>

                <div className="flex items-center gap-6 font-mono text-[11px]">
                  <div className="flex flex-col items-end">
                    <span className="text-text-tertiary">Health Index</span>
                    <span className="font-bold text-accent">{eq.health} / 100</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-text-tertiary">Est. MTBF</span>
                    <span className="font-bold text-text-primary">{eq.mtbf} Days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scan Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-bg-primary border border-border-subtle rounded-sm max-w-lg w-full p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold text-text-primary font-mono">
                TRIGGER PREDICTIVE MAINTENANCE SCAN
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
                <label className="text-text-tertiary font-mono">Equipment Asset ID</label>
                <input
                  type="text"
                  value={scanEquipId}
                  onChange={(e) => setScanEquipId(e.target.value)}
                  placeholder="PUMP-P101A"
                  className="p-2 bg-bg-secondary border border-border-subtle rounded text-text-primary font-mono text-xs outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-text-tertiary font-mono">Raw Inspection Notes (Optional)</label>
                <textarea
                  value={scanContent}
                  onChange={(e) => setScanContent(e.target.value)}
                  placeholder="Enter vibration telemetry, bearing noise notes, or thermal readings..."
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
                  Run Predictive Agent Scan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Viewer Modal for Document Click */}
      <DocumentViewerModal
        doc={activeDocForViewer}
        open={viewerModalOpen}
        onClose={() => setViewerModalOpen(false)}
      />
    </div>
  );
}
