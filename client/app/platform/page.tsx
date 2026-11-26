"use client";

import Link from "next/link";
import { TopAnnouncementBar } from "@/components/layouts/TopAnnouncementBar";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { CustomerStoriesSection } from "@/sections/CustomerStoriesSection";
import { FloatingAssistantWidget } from "@/components/ui/FloatingAssistantWidget";
import { ArrowRight } from "lucide-react";

export default function PlatformPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans antialiased selection:bg-[#1F45EC]/15 selection:text-[#1F45EC]">
      <TopAnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* Platform Hero Card with 3D Fluid Ribbon */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
          <div className="relative rounded-md overflow-hidden border border-neutral-200/90 shadow-md bg-neutral-950 text-white min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-8 sm:p-12 lg:p-16">
            <img
              src="/hero-fluid-ribbon.png"
              alt="Axios Platform"
              className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-mono font-medium uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#1F45EC]" />
                Platform Architecture
              </span>
              <span className="text-[11px] font-mono text-white/50 tracking-wider hidden sm:inline">
                ENTERPRISE REASONING LAYER
              </span>
            </div>

            <div className="relative z-10 max-w-2xl my-auto py-6">
              <h1 className="text-[34px] sm:text-[48px] lg:text-[56px] font-bold tracking-[-0.035em] text-white leading-[1.08] font-sans mb-5">
                The Enterprise AI Platform.
              </h1>
              <div className="space-y-1.5 text-[15px] sm:text-[17px] text-white/85 font-sans leading-relaxed">
                <p>
                  Axios connects, secures, and reasons across company knowledge without hallucinations or model leakage.
                </p>
                <p className="text-white/70">
                  Ground every workflow in deterministic company context with sub-second permissions synchronization.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-4 pt-4 border-t border-white/15">
              <Link
                href="/get-a-demo"
                className="h-10 px-5 rounded-lg bg-white hover:bg-neutral-100 text-black text-[13.5px] font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <span>Get a platform demo</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Clean Content Accordion + Leaders Slider */}
        <CustomerStoriesSection />
      </main>

      <Footer />
      <FloatingAssistantWidget />
    </div>
  );
}
