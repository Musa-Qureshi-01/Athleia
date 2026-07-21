"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CORPORATE_INFO } from "@/lib/enterprise-data";
import { ArrowRight, CheckCircle2, ShieldCheck, Lock, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <footer className="border-t border-border-subtle bg-bg-secondary text-text-primary">
      {/* Top Enterprise Newsletter & Trust Section */}
      <div className="border-b border-border-subtle py-10">
        <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Trust Badges */}
          <div className="lg:col-span-7 flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-status-verified animate-pulse" />
              <span className="text-xs font-mono font-semibold text-text-primary">
                ISO 27001 &amp; SOC 2 Type II Certified
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-bg-primary border border-border-subtle text-text-tertiary">
                VPC Air-Gap Ready
              </span>
            </div>
            <p className="text-xs text-text-secondary max-w-xl leading-relaxed">
              Designed for safety-critical industrial enterprises. Zero fabrication, 100% citation provenance, and hard-coded role-based access control.
            </p>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary font-semibold">
              Subscribe to Industrial AI Briefing
            </span>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs font-mono text-status-verified">
                <CheckCircle2 size={14} />
                <span>Thank you! You are subscribed to our monthly executive briefing.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="executive@company.com"
                  required
                  className="flex-1 bg-bg-primary border border-border-subtle rounded-sm px-3.5 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
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

      {/* Main Corporate Footer Links & Locations */}
      <div className="container-editorial py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand & Corporate Address (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[4px] overflow-hidden bg-accent/10 border border-accent/30 flex items-center justify-center p-0.5">
                <Image src="/icon.png" alt="Athleia" width={28} height={28} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold tracking-wider font-mono text-text-primary">
                {CORPORATE_INFO.companyName}
              </span>
            </Link>
            <p className="text-xs text-text-secondary leading-relaxed">
              {CORPORATE_INFO.tagline}. Transforming engineering manuals, P&amp;ID drawings, and operational telemetry into actionable decision intelligence.
            </p>

            {/* Indian Corporate Offices */}
            <div className="space-y-2.5 pt-2 text-xs text-text-secondary border-t border-border-subtle">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-semibold text-text-primary">{CORPORATE_INFO.headquarters.title}</span>
                  <span className="text-[11px] text-text-tertiary">{CORPORATE_INFO.headquarters.address}, {CORPORATE_INFO.headquarters.city}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-semibold text-text-primary">{CORPORATE_INFO.techHub.title}</span>
                  <span className="text-[11px] text-text-tertiary">{CORPORATE_INFO.techHub.address}, {CORPORATE_INFO.techHub.city}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Phone size={13} className="text-accent shrink-0" />
                <span className="text-text-primary font-mono text-[11px]">{CORPORATE_INFO.phone}</span>
                <span className="text-text-tertiary text-[10px] ml-auto font-mono">{CORPORATE_INFO.tollFree}</span>
              </div>
            </div>
          </div>

          {/* Nav Column 1: Products (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary font-semibold">
              Products
            </span>
            <ul className="space-y-2 text-xs">
              <li><Link href="/demo" className="text-text-secondary hover:text-text-primary transition-colors">Workforce Copilot</Link></li>
              <li><Link href="/demo" className="text-text-secondary hover:text-text-primary transition-colors">Compliance Intelligence</Link></li>
              <li><Link href="/demo" className="text-text-secondary hover:text-text-primary transition-colors">Maintenance Telemetry</Link></li>
              <li><Link href="/demo" className="text-text-secondary hover:text-text-primary transition-colors">CAD &amp; PDF Ingestion</Link></li>
              <li><Link href="/pricing" className="text-text-secondary hover:text-text-primary transition-colors">Hybrid Search Engine</Link></li>
            </ul>
          </div>

          {/* Nav Column 2: Solutions (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary font-semibold">
              Solutions
            </span>
            <ul className="space-y-2 text-xs">
              <li><Link href="/#solutions" className="text-text-secondary hover:text-text-primary transition-colors">Oil &amp; Gas Refineries</Link></li>
              <li><Link href="/#solutions" className="text-text-secondary hover:text-text-primary transition-colors">Power &amp; Utilities</Link></li>
              <li><Link href="/#solutions" className="text-text-secondary hover:text-text-primary transition-colors">Heavy Manufacturing</Link></li>
              <li><Link href="/#solutions" className="text-text-secondary hover:text-text-primary transition-colors">Chemical Processing</Link></li>
              <li><Link href="/pricing" className="text-text-secondary hover:text-text-primary transition-colors">Air-Gapped Defense</Link></li>
            </ul>
          </div>

          {/* Nav Column 3: Company & Resources (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary font-semibold">
              Company
            </span>
            <ul className="space-y-2 text-xs">
              <li><Link href="/contact" className="text-text-secondary hover:text-text-primary transition-colors">Contact Sales</Link></li>
              <li><Link href="/pricing" className="text-text-secondary hover:text-text-primary transition-colors">Enterprise Pricing</Link></li>
              <li><Link href="/demo" className="text-text-secondary hover:text-text-primary transition-colors">Request Product Demo</Link></li>
              <li><Link href="/login" className="text-text-secondary hover:text-text-primary transition-colors">Customer Portal</Link></li>
            </ul>
          </div>

          {/* Nav Column 4: Contact & SLA (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-text-tertiary font-semibold">
              Support &amp; Security
            </span>
            <ul className="space-y-2 text-xs">
              <li><a href="mailto:enterprise@athleia.ai" className="text-text-secondary hover:text-text-primary transition-colors">enterprise@athleia.ai</a></li>
              <li><a href="mailto:security@athleia.ai" className="text-text-secondary hover:text-text-primary transition-colors">security@athleia.ai</a></li>
              <li><span className="text-text-tertiary">Response SLA: &lt;4 Hours</span></li>
              <li><span className="text-status-verified font-medium">100% Data Protection</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-10 mt-12 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-text-tertiary">
          <span>&copy; {new Date().getFullYear()} Athleia AI Technologies Pvt Ltd. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-text-primary transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-text-primary transition-colors">Security Architecture</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
