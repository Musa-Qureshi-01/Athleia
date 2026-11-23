"use client";

import { useState } from "react";
import Link from "next/link";
import { TopAnnouncementBar } from "@/components/layouts/TopAnnouncementBar";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { ArrowRight, Sparkles, Shield, Database, Cpu, Layers } from "lucide-react";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"after" | "before">("after");

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-[#1F45EC]/15 selection:text-[#1F45EC] font-sans antialiased">
      <TopAnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* Concise Single-Page Founder Narrative with Bloom Transformation */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
          
          {/* Ambient Bloom Effect */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-400/15 via-purple-400/15 to-emerald-400/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />

          <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
            
            {/* Header Fold */}
            <div className="max-w-3xl space-y-4">
              <span className="text-[11px] font-mono font-medium text-neutral-500 uppercase tracking-wider block">
                About Axios
              </span>

              <h1 className="text-[34px] sm:text-[46px] lg:text-[54px] font-bold tracking-[-0.035em] leading-[1.08] text-neutral-900">
                Enterprise intelligence begins with context.
              </h1>

              <p className="text-[16px] sm:text-[18px] text-neutral-600 leading-relaxed pt-1">
                When I started building Axios, the premise was simple: modern companies don&apos;t suffer from a lack of AI models. They suffer from an invisible knowledge tax. Every day, employees waste hours searching through fragmented tools, trying to find what already exists.
              </p>
            </div>

            {/* Interactive Bloom Transformation Card */}
            <div className="mt-10 p-6 sm:p-8 rounded-xl border border-neutral-200/90 bg-[#FAFBFD] shadow-[0_15px_40px_rgba(0,0,0,0.04)] relative">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F45EC] block">
                    The Architecture Transformation
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 mt-1">
                    See how Axios transforms enterprise data flow
                  </h3>
                </div>

                {/* State Switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-neutral-200/70 text-xs font-medium self-start sm:self-auto">
                  <button
                    onClick={() => setActiveTab("before")}
                    className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                      activeTab === "before" ? "bg-white text-neutral-900 shadow-xs font-semibold" : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    Without Axios (Silos)
                  </button>
                  <button
                    onClick={() => setActiveTab("after")}
                    className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                      activeTab === "after" ? "bg-[#1F45EC] text-white shadow-xs font-semibold" : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    With Axios (Context Graph)
                  </button>
                </div>
              </div>

              {/* Transformation View */}
              <div className="mt-6">
                {activeTab === "before" ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-lg border border-red-200 bg-red-50/40 space-y-2">
                      <div className="text-xs font-mono font-bold uppercase text-red-600">Fragmented Silos</div>
                      <h4 className="font-bold text-neutral-900 text-[15px]">47+ Disconnected Tools</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Data trapped in Slack threads, Confluence wikis, Google Drive folders, and Salesforce records with no shared relationship.
                      </p>
                    </div>

                    <div className="p-5 rounded-lg border border-red-200 bg-red-50/40 space-y-2">
                      <div className="text-xs font-mono font-bold uppercase text-red-600">Productivity Drain</div>
                      <h4 className="font-bold text-neutral-900 text-[15px]">2.8 Hours Lost Per Week</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Employees repeatedly re-creating answers, re-writing code, and interrupting colleagues for documents that were already created.
                      </p>
                    </div>

                    <div className="p-5 rounded-lg border border-red-200 bg-red-50/40 space-y-2">
                      <div className="text-xs font-mono font-bold uppercase text-red-600">Security Exposure</div>
                      <h4 className="font-bold text-neutral-900 text-[15px]">Permission Blindness</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Generic AI tools leak confidential HR compensation, board memos, or pre-release specs across role boundaries.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-lg border border-emerald-200 bg-emerald-50/40 space-y-2">
                      <div className="text-xs font-mono font-bold uppercase text-emerald-700">Unified Graph</div>
                      <h4 className="font-bold text-neutral-900 text-[15px]">275+ Native Connectors</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Continuous ingestion across Jira, GitHub, Slack, Drive, and internal databases into a single grounded knowledge graph.
                      </p>
                    </div>

                    <div className="p-5 rounded-lg border border-emerald-200 bg-emerald-50/40 space-y-2">
                      <div className="text-xs font-mono font-bold uppercase text-emerald-700">Strict Provenance</div>
                      <h4 className="font-bold text-neutral-900 text-[15px]">Sub-14ms ACL Validation</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Every token and search result enforces the user&apos;s real-time enterprise permissions. If you can&apos;t see the file, AI never sees it.
                      </p>
                    </div>

                    <div className="p-5 rounded-lg border border-emerald-200 bg-emerald-50/40 space-y-2">
                      <div className="text-xs font-mono font-bold uppercase text-emerald-700">Autonomous Execution</div>
                      <h4 className="font-bold text-neutral-900 text-[15px]">Model-Agnostic Routing</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Route between Claude, GPT, or private on-prem models with 60% token savings and verifiable citation provenance.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Founder Note & Sign-off (Anonymous Founder) */}
            <div className="mt-10 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-sm text-neutral-700 font-medium italic">
                  &ldquo;We don&apos;t build technology to impress benchmarks. We build systems that give back the hours stolen by enterprise bureaucracy.&rdquo;
                </p>
                <div className="text-xs text-neutral-500 font-mono">
                  — Founder, Axios
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/story"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F45EC] hover:text-[#1538D4] transition-colors"
                >
                  <span>Our founding story</span>
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
