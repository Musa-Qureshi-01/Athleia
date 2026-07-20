"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SECURITY_FEATURES } from "@/lib/constants";

export function SecuritySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="security" className="section-spacing border-b border-border-subtle" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="container-editorial">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-label text-text-tertiary block mb-4">Enterprise Security</span>
            <h2 className="text-heading-1 text-text-primary">
              Built for Regulated, High-Criticality Environments.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-end"
          >
            <p className="text-body-lg text-text-secondary leading-relaxed">
              Athleia is designed from first principles for environments where
              document confidentiality and reasoning traceability are not optional —
              they are operational mandates.
            </p>
          </motion.div>
        </div>

        {/* Security Features Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-px border border-border-subtle rounded-sm overflow-hidden">
          {SECURITY_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3 p-6 lg:p-8"
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              <h3 className="text-heading-2 text-text-primary">{feature.title}</h3>
              <p className="text-body text-text-secondary leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Compliance badges row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          {["SOC 2 Type II", "ISO 27001", "GDPR Ready", "FedRAMP Aligned", "AWS GovCloud"].map((badge) => (
            <span
              key={badge}
              className="text-mono text-text-tertiary border border-border-subtle px-3 py-1.5 rounded-sm text-xs"
            >
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
