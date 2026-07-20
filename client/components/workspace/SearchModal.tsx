"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, FileText, Cpu, ArrowRight, CornerDownLeft } from "lucide-react";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Cmd+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && open) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/workspace/search?q=${encodeURIComponent(query)}`);
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
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-full max-w-xl rounded-sm border border-border-subtle shadow-2xl overflow-hidden pointer-events-auto"
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              {/* Form Input Header */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-3 px-4 h-13 border-b border-border-subtle"
              >
                <Search size={18} className="text-text-tertiary shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search equipment tags (PT-101), SOPs, P&IDs..."
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-text-tertiary hover:text-text-primary p-1"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-2 py-1 text-xs text-mono text-text-tertiary border border-border-subtle rounded-sm hover:text-text-primary"
                >
                  ESC
                </button>
              </form>

              {/* Suggestions / Results */}
              <div className="p-3 max-h-80 overflow-y-auto flex flex-col gap-2">
                <div className="px-2 py-1 text-[10px] font-mono text-text-tertiary uppercase tracking-wider">
                  Quick Navigation
                </div>

                <button
                  onClick={() => {
                    onClose();
                    router.push("/workspace/search");
                  }}
                  className="flex items-center justify-between p-2.5 rounded-sm hover:bg-bg-secondary text-left group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-sm bg-bg-secondary border border-border-subtle text-accent">
                      <Search size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-text-primary group-hover:text-accent transition-colors">
                        Hybrid Vector & BM25 Search
                      </span>
                      <span className="text-[11px] text-text-secondary">
                        Search across indexed P&ID drawings and document chunks
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-text-tertiary group-hover:text-text-primary" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    router.push("/workspace/intelligence");
                  }}
                  className="flex items-center justify-between p-2.5 rounded-sm hover:bg-bg-secondary text-left group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-sm bg-bg-secondary border border-border-subtle text-accent">
                      <Cpu size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-text-primary group-hover:text-accent transition-colors">
                        Grounded Reasoning Engine
                      </span>
                      <span className="text-[11px] text-text-secondary">
                        Ask engineering questions with verified citations
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-text-tertiary group-hover:text-text-primary" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    router.push("/workspace/documents");
                  }}
                  className="flex items-center justify-between p-2.5 rounded-sm hover:bg-bg-secondary text-left group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-sm bg-bg-secondary border border-border-subtle text-accent">
                      <FileText size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-text-primary group-hover:text-accent transition-colors">
                        Ingested Document Corpus
                      </span>
                      <span className="text-[11px] text-text-secondary">
                        View uploaded P&IDs, SOPs, and technical specs
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-text-tertiary group-hover:text-text-primary" />
                </button>
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-border-subtle bg-bg-secondary flex items-center justify-between text-[11px] text-text-tertiary">
                <div className="flex items-center gap-1.5">
                  <CornerDownLeft size={12} />
                  <span>Press Enter to launch search</span>
                </div>
                <span className="text-mono">Athleia Gateway v1.0</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
