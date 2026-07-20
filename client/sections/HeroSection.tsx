"use client";

import { motion } from "framer-motion";
import { KnowledgeGraphCanvas } from "@/components/visuals/KnowledgeGraphCanvas";

const TRANSITION_BASE = { duration: 0.55, ease: "easeOut" as const };

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-14">
      <div className="container-editorial w-full py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left — Editorial Typography (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_BASE, delay: 0 }}
            >
              <span className="text-label text-text-tertiary border border-border-subtle px-3 py-1.5 rounded-sm inline-block">
                Enterprise Industrial AI Reasoning
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_BASE, delay: 0.08 }}
            >
              <h1 className="text-display text-text-primary max-w-2xl">
                Engineering Precision for Industrial Decision Intelligence.
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_BASE, delay: 0.16 }}
            >
              <p className="text-body-lg text-text-secondary max-w-xl leading-relaxed">
                Athleia transforms enterprise engineering documents — P&amp;ID
                drawings, maintenance SOPs, and asset telemetry — into verified,
                zero-hallucination AI reasoning. Every answer traceable. Every
                source cited.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_BASE, delay: 0.24 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <a
                href="#platform"
                className="inline-flex items-center h-10 px-6 rounded-sm text-sm font-medium bg-text-primary text-bg-primary hover:opacity-90 transition-opacity duration-200"
              >
                Explore Platform
              </a>
              <a
                href="#architecture"
                className="inline-flex items-center h-10 px-6 rounded-sm text-sm font-medium text-text-secondary border border-border-strong hover:text-text-primary transition-colors duration-200"
              >
                Read Architecture
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_BASE, delay: 0.32 }}
              className="flex items-center gap-6 pt-2 border-t border-border-subtle"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-status-verified" />
                <span className="text-mono text-text-tertiary">99.94% Grounding Accuracy</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-status-verified" />
                <span className="text-mono text-text-tertiary">0.00% Hallucination Rate</span>
              </div>
            </motion.div>
          </div>

          {/* Right — Knowledge Graph Visualization (5 cols) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" as const }}
            className="lg:col-span-5 relative"
          >
            <div
              className="relative w-full aspect-square max-w-lg mx-auto rounded-sm overflow-hidden border border-border-subtle"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <KnowledgeGraphCanvas />

              <div className="absolute top-4 left-4">
                <span className="text-label text-text-tertiary">Knowledge Graph · Live</span>
              </div>
              <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
                <span className="text-mono text-text-tertiary">19 knowledge nodes</span>
                <span className="text-mono text-text-tertiary">Reasoning: Active</span>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="w-3 h-px" style={{ backgroundColor: "var(--accent)", opacity: 0.6 }} />
                <span className="text-mono text-text-tertiary">Evidence path</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
