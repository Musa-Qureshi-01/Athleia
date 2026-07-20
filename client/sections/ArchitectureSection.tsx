"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { PIPELINE_STEPS } from "@/lib/constants";

export function ArchitectureSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="architecture" className="section-spacing border-b border-border-subtle" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="container-editorial">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-2xl"
        >
          <span className="text-label text-text-tertiary block mb-4">
            System Architecture
          </span>
          <h2 className="text-heading-1 text-text-primary mb-6">
            The Reasoning Pipeline
          </h2>
          <p className="text-body-lg text-text-secondary leading-relaxed">
            A four-stage intelligence pipeline transforms raw industrial documents
            into verified, citation-backed answers — with full audit telemetry at
            every step.
          </p>
        </motion.div>

        {/* Pipeline Steps */}
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Step Tabs */}
          <div className="flex flex-col gap-px border border-border-subtle rounded-sm overflow-hidden">
            {PIPELINE_STEPS.map((step, i) => (
              <motion.button
                key={step.step}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setActiveStep(i)}
                className="flex items-start gap-5 p-5 lg:p-6 text-left transition-colors duration-150 border-b border-border-subtle last:border-b-0"
                style={{
                  backgroundColor:
                    activeStep === i ? "var(--bg-primary)" : "var(--bg-tertiary)",
                }}
              >
                <span
                  className="text-mono shrink-0 mt-0.5"
                  style={{ color: activeStep === i ? "var(--accent)" : "var(--text-tertiary)" }}
                >
                  {step.step}
                </span>
                <div className="flex flex-col gap-1">
                  <span
                    className="text-body font-medium"
                    style={{ color: activeStep === i ? "var(--text-primary)" : "var(--text-secondary)" }}
                  >
                    {step.title}
                  </span>
                  {activeStep === i && (
                    <span className="text-mono text-text-tertiary mt-0.5">{step.technical}</span>
                  )}
                </div>
                {/* Active indicator */}
                {activeStep === i && (
                  <div className="ml-auto shrink-0 w-1 self-stretch rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                )}
              </motion.button>
            ))}
          </div>

          {/* Step Detail Panel */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 p-6 lg:p-8 border border-border-subtle rounded-sm"
            style={{ backgroundColor: "var(--bg-primary)" }}
          >
            <div className="flex items-center gap-3">
              <span className="text-mono" style={{ color: "var(--accent)" }}>
                Step {PIPELINE_STEPS[activeStep].step}
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
            </div>
            <h3 className="text-heading-2 text-text-primary">
              {PIPELINE_STEPS[activeStep].title}
            </h3>
            <p className="text-body-lg text-text-secondary leading-relaxed">
              {PIPELINE_STEPS[activeStep].description}
            </p>
            <div
              className="p-4 rounded-sm border border-border-subtle"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <span className="text-label text-text-tertiary block mb-2">Technology Stack</span>
              <span className="text-mono text-text-secondary">{PIPELINE_STEPS[activeStep].technical}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
