"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PRODUCT_SERVICES, ProductService } from "@/lib/enterprise-data";
import { ArrowLeft, ArrowRight, Bot, ShieldCheck, Wrench, Layers, Search, Cpu, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ServicesShowcaseSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  // Continuous auto-scroll loop (2 cards visible on desktop, step by 1)
  const maxIndex = PRODUCT_SERVICES.length - 2;

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section id="products" className="section-spacing border-b border-border-subtle bg-bg-primary">
      <div className="container-editorial">

        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl space-y-3">
            <span className="text-label text-text-tertiary block uppercase tracking-wider font-mono">
              Enterprise Product Suite
            </span>
            <h2 className="text-heading-1 text-text-primary">
              Core Intelligence Modules
            </h2>
            <p className="text-body-lg text-text-secondary leading-relaxed">
              Explore Athleia&apos;s modular AI services designed to orchestrate enterprise knowledge across every industrial department.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-sm border border-border-subtle bg-bg-secondary flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
              aria-label="Previous Products"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-sm border border-border-subtle bg-bg-secondary flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
              aria-label="Next Products"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Carousel Container (Only 2 cards visible at a time on desktop) */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex gap-6 transition-transform duration-500 ease-out"
            animate={{ x: `-${currentIndex * (50 + 1.5)}%` }} // 50% width + gap spacing
          >
            {PRODUCT_SERVICES.map((service) => {
              const IconComp = getIcon(service.iconName);

              return (
                <div
                  key={service.id}
                  className="w-full md:w-[calc(50%-0.75rem)] shrink-0"
                >
                  <Link
                    href={`/products/${service.slug}`}
                    className="group block p-7 rounded-sm border border-border-subtle bg-bg-secondary hover:bg-bg-primary hover:border-border-strong transition-all duration-300 shadow-2xs h-full flex flex-col justify-between gap-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-sm bg-accent/15 border border-accent/30 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                          <IconComp size={18} />
                        </div>
                        <span className="text-[10px] font-mono text-text-tertiary px-2 py-0.5 rounded bg-bg-primary border border-border-subtle">
                          {service.category}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-heading-2 text-text-primary group-hover:text-accent transition-colors flex items-center justify-between">
                          <span>{service.name}</span>
                          <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-accent" />
                        </h3>
                        <p className="text-xs font-mono text-text-tertiary mt-1 mb-3">
                          {service.tagline}
                        </p>
                        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                      </div>

                      {/* Business Impact Pill */}
                      <div className="p-3 rounded-sm bg-bg-primary border border-border-subtle text-xs text-text-secondary">
                        <span className="font-semibold text-text-primary block mb-0.5">Business Impact:</span>
                        <span className="text-[11px] text-text-secondary leading-snug">{service.businessImpact}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-text-tertiary">
                      <span>{service.metrics[0]?.label}</span>
                      <span className="font-bold text-text-primary">{service.metrics[0]?.value}</span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                currentIndex === idx ? "bg-accent w-6" : "bg-border-strong hover:bg-text-tertiary"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
