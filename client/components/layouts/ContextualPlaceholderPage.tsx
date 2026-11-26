"use client";

import Link from "next/link";
import { TopAnnouncementBar } from "@/components/layouts/TopAnnouncementBar";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { FloatingAssistantWidget } from "@/components/ui/FloatingAssistantWidget";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface ContextualPlaceholderPageProps {
  badge: string;
  title: string;
  line1: string;
  line2: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function ContextualPlaceholderPage({
  badge,
  title,
  line1,
  line2,
  primaryCtaText = "Get a demo",
  primaryCtaHref = "/get-a-demo",
  secondaryCtaText = "Back to home",
  secondaryCtaHref = "/",
}: ContextualPlaceholderPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans antialiased selection:bg-[#1F45EC]/15 selection:text-[#1F45EC]">
      <TopAnnouncementBar />
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Card Container with Home Page Fluid Ribbon Background */}
          <div className="relative rounded-md overflow-hidden border border-neutral-200/90 shadow-lg bg-neutral-950 text-white min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-8 sm:p-14 lg:p-16">
            
            {/* Background 3D Fluid Ribbon Image from Homepage */}
            <img
              src="/hero-fluid-ribbon.png"
              alt="Axios Enterprise"
              className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none select-none scale-105"
            />
            {/* Ambient Dark Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 pointer-events-none" />

            {/* Top Category Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-mono font-medium uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#1F45EC]" />
                {badge}
              </span>

              <span className="text-[11px] font-mono text-white/50 tracking-wider hidden sm:inline">
                AXIOS ENTERPRISE INTELLIGENCE
              </span>
            </div>

            {/* Central Headline & 2-Line Contextual Message */}
            <div className="relative z-10 max-w-2xl my-auto py-8">
              <h1 className="text-[32px] sm:text-[46px] lg:text-[54px] font-bold tracking-[-0.03em] text-white leading-[1.08] font-sans mb-6">
                {title}
              </h1>

              <div className="space-y-2 text-[15px] sm:text-[17px] text-white/85 font-sans leading-relaxed">
                <p>{line1}</p>
                <p className="text-white/70">{line2}</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="relative z-10 flex flex-wrap items-center gap-4 pt-6 border-t border-white/15">
              <Link
                href={primaryCtaHref}
                className="h-11 px-6 rounded-lg bg-white hover:bg-neutral-100 text-black text-[13.5px] font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                href={secondaryCtaHref}
                className="h-11 px-5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 text-[13.5px] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{secondaryCtaText}</span>
              </Link>
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <FloatingAssistantWidget />
    </div>
  );
}
