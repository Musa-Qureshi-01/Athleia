"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { loginUser, getWorkOSAuthorizeUrl } from "@/lib/api";

export default function OrganizationLoginPage() {
  const router = useRouter();

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginStep, setLoginStep] = useState<"email" | "password" | "code">("email");
  const [authMethod, setAuthMethod] = useState<"password" | "code">("password");
  const [code, setCode] = useState("");
  const [mockDispatchedCode, setMockDispatchedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detectedOrg, setDetectedOrg] = useState<string | null>(null);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setErrorMessage(null);

    // Detect enterprise domain
    const domain = email.split("@")[1]?.toLowerCase();
    if (domain) {
      if (domain.includes("booking")) setDetectedOrg("Booking.com Global Tenant");
      else if (domain.includes("zillow")) setDetectedOrg("Zillow Group Tenant");
      else if (domain.includes("ericsson")) setDetectedOrg("Ericsson Telecom Tenant");
      else if (domain.includes("time")) setDetectedOrg("TIME Editorial Tenant");
      else setDetectedOrg(null);
    }

    if (authMethod === "code") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
        setMockDispatchedCode(randomCode);
        setLoginStep("code");
      }, 500);
    } else {
      setLoginStep("password");
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if (!password) {
        setErrorMessage("Please enter your enterprise account password.");
        return;
      }
      const authRes = await loginUser(email, password);
      localStorage.setItem("axios_token", authRes.access_token);
      localStorage.setItem("axios_session_type", "organizational");
      localStorage.setItem("axios_user", JSON.stringify(authRes));
      router.push("/workspace");
    } catch (err: any) {
      setErrorMessage(
        err.message || "Invalid enterprise credentials. Please check your email and password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSO = async (provider: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const redirectUri = `${window.location.origin}/auth/callback`;
      const providerParam =
        provider.toLowerCase().includes("google")
          ? "GoogleOAuth"
          : provider.toLowerCase().includes("microsoft") || provider.toLowerCase().includes("azure")
          ? "MicrosoftOAuth"
          : "authkit";
      const authUrl = await getWorkOSAuthorizeUrl(redirectUri, providerParam);
      window.location.href = authUrl;
    } catch (err: any) {
      setErrorMessage(
        err.message || `Failed to initiate ${provider} SSO. Please verify WorkOS setup.`
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans bg-white selection:bg-[#1F45EC]/15 selection:text-[#1F45EC]">
      
      {/* ── LEFT COLUMN: WARM CREAM HERO ILLUSTRATION (matching Glean benchmark) ── */}
      <div className="hidden lg:flex flex-col justify-between p-12 lg:p-16 xl:p-20 bg-[#FAF8F5] border-r border-neutral-200/70 relative overflow-hidden select-none">
        
        {/* Top Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to website</span>
          </Link>
        </div>

        {/* Center Editorial Statement & Minimalistic Floating Documents Graphic */}
        <div className="max-w-lg mx-auto w-full my-auto space-y-10">
          <div className="space-y-3.5 text-center">
            <h1 className="text-[34px] xl:text-[40px] font-bold text-neutral-900 leading-[1.12] tracking-[-0.035em]">
              Start with an alarm or query. Walk away with verified work.
            </h1>
            <p className="text-[15px] xl:text-[16px] text-neutral-600 leading-relaxed max-w-md mx-auto">
              Engineering specs, P&amp;IDs, equipment manuals, and maintenance logs grounded in your company&apos;s context, ready to review and act.
            </p>
          </div>

          {/* Minimalist Floating Graphic matching Glean reference */}
          <div className="relative w-full max-w-[380px] h-[300px] mx-auto flex items-center justify-center">
            {/* Soft Ambient Pastel Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E6F4EA]/80 via-[#E8F0FE]/90 to-[#FCE8E6]/70 rounded-3xl blur-2xl opacity-70" />

            {/* Back Card (.sop) */}
            <div className="absolute w-[240px] h-[190px] rounded-2xl bg-[#E8E6DF]/90 border border-neutral-300/60 p-4 shadow-sm -rotate-6 -translate-x-12 -translate-y-4">
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-neutral-200 text-neutral-700">
                .sop
              </span>
              <div className="mt-3 space-y-2">
                <div className="h-2 w-3/4 bg-neutral-300/70 rounded" />
                <div className="h-2 w-1/2 bg-neutral-300/70 rounded" />
                <div className="h-2 w-5/6 bg-neutral-300/70 rounded" />
              </div>
            </div>

            {/* Middle Card (.dwg) */}
            <div className="absolute w-[250px] h-[195px] rounded-2xl bg-[#D6ECF9]/90 border border-blue-200/70 p-4 shadow-sm rotate-6 translate-x-10 -translate-y-2">
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-100 text-blue-700">
                .dwg
              </span>
              <div className="mt-3 space-y-2">
                <div className="h-2 w-2/3 bg-blue-200/80 rounded" />
                <div className="h-2 w-4/5 bg-blue-200/80 rounded" />
              </div>
            </div>

            {/* Foreground Main Card (.pdf) */}
            <div className="relative z-10 w-[270px] h-[210px] rounded-2xl bg-white border border-neutral-200/90 p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="h-2.5 w-24 bg-neutral-200 rounded" />
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-50 text-[#1F45EC] border border-blue-200/60">
                    .pdf
                  </span>
                </div>
                <div className="mt-4 space-y-2.5">
                  <div className="h-2 w-full bg-neutral-100 rounded" />
                  <div className="h-2 w-5/6 bg-neutral-100 rounded" />
                  <div className="h-2 w-4/6 bg-neutral-100 rounded" />
                  <div className="h-2 w-3/4 bg-neutral-100 rounded" />
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200" />
            </div>

          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-xs text-neutral-400 text-center">
          Enterprise Industrial Knowledge Intelligence · Isolated Multi-Tenant Architecture
        </div>

      </div>

      {/* ── RIGHT COLUMN: ULTRA-CLEAN AUTH FORM (matching Glean benchmark) ── */}
      <div className="flex flex-col justify-between p-8 sm:p-14 lg:p-16 xl:p-20 bg-white">
        
        {/* Top Right Alternative Flow Link */}
        <div className="flex justify-between lg:justify-end items-center">
          <Link
            href="/"
            className="lg:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black"
          >
            <ArrowLeft size={13} />
            <span>Home</span>
          </Link>
          <Link
            href="/login"
            className="text-xs font-medium text-neutral-600 hover:text-black transition-colors"
          >
            Looking for a trial? <span className="font-semibold text-[#1F45EC]">Create Evaluation Account</span>
          </Link>
        </div>

        {/* Centered Auth Card */}
        <div className="w-full max-w-[360px] mx-auto my-auto py-8">
          
          {/* Brand Logo in signature Royal Blue */}
          <div className="mb-10 text-center">
            <Link href="/" className="inline-block">
              <span className="text-[34px] font-bold tracking-tight text-[#1F45EC] font-sans">
                axios
              </span>
            </Link>
          </div>

          {/* STEP 1: WORK EMAIL */}
          {loginStep === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="work-email" className="block text-[13.5px] font-medium text-neutral-800">
                  Work email
                </label>
                <input
                  id="work-email"
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-11 px-3.5 rounded-lg text-sm text-neutral-900 bg-white border border-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-neutral-400"
                />
              </div>

              {/* Remember Me Checkbox matching Glean reference */}
              <div className="flex items-center justify-between pt-0.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-black border-neutral-300 focus:ring-0 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setAuthMethod(authMethod === "password" ? "code" : "password")}
                  className="text-neutral-500 hover:text-black cursor-pointer"
                >
                  {authMethod === "password" ? "Sign in with code instead" : "Sign in with password"}
                </button>
              </div>

              {/* Black Pill Button matching Glean */}
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full h-11 rounded-full text-sm font-semibold bg-black hover:bg-neutral-800 text-white transition-all mt-3 flex items-center justify-center cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isLoading ? "Checking tenant..." : "Log in"}
              </button>

              {/* Enterprise SSO Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-neutral-400">
                  <span className="bg-white px-2.5">or continue with SSO</span>
                </div>
              </div>

              {/* Clean Single Sign-On Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSSO("Okta")}
                  className="w-full h-10 px-4 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#007DC1]" />
                  <span>Sign in with Okta</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSSO("Microsoft Entra ID")}
                  className="w-full h-10 px-4 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00A4EF]" />
                  <span>Sign in with Microsoft Entra ID</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSSO("Google Workspace")}
                  className="w-full h-10 px-4 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
                  <span>Sign in with Google Workspace</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2A: PASSWORD */}
          {loginStep === "password" && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="pb-1">
                <span className="text-xs text-neutral-500 block">Signing in as</span>
                <span className="text-sm font-semibold text-neutral-900">{email}</span>
                {detectedOrg && (
                  <span className="text-xs text-[#1F45EC] font-medium block mt-0.5">
                    {detectedOrg}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password-field" className="block text-[13.5px] font-medium text-neutral-800">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod("code");
                      setLoginStep("code");
                      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
                      setMockDispatchedCode(randomCode);
                    }}
                    className="text-xs text-[#1F45EC] hover:underline cursor-pointer"
                  >
                    Email code instead?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password-field"
                    type={showPassword ? "text" : "password"}
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 px-3.5 pr-10 rounded-lg text-sm text-neutral-900 bg-white border border-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full h-11 rounded-full text-sm font-semibold bg-black hover:bg-neutral-800 text-white transition-all mt-2 flex items-center justify-center cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Log in"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setLoginStep("email")}
                  className="text-xs text-neutral-500 hover:text-black cursor-pointer"
                >
                  ← Use different email
                </button>
              </div>
            </form>
          )}

          {/* STEP 2B: EMAIL SECURITY CODE */}
          {loginStep === "code" && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="text-center pb-2">
                <span className="text-xs text-neutral-500 block">Security code sent to</span>
                <span className="text-sm font-semibold text-neutral-900">{email}</span>
              </div>

              {mockDispatchedCode && (
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs flex items-center justify-between">
                  <span className="font-mono text-neutral-600">Code: <strong className="font-bold text-neutral-900">{mockDispatchedCode}</strong></span>
                  <button
                    type="button"
                    onClick={() => setCode(mockDispatchedCode)}
                    className="text-xs font-semibold text-[#1F45EC] hover:underline"
                  >
                    Auto-fill
                  </button>
                </div>
              )}

              <div className="space-y-1.5 text-center">
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="••••••"
                  className="w-full h-12 text-center font-mono text-2xl tracking-[0.35em] font-bold rounded-lg border border-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || code.length < 6}
                className="w-full h-11 rounded-full text-sm font-semibold bg-black hover:bg-neutral-800 text-white transition-all mt-2 flex items-center justify-center cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify & Log in"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setLoginStep("email")}
                  className="text-xs text-neutral-500 hover:text-black cursor-pointer"
                >
                  ← Use different email
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Clean Minimalist Footer */}
        <div className="text-center text-xs text-neutral-400">
          <span>Axios Technologies · Enterprise Support: </span>
          <a href="mailto:support.axiosai@gmail.com" className="text-neutral-600 hover:underline">
            support.axiosai@gmail.com
          </a>
        </div>

      </div>

    </div>
  );
}
