"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, CheckCircle2, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { loginUser, getWorkOSAuthorizeUrl, launchEvolutionDemoSession } from "@/lib/api";
import { getAuthSession, clearAuthSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  // Active Session State
  const [existingSession, setExistingSession] = useState<{ isAuthenticated: boolean; user: any } | null>(null);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginStep, setLoginStep] = useState<"email" | "password">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detectedOrg, setDetectedOrg] = useState<string | null>(null);

  useEffect(() => {
    const session = getAuthSession();
    if (session.isAuthenticated) {
      setExistingSession(session);
    }
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setErrorMessage(null);

    // Auto-detect enterprise tenant domain
    const domain = email.split("@")[1]?.toLowerCase();
    if (domain) {
      if (domain.includes("booking")) setDetectedOrg("Booking.com Global Tenant");
      else if (domain.includes("zillow")) setDetectedOrg("Zillow Group Tenant");
      else if (domain.includes("ericsson")) setDetectedOrg("Ericsson Telecom Tenant");
      else if (domain.includes("time")) setDetectedOrg("TIME Editorial Tenant");
      else setDetectedOrg("Axios Enterprise Tenant");
    }

    setLoginStep("password");
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage("Please enter your account password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const authRes = await loginUser(email, password);
      localStorage.setItem("axios_token", authRes.access_token);
      localStorage.setItem("axios_refresh_token", authRes.refresh_token || "");
      localStorage.setItem("axios_session_type", "organizational");
      localStorage.setItem(
        "axios_user",
        JSON.stringify({
          user_id: authRes.user_id,
          email: authRes.email || email,
          full_name: authRes.full_name || email.split("@")[0],
          role: authRes.role || "EMPLOYEE",
          organization: (authRes as any).organization || detectedOrg || "Axios Enterprise",
        })
      );
      window.dispatchEvent(new Event("axios-auth-changed"));
      router.push("/workspace");
    } catch (err: any) {
      setErrorMessage(
        err.message || "Invalid enterprise credentials. Please check your email and password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchEvaluation = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const evalSession = await launchEvolutionDemoSession({
        email: "guest@evaluation.demo",
        fullName: "Evaluation Guest",
        phoneNumber: "+10000000000",
        organization: "Evaluation Sandbox",
      });

      localStorage.setItem("axios_token", evalSession.access_token);
      localStorage.setItem("axios_session_type", "evolution");
      localStorage.setItem(
        "axios_user",
        JSON.stringify({
          user_id: evalSession.session_id,
          email: evalSession.demo_user || "guest@evaluation.demo",
          full_name: "Evaluation Guest",
          role: evalSession.role || "EVOLUTION_GUEST",
          organization: "Evaluation Sandbox",
        })
      );
      window.dispatchEvent(new Event("axios-auth-changed"));
      router.push("/workspace");
    } catch {
      // Local development fallback
      localStorage.setItem("axios_token", "eval_mock_token_local");
      localStorage.setItem("axios_session_type", "evolution");
      localStorage.setItem(
        "axios_user",
        JSON.stringify({
          user_id: "eval-local-001",
          email: "guest@evaluation.demo",
          full_name: "Evaluation Guest",
          role: "EVOLUTION_GUEST",
          organization: "Evaluation Sandbox",
        })
      );
      window.dispatchEvent(new Event("axios-auth-changed"));
      router.push("/workspace");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSO = async (provider: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const redirectUri = `${window.location.origin}/auth/callback`;
      const providerParam = provider.toLowerCase().includes("google")
        ? "GoogleOAuth"
        : provider.toLowerCase().includes("microsoft")
        ? "MicrosoftOAuth"
        : "authkit";
      const authUrl = await getWorkOSAuthorizeUrl(redirectUri, providerParam);
      window.location.href = authUrl;
    } catch (err: any) {
      setErrorMessage(
        err.message || `Failed to initiate ${provider} SSO. Please verify WorkOS configuration.`
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
          <div className="relative w-full max-w-[380px] h-[280px] mx-auto flex items-center justify-center">
            {/* Soft Ambient Pastel Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E6F4EA]/80 via-[#E8F0FE]/90 to-[#FCE8E6]/70 rounded-2xl blur-2xl opacity-70" />

            {/* Back Card (.sop) */}
            <div className="absolute w-[240px] h-[190px] rounded-md bg-[#E8E6DF]/90 border border-neutral-300/60 p-4 shadow-xs -rotate-6 -translate-x-12 -translate-y-4">
              <span className="inline-block px-1.5 py-0.5 rounded-sm text-[9px] font-mono font-bold bg-neutral-200 text-neutral-700">
                .sop
              </span>
              <div className="mt-3 space-y-2">
                <div className="h-2 w-3/4 bg-neutral-300/70 rounded-sm" />
                <div className="h-2 w-1/2 bg-neutral-300/70 rounded-sm" />
                <div className="h-2 w-5/6 bg-neutral-300/70 rounded-sm" />
              </div>
            </div>

            {/* Middle Card (.dwg) */}
            <div className="absolute w-[250px] h-[195px] rounded-md bg-[#D6ECF9]/90 border border-blue-200/70 p-4 shadow-xs rotate-6 translate-x-10 -translate-y-2">
              <span className="inline-block px-1.5 py-0.5 rounded-sm text-[9px] font-mono font-bold bg-blue-100 text-blue-700">
                .dwg
              </span>
              <div className="mt-3 space-y-2">
                <div className="h-2 w-2/3 bg-blue-200/80 rounded-sm" />
                <div className="h-2 w-4/5 bg-blue-200/80 rounded-sm" />
              </div>
            </div>

            {/* Foreground Main Card (.pdf) */}
            <div className="relative z-10 w-[270px] h-[210px] rounded-md bg-white border border-neutral-200/90 p-5 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="h-2.5 w-24 bg-neutral-200 rounded-sm" />
                  <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-mono font-bold bg-blue-50 text-[#1F45EC] border border-blue-200/60">
                    .pdf
                  </span>
                </div>
                <div className="mt-4 space-y-2.5">
                  <div className="h-2 w-full bg-neutral-100 rounded-sm" />
                  <div className="h-2 w-5/6 bg-neutral-100 rounded-sm" />
                  <div className="h-2 w-4/6 bg-neutral-100 rounded-sm" />
                  <div className="h-2 w-3/4 bg-neutral-100 rounded-sm" />
                </div>
              </div>
              <div className="w-8 h-8 rounded-sm bg-neutral-100 border border-neutral-200" />
            </div>

          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-xs text-neutral-400 text-center">
          Enterprise Industrial Knowledge Intelligence · Isolated Multi-Tenant Architecture
        </div>

      </div>

      {/* ── RIGHT COLUMN: ULTRA-CLEAN AUTH FORM ── */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20 bg-white">
        
        {/* Top Header Row */}
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to website</span>
          </Link>

          <button
            type="button"
            onClick={handleLaunchEvaluation}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium bg-[#1F45EC]/10 hover:bg-[#1F45EC]/15 text-[#1F45EC] transition-colors cursor-pointer"
          >
            <Sparkles size={13} />
            <span>1-Click Demo Sandbox</span>
          </button>
        </div>

        {/* Center Card Content */}
        <div className="w-full max-w-[380px] mx-auto my-auto py-8">
          
          {/* Brand Logo in signature Royal Blue */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <span className="text-[34px] font-bold tracking-tight text-[#1F45EC] font-sans">
                axios
              </span>
            </Link>
          </div>

          {/* ACTIVE SESSION CARD (If user already logged in) */}
          {existingSession?.isAuthenticated ? (
            <div className="p-6 rounded-md border border-neutral-200 bg-neutral-50/70 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#1F45EC]/10 text-[#1F45EC] border border-[#1F45EC]/20 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Already Signed In</h2>
                <p className="text-xs text-neutral-600 mt-1">
                  Active session as <strong className="text-neutral-900">{existingSession.user?.fullName}</strong>
                </p>
                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-sm text-[11px] font-mono font-medium bg-[#1F45EC]/10 text-[#1F45EC]">
                    {existingSession.user?.organization || "Axios Enterprise"}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/workspace"
                  className="w-full h-10 rounded-sm bg-[#1F45EC] hover:bg-[#1538D4] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <LayoutDashboard size={14} />
                  <span>Go to Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    clearAuthSession();
                    setExistingSession(null);
                  }}
                  className="w-full h-9 rounded-sm border border-neutral-300 hover:bg-neutral-100 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Sign in as a different user</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-sm bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* STEP 1: WORK EMAIL */}
              {loginStep === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="work-email" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 font-mono">
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
                      className="w-full h-11 px-3.5 rounded-sm text-sm text-neutral-900 bg-white border border-neutral-300 focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all placeholder:text-neutral-400"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-0.5 text-xs text-neutral-600">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded-xs text-[#1F45EC] border-neutral-300 focus:ring-0 cursor-pointer"
                      />
                      <span>Remember me</span>
                    </label>
                  </div>

                  {/* Clean Non-Curvy Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !email.trim()}
                    className="w-full h-11 rounded-sm text-xs font-semibold uppercase tracking-wider bg-black hover:bg-neutral-800 text-white transition-all mt-3 flex items-center justify-center cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isLoading ? "Checking tenant..." : "Continue with Email"}
                  </button>

                  {/* Enterprise SSO Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-200" />
                    </div>
                    <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      <span className="bg-white px-2.5">or continue with SSO</span>
                    </div>
                  </div>

                  {/* Clean Single Sign-On Buttons (rounded-sm) */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSSO("Google Workspace")}
                      className="w-full h-10 px-4 rounded-sm border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Continue with Google Workspace</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSSO("Microsoft Entra ID")}
                      className="w-full h-10 px-4 rounded-sm border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 23 23">
                        <path fill="#f35325" d="M1 1h10v10H1z" />
                        <path fill="#81bc06" d="M12 1h10v10H12z" />
                        <path fill="#05a6f0" d="M1 12h10v10H1z" />
                        <path fill="#ffba08" d="M12 12h10v10H12z" />
                      </svg>
                      <span>Continue with Microsoft Entra ID</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSSO("Okta")}
                      className="w-full h-10 px-4 rounded-sm border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#007DC1]" />
                      <span>Continue with Okta SSO</span>
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: PASSWORD */}
              {loginStep === "password" && (
                <form onSubmit={handleFinalSubmit} className="space-y-4">
                  <div className="pb-1">
                    <span className="text-xs text-neutral-500 block">Signing in as</span>
                    <span className="text-sm font-semibold text-neutral-900">{email}</span>
                    {detectedOrg && (
                      <span className="text-[11px] font-mono text-[#1F45EC] font-semibold block mt-0.5">
                        {detectedOrg}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password-field" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 font-mono">
                        Password
                      </label>
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
                        className="w-full h-11 px-3.5 pr-10 rounded-sm text-sm text-neutral-900 bg-white border border-neutral-300 focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all"
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
                    className="w-full h-11 rounded-sm text-xs font-semibold uppercase tracking-wider bg-black hover:bg-neutral-800 text-white transition-all mt-2 flex items-center justify-center cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isLoading ? "Signing in..." : "Sign In to Workspace"}
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
            </>
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
