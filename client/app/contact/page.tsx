"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { FormalDropdown, DropdownOption } from "@/components/ui/FormalDropdown";
import { Mail, ShieldCheck, Clock, Building2, MapPin, CheckCircle2, Send, PhoneCall, AlertCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inquiryType, setInquiryType] = useState("enterprise");
  const [supportTier, setSupportTier] = useState("standard");

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xbdnkgjr";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    const payload = {
      name: formData.get("name"),
      company: formData.get("company"),
      email: formData.get("email"),
      role: formData.get("role") || "Not Specified",
      inquiry_category: inquiryType,
      support_sla: supportTier,
      message: formData.get("message"),
    };

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        if (data && data.errors && Array.isArray(data.errors)) {
          setErrorMsg(data.errors.map((err: any) => err.message || `${err.field} issue`).join(", "));
        } else {
          setErrorMsg("Formspree rejected submission. Please ensure a valid work email address is entered.");
        }
      }
    } catch (err) {
      console.error("Formspree submission error", err);
      setErrorMsg("Network error sending form. Please email musaqureshi0000@gmail.com directly.");
    } finally {
      setSubmitting(false);
    }
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

              {/* Direct Contact Info */}
              <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary font-semibold block">
                  Direct Contact Information
                </span>

                <div className="space-y-3 text-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-text-tertiary font-mono">Email Address</span>
                    <a href="mailto:musaqureshi0000@gmail.com" className="text-text-primary font-medium hover:text-accent transition-colors font-mono">
                      musaqureshi0000@gmail.com
                    </a>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-text-tertiary font-mono">Mobile Number</span>
                    <a href="tel:+916263473208" className="text-text-primary font-medium hover:text-accent transition-colors font-mono">
                      +91 6263473208
                    </a>
                  </div>
                </div>
              </div>

              {/* Corporate Location */}
              <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary font-semibold block">
                  Corporate Location
                </span>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-accent shrink-0" />
                    <span className="text-text-primary font-medium">Bhopal, Madhya Pradesh 462001, India</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Formspree Contact Form (7 cols) */}
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
                    <span>Inquiry Registered via Formspree</span>
                  </div>
                  <h2 className="text-heading-2 text-text-primary">
                    Thank you. Our engineering team has received your inquiry.
                  </h2>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Your message has been logged via Formspree endpoint (xbdnkgjr). A senior platform engineer will review your technical query and respond within your selected SLA window. If your plant requires immediate escalation, please email enterprise@athleia.ai directly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  action={FORMSPREE_ENDPOINT}
                  method="POST"
                  className="p-8 rounded-sm border border-border-subtle bg-bg-secondary space-y-5"
                >
                  {errorMsg && (
                    <div className="p-3 rounded-sm bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-text-primary">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Jane Smith"
                        className="bg-bg-primary border border-border-subtle rounded-sm px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-text-primary">Company / Industrial Facility</label>
                      <input
                        type="text"
                        name="company"
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
                        name="email"
                        required
                        placeholder="jane.smith@acme.com"
                        className="bg-bg-primary border border-border-subtle rounded-sm px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-text-primary">Job Title &amp; Role</label>
                      <input
                        type="text"
                        name="role"
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
                      name="message"
                      required
                      rows={4}
                      placeholder="Describe your document volume (e.g., 500 P&ID drawings and SOP manuals), deployment environment (AWS VPC, Azure, or air-gapped), and desired copilot integration..."
                      className="bg-bg-primary border border-border-subtle rounded-sm px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent resize-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-[11px] font-mono text-text-tertiary">
                      Formspree Endpoint: xbdnkgjr
                    </span>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 bg-text-primary text-bg-primary rounded-sm text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1.5 shadow-sm"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          <span>Send Technical Inquiry</span>
                        </>
                      )}
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
