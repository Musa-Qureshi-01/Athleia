"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCT_SERVICES, ProductService } from "@/lib/enterprise-data";
import { Bot, ShieldCheck, Wrench, Layers, Search, Cpu, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function PlatformOverviewSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const activeService: ProductService = PRODUCT_SERVICES[selectedIndex];

  // Auto-switch services every 5 seconds with smooth progress bar
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setSelectedIndex((idx) => (idx + 1) % PRODUCT_SERVICES.length);
          return 0;
        }
        return prev + 2; // 50 steps * 100ms = 5000ms
      });
    }, 100);

    return () => clearInterval(interval);
  }, [selectedIndex]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Bot": return Bot;
      case "ShieldCheck": return ShieldCheck;
      case "Wrench": return Wrench;
      case "Layers": return Layers;
      case "Search": return Search;
      case "Cpu": return Cpu;
      default: return Cpu;
    }
  };

  return (
    <section id="overview" className="section-spacing border-b border-border-subtle bg-bg-secondary">
      <div className="container-editorial">

        {/* Section Header */}
        <div className="mb-14 max-w-3xl space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-tertiary font-semibold block">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-heading-1 text-text-primary leading-tight font-semibold">
            Unified Enterprise AI Suite for Industrial Operations.
          </h2>
          <p className="text-body-lg text-text-secondary leading-relaxed max-w-2xl">
            Select a core service below to explore how Athleia transforms paper engineering manuals, CAD schematics, safety standards, and sensor streams into verified intelligence.
          </p>
        </div>

        {/* Dual-Column Interactive Platform Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column — Interactive Services List with Subtitles (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {PRODUCT_SERVICES.map((service, index) => {
              const isSelected = selectedIndex === index;
              const IconComp = getIcon(service.iconName);

              return (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedIndex(index);
                    setProgress(0);
                  }}
                  className={cn(
                    "w-full text-left p-4 lg:p-5 rounded-md border transition-all duration-300 flex flex-col gap-2 relative overflow-hidden group",
                    isSelected
                      ? "bg-bg-primary border-border-strong shadow-md ring-1 ring-accent/20"
                      : "bg-bg-primary/50 border-border-subtle hover:bg-bg-primary hover:border-border-strong text-text-secondary"
                  )}
                >
                  {/* Progress Indicator for Active Selection */}
                  {isSelected && (
                    <div
                      className="absolute top-0 left-0 bottom-0 w-1 bg-accent transition-all duration-100"
                      style={{ height: `${progress}%` }}
                    />
                  )}

                  <div className="flex items-start justify-between gap-3 pl-2">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-sm flex items-center justify-center shrink-0 transition-colors mt-0.5",
                          isSelected ? "bg-accent/15 text-accent" : "bg-bg-tertiary text-text-tertiary group-hover:text-text-primary"
                        )}
                      >
                        <IconComp size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className={cn("text-sm font-semibold transition-colors", isSelected ? "text-text-primary font-bold" : "text-text-primary/90")}>
                          {service.name}
                        </span>
                        <span className="text-xs text-text-secondary line-clamp-1 mt-0.5 leading-normal">
                          {service.tagline}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-text-tertiary shrink-0">
                      0{index + 1}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column — Detailed Service Card Preview (7 cols) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="p-8 lg:p-10 rounded-md border border-border-subtle bg-bg-primary shadow-xl flex flex-col justify-between gap-8 min-h-[480px]"
              >
                <div className="space-y-6">
                  {/* Category Badge & Index */}
                  <div className="flex items-center justify-between border-b border-border-subtle/80 pb-4">
                    <span className="px-3 py-1 rounded-sm text-[11px] font-mono font-semibold bg-accent/10 text-accent uppercase tracking-wider border border-accent/20">
                      {activeService.category}
                    </span>
                    <span className="text-xs font-mono text-text-tertiary">
                      SERVICE 0{selectedIndex + 1} / 0{PRODUCT_SERVICES.length}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-heading-1 text-text-primary font-semibold">
                      {activeService.name}
                    </h3>
                    <p className="text-xs font-mono text-text-tertiary">
                      {activeService.tagline}
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed pt-2">
                      {activeService.description}
                    </p>
                  </div>

                  {/* Feature Grid */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold block">
                      CORE PLATFORM CAPABILITIES
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {activeService.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 bg-bg-secondary p-3 rounded-sm border border-border-subtle">
                          <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
                          <span className="text-xs text-text-secondary leading-normal">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Business Impact Footer & Action Buttons */}
                <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    {activeService.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="flex flex-col">
                        <span className="text-base font-bold font-mono text-text-primary">{m.value}</span>
                        <span className="text-[11px] text-text-tertiary">{m.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/products/${activeService.slug}`}
                      className="inline-flex items-center gap-1.5 h-10 px-5 rounded-sm bg-text-primary text-bg-primary text-xs font-semibold hover:opacity-90 transition-opacity shrink-0 shadow-xs"
                    >
                      <span>Explore Product Spec</span>
                      <ArrowRight size={14} />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center h-10 px-4 rounded-sm border border-border-strong bg-transparent text-text-primary text-xs font-medium hover:bg-bg-secondary transition-colors"
                    >
                      Book Demo
                    </Link>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
