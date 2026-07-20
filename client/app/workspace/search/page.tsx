"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  FileText,
  Tag,
  Database,
  Info,
  CornerDownLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { executeSearch, RetrievalResultItem } from "@/lib/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [hybridWeight, setHybridWeight] = useState(0.5); // 0.0 BM25 <-> 1.0 Vector
  const [tagBoost, setTagBoost] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [results, setResults] = useState<RetrievalResultItem[]>([]);
  const [selectedResult, setSelectedResult] = useState<RetrievalResultItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) return;

    setLoading(true);
    setErrorMsg(null);
    setHasSearched(true);

    try {
      const data = await executeSearch({
        query: q,
        search_type: "HYBRID",
        top_k: 10,
      });

      setResults(data.results || []);
      if (data.results && data.results.length > 0) {
        setSelectedResult(data.results[0]);
      } else {
        setSelectedResult(null);
      }
    } catch (err: unknown) {
      console.error("Search API error:", err);
      setErrorMsg("Failed to connect to Retrieval Service via API Gateway. Ensure gateway (8000) or retrieval service (8001) is running.");
      setResults([]);
      setSelectedResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="flex flex-col gap-1">
          <span className="text-label text-text-tertiary">Hybrid Retrieval Engine</span>
          <h1 className="text-heading-1 text-text-primary">
            Semantic & Keyword Search
          </h1>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-bg-secondary border border-border-subtle text-xs text-text-secondary">
          <Database size={14} className="text-text-tertiary" />
          <span className="text-mono">Gateway API: http://localhost:8000</span>
        </div>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
        <div className="relative flex items-center">
          <Search size={20} className="absolute left-4 text-text-tertiary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search equipment tags (PT-101, P-101A), suction pressure, or SOP steps..."
            className="w-full h-14 pl-12 pr-32 rounded-sm text-sm text-text-primary bg-bg-secondary border border-border-strong focus:border-accent focus:bg-bg-primary outline-none transition-colors duration-150 placeholder:text-text-tertiary"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2.5 h-9 px-5 rounded-sm bg-text-primary text-bg-primary text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span>Search</span>
                <CornerDownLeft size={12} />
              </>
            )}
          </button>
        </div>

        {/* Search Parameters Controls */}
        <div className="p-4 rounded-sm border border-border-subtle bg-bg-secondary flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Hybrid Weight Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-secondary font-medium">Fusion Balance:</span>
              <div className="flex items-center gap-2 text-mono text-xs text-text-tertiary">
                <span className={hybridWeight < 0.5 ? "text-text-primary font-medium" : ""}>
                  BM25 Keyword
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={hybridWeight}
                  onChange={(e) => setHybridWeight(parseFloat(e.target.value))}
                  className="w-24 accent-accent cursor-pointer"
                />
                <span className={hybridWeight > 0.5 ? "text-text-primary font-medium" : ""}>
                  Dense Vector
                </span>
              </div>
            </div>

            {/* Tag Exact Match Boost Toggle */}
            <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={tagBoost}
                onChange={(e) => setTagBoost(e.target.checked)}
                className="rounded-xs border-border-strong text-accent focus:ring-0"
              />
              <span>Equipment Tag Exact-Match Boost</span>
            </label>
          </div>

          <div className="text-mono text-[11px] text-text-tertiary">
            Algorithm: Reciprocal Rank Fusion (RRF)
          </div>
        </div>
      </form>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-text-tertiary">Popular queries:</span>
        {[
          "What is the suction pressure for Pump P-101A?",
          "PT-101",
          "CW-101 isolation valve",
          "P-101A pre-start checklist",
        ].map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => {
              setQuery(sample);
              performSearch(sample);
            }}
            className="px-2.5 py-1 rounded bg-bg-secondary hover:bg-bg-tertiary border border-border-subtle text-text-secondary hover:text-text-primary text-xs transition-colors"
          >
            {sample}
          </button>
        ))}
      </div>

      {/* Error Alert if Service Unreachable */}
      {errorMsg && (
        <div className="p-4 rounded-sm border border-status-error/30 bg-status-error/10 text-xs text-status-error flex items-center justify-between">
          <span>{errorMsg}</span>
          <span className="font-mono text-[10px]">HTTP Endpoint: /api/v1/retrieve/search</span>
        </div>
      )}

      {/* Search Layout Grid: Results + Evidence Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Results Container (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-primary">
              Retrieved Passages
            </span>
            <span className="text-mono text-xs text-text-tertiary">
              {results.length} Chunks Returned
            </span>
          </div>

          {results.length > 0 ? (
            <div className="flex flex-col gap-3">
              {results.map((res, idx) => {
                const isSelected = selectedResult?.chunk_id === res.chunk_id;

                return (
                  <div
                    key={res.chunk_id || idx}
                    onClick={() => setSelectedResult(res)}
                    className={cn(
                      "p-4 rounded-sm border transition-all cursor-pointer flex flex-col gap-2.5",
                      isSelected
                        ? "border-accent bg-bg-primary shadow-sm"
                        : "border-border-subtle bg-bg-secondary hover:border-border-strong hover:bg-bg-primary"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText size={15} className="text-accent shrink-0" />
                        <span className="text-xs font-medium text-text-primary truncate">
                          {res.document_name}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-bg-tertiary border border-border-subtle text-[10px] text-mono text-text-secondary">
                          Page {res.page_number}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-mono text-xs">
                        <span className="text-text-tertiary text-[11px]">RRF Score:</span>
                        <span className="font-semibold text-accent">
                          {(res.score ?? 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                      {res.content}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-[11px] text-text-tertiary">
                      <span className="text-mono truncate">{res.section_path}</span>
                      <div className="flex items-center gap-3 text-mono text-[10px]">
                        {res.bm25_score !== undefined && <span>BM25: {res.bm25_score.toFixed(2)}</span>}
                        {res.vector_score !== undefined && <span>Vector: {res.vector_score.toFixed(2)}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-border-subtle rounded-sm bg-bg-primary min-h-[320px] flex flex-col items-center justify-center p-8 text-center">
              <div className="p-4 rounded-full bg-bg-secondary border border-border-subtle mb-3">
                <Search size={28} className="text-text-tertiary stroke-[1.25]" />
              </div>
              <h3 className="text-sm font-medium text-text-primary mb-1">
                {hasSearched ? `No matching passages for "${query}"` : "Ready for query input"}
              </h3>
              <p className="text-xs text-text-secondary max-w-sm mb-6 leading-relaxed">
                {hasSearched
                  ? `No passages in your index matched "${query}". Ensure the Retrieval Service (8001) has documents indexed.`
                  : "Enter any search query above to execute live hybrid search via API Gateway."}
              </p>
              <div className="flex items-center gap-2 text-mono text-xs text-text-tertiary">
                <Info size={13} />
                <span>API Gateway (8000) → Retrieval Microservice (8001)</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Evidence Inspection Panel (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-primary">Evidence Provenance</span>
              <Tag size={14} className="text-text-tertiary" />
            </div>

            {selectedResult ? (
              <div className="flex flex-col gap-3 text-xs">
                <div className="p-3 rounded-sm bg-bg-primary border border-border-subtle flex flex-col gap-1">
                  <span className="text-[10px] text-text-tertiary uppercase tracking-wider font-mono">Source File</span>
                  <span className="font-medium text-text-primary">{selectedResult.document_name}</span>
                </div>

                <div className="p-3 rounded-sm bg-bg-primary border border-border-subtle flex flex-col gap-1">
                  <span className="text-[10px] text-text-tertiary uppercase tracking-wider font-mono">Section Path</span>
                  <span className="text-text-primary font-mono text-xs">{selectedResult.section_path}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-sm bg-bg-primary border border-border-subtle flex flex-col">
                    <span className="text-[10px] text-text-tertiary font-mono">Page Number</span>
                    <span className="text-xs font-medium text-text-primary">Page {selectedResult.page_number}</span>
                  </div>
                  <div className="p-2.5 rounded-sm bg-bg-primary border border-border-subtle flex flex-col">
                    <span className="text-[10px] text-text-tertiary font-mono font-semibold">RRF Score</span>
                    <span className="text-xs font-semibold text-accent">{(selectedResult.score ?? 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-sm bg-bg-primary border border-border-subtle flex flex-col gap-1">
                  <span className="text-[10px] text-text-tertiary uppercase tracking-wider font-mono">Verbatim Content</span>
                  <p className="text-xs text-text-secondary leading-relaxed italic mt-1">
                    &ldquo;{selectedResult.content}&rdquo;
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-sm bg-bg-primary border border-border-subtle text-center text-xs text-text-tertiary leading-relaxed">
                When a query is executed, the selected passage source file, page number, section hierarchy, and vector similarity score returned by the backend will be displayed here.
              </div>
            )}
          </div>

          <div className="p-5 rounded-sm border border-border-subtle bg-bg-primary flex flex-col gap-3">
            <span className="text-xs font-medium text-text-primary">Search Strategy</span>
            <div className="flex flex-col gap-2 text-xs text-text-secondary">
              <div className="flex items-center justify-between pb-1.5 border-b border-border-subtle text-mono text-[11px]">
                <span>Vector Dimension</span>
                <span className="text-text-primary font-medium">384-d</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-border-subtle text-mono text-[11px]">
                <span>Keyword Engine</span>
                <span className="text-text-primary font-medium">rank-bm25</span>
              </div>
              <div className="flex items-center justify-between text-mono text-[11px]">
                <span>Target Latency</span>
                <span className="text-text-primary font-medium">&lt;250ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-xs text-text-tertiary font-mono">
        Loading Hybrid Retrieval Engine...
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
