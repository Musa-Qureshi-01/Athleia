"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileUp,
  Search,
  Cpu,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Server,
  Layers,
  Inbox,
  RefreshCw,
  Bot,
  Crown,
  Settings,
  Lock,
  Laptop,
  CheckCircle2,
  Wrench,
  Sparkles,
} from "lucide-react";
import { fetchGatewayHealth } from "@/lib/api";
import { cn } from "@/lib/utils";

const INITIAL_SERVICES = [
  {
    name: "Enterprise API Gateway",
    port: "8000",
    status: "Operational",
    type: "Core Gateway",
    desc: "Single entry point. Manages routing, rate-limiting, and circuit breakers.",
    active: true,
  },
  {
    name: "Semantic Search (Retrieval)",
    port: "8001",
    status: "Operational",
    type: "Microservice",
    desc: "Vector embeddings + BM25 keyword fusion engine for P&IDs and SOPs.",
    active: true,
  },
  {
    name: "Grounded Reasoning Service",
    port: "8002",
    status: "Operational",
    type: "Microservice",
    desc: "Multi-tool orchestration, evidence ranking, and citation verification.",
    active: true,
  },
  {
    name: "Document Ingestion Service",
    port: "8003",
    status: "Operational",
    type: "Microservice",
    desc: "OCR, table extraction, and CAD P&ID symbol parsing pipeline.",
    active: true,
  },
  {
    name: "Enterprise Knowledge Service",
    port: "8005",
    status: "Operational",
    type: "Microservice",
    desc: "Google OKF v1.0, Markdown adapters, lifecycle state machine & PostgreSQL audit log.",
    active: true,
  },
  {
    name: "Compliance Intelligence Service",
    port: "8006",
    status: "Operational",
    type: "Microservice",
    desc: "LangGraph monitoring agent, zero-token rule engine, ISO/OSHA policy validation.",
    active: true,
  },
  {
    name: "Maintenance Intelligence Service",
    port: "8007",
    status: "Operational",
    type: "Microservice",
    desc: "LangGraph predictive agent, failure pattern engine, MTBF equipment reliability forecasting.",
    active: true,
  },
  {
    name: "Knowledge Graph Service",
    port: "8004",
    status: "Planned Expansion",
    type: "Microservice",
    desc: "Entity-relationship mapping for equipment, valves, and process lines.",
    active: false,
  },
];

export default function WorkspaceDashboard() {
  const [gatewayStatus, setGatewayStatus] = useState<string>("Checking...");
  const [services] = useState(INITIAL_SERVICES);

  // Read role from localStorage (client-side only)
  const userRole =
    typeof window !== "undefined"
      ? (() => {
          try {
            return JSON.parse(localStorage.getItem("axios_user") || "{}").role || "";
          } catch {
            return "";
          }
        })()
      : "";
  const isSuperAdmin = userRole === "SUPER_ADMIN";

  const checkHealth = async () => {
    setGatewayStatus("Checking...");
    try {
      const health = await fetchGatewayHealth();
      if (health && health.status === "ok") {
        setGatewayStatus("Gateway Connected (Port 8000)");
      } else {
        setGatewayStatus("Gateway Disconnected");
      }
    } catch {
      setGatewayStatus("Gateway Disconnected");
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8">
      {/* Mobile-Only Notice Banner */}
      <div className="md:hidden p-4 rounded-md border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-bg-secondary to-bg-tertiary shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-border-subtle/50 pb-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Laptop size={15} />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Mobile Workstation Mode
            </span>
          </div>
          <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Compact View
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          You are currently accessing Axios.ai from a mobile device. <strong className="text-text-primary">Workforce Copilot</strong>, <strong className="text-text-primary">Intelligence Reasoning</strong>, <strong className="text-text-primary font-medium">Org Admin</strong>, <strong className="text-text-primary font-medium">Notifications</strong>, and <strong className="text-text-primary font-medium">Settings</strong> are fully unlocked.
        </p>
        <span className="text-[11px] font-mono text-text-tertiary flex items-center gap-1">
          <Lock size={11} className="text-amber-400 shrink-0" />
          <span>Heavy CAD ingestion, knowledge graph visualizers, and scan triggers require desktop.</span>
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-label text-text-tertiary">Industrial Intelligence Console</span>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-bg-tertiary text-text-secondary border border-border-subtle flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--status-verified)" }} />
              {gatewayStatus}
            </span>
          </div>
          <h1 className="text-heading-1 text-text-primary">
            Plant 101 Overview
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={checkHealth}
            title="Refresh System Status"
            className="p-2 rounded-sm border border-border-subtle bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors"
          >
            <RefreshCw size={14} />
          </button>

          <Link
            href="/workspace/assistant"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 h-9 px-4 rounded-sm text-xs font-semibold bg-text-primary text-bg-primary hover:opacity-90 transition-opacity shadow-sm"
          >
            <Bot size={14} />
            <span>Launch Workforce Copilot</span>
          </Link>
        </div>
      </div>

      {/* Section 1: Mobile-Unlocked Workstation Services */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-status-verified" />
            <span className="md:hidden">Mobile-Unlocked Workspace Services</span>
            <span className="hidden md:inline">Core Operations & Assistant</span>
          </span>
          <span className="text-[10px] font-mono text-status-verified">Full Access</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Workforce Copilot */}
          <Link
            href="/workspace/assistant"
            className="p-4 sm:p-5 rounded-sm border border-border-strong bg-gradient-to-br from-bg-secondary via-bg-primary to-bg-tertiary hover:border-accent transition-all duration-150 flex flex-col justify-between gap-3 group shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-sm bg-accent/15 border border-accent/30 text-accent">
                <Bot size={18} />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-accent/10 text-accent font-semibold border border-accent/20 md:hidden">
                Unlocked
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-text-primary flex items-center justify-between">
                <span>Workforce Copilot</span>
                <ArrowRight size={14} className="text-text-tertiary group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
              </span>
              <span className="text-xs text-text-secondary">
                Conversational AI assistant for SOP lookup, unit diagnostics, and operator guidance.
              </span>
            </div>
          </Link>

          {/* Intelligence / Reasoning Engine */}
          <Link
            href="/workspace/intelligence"
            className="p-4 sm:p-5 rounded-sm border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary transition-all duration-150 flex flex-col justify-between gap-3 group"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-sm bg-bg-primary border border-border-subtle text-accent">
                <Cpu size={18} />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-status-verified/10 text-status-verified font-semibold border border-status-verified/20 md:hidden">
                Unlocked
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-text-primary flex items-center justify-between">
                <span>Reasoning Engine</span>
                <ArrowRight size={14} className="text-text-tertiary group-hover:text-text-primary group-hover:translate-x-0.5 transition-all" />
              </span>
              <span className="text-xs text-text-secondary">
                Multi-tool query execution with strict citation proofs and grounded evidence rankings.
              </span>
            </div>
          </Link>

          {/* Org Admin Setup (Super Admin) */}
          {isSuperAdmin && (
            <Link
              href="/workspace/admin"
              className="p-4 sm:p-5 rounded-sm border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary transition-all duration-150 flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-sm bg-bg-primary border border-border-subtle text-amber-400">
                  <Crown size={18} />
                </div>
                <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20 md:hidden">
                  Unlocked
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-text-primary flex items-center justify-between">
                  <span>Org Control Center</span>
                  <ArrowRight size={14} className="text-text-tertiary group-hover:text-text-primary group-hover:translate-x-0.5 transition-all" />
                </span>
                <span className="text-xs text-text-secondary">
                  User directory management, role updates, and platform administrative controls.
                </span>
              </div>
            </Link>
          )}

          {/* Settings */}
          <Link
            href="/workspace/settings"
            className="p-4 sm:p-5 rounded-sm border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary transition-all duration-150 flex flex-col justify-between gap-3 group"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-sm bg-bg-primary border border-border-subtle text-text-secondary">
                <Settings size={18} />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-status-verified/10 text-status-verified font-semibold border border-status-verified/20 md:hidden">
                Unlocked
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-text-primary flex items-center justify-between">
                <span>Preferences & Settings</span>
                <ArrowRight size={14} className="text-text-tertiary group-hover:text-text-primary group-hover:translate-x-0.5 transition-all" />
              </span>
              <span className="text-xs text-text-secondary">
                Configure color themes, gateway endpoints, and user account parameters.
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Section 2: Enterprise Engineering & Analytical Engines */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <Lock size={13} className="text-amber-400 md:hidden" />
            <span className="md:hidden">Desktop Workstation Required Services</span>
            <span className="hidden md:inline flex items-center gap-1.5">
              <Layers size={13} className="text-accent" />
              Enterprise Engineering & Analytics
            </span>
          </span>
          <span className="text-[10px] font-mono text-amber-400 md:hidden">Desktop Workstation View</span>
          <span className="text-[10px] font-mono text-text-tertiary hidden md:inline">Core Applications</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Documents / Ingestion */}
          <Link
            href="/workspace/documents"
            className="p-4 sm:p-5 rounded-sm border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary transition-all duration-150 flex flex-col justify-between gap-3 group relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-sm bg-bg-primary border border-border-subtle text-text-tertiary">
                <FileUp size={18} />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center gap-1 md:hidden">
                <Lock size={9} />
                <span>Desktop Only</span>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-text-primary flex items-center justify-between">
                <span>Document Ingestion</span>
                <ArrowRight size={14} className="text-text-tertiary group-hover:text-text-primary transition-colors" />
              </span>
              <span className="text-xs text-text-secondary">
                Upload CAD diagrams, process P&IDs, and execute OCR table extraction pipelines.
              </span>
            </div>
          </Link>

          {/* Search */}
          <Link
            href="/workspace/search"
            className="p-4 sm:p-5 rounded-sm border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary transition-all duration-150 flex flex-col justify-between gap-3 group relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-sm bg-bg-primary border border-border-subtle text-text-tertiary">
                <Search size={18} />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center gap-1 md:hidden">
                <Lock size={9} />
                <span>Desktop Only</span>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-text-primary flex items-center justify-between">
                <span>Hybrid Search Engine</span>
                <ArrowRight size={14} className="text-text-tertiary group-hover:text-text-primary transition-colors" />
              </span>
              <span className="text-xs text-text-secondary">
                Dense vector search, BM25 keyword fusion, and reciprocal rank fusion weighting.
              </span>
            </div>
          </Link>

          {/* Knowledge Graph */}
          <Link
            href="/workspace/knowledge"
            className="p-4 sm:p-5 rounded-sm border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary transition-all duration-150 flex flex-col justify-between gap-3 group relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-sm bg-bg-primary border border-border-subtle text-text-tertiary">
                <BookOpen size={18} />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center gap-1 md:hidden">
                <Lock size={9} />
                <span>Desktop Only</span>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-text-primary flex items-center justify-between">
                <span>Knowledge Console</span>
                <ArrowRight size={14} className="text-text-tertiary group-hover:text-text-primary transition-colors" />
              </span>
              <span className="text-xs text-text-secondary">
                OKF v1.0 package repository, interactive 2D/3D graph visualizer & OKF schema validation.
              </span>
            </div>
          </Link>

          {/* Compliance */}
          <Link
            href="/workspace/compliance"
            className="p-4 sm:p-5 rounded-sm border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary transition-all duration-150 flex flex-col justify-between gap-3 group relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-sm bg-bg-primary border border-border-subtle text-text-tertiary">
                <ShieldCheck size={18} />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center gap-1 md:hidden">
                <Lock size={9} />
                <span>Desktop Only</span>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-text-primary flex items-center justify-between">
                <span>Compliance Governance</span>
                <ArrowRight size={14} className="text-text-tertiary group-hover:text-text-primary transition-colors" />
              </span>
              <span className="text-xs text-text-secondary">
                LangGraph policy monitoring agent, zero-token rules, and multi-document compliance scans.
              </span>
            </div>
          </Link>

          {/* Maintenance */}
          <Link
            href="/workspace/maintenance"
            className="p-4 sm:p-5 rounded-sm border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary transition-all duration-150 flex flex-col justify-between gap-3 group relative overflow-hidden md:col-span-2 lg:col-span-1"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-sm bg-bg-primary border border-border-subtle text-text-tertiary">
                <Wrench size={18} />
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center gap-1 md:hidden">
                <Lock size={9} />
                <span>Desktop Only</span>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-text-primary flex items-center justify-between">
                <span>Maintenance Intelligence</span>
                <ArrowRight size={14} className="text-text-tertiary group-hover:text-text-primary transition-colors" />
              </span>
              <span className="text-xs text-text-secondary">
                LangGraph MTBF predictive agent runs, equipment telemetries, and autonomous failure forecasting.
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Grid: Microservices Status + Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Connected Services (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server size={16} className="text-text-secondary" />
              <h2 className="text-sm font-medium text-text-primary">Microservice Topology</h2>
            </div>
            <span className="text-mono text-xs text-text-tertiary hidden sm:inline">Managed via API Gateway (Port 8000)</span>
          </div>

          <div className="border border-border-subtle rounded-sm overflow-hidden bg-bg-primary divide-y divide-border-subtle">
            {services.map((svc) => (
              <div
                key={svc.name}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-bg-secondary transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-sm bg-bg-secondary border border-border-subtle text-text-secondary mt-0.5 shrink-0">
                    <Layers size={15} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-text-primary">{svc.name}</span>
                      <span className="text-mono text-[10px] text-text-tertiary px-1.5 py-0.2 rounded border border-border-subtle">
                        Port {svc.port}
                      </span>
                    </div>
                    <span className="text-xs text-text-secondary max-w-md">{svc.desc}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: svc.active
                        ? "var(--status-verified)"
                        : "var(--text-tertiary)",
                    }}
                  />
                  <span
                    className="text-mono text-xs"
                    style={{
                      color: svc.active
                        ? "var(--status-verified)"
                        : "var(--text-tertiary)",
                    }}
                  >
                    {svc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System & Recent Activity (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Security & Isolation Summary */}
          <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col gap-3">
            <div className="flex items-center gap-2 text-text-primary font-medium text-sm">
              <ShieldCheck size={16} className="text-status-verified" />
              <span>Zero-Trust Airgap Boundary</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              All documents remain strictly inside your infrastructure perimeter. External search disabled by policy.
            </p>
            <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-mono text-[11px] text-text-tertiary">
              <span>Tenant Isolation</span>
              <span className="text-text-primary font-medium">Enforced</span>
            </div>
          </div>

          {/* Activity Log Empty State */}
          <div className="flex-1 p-5 rounded-sm border border-border-subtle bg-bg-primary flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-primary">Recent Audit Trail</span>
              <span className="text-mono text-[10px] text-text-tertiary">Live Gateway Logs</span>
            </div>

            <div className="flex-1 min-h-[160px] flex flex-col items-center justify-center p-6 text-center border border-dashed border-border-subtle rounded-sm">
              <Inbox size={24} className="text-text-tertiary mb-2 stroke-[1.25]" />
              <span className="text-xs font-medium text-text-primary">No activity recorded yet</span>
              <span className="text-[11px] text-text-tertiary max-w-[200px] mt-1 leading-normal">
                Execute a search or reasoning query to record live requests in the Gateway audit log.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
