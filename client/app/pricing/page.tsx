"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { PRICING_TIERS } from "@/lib/enterprise-data";
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, Lock, HelpCircle, ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    q: "Can Athleia be deployed inside our private cloud (VPC) or local plant servers?",
    a: "Yes. Athleia is 100% air-gap compatible. We support AWS VPC, Microsoft Azure, and local plant server hardware with customer-managed KMS encryption keys. Zero document data ever leaves your network.",
  },
  {
    q: "How does Athleia guarantee zero AI fabrication or hallucinations?",
    a: "Athleia enforces a hard-coded zero-fabrication grounding evaluator. Every factual statement must link directly to an ingested document page, section, and P&ID drawing tag. If sufficient evidence isn't found in your corpus, Athleia explicitly reports insufficient evidence.",
  },
  {
    q: "What engineering document formats are supported out of the box?",
    a: "Athleia ingests P&ID schematics, CAD exports, scanned PDF drawings, SOP manuals, CMMS work orders, calibration logs, and ISO/OSHA regulatory standard PDFs using multi-pass OCR and overlapping chunking.",
  },
  {
    q: "How does pricing scale for multi-facility enterprise deployments?",
    a: "The Enterprise Operations tier includes unlimited document ingestion and unlimited users across all plant sites within your corporate organization. Custom defense and multi-site deployments can opt for flat annual VPC license models.",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 bg-bg-primary text-text-primary">
        <div className="container-editorial">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary font-semibold">
              Enterprise Pricing Models
            </span>
            <h1 className="text-display text-text-primary leading-tight">
              Predictable Enterprise Licensing for Industrial AI.
            </h1>
            <p className="text-body-lg text-text-secondary leading-relaxed">
              Transparent, high-ROI plans with zero hidden token fees. Deploy cloud shared, private VPC, or 100% air-gapped local plant clusters.
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={cn("text-xs font-medium", !isAnnual ? "text-text-primary" : "text-text-tertiary")}>
                Monthly Billing
              </span>
              <button
                onClick={() => setIsAnnual((v) => !v)}
                className="w-12 h-6.5 rounded-full bg-bg-secondary border border-border-strong p-0.5 transition-colors relative"
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full bg-accent transition-transform duration-200",
                    isAnnual ? "translate-x-5.5" : "translate-x-0"
                  )}
                />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={cn("text-xs font-medium", isAnnual ? "text-text-primary" : "text-text-tertiary")}>
                  Annual Billing
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-status-verified/15 text-status-verified font-bold border border-status-verified/20">
                  Save 20%
                </span>
              </div>
            </div>
          </div>

          {/* 3 Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  "p-8 rounded-sm border transition-all duration-300 flex flex-col justify-between gap-8 relative",
                  tier.popular
                    ? "bg-bg-secondary border-border-strong shadow-xl ring-1 ring-accent/30"
                    : "bg-bg-primary border-border-subtle hover:border-border-strong shadow-2xs"
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider bg-accent text-white shadow-xs">
                    {tier.badge}
                  </div>
                )}

                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-accent font-semibold">{tier.badge}</span>
                    <h3 className="text-heading-2 text-text-primary">{tier.name}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed pt-1">{tier.description}</p>
                  </div>

                  {/* Pricing Number */}
                  <div className="pt-2 pb-4 border-b border-border-subtle flex items-baseline gap-1.5">
                    {typeof tier.priceMonthly === "number" ? (
                      <>
                        <span className="text-3xl font-bold font-mono text-text-primary">
                          ${isAnnual ? tier.priceAnnual : tier.priceMonthly}
                        </span>
                        <span className="text-xs text-text-tertiary font-mono">/ facility / month</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold font-mono text-text-primary">Custom Quote</span>
                    )}
                  </div>

                  {/* Feature Checkmarks */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold block">
                      Included Platform Features
                    </span>
                    <div className="space-y-2 text-xs">
                      {tier.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-text-secondary">
                          <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className={cn(
                    "w-full py-3 rounded-sm text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs",
                    tier.popular
                      ? "bg-text-primary text-bg-primary hover:opacity-90"
                      : "bg-bg-secondary text-text-primary border border-border-strong hover:bg-bg-primary"
                  )}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          {/* Enterprise FAQ Section */}
          <div className="max-w-3xl mx-auto pt-10 border-t border-border-subtle">
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary font-semibold">
                Enterprise FAQ
              </span>
              <h2 className="text-heading-2 text-text-primary">
                Frequently Asked Architecture Questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-border-subtle rounded-sm bg-bg-secondary overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4.5 text-left text-xs font-semibold text-text-primary flex items-center justify-between gap-4"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        size={16}
                        className={cn("text-text-tertiary transition-transform duration-200 shrink-0", isOpen && "rotate-180 text-accent")}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4.5 pb-4 text-xs text-text-secondary leading-relaxed border-t border-border-subtle/50 pt-3 bg-bg-primary/50">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
