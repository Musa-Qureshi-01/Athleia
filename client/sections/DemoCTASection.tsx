"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bot, ShieldCheck, CheckCircle2 } from "lucide-react";

export function DemoCTASection() {
  return (
    <section className="section-spacing border-b border-border-subtle bg-bg-primary relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent pointer-events-none" />

      <div className="container-editorial relative z-10">
        <div className="p-10 lg:p-16 rounded-sm border border-border-strong bg-bg-secondary shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <span className="px-3.5 py-1.5 rounded-sm text-xs font-mono font-semibold bg-accent/10 text-accent border border-accent/20 uppercase tracking-wider inline-block">
              Request Enterprise Architecture Briefing
            </span>

            <h2 className="text-display text-text-primary leading-tight max-w-2xl mx-auto">
              Ready to Accelerate Industrial Decision Intelligence?
            </h2>

            <p className="text-body-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
              Schedule a 30-minute technical architecture review with our enterprise engineering team. We will analyze your document volume, VPC requirements, and ROI potential.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-sm text-xs font-semibold bg-text-primary text-bg-primary hover:opacity-90 transition-opacity shadow-md group"
            >
              <span>Schedule Architecture Demo</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-sm text-xs font-medium text-text-primary border border-border-strong bg-bg-primary hover:bg-bg-secondary transition-colors shadow-2xs"
            >
              <span>View Enterprise Pricing</span>
            </Link>
          </motion.div>

          {/* Guarantee Badges */}
          <div className="pt-6 border-t border-border-subtle flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-text-tertiary">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-status-verified" />
              <span>Direct Technical Engineers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-accent" />
              <span>ISO 27001 &amp; SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-status-verified" />
              <span>Zero Sales Pressure</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
