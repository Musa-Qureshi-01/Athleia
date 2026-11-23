"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, CheckCircle2, Lock, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

export function FinalCTASection() {
  return (
    <section className="py-24 lg:py-36 bg-bg-secondary relative overflow-hidden border-b border-border-subtle">
      {/* Subtle decorative radial gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-editorial relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-subtle bg-bg-primary text-text-secondary text-xs font-mono font-medium mb-6 shadow-2xs"
          >
            <Sparkles size={13} className="text-accent" />
            <span>DEPLOY IN DAYS, NOT QUARTERS</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.08] mb-6"
          >
            Bring intelligence to every corner of your organization.
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="text-base sm:text-lg text-text-secondary leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Connect organizational knowledge, empower employees with trusted answers, and automate complex workflows with enterprise security and governance.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.22 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <Link
              href="/contact"
              className="w-full sm:w-auto h-12 px-8 rounded-lg text-sm font-semibold bg-text-primary text-bg-primary hover:bg-text-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer group"
            >
              <span>Get a personalized demo</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/pricing"
              className="w-full sm:w-auto h-12 px-8 rounded-lg text-sm font-semibold bg-bg-primary border border-border-strong hover:bg-bg-secondary text-text-primary transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Calculate enterprise ROI</span>
            </Link>
          </motion.div>

          {/* Trust & Compliance Seals Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="pt-8 border-t border-border-subtle/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-text-tertiary"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-emerald-600" />
              <span>SOC 2 TYPE II AUDITED</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock size={14} className="text-accent" />
              <span>ZERO MODEL TRAINING GUARANTEE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>HIPAA BAA READY</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" />
              <span>VPC &amp; ON-PREMISES DEPLOYABLE</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

