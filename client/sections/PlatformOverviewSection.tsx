"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  BrainCircuit,
  Bot,
  Laptop,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  GitBranch,
  FileCode,
  Terminal,
  MessageSquare,
  Globe
} from "lucide-react";

interface PlatformPillar {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  icon: React.ElementType;
  mockup: {
    badge: string;
    header: string;
    interfaceType: string;
    details: React.ReactNode;
  };
}

const PILLARS: PlatformPillar[] = [
  {
    id: "connect",
    number: "01",
    title: "Connect Knowledge",
    tagline: "Unify every siloed enterprise tool without data migration.",
    description: "Axios deploys 275+ pre-built native enterprise connectors to index docs, tickets, spreadsheets, pull requests, chats, and CAD schematics with zero data migration and continuous real-time synchronization.",
    bullets: [
      "Native sync for Google Workspace, Microsoft 365, Slack, Salesforce, Jira, and GitHub",
      "Real-time ACL mirroring: access permissions update in sub-second intervals",
      "Multi-modal OCR for engineering blueprints, scanned PDFs, and complex table matrices"
    ],
    icon: Network,
    mockup: {
      badge: "REAL-TIME INGESTION PIPELINE",
      header: "Active Enterprise Connector Ingestion Stream",
      interfaceType: "Connector Status",
      details: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-bg-secondary rounded-lg border border-border-subtle">
              <span className="font-mono text-text-tertiary block text-[10px]">CONNECTOR SOURCE</span>
              <span className="font-semibold text-text-primary">Google Drive (Engineering)</span>
              <span className="text-[11px] font-mono text-emerald-600 block mt-1">● Synchronized (1.4M docs)</span>
            </div>
            <div className="p-3 bg-bg-secondary rounded-lg border border-border-subtle">
              <span className="font-mono text-text-tertiary block text-[10px]">CONNECTOR SOURCE</span>
              <span className="font-semibold text-text-primary">Jira Enterprise Cloud</span>
              <span className="text-[11px] font-mono text-emerald-600 block mt-1">● Realtime Webhook Active</span>
            </div>
            <div className="p-3 bg-bg-secondary rounded-lg border border-border-subtle">
              <span className="font-mono text-text-tertiary block text-[10px]">CONNECTOR SOURCE</span>
              <span className="font-semibold text-text-primary">GitHub Organization Repos</span>
              <span className="text-[11px] font-mono text-emerald-600 block mt-1">● 842 Repos Indexed</span>
            </div>
            <div className="p-3 bg-bg-secondary rounded-lg border border-border-subtle">
              <span className="font-mono text-text-tertiary block text-[10px]">CONNECTOR SOURCE</span>
              <span className="font-semibold text-text-primary">Salesforce CRM Entities</span>
              <span className="text-[11px] font-mono text-emerald-600 block mt-1">● Account &amp; Opp Sync OK</span>
            </div>
          </div>
          <div className="p-3 bg-accent/5 rounded-lg border border-accent/20 flex items-center justify-between text-xs font-mono">
            <span className="text-text-primary font-medium">Ingestion Throughput: 4,800 events/sec</span>
            <span className="text-accent font-semibold">Latency: 180ms</span>
          </div>
        </div>
      )
    }
  },
  {
    id: "understand",
    number: "02",
    title: "Understand Context",
    tagline: "The Axios Enterprise Knowledge Graph decodes company memory.",
    description: "Axios constructs a live, self-updating Enterprise Knowledge Graph. It maps people, organizational hierarchies, projects, document revisions, and communication pathways to discern true institutional context.",
    bullets: [
      "Disambiguates duplicate acronyms, internal codenames, and legacy project names",
      "Scores document freshness, authoritative ownership, and organizational trust tiers",
      "Dynamic intent classification routes queries to the optimal underlying model"
    ],
    icon: BrainCircuit,
    mockup: {
      badge: "SEMANTIC KNOWLEDGE GRAPH",
      header: "Context Resolution & Entity Disambiguation Engine",
      interfaceType: "Entity Graph",
      details: (
        <div className="space-y-3">
          <div className="p-3.5 bg-bg-secondary rounded-lg border border-border-subtle">
            <div className="flex items-center justify-between text-xs font-mono text-text-tertiary mb-2">
              <span>QUERY ENTITY DETECTED</span>
              <span className="text-accent font-semibold">Confidence 99.4%</span>
            </div>
            <p className="text-xs font-medium text-text-primary">
              Entity: <strong className="text-accent">Project Boreas</strong> → Resolved to &ldquo;Internal GenAI RAG Gateway (v2.4)&rdquo; owned by Platform Infrastructure team.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-bg-secondary/60 rounded border border-border-subtle/80">
              <span className="font-mono text-text-secondary">Authoritative Owner:</span>
              <span className="font-semibold text-text-primary">Staff Eng. Maya Lin (@mlin)</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-bg-secondary/60 rounded border border-border-subtle/80">
              <span className="font-mono text-text-secondary">Freshness Index:</span>
              <span className="font-semibold text-emerald-600">Updated 4 hours ago (Primary)</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-bg-secondary/60 rounded border border-border-subtle/80">
              <span className="font-mono text-text-secondary">Related Deprecated Docs:</span>
              <span className="font-semibold text-text-tertiary">3 Older Versions Masked</span>
            </div>
          </div>
        </div>
      )
    }
  },
  {
    id: "action",
    number: "03",
    title: "Take Action",
    tagline: "Autonomous enterprise agents that execute complex workflows.",
    description: "Move beyond passive Q&A. Axios agents proactively trigger actions across your tech stack—opening Jira tickets, executing database lookups, generating audited compliance drafts, and updating CRM records.",
    bullets: [
      "Human-in-the-loop permission gates for sensitive production actions",
      "Pre-built agents for engineering triage, customer support, IT ticketing, and sales prep",
      "Deterministic tool calling with verifiable execution audit traces"
    ],
    icon: Bot,
    mockup: {
      badge: "AUTONOMOUS WORKFLOW EXECUTION",
      header: "Multi-Step Enterprise Agent Action Plan",
      interfaceType: "Agent Execution",
      details: (
        <div className="space-y-3">
          <div className="border border-border-subtle rounded-lg p-3 bg-bg-secondary/70">
            <span className="text-[11px] font-mono text-text-tertiary block mb-1">TASK GOAL</span>
            <p className="text-xs font-medium text-text-primary">
              Generate Vendor Security Review &amp; file Jira compliance ticket.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>Step 1: Extracted SOC2 Type II cert from vendor portal</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>Step 2: Cross-checked 14 encryption controls with CISO policy</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 bg-accent/10 border border-accent/30 rounded text-xs text-text-primary font-medium">
              <Bot size={14} className="text-accent shrink-0 animate-spin" />
              <span>Step 3: Creating Jira ticket SEC-4091 with signed audit PDF...</span>
            </div>
          </div>
        </div>
      )
    }
  },
  {
    id: "everywhere",
    number: "04",
    title: "Work Everywhere",
    tagline: "Embedded directly into the browser, Slack, Teams, and IDEs.",
    description: "Intelligence meets employees right where they already work. Access Axios directly inside Slack, Microsoft Teams, the browser via extension, desktop Spotlight, or via secure developer APIs.",
    bullets: [
      "Enterprise browser extension provides instant context over web pages & SaaS apps",
      "Native Slack & Microsoft Teams bot for collaborative conversational triage",
      "Developer API and SDKs for embedding Axios intelligence into proprietary apps"
    ],
    icon: Laptop,
    mockup: {
      badge: "MULTI-SURFACE INTERFACES",
      header: "Unified Assistant Across Everyday Workplaces",
      interfaceType: "Surface Hub",
      details: (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-bg-secondary rounded-lg border border-border-subtle flex flex-col items-center">
              <MessageSquare size={18} className="text-accent mb-1.5" />
              <span className="text-xs font-semibold text-text-primary">Slack / Teams</span>
              <span className="text-[10px] font-mono text-emerald-600 mt-0.5">Active Bot</span>
            </div>
            <div className="p-3 bg-bg-secondary rounded-lg border border-border-subtle flex flex-col items-center">
              <Globe size={18} className="text-accent mb-1.5" />
              <span className="text-xs font-semibold text-text-primary">Browser Ext</span>
              <span className="text-[10px] font-mono text-emerald-600 mt-0.5">Side Panel</span>
            </div>
            <div className="p-3 bg-bg-secondary rounded-lg border border-border-subtle flex flex-col items-center">
              <Terminal size={18} className="text-accent mb-1.5" />
              <span className="text-xs font-semibold text-text-primary">CLI &amp; API</span>
              <span className="text-[10px] font-mono text-emerald-600 mt-0.5">REST / SDK</span>
            </div>
          </div>

          <div className="p-3 bg-bg-secondary rounded-lg border border-border-subtle flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-text-primary font-medium">Single Sign-On (SAML / Okta)</span>
            </div>
            <span className="font-mono text-text-tertiary">Zero Re-Auth Needed</span>
          </div>
        </div>
      )
    }
  }
];

export function PlatformOverviewSection() {
  const [activeTab, setActiveTab] = useState<string>("connect");
  const currentPillar = PILLARS.find((p) => p.id === activeTab) || PILLARS[0];

  return (
    <section id="platform" className="py-24 lg:py-32 bg-bg-secondary/40 border-b border-border-subtle relative">
      <div className="container-editorial">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border-subtle bg-bg-primary text-text-secondary text-xs font-mono font-medium mb-4 shadow-2xs">
            <Sparkles size={14} className="text-accent" />
            <span>HOW AXIOS WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.12] mb-5">
            The four pillars of the{" "}
            <span className="text-accent">Axios enterprise platform.</span>
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            From ingestion and graph construction to autonomous agent execution and multi-surface delivery, explore how Axios turns fragmented knowledge into enterprise velocity.
          </p>
        </div>

        {/* 4 Pillars Interactive Tab Navigator */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-12">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const isSelected = pillar.id === activeTab;
            return (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(pillar.id)}
                className={`p-5 rounded-md border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-bg-primary border-accent/50 shadow-md ring-1 ring-accent/20"
                    : "bg-bg-primary/60 border-border-subtle hover:bg-bg-primary hover:border-border-strong text-text-secondary"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-accent">
                      {pillar.number}
                    </span>
                    <Icon size={18} className={isSelected ? "text-accent" : "text-text-tertiary"} />
                  </div>
                  <h3 className="text-base font-bold text-text-primary mb-1">
                    {pillar.title}
                  </h3>
                </div>
                <span className="text-xs text-text-tertiary line-clamp-1 mt-2">
                  {pillar.tagline}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Pillar Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPillar.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-bg-primary border border-border-subtle rounded-lg p-6 sm:p-10 lg:p-12 shadow-sm"
          >
            {/* Left Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider block mb-2">
                  PILLAR {currentPillar.number}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mb-3">
                  {currentPillar.title}
                </h3>
                <p className="text-base font-medium text-text-primary mb-4">
                  {currentPillar.tagline}
                </p>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  {currentPillar.description}
                </p>

                <div className="space-y-3 mb-8">
                  {currentPillar.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-text-secondary font-medium leading-relaxed">
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle flex items-center gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-accent hover:text-text-primary transition-colors cursor-pointer"
                >
                  <span>Learn more about {currentPillar.title}</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Right Column Product Mockup (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-bg-secondary/60 border border-border-subtle rounded-md p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                    <span className="text-xs font-mono font-bold text-text-primary">
                      {currentPillar.mockup.header}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-primary border border-border-subtle text-text-tertiary">
                    {currentPillar.mockup.badge}
                  </span>
                </div>

                <div className="bg-bg-primary rounded-md border border-border-subtle p-5 shadow-2xs">
                  {currentPillar.mockup.details}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
