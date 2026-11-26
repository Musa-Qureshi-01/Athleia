"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  ChevronDown,
  Sparkles,
  Check
} from "lucide-react";

export function Footer() {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(
      "Summarize the enterprise architecture, security, and knowledge graph capabilities of Axios AI."
    );
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <footer className="bg-white border-t border-neutral-200 text-neutral-900 font-sans">
      <div className="max-w-[1120px] mx-auto border-x border-neutral-200">
        
        {/* Boxy 5-Column Grid with Clear Line Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-200 border-b border-neutral-200">
          
          {/* Column 1: Brand, Ask AI, Address, Socials (lg:col-span-3) */}
          <div className="lg:col-span-3 p-8 sm:p-10 lg:p-12 space-y-8 bg-white flex flex-col justify-between">
            <div className="space-y-6">
              {/* Brand Wordmark matching Header */}
              <Link href="/" className="inline-flex items-center group select-none">
                <span className="text-[32px] sm:text-[34px] font-bold tracking-[-0.04em] text-[#1F45EC] lowercase leading-none font-sans hover:opacity-90 transition-opacity">
                  axios
                </span>
              </Link>

              {/* Ask AI for a summary about Axios */}
              <div className="space-y-3 pt-2">
                <span className="text-[14px] sm:text-[15px] text-neutral-600 font-medium block">
                  Ask AI for a summary about Axios
                </span>
                
                {/* 5 AI Model Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleCopyPrompt}
                    title="Ask ChatGPT about Axios"
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Sparkles size={15} />
                  </button>
                  <button
                    onClick={handleCopyPrompt}
                    title="Ask Claude about Axios"
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer font-serif font-bold text-[13px]"
                  >
                    C
                  </button>
                  <button
                    onClick={handleCopyPrompt}
                    title="Ask Gemini about Axios"
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer text-[13px] font-bold"
                  >
                    ✦
                  </button>
                  <button
                    onClick={handleCopyPrompt}
                    title="Ask Meta Llama about Axios"
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer text-[13px] font-bold"
                  >
                    ∞
                  </button>
                  <button
                    onClick={handleCopyPrompt}
                    title="Ask Mistral about Axios"
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer text-[13px] font-bold"
                  >
                    M
                  </button>
                </div>

                {copiedPrompt && (
                  <span className="text-[12px] font-mono text-emerald-600 flex items-center gap-1">
                    <Check size={13} /> Prompt copied to clipboard!
                  </span>
                )}
              </div>

              {/* Office Location */}
              <div className="text-[14px] text-neutral-600 leading-relaxed font-sans pt-1">
                <p className="font-semibold text-neutral-800">Axios Enterprise AI</p>
                <p>Operating from India</p>
              </div>

              {/* Social Channels (X, LinkedIn, Instagram, YouTube) */}
              <div className="flex items-center gap-4 text-neutral-700 pt-2">
                <a href="https://x.com" target="_blank" rel="noreferrer" title="X (Twitter)" className="hover:text-black transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="LinkedIn" className="hover:text-black transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.5 1.5 0 0 0 0-3 1.5 1.5 0 0 0 0 3m1.37 9.74v-8.37H5.1v8.37z" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram" className="hover:text-black transition-colors">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" title="YouTube" className="hover:text-black transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Language Selector Pill */}
            <div className="pt-6">
              <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-neutral-300 bg-white text-[13px] font-medium text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer">
                <Globe size={14} className="text-neutral-500" />
                <span>English</span>
                <ChevronDown size={14} className="text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Column 2: Product (lg:col-span-3) */}
          <div className="lg:col-span-3 p-8 sm:p-10 lg:p-12 space-y-6 bg-white">
            <h3 className="text-[18px] sm:text-[19px] font-bold text-neutral-900 tracking-tight font-sans">
              Product
            </h3>

            {/* Platform Subcategory */}
            <div>
              <span className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider block mb-3 font-mono text-[11px]">
                Platform
              </span>
              <ul className="space-y-2.5 text-[15px] text-neutral-600 font-sans">
                <li><Link href="/products/ingestion-pipeline" className="hover:text-black transition-colors block">Axios Enterprise Context</Link></li>
                <li><Link href="/products/ingestion-pipeline" className="hover:text-black transition-colors block">Connectors &amp; Actions</Link></li>
                <li><Link href="/api-docs" className="hover:text-black transition-colors block">APIs</Link></li>
                <li><Link href="/api-docs" className="hover:text-black transition-colors block">API Lookbook</Link></li>
                <li><Link href="/products/compliance-intelligence" className="hover:text-black transition-colors block">Axios Protect</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Axios Intelligence</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Auto routing</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Model hub</Link></li>
                <li><Link href="/products/compliance-intelligence" className="hover:text-black transition-colors block">Usage controls</Link></li>
                <li><Link href="/api-docs" className="hover:text-black transition-colors block">AI Gateway</Link></li>
              </ul>
            </div>

            {/* Assistant Subcategory */}
            <div className="pt-2">
              <span className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider block mb-3 font-mono text-[11px]">
                Assistant
              </span>
              <ul className="space-y-2.5 text-[15px] text-neutral-600 font-sans">
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Proactive AI</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Content Creation</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Multiplayer</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Work Execution</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Data Analysis &amp; Research</Link></li>
              </ul>
            </div>

            {/* Enterprise Search */}
            <div className="pt-2">
              <span className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider block mb-3 font-mono text-[11px]">
                Agents &amp; Search
              </span>
              <ul className="space-y-2.5 text-[15px] text-neutral-600 font-sans">
                <li><Link href="/workspace/search" className="hover:text-black transition-colors block">Enterprise Search</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Agent Builder</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Agent Orchestration</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Agent Governance</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Solutions (lg:col-span-2) */}
          <div className="lg:col-span-2 p-8 sm:p-10 lg:p-12 space-y-6 bg-white">
            <h3 className="text-[18px] sm:text-[19px] font-bold text-neutral-900 tracking-tight font-sans">
              Solutions
            </h3>

            <div>
              <span className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider block mb-3 font-mono text-[11px]">
                By Team
              </span>
              <ul className="space-y-2.5 text-[15px] text-neutral-600 font-sans">
                <li><Link href="/#industries" className="hover:text-black transition-colors block">All Teams</Link></li>
                <li><Link href="/#industries" className="hover:text-black transition-colors block">Engineering</Link></li>
                <li><Link href="/#industries" className="hover:text-black transition-colors block">Sales</Link></li>
                <li><Link href="/#industries" className="hover:text-black transition-colors block">Marketing</Link></li>
                <li><Link href="/#industries" className="hover:text-black transition-colors block">Support</Link></li>
                <li><Link href="/#industries" className="hover:text-black transition-colors block">People / HR</Link></li>
                <li><Link href="/#industries" className="hover:text-black transition-colors block">Retail</Link></li>
                <li><Link href="/#industries" className="hover:text-black transition-colors block">Financial Services</Link></li>
              </ul>
            </div>

            <div className="pt-2">
              <span className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider block mb-3 font-mono text-[11px]">
                Use Cases
              </span>
              <ul className="space-y-2.5 text-[15px] text-neutral-600 font-sans">
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Enterprise AI</Link></li>
                <li><Link href="/workspace/search" className="hover:text-black transition-colors block">Enterprise Search Software</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">AI Agent Orchestration</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Enterprise AI Software</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">AI Agent Builder</Link></li>
              </ul>
            </div>

            <div className="pt-2">
              <span className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider block mb-3 font-mono text-[11px]">
                Comparisons
              </span>
              <ul className="space-y-2.5 text-[15px] text-neutral-600 font-sans">
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Axios vs ChatGPT Enterprise</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Axios vs Microsoft 365 Copilot</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Axios vs Claude Enterprise</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 4: Resources (lg:col-span-2) */}
          <div className="lg:col-span-2 p-8 sm:p-10 lg:p-12 space-y-6 bg-white">
            <h3 className="text-[18px] sm:text-[19px] font-bold text-neutral-900 tracking-tight font-sans">
              Resources
            </h3>

            <div>
              <ul className="space-y-2.5 text-[15px] text-neutral-600 font-sans">
                <li><Link href="/resources" className="hover:text-black transition-colors block">Content Hub</Link></li>
                <li><Link href="/resources" className="hover:text-black transition-colors block">Product Videos</Link></li>
                <li><Link href="/resources" className="hover:text-black transition-colors block">Guides</Link></li>
                <li><Link href="/#customers" className="hover:text-black transition-colors block">Customer Stories</Link></li>
                <li><Link href="/resources" className="hover:text-black transition-colors block">Blog</Link></li>
                <li><Link href="/resources" className="hover:text-black transition-colors block">Events</Link></li>
                <li><Link href="/resources" className="hover:text-black transition-colors block">Webinars</Link></li>
                <li><Link href="/api-docs" className="hover:text-black transition-colors block">Developers</Link></li>
                <li><Link href="/contact" className="hover:text-black transition-colors block">Help Center</Link></li>
                <li><Link href="/products/workforce-copilot" className="hover:text-black transition-colors block">Download Axios</Link></li>
                <li><Link href="/resources" className="hover:text-black transition-colors block">Product Drops</Link></li>
                <li><Link href="/contact" className="hover:text-black transition-colors block">Axiosverse Community</Link></li>
              </ul>
            </div>

            <div className="pt-2">
              <span className="text-[14px] font-bold text-neutral-900 uppercase tracking-wider block mb-3 font-mono text-[11px]">
                Customers
              </span>
              <ul className="space-y-2.5 text-[15px] text-neutral-600 font-sans">
                <li><Link href="/#customers" className="hover:text-black transition-colors block">Booking.com</Link></li>
                <li><Link href="/#customers" className="hover:text-black transition-colors block">Zillow</Link></li>
                <li><Link href="/#customers" className="hover:text-black transition-colors block">TIME</Link></li>
                <li><Link href="/#customers" className="hover:text-black transition-colors block">Databricks</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 5: Company (lg:col-span-2) */}
          <div className="lg:col-span-2 p-8 sm:p-10 lg:p-12 space-y-6 bg-white">
            <h3 className="text-[18px] sm:text-[19px] font-bold text-neutral-900 tracking-tight font-sans">
              Company
            </h3>

            <ul className="space-y-2.5 text-[15px] text-neutral-600 font-sans">
              <li><Link href="/about" className="hover:text-black transition-colors block">About</Link></li>
              <li><Link href="/careers" className="hover:text-black transition-colors block">Careers</Link></li>
              <li><Link href="/resources" className="hover:text-black transition-colors block">Newsroom</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors block">Referrals</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors block">Partners</Link></li>
              <li><Link href="/security" className="hover:text-black transition-colors block">Trust Center</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors block">Contact Us</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal Policies */}
        <div className="px-8 sm:px-10 lg:px-12 py-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13.5px] sm:text-[14px] text-neutral-500 font-sans bg-white">
          <span>&copy; {new Date().getFullYear()} Axios Technologies, Inc. All rights reserved.</span>
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/privacy" className="hover:text-neutral-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-neutral-900 transition-colors">Terms of Service</Link>
            <Link href="/security" className="hover:text-neutral-900 transition-colors">Security &amp; Compliance</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
