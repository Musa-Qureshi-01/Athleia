"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DemoCTASection() {
  return (
    <section className="section-spacing border-b border-border-subtle bg-bg-primary">
      <div className="container-editorial">
        <div className="max-w-3xl space-y-8">
          
          {/* Top Monospace Label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-tertiary font-semibold block">
              SCHEDULE A TECHNICAL REVIEW
            </span>
          </motion.div>

          {/* Large Left-Aligned Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-display text-text-primary leading-[1.12] tracking-tight max-w-2xl">
              Ready to Deploy Industrial Intelligence at Enterprise Scale?
            </h2>
          </motion.div>

          {/* Description Paragraph */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-body-lg text-text-secondary leading-relaxed max-w-2xl">
              Our engineering team will walk you through a deployment architecture review, demonstrate live P&amp;ID reasoning against your document corpus, and design a VPC-isolated deployment plan tailored to your infrastructure.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-11.5 px-6 rounded-sm text-sm font-semibold bg-text-primary text-bg-primary hover:opacity-90 transition-opacity shadow-xs"
            >
              <span>Request Enterprise Demo</span>
            </Link>

            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 h-11.5 px-6 rounded-sm text-sm font-semibold text-text-primary border border-border-strong bg-transparent hover:bg-bg-secondary transition-colors"
            >
              <span>View Architecture Spec</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Horizontal Divider Line & 3 Metadata Columns */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-8 border-t border-border-subtle grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs max-w-2xl"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-mono text-text-tertiary">Response time</span>
              <span className="font-semibold text-text-primary text-xs font-mono">&lt; 24 hours</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-mono text-text-tertiary">Demo format</span>
              <span className="font-semibold text-text-primary text-xs">Live technical walkthrough</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-mono text-text-tertiary">Deployment timeline</span>
              <span className="font-semibold text-text-primary text-xs">2–4 weeks to production</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
