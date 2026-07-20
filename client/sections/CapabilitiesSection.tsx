"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PLATFORM_SERVICES, CAPABILITIES } from "@/lib/constants";
import { Cpu, Server, ShieldCheck, Activity, Search, Database, Bell, Wrench, Bot, Layers } from "lucide-react";

export function CapabilitiesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const getServiceIcon = (port: string) => {
    switch (port) {
      case "8000": return Server;
      case "8008": return ShieldCheck;
      case "8010": return Bot;
      case "8006": return ShieldCheck;
      case "8007": return Wrench;
      case "8001": return Search;
      case "8002": return Cpu;
      case "8003": return Layers;
      case "8005": return Database;
      case "8009": return Bell;
      default: return Cpu;
    }
  };

  return (
    <section id="platform" className="section-spacing border-b border-border-subtle bg-bg-primary">
      <div className="container-editorial">

        {/* Section Header */}
        <div className="mb-14">
          <span className="text-label text-text-tertiary block mb-3 uppercase tracking-wider font-mono">
            Platform Microservices Architecture
          </span>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <h2 className="text-heading-1 text-text-primary">
              10 Enterprise Services Engineered for Industrial Intelligence.
            </h2>
            <p className="text-body-lg text-text-secondary leading-relaxed">
              Athleia orchestrates specialized microservices on dedicated ports (8000 through 8010), giving your enterprise modular scalability, strict RBAC isolation, and instant audit traceability.
            </p>
          </div>
        </div>

        {/* 10 Microservices Grid Cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORM_SERVICES.map((svc, i) => {
            const IconComponent = getServiceIcon(svc.port);
            return (
              <motion.div
                key={svc.port}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="p-5 rounded-sm border border-border-subtle bg-bg-secondary hover:bg-bg-primary hover:border-border-strong transition-all duration-200 flex flex-col justify-between gap-4 group shadow-2xs"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <IconComponent size={14} />
                      </div>
                      <span className="text-xs font-semibold text-text-primary">{svc.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-bg-primary border border-border-subtle text-text-tertiary font-medium">
                      Port {svc.port}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                  <span className="text-accent font-semibold">{svc.tag}</span>
                  <span className="truncate max-w-[150px]">{svc.tech}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Core Capabilities Sub-Grid */}
        <div className="mt-16 pt-12 border-t border-border-subtle">
          <h3 className="text-heading-2 text-text-primary mb-8">
            Operational Capabilities Grid
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CAPABILITIES.map((cap, i) => (
              <div
                key={cap.tag}
                className="p-6 rounded-sm border border-border-subtle bg-bg-secondary flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <span className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">
                    {cap.tag}
                  </span>
                  <h4 className="text-base font-semibold text-text-primary">{cap.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{cap.description}</p>
                </div>
                <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-mono">
                  <span className="text-text-primary font-medium">{cap.metric}</span>
                  <span className="text-text-tertiary text-[11px]">{cap.metricLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
