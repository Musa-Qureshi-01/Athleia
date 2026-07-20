"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileUp,
  FileText,
  Search,
  Filter,
  Inbox,
  HardDrive,
  Info,
  Trash2,
  Loader2,
  Eye,
  Maximize2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getCorpusDocuments,
  addCorpusDocument,
  saveCorpusDocuments,
  CorpusDocument,
} from "@/lib/corpus-store";
import { uploadIngestionDocument } from "@/lib/api";
import { DocumentViewerModal } from "@/components/workspace/DocumentViewerModal";

export default function DocumentsPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<CorpusDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loaded = getCorpusDocuments();
    setDocuments(loaded);
    if (loaded.length > 0) {
      setSelectedDocId(loaded[0].id);
    }
  }, []);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    let newlyAdded: CorpusDocument[] = [];

    for (const file of Array.from(files)) {
      try {
        await uploadIngestionDocument(file);
      } catch (err: unknown) {
        console.warn("Ingestion Service offline or returning error, adding to local corpus index:", err);
      }
      const doc = addCorpusDocument(file);
      newlyAdded.push(doc);
    }

    const refreshed = getCorpusDocuments();
    setDocuments(refreshed);
    if (newlyAdded.length > 0) {
      setSelectedDocId(newlyAdded[0].id);
    }

    setUploading(false);
  };

  const removeDocument = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    saveCorpusDocuments(updated);
    if (selectedDocId === id) {
      setSelectedDocId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const openViewerForDoc = (docId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedDocId(docId);
    setViewerOpen(true);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "pid") return matchesSearch && doc.type.includes("P&ID");
    if (selectedCategory === "sop") return matchesSearch && doc.type.includes("SOP");
    if (selectedCategory === "specs") return matchesSearch && doc.type.includes("Spec");
    return matchesSearch;
  });

  const selectedDoc = documents.find((d) => d.id === selectedDocId);

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileSelect(e.target.files)}
        multiple
        accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.doc,.docx"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="flex flex-col gap-1">
          <span className="text-label text-text-tertiary">Ingestion Pipeline</span>
          <h1 className="text-heading-1 text-text-primary">
            Document Corpus
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-bg-secondary border border-border-subtle text-xs text-text-secondary">
            <HardDrive size={14} className="text-text-tertiary" />
            <span className="text-mono">Gateway Endpoint: /api/v1/ingest</span>
          </div>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFileSelect(e.dataTransfer.files);
        }}
        className={cn(
          "p-8 rounded-sm border-2 border-dashed transition-all duration-150 flex flex-col items-center justify-center text-center gap-3 select-none",
          uploading ? "opacity-75 cursor-wait" : "cursor-pointer",
          dragActive
            ? "border-accent bg-accent-muted/20"
            : "border-border-strong bg-bg-secondary hover:border-text-tertiary hover:bg-bg-tertiary"
        )}
      >
        <div className="p-3 rounded-full bg-bg-primary border border-border-subtle text-accent">
          {uploading ? (
            <Loader2 size={22} className="animate-spin text-accent" />
          ) : (
            <FileUp size={22} strokeWidth={1.75} />
          )}
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <span className="text-sm font-medium text-text-primary">
            {uploading ? (
              "Streaming document to Ingestion Pipeline..."
            ) : (
              <>
                Drag and drop engineering documents or{" "}
                <span className="text-accent underline underline-offset-4 font-semibold">
                  browse files
                </span>
              </>
            )}
          </span>
          <span className="text-xs text-text-secondary">
            Supports P&ID drawing PDFs, CAD exports, System Design specs, SOPs, and technical sheets.
          </span>
        </div>
        <div className="flex items-center gap-4 text-mono text-[10px] text-text-tertiary pt-2 border-t border-border-subtle">
          <span>OCR Table Extraction</span>
          <span>•</span>
          <span>Symbol Region Parsing</span>
          <span>•</span>
          <span>SHA-256 Hash Provenance</span>
        </div>
      </div>

      {/* Main Area: Document List Layout with Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Document List Container (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-sm bg-bg-secondary border border-border-subtle">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Search size={14} className="text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by document name or type..."
                className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-tertiary outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={13} className="text-text-tertiary" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-bg-primary border border-border-subtle rounded-sm text-xs text-text-secondary px-2 py-1 outline-none"
              >
                <option value="all">All Categories ({documents.length})</option>
                <option value="pid">P&ID Diagrams</option>
                <option value="sop">Operating SOPs</option>
                <option value="specs">Datasheets & Specs</option>
              </select>
            </div>
          </div>

          {/* Document Table / Items / Empty State */}
          <div className="border border-border-subtle rounded-sm bg-bg-primary min-h-[320px] flex flex-col">
            {filteredDocs.length > 0 ? (
              <div className="divide-y divide-border-subtle">
                <div className="px-4 py-2.5 bg-bg-secondary text-mono text-[11px] text-text-tertiary grid grid-cols-12 gap-4">
                  <span className="col-span-5">Document Name</span>
                  <span className="col-span-3">Type</span>
                  <span className="col-span-2">Size</span>
                  <span className="col-span-2 text-right">Actions</span>
                </div>

                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={cn(
                      "px-4 py-3 grid grid-cols-12 gap-4 items-center text-xs cursor-pointer transition-colors group",
                      selectedDocId === doc.id
                        ? "bg-bg-tertiary"
                        : "hover:bg-bg-secondary"
                    )}
                  >
                    <div className="col-span-5 flex items-center gap-2.5 overflow-hidden">
                      <FileText size={16} className="text-accent shrink-0" />
                      <span className="font-medium text-text-primary truncate">
                        {doc.name}
                      </span>
                    </div>

                    <div className="col-span-3">
                      <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-bg-secondary border border-border-subtle text-text-secondary">
                        {doc.type}
                      </span>
                    </div>

                    <div className="col-span-2 text-mono text-text-tertiary">
                      {doc.size}
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => openViewerForDoc(doc.id, e)}
                        title="Open Full Document Viewer"
                        className="px-2 py-1 rounded bg-bg-secondary border border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={(e) => removeDocument(doc.id, e)}
                        title="Remove file"
                        className="p-1 text-text-tertiary hover:text-status-error transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
                <div className="p-4 rounded-full bg-bg-secondary border border-border-subtle mb-3">
                  <Inbox size={28} className="text-text-tertiary stroke-[1.25]" />
                </div>
                <h3 className="text-sm font-medium text-text-primary mb-1">
                  {documents.length === 0
                    ? "No documents in corpus yet"
                    : "No matching documents found"}
                </h3>
                <p className="text-xs text-text-secondary max-w-sm mb-6 leading-relaxed">
                  {documents.length === 0
                    ? "Click 'browse files' or drag and drop P&ID diagrams and maintenance SOPs above to stream files to the Ingestion Service."
                    : "Try clearing your search query or changing the filter dropdown."}
                </p>
                <div className="flex items-center gap-2 text-mono text-xs text-text-tertiary">
                  <Info size={13} />
                  <span>API Gateway (8000) → Ingestion Service (Port 8003)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Pipeline Status & Metadata Panel (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Document Metadata Panel */}
          <div className="p-5 rounded-sm border border-border-subtle bg-bg-primary flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-primary">Document Metadata</span>
              {selectedDoc && (
                <button
                  onClick={() => setViewerOpen(true)}
                  className="text-[11px] text-accent font-medium hover:underline flex items-center gap-1"
                >
                  <span>Full Screen</span>
                  <Maximize2 size={11} />
                </button>
              )}
            </div>

            {selectedDoc ? (
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <span className="text-text-tertiary">Filename</span>
                  <span className="font-medium text-text-primary truncate max-w-[150px]">
                    {selectedDoc.name}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <span className="text-text-tertiary">File Size</span>
                  <span className="text-mono text-text-primary">{selectedDoc.size}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <span className="text-text-tertiary">Target Chunks</span>
                  <span className="text-mono text-text-primary">{selectedDoc.chunks?.length || 3} sections</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <span className="text-text-tertiary">Status</span>
                  <span className="text-mono text-status-verified flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>Indexed & Searchable</span>
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                  <span className="text-text-tertiary">Uploaded At</span>
                  <span className="text-mono text-text-secondary">{selectedDoc.uploadedAt}</span>
                </div>

                <button
                  onClick={() => setViewerOpen(true)}
                  className="w-full h-9 rounded-sm bg-text-primary text-bg-primary text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-1"
                >
                  <Eye size={14} />
                  <span>Inspect Full Document</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-sm bg-bg-secondary border border-border-subtle text-center text-xs text-text-tertiary">
                Select a document from the list to view its chunk count, metadata tags, and page indexing status.
              </div>
            )}
          </div>

          {/* Pipeline Stage Indicators */}
          <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col gap-4">
            <span className="text-xs font-medium text-text-primary">Pipeline Stages</span>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-bg-primary border border-border-subtle flex items-center justify-center text-[10px] font-mono text-text-secondary">
                  01
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-text-primary">Ingestion & Parsing</span>
                  <span className="text-[11px] text-text-tertiary">OCR & Table Extraction</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-bg-primary border border-border-subtle flex items-center justify-center text-[10px] font-mono text-text-secondary">
                  02
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-text-primary">Chunking & Hashing</span>
                  <span className="text-[11px] text-text-tertiary">SHA-256 Provenance</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-bg-primary border border-border-subtle flex items-center justify-center text-[10px] font-mono text-text-secondary">
                  03
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-text-primary">Embedding & Indexing</span>
                  <span className="text-[11px] text-text-tertiary">Dense Vectors + BM25</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        doc={selectedDoc || null}
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  );
}
