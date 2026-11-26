"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SecurityCompliancePage() {
  const points = [
    { title: "Physical & Logical VPC Isolation", desc: "Axios deploys inside customer-dedicated VPCs or air-gapped on-premise industrial plant hardware." },
    { title: "Zero Model Training Retention", desc: "Models process prompts in memory with zero persistence, zero cache leakage, and zero weights retraining." },
    { title: "Cryptographic KMS Key Control", desc: "Customers manage their own root encryption keys with instant revocation control via AWS KMS or Azure Vault." },
    { title: "Sub-Second Permission Mirroring", desc: "Access control lists (ACLs) synchronize continuously with corporate Active Directory, Okta, and WorkOS." },
    { title: "Deterministic Citation Provenance", desc: "Every generated insight includes verifiable links to source documents, avoiding ungrounded hallucinations." },
    { title: "Granular Role-Based Access (RBAC)", desc: "Enforces strict principle of least privilege across administrators, engineers, operators, and auditors." },
    { title: "Continuous Threat Monitoring", desc: "24/7 automated intrusion detection, rate limiting, DDoS mitigation, and anomalous access alerts." },
    { title: "Automated PHI / PII Redaction", desc: "Data pre-processing pipelines automatically strip sensitive personal and medical identifiers before reasoning." },
    { title: "Tamper-Proof Audit Logging", desc: "Every user query, file upload, and agent operation is signed into an append-only cryptographic ledger." },
    { title: "Container & Code Vulnerability Scans", desc: "Continuous SAST/DAST code scanning and container verification before production deployment." },
    { title: "Emergency Plant Isolation Runbooks", desc: "Instant kill-switch functionality to disconnect plant networks and isolate telemetry streams on demand." },
    { title: "Independent Security Attestation", desc: "Architecture aligned with AICPA SOC 2 Type II, FedRAMP, NIST CSF, and HIPAA healthcare standards." },
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
            Security &amp; Compliance Standards
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Technical security posture, infrastructure isolation, and regulatory compliance benchmarks.
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
        <span>Axios Technologies, Inc. · Enterprise Security Office · Inquiries: </span>
        <a href="mailto:support.axiosai@gmail.com" className="text-neutral-600 hover:underline">
          support.axiosai@gmail.com
        </a>
      </div>
    </div>
  );
}
