"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { API_EXAMPLE, API_RESPONSE_EXAMPLE } from "@/lib/constants";

const TABS = ["Request", "Response"] as const;

export function DeveloperSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [tab, setTab] = useState<"Request" | "Response">("Request");

  return (
    <section id="developers" className="section-spacing border-b border-border-subtle">
      <div className="container-editorial">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <span className="text-label text-text-tertiary">Developer Experience</span>
            <h2 className="text-heading-1 text-text-primary">
              REST API Designed for Engineering Systems.
            </h2>
            <p className="text-body-lg text-text-secondary leading-relaxed">
              A single authenticated POST request returns a fully-grounded, citation-backed
              reasoning response. Integrate Athleia directly into your SCADA systems,
              maintenance portals, or engineering decision workflows.
            </p>

            <div className="flex flex-col gap-3 mt-2">
              {[
                "SDK available for Python, TypeScript, and Go",
                "JWT + API key authentication",
                "OpenAPI 3.1 specification",
                "Webhook support for async reasoning jobs",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--accent)" }} />
                  <span className="text-body text-text-secondary">{feature}</span>
                </div>
              ))}
            </div>

            <a
              href="#"
              className="inline-flex items-center h-9 px-5 rounded-sm text-sm font-medium w-fit mt-2 border border-border-strong text-text-primary hover:bg-bg-secondary transition-colors"
            >
              View API Reference →
            </a>
          </motion.div>

          {/* Right — Code Block */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="border border-border-subtle rounded-sm overflow-hidden">
              {/* Code panel header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--border-strong)" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--border-strong)" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--border-strong)" }} />
                </div>
                <div className="flex gap-1">
                  {TABS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className="text-mono text-xs px-3 py-1 rounded-sm transition-colors"
                      style={{
                        backgroundColor: tab === t ? "var(--bg-primary)" : "transparent",
                        color: tab === t ? "var(--text-primary)" : "var(--text-tertiary)",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code content */}
              <div
                className="overflow-x-auto"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <pre className="text-mono text-text-secondary text-xs p-5 leading-relaxed whitespace-pre-wrap break-all">
                  <code>{tab === "Request" ? API_EXAMPLE : API_RESPONSE_EXAMPLE}</code>
                </pre>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
