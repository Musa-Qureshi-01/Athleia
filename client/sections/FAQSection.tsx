"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    id: "faq-permissions",
    category: "Security & Permissions",
    question: "How does Axios ensure employees only see information they are authorized to access?",
    answer:
      "Axios mirrors source permissions at the document, user, and group level in real time with sub-second (14ms) synchronization latency. Every query is evaluated through an active ACL filter before documents are passed to retrieval or synthesis, ensuring employees only ever see what they are authorized to access in source systems like Slack, Jira, Confluence, Google Drive, and SharePoint.",
  },
  {
    id: "faq-training",
    category: "Privacy & Data Retention",
    question: "Does Axios train on our private company data or prompts?",
    answer:
      "Never. Axios maintains a contractual zero-data-retention and zero-model-training guarantee. Your organizational knowledge, engineering documents, telemetry, and employee prompts are never stored, logged, or utilized to train foundation models or third-party LLMs.",
  },
  {
    id: "faq-deployment",
    category: "Deployment & Architecture",
    question: "Can Axios be deployed inside our own isolated VPC or on-premises environment?",
    answer:
      "Yes. Axios offers full deployment flexibility, including dedicated single-tenant SaaS, customer-managed VPC on AWS, Microsoft Azure, or Google Cloud, and air-gapped on-premises Kubernetes deployments for defense, healthcare, and critical industrial operations.",
  },
  {
    id: "faq-cost",
    category: "Cost & Token Optimization",
    question: "How does Axios achieve up to 60% savings on enterprise token costs?",
    answer:
      "Axios utilizes a proprietary semantic vector cache and dynamic multi-model routing engine. Frequently requested knowledge queries are served directly from semantic cache with zero LLM inference calls, while tasks are automatically routed to optimal small language models for triage and frontier reasoning models for complex synthesis.",
  },
  {
    id: "faq-connectors",
    category: "Integrations & Connectors",
    question: "What enterprise tools and data sources can Axios connect to?",
    answer:
      "Axios supports 100+ native enterprise connectors out of the box, including Slack, Microsoft Teams, Jira, GitHub, GitLab, Google Drive, Notion, Confluence, Salesforce, ServiceNow, SAP, and legacy industrial document archives including CAD schematics, multi-layer P&ID drawings, and OEM manuals.",
  },
  {
    id: "faq-implementation",
    category: "Time to Value",
    question: "How long does a standard enterprise deployment take to go live?",
    answer:
      "Enterprise rollouts typically reach full operational deployment within 10 to 14 days. With Okta/Azure AD SCIM automated identity provisioning and out-of-the-box cloud connectors, initial teams can begin receiving verified grounded answers on day one.",
  },
];

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("faq-permissions");

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faqs" className="bg-[#FAFBFD] border-t border-neutral-200 font-sans overflow-hidden">
      <div className="max-w-[1120px] mx-auto border-x border-neutral-200 px-6 sm:px-10 lg:px-14 py-16 sm:py-20 lg:py-24">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-[12px] font-mono font-bold text-[#1F45EC] uppercase tracking-wider block mb-3">
            Frequently Asked Questions
          </span>
          <h2 className="text-[32px] sm:text-[44px] lg:text-[50px] font-bold tracking-[-0.035em] text-neutral-900 leading-[1.1] font-sans">
            Everything you need to know about deploying Axios.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed font-sans">
            Clear answers on real-time permission mirroring, multi-model cost routing, VPC isolation, and connector architecture.
          </p>
        </div>

        {/* Boxed FAQ Accordion List with Sharp Boxy Corners */}
        <div className="rounded-md border border-neutral-200/90 bg-white overflow-hidden shadow-xs divide-y divide-neutral-200">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={cn(
                  "transition-colors duration-150",
                  isOpen ? "bg-[#FAFBFD]/60" : "bg-white hover:bg-neutral-50/50"
                )}
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-6 sm:p-8 flex items-center justify-between gap-6 text-left cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 sm:gap-6 flex-1">
                    <div className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 shrink-0 bg-white shadow-2xs">
                      {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                        {faq.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-sans tracking-tight">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 sm:px-14 sm:pb-8 pt-0 pl-16 sm:pl-20 text-[14.5px] sm:text-[15.5px] text-neutral-600 leading-relaxed font-sans">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Additional Questions Card */}
        <div className="mt-8 p-6 rounded-md border border-neutral-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HelpCircle size={20} className="text-[#1F45EC] shrink-0" />
            <p className="text-sm font-medium text-neutral-800 font-sans">
              Have specific architecture, compliance, or security requirements?
            </p>
          </div>
          <Link
            href="/contact"
            className="text-xs font-semibold text-[#1F45EC] hover:text-[#1538D4] inline-flex items-center gap-1 shrink-0"
          >
            Speak with an AI solutions architect <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  );
}
