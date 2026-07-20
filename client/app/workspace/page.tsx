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
} from "lucide-react";
import { fetchGatewayHealth } from "@/lib/api";

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
  const [services, setServices] = useState(INITIAL_SERVICES);

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
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
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

        <div className="flex items-center gap-3">
          <button
            onClick={checkHealth}
            title="Refresh System Status"
            className="p-2 rounded-sm border border-border-subtle bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors"
          >
            <RefreshCw size={14} />
          </button>
          <Link
            href="/workspace/search"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-sm text-xs font-medium border border-border-strong text-text-primary hover:bg-bg-secondary transition-colors"
          >
            <Search size={14} />
            <span>Search Corpus</span>
          </Link>
          <Link
            href="/workspace/intelligence"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-sm text-xs font-medium bg-text-primary text-bg-primary hover:opacity-90 transition-opacity"
          >
            <Cpu size={14} />
            <span>New Reasoning Query</span>
          </Link>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/workspace/documents"
          className="p-5 rounded-sm border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary transition-all duration-150 flex flex-col justify-between gap-4 group"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-sm bg-bg-primary border border-border-subtle text-accent">
              <FileUp size={18} />
            </div>
            <ArrowRight size={16} className="text-text-tertiary group-hover:text-text-primary transition-colors" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text-primary">Ingest Documents</span>
            <span className="text-xs text-text-secondary">
              Upload P&ID PDFs, maintenance SOPs, and technical specification sheets.
            </span>
          </div>
        </Link>

        <Link
          href="/workspace/knowledge"
          className="p-5 rounded-sm border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary transition-all duration-150 flex flex-col justify-between gap-4 group"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-sm bg-bg-primary border border-border-subtle text-accent">
              <BookOpen size={18} />
            </div>
            <ArrowRight size={16} className="text-text-tertiary group-hover:text-text-primary transition-colors" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text-primary">Knowledge Graph</span>
            <span className="text-xs text-text-secondary">
              Google OKF v1.0 package repository and dynamic relationship visualizer.
            </span>
          </div>
        </Link>

        <Link
          href="/workspace/compliance"
          className="p-5 rounded-sm border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary transition-all duration-150 flex flex-col justify-between gap-4 group"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-sm bg-bg-primary border border-border-subtle text-accent">
              <ShieldCheck size={18} />
            </div>
            <ArrowRight size={16} className="text-text-tertiary group-hover:text-text-primary transition-colors" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text-primary">Compliance Governance</span>
            <span className="text-xs text-text-secondary">
              LangGraph policy monitoring agent, zero-token rules, ISO/OSHA audit matrix.
            </span>
          </div>
        </Link>

        <Link
          href="/workspace/intelligence"
          className="p-5 rounded-sm border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary transition-all duration-150 flex flex-col justify-between gap-4 group"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-sm bg-bg-primary border border-border-subtle text-accent">
              <Cpu size={18} />
            </div>
            <ArrowRight size={16} className="text-text-tertiary group-hover:text-text-primary transition-colors" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text-primary">Reasoning Engine</span>
            <span className="text-xs text-text-secondary">
              Query plant operations with strict citation verification and confidence scores.
            </span>
          </div>
        </Link>
      </div>

      {/* Main Grid: Microservices Status + Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Connected Services (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server size={16} className="text-text-secondary" />
              <h2 className="text-sm font-medium text-text-primary">Microservice Topology</h2>
            </div>
            <span className="text-mono text-xs text-text-tertiary">Managed via API Gateway (Port 8000)</span>
          </div>

          <div className="border border-border-subtle rounded-sm overflow-hidden bg-bg-primary divide-y divide-border-subtle">
            {services.map((svc) => (
              <div
                key={svc.name}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-bg-secondary transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-sm bg-bg-secondary border border-border-subtle text-text-secondary mt-0.5">
                    <Layers size={15} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
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
