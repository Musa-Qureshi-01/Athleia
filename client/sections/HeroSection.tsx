"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bot, ArrowRight, ShieldCheck, Zap, Layers, Cpu } from "lucide-react";
import { KnowledgeGraphCanvas } from "@/components/visuals/KnowledgeGraphCanvas";

const TRANSITION_BASE = { duration: 0.55, ease: "easeOut" as const };

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 border-b border-border-subtle overflow-hidden">
      <div className="container-editorial w-full py-12 lg:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Editorial Content (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_BASE, delay: 0 }}
              className="flex items-center gap-2.5 flex-wrap"
            >
              <span className="text-label text-text-primary border border-border-strong bg-bg-secondary px-3 py-1 rounded-sm inline-flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-status-verified animate-pulse" />
                <span>10 Production Microservices Operational</span>
              </span>
              <span className="text-[11px] font-mono text-text-tertiary">
                Ports 8000 to 8010 • LangGraph Inside
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_BASE, delay: 0.08 }}
            >
              <h1 className="text-display text-text-primary max-w-2xl leading-tight">
                Enterprise Industrial Knowledge Intelligence Platform.
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_BASE, delay: 0.16 }}
            >
              <p className="text-body-lg text-text-secondary max-w-xl leading-relaxed">
                Athleia transforms plant engineering documentation, P&amp;ID schematics, ISO compliance rules, and maintenance sensor telemetry into grounded agentic AI intelligence. Every answer traceable. Every source cited. Zero fabrication.
              </p>
            </motion.div>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_BASE, delay: 0.24 }}
              className="flex flex-wrap gap-3.5 items-center pt-1"
            >
              <Link
                href="/login"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-sm text-xs font-semibold bg-text-primary text-bg-primary hover:opacity-90 transition-all duration-200 shadow-md group"
              >
                <span>Sign In to Workspace</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <a
                href="#platform"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-sm text-xs font-medium text-text-primary border border-border-strong bg-bg-primary hover:bg-bg-secondary transition-colors duration-200 shadow-2xs"
              >
                <Layers size={14} className="text-text-tertiary" />
                <span>View All 10 Services</span>
              </a>
            </motion.div>

            {/* Live Telemetry Metrics Bar */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_BASE, delay: 0.32 }}
              className="grid grid-cols-3 gap-4 pt-6 mt-2 border-t border-border-subtle max-w-xl"
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary font-mono">99.94%</span>
                <span className="text-[11px] text-text-tertiary">Grounding Accuracy</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary font-mono">0.00%</span>
                <span className="text-[11px] text-text-tertiary">Fabrication Rate</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary font-mono">&lt;250ms</span>
                <span className="text-[11px] text-text-tertiary">BM25 + RRF Latency</span>
              </div>
            </motion.div>
          </div>

          {/* Right Visual Architecture Canvas (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" as const }}
            className="lg:col-span-5 relative"
          >
            <div
              className="relative w-full aspect-square max-w-lg mx-auto rounded-sm overflow-hidden border border-border-strong shadow-xl"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <KnowledgeGraphCanvas />

              <div className="absolute top-4 left-4 flex items-center gap-2 bg-bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded border border-border-subtle">
                <span className="w-2 h-2 rounded-full bg-status-verified" />
                <span className="text-xs font-semibold text-text-primary">10 Services Active</span>
              </div>

              <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1 bg-bg-primary/90 backdrop-blur-md px-3 py-2 rounded border border-border-subtle text-right">
                <span className="text-[11px] font-mono text-accent font-semibold">Port 8010 LangGraph Agent</span>
                <span className="text-[10px] font-mono text-text-tertiary">19 Knowledge Graph Nodes</span>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2 bg-bg-primary/90 backdrop-blur-md px-2.5 py-1 rounded border border-border-subtle">
                <span className="w-2.5 h-px bg-accent" />
                <span className="text-[10px] font-mono text-text-secondary">Citation Evidence</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
