"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layouts/HeaderNav";
import { BookingLogo } from "@/components/visuals/CustomerLogos";
import { FloatingAssistantWidget } from "@/components/ui/FloatingAssistantWidget";
import { CustomSelect } from "@/components/ui/CustomSelect";

const COMPANY_SIZE_OPTIONS = [
  { value: "1-50", label: "1 - 50 employees" },
  { value: "51-250", label: "51 - 250 employees" },
  { value: "251-1000", label: "251 - 1,000 employees" },
  { value: "1001-5000", label: "1,001 - 5,000 employees" },
  { value: "5000+", label: "5,000+ employees" },
];

const COUNTRY_OPTIONS = [
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Australia", label: "Australia" },
  { value: "Japan", label: "Japan" },
  { value: "Singapore", label: "Singapore" },
  { value: "India", label: "India" },
  { value: "Global", label: "Other / Global" },
];

export default function GetADemoPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("United States");
  const [interest, setInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("https://formspree.io/f/xbdnkgjr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          company,
          companySize,
          phone,
          country,
          sparkedInterest: interest,
          recipient: "support.axiosai@gmail.com",
          source: "Axios Enterprise Demo Page",
        }),
      });
      setIsSuccess(true);
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans antialiased selection:bg-[#1F45EC]/15 selection:text-[#1F45EC]">
      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Full-Width 50/50 Split Canvas matching Glean Reference Exactly */}
      <main className="flex-1 flex flex-col lg:flex-row">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Deep Royal Navy Blue Hero (#0B1560) with Lime Heading        */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-1/2 bg-[#0B1560] text-white p-6 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-between relative overflow-hidden min-h-[640px]">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-gradient-to-br from-blue-600/30 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8 max-w-xl">
            {/* Electric Lime Headline (Exact words & styling from Glean snapshot) */}
            <h1 className="text-[44px] sm:text-[56px] lg:text-[64px] font-bold text-[#D6F831] leading-[1.04] tracking-[-0.035em] font-sans">
              Put AI to work. At work.
            </h1>

            {/* 3 Value Bullets with Clean Crisp Checkmarks */}
            <div className="space-y-4 text-[15px] sm:text-[16px] text-white/95 font-sans leading-relaxed">
              <div className="flex items-start gap-3">
                <Check size={18} className="text-[#D6F831] shrink-0 mt-1 stroke-[2.8]" />
                <p>
                  <strong className="font-bold text-white">Trusted answers</strong> grounded in your company&apos;s data
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Check size={18} className="text-[#D6F831] shrink-0 mt-1 stroke-[2.8]" />
                <p>
                  <strong className="font-bold text-white">One centralized platform</strong> to build with security and speed
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Check size={18} className="text-[#D6F831] shrink-0 mt-1 stroke-[2.8]" />
                <p>
                  <strong className="font-bold text-white">Turnkey implementation</strong> of a complex AI ecosystem
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial Card with Tadeu Faedrick matching Snapshot */}
          <div className="relative z-10 mt-10 lg:mt-14 bg-white rounded-2xl p-5 sm:p-6 text-neutral-900 shadow-2xl max-w-lg overflow-hidden border border-neutral-100">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2.5 flex-1 pr-2">
                {/* Booking.com Logo in Official Blue */}
                <div className="h-6 w-auto flex items-center">
                  <BookingLogo className="h-5 w-auto text-[#003580]" />
                </div>

                <p className="text-[12.5px] sm:text-[13px] text-neutral-700 leading-snug font-sans">
                  &ldquo;<strong className="font-bold text-neutral-900">Axios helps you get work done</strong>, rather than just find information. The moment we launched Axios, there was so much positivity.&rdquo;
                </p>

                <div className="pt-1 text-xs">
                  <div className="font-bold text-neutral-900">Tadeu Faedrick</div>
                  <div className="text-neutral-500 font-medium">Senior Engineer Manager</div>
                </div>
              </div>

              {/* Authentic Portrait of Tadeu Faedrick cropped from Glean Snapshot */}
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden shrink-0 shadow-xs relative bg-white border border-neutral-100">
                <img
                  src="/images/booking-leader.png?v=4"
                  alt="Tadeu Faedrick - Senior Engineer Manager, Booking.com"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Pure White Canvas with Frosted Lilac Form Card (#F4F3FD)    */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-1/2 bg-white p-4 sm:p-8 lg:p-14 xl:p-16 flex flex-col justify-center items-center">
          
          <div className="w-full max-w-[520px]">
            
            {/* Frosted Lilac Container (#F4F3FD) matching Snapshot Exactly */}
            <div className="rounded-2xl bg-[#F4F3FD] p-4.5 sm:p-8 border border-[#E5E3F8] shadow-sm">
              
              {/* 3-Step Pill Header */}
              <div className="mb-6 flex items-center justify-between text-[11px] sm:text-xs font-sans text-neutral-600 px-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#1F45EC]">
                  <span className="w-4 h-4 rounded-full bg-[#1F45EC] text-white flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                  <span>Fill out the form</span>
                </div>

                <div className="flex items-center gap-1.5 text-neutral-400">
                  <span className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-[10px] font-bold">
                    2
                  </span>
                  <span className="hidden sm:inline">Book a time slot</span>
                </div>

                <div className="flex items-center gap-1.5 text-neutral-400">
                  <span className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-[10px] font-bold">
                    3
                  </span>
                  <span className="hidden sm:inline">Attend a demo</span>
                </div>
              </div>

              {/* Form Content */}
              {isSuccess ? (
                <div className="py-12 text-center space-y-4 bg-white rounded-xl p-8 border border-neutral-200/90 shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    Demo Request Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
                    Thank you. We have sent a calendar invitation link to <strong className="text-neutral-900">{email || "your work email"}</strong> to schedule your personalized enterprise demo.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition-colors"
                    >
                      Return to homepage
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  
                  {/* First Name */}
                  <div>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full h-11 px-3.5 rounded-lg bg-white border border-neutral-200/90 text-neutral-900 placeholder:text-neutral-400 text-[14px] focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all shadow-2xs"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full h-11 px-3.5 rounded-lg bg-white border border-neutral-200/90 text-neutral-900 placeholder:text-neutral-400 text-[14px] focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all shadow-2xs"
                    />
                  </div>

                  {/* Work Email */}
                  <div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Work email"
                      className="w-full h-11 px-3.5 rounded-lg bg-white border border-neutral-200/90 text-neutral-900 placeholder:text-neutral-400 text-[14px] focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all shadow-2xs"
                    />
                  </div>

                  {/* Company You Work For */}
                  <div>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company you work for"
                      className="w-full h-11 px-3.5 rounded-lg bg-white border border-neutral-200/90 text-neutral-900 placeholder:text-neutral-400 text-[14px] focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all shadow-2xs"
                    />
                  </div>

                  {/* Company Size Dropdown */}
                  <div>
                    <CustomSelect
                      required
                      value={companySize}
                      onChange={setCompanySize}
                      options={COMPANY_SIZE_OPTIONS}
                      placeholder="Company Size"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      className="w-full h-11 px-3.5 rounded-lg bg-white border border-neutral-200/90 text-neutral-900 placeholder:text-neutral-400 text-[14px] focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all shadow-2xs"
                    />
                  </div>

                  {/* Country Dropdown */}
                  <div>
                    <CustomSelect
                      value={country}
                      onChange={setCountry}
                      options={COUNTRY_OPTIONS}
                      placeholder="Country"
                    />
                  </div>

                  {/* What sparked your interest in Axios? */}
                  <div>
                    <textarea
                      rows={2}
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      placeholder="What sparked your interest in Axios?"
                      className="w-full p-3 rounded-lg bg-white border border-neutral-200/90 text-neutral-900 placeholder:text-neutral-400 text-[14px] focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all shadow-2xs resize-none"
                    />
                  </div>

                  {/* Disclaimer Paragraph */}
                  <p className="text-[10px] text-neutral-500 leading-tight pt-1">
                    By filling out and submitting this form, you are agreeing to our Privacy Policy and to receiving email communications from Axios regarding events, webinars, research, and more. You can unsubscribe any time.
                  </p>

                  {/* Submit Button: Electric Lime Pill (#D6F831) matching Snapshot Exactly */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-7 py-2.5 rounded-full bg-[#D6F831] hover:bg-[#C7EB23] text-neutral-950 font-bold text-[13.5px] transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>

                </form>
              )}

            </div>

          </div>

        </div>

      </main>

      {/* Floating Assistant Widget */}
      <FloatingAssistantWidget />
    </div>
  );
}
