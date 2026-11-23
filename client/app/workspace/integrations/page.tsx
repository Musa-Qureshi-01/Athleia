"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Blocks,
  Search,
  CheckCircle2,
  Zap,
  Globe,
  ShieldCheck,
  Check,
  X,
  Radio,
  ChevronRight,
  Power,
  Link2,
  RefreshCw,
  Terminal,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { McpLogoDispatcher } from "@/components/visuals/McpLogos";

interface McpIntegration {
  id: string;
  name: string;
  category: "productivity" | "ai_mcp" | "database";
  categoryLabel: string;
  tagline: string;
  description: string;
  connected: boolean;
  type: "OAuth" | "SSE" | "stdio" | "API Key";
  serverUrl?: string;
  toolsCount: number;
  sampleTools: string[];
}

// All integrations start disconnected by default — no fake mock connections
const AVAILABLE_MCPS: McpIntegration[] = [
  // ── Enterprise Productivity & Workspace ──
  {
    id: "google-workspace",
    name: "Google Workspace",
    category: "productivity",
    categoryLabel: "Workspace & Tools",
    tagline: "Docs, Drive & Gmail",
    description: "Read, search, and ground prompts across Google Docs, Sheets, Drive files, and Gmail threads via official MCP.",
    connected: false,
    type: "OAuth",
    toolsCount: 14,
    sampleTools: ["docs_search", "drive_read_file", "gmail_get_threads"],
  },
  {
    id: "slack",
    name: "Slack MCP",
    category: "productivity",
    categoryLabel: "Workspace & Tools",
    tagline: "Channels & DMs",
    description: "Context ingestion from operational dispatch channels, plant shift handoffs, and incident huddles.",
    connected: false,
    type: "OAuth",
    toolsCount: 8,
    sampleTools: ["slack_search_messages", "slack_read_channel", "slack_post_summary"],
  },
  {
    id: "jira",
    name: "Atlassian Jira",
    category: "productivity",
    categoryLabel: "Workspace & Tools",
    tagline: "Issues & Sprints",
    description: "Link engineering anomalies and maintenance tasks directly to Jira Service Management tickets.",
    connected: false,
    type: "API Key",
    toolsCount: 11,
    sampleTools: ["jira_get_issue", "jira_create_work_order", "jira_search_jql"],
  },
  {
    id: "confluence",
    name: "Confluence MCP",
    category: "productivity",
    categoryLabel: "Workspace & Tools",
    tagline: "SOPs & Spaces",
    description: "Sync corporate engineering manuals, safety standard operating procedures, and technical specifications.",
    connected: false,
    type: "OAuth",
    toolsCount: 6,
    sampleTools: ["confluence_read_page", "confluence_search_space"],
  },
  {
    id: "github",
    name: "GitHub MCP",
    category: "productivity",
    categoryLabel: "Workspace & Tools",
    tagline: "Repos & PRs",
    description: "Inspect PLC logic firmware repos, automation scripts, and Docker microservice configurations.",
    connected: false,
    type: "OAuth",
    toolsCount: 16,
    sampleTools: ["github_search_code", "github_read_file", "github_list_prs"],
  },
  {
    id: "notion",
    name: "Notion MCP",
    category: "productivity",
    categoryLabel: "Workspace & Tools",
    tagline: "Wikis & Databases",
    description: "Retrieve project roadmaps, equipment catalogs, and procedural checklists maintained in Notion workspaces.",
    connected: false,
    type: "OAuth",
    toolsCount: 9,
    sampleTools: ["notion_query_database", "notion_get_page"],
  },
  {
    id: "meeting-notes",
    name: "Meeting Notes",
    category: "productivity",
    categoryLabel: "Workspace & Tools",
    tagline: "Granola & Fireflies",
    description: "Extract plant shift changeover minutes, safety committee discussions, and engineering decisions.",
    connected: false,
    type: "API Key",
    toolsCount: 4,
    sampleTools: ["notes_search_transcripts", "notes_extract_action_items"],
  },

  // ── Advanced AI & Remote MCP Servers ──
  {
    id: "glean-mcp",
    name: "Glean Remote MCP",
    category: "ai_mcp",
    categoryLabel: "AI & Knowledge",
    tagline: "Enterprise Search",
    description: "Official remote MCP server for deep enterprise semantic search across all corporate cloud apps.",
    connected: false,
    type: "SSE",
    toolsCount: 7,
    sampleTools: ["glean_search_all", "glean_get_document", "glean_entity_lookup"],
  },
  {
    id: "context7",
    name: "Context7 MCP",
    category: "ai_mcp",
    categoryLabel: "AI & Knowledge",
    tagline: "Upstash Context",
    description: "Upstash Context7 real-time context streaming engine for token-optimized retrieval on large docs.",
    connected: false,
    type: "SSE",
    toolsCount: 5,
    sampleTools: ["context7_stream_context", "context7_retrieve_chunks"],
  },
  {
    id: "deepwiki",
    name: "DeepWiki MCP",
    category: "ai_mcp",
    categoryLabel: "AI & Knowledge",
    tagline: "Multi-Repo Wiki",
    description: "Deep structured architectural search across multi-repository engineering documents and RFCs.",
    connected: false,
    type: "stdio",
    toolsCount: 6,
    sampleTools: ["deepwiki_query", "deepwiki_explain_architecture"],
  },
  {
    id: "mem0",
    name: "Mem0 MCP",
    category: "ai_mcp",
    categoryLabel: "AI & Knowledge",
    tagline: "Adaptive Memory",
    description: "Continuous user and plant context memory layer, recalling technician preferences and past inquiries.",
    connected: false,
    type: "API Key",
    toolsCount: 5,
    sampleTools: ["mem0_add_memory", "mem0_search_memories", "mem0_get_profile"],
  },
  {
    id: "ekos",
    name: "EKOS Compiler",
    category: "ai_mcp",
    categoryLabel: "AI & Knowledge",
    tagline: "Knowledge Graph",
    description: "Automated causal relationship graph compiler mapping dependencies between industrial equipment and SOPs.",
    connected: false,
    type: "SSE",
    toolsCount: 8,
    sampleTools: ["ekos_compile_ontology", "ekos_trace_causal_path"],
  },
  {
    id: "raven",
    name: "Knowledge Raven",
    category: "ai_mcp",
    categoryLabel: "AI & Knowledge",
    tagline: "Standards Crawler",
    description: "Autonomous agent monitoring OSHA, ISO, and ASME engineering code updates and regulatory changes.",
    connected: false,
    type: "stdio",
    toolsCount: 4,
    sampleTools: ["raven_crawl_standard", "raven_extract_clauses"],
  },

  // ── Databases & Warehouses ──
  {
    id: "company-db",
    name: "Company DB MCP",
    category: "database",
    categoryLabel: "Databases",
    tagline: "PostgreSQL / MySQL",
    description: "Direct read-only schema discovery, foreign key introspection, and parameterized operational queries.",
    connected: false,
    type: "stdio",
    toolsCount: 12,
    sampleTools: ["db_list_tables", "db_describe_schema", "db_execute_readonly"],
  },
  {
    id: "snowflake",
    name: "Snowflake MCP",
    category: "database",
    categoryLabel: "Databases",
    tagline: "Cloud Warehouse",
    description: "Query plant operational metrics, energy consumption logs, and historical maintenance cost ledgers.",
    connected: false,
    type: "OAuth",
    toolsCount: 7,
    sampleTools: ["snowflake_run_query", "snowflake_get_tables"],
  },
];

export default function IntegrationsPage() {
  const [mcps, setMcps] = useState<McpIntegration[]>(AVAILABLE_MCPS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalMcp, setActiveModalMcp] = useState<McpIntegration | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showRightDock, setShowRightDock] = useState(true);

  // Load user's real saved connections from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("axios_connected_mcps");
      if (saved) {
        const connectedIds: string[] = JSON.parse(saved);
        setMcps((prev) =>
          prev.map((m) => ({
            ...m,
            connected: connectedIds.includes(m.id),
          }))
        );
      }
    } catch {}
  }, []);

  const saveConnections = (updated: McpIntegration[]) => {
    try {
      const connectedIds = updated.filter((m) => m.connected).map((m) => m.id);
      localStorage.setItem("axios_connected_mcps", JSON.stringify(connectedIds));
    } catch {}
  };

  const filteredMcps = mcps.filter((m) => {
    const matchesCategory = selectedCategory === "all" || m.category === selectedCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const connectedList = mcps.filter((m) => m.connected);
  const totalActiveTools = connectedList.reduce((acc, curr) => acc + curr.toolsCount, 0);

  const handleToggleConnection = (mcpId: string) => {
    setIsConnecting(true);
    setTimeout(() => {
      setMcps((prev) => {
        const next = prev.map((m) => {
          if (m.id === mcpId) {
            return {
              ...m,
              connected: !m.connected,
              serverUrl: !m.connected
                ? `https://mcp.${m.id.toLowerCase()}.enterprise/sse`
                : undefined,
            };
          }
          return m;
        });
        saveConnections(next);
        return next;
      });
      setIsConnecting(false);
      setActiveModalMcp(null);
    }, 400);
  };

  return (
    <div className="flex-1 w-full bg-bg-primary text-text-primary flex overflow-hidden">
      
      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 space-y-7">
          
          {/* Header Row: Crisp & Clean (No Excessive Curves) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border-subtle">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#1F45EC]/10 text-[#1F45EC] border border-[#1F45EC]/20 flex items-center justify-center font-bold shrink-0">
                  <Blocks size={16} />
                </div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                  Integrations &amp; MCP Servers
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#1F45EC]/15 text-[#1F45EC] border border-[#1F45EC]/30">
                  New
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Connect external enterprise services into Workforce Copilot via the open Model Context Protocol (MCP).
              </p>
            </div>

            {/* Right dock toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-text-tertiary">
                {connectedList.length} connected · {totalActiveTools} tools active
              </span>
              <button
                onClick={() => setShowRightDock((v) => !v)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border-subtle hover:border-border-strong text-xs font-medium text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                title="Toggle Active MCPs bar"
              >
                <Radio size={12} className={showRightDock ? "text-[#1F45EC]" : "text-text-tertiary"} />
                <span>{showRightDock ? "Hide Active Bar" : "Show Active Bar"}</span>
              </button>
            </div>
          </div>

          {/* Filter Bar & Search with Generous Gap */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Category Tabs: Crisp rounded-md */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: "all", label: "All Integrations", count: mcps.length },
                { id: "productivity", label: "Workspace & Tools", count: mcps.filter((m) => m.category === "productivity").length },
                { id: "ai_mcp", label: "AI & Knowledge", count: mcps.filter((m) => m.category === "ai_mcp").length },
                { id: "database", label: "Databases", count: mcps.filter((m) => m.category === "database").length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-2",
                    selectedCategory === tab.id
                      ? "bg-[#1F45EC] text-white shadow-2xs font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary border border-transparent"
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded text-[10px] font-mono",
                      selectedCategory === tab.id
                        ? "bg-white/20 text-white"
                        : "text-text-tertiary bg-bg-tertiary"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input: Clean rounded-md */}
            <div className="relative min-w-[200px] sm:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search integrations..."
                className="w-full pl-9 pr-3 py-1.5 rounded-md border border-border-subtle bg-bg-secondary text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#1F45EC] transition-colors"
              />
            </div>
          </div>

          {/* ── CRISP, CLEAN INTEGRATION CARDS (Proper gaps, less curvy: rounded-lg) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMcps.map((mcp) => (
              <div
                key={mcp.id}
                onClick={() => setActiveModalMcp(mcp)}
                className="p-4 rounded-lg border border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary/40 transition-all flex items-center justify-between gap-3 group shadow-2xs hover:shadow-xs cursor-pointer select-none"
              >
                {/* Left: Authentic Logo + Name + Subtitle */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-md bg-bg-primary border border-border-subtle flex items-center justify-center p-1.5 shadow-2xs group-hover:border-[#1F45EC]/30 transition-colors shrink-0">
                    <McpLogoDispatcher id={mcp.id} size={20} className="shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-text-primary group-hover:text-[#1F45EC] transition-colors truncate leading-tight">
                      {mcp.name}
                    </h3>
                    <p className="text-[11px] text-text-tertiary truncate leading-tight mt-1">
                      {mcp.tagline}
                    </p>
                  </div>
                </div>

                {/* Right: Real Connection State */}
                <div className="shrink-0 flex items-center">
                  {mcp.connected ? (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded text-[11px] font-medium text-text-secondary bg-bg-tertiary group-hover:bg-[#1F45EC] group-hover:text-white transition-all">
                      Connect
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── CLEAN SLIM RIGHT DOCK: REAL ACTIVE MCPS (rounded-md, proper gaps) ── */}
      {showRightDock && (
        <aside className="hidden lg:flex w-16 xl:w-20 border-l border-border-subtle bg-bg-secondary shrink-0 flex-col items-center py-6 px-2 select-none justify-between animate-in slide-in-from-right duration-150">
          
          {/* Top: Connected MCP Stack */}
          <div className="flex flex-col items-center gap-3 w-full">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary font-bold text-center">
              Active
            </span>

            <div className="w-8 border-b border-border-subtle" />

            <div className="flex flex-col items-center gap-3 overflow-y-auto max-h-[calc(100vh-200px)] w-full py-1 scrollbar-none">
              {connectedList.map((mcp) => (
                <button
                  key={mcp.id}
                  onClick={() => setActiveModalMcp(mcp)}
                  className="relative group p-1 rounded-md transition-all hover:scale-105 cursor-pointer"
                  title={`${mcp.name} (${mcp.toolsCount} tools active) - Click to manage`}
                >
                  <div className="w-9 h-9 rounded-md bg-bg-primary flex items-center justify-center p-2 shadow-2xs border border-border-subtle group-hover:border-[#1F45EC]/40 transition-colors">
                    <McpLogoDispatcher id={mcp.id} size={18} className="shrink-0" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-bg-secondary" />
                </button>
              ))}

              {connectedList.length === 0 && (
                <div className="text-[10px] font-mono text-text-tertiary text-center py-4 px-1 leading-tight">
                  No MCPs linked
                </div>
              )}
            </div>
          </div>

          {/* Bottom Copilot Zap Link */}
          <div className="flex flex-col items-center w-full pt-3 border-t border-border-subtle">
            <Link
              href="/workspace/assistant"
              className="w-8 h-8 rounded-md bg-[#1F45EC] hover:bg-[#1538D4] text-white flex items-center justify-center transition-all shadow-2xs"
              title={`Open Workforce Copilot (${totalActiveTools} tools active)`}
            >
              <Zap size={14} />
            </Link>
          </div>

        </aside>
      )}

      {/* ── CRISP CONNECTION MODAL (rounded-xl, no extreme roundness) ── */}
      {activeModalMcp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-border-strong bg-bg-primary p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-bg-secondary border border-border-subtle flex items-center justify-center p-2 shadow-2xs shrink-0">
                  <McpLogoDispatcher id={activeModalMcp.id} size={24} className="shrink-0" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-text-primary">
                      {activeModalMcp.name}
                    </h3>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-bg-secondary border border-border-subtle text-text-tertiary">
                      {activeModalMcp.type}
                    </span>
                  </div>
                  <span className="text-xs text-text-tertiary">
                    {activeModalMcp.tagline}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveModalMcp(null)}
                className="p-1.5 text-text-tertiary hover:text-text-primary rounded-md transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-text-secondary leading-relaxed">
              {activeModalMcp.description}
            </p>

            {/* Exposed Tools */}
            <div className="p-3 rounded-md bg-bg-secondary border border-border-subtle space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary font-bold block">
                Exposed Tools ({activeModalMcp.toolsCount})
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {activeModalMcp.sampleTools.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] font-mono text-text-secondary bg-bg-primary border border-border-subtle flex items-center gap-1"
                  >
                    <Terminal size={10} className="text-[#1F45EC]" />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Configuration Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-text-secondary mb-1 text-[11px]">
                  Server Transport URI
                </label>
                <input
                  type="text"
                  readOnly={activeModalMcp.connected}
                  defaultValue={
                    activeModalMcp.serverUrl ||
                    (activeModalMcp.type === "SSE"
                      ? `https://mcp.${activeModalMcp.id}.enterprise/sse`
                      : activeModalMcp.type === "OAuth"
                      ? `oauth://${activeModalMcp.id}.auth.internal`
                      : `npx -y @modelcontextprotocol/server-${activeModalMcp.id}`)
                  }
                  className="w-full p-2.5 rounded-md border border-border-subtle bg-bg-secondary text-text-primary font-mono text-[11px] focus:outline-none focus:border-[#1F45EC]"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1 text-[11px]">
                  {activeModalMcp.type === "OAuth" ? "Scopes" : "API Token"}
                </label>
                <input
                  type="password"
                  defaultValue={activeModalMcp.connected ? "••••••••••••••••••••" : ""}
                  placeholder={activeModalMcp.type === "OAuth" ? "read, search" : "mcp_sk_live_..."}
                  className="w-full p-2.5 rounded-md border border-border-subtle bg-bg-secondary text-text-primary text-[11px] focus:outline-none focus:border-[#1F45EC]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
              <span className="text-[11px] font-mono text-text-tertiary">
                {activeModalMcp.connected ? "Active & Linked" : "Not connected"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalMcp(null)}
                  className="px-3.5 py-1.5 rounded-md border border-border-subtle text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  disabled={isConnecting}
                  onClick={() => handleToggleConnection(activeModalMcp.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer",
                    activeModalMcp.connected
                      ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                      : "bg-[#1F45EC] hover:bg-[#1538D4] text-white"
                  )}
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw size={11} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : activeModalMcp.connected ? (
                    <>
                      <Power size={11} />
                      <span>Disconnect</span>
                    </>
                  ) : (
                    <>
                      <Link2 size={11} />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
