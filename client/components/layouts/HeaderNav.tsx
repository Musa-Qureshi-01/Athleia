"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Bot,
  Zap,
  Shield,
  Layers,
  Database,
  Users,
  Building2,
  FileText,
  Compass,
  Cpu,
  BarChart2,
  Lock,
  GitBranch,
  Network,
  Sparkles,
  BookOpen,
  HelpCircle,
  Briefcase,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { useAuthSession } from "@/lib/auth";
import {
  SonyLogo,
  DatabricksLogo,
  CanvaLogo,
  DuolingoLogo,
  RedditLogo,
  PinterestLogo,
  BookingLogo,
  ZillowLogo
} from "@/components/visuals/CustomerLogos";

export function Navbar() {
  const { isAuthenticated, user, signOut } = useAuthSession();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchVal.trim();
    if (!q) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("axios_token") : null;
    if (token) {
      window.location.href = `/workspace/search?q=${encodeURIComponent(q)}`;
    } else {
      window.location.href = `/login?redirect=${encodeURIComponent(`/workspace/search?q=${q}`)}&q=${encodeURIComponent(q)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 transition-all font-sans select-none">
      <div className="max-w-[1120px] mx-auto border-x border-neutral-200 px-6 lg:px-10 h-[74px] flex items-center justify-between">

        {/* Left Side: Brand Logo + Desktop Nav Links */}
        <div className="flex items-center gap-8 xl:gap-10 h-full">

          {/* Pure Brand Wordmark matching Glean Style (No icon, 10-20% larger text) */}
          <Link href="/" className="flex items-center group select-none">
            <span className="text-[31px] font-bold tracking-[-0.04em] text-[#1F45EC] font-sans lowercase leading-none hover:opacity-90 transition-opacity">
              axios
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8 font-sans h-full">

            {/* 1. Product Mega-Menu (Exact Match to Screenshot 8b4085e4) */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveMenu("product")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className={`flex items-center gap-1.5 py-2 text-[14px] font-medium transition-colors cursor-pointer ${activeMenu === "product" ? "text-black font-semibold" : "text-[#111827] hover:text-[#1F45EC]"
                  }`}
              >
                <span>Product</span>
                <ChevronDown size={11} className={`transition-transform duration-200 opacity-60 ${activeMenu === "product" ? "rotate-180" : ""}`} />
              </button>

              {/* Zero-gap bridge wrapper */}
              {activeMenu === "product" && (
                <div className="absolute top-[calc(100%-4px)] left-0 pt-2 z-50">
                  <div className="w-[960px] bg-white rounded-lg border border-neutral-200/90 shadow-[0_25px_60px_rgba(0,0,0,0.12)] p-6 overflow-hidden font-sans">
                    <div className="grid grid-cols-12 gap-8 items-stretch">

                      {/* Left Column: Platform Overview Card + Foundation Tree (4 cols) */}
                      <div className="col-span-4 border-r border-neutral-100 pr-6 flex flex-col justify-between">
                        <div>
                          {/* Banner Card with 3D Fluid Ribbon Background */}
                          <Link
                            href="/products/workforce-copilot"
                            className="block rounded-md overflow-hidden border border-neutral-200/80 mb-6 bg-gradient-to-r from-[#1746ED]/15 via-[#8637EB]/15 to-[#EA5E8F]/15 hover:shadow-md transition-all group/card relative"
                          >
                            <div className="h-24 w-full relative overflow-hidden flex items-end p-3.5 bg-gradient-to-tr from-[#1746ED] via-[#8637EB] to-[#EA5E8F]">
                              <img
                                src="/hero-fluid-ribbon.png"
                                alt="Platform Ribbon"
                                className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover/card:scale-105 transition-transform duration-500"
                              />
                              <div className="relative z-10 text-white">
                                <h4 className="text-base font-bold tracking-tight leading-snug">
                                  Platform overview
                                </h4>
                                <p className="text-[11px] text-white/80">
                                  See how Axios works.
                                </p>
                              </div>
                            </div>
                          </Link>

                          {/* Built for enterprise AI tree */}
                          <div className="space-y-4">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
                              BUILT FOR ENTERPRISE AI.
                            </span>

                            <div className="space-y-3.5 text-xs">
                              {/* Enterprise Context */}
                              <div>
                                <Link href="/enterprise-context" className="group/link flex items-center justify-between font-semibold text-neutral-900 hover:text-[#1F45EC] transition-colors">
                                  <div className="flex items-center gap-1.5">
                                    <Sparkles size={13} className="text-neutral-400 group-hover/link:text-[#1F45EC]" />
                                    <span>Axios Enterprise Context</span>
                                  </div>
                                  <ArrowRight size={11} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                </Link>
                                <span className="text-[11px] text-neutral-400 block pl-5 mt-0.5">Ground AI in company context</span>
                                <Link href="/enterprise-context" className="pl-5 text-neutral-500 hover:text-black block text-[11px] mt-1 transition-colors">
                                  └── Connectors &amp; actions
                                </Link>
                              </div>

                              {/* APIs */}
                              <div>
                                <Link href="/api-docs" className="font-semibold text-neutral-900 hover:text-[#1F45EC] flex items-center gap-1.5 transition-colors">
                                  <Zap size={13} className="text-neutral-400" />
                                  <span>APIs</span>
                                </Link>
                                <Link href="/api-docs" className="pl-5 text-neutral-500 hover:text-black block text-[11px] mt-0.5 transition-colors">
                                  └── API lookbook
                                </Link>
                              </div>

                              {/* Protect */}
                              <div>
                                <Link href="/products/compliance-intelligence" className="font-semibold text-neutral-900 hover:text-[#1F45EC] flex items-center gap-1.5 transition-colors">
                                  <Shield size={13} className="text-neutral-400" />
                                  <span>Axios Protect</span>
                                </Link>
                              </div>

                              {/* Intelligence */}
                              <div>
                                <Link href="/products/workforce-copilot" className="font-semibold text-neutral-900 hover:text-[#1F45EC] flex items-center gap-1.5 transition-colors">
                                  <Cpu size={13} className="text-neutral-400" />
                                  <span>Axios Intelligence</span>
                                </Link>
                                <div className="pl-5 space-y-0.5 text-neutral-500 text-[11px] mt-1">
                                  <Link href="/products/workforce-copilot" className="block hover:text-black transition-colors">├── Auto routing</Link>
                                  <Link href="/products/workforce-copilot" className="block hover:text-black transition-colors">├── Model hub</Link>
                                  <Link href="/products/compliance-intelligence" className="block hover:text-black transition-colors">├── Usage controls</Link>
                                  <Link href="/api-docs" className="block hover:text-black transition-colors">└── AI gateway</Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle Column: Workforce Copilot (4 cols) */}
                      <div className="col-span-4 flex flex-col justify-between">
                        <div>
                          {/* Assistant Header */}
                          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-neutral-100">
                            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Bot size={16} />
                            </div>
                            <div>
                              <h4 className="text-[14px] font-bold text-neutral-900 leading-tight">
                                Workforce Copilot
                              </h4>
                              <p className="text-[11px] text-neutral-500">
                                Plant &amp; Operations AI Assistant
                              </p>
                            </div>
                          </div>

                          {/* Assistant Links with Slide Animation */}
                          <div className="space-y-1 text-[13px]">
                            <Link href="/products/workforce-copilot" className="group/item flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-lg hover:bg-neutral-50 transition-all duration-150">
                              <Search size={14} className="text-neutral-400 group-hover/item:text-[#1F45EC]" />
                              <span className="text-neutral-700 group-hover/item:text-black group-hover/item:translate-x-1 transition-all">Natural language SOP search</span>
                            </Link>
                            <Link href="/products/ingestion-pipeline" className="group/item flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-lg hover:bg-neutral-50 transition-all duration-150">
                              <FileText size={14} className="text-neutral-400 group-hover/item:text-[#1F45EC]" />
                              <span className="text-neutral-700 group-hover/item:text-black group-hover/item:translate-x-1 transition-all">P&amp;ID instrument tag locator</span>
                            </Link>
                            <Link href="/products/workforce-copilot" className="group/item flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-lg hover:bg-neutral-50 transition-all duration-150">
                              <Zap size={14} className="text-neutral-400 group-hover/item:text-[#1F45EC]" />
                              <span className="text-neutral-700 group-hover/item:text-black group-hover/item:translate-x-1 transition-all">Emergency isolation runbooks</span>
                            </Link>
                            <Link href="/products/maintenance-intelligence" className="group/item flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-lg hover:bg-neutral-50 transition-all duration-150">
                              <BarChart2 size={14} className="text-neutral-400 group-hover/item:text-[#1F45EC]" />
                              <span className="text-neutral-700 group-hover/item:text-black group-hover/item:translate-x-1 transition-all">Vibration telemetry alerts</span>
                            </Link>
                            <Link href="/products/workforce-copilot" className="group/item flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-lg hover:bg-neutral-50 transition-all duration-150">
                              <Compass size={14} className="text-neutral-400 group-hover/item:text-[#1F45EC]" />
                              <span className="text-neutral-700 group-hover/item:text-black group-hover/item:translate-x-1 transition-all">Step-level citation provenance</span>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Safety & Compliance Core (4 cols) */}
                      <div className="col-span-4 flex flex-col justify-between">
                        <div>
                          {/* Compliance Header */}
                          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-neutral-100">
                            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Shield size={16} />
                            </div>
                            <div>
                              <h4 className="text-[14px] font-bold text-neutral-900 leading-tight">
                                Compliance Core
                              </h4>
                              <p className="text-[11px] text-neutral-500">
                                Safety &amp; Regulatory Auditing
                              </p>
                            </div>
                          </div>

                          {/* Compliance Links with Slide Animation */}
                          <div className="space-y-1 text-[13px]">
                            <Link href="/products/compliance-intelligence" className="group/item flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-lg hover:bg-neutral-50 transition-all duration-150">
                              <Layers size={14} className="text-neutral-400 group-hover/item:text-[#1F45EC]" />
                              <span className="text-neutral-700 group-hover/item:text-black group-hover/item:translate-x-1 transition-all">Regulatory &amp; OSHA scanner</span>
                            </Link>
                            <Link href="/products/compliance-intelligence" className="group/item flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-lg hover:bg-neutral-50 transition-all duration-150">
                              <GitBranch size={14} className="text-neutral-400 group-hover/item:text-[#1F45EC]" />
                              <span className="text-neutral-700 group-hover/item:text-black group-hover/item:translate-x-1 transition-all">ASME &amp; API 570 piping checks</span>
                            </Link>
                            <Link href="/products/compliance-intelligence" className="group/item flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-lg hover:bg-neutral-50 transition-all duration-150">
                              <Lock size={14} className="text-neutral-400 group-hover/item:text-[#1F45EC]" />
                              <span className="text-neutral-700 group-hover/item:text-black group-hover/item:translate-x-1 transition-all">Air-gapped on-premise VPC</span>
                            </Link>
                            <Link href="/products/compliance-intelligence" className="group/item flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-lg hover:bg-neutral-50 transition-all duration-150">
                              <FileText size={14} className="text-neutral-400 group-hover/item:text-[#1F45EC]" />
                              <span className="text-neutral-700 group-hover/item:text-black group-hover/item:translate-x-1 transition-all">Tamper-proof audit trails</span>
                            </Link>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Strip across Columns 2 & 3: Warm Cream Bar with Axios Product */}
                    <div className="mt-6 pt-3.5 border-t border-neutral-100 flex items-center gap-3 bg-[#FAF8F5] -mx-6 -mb-6 p-4 rounded-b-lg">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-200 text-neutral-700">
                        Active Release
                      </span>
                      <span className="text-xs font-bold text-neutral-900">
                        Axios Telemetry Engine
                      </span>
                      <span className="text-xs text-neutral-500">
                        — Predictive vibration anomaly detection and real-time MTBF equipment ledger.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Customers Mega-Menu */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveMenu("customers")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className={`flex items-center gap-1.5 py-2 text-[14px] font-medium transition-colors cursor-pointer ${activeMenu === "customers" ? "text-black font-semibold" : "text-[#111827] hover:text-[#1F45EC]"
                  }`}
              >
                <span>Customers</span>
                <ChevronDown size={11} className={`transition-transform duration-200 opacity-60 ${activeMenu === "customers" ? "rotate-180" : ""}`} />
              </button>

              {activeMenu === "customers" && (
                <div className="absolute top-[calc(100%-4px)] -left-20 pt-2 z-50">
                  <div className="w-[780px] bg-white rounded-lg border border-neutral-200/90 shadow-[0_25px_60px_rgba(0,0,0,0.12)] p-6 font-sans">
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-7 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold mb-3">
                            TRUSTED BY INDUSTRY LEADERS
                          </span>

                          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-md bg-neutral-50/80 border border-neutral-200/70 mb-5">
                            <div className="flex items-center justify-center p-2.5 bg-white rounded-md border border-neutral-200/60 shadow-2xs">
                              <SonyLogo className="h-3.5 w-auto text-neutral-800" />
                            </div>
                            <div className="flex items-center justify-center p-2.5 bg-white rounded-md border border-neutral-200/60 shadow-2xs">
                              <DatabricksLogo className="h-4.5 w-auto text-neutral-900" />
                            </div>
                            <div className="flex items-center justify-center p-2.5 bg-white rounded-md border border-neutral-200/60 shadow-2xs">
                              <CanvaLogo className="h-5 w-auto text-neutral-800" />
                            </div>
                            <div className="flex items-center justify-center p-2.5 bg-white rounded-md border border-neutral-200/60 shadow-2xs">
                              <DuolingoLogo className="h-4.5 w-auto text-neutral-800" />
                            </div>
                            <div className="flex items-center justify-center p-2.5 bg-white rounded-md border border-neutral-200/60 shadow-2xs">
                              <RedditLogo className="h-4.5 w-auto text-neutral-900" />
                            </div>
                            <div className="flex items-center justify-center p-2.5 bg-white rounded-md border border-neutral-200/60 shadow-2xs">
                              <PinterestLogo className="h-4.5 w-auto text-neutral-800" />
                            </div>
                          </div>

                          <div className="space-y-2 text-xs">
                            <Link href="/#stories" className="group/link flex items-start gap-3 p-2 rounded-md hover:bg-neutral-50 transition-all">
                              <div className="w-8 h-8 rounded-md bg-blue-50 text-[#1F45EC] flex items-center justify-center shrink-0 mt-0.5">
                                <Users size={16} />
                              </div>
                              <div>
                                <h4 className="font-bold text-neutral-900 group-hover/link:text-[#1F45EC] group-hover/link:translate-x-1 transition-all flex items-center gap-1">
                                  Customer Stories &amp; Case Studies <ArrowRight size={11} />
                                </h4>
                                <p className="text-neutral-500 text-[11px] leading-relaxed">
                                  Explore how enterprise engineering and GTM teams scale productivity.
                                </p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-5 p-5 rounded-md border border-neutral-200 bg-[#FAFBFD] flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1F45EC] bg-blue-100/60 px-2 py-0.5 rounded">
                            FEATURED OUTCOME
                          </span>
                          <h4 className="text-sm font-bold text-neutral-900 mt-3 leading-snug">
                            How Booking.com scales AI across 14,000 employees with Axios.
                          </h4>
                          <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                            Discover how real-time permission mirroring and contextual search eliminated repeat support tickets.
                          </p>
                        </div>
                        <Link href="/#stories" className="mt-4 text-xs font-semibold text-[#1F45EC] hover:text-[#1538D4] inline-flex items-center gap-1">
                          Read story &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Solutions Mega-Menu */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveMenu("solutions")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className={`flex items-center gap-1.5 py-2 text-[14px] font-medium transition-colors cursor-pointer ${activeMenu === "solutions" ? "text-black font-semibold" : "text-[#111827] hover:text-[#1F45EC]"
                  }`}
              >
                <span>Solutions</span>
                <ChevronDown size={11} className={`transition-transform duration-200 opacity-60 ${activeMenu === "solutions" ? "rotate-180" : ""}`} />
              </button>

              {activeMenu === "solutions" && (
                <div className="absolute top-[calc(100%-4px)] -left-32 pt-2 z-50">
                  <div className="w-[840px] bg-white rounded-lg border border-neutral-200/90 shadow-[0_25px_60px_rgba(0,0,0,0.12)] p-6 font-sans">
                    <div className="grid grid-cols-12 gap-8">
                      <div className="col-span-4 border-r border-neutral-100 pr-4">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold mb-3">
                          BY DEPARTMENT
                        </span>
                        <div className="space-y-1.5 text-xs">
                          {["Engineering", "Plant Operations", "Customer Support", "Sales & Solutions", "IT & Security", "People & HR"].map((dept, i) => (
                            <Link key={i} href="/#solutions" className="group/dept flex items-center justify-between py-1 px-2 -mx-2 rounded hover:bg-neutral-50 text-neutral-700 hover:text-black transition-all">
                              <span className="group-hover/dept:translate-x-1 transition-transform">{dept}</span>
                              <ArrowRight size={11} className="opacity-0 group-hover/dept:opacity-100 transition-opacity" />
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-4 border-r border-neutral-100 pr-4">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold mb-3">
                          BY INDUSTRY
                        </span>
                        <div className="space-y-1.5 text-xs">
                          {["Manufacturing & EPC", "Financial Services", "Healthcare & Pharma", "High-Tech & SaaS", "Energy & Utilities", "Consulting & Advisory"].map((ind, i) => (
                            <Link key={i} href="/#solutions" className="group/ind flex items-center justify-between py-1 px-2 -mx-2 rounded hover:bg-neutral-50 text-neutral-700 hover:text-black transition-all">
                              <span className="group-hover/ind:translate-x-1 transition-transform">{ind}</span>
                              <ArrowRight size={11} className="opacity-0 group-hover/ind:opacity-100 transition-opacity" />
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-4 p-5 rounded-md border border-neutral-200 bg-[#FAFBFD] flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1F45EC] bg-blue-100/60 px-2 py-0.5 rounded">
                            PLAYBOOK
                          </span>
                          <h4 className="text-sm font-bold text-neutral-900 mt-3 leading-snug">
                            The Industrial Operations AI Playbook
                          </h4>
                          <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                            How Fortune 500 manufacturers reduce downtime by 46% using grounded telemetry reasoning.
                          </p>
                        </div>
                        <Link href="/resources" className="mt-4 text-xs font-semibold text-[#1F45EC] hover:text-[#1538D4] inline-flex items-center gap-1">
                          Download playbook &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Resources Mega-Menu */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveMenu("resources")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className={`flex items-center gap-1.5 py-2 text-[14px] font-medium transition-colors cursor-pointer ${activeMenu === "resources" ? "text-black font-semibold" : "text-[#111827] hover:text-[#1F45EC]"
                  }`}
              >
                <span>Resources</span>
                <ChevronDown size={11} className={`transition-transform duration-200 opacity-60 ${activeMenu === "resources" ? "rotate-180" : ""}`} />
              </button>

              {activeMenu === "resources" && (
                <div className="absolute top-[calc(100%-4px)] -left-48 pt-2 z-50">
                  <div className="w-[820px] bg-white rounded-lg border border-neutral-200/90 shadow-[0_25px_60px_rgba(0,0,0,0.12)] p-6 font-sans">
                    <div className="grid grid-cols-12 gap-8">
                      <div className="col-span-4 border-r border-neutral-100 pr-4">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold mb-3">
                          LEARN &amp; EXPLORE
                        </span>
                        <div className="space-y-1.5 text-xs">
                          {["Blog & Architecture Posts", "Research Reports", "Events & Webinars", "Customer Spotlights", "Axiosverse Community"].map((res, i) => (
                            <Link key={i} href="/resources" className="group/res flex items-center justify-between py-1 px-2 -mx-2 rounded hover:bg-neutral-50 text-neutral-700 hover:text-black transition-all">
                              <span className="group-hover/res:translate-x-1 transition-transform">{res}</span>
                              <ArrowRight size={11} className="opacity-0 group-hover/res:opacity-100 transition-opacity" />
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-4 border-r border-neutral-100 pr-4">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold mb-3">
                          DEVELOPERS &amp; TRUST
                        </span>
                        <div className="space-y-1.5 text-xs">
                          {["API Documentation", "Security & Compliance Specs", "SOC-2 Type II Portal", "System Status Dashboard"].map((dev, i) => (
                            <Link key={i} href="/api-docs" className="group/dev flex items-center justify-between py-1 px-2 -mx-2 rounded hover:bg-neutral-50 text-neutral-700 hover:text-black transition-all">
                              <span className="group-hover/dev:translate-x-1 transition-transform">{dev}</span>
                              <ArrowRight size={11} className="opacity-0 group-hover/dev:opacity-100 transition-opacity" />
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-4 p-5 rounded-md border border-neutral-200 bg-[#FAFBFD] flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                            2026 BENCHMARK
                          </span>
                          <h4 className="text-sm font-bold text-neutral-900 mt-3 leading-snug">
                            The State of Enterprise AI Search
                          </h4>
                          <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                            Empirical analysis of 2,500 enterprise deployments across accuracy, ACL security, and token efficiency.
                          </p>
                        </div>
                        <Link href="/resources" className="mt-4 text-xs font-semibold text-[#1F45EC] hover:text-[#1538D4] inline-flex items-center gap-1">
                          Read report &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Company Dropdown matching Glean Screenshot */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveMenu("company")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className={`flex items-center gap-1.5 py-2 text-[14px] font-medium transition-colors cursor-pointer ${activeMenu === "company" ? "text-black font-semibold" : "text-[#111827] hover:text-[#1F45EC]"
                  }`}
              >
                <span>Company</span>
                <ChevronDown size={11} className={`transition-transform duration-200 opacity-60 ${activeMenu === "company" ? "rotate-180" : ""}`} />
              </button>

              {activeMenu === "company" && (
                <div className="absolute top-[calc(100%-4px)] -left-6 pt-2 z-50">
                  <div className="w-56 bg-white rounded-lg border border-neutral-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-2 font-sans flex flex-col gap-0.5">
                    {[
                      { name: "About us", href: "/about" },
                      { name: "Axios on Axios", href: "/axios-on-axios" },
                      { name: "Story", href: "/story" },
                      { name: "Culture", href: "/culture" },
                      { name: "Careers", href: "/careers" },
                    ].map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        className="group flex items-center justify-between px-3.5 py-2.5 rounded-md text-[13.5px] font-medium text-neutral-700 hover:text-black hover:bg-neutral-50 transition-all"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-[#1F45EC] transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </nav>
        </div>

        {/* Right Side: Search Bar + Sign In + Get a Demo */}
        <div className="flex items-center gap-4 sm:gap-6 font-sans">

          {/* Search Trigger Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center gap-2 h-9 px-3 rounded-md border border-neutral-200 bg-neutral-50/70 hover:bg-neutral-100/80 transition-colors w-40 lg:w-48 text-xs text-neutral-500"
          >
            <Search size={14} className="text-neutral-400 shrink-0" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search"
              className="bg-transparent border-none outline-none w-full text-neutral-800 placeholder:text-neutral-400 text-xs"
            />
          </form>

          {/* Auth State Aware Navigation Controls */}
          {isAuthenticated ? (
            <>
              {/* Dashboard Link for logged in user */}
              <Link
                href="/workspace"
                className="hidden sm:inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#1F45EC] hover:text-[#1538D4] transition-colors"
              >
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </Link>

              {/* Primary Workspace CTA Button */}
              <Link
                href="/workspace"
                className="h-9 px-3.5 sm:px-4.5 rounded-lg text-[13px] sm:text-[13.5px] font-semibold bg-[#1F45EC] hover:bg-[#1538D4] text-white transition-all duration-150 flex items-center justify-center shadow-xs cursor-pointer whitespace-nowrap gap-1.5"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={13} />
              </Link>
            </>
          ) : (
            <>
              {/* Sign In Link (hidden on small mobile to save space) */}
              <Link
                href="/login"
                className="hidden sm:inline-block text-[14px] font-medium text-neutral-700 hover:text-black transition-colors"
              >
                Sign in
              </Link>

              {/* Boxy CTA Button with healthy roundness */}
              <Link
                href="/get-a-demo"
                className="h-9 px-3.5 sm:px-4.5 rounded-lg text-[13px] sm:text-[13.5px] font-semibold bg-black hover:bg-neutral-800 text-white transition-all duration-150 flex items-center justify-center shadow-xs cursor-pointer whitespace-nowrap"
              >
                Get a demo
              </Link>
            </>
          )}

          {/* Mobile Hamburger Toggle (Visible on < lg) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-6 py-6 font-sans space-y-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          
          <div className="space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
              PRODUCTS
            </span>
            <div className="space-y-2.5 text-sm">
              <Link
                href="/products/workforce-copilot"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-medium text-neutral-800 hover:text-[#1F45EC] transition-colors"
              >
                Workforce Copilot
              </Link>
              <Link
                href="/products/compliance-intelligence"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-medium text-neutral-800 hover:text-[#1F45EC] transition-colors"
              >
                Compliance Core
              </Link>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
              COMPANY
            </span>
            <div className="space-y-2.5 text-sm">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-neutral-700 hover:text-[#1F45EC] transition-colors"
              >
                About us
              </Link>
              <Link
                href="/axios-on-axios"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-neutral-700 hover:text-[#1F45EC] transition-colors"
              >
                Axios on Axios
              </Link>
              <Link
                href="/story"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-neutral-700 hover:text-[#1F45EC] transition-colors"
              >
                Story
              </Link>
              <Link
                href="/culture"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-neutral-700 hover:text-[#1F45EC] transition-colors"
              >
                Culture
              </Link>
              <Link
                href="/careers"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-neutral-700 hover:text-[#1F45EC] font-semibold transition-colors"
              >
                Careers
              </Link>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="pt-4 border-t border-neutral-100 flex flex-col gap-3">
              <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-neutral-900">{user?.fullName || "Axios Member"}</span>
                  <span className="text-[11px] text-neutral-500">{user?.organization || "Axios Enterprise"}</span>
                </div>
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="text-[11px] font-medium text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <LogOut size={12} />
                  <span>Sign out</span>
                </button>
              </div>
              <Link
                href="/workspace"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-10 rounded-lg bg-[#1F45EC] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#1538D4] transition-colors shadow-xs"
              >
                <LayoutDashboard size={15} />
                <span>Go to Dashboard</span>
              </Link>
            </div>
          ) : (
            <div className="pt-4 border-t border-neutral-100 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-10 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-800 flex items-center justify-center hover:bg-neutral-50 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/get-a-demo"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-10 rounded-lg bg-black text-white text-sm font-semibold flex items-center justify-center hover:bg-neutral-800 transition-colors"
              >
                Get a demo
              </Link>
            </div>
          )}

        </div>
      )}
    </header>
  );
}
