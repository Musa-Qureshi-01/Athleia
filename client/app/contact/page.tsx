"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { FormalDropdown, DropdownOption } from "@/components/ui/FormalDropdown";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

const INDUSTRY_OPTIONS: DropdownOption[] = [
  { value: "manufacturing", label: "Heavy Manufacturing & Automotive" },
  { value: "oil-gas", label: "Oil, Gas & Energy Refineries" },
  { value: "power", label: "Power Generation & Public Utilities" },
  { value: "chemical", label: "Chemical & Materials Processing" },
  { value: "defense", label: "Defense & Sovereign Infrastructure" },
  { value: "other", label: "Other Industrial Enterprise" },
];

const COMPANY_SIZE_OPTIONS: DropdownOption[] = [
  { value: "1-100", label: "1 – 100 Employees" },
  { value: "101-500", label: "101 – 500 Employees" },
  { value: "501-2500", label: "501 – 2,500 Employees" },
  { value: "2500+", label: "2,500+ Enterprise Employees" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [industry, setIndustry] = useState("manufacturing");
  const [companySize, setCompanySize] = useState("501-2500");

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
      phone: formData.get("phone") || "Not Provided",
      industry: industry,
      company_size: companySize,
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
          setErrorMsg(data.errors.map((err: any) => err.message || "Field error").join(", "));
        } else {
          setErrorMsg("Form submission failed. Please verify your work email and try again.");
        }
      }
    } catch (err) {
      console.error("Formspree submission error", err);
      setErrorMsg("Network error sending form. Please email musaqureshi0000@gmail.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-16 bg-bg-primary text-text-primary">
        <div className="container-editorial">

          {/* Concise Hero Header */}
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-tertiary font-semibold block">
              CONTACT ATHLEIA
            </span>
            <h1 className="text-display text-text-primary leading-tight">
              Contact Our Enterprise Team
            </h1>
            <p className="text-body-lg text-text-secondary leading-relaxed">
              Speak directly with our solutions team to explore deployment options or request a platform demo.
            </p>
          </div>

          {/* Main Contact Form & Office Info Grid (Single Compact View) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

            {/* Left Contact Form (7 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-7"
            >
              {submitted ? (
                <div className="p-8 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-status-verified font-mono text-xs">
                    <CheckCircle2 size={18} />
                    <span>Inquiry Submitted Successfully</span>
                  </div>
                  <h2 className="text-heading-2 text-text-primary">
                    Thank you. Our team has received your message.
                  </h2>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    A representative will review your inquiry and respond within 1 business day. If you need immediate assistance, email us at musaqureshi0000@gmail.com.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="p-7 rounded-sm border border-border-subtle bg-bg-secondary space-y-5 shadow-xs"
                >
                  {errorMsg && (
                    <div className="p-3.5 rounded-sm bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-text-primary">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Jane Smith"
                        className="bg-bg-primary border border-border-subtle rounded-sm px-3.5 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-text-primary">Work Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="jane.smith@company.com"
                        className="bg-bg-primary border border-border-subtle rounded-sm px-3.5 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-text-primary">Company Name *</label>
                      <input
                        type="text"
                        name="company"
                        required
                        placeholder="Acme Industrial Corp"
                        className="bg-bg-primary border border-border-subtle rounded-sm px-3.5 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-text-primary">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 98765 43210"
                        className="bg-bg-primary border border-border-subtle rounded-sm px-3.5 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FormalDropdown
                        label="Industry Sector"
                        options={INDUSTRY_OPTIONS}
                        value={industry}
                        onChange={setIndustry}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <FormalDropdown
                        label="Company Size"
                        options={COMPANY_SIZE_OPTIONS}
                        value={companySize}
                        onChange={setCompanySize}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-text-primary">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell us about your requirements or desired platform evaluation..."
                      className="bg-bg-primary border border-border-subtle rounded-sm px-3.5 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent resize-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-[11px] font-mono text-text-tertiary">
                      Direct response • Confidential
                    </span>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 bg-text-primary text-bg-primary rounded-sm text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2 shadow-xs"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>Submit Inquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Right Office Information & Contact Details (5 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-5 flex flex-col gap-5"
            >
              {/* Headquarters Details */}
              <div className="p-6 rounded-sm border border-border-subtle bg-bg-secondary space-y-4">
                <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-text-tertiary font-semibold block">
                  CORPORATE OFFICE
                </span>

                <div className="space-y-3.5 text-xs text-text-secondary">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-text-primary">Athleia AI Technologies Pvt Ltd</span>
                      <span>Bhopal, Madhya Pradesh 462001</span>
                      <span className="text-text-tertiary">India</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-border-subtle/70">
                    <Phone size={15} className="text-accent shrink-0" />
                    <a href="tel:+916263473208" className="font-mono text-text-primary hover:text-accent transition-colors font-medium">
                      +91 6263473208
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail size={15} className="text-accent shrink-0" />
                    <a href="mailto:musaqureshi0000@gmail.com" className="font-mono text-text-primary hover:text-accent transition-colors font-medium">
                      musaqureshi0000@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="p-6 rounded-sm border border-border-subtle bg-bg-secondary space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-text-tertiary font-semibold block">
                  BUSINESS HOURS
                </span>
                <div className="space-y-2 text-xs text-text-secondary">
                  <div className="flex items-center justify-between">
                    <span>Monday – Friday</span>
                    <span className="font-mono font-medium text-text-primary">9:00 AM – 7:00 PM IST</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Saturday – Sunday</span>
                    <span className="font-mono text-text-tertiary">Closed</span>
                  </div>
                </div>
              </div>

              {/* Security Guarantee */}
              <div className="p-5 rounded-sm border border-border-subtle bg-bg-secondary space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                  <ShieldCheck size={15} className="text-status-verified" />
                  <span>Enterprise Data Pledge</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Your inquiry data is protected under strict corporate NDA guidelines. We never share or sell company details.
                </p>
              </div>
            </motion.div>

          </div>

          {/* Enterprise FAQ Accordion Section */}
          <div className="pt-16 mt-16 border-t border-border-subtle max-w-3xl space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-tertiary font-semibold block">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-heading-1 text-text-primary font-semibold">
                Common Contact &amp; Evaluation Questions
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
