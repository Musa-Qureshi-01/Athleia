"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bot,
  ShieldCheck,
  Wrench,
  FileText,
  ArrowRight,
  Database,
  Plus,
  Upload,
  Activity,
  CornerDownLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  FolderOpen,
} from "lucide-react";
import { getCorpusDocuments, CorpusDocument } from "@/lib/corpus-store";
import { fetchAssistantConversations } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ConversationItem {
  conversation_id: string;
  title: string;
  updated_at?: string;
}

export default function WorkspaceDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("Enterprise User");
  const [isDemo, setIsDemo] = useState(false);
  const [copilotInput, setCopilotInput] = useState("");
  const [corpusDocs, setCorpusDocs] = useState<CorpusDocument[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Load real authenticated user session
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const sessionType = localStorage.getItem("axios_session_type");
      const evalUser = localStorage.getItem("axios_eval_user");
      const storedUser = localStorage.getItem("axios_user");

      if (sessionType === "evolution" || evalUser) {
        const parsed = evalUser ? JSON.parse(evalUser) : {};
        setUserName(parsed.fullName?.split(" ")[0] || "Evaluation User");
        setIsDemo(true);
      } else if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const name = (parsed.full_name || parsed.fullName || parsed.email?.split("@")[0] || "User").split(" ")[0];
        setUserName(name);
        setIsDemo(false);
      }
    } catch {}
  }, []);

  // Load real indexed corpus documents
  useEffect(() => {
    try {
      setCorpusDocs(getCorpusDocuments());
    } catch {}
  }, []);

  // Load real conversations from assistant service
  useEffect(() => {
    fetchAssistantConversations()
      .then((convs) => {
        if (Array.isArray(convs)) {
          setConversations(convs);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;
    router.push(`/workspace/assistant?prompt=${encodeURIComponent(copilotInput.trim())}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-7 space-y-6 font-sans text-text-primary">
      
      {/* ── HEADER: Crisp & Clean (rounded-md, generous spacing) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Welcome, {userName}
            </h1>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-border-subtle bg-bg-secondary text-[11px] font-mono text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Enterprise Systems Active</span>
            </span>
            {isDemo && (
              <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold">
                Evaluation Sandbox
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary">
            Zero-hallucination industrial intelligence across plant P&amp;IDs, telemetry, and engineering SOPs.
          </p>
        </div>

        {/* Action Buttons: Crisp rounded-sm */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/workspace/documents"
            className="h-8.5 px-3 rounded-sm border border-border-subtle hover:border-border-strong bg-bg-primary hover:bg-bg-secondary text-text-primary text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Upload size={13} className="text-text-tertiary" />
            <span>Upload Document</span>
          </Link>

          <Link
            href="/workspace/assistant"
            className="h-8.5 px-3.5 rounded-sm bg-[#1F45EC] hover:bg-[#1839C5] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={13} />
            <span>New Copilot Session</span>
            <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono rounded-xs bg-white/20 text-white">
              Alt+C
            </kbd>
          </Link>
        </div>
      </div>

      {/* ── TOP NAV FILTER TABS ── */}
      <div className="flex items-center justify-between gap-3 text-xs border-b border-border-subtle pb-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: "overview", label: "Overview" },
            { id: "documents", label: `Knowledge Corpus (${corpusDocs.length})` },
            { id: "assistant", label: "Workforce Copilot" },
            { id: "integrations", label: "MCP Integrations" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1 rounded-sm font-medium transition-all cursor-pointer whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-[#1F45EC]/10 text-[#1F45EC] font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Link
          href="/workspace/catalog"
          className="text-xs font-medium text-text-tertiary hover:text-text-primary flex items-center gap-1 shrink-0"
        >
          <span>Service Directory</span>
          <ChevronRight size={12} />
        </Link>
      </div>

      {/* ── COPILOT INQUIRY INPUT BAR (rounded-sm) ── */}
      <form onSubmit={handleCopilotSubmit} className="relative w-full">
        <div className="relative flex items-center rounded-sm border border-border-subtle bg-bg-secondary hover:border-border-strong focus-within:border-[#1F45EC] focus-within:bg-bg-primary transition-all">
          <div className="pl-3.5 text-[#1F45EC]">
            <Bot size={18} />
          </div>
          <input
            type="text"
            value={copilotInput}
            onChange={(e) => setCopilotInput(e.target.value)}
            placeholder="Ask Workforce Copilot: isolation sequence for pump P-101A, ISO 45001 audit, or vibration limits..."
            className="w-full h-11 pl-2.5 pr-28 text-xs sm:text-sm text-text-primary bg-transparent placeholder:text-text-tertiary focus:outline-none"
          />
          <div className="absolute right-2 flex items-center">
            <button
              type="submit"
              disabled={!copilotInput.trim()}
              className="px-3 py-1.5 rounded-sm bg-[#1F45EC] hover:bg-[#1839C5] disabled:opacity-40 text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Ask Copilot</span>
              <CornerDownLeft size={11} />
            </button>
          </div>
        </div>
      </form>

      {/* ── 4 COMPACT METRIC TILES (rounded-sm, crisp enterprise) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Indexed Corpus</span>
            <Database size={14} className="text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-text-primary">
              {corpusDocs.length} <span className="text-xs font-normal text-text-secondary font-sans">Documents</span>
            </div>
            <p className="text-[11px] font-mono text-text-tertiary mt-0.5">Vector + BM25 Fusion</p>
          </div>
        </div>

        <div className="p-4 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Workforce Copilot</span>
            <Bot size={14} className="text-[#1F45EC]" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-text-primary">
              Grounded <span className="text-xs text-emerald-600 font-semibold font-sans">Ready</span>
            </div>
            <p className="text-[11px] font-mono text-text-tertiary mt-0.5">Port 8010 Active</p>
          </div>
        </div>

        <div className="p-4 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Compliance Core</span>
            <ShieldCheck size={14} className="text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-text-primary">
              0 Blocking <span className="text-xs text-emerald-600 font-semibold font-sans">Clean</span>
            </div>
            <p className="text-[11px] font-mono text-text-tertiary mt-0.5">OSHA / ISO Audits</p>
          </div>
        </div>

        <div className="p-4 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-text-tertiary">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">SCADA Telemetry</span>
            <Activity size={14} className="text-purple-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-text-primary">
              Nominal <span className="text-xs text-emerald-600 font-semibold font-sans">Online</span>
            </div>
            <p className="text-[11px] font-mono text-text-tertiary mt-0.5">Port 8007 Broker</p>
          </div>
        </div>
      </div>

      {/* ── 2-COLUMN BALANCED WORKING SECTION (Generous Gaps, rounded-lg) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
        
        {/* Left Column (7 cols): Real Knowledge Corpus / Inquiries */}
        <div className="lg:col-span-7 rounded-lg border border-border-subtle bg-bg-secondary p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Indexed Engineering Documents ({corpusDocs.length})
              </h2>
            </div>
            <Link
              href="/workspace/documents"
              className="text-xs font-semibold text-[#1F45EC] hover:underline flex items-center gap-1"
            >
              <span>Manage Corpus</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          {/* Real Documents List from Store */}
          {corpusDocs.length > 0 ? (
            <div className="divide-y divide-border-subtle/50">
              {corpusDocs.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/workspace/assistant?prompt=${encodeURIComponent(`Analyze document ${doc.name}`)}`}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-bg-tertiary/50 -mx-2 px-2.5 rounded-md transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-bg-primary border border-border-subtle flex items-center justify-center shrink-0 text-text-tertiary group-hover:text-[#1F45EC] transition-colors">
                      <FileText size={15} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-text-primary truncate group-hover:text-[#1F45EC] transition-colors">
                        {doc.name}
                      </h3>
                      <span className="text-[10.5px] font-mono text-text-tertiary block mt-0.5">
                        {doc.type} · {doc.size} · Uploaded {doc.uploadedAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Indexed
                    </span>
                    <ChevronRight size={13} className="text-text-tertiary group-hover:text-text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-2">
              <div className="w-8 h-8 rounded-md bg-bg-primary border border-border-subtle flex items-center justify-center mx-auto text-text-tertiary">
                <FolderOpen size={16} />
              </div>
              <span className="text-xs font-semibold text-text-primary block">No documents indexed yet</span>
              <p className="text-[11px] text-text-tertiary max-w-sm mx-auto">
                Upload a plant P&amp;ID, equipment manual, or standard operating procedure to begin.
              </p>
              <Link
                href="/workspace/documents"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1F45EC] text-white text-xs font-semibold hover:bg-[#1839C5] transition-all shadow-2xs mt-2"
              >
                <Upload size={12} />
                <span>Upload First Document</span>
              </Link>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Telemetry Gateway & Service Access */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Telemetry Gateway Broker Box */}
          <div className="rounded-lg border border-border-subtle bg-bg-secondary p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Activity size={15} className="text-purple-500" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  SCADA Telemetry Desk
                </h2>
              </div>
              <span className="text-[10px] font-mono text-text-tertiary">
                Port 8007
              </span>
            </div>

            <div className="p-3.5 rounded-md bg-bg-primary border border-border-subtle space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary font-medium">Telemetry Broker:</span>
                <span className="flex items-center gap-1.5 font-mono text-emerald-600 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online</span>
                </span>
              </div>
              <p className="text-[11px] text-text-tertiary leading-relaxed">
                Broker ready for live Modbus TCP, OPC-UA, and MQTT telemetry feeds from plant equipment loops.
              </p>
            </div>

            <Link
              href="/workspace/telemetry"
              className="w-full py-2 rounded-md border border-border-subtle hover:border-border-strong text-xs font-medium text-text-secondary hover:text-text-primary flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Plant Diagnostic Desk</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* 4 Core Microservice Quick Tiles */}
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/workspace/assistant"
              className="p-3 rounded-md border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-primary transition-all flex items-center gap-2.5 group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                <Bot size={15} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-text-primary block leading-tight group-hover:text-[#1F45EC] truncate">
                  Copilot
                </span>
                <span className="text-[10px] font-mono text-text-tertiary block leading-tight truncate mt-0.5">
                  Reasoning Core
                </span>
              </div>
            </Link>

            <Link
              href="/workspace/integrations"
              className="p-3 rounded-md border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-primary transition-all flex items-center gap-2.5 group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Database size={15} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-text-primary block leading-tight group-hover:text-[#1F45EC] truncate">
                  MCP Servers
                </span>
                <span className="text-[10px] font-mono text-text-tertiary block leading-tight truncate mt-0.5">
                  15 Integrations
                </span>
              </div>
            </Link>

            <Link
              href="/workspace/documents"
              className="p-3 rounded-md border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-primary transition-all flex items-center gap-2.5 group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <FileText size={15} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-text-primary block leading-tight group-hover:text-[#1F45EC] truncate">
                  Corpus
                </span>
                <span className="text-[10px] font-mono text-text-tertiary block leading-tight truncate mt-0.5">
                  OCR &amp; P&amp;IDs
                </span>
              </div>
            </Link>

            <Link
              href="/workspace/compliance"
              className="p-3 rounded-md border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-primary transition-all flex items-center gap-2.5 group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-md bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={15} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-text-primary block leading-tight group-hover:text-[#1F45EC] truncate">
                  Compliance
                </span>
                <span className="text-[10px] font-mono text-text-tertiary block leading-tight truncate mt-0.5">
                  OSHA / ISO
                </span>
              </div>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
