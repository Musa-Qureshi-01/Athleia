"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { USE_CASES } from "@/lib/constants";

export function UseCasesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeCase, setActiveCase] = useState(0);
  const active = USE_CASES[activeCase];

  return (
    <section className="section-spacing border-b border-border-subtle" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="container-editorial">

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="text-label text-text-tertiary block mb-4">Industrial Use Cases</span>
          <h2 className="text-heading-1 text-text-primary max-w-xl">
            Deployed Across Industrial Sectors.
          </h2>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Tabs */}
          <div className="lg:col-span-3 flex lg:flex-col gap-1">
            {USE_CASES.map((uc, i) => (
              <button
                key={uc.industry}
                onClick={() => setActiveCase(i)}
                className="text-left px-4 py-3 rounded-sm transition-colors duration-150 text-sm font-medium"
                style={{
                  backgroundColor: activeCase === i ? "var(--bg-primary)" : "transparent",
                  color: activeCase === i ? "var(--text-primary)" : "var(--text-tertiary)",
                  borderLeft: activeCase === i ? "2px solid var(--accent)" : "2px solid transparent",
                }}
              >
                {uc.industry}
              </button>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCase}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="border border-border-subtle rounded-sm overflow-hidden"
                style={{ backgroundColor: "var(--bg-primary)" }}
              >
                {/* Panel Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--status-verified)" }} />
                    <span className="text-mono text-text-secondary">{active.industry}</span>
                    <span className="text-mono text-text-tertiary">·</span>
                    <span className="text-mono text-text-tertiary">{active.scenario}</span>
                  </div>
                  <span
                    className="text-mono text-xs px-2 py-0.5 rounded border"
                    style={{ color: "var(--status-verified)", borderColor: "var(--status-verified)", opacity: 0.8 }}
                  >
                    Confidence: {active.confidence}
                  </span>
                </div>

                {/* Query */}
                <div className="px-6 py-5 border-b border-border-subtle" style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <span className="text-label text-text-tertiary block mb-2">User Query</span>
                  <p className="text-body text-text-primary">&quot;{active.query}&quot;</p>
                </div>

                {/* Grounded Response */}
                <div className="px-6 py-5 border-b border-border-subtle">
                  <span className="text-label text-text-tertiary block mb-2">Grounded Response</span>
                  <p className="text-body text-text-secondary leading-relaxed">{active.response}</p>
                </div>

                {/* Citation */}
                <div className="px-6 py-4">
                  <span className="text-label text-text-tertiary block mb-2">Citation Provenance</span>
                  <span className="text-mono text-text-tertiary">{active.citation}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
