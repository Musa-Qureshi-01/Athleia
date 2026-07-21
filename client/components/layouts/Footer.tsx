"use client";

import Link from "next/link";
import Image from "next/image";
import { CORPORATE_INFO } from "@/lib/enterprise-data";
import { ArrowRight, ShieldCheck, Lock, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-secondary text-text-primary pt-16 pb-12 lg:pt-24 lg:pb-16">
      <div className="container-editorial">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Column 1: Brand & Contact Info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-[5px] overflow-hidden bg-accent/10 border border-accent/30 flex items-center justify-center p-0.5 group-hover:border-accent transition-colors">
                <Image src="/icon.png" alt="Athleia.ai" width={32} height={32} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-[0.1em] font-mono text-text-primary">
                  ATHLEIA.AI
                </span>
                <span className="text-[10px] font-mono text-text-tertiary">
                  ENTERPRISE PLATFORM
                </span>
              </div>
            </Link>

            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              Enterprise Industrial Knowledge Intelligence Platform. Transforming engineering manuals, P&amp;ID drawings, and operational telemetry into verified decision intelligence.
            </p>

            {/* Corporate Address & Contact Details */}
            <div className="space-y-3 pt-2 text-sm text-text-secondary border-t border-border-subtle/70">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-accent shrink-0 mt-0.5" />
                <span className="text-text-secondary text-xs leading-relaxed">
                  Bhopal, Madhya Pradesh 462001, India
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-accent shrink-0" />
                <a href="tel:+916263473208" className="text-xs font-mono text-text-primary hover:text-accent transition-colors">
                  +91 6263473208
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-accent shrink-0" />
                <a href="mailto:musaqureshi0000@gmail.com" className="text-xs font-mono text-text-primary hover:text-accent transition-colors">
                  musaqureshi0000@gmail.com
                </a>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-1">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-sm text-xs font-semibold bg-text-primary text-bg-primary hover:opacity-90 transition-opacity shadow-xs"
              >
                <span>Book a Demo</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Column 2: Products (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <span className="text-sm font-semibold text-text-primary tracking-wide">
              Products
            </span>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products/workforce-copilot" className="text-text-secondary hover:text-text-primary transition-colors hover:translate-x-0.5 inline-block">
                  Workforce Copilot
                </Link>
              </li>
              <li>
                <Link href="/products/compliance-intelligence" className="text-text-secondary hover:text-text-primary transition-colors hover:translate-x-0.5 inline-block">
                  Compliance Intelligence
                </Link>
              </li>
              <li>
                <Link href="/products/maintenance-intelligence" className="text-text-secondary hover:text-text-primary transition-colors hover:translate-x-0.5 inline-block">
                  Maintenance Telemetry
                </Link>
              </li>
              <li>
                <Link href="/products/ingestion-pipeline" className="text-text-secondary hover:text-text-primary transition-colors hover:translate-x-0.5 inline-block">
                  CAD &amp; PDF Ingestion
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-text-secondary hover:text-text-primary transition-colors hover:translate-x-0.5 inline-block">
                  Hybrid Search Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Solutions (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <span className="text-sm font-semibold text-text-primary tracking-wide">
              Solutions
            </span>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/#solutions" className="text-text-secondary hover:text-text-primary transition-colors hover:translate-x-0.5 inline-block">
                  Oil &amp; Gas Refineries
                </Link>
              </li>
              <li>
                <Link href="/#solutions" className="text-text-secondary hover:text-text-primary transition-colors hover:translate-x-0.5 inline-block">
                  Power &amp; Utilities
                </Link>
              </li>
              <li>
                <Link href="/#solutions" className="text-text-secondary hover:text-text-primary transition-colors hover:translate-x-0.5 inline-block">
                  Heavy Manufacturing
                </Link>
              </li>
              <li>
                <Link href="/#solutions" className="text-text-secondary hover:text-text-primary transition-colors hover:translate-x-0.5 inline-block">
                  Chemical Processing
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-text-secondary hover:text-text-primary transition-colors hover:translate-x-0.5 inline-block">
                  Air-Gapped Defense
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <span className="text-sm font-semibold text-text-primary tracking-wide">
              Company
            </span>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-text-primary transition-colors hover:translate-x-0.5 inline-block">
                  Contact Sales
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-text-secondary hover:text-text-primary transition-colors hover:translate-x-0.5 inline-block">
                  Enterprise Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-text-primary transition-colors hover:translate-x-0.5 inline-block">
                  Security Architecture
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-text-secondary hover:text-text-primary transition-colors hover:translate-x-0.5 inline-block">
                  Customer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Trust & Certifications (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <span className="text-sm font-semibold text-text-primary tracking-wide">
              Trust &amp; Security
            </span>
            <div className="space-y-2.5 text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-status-verified shrink-0" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-accent shrink-0" />
                <span>SOC 2 Type II Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-status-verified shrink-0" />
                <span>Air-Gapped VPC Ready</span>
              </div>
              <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-text-tertiary">
                <span>Response SLA: &lt;4 Hours</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-10 mt-16 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-tertiary">
          <span>&copy; {new Date().getFullYear()} Athleia AI Technologies Private Limited. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-text-primary transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-text-primary transition-colors">Security Overview</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
