"use client";

import Link from "next/link";
import { Lock, Laptop, Bot, Cpu, ArrowRight } from "lucide-react";

interface DesktopOnlyBannerProps {
  serviceName: string;
  description?: string;
}

export function DesktopOnlyBanner({ serviceName, description }: DesktopOnlyBannerProps) {
  return (
    <div className="md:hidden mb-6 p-4 rounded-md border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-bg-secondary to-bg-tertiary shadow-md relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col gap-3 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-border-subtle/60 pb-2.5">
          <div className="flex items-center gap-2 text-amber-400">
            <div className="p-1 rounded bg-amber-500/15 border border-amber-500/30">
              <Lock size={14} className="shrink-0" />
            </div>
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase">
              Desktop Workstation Required
            </span>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30">
            Desktop Only
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <h3 className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
            <Laptop size={14} className="text-text-tertiary shrink-0" />
            <span>{serviceName} is locked on mobile view</span>
          </h3>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            {description ||
              "Document uploads, multi-agent executions, heavy knowledge graph processing, and compliance audits require a desktop workstation view. Open Axios.ai on your desktop browser for full access."}
          </p>
        </div>

        {/* Available Mobile Services List */}
        <div className="pt-2 border-t border-border-subtle/50 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider">
            Unlocked Services on Mobile:
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-medium text-text-secondary">
            <Link
              href="/workspace/assistant"
              className="flex items-center gap-1.5 p-1.5 rounded bg-bg-primary border border-border-subtle hover:border-accent hover:text-accent transition-colors"
            >
              <Bot size={13} className="text-accent shrink-0" />
              <span className="truncate">Workforce Copilot</span>
            </Link>
            <Link
              href="/workspace/intelligence"
              className="flex items-center gap-1.5 p-1.5 rounded bg-bg-primary border border-border-subtle hover:border-accent hover:text-accent transition-colors"
            >
              <Cpu size={13} className="text-accent shrink-0" />
              <span className="truncate">Intelligence</span>
            </Link>
          </div>

          <Link
            href="/workspace/assistant"
            className="mt-1 flex items-center justify-center gap-2 h-8 rounded bg-text-primary text-bg-primary text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <span>Launch Workforce Copilot</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
