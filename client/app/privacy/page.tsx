"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const points = [
    { title: "Zero Customer Data Retention", desc: "Axios never retains customer search queries or document contents for foundation model training." },
    { title: "Isolated Data Perimeters", desc: "Every customer operates within a dedicated tenant sandbox with cryptographically isolated data boundaries." },
    { title: "End-to-End Encryption", desc: "All data in transit is encrypted using TLS 1.3, and at rest with AES-256 using customer-managed KMS keys." },
    { title: "Real-Time Access Control", desc: "Permissions mirror your identity provider (WorkOS, Okta, Azure AD) with sub-second change propagation." },
    { title: "No External Training Corpora", desc: "Customer documents, tickets, and code repositories are never exposed to public or third-party LLMs." },
    { title: "Automated Data Minimization", desc: "Ephemeral indexing caches automatically expire and purge after evaluation or workspace termination." },
    { title: "Role-Based Row-Level Security", desc: "Queries execute strictly under the caller's authorized enterprise role (RLS enforced at database layer)." },
    { title: "Complete Audit Ledger", desc: "Every data access, retrieval, and inference request is recorded with tamper-proof SHA-256 audit hashes." },
    { title: "Strict PHI & PII Redaction", desc: "Sensitive personal identifiers and health records are automatically masked before reasoning execution." },
    { title: "Data Sovereignty & Localization", desc: "Enterprise deployments support on-premise VPCs, private AWS GovCloud, or sovereign geographic boundaries." },
    { title: "Right to Immediate Erasure", desc: "Organizations can trigger complete data eradication with verifiable cryptographic deletion receipts." },
    { title: "Compliance Oversight", desc: "Continuous automated monitoring against global privacy standards including GDPR, CCPA, and HIPAA." },
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
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Authoritative data privacy principles governing the Axios Enterprise Intelligence platform.
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
