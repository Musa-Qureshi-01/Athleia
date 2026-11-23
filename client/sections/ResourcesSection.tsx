"use client";

import { motion } from "framer-motion";
import { BookOpen, FileText, ArrowRight, Sparkles, Layers, Shield, Cpu, Lightbulb } from "lucide-react";

interface ResourceCard {
  id: string;
  category: string;
  type: "Report" | "Whitepaper" | "Architecture Guide" | "Product Update";
  readTime: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const RESOURCES: ResourceCard[] = [
  {
    id: "resource-1",
    category: "ANNUAL BENCHMARK REPORT",
    type: "Report",
    readTime: "18 min read",
    title: "The State of Enterprise AI: Transitioning from Generic Chatbots to Verified Organizational Context.",
    description: "An empirical survey of 450 enterprise technology leaders exploring why standalone LLMs stall, and how live Knowledge Graphs unlock sustained 90%+ daily workforce adoption.",
    icon: BookOpen,
  },
  {
    id: "resource-2",
    category: "CISO SECURITY BRIEFING",
    type: "Whitepaper",
    readTime: "12 min read",
    title: "The Zero-Retention Architecture: Protecting Enterprise IP and Preventing Training Leakage.",
    description: "A technical architectural blueprint detailing customer tenant VPC isolation, end-to-end envelope encryption, and sub-second ACL permission synchronization.",
    icon: Shield,
  },
  {
    id: "resource-3",
    category: "ENGINEERING ARCHITECTURE",
    type: "Architecture Guide",
    readTime: "15 min read",
    title: "Why Pure Vector RAG Fails in Production Without an Enterprise Knowledge Graph.",
    description: "How combining hybrid dense-sparse vector search with graph-based entity resolution eliminates hallucinations, obsolete document bias, and tribal knowledge confusion.",
    icon: Cpu,
  },
  {
    id: "resource-4",
    category: "PRODUCT PLATFORM UPDATE",
    type: "Product Update",
    readTime: "6 min read",
    title: "Axios Autumn Release: Autonomous Multi-Step Workflows & 275+ Enterprise SaaS Connectors.",
    description: "Announcing deterministic tool calling, background agent execution, enhanced CAD and P&ID vector parsing, and deep Microsoft 365 Copilot interoperability.",
    icon: Lightbulb,
  },
];

export function ResourcesSection() {
  return (
    <section id="resources" className="py-24 lg:py-32 bg-bg-primary border-b border-border-subtle relative">
      <div className="container-editorial">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-subtle bg-bg-secondary text-text-secondary text-xs font-mono font-medium mb-4 shadow-2xs">
              <BookOpen size={14} className="text-accent" />
              <span>RESEARCH &amp; THOUGHT LEADERSHIP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.12]">
              Insights for engineering and{" "}
              <span className="text-accent">technology leaders.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/resources"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-accent hover:text-text-primary transition-colors cursor-pointer"
            >
              <span>Explore all enterprise whitepapers &amp; research</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* 4 Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {RESOURCES.map((res, idx) => {
            const Icon = res.icon;
            return (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group bg-bg-secondary/40 border border-border-subtle hover:border-accent/40 rounded-xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-text-tertiary mb-4">
                    <span className="px-2 py-0.5 rounded bg-bg-primary border border-border-subtle/80 text-[10px] uppercase font-semibold text-accent">
                      {res.type}
                    </span>
                    <span>{res.readTime}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-text-primary mb-3 leading-snug group-hover:text-accent transition-colors line-clamp-3">
                    {res.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-4 mb-6">
                    {res.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border-subtle/60 flex items-center justify-between text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">
                  <span>Read publication</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

