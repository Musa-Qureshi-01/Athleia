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

  // Auto-switch services every 5 seconds with progress bar
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
        <div className="mb-14 max-w-2xl">
          <span className="text-label text-text-tertiary block mb-3 uppercase tracking-wider font-mono">
            Platform Capabilities
          </span>
          <h2 className="text-heading-1 text-text-primary mb-4">
            Unified Enterprise AI Suite for Plant Intelligence.
          </h2>
          <p className="text-body-lg text-text-secondary leading-relaxed">
            Select a service below to explore how Athleia transforms legacy paper SOPs, CAD schematics, safety regulations, and equipment sensors into actionable intelligence.
          </p>
        </div>

        {/* Dual-Column Interactive Platform Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column — Interactive Services List (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2">
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
                    "w-full text-left p-4 rounded-sm border transition-all duration-200 flex flex-col gap-2 relative overflow-hidden",
                    isSelected
                      ? "bg-bg-primary border-border-strong shadow-sm"
                      : "bg-bg-primary/40 border-border-subtle hover:bg-bg-primary/80 hover:border-border-subtle text-text-secondary"
                  )}
                >
                  {/* Progress Line for selected item */}
                  {isSelected && (
                    <div
                      className="absolute top-0 left-0 bottom-0 w-1 bg-accent transition-all duration-100"
                      style={{ height: `${progress}%` }}
                    />
                  )}

                  <div className="flex items-center justify-between pl-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-sm flex items-center justify-center shrink-0 transition-colors",
                          isSelected ? "bg-accent/15 text-accent" : "bg-bg-tertiary text-text-tertiary"
                        )}
                      >
                        <IconComp size={15} />
                      </div>
                      <span className={cn("text-xs font-semibold", isSelected ? "text-text-primary font-bold" : "text-text-secondary")}>
                        {service.name}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-text-tertiary">
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
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="p-8 rounded-sm border border-border-strong bg-bg-primary shadow-xl flex flex-col justify-between gap-8 min-h-[440px]"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-semibold bg-accent/10 text-accent uppercase tracking-wider border border-accent/20">
                      {activeService.category}
                    </span>
                    <span className="text-xs font-mono text-text-tertiary">
                      Category 0{selectedIndex + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-heading-2 text-text-primary mb-2">
                      {activeService.name}
                    </h3>
                    <p className="text-xs font-mono text-text-tertiary mb-4">
                      {activeService.tagline}
                    </p>
                    <p className="text-xs text-text-secondary leading-relaxed mb-4">
                      {activeService.description}
                    </p>
                  </div>

                  {/* Features Bullet List */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-text-tertiary font-semibold block mb-2">
                      Core Enterprise Capabilities
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-primary">
                      {activeService.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 bg-bg-secondary p-2.5 rounded-sm border border-border-subtle">
                          <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                          <span className="text-[11px] text-text-secondary leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Business Impact Footer */}
                <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    {activeService.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="flex flex-col">
                        <span className="text-sm font-bold font-mono text-text-primary">{m.value}</span>
                        <span className="text-[10px] text-text-tertiary">{m.label}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/products/${activeService.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-text-primary text-bg-primary text-xs font-medium hover:opacity-90 transition-opacity shrink-0"
                  >
                    <span>View Product Details</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
