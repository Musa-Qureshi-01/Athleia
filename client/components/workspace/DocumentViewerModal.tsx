"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Maximize2,
  Minimize2,
  FileText,
  Layers,
  Code,
  Tag,
  Search,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Eye,
  Download,
  FileCode,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CorpusDocument } from "@/lib/corpus-store";
import { OriginalDocumentViewer } from "@/components/workspace/OriginalDocumentViewer";

interface DocumentViewerModalProps {
  doc: CorpusDocument | null;
  open: boolean;
  onClose: () => void;
}

export function DocumentViewerModal({ doc, open, onClose }: DocumentViewerModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState<"original" | "analysis" | "chunks" | "metadata" | "json">("original");
  const [chunkFilter, setChunkFilter] = useState("");

  if (!doc) return null;

  const filteredChunks = doc.chunks.filter(
    (c) =>
      c.text.toLowerCase().includes(chunkFilter.toLowerCase()) ||
      c.section.toLowerCase().includes(chunkFilter.toLowerCase())
  );

  const openInNewWindow = () => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, "_blank");
    } else {
      const sampleText = `ATHLEIA INDUSTRIAL SYSTEM SPECIFICATION\nDocument: ${doc.name}\nType: ${doc.type}\n\n` +
        doc.chunks.map((c) => `--- ${c.section} (Page ${c.page}) ---\n${c.text}\n`).join("\n");
      const blob = new Blob([sampleText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "rounded-sm border border-border-subtle shadow-2xl flex flex-col pointer-events-auto transition-all duration-200 overflow-hidden",
                isFullScreen
                  ? "w-screen h-screen fixed inset-0 rounded-none border-none z-[60]"
                  : "w-full max-w-6xl h-[88vh]"
              )}
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              {/* Top Bar Header */}
              <div className="px-6 h-14 border-b border-border-subtle flex items-center justify-between shrink-0 bg-bg-secondary">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-1.5 rounded bg-bg-primary border border-border-subtle text-accent">
                    <FileText size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary truncate">
                        {doc.name}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-bg-primary border border-border-subtle text-text-secondary">
                        {doc.type}
                      </span>
                    </div>
                    <span className="text-mono text-[10px] text-text-tertiary">
                      ID: {doc.id} · Size: {doc.size} · Uploaded: {doc.uploadedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={openInNewWindow}
                    title="Open Document in New Tab / Window"
                    className="px-3 py-1.5 rounded-sm bg-bg-primary border border-border-subtle hover:border-border-strong text-text-primary text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink size={14} />
                    <span>Open in New Tab</span>
                  </button>

                  <button
                    onClick={() => setIsFullScreen((v) => !v)}
                    title={isFullScreen ? "Exit Fullscreen" : "Fullscreen Window"}
                    className="p-1.5 rounded-sm text-text-tertiary hover:text-text-primary hover:bg-bg-primary transition-colors flex items-center gap-1 text-xs"
                  >
                    {isFullScreen ? (
                      <Minimize2 size={16} />
                    ) : (
                      <Maximize2 size={16} />
                    )}
                  </button>

                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-sm text-text-tertiary hover:text-text-primary hover:bg-bg-primary transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Sub-Header Navigation Tabs */}
              <div className="px-6 py-2 border-b border-border-subtle flex flex-wrap items-center justify-between gap-4 bg-bg-primary">
                <div className="flex items-center gap-2">
                  {/* Tab 1: Original Document (Default) */}
                  <button
                    onClick={() => setActiveTab("original")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs transition-colors",
                      activeTab === "original"
                        ? "bg-text-primary text-bg-primary font-semibold shadow-sm"
                        : "text-text-secondary hover:text-text-primary bg-bg-secondary"
                    )}
                  >
                    <Eye size={14} />
                    <span>Original Document</span>
                  </button>

                  {/* Tab 2: AI Analysis */}
                  <button
                    onClick={() => setActiveTab("analysis")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs transition-colors",
                      activeTab === "analysis"
                        ? "bg-bg-tertiary text-text-primary font-medium border border-border-subtle"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    <Cpu size={14} />
                    <span>AI Analysis</span>
                  </button>

                  {/* Tab 3: Parsed Chunks */}
                  <button
                    onClick={() => setActiveTab("chunks")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs transition-colors",
                      activeTab === "chunks"
                        ? "bg-bg-tertiary text-text-primary font-medium border border-border-subtle"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    <Layers size={14} />
                    <span>Parsed Chunks ({doc.chunks.length})</span>
                  </button>

                  {/* Tab 4: OCR Metadata */}
                  <button
                    onClick={() => setActiveTab("metadata")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs transition-colors",
                      activeTab === "metadata"
                        ? "bg-bg-tertiary text-text-primary font-medium border border-border-subtle"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    <Tag size={14} />
                    <span>OCR Metadata</span>
                  </button>

                  {/* Tab 5: Normalized JSON */}
                  <button
                    onClick={() => setActiveTab("json")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs transition-colors",
                      activeTab === "json"
                        ? "bg-bg-tertiary text-text-primary font-medium border border-border-subtle"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    <Code size={14} />
                    <span>Normalized JSON</span>
                  </button>
                </div>

                {/* Filter for Chunks */}
                {activeTab === "chunks" && (
                  <div className="flex items-center gap-2 max-w-xs flex-1">
                    <div className="relative w-full">
                      <Search size={13} className="absolute left-2.5 top-2.5 text-text-tertiary" />
                      <input
                        type="text"
                        value={chunkFilter}
                        onChange={(e) => setChunkFilter(e.target.value)}
                        placeholder="Filter chunks..."
                        className="w-full h-8 pl-8 pr-3 bg-bg-secondary border border-border-subtle rounded-sm text-xs text-text-primary placeholder:text-text-tertiary outline-none focus:border-border-strong"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Main Tab Content Viewports */}
              <div className="flex-1 overflow-hidden bg-bg-secondary relative">
                {/* 1. ORIGINAL UNMODIFIED DOCUMENT TAB (Default) */}
                {activeTab === "original" && (
                  <OriginalDocumentViewer
                    fileName={doc.name}
                    fileType={doc.type}
                    fileUrl={doc.fileUrl}
                    rawText={doc.chunks.map((c) => c.text).join("\n\n")}
                  />
                )}

                {/* 2. AI ANALYSIS VIEW TAB */}
                {activeTab === "analysis" && (
                  <div className="w-full h-full p-6 overflow-y-auto flex flex-col gap-6 font-sans">
                    <div className="p-4 rounded border border-accent/30 bg-accent-muted/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Cpu size={18} className="text-accent" />
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary">Athleia Grounded AI Analysis</h4>
                          <p className="text-xs text-text-secondary">Extracted vector embeddings, CAD equipment tags, and section paths.</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-bg-primary text-status-verified text-xs font-mono font-medium border border-status-verified/30">
                        CONFIDENCE 0.96
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {doc.chunks.map((chunk, idx) => (
                        <div key={idx} className="p-4 rounded bg-bg-primary border border-border-subtle flex flex-col gap-2">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-accent font-semibold">{chunk.section}</span>
                            <span className="text-text-tertiary">Page {chunk.page}</span>
                          </div>
                          <p className="text-xs text-text-primary font-mono leading-relaxed">{chunk.text}</p>
                          <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-[10px] text-text-tertiary font-mono">
                            <span>Score: {chunk.score || 0.95}</span>
                            <span>Vector ID: {chunk.id}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. PARSED CHUNKS TAB */}
                {activeTab === "chunks" && (
                  <div className="p-6 h-full overflow-y-auto flex flex-col gap-4">
                    {filteredChunks.length > 0 ? (
                      filteredChunks.map((chunk) => (
                        <div
                          key={chunk.id}
                          className="p-4 rounded-sm border border-border-subtle bg-bg-primary flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between text-xs text-text-secondary font-mono">
                            <span className="font-semibold text-accent">{chunk.section}</span>
                            <span>Page {chunk.page}</span>
                          </div>
                          <p className="text-xs text-text-primary font-mono leading-relaxed">{chunk.text}</p>
                          <div className="flex items-center gap-4 text-[11px] text-text-tertiary font-mono pt-1">
                            <span>Chunk ID: {chunk.id}</span>
                            <span>Density Score: {chunk.score || 0.92}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-xs text-text-tertiary">
                        No chunks matched &quot;{chunkFilter}&quot;
                      </div>
                    )}
                  </div>
                )}

                {/* 4. OCR METADATA TAB */}
                {activeTab === "metadata" && (
                  <div className="p-6 h-full overflow-y-auto flex flex-col gap-4">
                    <div className="p-4 rounded-sm border border-border-subtle bg-bg-primary flex flex-col gap-3">
                      <span className="text-xs font-semibold text-text-primary font-mono uppercase tracking-wider">
                        Document Processing Metrics
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                        <div className="flex flex-col gap-1">
                          <span className="text-text-tertiary">Document ID</span>
                          <span className="text-text-primary">{doc.id}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-text-tertiary">MIME Type</span>
                          <span className="text-text-primary">{doc.type}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-text-tertiary">Size</span>
                          <span className="text-text-primary">{doc.size}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-text-tertiary">Total Chunks</span>
                          <span className="text-text-primary">{doc.chunks.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. NORMALIZED JSON TAB */}
                {activeTab === "json" && (
                  <div className="p-6 h-full overflow-y-auto">
                    <pre className="p-4 rounded-sm border border-border-subtle bg-bg-primary text-mono text-xs text-accent leading-relaxed overflow-x-auto">
                      {JSON.stringify(doc, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
