"use client";

import Link from "next/link";
import { TopAnnouncementBar } from "@/components/layouts/TopAnnouncementBar";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { ArrowRight, Sparkles, Shield, GitCommit, CheckCircle2 } from "lucide-react";

const MILESTONES = [
  {
    year: "2023",
    title: "The Failure of Naive Enterprise RAG",
    desc: "Every enterprise tried dumping PDFs into vector databases. The result was hallucination, stale answers, and catastrophic permission leaks. We realized enterprise AI needed organizational graph context, not just vector similarity.",
  },
  {
    year: "2024",
    title: "Building the Live Knowledge Graph",
    desc: "We engineered a distributed ingestion pipeline that doesn't just index text—it maps the relationships between people, projects, and permissions across 275+ enterprise applications with sub-14ms ACL evaluation.",
  },
  {
    year: "2026",
    title: "The Agentic Substrate for Global Teams",
    desc: "Axios powers autonomous workforce copilots and cross-department workflows for leading enterprises. Employees find verified truth in seconds; autonomous agents execute with full governance.",
  },
];

export default function StoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-[#1F45EC]/15 selection:text-[#1F45EC] font-sans antialiased">
      <TopAnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* Single-Page Founder Story with Radiant Bloom */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
          
          {/* Luminous Bloom Glow */}
          <div className="absolute top-20 right-10 w-[550px] h-[350px] bg-gradient-to-bl from-purple-400/15 via-blue-400/15 to-transparent rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
            
            {/* Header / Founder Manifesto */}
            <div className="max-w-3xl space-y-4">
              <span className="text-[11px] font-mono font-medium text-neutral-500 uppercase tracking-wider block">
                Founding Story
              </span>

              <h1 className="text-[34px] sm:text-[46px] lg:text-[54px] font-bold tracking-[-0.035em] leading-[1.08] text-neutral-900">
                Why I started Axios.
              </h1>

              <div className="space-y-4 text-[15px] sm:text-[17px] text-neutral-600 leading-relaxed pt-2">
                <p>
                  I spent years watching engineers, operators, and analysts drown in internal tools. Every week, millions of brilliant people spend hours doing digital archaeology—hunting for a buried Google Doc, guessing which Slack thread had the final decision, or rebuilding work a teammate completed three months ago.
                </p>
                <p>
                  When large language models emerged, everyone thought the problem was solved. But generic AI is blind to your company&apos;s internal reality. It doesn&apos;t know your team&apos;s org chart, doesn&apos;t know who authored a design doc, and doesn&apos;t understand who has permission to view confidential project metrics.
                </p>
                <p>
                  I built Axios to construct that missing substrate: a living, permission-aware Enterprise Knowledge Graph that grounds frontier models in verified organizational truth.
                </p>
              </div>
            </div>

            {/* Transformation Milestones */}
            <div className="mt-12 pt-8 border-t border-neutral-200">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F45EC] block mb-6">
                The Journey &amp; Architecture Evolution
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MILESTONES.map((m, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-xl border border-neutral-200/90 bg-[#FAFBFD] shadow-xs space-y-3 relative group hover:border-[#1F45EC]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-[#1F45EC]">{m.year}</span>
                      <div className="w-2 h-2 rounded-full bg-[#1F45EC]/60 group-hover:scale-125 transition-transform" />
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 leading-snug">{m.title}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Founder Sign-off & Actions */}
            <div className="mt-10 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-neutral-900">
                  Built with uncompromising standards for modern enterprises.
                </p>
                <p className="text-xs text-neutral-500 font-mono">
                  — Founder &amp; Team, Axios
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/culture"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F45EC] hover:text-[#1538D4] transition-colors"
                >
                  <span>Our culture &amp; values</span>
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
