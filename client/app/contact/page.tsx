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
  Briefcase,
  Headphones,
  Handshake,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CONTACT_CARDS = [
  {
    icon: Briefcase,
    title: "Enterprise Sales",
    description: "Explore platform licensing, private customer VPCs, or custom air-gapped deployments.",
    email: "musaqureshi0000@gmail.com",
    actionText: "Email Sales Team",
  },
  {
    icon: Headphones,
    title: "Technical Support",
    description: "Dedicated operational support and technical guidance for enterprise customers.",
    email: "musaqureshi0000@gmail.com",
    actionText: "Contact Support",
  },
  {
    icon: Handshake,
    title: "Strategic Partnerships",
    description: "Collaborate with Athleia on system integration, OEM hardware, and consulting.",
    email: "musaqureshi0000@gmail.com",
    actionText: "Partner with Us",
  },
];

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

const FAQ_ITEMS = [
  {
    q: "How quickly can our organization schedule a platform demo?",
    a: "Our team typically schedules live executive and architecture walkthroughs within 24 business hours of receiving your request.",
  },
  {
    q: "Can Athleia be deployed inside our private cloud or on-premise hardware?",
    a: "Yes. Athleia supports full deployment within your AWS VPC, Microsoft Azure subscription, or 100% offline air-gapped local plant servers.",
  },
  {
    q: "How is our company's proprietary document data protected?",
    a: "Athleia enforces strict data perimeter isolation, customer-managed KMS key encryption, and zero external LLM training on customer corpora.",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [industry, setIndustry] = useState("manufacturing");
  const [companySize, setCompanySize] = useState("501-2500");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

          {/* 1. Welcoming Business-Focused Hero */}
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-tertiary font-semibold block">
              GET IN TOUCH
            </span>
            <h1 className="text-display text-text-primary leading-tight">
              Let&apos;s Build Your Enterprise Industrial Intelligence Strategy.
            </h1>
            <p className="text-body-lg text-text-secondary leading-relaxed max-w-2xl">
              Speak directly with our solutions team to explore deployment options, custom enterprise integrations, or schedule a personalized platform demo.
            </p>
          </div>

          {/* 2. 3 Clean Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {CONTACT_CARDS.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-6 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col justify-between gap-6 hover:border-border-strong transition-colors"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                      <Icon size={20} />
                    </div>
                    <h2 className="text-heading-2 text-text-primary font-semibold">
                      {card.title}
                    </h2>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <a
                    href={`mailto:${card.email}`}
                    className="text-xs font-semibold text-accent hover:text-accent-hover inline-flex items-center gap-1.5 transition-colors font-mono"
                  >
                    <span>{card.email}</span>
                    <ArrowRight size={13} />
                  </a>
                </motion.div>
              );
            })}
          </div>

          {/* 3. Main Contact Form & Office Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">

            {/* Left Contact Form (7 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-7"
            >
              {submitted ? (
                <div className="p-8 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-status-verified font-mono text-xs">
                    <CheckCircle2 size={18} />
                    <span>Inquiry Submitted Successfully</span>
                  </div>
                  <h2 className="text-heading-2 text-text-primary">
                    Thank you. Our executive team has received your message.
                  </h2>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    A solutions representative will review your inquiry and reach out within 1 business day. If you need immediate assistance, please email us directly at musaqureshi0000@gmail.com.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="p-8 rounded-sm border border-border-subtle bg-bg-secondary space-y-6 shadow-xs"
                >
                  <div className="space-y-1">
                    <h2 className="text-heading-2 text-text-primary font-semibold">
                      Send Us a Message
                    </h2>
                    <p className="text-xs text-text-secondary">
                      Fill out the form below and our enterprise team will respond promptly.
                    </p>
                  </div>

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
                        className="bg-bg-primary border border-border-subtle rounded-sm px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-text-primary">Work Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="jane.smith@company.com"
                        className="bg-bg-primary border border-border-subtle rounded-sm px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
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
                        className="bg-bg-primary border border-border-subtle rounded-sm px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-text-primary">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 98765 43210"
                        className="bg-bg-primary border border-border-subtle rounded-sm px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent font-mono"
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
                    <label className="text-xs font-medium text-text-primary">How can we help your organization? *</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell us about your requirements, platform evaluation timeline, or specific deployment preferences..."
                      className="bg-bg-primary border border-border-subtle rounded-sm px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent resize-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-[11px] font-mono text-text-tertiary">
                      Direct executive response • Privacy guaranteed
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

            {/* Right Office Information (5 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-5 flex flex-col gap-6"
            >
              {/* Headquarters Card */}
              <div className="p-6 rounded-sm border border-border-subtle bg-bg-secondary space-y-4">
                <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-text-tertiary font-semibold block">
                  CORPORATE HEADQUARTERS
                </span>
                <div className="space-y-3 text-xs text-text-secondary">
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
                  <div className="pt-2 border-t border-border-subtle/70 text-[11px] text-text-tertiary">
                    24/7 emergency support available for Enterprise SLA contracts.
                  </div>
                </div>
              </div>

              {/* Data Security Pledge */}
              <div className="p-6 rounded-sm border border-border-subtle bg-bg-secondary space-y-2">
                <span className="text-xs font-semibold text-text-primary block">
                  Enterprise Security Guarantee
                </span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Your contact details and technical specifications are protected under strict NDA guidelines. We never share or sell enterprise inquiry data.
                </p>
              </div>
            </motion.div>

          </div>

          {/* 4. Enterprise FAQ Section */}
          <div className="max-w-3xl mx-auto pt-12 border-t border-border-subtle mb-16 space-y-6">
            <div className="space-y-2 text-center">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-tertiary font-semibold block">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-heading-1 text-text-primary">
                Common Contact &amp; Evaluation Inquiries
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

          {/* 5. Final Enterprise Demo CTA */}
          <div className="p-8 lg:p-10 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold block">
                SCHEDULE A DEMO
              </span>
              <h3 className="text-heading-2 text-text-primary">
                Ready to See Athleia in Action?
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Schedule a 30-minute personalized walkthrough with our platform engineers to analyze your document corpora and deployment goals.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-11 px-6 rounded-sm text-xs font-semibold bg-text-primary text-bg-primary hover:opacity-90 transition-opacity shrink-0 shadow-xs"
            >
              <span>Book Enterprise Demo</span>
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
