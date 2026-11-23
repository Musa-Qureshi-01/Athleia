"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface IntegrationApp {
  name: string;
  category: string;
  color: string;
  iconSvg: string;
}

const INTEGRATIONS: IntegrationApp[] = [
  {
    name: "Slack",
    category: "Communication",
    color: "#E01E5A",
    iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>`,
  },
  {
    name: "Google Drive",
    category: "Documents",
    color: "#0F9D58",
    iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.74 3.75L12 11.25H3.48L7.74 3.75zM12 11.25L16.26 3.75H7.74L12 11.25zm4.26-7.5L20.52 11.25H12l4.26-7.5zM3.48 11.25L7.74 18.75H0l3.48-7.5zm17.04 0L24 16.5l-3.48 4.5-4.26-7.5h4.26zM7.74 18.75L12 11.25l4.26 7.5H7.74z"/></svg>`,
  },
  {
    name: "Microsoft Teams",
    category: "Collaboration",
    color: "#464EB8",
    iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.5 7.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5zM14.25 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-1.5 3h3A2.25 2.25 0 0 1 18 11.25v4.5A2.25 2.25 0 0 1 15.75 18h-3A2.25 2.25 0 0 1 10.5 15.75v-4.5A2.25 2.25 0 0 1 12.75 9zm6 1.5h1.5A1.5 1.5 0 0 1 21.75 12v3a1.5 1.5 0 0 1-1.5 1.5h-1.5v-6zM3 9h6a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 9 21H3a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 3 9zm3 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`,
  },
  {
    name: "Jira Software",
    category: "Issue Tracking",
    color: "#0052CC",
    iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.53 2c0 2.4-1.97 4.35-4.4 4.35H2.74L11.53 2zm0 5.48c0 2.4-1.97 4.35-4.4 4.35H2.74l8.79-4.35zm0 5.48c0 2.4-1.97 4.35-4.4 4.35H2.74l8.79-4.35zm.94-10.96c0-2.4 1.97-4.35 4.4-4.35h4.39L12.47 2zm0 5.48c0-2.4 1.97-4.35 4.4-4.35h4.39l-8.79 4.35zm0 5.48c0-2.4 1.97-4.35 4.4-4.35h4.39l-8.79 4.35z"/></svg>`,
  },
  {
    name: "GitHub",
    category: "Code & CI/CD",
    color: "#181717",
    iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
  },
  {
    name: "Salesforce",
    category: "CRM & Pipeline",
    color: "#00A1E0",
    iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.34 9.38a5.1 5.1 0 0 0-4.75-3.23 5.2 5.2 0 0 0-2.34.56A6.16 6.16 0 0 0 6.6 4.5a6.26 6.26 0 0 0-6.19 5.37A4.68 4.68 0 0 0 0 11.5a4.7 4.7 0 0 0 4.7 4.7h14.6a4.7 4.7 0 0 0 4.7-4.7 4.67 4.67 0 0 0-4.66-2.12z"/></svg>`,
  },
  {
    name: "Confluence",
    category: "Knowledge Base",
    color: "#172B4D",
    iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 16.5C1.1 14.8.8 12.3 1.8 10.2l2.3 2.3c-.4.9-.3 2 .4 2.8l-2 1.2zm19-9c1.4 1.7 1.7 4.2.7 6.3l-2.3-2.3c.4-.9.3-2-.4-2.8l2-1.2zM7.2 4.1C9 3.1 11.2 3.3 12.8 4.7l-2.3 2.3c-.7-.5-1.7-.6-2.5-.2L7.2 4.1zm9.6 15.8c-1.8 1-4 .8-5.6-.6l2.3-2.3c.7.5 1.7.6 2.5.2l.8 2.7z"/></svg>`,
  },
  {
    name: "Notion",
    category: "Workspaces",
    color: "#000000",
    iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 2.062c-.42-.326-.98-.7-2.053-.607L2.92 2.575c-.42.047-.514.327-.374.56l1.913 1.073zm.886 4.15v12.775c0 .746.42 1.026 1.213.98l14.335-.84c.793-.046.98-.56.98-1.166V6.96c0-.653-.28-.98-.84-.933l-14.848.886c-.607.047-.84.42-.84.933v.512zm13.483 1.026c.093.42 0 .84-.42.886l-.7.14v8.347c-.513.28-1.026.466-1.54.466-.793 0-1.213-.373-1.913-1.213l-4.432-6.53v6.39l1.4.327c.047.42-.28.84-.7.84l-3.36.186c-.093-.42 0-.84.373-.886l.84-.233V10.18l-1.12-.093c-.046-.42.187-.84.607-.84l3.546-.233 4.665 6.81v-5.83l-1.166-.14c-.047-.42.187-.84.606-.84l3.266-.186z"/></svg>`,
  },
  {
    name: "ServiceNow",
    category: "ITSM & Service",
    color: "#81B5A1",
    iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="4"/></svg>`,
  },
  {
    name: "Snowflake",
    category: "Data Cloud",
    color: "#29B5E8",
    iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.5 5.5L20 4l-3.5 5 5.5 2.5L16.5 14l5 3.5-5.5 2.5L14 24l-2.5-5.5L6 20l3.5-5L4 12.5 9.5 10 4.5 6.5l5.5-2.5L12 0z"/></svg>`,
  },
  {
    name: "Zendesk",
    category: "Customer Support",
    color: "#03363D",
    iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2v-3h2v3zm0-5h-2v-2h2v2z"/></svg>`,
  },
  {
    name: "Workday",
    category: "HR & Enterprise ERP",
    color: "#F68D2E",
    iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9zm0 3a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"/></svg>`,
  },
];

export function IntegrationsSection() {
  return (
    <section className="py-14 lg:py-20 bg-bg-secondary/50 border-b border-border-subtle overflow-hidden">
      <div className="container-editorial">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[12px] font-mono font-semibold uppercase tracking-widest text-text-tertiary block mb-2">
            Universal Enterprise Connectivity
          </span>
          <h2 className="text-[26px] sm:text-[32px] font-semibold text-text-primary tracking-tight">
            Connects to 275+ enterprise work apps and databases.
          </h2>
          <p className="text-sm text-text-secondary mt-2">
            Continuous bi-directional sync, zero data duplication, and real-time permission mirroring across every system your organization runs.
          </p>
        </div>

        {/* Integration Icons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 max-w-6xl mx-auto">
          {INTEGRATIONS.map((app) => (
            <motion.div
              key={app.name}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ duration: 0.15 }}
              className="p-4 rounded-xl border border-border-subtle bg-bg-primary hover:border-border-strong hover:shadow-sm transition-all flex flex-col items-center text-center group cursor-default"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center p-2 text-text-primary group-hover:scale-110 transition-transform mb-2.5 bg-bg-secondary"
                dangerouslySetInnerHTML={{ __html: app.iconSvg }}
              />
              <span className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors font-sans">
                {app.name}
              </span>
              <span className="text-[10px] font-mono text-text-tertiary mt-0.5">
                {app.category}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Sub-strip with Link */}
        <div className="mt-10 pt-6 border-t border-border-subtle/80 flex flex-col sm:flex-row items-center justify-between text-xs text-text-secondary max-w-4xl mx-auto gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <span>Need a custom on-premise connector? Deploy with our open Python & TypeScript SDK.</span>
          </div>
          <Link
            href="/demo"
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 shrink-0"
          >
            Explore all 275+ connectors <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  );
}

