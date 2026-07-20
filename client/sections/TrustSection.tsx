"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TRUST_METRICS } from "@/lib/constants";

export function TrustSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="border-y border-border-subtle" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="container-editorial py-16 lg:py-20">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 border border-border-subtle rounded-sm overflow-hidden">
          {TRUST_METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-1 p-6 lg:p-8"
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              <span className="font-display text-3xl lg:text-4xl font-medium text-text-primary tracking-tight">
                {metric.value}
              </span>
              <span className="text-body text-text-primary font-medium mt-1">
                {metric.label}
              </span>
              <span className="text-mono text-text-tertiary mt-1">
                {metric.sublabel}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <p className="text-mono text-text-tertiary mt-6 text-center">
          Performance metrics measured across all enterprise production deployments · Updated quarterly
        </p>
      </div>
    </section>
  );
}
