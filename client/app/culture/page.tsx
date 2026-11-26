"use client";

import Link from "next/link";
import { TopAnnouncementBar } from "@/components/layouts/TopAnnouncementBar";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { ArrowRight, ShieldCheck, Heart, Sparkles, Target, Zap } from "lucide-react";

const PRINCIPLES = [
  {
    num: "01",
    title: "Extreme Ownership, Low Ego",
    practice: "We solve problems directly without finger-pointing or bureaucratic approvals. If a customer is blocked, anyone on the team has the mandate to fix it.",
    avoid: "No corporate politics, no performative status updates, no empire-building.",
  },
  {
    num: "02",
    title: "Stay Relentlessly Close to Reality",
    practice: "Every engineer and designer speaks directly with customers. We build features that solve real enterprise workflows, not hypothetical whitepapers.",
    avoid: "No building technology in an ivory tower without customer validation.",
  },
  {
    num: "03",
    title: "Speed with Obsessive Polish",
    practice: "We ship daily. But speed is never an excuse for shoddy craftsmanship. We obsess over sub-14ms latency, crisp typography, and rock-solid reliability.",
    avoid: "No half-baked features or fragile prototypes passed off as enterprise software.",
  },
  {
    num: "04",
    title: "Sacred Customer Trust",
    practice: "Customer IP is inviolable. We enforce strict tenant isolation, zero model retention, and verifiable SHA-256 audit trails on every query.",
    avoid: "No compromises on security, no training public models on private enterprise data.",
  },
];

export default function CulturePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-[#1F45EC]/15 selection:text-[#1F45EC] font-sans antialiased">
      <TopAnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* Single-Page Culture & Values with Bloom Radiance */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
          
          {/* Ambient Bloom Light */}
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-400/15 via-blue-400/15 to-purple-400/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
            
            {/* Header Fold */}
            <div className="max-w-3xl space-y-4">
              <span className="text-[11px] font-mono font-medium text-neutral-500 uppercase tracking-wider block">
                Culture &amp; Operating Principles
              </span>

              <h1 className="text-[34px] sm:text-[46px] lg:text-[54px] font-bold tracking-[-0.035em] leading-[1.08] text-neutral-900">
                How we build Axios every day.
              </h1>

              <p className="text-[16px] sm:text-[18px] text-neutral-600 leading-relaxed pt-1">
                Culture isn&apos;t free snacks or slogans on a wall. It is the operating system for how we make decisions when no one is watching. Here are the 4 non-negotiable principles that guide our team.
              </p>
            </div>

            {/* The 4 Operating Truths Grid */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {PRINCIPLES.map((p) => (
                <div
                  key={p.num}
                  className="p-6 sm:p-7 rounded-md border border-neutral-200/90 bg-[#FAFBFD] shadow-xs hover:border-[#1F45EC]/40 transition-all space-y-4 group"
                >
                  <div className="flex items-center justify-between border-b border-neutral-200/70 pb-3">
                    <span className="font-mono text-xs font-bold text-[#1F45EC]">
                      Principle {p.num}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-[#1F45EC]/40 group-hover:bg-[#1F45EC] transition-colors" />
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                    {p.title}
                  </h3>

                  <div className="space-y-2 text-xs sm:text-[13px] leading-relaxed">
                    <div className="text-neutral-700">
                      <strong className="text-emerald-700 font-medium">What we practice: </strong>
                      {p.practice}
                    </div>
                    <div className="text-neutral-500">
                      <strong className="text-neutral-600 font-medium">What we reject: </strong>
                      {p.avoid}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Founder Sign-off & Careers CTA */}
            <div className="mt-10 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-neutral-900">
                  Think you would thrive in this environment?
                </p>
                <p className="text-xs text-neutral-500 font-mono">
                  — Founder &amp; Team, Axios
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/careers"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F45EC] hover:text-[#1538D4] transition-colors"
                >
                  <span>Explore open positions</span>
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
