"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { FormalDropdown, DropdownOption } from "@/components/ui/FormalDropdown";
import { Mail, ShieldCheck, Clock, Building2, MapPin, CheckCircle2, Send, PhoneCall } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [inquiryType, setInquiryType] = useState("enterprise");
  const [supportTier, setSupportTier] = useState("standard");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const INQUIRY_OPTIONS: DropdownOption[] = [
    { value: "enterprise", label: "Enterprise Microservice Deployment", description: "Deploy Athleia on-premise or within customer VPC" },
    { value: "copilot", label: "Workforce Copilot Integration", description: "LangGraph agent & SOP knowledge integration" },
    { value: "compliance", label: "ISO 45001 & OSHA Compliance Audit", description: "Autonomous governance and risk scoring scans" },
    { value: "maintenance", label: "Predictive Maintenance Telemetry", description: "Vibration sensor and MTBF ledger setup" },
    { value: "security", label: "Security & RBAC Architecture Review", description: "Argon2id, JWT, and Neon Postgres data security" },
  ];

  const TIER_OPTIONS: DropdownOption[] = [
    { value: "standard", label: "Standard Business Support", description: "Email response within 1 business day" },
    { value: "priority", label: "Priority Plant Operational", description: "Dedicated engineer & 4-hour SLA" },
    { value: "emergency", label: "24/7 Critical Plant Support", description: "15-minute emergency response guarantee" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-bg-primary text-text-primary">
        <div className="container-editorial py-12 lg:py-16">
          
          {/* Header Title Banner */}
          <div className="mb-12 space-y-3 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary">
              Engineering Support &amp; Deployment
            </span>
            <h1 className="text-heading-1 text-text-primary">
              Connect directly with our Enterprise Architecture Team.
            </h1>
            <p className="text-body-lg text-text-secondary leading-relaxed">
              We skip standard sales scripts. Speak directly with platform engineers to evaluate your document corpus, security requirements, and VPC deployment architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left Context Cards (5 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="lg:col-span-5 flex flex-col gap-6"
            >
              {/* Emergency Plant SLA Card */}
              <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-status-verified animate-pulse" />
                  <span className="text-xs font-mono font-semibold text-text-primary uppercase tracking-wider">
                    Response SLA Guarantee
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Plant operational inquiries receive technical responses within 1 business day. Production emergencies receive 15-minute response SLA.
                </p>
                <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-tertiary">
                  <span>SLA Status: ACTIVE</span>
                  <span className="text-status-verified font-bold">100% On-Time</span>
                </div>
              </div>

              {/* Direct Email Channels */}
              <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary font-semibold block">
                  Direct Email Contacts
                </span>

                <div className="space-y-3 text-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-text-tertiary font-mono">Enterprise &amp; Deployment</span>
                    <a href="mailto:enterprise@athleia.ai" className="text-text-primary font-medium hover:text-accent transition-colors">
                      enterprise@athleia.ai
                    </a>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-text-tertiary font-mono">Security &amp; Compliance Audits</span>
                    <a href="mailto:security@athleia.ai" className="text-text-primary font-medium hover:text-accent transition-colors">
                      security@athleia.ai
                    </a>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-text-tertiary font-mono">Workforce Copilot Support</span>
                    <a href="mailto:copilot@athleia.ai" className="text-text-primary font-medium hover:text-accent transition-colors">
                      copilot@athleia.ai
                    </a>
                  </div>
                </div>
              </div>

              {/* Global Engineering Offices */}
              <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary font-semibold block">
                  Engineering Hubs
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-accent shrink-0" />
                    <span className="text-text-primary font-medium">Stockholm, Sweden</span>
                    <span className="text-text-tertiary text-[10px] font-mono ml-auto">HQ &amp; Core Engine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-accent shrink-0" />
                    <span className="text-text-primary font-medium">Houston, Texas</span>
                    <span className="text-text-tertiary text-[10px] font-mono ml-auto">Industrial Ops</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-accent shrink-0" />
                    <span className="text-text-primary font-medium">London, UK</span>
                    <span className="text-text-tertiary text-[10px] font-mono ml-auto">EMEA Security</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Contact Form (7 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="lg:col-span-7"
            >
              {submitted ? (
                <div className="p-8 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-status-verified font-mono text-xs">
                    <CheckCircle2 size={16} />
                    <span>Inquiry Registered</span>
                  </div>
                  <h2 className="text-heading-2 text-text-primary">
                    Thank you. Our engineering team has received your message.
                  </h2>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    A senior platform engineer will review your technical query and respond within your selected SLA window. If your plant requires immediate escalation, please email enterprise@athleia.ai directly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="p-8 rounded-sm border border-border-subtle bg-bg-secondary space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-text-primary">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Jane Smith"
                        className="bg-bg-primary border border-border-subtle rounded-sm px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-text-primary">Company / Industrial Facility</label>
                      <input
                        type="text"
                        required
                        placeholder="Acme Industrial Corp"
                        className="bg-bg-primary border border-border-subtle rounded-sm px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-text-primary">Work Email</label>
                      <input
                        type="email"
                        required
                        placeholder="jane.smith@acme.com"
                        className="bg-bg-primary border border-border-subtle rounded-sm px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-text-primary">Job Title &amp; Role</label>
                      <input
                        type="text"
                        placeholder="Lead Operations Engineer"
                        className="bg-bg-primary border border-border-subtle rounded-sm px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FormalDropdown
                        label="Inquiry Category"
                        options={INQUIRY_OPTIONS}
                        value={inquiryType}
                        onChange={setInquiryType}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <FormalDropdown
                        label="Support SLA Requirement"
                        options={TIER_OPTIONS}
                        value={supportTier}
                        onChange={setSupportTier}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-text-primary">Technical Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your document volume (e.g., 500 P&ID drawings and SOP manuals), deployment environment (AWS VPC, Azure, or air-gapped), and desired copilot integration..."
                      className="bg-bg-primary border border-border-subtle rounded-sm px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent resize-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-[11px] font-mono text-text-tertiary">
                      Direct engineering review • Zero sales fluff
                    </span>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-text-primary text-bg-primary rounded-sm text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                    >
                      <Send size={13} />
                      <span>Send Technical Inquiry</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
