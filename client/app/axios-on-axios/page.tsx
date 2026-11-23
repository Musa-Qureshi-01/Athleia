"use client";

import { useState } from "react";
import Link from "next/link";
import { TopAnnouncementBar } from "@/components/layouts/TopAnnouncementBar";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { ArrowRight, Sparkles, Terminal, CheckCircle2, GitPullRequest, MessageSquare, FileText } from "lucide-react";

const USE_CASES = [
  {
    icon: GitPullRequest,
    title: "Engineering PRs & Root Cause Analysis",
    prompt: "Who touched the telemetry pipeline before the latency spike in cluster us-east-1?",
    answer: "PR #892 by Systems Team modified the partition batching logic. Linked to Jira ISSUE-4412 and resolved in Slack #eng-telemetry with commit b4f89a.",
    citations: ["GitHub PR #892", "Datadog Trace #9812", "Slack #eng-telemetry"],
  },
  {
    icon: MessageSquare,
    title: "GTM & Customer Escalation Routing",
    prompt: "What is the exact contractual SLA committed for customer Frasier Automotive?",
    answer: "Master Services Agreement § 4.2 commits to 99.95% uptime and sub-1 hour P1 response. Escalation contacts: Lead Solutions Architect and VP of Customer Success.",
    citations: ["DocuSign MSA #2026-F1", "Salesforce Account #8812"],
  },
  {
    icon: FileText,
    title: "Instant Employee Onboarding",
    prompt: "Where is the runbook for provisioning staging credentials for new engineers?",
    answer: "Internal Wiki: Engineering Onboarding § 3.1. Provisioning requires Okta MFA and AWS IAM role 'sandbox-developer'. Run command: pnpm run setup-env.",
    citations: ["Confluence Onboarding Guide", "GitHub Developer Docs"],
  },
];

export default function AxiosOnAxiosPage() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-[#1F45EC]/15 selection:text-[#1F45EC] font-sans antialiased">
      <TopAnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* Single-Page Axios on Axios with Radiant Bloom */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
          
          {/* Radiant Bloom Background */}
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[350px] bg-gradient-to-tr from-blue-400/15 via-purple-400/15 to-emerald-400/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
            
            {/* Header Fold */}
            <div className="max-w-3xl space-y-4">
              <span className="text-[11px] font-mono font-medium text-neutral-500 uppercase tracking-wider block">
                Axios on Axios
              </span>

              <h1 className="text-[34px] sm:text-[46px] lg:text-[54px] font-bold tracking-[-0.035em] leading-[1.08] text-neutral-900">
                We run our entire company on Axios.
              </h1>

              <p className="text-[16px] sm:text-[18px] text-neutral-600 leading-relaxed pt-1">
                We refuse to build technology we don&apos;t depend on ourselves every day. Every pull request review, architecture decision, customer escalation, and new hire onboarding at Axios is powered by our own Knowledge Graph.
              </p>
            </div>

            {/* Interactive Live Query Simulator / Transformation */}
            <div className="mt-10 rounded-xl border border-neutral-300/80 bg-[#0F1424] text-white p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden">
              
              {/* Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs font-mono text-white/50 pl-2">
                    axios-internal-cluster // live dogfooding instance
                  </span>
                </div>

                {/* Scenario tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/10 text-xs">
                  {USE_CASES.map((uc, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                        activeIdx === i ? "bg-[#1F45EC] text-white font-semibold" : "text-white/70 hover:text-white"
                      }`}
                    >
                      Case {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation Content */}
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-[11px] font-mono uppercase text-emerald-400 block mb-1">
                    Employee Query
                  </span>
                  <p className="text-sm sm:text-base font-medium text-white">
                    &ldquo;{USE_CASES[activeIdx].prompt}&rdquo;
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-lg bg-white/10 border border-white/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-[#60A5FA]">
                      Axios Enterprise Answer (0.8s)
                    </span>
                    <span className="text-[10px] font-mono text-white/50">
                      ACL Verified // Zero Hallucination
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
                    {USE_CASES[activeIdx].answer}
                  </p>

                  <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2 text-[11px] text-white/60 font-mono">
                    <span>Verified Citations:</span>
                    {USE_CASES[activeIdx].citations.map((c, ci) => (
                      <span key={ci} className="px-2 py-0.5 rounded bg-white/10 text-white/80 border border-white/10">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Founder Sign-off & Actions */}
            <div className="mt-10 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-neutral-900">
                  Built by engineers who feel the same pain every single day.
                </p>
                <p className="text-xs text-neutral-500 font-mono">
                  — Founder &amp; Team, Axios
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/enterprise-context"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F45EC] hover:text-[#1538D4] transition-colors"
                >
                  <span>Explore Enterprise Context</span>
                  <ArrowRight size={13} />
                </Link>
                <Link
                  href="/get-a-demo"
                  className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-black hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
                >
                  Get a demo
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
