"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";

const INQUIRY_TYPES = [
  "Enterprise deployment",
  "Technical architecture review",
  "Pilot program",
  "Partnership",
  "Security & compliance questions",
  "Other",
];

function Field({
  label,
  id,
  children,
  hint,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-body text-text-primary font-medium text-sm">
        {label}
      </label>
      {children}
      {hint && <span className="text-mono text-text-tertiary">{hint}</span>}
    </div>
  );
}

const inputClass =
  "w-full h-10 px-3 rounded-sm text-sm text-text-primary bg-bg-primary border border-border-strong focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-14" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="container-editorial py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">

            {/* Left — Context */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="lg:col-span-4 flex flex-col gap-8"
            >
              <div className="flex flex-col gap-4">
                <span className="text-label text-text-tertiary">Contact</span>
                <h1 className="text-heading-1 text-text-primary">
                  Talk to our engineering team.
                </h1>
                <p className="text-body-lg text-text-secondary leading-relaxed">
                  We don&apos;t do sales calls. We do technical conversations. Tell us about your
                  document corpus, your query types, and your infrastructure — and we&apos;ll figure
                  out together whether Athleia is the right fit.
                </p>
              </div>

              {/* Contact details */}
              <div
                className="flex flex-col gap-5 pt-8 border-t border-border-subtle"
              >
                {[
                  { label: "General enquiries", value: "hello@athleia.ai" },
                  { label: "Enterprise & deployment", value: "enterprise@athleia.ai" },
                  { label: "Security & compliance", value: "security@athleia.ai" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <span className="text-mono text-text-tertiary">{item.label}</span>
                    <a
                      href={`mailto:${item.value}`}
                      className="text-body text-text-primary hover:text-accent transition-colors duration-150"
                    >
                      {item.value}
                    </a>
                  </div>
                ))}
              </div>

              {/* Response time */}
              <div
                className="p-4 rounded-sm border border-border-subtle"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--status-verified)" }} />
                  <span className="text-mono text-text-tertiary">Typical response time</span>
                </div>
                <span className="text-body font-medium text-text-primary">Within one business day</span>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="lg:col-span-7 lg:col-start-6"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col gap-4 py-16"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--status-verified)" }} />
                    <span className="text-mono text-text-tertiary">Message received</span>
                  </div>
                  <h2 className="text-heading-1 text-text-primary">
                    We&apos;ll be in touch.
                  </h2>
                  <p className="text-body-lg text-text-secondary max-w-md leading-relaxed">
                    Someone from our engineering team will read your message and reply within one
                    business day. If it&apos;s urgent, email{" "}
                    <a href="mailto:enterprise@athleia.ai" className="text-text-primary hover:text-accent transition-colors">
                      enterprise@athleia.ai
                    </a>{" "}
                    directly.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6 p-8 border border-border-subtle rounded-sm"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  {/* Row: Name + Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label="Full name" id="name">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Jane Smith"
                        className={inputClass}
                        style={{ backgroundColor: "var(--bg-primary)" }}
                      />
                    </Field>
                    <Field label="Company" id="company">
                      <input
                        id="company"
                        name="company"
                        type="text"
                        required
                        placeholder="Acme Corp"
                        className={inputClass}
                        style={{ backgroundColor: "var(--bg-primary)" }}
                      />
                    </Field>
                  </div>

                  {/* Row: Email + Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label="Work email" id="email">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="jane@acme.com"
                        className={inputClass}
                        style={{ backgroundColor: "var(--bg-primary)" }}
                      />
                    </Field>
                    <Field label="Role" id="role">
                      <input
                        id="role"
                        name="role"
                        type="text"
                        placeholder="Lead Process Engineer"
                        className={inputClass}
                        style={{ backgroundColor: "var(--bg-primary)" }}
                      />
                    </Field>
                  </div>

                  {/* Inquiry type */}
                  <Field label="Inquiry type" id="inquiry">
                    <select
                      id="inquiry"
                      name="inquiry"
                      className={inputClass}
                      style={{ backgroundColor: "var(--bg-primary)" }}
                      defaultValue=""
                    >
                      <option value="" disabled>Select one</option>
                      {INQUIRY_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>

                  {/* Message */}
                  <Field
                    label="Message"
                    id="message"
                    hint="Tell us about your document types, query volume, and current infrastructure."
                  >
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="We have roughly 800 P&ID PDFs and maintenance SOPs across three facilities..."
                      className="w-full px-3 py-2.5 rounded-sm text-sm text-text-primary bg-bg-primary border border-border-strong focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none"
                      style={{ backgroundColor: "var(--bg-primary)" }}
                    />
                  </Field>

                  {/* Submit */}
                  <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                    <span className="text-mono text-text-tertiary">
                      No sales pitch. Just a technical conversation.
                    </span>
                    <button
                      type="submit"
                      className="inline-flex items-center h-9 px-6 rounded-sm text-sm font-medium bg-text-primary text-bg-primary hover:opacity-85 transition-opacity duration-150 shrink-0"
                    >
                      Send message
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
