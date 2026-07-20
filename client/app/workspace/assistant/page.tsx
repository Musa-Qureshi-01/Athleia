"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  Plus,
  MessageSquare,
  Sparkles,
  Zap,
  BrainCircuit,
  SlidersHorizontal,
  ThumbsUp,
  ThumbsDown,
  FileText,
  ShieldCheck,
  Wrench,
  User,
  Cpu,
  Layers,
  Activity,
  Maximize2,
  Terminal,
} from "lucide-react";
import {
  sendAssistantChatMessage,
  fetchAssistantConversations,
  fetchAssistantConversationDetail,
  fetchAssistantModels,
  submitAssistantFeedback,
} from "@/lib/api";
import { FormalDropdown, DropdownOption } from "@/components/ui/FormalDropdown";
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

export default function WorkforceCopilotPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("auto");
  const [mode, setMode] = useState<"standard" | "deep_think">("standard");
  const [explanationStyle, setExplanationStyle] = useState("adaptive");
  const [feedbackSent, setFeedbackSent] = useState<Record<string, number>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
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
    }
    init();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await sendAssistantChatMessage({
        conversation_id: activeConversationId || undefined,
        message: query,
        model: selectedModel,
        mode,
        explanation_style: explanationStyle,
      });

      if (response) {
        if (!activeConversationId && response.conversation_id) {
          setActiveConversationId(response.conversation_id);
          setConversations((prev) => [
            { conversation_id: response.conversation_id, title: query.slice(0, 32) + "..." },
            ...prev,
          ]);
        }

        const assistantMsg: Message = {
          message_id: response.message_id,
          role: "assistant",
          content: response.answer,
          model_used: response.model_used,
          citations: response.citations || [],
          tool_calls: response.tool_calls || [],
          suggested_followups: response.suggested_followups || [],
          requires_approval: response.requires_approval,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error("Error sending message", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Unable to reach Athleia Assistant Service. Please ensure the service on Port 8010 is active.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (messageId: string, rating: number) => {
    try {
      await submitAssistantFeedback(messageId, rating);
      setFeedbackSent((prev) => ({ ...prev, [messageId]: rating }));
    } catch (err) {
      console.error("Feedback submission error", err);
    }
  };

  // Dropdown Options
  const MODEL_OPTIONS: DropdownOption[] = [
    { value: "auto", label: "Auto Task Router", description: "Dynamically picks optimal LLM per task", badge: "Smart", icon: Cpu },
    { value: "groq/llama-3.3-70b-versatile", label: "Groq Llama 3.3 70B", description: "Ultra-low latency fast response", badge: "Fast", icon: Zap },
    { value: "gemini/gemini-2.5-flash", label: "Gemini 2.5 Flash", description: "Search synthesis & documentation", badge: "Search", icon: Search },
    { value: "openrouter/anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet", description: "Deep reasoning & root-cause analysis", badge: "Reasoning", icon: BrainCircuit },
    { value: "openrouter/deepseek/deepseek-r1", label: "DeepSeek R1", description: "SOP & technical script QA", badge: "Code", icon: Terminal },
    { value: "ollama/llama3.1", label: "Local Ollama", description: "Offline local model execution", badge: "Offline", icon: Layers },
  ];

  const STYLE_OPTIONS: DropdownOption[] = [
    { value: "adaptive", label: "Adaptive Style", description: "Auto-adapts vocabulary to user role" },
    { value: "beginner", label: "Beginner", description: "Simple terms & clear analogies" },
    { value: "technician", label: "Technician", description: "Step-by-step SOP & physical observation" },
    { value: "engineer", label: "Engineer", description: "Thermodynamics, formulas & MTBF metrics" },
    { value: "manager", label: "Manager", description: "Risk, compliance & downtime summary" },
  ];

  const QUICK_PROMPTS = [
    { label: "Troubleshoot Cooling Pump Pressure Drop", icon: Wrench, query: "How do I troubleshoot cooling pump pressure drops?" },
    { label: "ISO 45001 Safety Lockout Procedure", icon: ShieldCheck, query: "Explain the ISO 45001 lockout and tagout procedure." },
    { label: "Predictive Maintenance Audit Status", icon: Cpu, query: "What are the latest predictive maintenance findings?" },
    { label: "Convert 150 PSI to bar", icon: SlidersHorizontal, query: "Convert 150 PSI to bar." },
  ];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-bg-primary text-text-primary">
      {/* ── LEFT SIDEBAR: Sessions Drawer ── */}
      <div className="w-64 shrink-0 border-r border-border-subtle bg-bg-secondary flex flex-col h-full">
        {/* New Chat Header */}
        <div className="p-3 border-b border-border-subtle">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-accent text-white rounded-sm text-xs font-medium hover:bg-accent/90 transition-colors shadow-xs"
          >
            <Plus size={14} />
            <span>New Copilot Session</span>
          </button>
        </div>

        {/* Conversation Sessions */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-text-tertiary">
            Workforce Sessions
          </div>
          {conversations.length === 0 ? (
            <div className="p-3 text-center text-xs text-text-tertiary">
              No previous chat sessions.
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.conversation_id}
                onClick={() => handleSelectConversation(conv.conversation_id)}
                className={cn(
                  "w-full text-left p-2.5 rounded-sm text-xs flex items-center gap-2 transition-colors border",
                  activeConversationId === conv.conversation_id
                    ? "bg-bg-primary text-text-primary font-medium border-border-subtle shadow-2xs"
                    : "border-transparent text-text-secondary hover:bg-bg-primary/50 hover:text-text-primary"
                )}
              >
                <MessageSquare size={13} className="shrink-0 text-accent" />
                <span className="truncate flex-1">{conv.title}</span>
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-border-subtle text-[10px] font-mono text-text-tertiary flex items-center justify-between bg-bg-primary/40">
          <span>Port 8010 • LangGraph</span>
          <span className="text-accent font-semibold">v1.0.0</span>
        </div>
      </div>

      {/* ── MAIN CONTENT: Chat Area ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-bg-primary">
        {/* Formal Top Control Toolbar */}
        <div className="h-13 border-b border-border-subtle px-4 flex items-center justify-between bg-bg-secondary shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Bot size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-text-primary leading-none">Athleia Workforce Copilot</span>
              <span className="text-[10px] font-mono text-text-tertiary mt-0.5">Industrial Knowledge Intelligence</span>
            </div>
          </div>

          {/* Formal Controls */}
          <div className="flex items-center gap-3">
            {/* Explanation Style Formal Dropdown */}
            <FormalDropdown
              label="Style"
              options={STYLE_OPTIONS}
              value={explanationStyle}
              onChange={setExplanationStyle}
            />

            {/* Model Selector Formal Dropdown */}
            <FormalDropdown
              label="LLM Provider"
              options={MODEL_OPTIONS}
              value={selectedModel}
              onChange={setSelectedModel}
            />

            {/* Deep Think Mode Toggle */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider mb-1">Reasoning</span>
              <button
                onClick={() => setMode((m) => (m === "standard" ? "deep_think" : "standard"))}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-mono transition-all border shadow-2xs",
                  mode === "deep_think"
                    ? "bg-accent/15 border-accent text-accent font-medium"
                    : "bg-bg-primary border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-strong"
                )}
                title="Deep Think mode performs multi-pass reasoning and extended retrieval"
              >
                <BrainCircuit size={13} className={cn(mode === "deep_think" && "text-accent")} />
                <span>{mode === "deep_think" ? "Deep Think ON" : "Standard"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6">
              <div className="w-12 h-12 rounded-sm bg-bg-secondary border border-border-strong flex items-center justify-center text-accent shadow-xs">
                <Bot size={26} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-text-primary">
                  How can Workforce Copilot assist your operations?
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed max-w-md mx-auto">
                  Ask plant technical queries, troubleshoot machinery, check compliance ISO guidelines, or query predictive maintenance ledgers. Grounded in enterprise knowledge.
                </p>
              </div>

              {/* Quick Prompt Cards */}
              <div className="grid grid-cols-2 gap-2.5 w-full text-left">
                {QUICK_PROMPTS.map((qp, idx) => {
                  const IconComponent = qp.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(qp.query)}
                      className="p-3 rounded-sm border border-border-subtle bg-bg-secondary hover:bg-bg-primary hover:border-accent/40 transition-all text-xs flex flex-col gap-1.5 group shadow-2xs"
                    >
                      <div className="flex items-center gap-2 text-accent">
                        <IconComponent size={14} />
                        <span className="font-medium truncate">{qp.label}</span>
                      </div>
                      <span className="text-[11px] text-text-tertiary line-clamp-2 leading-tight">
                        {qp.query}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex gap-3 max-w-3xl mx-auto text-xs leading-relaxed",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "w-7 h-7 rounded-sm flex items-center justify-center shrink-0 text-xs font-mono shadow-2xs",
                    msg.role === "user" ? "bg-accent text-white" : "bg-bg-secondary border border-border-subtle text-accent"
                  )}
                >
                  {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Content Bubble */}
                <div className="flex-1 space-y-2 max-w-[85%]">
                  <div
                    className={cn(
                      "p-3.5 rounded-sm border text-xs whitespace-pre-wrap leading-relaxed shadow-2xs",
                      msg.role === "user"
                        ? "bg-accent/10 border-accent/30 text-text-primary"
                        : "bg-bg-secondary border-border-subtle text-text-primary"
                    )}
                  >
                    {msg.content}
                  </div>

                  {/* Tool Audit Pills */}
                  {msg.tool_calls && msg.tool_calls.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.tool_calls.map((tc, tIdx) => (
                        <div
                          key={tIdx}
                          className="px-2 py-0.5 rounded-sm text-[10px] font-mono bg-bg-secondary border border-border-subtle flex items-center gap-1 text-text-secondary"
                        >
                          <Zap size={10} className="text-accent" />
                          <span>Tool: {tc.tool_name}</span>
                          <span className="text-text-tertiary">({tc.latency_seconds}s)</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Citations Accordion */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="p-2.5 rounded-sm border border-border-subtle bg-bg-secondary/50 space-y-1.5">
                      <div className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider flex items-center gap-1">
                        <FileText size={11} className="text-accent" />
                        <span>Enterprise Grounding Sources ({msg.citations.length})</span>
                      </div>
                      <div className="space-y-1">
                        {msg.citations.map((c, cIdx) => (
                          <div key={cIdx} className="text-[11px] text-text-secondary bg-bg-primary p-2 rounded-sm border border-border-subtle">
                            <span className="font-medium text-text-primary block">{c.source_title}</span>
                            <span className="text-[10px] text-text-tertiary block mt-0.5">{c.snippet}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Suggestions */}
                  {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggested_followups.map((sf, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(sf)}
                          className="px-2.5 py-1 rounded-full text-[11px] bg-bg-secondary border border-border-subtle hover:border-accent hover:text-accent transition-colors text-text-secondary"
                        >
                          → {sf}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Feedback Controls */}
                  {msg.role === "assistant" && msg.message_id && (
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-text-tertiary">
                      <span>Was this helpful?</span>
                      <button
                        onClick={() => handleFeedback(msg.message_id!, 5)}
                        className={cn(
                          "p-1 hover:text-accent transition-colors",
                          feedbackSent[msg.message_id] === 5 && "text-accent font-bold"
                        )}
                      >
                        <ThumbsUp size={12} />
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.message_id!, 1)}
                        className={cn(
                          "p-1 hover:text-status-error transition-colors",
                          feedbackSent[msg.message_id] === 1 && "text-status-error font-bold"
                        )}
                      >
                        <ThumbsDown size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Input Footer */}
        <div className="p-3 border-t border-border-subtle bg-bg-secondary shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-3xl mx-auto flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Workforce Copilot about plant equipment, SOPs, compliance, or maintenance..."
              disabled={loading}
              className="flex-1 bg-bg-primary border border-border-subtle rounded-sm px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-4 py-2.5 bg-accent text-white rounded-sm text-xs font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Send</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
