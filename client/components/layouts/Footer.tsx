"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FOOTER_COLUMNS } from "@/lib/constants";
import { ArrowRight, CheckCircle2, ShieldCheck, Server, Lock } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <footer className="border-t border-border-subtle bg-bg-secondary text-text-primary">
      {/* Top Telemetry & Newsletter Section */}
      <div className="border-b border-border-subtle py-10">
        <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Telemetry Status */}
          <div className="lg:col-span-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-verified animate-pulse" />
              <span className="text-xs font-mono font-semibold text-text-primary">
                10 Platform Microservices Active
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-bg-primary border border-border-subtle text-text-tertiary">
                Ports 8000–8010
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Real-time monitoring across API Gateway, Auth, Retrieval, Ingestion, Compliance, Maintenance, and LangGraph Workforce Copilot.
            </p>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-6 flex flex-col gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary">
              Engineering Architecture Updates
            </span>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs font-mono text-status-verified">
                <CheckCircle2 size={14} />
                <span>Subscribed! You will receive our technical release notes.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter.your@engineering-team.com"
                  required
                  className="flex-1 bg-bg-primary border border-border-subtle rounded-sm px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-text-primary text-bg-primary rounded-sm text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1 shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight size={12} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Link Columns */}
      <div className="container-editorial py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Info Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-[4px] overflow-hidden">
                <Image src="/icon.png" alt="Athleia" width={24} height={24} className="w-6 h-6 object-cover" />
              </div>
              <span className="text-xs font-semibold tracking-wider font-mono">ATHLEIA.AI</span>
            </Link>
            <p className="text-xs text-text-secondary leading-relaxed">
              Enterprise Industrial Knowledge Intelligence Platform. Zero fabrication, 100% citation provenance.
            </p>

            <div className="flex flex-col gap-1.5 pt-2">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-tertiary">
                <Lock size={12} className="text-status-verified" />
                <span>ISO 27001 &amp; OSHA 1910 Compliant</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-tertiary">
                <Server size={12} className="text-accent" />
                <span>VPC Air-Gap Ready</span>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary font-semibold">
                {col.heading}
              </span>
              <ul className="space-y-2 text-xs">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-10 mt-12 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-text-tertiary">
          <span>&copy; {new Date().getFullYear()} Athleia.ai. All rights reserved. Industrial Knowledge Intelligence.</span>
          <div className="flex items-center gap-4">
            <Link href="#security" className="hover:text-text-primary transition-colors">Privacy &amp; Security</Link>
            <Link href="#security" className="hover:text-text-primary transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-text-primary transition-colors">Contact Engineering</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
