"use client";

import { motion } from "framer-motion";
import { Quote, Star, CheckCircle, Shield, Building2 } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  companyType: string;
  badge: string;
  initials: string;
  metricsHighlight?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "testimonial-1",
    quote:
      "Axios solved the single hardest problem in enterprise AI: respecting complex, dynamic permission hierarchies across thirty disparate enterprise tools. Our engineers get direct, verified answers without our security team ever losing sleep.",
    author: "Elena Rostova",
    role: "Chief Technology Officer",
    companyType: "Global Logistics & Freight Enterprise",
    badge: "15,000+ Active Seats",
    initials: "ER",
    metricsHighlight: "Saved 4.2 hrs/engineer weekly",
  },
  {
    id: "testimonial-2",
    quote:
      "Before Axios, onboarding a senior engineer took nearly two months of hunting down outdated Confluence docs and Slack threads. Now they query our entire architectural history and commit production-ready code in their second week.",
    author: "Marcus Chen",
    role: "VP of Engineering & Systems Architecture",
    companyType: "Cloud Financial Services",
    badge: "Enterprise Production Tier",
    initials: "MC",
    metricsHighlight: "70% faster engineer ramp time",
  },
  {
    id: "testimonial-3",
    quote:
      "The zero-retention guarantee and VPC isolation gave our risk and compliance committee the confidence to roll out AI across every department. The citations are verifiable, and the agentic execution has eliminated hours of manual data wrangling.",
    author: "Sarah Lindqvist",
    role: "Head of Operational Risk & Governance",
    companyType: "Multinational Asset Management",
    badge: "FINRA & SOC2 Audited",
    initials: "SL",
    metricsHighlight: "Zero compliance violations",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-32 bg-bg-primary border-b border-border-subtle relative">
      <div className="container-editorial">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-subtle bg-bg-secondary text-text-secondary text-xs font-mono font-medium mb-4 shadow-2xs">
            <Quote size={13} className="text-accent" />
            <span>EXECUTIVE PERSPECTIVES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.12] mb-5">
            Trusted by technology leaders{" "}
            <span className="text-accent">to power daily decisions.</span>
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            Hear from engineering and operational leaders who rely on Axios to unlock institutional memory at scale.
          </p>
        </div>

        {/* 3-Card Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="group relative bg-bg-secondary/40 border border-border-subtle hover:border-accent/40 rounded-md p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-lg"
            >
              <div>
                {/* Header Quote Icon & Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                    <Quote size={18} className="rotate-180" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-bg-primary text-text-secondary border border-border-subtle shadow-2xs">
                    {item.badge}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-sm sm:text-base text-text-primary leading-relaxed mb-6 font-normal">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 border-t border-border-subtle">
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-11 h-11 rounded-full bg-accent text-bg-primary font-mono font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary leading-tight">
                      {item.author}
                    </h4>
                    <p className="text-xs text-text-secondary leading-snug mt-0.5">
                      {item.role}
                    </p>
                    <p className="text-[11px] font-mono text-text-tertiary">
                      {item.companyType}
                    </p>
                  </div>
                </div>

                {item.metricsHighlight && (
                  <div className="mt-2 pt-2 border-t border-border-subtle/50 flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-700">
                    <CheckCircle size={13} className="text-emerald-600 shrink-0" />
                    <span>{item.metricsHighlight}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 text-center">
          <p className="text-xs text-text-tertiary font-mono">
            * Quotations represent illustrative enterprise persona evaluations of the Axios architecture.
          </p>
        </div>
      </div>
    </section>
  );
}

