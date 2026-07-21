"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { WHY_ATHLEIA_PILLARS } from "@/lib/enterprise-data";
import { Zap, ShieldCheck, CheckCircle2, Lock, ArrowUpRight } from "lucide-react";

export function WhyAthleiaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap": return Zap;
      case "ShieldCheck": return ShieldCheck;
      case "CheckCircle2": return CheckCircle2;
      case "Lock": return Lock;
      default: return Zap;
    }
  };

  return (
    <section id="solutions" className="section-spacing border-b border-border-subtle bg-bg-secondary">
      <div className="container-editorial">

        {/* Section Header */}
        <div className="mb-14 max-w-2xl">
          <span className="text-label text-text-tertiary block mb-3 uppercase tracking-wider font-mono">
            Enterprise Value proposition
          </span>
          <h2 className="text-heading-1 text-text-primary mb-4">
            Why Leading Industrial Enterprises Choose Athleia.ai
          </h2>
          <p className="text-body-lg text-text-secondary leading-relaxed">
            General AI chatbots hallucinate and lack industrial context. Athleia is purpose-built to deliver verifiable, zero-fabrication decision intelligence for safety-critical plant operations.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WHY_ATHLEIA_PILLARS.map((pillar, index) => {
            const IconComp = getIcon(pillar.iconName);

            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 rounded-sm border border-border-subtle bg-bg-primary hover:border-border-strong transition-all duration-300 shadow-2xs group flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                      <IconComp size={20} />
                    </div>
                    <span className="text-xs font-mono text-text-tertiary">
                      Pillar 0{index + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-heading-2 text-text-primary mb-1.5 flex items-center justify-between">
                      <span>{pillar.title}</span>
                      <ArrowUpRight size={18} className="text-text-tertiary group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </h3>
                    <span className="text-xs font-mono text-accent font-semibold block mb-3">
                      {pillar.subtitle}
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-subtle flex items-center gap-2 text-xs font-mono text-text-tertiary">
                  <span className="w-2 h-2 rounded-full bg-status-verified" />
                  <span>Enterprise Business Impact Guaranteed</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
