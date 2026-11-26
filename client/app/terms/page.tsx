"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  const points = [
    { title: "Service Scope & Authorization", desc: "Axios grants enterprise customers a non-exclusive license to deploy Axios intelligence copilots." },
    { title: "Customer Ownership of IP", desc: "Customers retain 100% intellectual property rights over all uploaded documents, prompts, and generated outputs." },
    { title: "Enterprise SLA Commitments", desc: "Production cloud deployments guarantee 99.95% API uptime with standard 15-minute critical incident SLAs." },
    { title: "Acceptable Use & Guardrails", desc: "Platform use is restricted to verified enterprise workflows, regulatory compliance, and engineering operations." },
    { title: "Account & Credential Security", desc: "Organizations are responsible for managing internal SSO credentials and role allocations via IAM." },
    { title: "Dedicated Quota Management", desc: "Query volumes and vector retrieval concurrency are governed by customer contract tiers and provisioned bandwidth." },
    { title: "Zero Model Bias Assumption", desc: "Axios reasoning models operate deterministically based on source citations without speculative generation." },
    { title: "Maintenance & Platform Updates", desc: "Planned platform maintenance occurs during pre-announced maintenance windows with zero data disruption." },
    { title: "Confidentiality Obligations", desc: "Both parties agree to protect proprietary technical architectures and trade secrets under mutual NDA terms." },
    { title: "Indemnification & IP Defense", desc: "Axios provides enterprise customers full uncapped IP indemnification against third-party copyright claims." },
    { title: "Termination & Data Return", desc: "Upon contract termination, all enterprise indices and encryption keys are securely destroyed or exported." },
    { title: "Governing Law & Arbitration", desc: "These terms are governed by standard enterprise jurisdiction laws with resolution via binding commercial arbitration." },
  ];

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-[#FAF8F5] text-neutral-900 font-sans flex flex-col justify-between p-6 sm:p-10 lg:p-12 select-none selection:bg-[#1F45EC]/15 selection:text-[#1F45EC]">
      {/* Top Navigation */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Back to website</span>
        </Link>
      </div>

      {/* Main Content (Fits on a single page without scrolling) */}
      <div className="max-w-4xl w-full mx-auto my-auto py-4">
        <div className="mb-6 border-b border-neutral-200/80 pb-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
            Axios Enterprise Governance
          </span>
          <h1 className="text-[26px] sm:text-[32px] font-bold text-neutral-900 tracking-[-0.03em] font-sans">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Commercial terms, service level commitments, and acceptable use policies for Axios Enterprise.
          </p>
        </div>

        {/* 12 Concise Points in clean 2-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 text-xs sm:text-[13px]">
          {points.map((pt, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="font-mono text-[11px] font-bold text-[#1F45EC] shrink-0 mt-0.5">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <div>
                <strong className="font-semibold text-neutral-900 block leading-snug">
                  {pt.title}
                </strong>
                <span className="text-neutral-600 leading-relaxed text-[11.5px] sm:text-xs">
                  {pt.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clean Minimalist Footer */}
      <div className="text-center text-[11px] text-neutral-400 pt-2 border-t border-neutral-200/60">
        <span>Axios Technologies, Inc. · Enterprise Legal · Inquiries: </span>
        <a href="mailto:support.axiosai@gmail.com" className="text-neutral-600 hover:underline">
          support.axiosai@gmail.com
        </a>
      </div>
    </div>
  );
}
