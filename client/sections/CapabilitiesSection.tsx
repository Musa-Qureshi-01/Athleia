"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CAPABILITIES } from "@/lib/constants";

export function CapabilitiesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="capabilities" className="section-spacing border-b border-border-subtle">
      <div className="container-editorial">

        {/* Section Header — Left-Aligned */}
        <div className="mb-16">
          <span className="text-label text-text-tertiary block mb-4">Core Capabilities</span>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <h2 className="text-heading-1 text-text-primary">
              Built for the Demands of Industrial Operations.
            </h2>
            <p className="text-body-lg text-text-secondary leading-relaxed lg:pt-2">
              Athleia is not a general-purpose AI assistant. It is precision-engineered for the
              high-stakes environments where every answer must be traceable to a verified source.
            </p>
          </div>
        </div>

        {/* Capabilities Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 border border-border-subtle rounded-sm overflow-hidden">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.tag}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4 p-6 lg:p-8 border-b border-r-0 md:even:border-r-0 border-border-subtle last:border-b-0"
              style={{
                borderRight: (i % 2 === 0) ? "1px solid var(--border-subtle)" : "none",
                borderBottom: (i < 2) ? "1px solid var(--border-subtle)" : "none",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-label" style={{ color: "var(--accent)" }}>
                  {cap.tag}
                </span>
              </div>

              <h3 className="text-heading-2 text-text-primary">{cap.title}</h3>

              <p className="text-body text-text-secondary leading-relaxed">
                {cap.description}
              </p>

              {/* Technical Metric */}
              <div
                className="mt-auto pt-4 border-t border-border-subtle flex items-center justify-between gap-4"
              >
                <span className="text-mono text-text-primary font-medium">{cap.metric}</span>
                <span className="text-mono text-text-tertiary text-xs">{cap.metricLabel}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
