"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { CheckCircle2, ArrowRight, ShieldCheck, Lock, Server, Cpu, Building2 } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    id: "growth",
    badge: "Plant Pilot & Regional",
    name: "Growth Plan",
    description: "Designed for single-facility operations and pilot deployments evaluating automated SOP reasoning.",
    idealFor: "Single-plant operations & regional facilities",
    priceLabel: "Custom Quote",
    ctaText: "Request Demo",
    popular: false,
    capabilities: [
      "Single-plant document corpus (up to 50,000 pages)",
      "Automated P&ID drawing & CAD schematic OCR",
      "Workforce Copilot assistant & citation engine",
      "ISO 45001 & OSHA regulatory compliance evaluation",
      "Standard email support with 1 business day SLA",
    ],
  },
  {
    id: "enterprise",
    badge: "Multi-Facility Enterprise",
    name: "Enterprise Operations",
    description: "Purpose-built for multi-plant industrial organizations requiring dedicated model instances and custom CMMS/SOP integrations.",
    idealFor: "Multi-site enterprises & global operators",
    priceLabel: "Enterprise Quote",
    ctaText: "Contact Sales",
    popular: true,
    capabilities: [
      "Unlimited multi-site document ingestion & vector index",
      "Dedicated LLM instance & customer-managed KMS encryption",
      "Real-time vibration & telemetry MTBF ledger integration",
      "Role-based access control (RBAC) & SAML/SSO authentication",
      "Dedicated platform engineer with 4-hour SLA guarantee",
    ],
  },
  {
    id: "airgapped",
    badge: "Defensive & Sovereign",
    name: "Air-Gapped / Custom",
    description: "Tailored for defense, nuclear power, and strictly regulated air-gapped facilities requiring zero outbound internet connectivity.",
    idealFor: "Defense, critical infrastructure & sovereign plants",
    priceLabel: "Custom Specification",
    ctaText: "Talk to Architecture Team",
    popular: false,
    capabilities: [
      "100% air-gapped on-premise local server hardware deployment",
      "Full offline vector index & local LLM weight execution",
      "Zero telemetry, zero external network dependency",
      "Custom P&ID symbol lexicon & proprietary schema tuning",
      "24/7 critical plant emergency support (15-min SLA)",
    ],
  },
];

const DEPLOYMENT_MODELS = [
  {
    icon: Server,
    title: "Cloud / Managed SaaS",
    description: "Fully managed isolated cloud instance hosted on secure multi-tenant infrastructure with end-to-end encryption.",
    isolation: "Logical Separation & Isolated DB",
    keys: "Platform KMS Encryption",
    updates: "Automated Continuous Updates",
  },
  {
    icon: Lock,
    title: "Private Customer VPC",
    description: "Deployed directly within your AWS VPC or Microsoft Azure subscription with customer-controlled data perimeter.",
    isolation: "VPC Air-Gapped Network",
    keys: "Customer KMS & BYOK Support",
    updates: "Controlled Release Cycles",
  },
  {
    icon: Cpu,
    title: "On-Premise Air-Gapped",
    description: "100% offline deployment on local plant server hardware. Zero outbound traffic, zero cloud dependencies.",
    isolation: "100% Physical Air-Gap",
    keys: "Hardware Security Module (HSM)",
    updates: "Manual Air-Gap Patching",
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-16 bg-bg-primary text-text-primary">
        <div className="container-editorial">

          {/* Concise Enterprise Header */}
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-tertiary font-semibold block">
              ENTERPRISE DEPLOYMENT PLANS
            </span>
            <h1 className="text-display text-text-primary leading-tight">
              Industrial AI Deployment Plans &amp; Architecture.
            </h1>
            <p className="text-body-lg text-text-secondary leading-relaxed max-w-2xl">
              Flexible deployment models designed for safety-critical plant operations, private customer VPCs, and sovereign air-gapped environments.
            </p>
          </div>

          {/* 3 Concise Enterprise Plan Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {PLANS.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`p-7 rounded-sm border flex flex-col justify-between gap-6 transition-all ${
                  plan.popular
                    ? "bg-bg-secondary border-border-strong shadow-lg ring-1 ring-accent/30"
                    : "bg-bg-primary border-border-subtle hover:border-border-strong"
                }`}
              >
                <div className="space-y-4">
                  {/* Badge & Title */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold">
                      {plan.badge}
                    </span>
                    <h2 className="text-heading-2 text-text-primary font-semibold">
                      {plan.name}
                    </h2>
                    <p className="text-xs text-text-secondary leading-relaxed pt-1">
                      {plan.description}
                    </p>
                  </div>

                  {/* Ideal Customer Label & Pricing Tag */}
                  <div className="py-3 border-y border-border-subtle/80 space-y-1">
                    <div className="text-[11px] font-mono text-text-tertiary">
                      Ideal For: <span className="text-text-primary font-sans font-medium">{plan.idealFor}</span>
                    </div>
                    <div className="text-sm font-mono font-bold text-text-primary pt-0.5">
                      {plan.priceLabel}
                    </div>
                  </div>

                  {/* Key Capabilities */}
                  <div className="space-y-2.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold block">
                      Key Capabilities
                    </span>
                    <ul className="space-y-2 text-xs text-text-secondary">
                      {plan.capabilities.map((cap, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
                          <span className="leading-normal">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <div className="pt-2">
                  <Link
                    href="/contact"
                    className={`w-full h-10 rounded-sm text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      plan.popular
                        ? "bg-text-primary text-bg-primary hover:opacity-90 shadow-xs"
                        : "bg-bg-secondary text-text-primary border border-border-strong hover:bg-bg-primary"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Deployment Models Comparison Section */}
          <div className="pt-12 border-t border-border-subtle mb-16 space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-tertiary font-semibold block">
                DEPLOYMENT ARCHITECTURES
              </span>
              <h2 className="text-heading-1 text-text-primary">
                Supported Deployment Environments
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Athleia microservices are packaged as OCI-compliant container clusters designed to run seamlessly in multi-tenant SaaS, customer VPCs, or air-gapped hardware.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DEPLOYMENT_MODELS.map((model, mIdx) => {
                const Icon = model.icon;
                return (
                  <div
                    key={mIdx}
                    className="p-6 rounded-sm border border-border-subtle bg-bg-secondary space-y-4"
                  >
                    <div className="w-9 h-9 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                      <Icon size={18} />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-text-primary">
                        {model.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {model.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border-subtle/80 space-y-1.5 text-[11px] font-mono text-text-tertiary">
                      <div className="flex justify-between">
                        <span>Isolation:</span>
                        <span className="text-text-primary font-medium">{model.isolation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Key Ownership:</span>
                        <span className="text-text-primary font-medium">{model.keys}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Patching:</span>
                        <span className="text-text-primary font-medium">{model.updates}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Enterprise CTA Banner */}
          <div className="p-8 lg:p-10 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold block">
                TECHNICAL ARCHITECTURE REVIEW
              </span>
              <h3 className="text-heading-2 text-text-primary">
                Need a Custom Air-Gapped or Multi-Plant Deployment Plan?
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Connect directly with our platform architecture team to evaluate document volumes, P&amp;ID complexity, and VPC infrastructure specs.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-11 px-6 rounded-sm text-xs font-semibold bg-text-primary text-bg-primary hover:opacity-90 transition-opacity shrink-0 shadow-xs"
            >
              <span>Schedule Architecture Review</span>
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
