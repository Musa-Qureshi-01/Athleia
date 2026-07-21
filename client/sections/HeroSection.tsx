"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, CheckCircle2, Zap, Lock, Building2 } from "lucide-react";
import gsap from "gsap";
import { KnowledgeGraphCanvas } from "@/components/visuals/KnowledgeGraphCanvas";

const TRANSITION_BASE = { duration: 0.6, ease: "easeOut" as const };

export function HeroSection() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headlineRef.current) {
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1 }
      );
    }
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center pt-28 lg:pt-36 pb-24 lg:pb-32 border-b border-border-subtle overflow-hidden bg-bg-primary">
      {/* Background Subtle Mesh Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="container-editorial w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Text & CTAs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-7">
            
            {/* Enterprise Trust Badge */}
            <motion.div
              ref={badgeRef}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_BASE, delay: 0 }}
              className="flex items-center gap-2.5 flex-wrap"
            >
              <span className="text-label text-text-primary border border-border-strong bg-bg-secondary px-3.5 py-1.5 rounded-sm inline-flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-status-verified animate-pulse" />
                <span className="font-medium">Enterprise Industrial Intelligence Platform</span>
              </span>
              <span className="text-[11px] font-mono text-text-tertiary">
                ISO 27001 &amp; SOC 2 Certified
              </span>
            </motion.div>

            {/* GSAP Animated Headline */}
            <h1
              ref={headlineRef}
              className="text-display text-text-primary max-w-2xl leading-[1.12] tracking-tight"
            >
              The Enterprise AI Intelligence Layer for Industrial Operations.
            </h1>

            {/* Subheading */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_BASE, delay: 0.2 }}
            >
              <p className="text-body-lg text-text-secondary max-w-xl leading-relaxed">
                Athleia transforms complex engineering document corpora, P&amp;ID drawings, ISO safety standards, and operational sensor telemetry into verified, zero-fabrication decision intelligence.
              </p>
            </motion.div>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_BASE, delay: 0.3 }}
              className="flex flex-wrap gap-4 items-center pt-2"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-11.5 px-6 rounded-sm text-xs font-semibold bg-text-primary text-bg-primary hover:opacity-90 transition-all duration-200 shadow-md group"
              >
                <span>Book a Product Demo</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#overview"
                className="inline-flex items-center gap-2 h-11.5 px-6 rounded-sm text-xs font-medium text-text-primary border border-border-strong bg-bg-primary hover:bg-bg-secondary transition-colors duration-200 shadow-2xs"
              >
                <span>Explore Platform</span>
              </a>
            </motion.div>

            {/* Enterprise Trust Metrics Bar */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_BASE, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-6 mt-4 border-t border-border-subtle max-w-xl"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-bold text-text-primary font-mono">99.94%</span>
                <span className="text-[11px] text-text-tertiary">Grounding Accuracy</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-bold text-text-primary font-mono">0.00%</span>
                <span className="text-[11px] text-text-tertiary">Fabrication Rate</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-bold text-text-primary font-mono">100%</span>
                <span className="text-[11px] text-text-tertiary">Air-Gap VPC Compatible</span>
              </div>
            </motion.div>

          </div>

          {/* Right Visual Architecture Canvas (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" as const }}
            className="lg:col-span-5 relative"
          >
            <div
              className="relative w-full aspect-square max-w-lg mx-auto rounded-sm overflow-hidden border border-border-strong shadow-2xl"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <KnowledgeGraphCanvas />

              {/* Status Pills */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-bg-primary/95 backdrop-blur-md px-3.5 py-1.5 rounded-sm border border-border-subtle shadow-xs">
                <span className="w-2 h-2 rounded-full bg-status-verified" />
                <span className="text-xs font-semibold text-text-primary">Enterprise Knowledge Graph</span>
              </div>

              <div className="absolute bottom-4 right-4 flex flex-col items-end gap-0.5 bg-bg-primary/95 backdrop-blur-md px-3.5 py-2 rounded-sm border border-border-subtle text-right shadow-xs">
                <span className="text-[11px] font-mono text-accent font-semibold">Zero Fabrication Engine</span>
                <span className="text-[10px] font-mono text-text-tertiary">100% Citation Provenance</span>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2 bg-bg-primary/95 backdrop-blur-md px-2.5 py-1 rounded-sm border border-border-subtle">
                <span className="w-2.5 h-px bg-accent" />
                <span className="text-[10px] font-mono text-text-secondary">P&amp;ID Reasoning Path</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
