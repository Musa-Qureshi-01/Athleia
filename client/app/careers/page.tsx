"use client";

import { useState } from "react";
import Link from "next/link";
import { TopAnnouncementBar } from "@/components/layouts/TopAnnouncementBar";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { ArrowRight, CheckCircle2, Upload } from "lucide-react";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { submitCareerApplication } from "@/lib/api";

const BENEFITS = [
  { title: "Comprehensive Health", desc: "100% employer-covered medical, dental, and vision for employees and dependents." },
  { title: "Meaningful Equity", desc: "Competitive base salary plus ownership equity in one of the fastest-growing enterprise AI companies." },
  { title: "Learning & Equipment", desc: "$2,500 annual continuous education stipend plus premier home office setup allowance." },
  { title: "Flexible & Global", desc: "Remote-first engineering culture, operating from India." },
];

const DEPARTMENTS = [
  "Sales & Enterprise Accounts",
  "Operations & Strategy",
  "Marketing & Brand",
  "Finance & Legal",
  "IT & Technology",
  "Platform & Systems Engineering",
  "Product Management & UX Design",
  "Customer Success & Solutions Architecture",
];

export default function CareersPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [field, setField] = useState(DEPARTMENTS[0]);
  const [portfolio, setPortfolio] = useState("");
  const [role, setRole] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Persist directly to backend database career_applications table
      await submitCareerApplication({
        name,
        email,
        phone,
        linkedin,
        department: field,
        portfolioOrGithub: portfolio,
        desiredRole: role,
        cvFileName: cvFileName || "CV Attached",
        messageToAxiosTeam: message,
      });

      // 2. Also dispatch to email notification endpoint
      await fetch("https://formspree.io/f/xbdnkgjr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          linkedin,
          department: field,
          portfolioOrGithub: portfolio,
          desiredRole: role,
          cvFileName: cvFileName || "CV Attached",
          messageToAxiosTeam: message,
          recipient: "support.axiosai@gmail.com",
          source: "Axios Careers Application",
        }),
      }).catch(() => {});

      setIsSuccess(true);
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-[#1F45EC]/15 selection:text-[#1F45EC] font-sans antialiased">
      <TopAnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section matching Glean's /careers layout */}
        <section className="pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-18 border-b border-neutral-200 bg-white">
          <div className="max-w-[1120px] mx-auto px-6 sm:px-10 lg:px-14">
            
            <div className="max-w-4xl space-y-5">
              <span className="text-[12px] sm:text-[13px] font-mono font-medium text-neutral-500 uppercase tracking-wider block">
                Careers at Axios
              </span>

              <h1 className="text-[38px] sm:text-[52px] lg:text-[62px] font-bold tracking-[-0.04em] leading-[1.06] text-neutral-900 font-sans">
                Do the work that defines your career.
              </h1>

              <p className="text-[17px] sm:text-[19px] text-neutral-600 leading-relaxed font-sans max-w-3xl pt-2">
                Join a world-class team building foundational enterprise AI. We are hiring across Sales, Operations, Marketing, Finance &amp; Legal, IT &amp; Technology, Platform, and Product.
              </p>
            </div>

            {/* Benefits Row */}
            <div className="mt-12 pt-8 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {BENEFITS.map((b, i) => (
                <div key={i} className="p-5 rounded-lg border border-neutral-200/90 bg-neutral-50/60 space-y-2">
                  <h3 className="font-bold text-[15px] text-neutral-900">{b.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Application Form Section */}
        <section className="py-16 sm:py-24 bg-[#FAFAFC] border-b border-neutral-200 font-sans">
          <div className="max-w-[1120px] mx-auto px-6 sm:px-10 lg:px-14">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Left Column: Department Directory */}
              <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-28">
                <span className="text-[12px] font-mono text-neutral-500 uppercase tracking-wider block">
                  Open Opportunities
                </span>

                <h2 className="text-[30px] sm:text-[40px] font-bold text-neutral-900 tracking-[-0.03em] leading-tight font-sans">
                  Apply across any department.
                </h2>

                <p className="text-[15px] sm:text-[16px] text-neutral-600 leading-relaxed font-sans">
                  We review every application directly across all teams. No automated keyword filters, no HR black boxes.
                </p>

                <div className="p-5 rounded-lg bg-white border border-neutral-200 space-y-2.5 text-xs text-neutral-600">
                  <div className="font-semibold text-neutral-900 font-mono text-[11px] uppercase tracking-wider">
                    Our Priority Departments
                  </div>
                  <div>• Sales &amp; Strategic Enterprise Accounts</div>
                  <div>• Operations, Strategy &amp; People</div>
                  <div>• Marketing, Brand &amp; Enterprise Growth</div>
                  <div>• Finance, Accounting &amp; Legal</div>
                  <div>• IT &amp; Enterprise Cloud Technology</div>
                  <div>• Platform Engineering &amp; AI Systems</div>
                  <div>• Product Management &amp; UX Design</div>
                  <div>• Customer Success &amp; Solutions Architecture</div>
                </div>
              </div>

              {/* Right Column: Application Form Card */}
              <div className="lg:col-span-7">
                <div className="rounded-md border border-neutral-300/90 bg-white p-7 sm:p-10 shadow-sm">
                  
                  {isSuccess ? (
                    <div className="py-12 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle2 size={26} />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900">Application Received!</h3>
                      <p className="text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
                        Thank you for applying to Axios. Our leadership team reviews submissions weekly and will reach out to <strong className="text-neutral-900">{email}</strong>.
                      </p>
                      <div className="pt-2">
                        <Link
                          href="/"
                          className="inline-flex items-center justify-center h-10 px-5 rounded-md bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition-colors"
                        >
                          Return to homepage
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-800 mb-1.5 font-mono">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ada Lovelace"
                            className="w-full h-11 px-3.5 rounded-md border border-neutral-200 text-sm focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-800 mb-1.5 font-mono">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ada@example.com"
                            className="w-full h-11 px-3.5 rounded-md border border-neutral-200 text-sm focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-800 mb-1.5 font-mono">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full h-11 px-3.5 rounded-md border border-neutral-200 text-sm focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-800 mb-1.5 font-mono">
                            LinkedIn Profile
                          </label>
                          <input
                            type="url"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full h-11 px-3.5 rounded-md border border-neutral-200 text-sm focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC]"
                          />
                        </div>
                      </div>

                      {/* Department Selection (8 Company-Wide Options) */}
                      <div>
                        <label className="block text-xs font-semibold text-neutral-800 mb-1.5 font-mono">
                          Department / Field *
                        </label>
                        <CustomSelect
                          value={field}
                          onChange={setField}
                          options={DEPARTMENTS.map((dept) => ({ value: dept, label: dept }))}
                          placeholder="Select department"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-800 mb-1.5 font-mono">
                            Portfolio / LinkedIn / Work Link
                          </label>
                          <input
                            type="url"
                            value={portfolio}
                            onChange={(e) => setPortfolio(e.target.value)}
                            placeholder="linkedin.com/in/... or github.com/..."
                            className="w-full h-11 px-3.5 rounded-md border border-neutral-200 text-sm focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-800 mb-1.5 font-mono">
                            Desired Role
                          </label>
                          <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g. Enterprise Account Executive, Product Lead, Systems Engineer"
                            className="w-full h-11 px-3.5 rounded-md border border-neutral-200 text-sm focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC]"
                          />
                        </div>
                      </div>

                      {/* Upload CV Container */}
                      <div>
                        <label className="block text-xs font-semibold text-neutral-800 mb-1.5 font-mono">
                          Upload CV / Resume (PDF, DOCX) *
                        </label>
                        <label className="border-2 border-dashed border-neutral-200 hover:border-neutral-400 rounded-md p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-50/50">
                          <Upload size={18} className="text-neutral-400 mb-2" />
                          <span className="text-xs font-medium text-neutral-700">
                            {cvFileName ? cvFileName : "Click to select file or drag here"}
                          </span>
                          <span className="text-[11px] text-neutral-400 mt-0.5 font-mono">PDF, DOCX up to 15MB</span>
                          <input
                            type="file"
                            accept=".pdf,.docx,.doc"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-xs font-semibold text-neutral-800 mb-1.5 font-mono">
                          Message to Axios&apos; Team
                        </label>
                        <textarea
                          rows={3}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tell us about a complex system you designed, a hard problem you solved, or why you want to build Axios..."
                          className="w-full p-3.5 rounded-md border border-neutral-200 text-sm focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC]"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-12 rounded-md bg-black hover:bg-neutral-800 text-white font-semibold text-sm transition-colors shadow-xs cursor-pointer flex items-center justify-center"
                        >
                          {isSubmitting ? "Submitting Application..." : "Submit Application"}
                        </button>
                      </div>

                      <p className="text-[11px] text-neutral-400 text-center font-mono">
                        Submissions sent directly to support.axiosai@gmail.com
                      </p>

                    </form>
                  )}

                </div>
              </div>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
