"use client";

import { useState } from "react";
import {
  Cpu,
  CheckCircle2,
  FileText,
  CornerDownLeft,
  Scale,
  Brain,
  ShieldCheck,
  Tag,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { executeReasoning, ReasoningResponseData } from "@/lib/api";

const SAMPLE_QUERIES = [
  "What is the suction pressure for Pump P-101A monitored by PT-101?",
  'Which valve isolates process line 6"-CW-101-CS150?',
  "What pre-start verifications are required before starting Pump P-101A?",
];

export default function IntelligencePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<ReasoningResponseData | null>(null);

  const handleReasoningExecute = async (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await executeReasoning({
        query: q,
        allow_external_knowledge: false,
      });
      setResult(data);
    } catch (err: unknown) {
      console.error("Reasoning API error:", err);
      setErrorMsg("Failed to connect to Reasoning Service via API Gateway. Ensure Gateway (8000) or Reasoning Service (8002) is running.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleReasoningExecute(query);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="flex flex-col gap-1">
          <span className="text-label text-text-tertiary">Reasoning Engine & Evaluation</span>
          <h1 className="text-heading-1 text-text-primary">
            Grounded Industrial Intelligence
          </h1>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-bg-secondary border border-border-subtle text-xs text-text-secondary">
          <Cpu size={14} className="text-text-tertiary" />
          <span className="text-mono">Gateway API: http://localhost:8000</span>
        </div>
      </div>

      {/* Main Reasoning Input */}
      <form onSubmit={handleQuerySubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 p-4 rounded-sm border border-border-strong bg-bg-secondary focus-within:border-accent transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-primary flex items-center gap-1.5">
              <Brain size={14} className="text-accent" />
              Operational Inquiry
            </span>
            <span className="text-mono text-[10px] text-text-tertiary">
              Policy: Zero External Knowledge
            </span>
          </div>

          <textarea
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask an engineering question (e.g., What is the suction pressure for Pump P-101A?)"
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none resize-none py-1"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border-subtle">
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-tertiary hidden sm:inline-block">Sample:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {SAMPLE_QUERIES.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(q);
                      handleReasoningExecute(q);
                    }}
                    className="text-[11px] text-text-secondary hover:text-text-primary px-2 py-0.5 rounded bg-bg-primary border border-border-subtle truncate max-w-[220px]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-8 px-4 rounded-sm bg-text-primary text-bg-primary text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Reasoning...</span>
                </>
              ) : (
                <>
                  <span>Execute Reasoning</span>
                  <CornerDownLeft size={12} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-sm border border-status-error/30 bg-status-error/10 text-xs text-status-error flex items-center justify-between">
          <span>{errorMsg}</span>
          <span className="font-mono text-[10px]">HTTP Endpoint: /api/v1/reason/reason</span>
        </div>
      )}

      {/* Reasoning Layout Grid: Answer + Evaluation & Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Answer Area (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="p-6 rounded-sm border border-border-subtle bg-bg-primary min-h-[320px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: result
                      ? "var(--status-verified)"
                      : "var(--text-tertiary)",
                  }}
                />
                <span className="text-xs font-medium text-text-primary">
                  {result ? "Grounded Reasoning Output" : "Awaiting Inquiry"}
                </span>
              </div>
              <span className="text-mono text-xs text-text-tertiary">
                {result ? `${result.citations?.length || 0} Citations` : "0 Citations"}
              </span>
            </div>

            {result ? (
              <div className="my-4 flex flex-col gap-4">
                <p className="text-sm text-text-primary leading-relaxed">
                  {result.grounded_answer}
                </p>

                {result.citations && result.citations.length > 0 && (
                  <div className="p-4 rounded-sm bg-bg-secondary border border-border-subtle flex flex-col gap-2">
                    <span className="text-xs font-medium text-text-primary flex items-center gap-1.5">
                      <Tag size={13} className="text-accent" />
                      Citation Provenance
                    </span>
                    {result.citations.map((cite, idx) => (
                      <div key={idx} className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-accent font-medium">{cite.citation_id}</span>
                          <span className="font-medium text-text-primary">{cite.source_name}</span>
                          <span className="text-mono text-text-tertiary">Page {cite.page_number}</span>
                        </div>
                        <span className="text-mono text-[11px] text-text-secondary">{cite.section_path}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-4">
                <Cpu size={32} className="text-text-tertiary stroke-[1.25] mb-3" />
                <h3 className="text-sm font-medium text-text-primary mb-1">
                  Awaiting reasoning query
                </h3>
                <p className="text-xs text-text-secondary max-w-md leading-relaxed">
                  Submit an operational question above or click a sample query chip. The reasoning service executes live LLM dispatches, evaluates evidence chunks, and returns verified answers with page-level citations.
                </p>
              </div>
            )}

            {/* Footer Policy Reminder */}
            <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-mono text-[11px] text-text-tertiary">
              <span>Strict Honesty Policy Enforced</span>
              <span>No Evidence → Insufficient Grounded Evidence</span>
            </div>
          </div>
        </div>

        {/* Right: Evaluation & Metrics Area (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Verification Evaluation Metrics */}
          <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-primary font-mono">Evaluation Scorecard</span>
              <Scale size={14} className="text-text-tertiary" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-sm bg-bg-primary border border-border-subtle flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-text-primary">Grounding Score</span>
                  <span className="text-[10px] text-text-tertiary">Statement-level claim validation</span>
                </div>
                <span className="text-mono text-sm font-semibold text-status-verified">
                  {result?.evaluation?.grounding_score !== undefined
                    ? result.evaluation.grounding_score
                    : "—"}
                </span>
              </div>

              <div className="p-3 rounded-sm bg-bg-primary border border-border-subtle flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-text-primary">Faithfulness Score</span>
                  <span className="text-[10px] text-text-tertiary">Premise-to-conclusion consistency</span>
                </div>
                <span className="text-mono text-sm font-semibold text-status-verified">
                  {result?.evaluation?.faithfulness_score !== undefined
                    ? result.evaluation.faithfulness_score
                    : "—"}
                </span>
              </div>

              <div className="p-3 rounded-sm bg-bg-primary border border-border-subtle flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-text-primary">Overall Confidence</span>
                  <span className="text-[10px] text-text-tertiary">Composite probability metric</span>
                </div>
                <span className="text-mono text-sm font-semibold text-accent">
                  {result?.evaluation?.overall_confidence !== undefined
                    ? result.evaluation.overall_confidence
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Airgap Security Summary */}
          <div className="p-5 rounded-sm border border-border-subtle bg-bg-primary flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-status-verified" />
              <span className="text-xs font-medium text-text-primary">VPC Airgap Protection</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Reasoning dispatches verify citations against stored document SHA-256 hashes inside your perimeter via API Gateway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
