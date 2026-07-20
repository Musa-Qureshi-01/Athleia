"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { KNOWLEDGE_PRIORITIES } from "@/lib/constants";

export function KnowledgePrioritySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="platform" className="section-spacing border-b border-border-subtle">
      <div className="container-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Left — Section Label & Heading */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-label text-text-tertiary block mb-4">
                Platform Architecture
              </span>
              <h2 className="text-heading-1 text-text-primary mb-6">
                4-Tier Knowledge Priority Dispatcher
              </h2>
              <p className="text-body-lg text-text-secondary leading-relaxed">
                Athleia enforces a strict knowledge authority hierarchy. Enterprise
                documents always outrank external sources. No answer is generated
                without verified grounding.
              </p>
            </motion.div>
          </div>

          {/* Right — Priority Tiers */}
          <div ref={ref} className="lg:col-span-8 flex flex-col divide-y divide-border-subtle">
            {KNOWLEDGE_PRIORITIES.map((tier, i) => (
              <motion.div
                key={tier.priority}
                initial={{ opacity: 0, x: 16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-12 gap-6 py-8 first:pt-0 last:pb-0"
              >
                {/* Priority Number */}
                <div className="col-span-2 lg:col-span-1">
                  <span className="text-mono text-text-tertiary">{tier.priority}</span>
                </div>

                {/* Tier Content */}
                <div className="col-span-10 lg:col-span-11 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <h3 className="text-heading-2 text-text-primary">{tier.label}</h3>
                    <span
                      className="text-mono px-2.5 py-1 rounded-sm border text-xs shrink-0"
                      style={{
                        color: i === 3 ? "var(--status-warning)" : "var(--status-verified)",
                        borderColor: i === 3 ? "var(--status-warning)" : "var(--status-verified)",
                        opacity: 0.8
                      }}
                    >
                      {tier.weight}
                    </span>
                  </div>
                  <p className="text-body text-text-secondary leading-relaxed">
                    {tier.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tier.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-mono text-text-tertiary border border-border-subtle px-2 py-0.5 rounded-sm text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
