"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  ArrowUp,
  Plus,
  MessageSquare,
  Sparkles,
  Zap,
  BrainCircuit,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  RotateCcw,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  FileText,
  ShieldCheck,
  Wrench,
  User,
  Cpu,
  Layers,
  Activity,
  Paperclip,
  HelpCircle,
  X,
  Search,
  ExternalLink,
  Database,
  Upload,
} from "lucide-react";
import {
  sendAssistantChatMessage,
  fetchAssistantConversations,
  fetchAssistantConversationDetail,
  submitAssistantFeedback,
} from "@/lib/api";
import { getCorpusDocuments, CorpusDocument } from "@/lib/corpus-store";
import { cn } from "@/lib/utils";

interface Citation {
  source_title: string;
  source_url?: string;
  snippet: string;
  confidence_score?: number;
}

interface ToolAudit {
  tool_name: string;
  input_params: Record<string, unknown>;
  output_summary: string;
  success: boolean;
  latency_seconds: number;
}

interface Message {
  message_id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  model_used?: string;
  citations?: Citation[];
  tool_calls?: ToolAudit[];
  suggested_followups?: string[];
  requires_approval?: boolean;
  created_at?: string;
}

interface Conversation {
  conversation_id: string;
  title: string;
  is_pinned?: boolean;
  is_archived?: boolean;
  updated_at?: string;
}

interface ModelOption {
  id: string;
  name: string;
  provider: string;
  badge: string;
  description: string;
}

const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "auto",
    name: "Axios Reasoning Core",
    provider: "Autonomous Router",
    badge: "Smart Router",
    description: "Multi-tool industrial engine dynamically routing queries to verified tools.",
  },
  {
    id: "openrouter/anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    badge: "Deep Reasoning",
    description: "Exceptional technical comprehension, P&ID diagram reasoning, and root-cause analysis.",
  },
  {
    id: "gemini/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    badge: "Large Context",
    description: "Rapid document synthesis across multi-hundred page engineering manuals.",
  },
  {
    id: "groq/llama-3.3-70b-versatile",
    name: "Groq Llama 3.3 70B",
    provider: "Groq",
    badge: "Ultra Fast",
    description: "Sub-second token throughput for instantaneous operational lookups.",
  },
  {
    id: "openrouter/deepseek/deepseek-r1",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    badge: "Chain-of-Thought",
    description: "Rigorous step-by-step mathematical verification and SOP validation.",
  },
  {
    id: "ollama/llama3.1",
    name: "Local Ollama 3.1",
    provider: "On-Premise",
    badge: "Air-Gapped",
    description: "Offline local model inference preserving complete internal data sovereignty.",
  },
];

const PLUGINS = [
  { id: "pnd_ocr", name: "P&ID Ingestion Engine", enabled: true, desc: "OCR parsing of CAD schematics and valve schedules" },
  { id: "scada_stream", name: "SCADA Telemetry Stream", enabled: true, desc: "Real-time Modbus/OPC sensor loop monitoring" },
  { id: "compliance_rules", name: "OSHA & ISO Auditor", enabled: true, desc: "Automated clause verification against safety standards" },
  { id: "hybrid_search", name: "BM25 + Vector Fusion", enabled: true, desc: "Reciprocal Rank Fusion over vectorized engineering documents" },
];

export default function WorkforceCopilotPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Model Selector
  const [selectedModel, setSelectedModel] = useState<ModelOption>(AVAILABLE_MODELS[0]);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  // Real Context Document Attachments
  const [corpusDocs, setCorpusDocs] = useState<CorpusDocument[]>([]);
  const [attachedDocs, setAttachedDocs] = useState<CorpusDocument[]>([]);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [connectedToolCount, setConnectedToolCount] = useState<number>(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("axios_connected_mcps");
      if (raw) {
        const parsed = JSON.parse(raw);
        setConnectedToolCount(Array.isArray(parsed) ? parsed.length : 0);
      }
    } catch {}
  }, []);

  // Plugins Modal
  const [pluginsOpen, setPluginsOpen] = useState(false);
  const [pluginsState, setPluginsState] = useState(PLUGINS);

  // Help Modal
  const [helpOpen, setHelpOpen] = useState(false);

  // Deep Think Switch
  const [deepThink, setDeepThink] = useState(false);

  // Copied & Feedback State
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<Record<string, number>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load conversations and corpus on mount
  useEffect(() => {
    async function init() {
      try {
        const convs = await fetchAssistantConversations();
        setConversations(convs);

        if (convs.length > 0) {
          setActiveConversationId(convs[0].conversation_id);
          loadConversationDetail(convs[0].conversation_id);
        }
      } catch (err) {
        console.error("Failed to load assistant data", err);
      }

      try {
        const docs = getCorpusDocuments();
        setCorpusDocs(docs);
      } catch (err) {
        console.error("Failed to load corpus documents", err);
      }
    }
    init();
  }, []);

  // Click outside to close model dropdown and attach menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelMenuRef.current && !modelMenuRef.current.contains(event.target as Node)) {
        setModelDropdownOpen(false);
      }
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target as Node)) {
        setAttachMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputMessage]);

  async function loadConversationDetail(cid: string) {
    try {
      const detail = await fetchAssistantConversationDetail(cid);
      if (detail && detail.messages) {
        setMessages(
          detail.messages.map((m: any) => ({
            message_id: m.message_id,
            role: m.role,
            content: m.content,
            model_used: m.model_used,
            created_at: m.created_at,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load conversation details", err);
    }
  }

  const handleSelectConversation = (cid: string) => {
    setActiveConversationId(cid);
    loadConversationDetail(cid);
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setInputMessage("");
    setAttachedDocs([]);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const toggleAttachDoc = (doc: CorpusDocument) => {
    setAttachedDocs((prev) => {
      const exists = prev.some((d) => d.id === doc.id);
      if (exists) {
        return prev.filter((d) => d.id !== doc.id);
      } else {
        return [...prev, doc];
      }
    });
  };

  const removeAttachedDoc = (docId: string) => {
    setAttachedDocs((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleLocalFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const newDoc: CorpusDocument = {
      id: `local_${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.name.endsWith(".pdf") ? "P&ID / Drawing PDF" : "Uploaded Context File",
      uploadedAt: "Just now",
      chunks: [
        {
          id: `chk_${Date.now()}`,
          text: `User attached document: ${file.name}. Primary engineering context for this reasoning thread.`,
          section: "User Attachment",
          page: 1,
          score: 1.0,
        },
      ],
    };
    setAttachedDocs((prev) => [...prev, newDoc]);
    setAttachMenuOpen(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    // Build user message with attached context prefix if documents are attached
    let promptToSend = query;
    if (attachedDocs.length > 0) {
      const contextPrefix = attachedDocs
        .map((d) => `[ATTACHED CONTEXT: ${d.name} (${d.type})]\n${d.chunks.slice(0, 3).map((c) => c.text).join(" ")}`)
        .join("\n\n");
      promptToSend = `${contextPrefix}\n\n[USER INQUIRY]\n${query}`;
    }

    const userMsg: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setLoading(true);

    try {
      const response = await sendAssistantChatMessage({
        conversation_id: activeConversationId || undefined,
        message: promptToSend,
        model: selectedModel.id,
        mode: deepThink ? "deep_think" : "standard",
        explanation_style: "adaptive",
      });

      if (response) {
        if (!activeConversationId && response.conversation_id) {
          setActiveConversationId(response.conversation_id);
          setConversations((prev) => [
            { conversation_id: response.conversation_id, title: query.slice(0, 36) + "..." },
            ...prev,
          ]);
        }

        const assistantMsg: Message = {
          message_id: response.message_id,
          role: "assistant",
          content: response.answer,
          model_used: response.model_used || selectedModel.name,
          citations: response.citations || [],
          tool_calls: response.tool_calls || [],
          suggested_followups: response.suggested_followups || [],
          requires_approval: response.requires_approval,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error("Error sending message", err);
      const errMsg = err instanceof Error ? err.message : "Unable to reach Axios Assistant Service. Please ensure the backend microservices are running.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errMsg,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = async (messageId: string, rating: number) => {
    try {
      await submitAssistantFeedback(messageId, rating);
      setFeedbackSent((prev) => ({ ...prev, [messageId]: rating }));
    } catch (err) {
      console.error("Feedback submission error", err);
    }
  };

  const togglePlugin = (id: string) => {
    setPluginsState((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-bg-primary text-text-primary font-sans">
      
      {/* Hidden File Input for Custom Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleLocalFileUpload(e.target.files)}
        accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.doc,.docx,.txt"
        className="hidden"
      />

      {/* ══════════════════════════════════════════════════════════════════════
          1. CHAT HISTORY SIDEBAR (Like ChatGPT / Claude Left Drawer)
          ══════════════════════════════════════════════════════════════════════ */}
      {sidebarOpen && (
        <aside className="w-68 shrink-0 border-r border-border-subtle bg-bg-secondary flex flex-col h-full animate-in slide-in-from-left duration-200">
          
          {/* New Chat Button */}
          <div className="p-3 border-b border-border-subtle flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="flex-1 flex items-center justify-between py-2 px-3 bg-bg-primary hover:bg-bg-tertiary border border-border-strong rounded-xl text-xs font-semibold text-text-primary transition-all shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Plus size={15} className="text-[#1F45EC]" />
                <span>New Chat</span>
              </div>
              <kbd className="text-[10px] font-mono text-text-tertiary">⌘O</kbd>
            </button>

            <button
              onClick={() => setSidebarOpen(false)}
              title="Close sidebar"
              className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors cursor-pointer"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-text-tertiary font-bold">
              Recent Sessions
            </div>

            {conversations.length === 0 ? (
              <div className="p-4 text-center text-xs text-text-tertiary">
                No past chat sessions found. Start a new reasoning thread.
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = activeConversationId === conv.conversation_id;
                return (
                  <button
                    key={conv.conversation_id}
                    onClick={() => handleSelectConversation(conv.conversation_id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-2.5 transition-all cursor-pointer group",
                      isActive
                        ? "bg-bg-primary text-text-primary font-semibold shadow-2xs border border-border-subtle"
                        : "text-text-secondary hover:bg-bg-primary/60 hover:text-text-primary"
                    )}
                  >
                    <MessageSquare size={14} className={cn("shrink-0", isActive ? "text-[#1F45EC]" : "text-text-tertiary")} />
                    <span className="truncate flex-1">{conv.title}</span>
                  </button>
                );
              })
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-border-subtle flex items-center justify-between text-xs text-text-tertiary bg-bg-primary/30">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>LangGraph Reasoning v1.0</span>
            </div>
            <button
              onClick={() => setHelpOpen(true)}
              className="p-1 hover:text-text-primary transition-colors cursor-pointer"
              title="Help & Documentation"
            >
              <HelpCircle size={14} />
            </button>
          </div>
        </aside>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          2. MAIN CONVERSATION CANVAS (Claude / ChatGPT Modern Interface)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden bg-bg-primary relative select-text">
        
        {/* Top Floating Control Bar (Model Selector & Plugins) */}
        <header className="h-14 border-b border-border-subtle px-4 sm:px-6 flex items-center justify-between shrink-0 bg-bg-primary/95 backdrop-blur-md z-20">
          
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle when closed */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                title="Open history sidebar"
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors cursor-pointer"
              >
                <PanelLeftOpen size={18} />
              </button>
            )}

            {/* Model Selector Dropdown (Claude / ChatGPT Style) */}
            <div className="relative" ref={modelMenuRef}>
              <button
                onClick={() => setModelDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border-strong hover:border-text-primary bg-bg-secondary hover:bg-bg-primary text-text-primary text-xs font-semibold transition-all shadow-2xs cursor-pointer group"
              >
                <span className="font-semibold text-text-primary">{selectedModel.name}</span>
                <ChevronDown size={13} className={cn("text-text-tertiary transition-transform", modelDropdownOpen && "rotate-180")} />
              </button>

              {/* Model Dropdown Menu */}
              {modelDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 rounded-2xl border border-border-strong bg-bg-primary shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-text-tertiary font-bold border-b border-border-subtle">
                    Select Industrial Reasoning Model
                  </div>
                  <div className="space-y-1 pt-1.5">
                    {AVAILABLE_MODELS.map((model) => (
                      <div
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model);
                          setModelDropdownOpen(false);
                        }}
                        className={cn(
                          "p-2.5 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-2",
                          selectedModel.id === model.id
                            ? "bg-bg-secondary border border-border-subtle"
                            : "hover:bg-bg-secondary/70"
                        )}
                      >
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-text-primary">{model.name}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-bg-tertiary text-text-tertiary border border-border-subtle">
                              {model.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-tertiary leading-tight mt-0.5">
                            {model.description}
                          </p>
                        </div>
                        {selectedModel.id === model.id && (
                          <Check size={14} className="text-[#1F45EC] shrink-0 mt-0.5" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Header Utility Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Plugins Button */}
            <button
              onClick={() => setPluginsOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-subtle hover:border-border-strong bg-bg-secondary hover:bg-bg-primary text-text-secondary hover:text-text-primary text-xs font-medium transition-all shadow-2xs cursor-pointer"
            >
              <Layers size={13} className="text-[#1F45EC]" />
              <span>Plugins</span>
              <span className="text-[10px] font-mono px-1 rounded bg-[#1F45EC]/10 text-[#1F45EC] font-semibold">
                {pluginsState.filter((p) => p.enabled).length}
              </span>
            </button>

            {/* Deep Think Mode Toggle (Claude Style) */}
            <button
              onClick={() => setDeepThink((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs border cursor-pointer",
                deepThink
                  ? "bg-[#1F45EC]/15 border-[#1F45EC] text-[#1F45EC]"
                  : "bg-bg-secondary border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-strong"
              )}
              title="Extended reasoning and multi-pass citation verification"
            >
              <BrainCircuit size={13} className={deepThink ? "text-[#1F45EC]" : "text-text-tertiary"} />
              <span className="hidden sm:inline">Deep Think</span>
              <span className={cn("text-[9px] font-mono px-1 rounded", deepThink ? "bg-[#1F45EC] text-white" : "bg-bg-tertiary text-text-tertiary")}>
                {deepThink ? "ON" : "OFF"}
              </span>
            </button>

            {/* Help Button */}
            <button
              onClick={() => setHelpOpen(true)}
              className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-secondary rounded-xl transition-colors cursor-pointer"
              title="Help & Copilot Shortcuts"
            >
              <HelpCircle size={16} />
            </button>

            {/* New Chat Icon Button */}
            <button
              onClick={handleNewChat}
              className="p-2 rounded-xl border border-border-strong hover:bg-bg-secondary text-text-primary transition-colors cursor-pointer"
              title="Start a new chat session"
            >
              <Plus size={16} />
            </button>
          </div>
        </header>

        {/* ── CHAT FEED CONTAINER ── */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:py-6">
          
          {/* EMPTY STATE: PURE AUTHENTIC AXIOS BRAND MARK IN CENTER (CLEAN & MINIMALIST) */}
          {messages.length === 0 ? (
            <div className="h-full min-h-0 flex flex-col items-center justify-center text-center max-w-xl mx-auto px-4 py-8 animate-in fade-in duration-300">
              
              {/* Authentic Axios Brand Wordmark (No cartoon icons, No big boxes) */}
              <div className="flex flex-col items-center gap-3 select-none">
                <div className="flex items-center gap-3">
                  <span className="text-5xl sm:text-6xl font-bold tracking-[-0.04em] text-[#1F45EC] font-sans lowercase leading-none">
                    axios
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#1F45EC]/10 text-[#1F45EC] border border-[#1F45EC]/20 font-mono text-xs font-bold uppercase tracking-wider">
                    Intelligence
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary max-w-md text-center leading-relaxed">
                  Zero-hallucination industrial assistant. Grounded across primary P&ID drawings, operational sensor loops, and verified engineering procedures.
                </p>
              </div>

            </div>
          ) : (
            /* CONVERSATION MESSAGE STREAM */
            <div className="max-w-3xl mx-auto space-y-6 pb-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-3 text-xs leading-relaxed group",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs select-none",
                      msg.role === "user"
                        ? "bg-[#1F45EC] text-white font-semibold text-xs"
                        : "bg-[#1F45EC] text-white font-bold text-xs font-sans"
                    )}
                  >
                    {msg.role === "user" ? "U" : "a"}
                  </div>

                  {/* Message Bubble & Meta */}
                  <div className={cn("space-y-2 max-w-[85%]", msg.role === "user" ? "items-end" : "items-start")}>
                    
                    {/* Content Box */}
                    <div
                      className={cn(
                        "p-4 rounded-2xl text-xs whitespace-pre-wrap leading-relaxed shadow-xs",
                        msg.role === "user"
                          ? "bg-[#1F45EC] text-white rounded-tr-none font-medium text-sm"
                          : "bg-bg-secondary border border-border-subtle text-text-primary rounded-tl-none"
                      )}
                    >
                      {msg.content}
                    </div>

                    {/* Tool Calls Execution Pill */}
                    {msg.tool_calls && msg.tool_calls.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {msg.tool_calls.map((tc, tIdx) => (
                          <div
                            key={tIdx}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-bg-secondary border border-border-subtle flex items-center gap-1.5 text-text-secondary"
                          >
                            <Zap size={10} className="text-[#1F45EC]" />
                            <span>Tool: {tc.tool_name}</span>
                            <span className="text-text-tertiary">({tc.latency_seconds}s)</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Grounded Primary Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="p-3 rounded-xl border border-border-subtle bg-bg-secondary/40 space-y-1.5 text-xs">
                        <div className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider flex items-center gap-1.5 font-bold">
                          <FileText size={11} className="text-[#1F45EC]" />
                          <span>Grounded Sources ({msg.citations.length})</span>
                        </div>
                        <div className="space-y-1.5">
                          {msg.citations.map((c, cIdx) => (
                            <div key={cIdx} className="text-[11px] bg-bg-primary p-2.5 rounded-lg border border-border-subtle">
                              <span className="font-semibold text-text-primary block">{c.source_title}</span>
                              <span className="text-[10px] text-text-tertiary block mt-0.5">{c.snippet}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Follow-Ups */}
                    {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggested_followups.map((sf, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sf)}
                            className="px-3 py-1 rounded-full text-[11px] bg-bg-secondary border border-border-subtle hover:border-[#1F45EC] hover:text-[#1F45EC] transition-colors text-text-secondary cursor-pointer shadow-2xs"
                          >
                            → {sf}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Assistant Feedback & Copy Controls */}
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-text-tertiary">
                        <button
                          onClick={() => handleCopy(msg.content, msg.message_id || String(idx))}
                          className="flex items-center gap-1 hover:text-text-primary transition-colors cursor-pointer"
                        >
                          {copiedId === (msg.message_id || String(idx)) ? (
                            <>
                              <Check size={12} className="text-emerald-500" />
                              <span className="text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => msg.message_id && handleFeedback(msg.message_id, 5)}
                          className={cn(
                            "hover:text-[#1F45EC] transition-colors cursor-pointer",
                            msg.message_id && feedbackSent[msg.message_id] === 5 && "text-[#1F45EC]"
                          )}
                          title="Good response"
                        >
                          <ThumbsUp size={12} />
                        </button>

                        <button
                          onClick={() => msg.message_id && handleFeedback(msg.message_id, 1)}
                          className={cn(
                            "hover:text-status-error transition-colors cursor-pointer",
                            msg.message_id && feedbackSent[msg.message_id] === 1 && "text-status-error"
                          )}
                          title="Bad response"
                        >
                          <ThumbsDown size={12} />
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              ))}

              {/* Streaming / Loading Indicator */}
              {loading && (
                <div className="flex gap-3 text-xs">
                  <div className="w-8 h-8 rounded-full bg-[#1F45EC] text-white font-bold text-xs font-sans flex items-center justify-center shadow-xs select-none">
                    a
                  </div>
                  <div className="p-4 rounded-2xl bg-bg-secondary border border-border-subtle text-text-secondary flex items-center gap-2 shadow-xs">
                    <div className="w-2 h-2 rounded-full bg-[#1F45EC] animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-[#1F45EC] animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-[#1F45EC] animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] font-mono text-text-tertiary ml-1">
                      Reasoning across industrial knowledge graph...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            3. FLOATING PROMPT INPUT BOX (Claude / ChatGPT Rounded Floating Card)
            ══════════════════════════════════════════════════════════════════════ */}
        <div className="p-3 sm:p-4 pt-1 bg-bg-primary shrink-0 border-t border-border-subtle/50 z-20">
          <div className="max-w-3xl mx-auto flex flex-col gap-1.5">
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex flex-col rounded-md border border-border-strong bg-bg-primary shadow-xs hover:border-text-primary focus-within:border-[#1F45EC] focus-within:ring-1 focus-within:ring-[#1F45EC]/30 transition-all p-3"
            >
              {/* Attached Context Document Chips */}
              {attachedDocs.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pb-2 border-b border-border-subtle/50 mb-1.5">
                  <span className="text-[10px] font-mono text-text-tertiary font-bold uppercase tracking-wider">
                    Context:
                  </span>
                  {attachedDocs.map((doc) => (
                    <span
                      key={doc.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#1F45EC]/10 text-[#1F45EC] border border-[#1F45EC]/25 text-xs font-semibold animate-in fade-in zoom-in-95 duration-100"
                    >
                      <FileText size={12} />
                      <span className="truncate max-w-[180px]">{doc.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachedDoc(doc.id)}
                        className="hover:text-status-error ml-0.5 cursor-pointer text-text-tertiary hover:text-red-500"
                        title="Remove attached document"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Multi-line auto-expanding textarea */}
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  attachedDocs.length > 0
                    ? `Ask anything grounded in ${attachedDocs.map((d) => d.name).join(", ")}...`
                    : "Ask Axios anything about plant equipment, SOPs, compliance, or maintenance..."
                }
                disabled={loading}
                className="w-full bg-transparent resize-none text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none max-h-36 min-h-[38px] py-1 px-1 leading-relaxed"
              />

              {/* Bottom Input Utilities Row */}
              <div className="flex items-center justify-between pt-2 border-t border-border-subtle/50 text-xs">
                
                {/* Left tools inside input */}
                <div className="flex items-center gap-2">
                  
                  {/* REAL CONTEXT ATTACHMENT POPOVER */}
                  <div className="relative" ref={attachMenuRef}>
                    <button
                      type="button"
                      onClick={() => setAttachMenuOpen((v) => !v)}
                      className={cn(
                        "p-1.5 rounded-sm transition-all cursor-pointer flex items-center gap-1",
                        attachedDocs.length > 0
                          ? "text-[#1F45EC] bg-[#1F45EC]/10 font-bold"
                          : "text-text-tertiary hover:text-text-primary hover:bg-bg-secondary"
                      )}
                      title="Attach primary engineering documents from knowledge corpus"
                    >
                      <Paperclip size={14} />
                      {attachedDocs.length > 0 && (
                        <span className="text-[10px] font-mono">{attachedDocs.length}</span>
                      )}
                    </button>

                    {/* Popover Menu Anchored to Paperclip */}
                    {attachMenuOpen && (
                      <div className="absolute bottom-full left-0 mb-2 w-80 sm:w-96 rounded-md border border-border-strong bg-bg-primary shadow-xl p-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                          <div className="flex items-center gap-2">
                            <Database size={14} className="text-[#1F45EC]" />
                            <span className="text-xs font-bold text-text-primary">
                              Attach Knowledge Context
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAttachMenuOpen(false)}
                            className="p-1 text-text-tertiary hover:text-text-primary rounded cursor-pointer"
                          >
                            <X size={13} />
                          </button>
                        </div>

                        <p className="text-[11px] text-text-tertiary my-2">
                          Select primary engineering documents to ground this chat thread:
                        </p>

                        {/* List of existing knowledge corpus documents */}
                        <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                          {corpusDocs.map((doc) => {
                            const isAttached = attachedDocs.some((d) => d.id === doc.id);
                            return (
                              <div
                                key={doc.id}
                                onClick={() => toggleAttachDoc(doc)}
                                className={cn(
                                  "p-2.5 rounded-sm border transition-all cursor-pointer flex items-center justify-between gap-2.5",
                                  isAttached
                                    ? "bg-[#1F45EC]/10 border-[#1F45EC]/30 text-[#1F45EC]"
                                    : "bg-bg-secondary border-border-subtle hover:border-border-strong text-text-primary"
                                )}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <FileText size={15} className={isAttached ? "text-[#1F45EC]" : "text-text-tertiary"} />
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-semibold truncate max-w-[210px]">
                                      {doc.name}
                                    </span>
                                    <span className="text-[10px] font-mono text-text-tertiary truncate">
                                      {doc.type} · {doc.size}
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className={cn(
                                    "w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors",
                                    isAttached
                                      ? "bg-[#1F45EC] border-[#1F45EC] text-white"
                                      : "border-border-strong bg-bg-primary"
                                  )}
                                >
                                  {isAttached && <Check size={11} strokeWidth={3} />}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Upload local file */}
                        <div className="pt-2.5 mt-2 border-t border-border-subtle flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs font-medium text-accent hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Upload size={12} />
                            <span>Upload custom file</span>
                          </button>
                          <span className="text-[10px] font-mono text-text-tertiary">
                            {attachedDocs.length} selected
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-tertiary">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="hidden sm:inline">
                      {connectedToolCount > 0
                        ? `${connectedToolCount} MCP${connectedToolCount > 1 ? "s" : ""} Linked`
                        : "Knowledge Grounded"}
                    </span>
                  </div>
                </div>

                {/* Right Send Button (Crisp rounded-sm) */}
                <button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className={cn(
                    "w-8 h-8 rounded-sm flex items-center justify-center transition-all cursor-pointer shadow-xs",
                    inputMessage.trim() && !loading
                      ? "bg-[#1F45EC] text-white hover:bg-[#1839C5] scale-100"
                      : "bg-bg-tertiary text-text-tertiary opacity-40 cursor-not-allowed"
                  )}
                >
                  <ArrowUp size={16} strokeWidth={2.5} />
                </button>
              </div>
            </form>

            {/* Disclaimer Footer */}
            <p className="text-[10px] sm:text-[11px] text-center text-text-tertiary">
              Axios grounds every answer against verified primary engineering documents and sensor telemetry.
            </p>

          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. PLUGINS MODAL
          ══════════════════════════════════════════════════════════════════════ */}
      {pluginsOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-primary border border-border-strong rounded-2xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-[#1F45EC]" />
                <h3 className="text-sm font-bold text-text-primary">Connected Industrial Plugins</h3>
              </div>
              <button
                onClick={() => setPluginsOpen(false)}
                className="p-1 rounded text-text-tertiary hover:text-text-primary cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3">
              {pluginsState.map((plugin) => (
                <div
                  key={plugin.id}
                  onClick={() => togglePlugin(plugin.id)}
                  className="p-3 rounded-xl border border-border-subtle hover:border-border-strong bg-bg-secondary flex items-start justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-text-primary">{plugin.name}</span>
                    <span className="text-[11px] text-text-tertiary mt-0.5">{plugin.desc}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={plugin.enabled}
                    onChange={() => {}}
                    className="w-4 h-4 accent-[#1F45EC] rounded mt-0.5 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setPluginsOpen(false)}
              className="w-full py-2 bg-text-primary text-bg-primary rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          5. HELP & SHORTCUTS MODAL
          ══════════════════════════════════════════════════════════════════════ */}
      {helpOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-primary border border-border-strong rounded-2xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <HelpCircle size={16} className="text-[#1F45EC]" />
                <h3 className="text-sm font-bold text-text-primary">Workforce Copilot Help</h3>
              </div>
              <button
                onClick={() => setHelpOpen(false)}
                className="p-1 rounded text-text-tertiary hover:text-text-primary cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
              <p>
                <strong>What is Axios Workforce Copilot?</strong><br />
                An autonomous reasoning assistant that accesses verified plant P&IDs, SCADA telemetry, and safety guidelines to answer operational queries without hallucinations.
              </p>
              <div className="pt-2 border-t border-border-subtle font-mono text-[11px] space-y-1">
                <div><kbd className="px-1.5 py-0.5 rounded bg-bg-secondary border border-border-strong">Enter</kbd> Send prompt</div>
                <div><kbd className="px-1.5 py-0.5 rounded bg-bg-secondary border border-border-strong">Shift + Enter</kbd> Insert line break</div>
                <div><kbd className="px-1.5 py-0.5 rounded bg-bg-secondary border border-border-strong">Alt + C</kbd> Quick launch copilot anywhere</div>
              </div>
            </div>

            <button
              onClick={() => setHelpOpen(false)}
              className="w-full py-2 bg-text-primary text-bg-primary rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
