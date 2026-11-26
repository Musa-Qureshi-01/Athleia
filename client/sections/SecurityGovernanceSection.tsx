"use client";

import Link from "next/link";
import { Lightbulb, Layers, Zap, Lock, Eye, ShieldCheck, Check } from "lucide-react";

export function SecurityGovernanceSection() {
  return (
    <section className="bg-white font-sans overflow-hidden">
      <div className="max-w-[1120px] mx-auto border-x border-neutral-200">
        
        {/* ========================================================================= */}
        {/* 1. TOP 50/50 SECTION (#solution): Turn Knowledge into Action               */}
        {/* ========================================================================= */}
        <div id="solution" className="grid grid-cols-1 lg:grid-cols-2 border-t border-neutral-200 scroll-mt-20">
          
          {/* Left Column: Soft Warm Cream (#FAF8F5) with Authoritative Headline */}
          <div className="bg-[#FAF8F5] p-6 sm:p-10 lg:p-16 xl:p-20 xl:pl-20 border-b lg:border-b-0 lg:border-r border-neutral-200 flex flex-col justify-center">
            <div className="max-w-md">
              <div className="w-12 sm:w-16 h-[2px] bg-neutral-900 mb-6 sm:mb-8" />
              <h2 className="text-[28px] sm:text-[38px] lg:text-[46px] font-bold tracking-[-0.035em] leading-[1.1] sm:leading-[1.08] text-neutral-900 font-sans">
                Axios turns company knowledge into action without runaway model spend.
              </h2>
            </div>
          </div>

          {/* Right Column: 3D Blue Sculpted Ribbon Background + 3 Frosted Cards */}
          <div className="relative bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center min-h-[460px] overflow-hidden">
            {/* 3D Blue Ribbon Asset from Reference Snapshot */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-end overflow-hidden">
              <img
                src="/glean-security-ribbon.png"
                alt="Axios 3D Enterprise Architecture"
                className="w-full h-full object-cover lg:object-contain object-right opacity-90 select-none"
              />
            </div>

            {/* Subtle Gradient Veil for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent pointer-events-none" />

            {/* 3 Frosted White Floating Cards */}
            <div className="relative z-10 space-y-3.5 max-w-md w-full mx-auto lg:ml-auto">
              
              {/* Card 01: Better answers */}
              <div className="bg-white/90 backdrop-blur-md rounded-md border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-4 sm:p-5 hover:bg-white transition-all group">
                <div className="flex items-center gap-2 text-neutral-700">
                  <Lightbulb size={16} className="text-neutral-700" />
                </div>
                <div className="h-[1px] bg-neutral-200/80 my-2.5" />
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-neutral-400 mt-0.5">01</span>
                  <div>
                    <h4 className="text-[14.5px] font-bold text-neutral-900 leading-snug">
                      Better answers.
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Built on what your business knows.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 02: Fewer tokens */}
              <div className="bg-white/90 backdrop-blur-md rounded-md border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-4 sm:p-5 hover:bg-white transition-all group">
                <div className="flex items-center gap-2 text-neutral-700">
                  <Layers size={16} className="text-neutral-700" />
                </div>
                <div className="h-[1px] bg-neutral-200/80 my-2.5" />
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-neutral-400 mt-0.5">02</span>
                  <div>
                    <h4 className="text-[14.5px] font-bold text-neutral-900 leading-snug">
                      Fewer tokens.
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Less sent to the model.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 03: Lower cost to serve */}
              <div className="bg-white/90 backdrop-blur-md rounded-md border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-4 sm:p-5 hover:bg-white transition-all group">
                <div className="flex items-center gap-2 text-neutral-700">
                  <Zap size={16} className="text-neutral-700" />
                </div>
                <div className="h-[1px] bg-neutral-200/80 my-2.5" />
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-neutral-400 mt-0.5">03</span>
                  <div>
                    <h4 className="text-[14.5px] font-bold text-neutral-900 leading-snug">
                      Lower cost to serve.
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      More value from every query.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. BOTTOM 50/50 SECTION (#security): Built for Enterprise from Day One    */}
        {/* ========================================================================= */}
        <div id="security" className="grid grid-cols-1 lg:grid-cols-2 border-t border-neutral-200 scroll-mt-20">
          
          {/* Left Column: 3 Clean Stacked Security Features with Hairlines */}
          <div className="p-6 sm:p-10 lg:p-16 xl:p-20 xl:pl-20 border-b lg:border-b-0 lg:border-r border-neutral-200 bg-white flex flex-col justify-center">
            <div className="divide-y divide-neutral-200 border-y border-neutral-200">
              
              {/* Item 1: Enterprise-grade security */}
              <div className="py-6 sm:py-7 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-700 mt-0.5">
                  <Lock size={15} />
                </div>
                <div>
                  <h4 className="text-[15px] sm:text-[16px] font-bold text-neutral-900 leading-snug">
                    Enterprise-grade security.
                  </h4>
                  <p className="text-xs sm:text-[13px] text-neutral-500 mt-1 leading-relaxed">
                    Users only see what they&apos;re allowed to see.
                  </p>
                </div>
              </div>

              {/* Item 2: Full observability */}
              <div className="py-6 sm:py-7 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-700 mt-0.5">
                  <Eye size={15} />
                </div>
                <div>
                  <h4 className="text-[15px] sm:text-[16px] font-bold text-neutral-900 leading-snug">
                    Full observability.
                  </h4>
                  <p className="text-xs sm:text-[13px] text-neutral-500 mt-1 leading-relaxed">
                    Track every query, answer, and action.
                  </p>
                </div>
              </div>

              {/* Item 3: Best-in-class data governance */}
              <div className="py-6 sm:py-7 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-700 mt-0.5">
                  <ShieldCheck size={15} />
                </div>
                <div>
                  <h4 className="text-[15px] sm:text-[16px] font-bold text-neutral-900 leading-snug">
                    Best-in-class data governance.
                  </h4>
                  <p className="text-xs sm:text-[13px] text-neutral-500 mt-1 leading-relaxed">
                    Built for compliance-heavy environments.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Micro-Dot Grid with Big Headline + Pill CTA Button */}
          <div className="p-8 sm:p-12 lg:p-16 xl:p-20 bg-white bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:20px_20px] flex flex-col justify-center items-start">
            <div className="max-w-lg">
              <h3 className="text-[28px] sm:text-[36px] lg:text-[40px] font-bold tracking-[-0.035em] text-neutral-900 leading-[1.12] font-sans">
                Built for enterprise from day one. AI only works in the enterprise when answers are secure, explainable, and permission-aware.
              </h3>

              <div className="pt-8">
                <Link
                  href="/products/compliance-intelligence"
                  className="h-11 px-7 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-semibold tracking-wide transition-all inline-flex items-center justify-center shadow-xs cursor-pointer active:scale-98"
                >
                  Explore Axios Protect
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. COMPLIANCE BADGES STRIP (Blurred certificates as requested)             */}
        {/* ========================================================================= */}
        <div className="border-t border-b border-neutral-200 bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-neutral-200 text-center">
            
            {/* 1. Badge 1 (Content & Logo Blurred) */}
            <div className="p-6 flex flex-col items-center justify-center space-y-1.5 bg-neutral-50/40 relative overflow-hidden select-none">
              <div className="filter blur-[5px] opacity-40 pointer-events-none flex flex-col items-center space-y-1.5 select-none">
                <div className="w-10 h-10 rounded-full border-2 border-neutral-800 flex items-center justify-center font-bold text-[10px] text-neutral-800 font-mono tracking-tighter">
                  NIST
                </div>
                <span className="text-[12px] font-bold text-neutral-900">NIST CSF</span>
                <span className="text-[10px] text-neutral-400 font-mono">Security Framework</span>
              </div>
            </div>

            {/* 2. Badge 2 (Content & Logo Blurred) */}
            <div className="p-6 flex flex-col items-center justify-center space-y-1.5 bg-neutral-50/40 relative overflow-hidden select-none">
              <div className="filter blur-[5px] opacity-40 pointer-events-none flex flex-col items-center space-y-1.5 select-none">
                <div className="w-10 h-10 rounded-full border-2 border-neutral-800 flex items-center justify-center font-bold text-[10px] text-neutral-800 font-mono tracking-tighter">
                  HIPAA
                </div>
                <span className="text-[12px] font-bold text-neutral-900">HIPAA Compliant</span>
                <span className="text-[10px] text-neutral-400 font-mono">Healthcare Grade</span>
              </div>
            </div>

            {/* 3. Badge 3 (Content & Logo Blurred) */}
            <div className="p-6 flex flex-col items-center justify-center space-y-1.5 bg-neutral-50/40 relative overflow-hidden select-none">
              <div className="filter blur-[5px] opacity-40 pointer-events-none flex flex-col items-center space-y-1.5 select-none">
                <div className="w-10 h-10 rounded-full border-2 border-neutral-800 flex items-center justify-center font-bold text-[10px] text-neutral-800 font-mono tracking-tighter">
                  RAMP
                </div>
                <span className="text-[12px] font-bold text-neutral-900">TX-RAMP</span>
                <span className="text-[10px] text-neutral-400 font-mono">GovCloud Level 2</span>
              </div>
            </div>

            {/* 4. Badge 4 (Content & Logo Blurred) */}
            <div className="p-6 flex flex-col items-center justify-center space-y-1.5 bg-neutral-50/40 relative overflow-hidden select-none">
              <div className="filter blur-[5px] opacity-40 pointer-events-none flex flex-col items-center space-y-1.5 select-none">
                <div className="w-10 h-10 rounded-full border-2 border-neutral-800 flex items-center justify-center font-bold text-[10px] text-neutral-800 font-mono tracking-tighter">
                  SOC 2
                </div>
                <span className="text-[12px] font-bold text-neutral-900">AICPA SOC 2</span>
                <span className="text-[10px] text-neutral-400 font-mono">Type II Certified</span>
              </div>
            </div>

            {/* 5. Badge 5 (Content & Logo Blurred) */}
            <div className="p-6 flex flex-col items-center justify-center space-y-1.5 bg-neutral-50/40 relative overflow-hidden select-none">
              <div className="filter blur-[5px] opacity-40 pointer-events-none flex flex-col items-center space-y-1.5 select-none">
                <div className="w-10 h-10 rounded-full border-2 border-neutral-800 flex items-center justify-center font-bold text-[10px] text-neutral-800 font-mono tracking-tighter">
                  RAMP
                </div>
                <span className="text-[12px] font-bold text-neutral-900">FedRAMP</span>
                <span className="text-[10px] text-neutral-400 font-mono">High Equivalent</span>
              </div>
            </div>

            {/* 6. Badge 6 (Content & Logo Blurred) */}
            <div className="p-6 flex flex-col items-center justify-center space-y-1.5 bg-neutral-50/40 relative overflow-hidden select-none">
              <div className="filter blur-[5px] opacity-40 pointer-events-none flex flex-col items-center space-y-1.5 select-none">
                <div className="w-10 h-10 rounded-full border-2 border-neutral-800 flex items-center justify-center font-bold text-[10px] text-neutral-800 font-mono tracking-tighter">
                  GDPR
                </div>
                <span className="text-[12px] font-bold text-neutral-900">GDPR / EU</span>
                <span className="text-[10px] text-neutral-400 font-mono">Data Sovereignty</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
