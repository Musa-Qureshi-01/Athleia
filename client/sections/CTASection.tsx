"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="cta" className="section-spacing border-b border-border-subtle">
      <div className="container-editorial">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <span className="text-label text-text-tertiary block mb-8">
            Schedule a Technical Review
          </span>

          <h2 className="text-display text-text-primary mb-8 leading-tight">
            Ready to Deploy Industrial Intelligence at Enterprise Scale?
          </h2>

          <p className="text-body-lg text-text-secondary leading-relaxed mb-12 max-w-xl">
            Our engineering team will walk you through a deployment architecture review,
            demonstrate live P&amp;ID reasoning against your document corpus, and
            design a VPC-isolated deployment plan tailored to your infrastructure.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="mailto:enterprise@athleia.ai"
              className="inline-flex items-center h-11 px-7 rounded-sm text-sm font-medium bg-text-primary text-bg-primary hover:opacity-85 transition-opacity duration-200"
            >
              Request Enterprise Demo
            </a>
            <a
              href="#architecture"
              className="inline-flex items-center h-11 px-7 rounded-sm text-sm font-medium border border-border-strong text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors duration-200"
            >
              View Architecture Spec →
            </a>
          </div>

          <div className="mt-10 pt-10 border-t border-border-subtle flex flex-wrap gap-8">
            {[
              { label: "Response time", value: "< 24 hours" },
              { label: "Demo format", value: "Live technical walkthrough" },
              { label: "Deployment timeline", value: "2–4 weeks to production" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="text-mono text-text-tertiary">{item.label}</span>
                <span className="text-body font-medium text-text-primary">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
