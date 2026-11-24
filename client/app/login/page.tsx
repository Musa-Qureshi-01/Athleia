"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { loginUser, registerUser, verifyOTP, getWorkOSAuthorizeUrl, launchEvolutionDemoSession } from "@/lib/api";
import { getAuthSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  // Active Tab: "signin" | "create_account" | "evaluation_preview"
  const [activeTab, setActiveTab] = useState<"signin" | "create_account" | "evaluation_preview">("signin");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Verification state for Create Account
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [receivedOtpHint, setReceivedOtpHint] = useState<string | null>(null);

  // Feedback & Loading
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Mobile restriction state
  const [mobileNotice, setMobileNotice] = useState<string | null>(null);

  // Check if client is mobile
  const isMobileClient = () => {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent || "";
    const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua);
    const isSmallScreen = window.innerWidth < 768;
    return isMobileUA || isSmallScreen;
  };

  useEffect(() => {
    const session = getAuthSession();
    if (session.isAuthenticated) {
      router.push("/workspace");
    }
  }, [router]);

  // Handle Sign In Submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setMobileNotice(null);

    // Mobile restriction
    if (isMobileClient()) {
      setMobileNotice("Cannot login via mobile phone now.");
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your work email and password.");
      return;
    }

    setIsLoading(true);

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
          organization: (authRes as any).organization || "Axios Enterprise",
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

  // Handle Create Account Submit
  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setMobileNotice(null);
    setSuccessMessage(null);

    // Mobile restriction
    if (isMobileClient()) {
      setMobileNotice("Cannot login via mobile phone now.");
      return;
    }

    if (!email.trim() || !password || !fullName.trim()) {
      setErrorMessage("Please provide your name, work email, and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerUser({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        organization: organization.trim() || "Axios Enterprise",
      });

      const otp = (res.dev_otp as string) || null;
      if (otp) {
        setReceivedOtpHint(otp);
        setOtpCode(otp);
      }
      setSuccessMessage("Security verification code dispatched to your email.");
      setIsOtpStep(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verify
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setMobileNotice(null);

    if (isMobileClient()) {
      setMobileNotice("Cannot login via mobile phone now.");
      return;
    }

    setIsLoading(true);

    try {
      await verifyOTP(email, otpCode);
      const loginData = await loginUser(email, password);
      localStorage.setItem("axios_token", loginData.access_token);
      localStorage.setItem("axios_refresh_token", loginData.refresh_token || "");
      localStorage.setItem("axios_session_type", "organizational");
      localStorage.setItem(
        "axios_user",
        JSON.stringify({
          user_id: loginData.user_id,
          email: loginData.email,
          full_name: loginData.full_name,
          role: loginData.role,
          status: loginData.status,
          organization: organization || "Axios Enterprise",
        })
      );
      window.dispatchEvent(new Event("axios-auth-changed"));
      router.push("/workspace");
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid or expired OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Evaluation Preview Launch
  const handleEvaluationLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setMobileNotice(null);

    // Mobile restriction
    if (isMobileClient()) {
      setMobileNotice("Cannot login via mobile phone now.");
      return;
    }

    setIsLoading(true);

    try {
      const evalSession = await launchEvolutionDemoSession({
        email: email.trim() || "guest@evaluation.demo",
        fullName: fullName.trim() || "Evaluation Guest",
        phoneNumber: "+10000000000",
        organization: organization.trim() || "Evaluation Sandbox",
      });

      localStorage.setItem("axios_token", evalSession.access_token);
      localStorage.setItem("axios_session_type", "evolution");
      localStorage.setItem(
        "axios_user",
        JSON.stringify({
          user_id: evalSession.session_id,
          email: evalSession.demo_user || email || "guest@evaluation.demo",
          full_name: fullName || "Evaluation Guest",
          role: evalSession.role || "EVOLUTION_GUEST",
          organization: organization || "Evaluation Sandbox",
        })
      );
      window.dispatchEvent(new Event("axios-auth-changed"));
      router.push("/workspace");
    } catch {
      // Local fallback
      localStorage.setItem("axios_token", "eval_mock_token_local");
      localStorage.setItem("axios_session_type", "evolution");
      localStorage.setItem(
        "axios_user",
        JSON.stringify({
          user_id: "eval-local-001",
          email: email || "guest@evaluation.demo",
          full_name: fullName || "Evaluation Guest",
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

  // SSO Provider Redirect
  const handleSSO = async (provider: string) => {
    setMobileNotice(null);
    if (isMobileClient()) {
      setMobileNotice("Cannot login via mobile phone now.");
      return;
    }

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
      
      {/* ── LEFT COLUMN: WARM CREAM HERO ILLUSTRATION (Exact Glean style match) ── */}
      <div className="hidden lg:flex flex-col justify-between p-12 lg:p-16 xl:p-20 bg-[#FAF8F5] border-r border-neutral-200/70 relative overflow-hidden select-none">
        
        {/* Top Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
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
            <p className="text-[14.5px] xl:text-[15.5px] text-neutral-600 leading-relaxed max-w-md mx-auto">
              Decks, docs, specs, and procedures drafted from your company&apos;s context, ready to review and share.
            </p>
          </div>

          {/* Minimalist Floating Graphic matching exact benchmark */}
          <div className="relative w-full max-w-[380px] h-[280px] mx-auto flex items-center justify-center">
            {/* Soft Ambient Pastel Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E6F4EA]/80 via-[#E8F0FE]/90 to-[#FCE8E6]/70 rounded-2xl blur-2xl opacity-70" />

            {/* Back Card (.xlsx) */}
            <div className="absolute w-[240px] h-[190px] rounded-md bg-[#E8E6DF]/90 border border-neutral-300/60 p-4 shadow-xs -rotate-6 -translate-x-12 -translate-y-4">
              <span className="inline-block px-1.5 py-0.5 rounded-sm text-[9px] font-mono font-bold bg-neutral-200 text-neutral-700">
                .xlsx
              </span>
              <div className="mt-3 space-y-2">
                <div className="h-2 w-3/4 bg-neutral-300/70 rounded-sm" />
                <div className="h-2 w-1/2 bg-neutral-300/70 rounded-sm" />
                <div className="h-2 w-5/6 bg-neutral-300/70 rounded-sm" />
              </div>
            </div>

            {/* Foreground Main Card (.docx) */}
            <div className="relative z-10 w-[270px] h-[210px] rounded-md bg-white border border-neutral-200/90 p-5 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="h-2.5 w-24 bg-neutral-200 rounded-sm" />
                  <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-mono font-bold bg-blue-50 text-[#1F45EC] border border-blue-200/60">
                    .docx
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
          Axios Enterprise Intelligence · Interactive Evaluation Workspace
        </div>

      </div>

      {/* ── RIGHT COLUMN: ULTRA-CLEAN AUTHENTICATION FORM ── */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20 bg-white min-h-screen">
        
        {/* Top Header Row */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to website</span>
          </Link>
        </div>

        {/* Center Container */}
        <div className="w-full max-w-[380px] mx-auto my-auto py-6">
          
          {/* Brand Logo in signature Royal Blue */}
          <div className="text-center mb-5">
            <Link href="/" className="inline-block">
              <span className="text-[36px] font-bold tracking-tight text-[#1F45EC] font-sans">
                axios
              </span>
            </Link>
          </div>

          {/* Subtitle link matching image */}
          <div className="text-center mb-6">
            <p className="text-xs text-neutral-600">
              Already an enterprise customer?{" "}
              <button
                type="button"
                onClick={() => handleSSO("authkit")}
                className="font-semibold text-[#1F45EC] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                Sign in with Organization ↗
              </button>
            </p>
          </div>

          {/* Three Clean Horizontal Tabs matching image */}
          <div className="flex items-center justify-between border-b border-neutral-200 mb-6 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab("signin");
                setErrorMessage(null);
                setMobileNotice(null);
                setIsOtpStep(false);
              }}
              className={`pb-2.5 font-semibold transition-colors cursor-pointer relative ${
                activeTab === "signin"
                  ? "text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("create_account");
                setErrorMessage(null);
                setMobileNotice(null);
                setIsOtpStep(false);
              }}
              className={`pb-2.5 font-semibold transition-colors cursor-pointer relative ${
                activeTab === "create_account"
                  ? "text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              Create Account
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("evaluation_preview");
                setErrorMessage(null);
                setMobileNotice(null);
                setIsOtpStep(false);
              }}
              className={`pb-2.5 font-semibold transition-colors cursor-pointer relative ${
                activeTab === "evaluation_preview"
                  ? "text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              Evaluation Preview
            </button>
          </div>

          {/* Plain Text Mobile Notice (NO EMOJIS, NO ICONS, JUST CLEAR INFORMATION) */}
          {mobileNotice && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium text-center">
              {mobileNotice}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
              {successMessage}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 1: SIGN IN (Matches exact screenshot media_1795512300006_8143b756.jpg)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "signin" && (
            <div>
              {/* Google & Microsoft Side-by-Side SSO Buttons */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <button
                  type="button"
                  onClick={() => handleSSO("Google")}
                  className="h-10 px-3 rounded-md border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSSO("Microsoft")}
                  className="h-10 px-3 rounded-md border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  <span>Microsoft</span>
                </button>
              </div>

              {/* OR CORPORATE EMAIL Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  <span className="bg-white px-2.5">OR CORPORATE EMAIL</span>
                </div>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="work-email" className="block text-xs font-medium text-neutral-800">
                    Work email
                  </label>
                  <input
                    id="work-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full h-10.5 px-3.5 rounded-md text-sm text-neutral-900 bg-white border border-neutral-300 focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all placeholder:text-neutral-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password-field" className="block text-xs font-medium text-neutral-800">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password-field"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-10.5 px-3.5 pr-10 rounded-md text-sm text-neutral-900 bg-white border border-neutral-300 focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all"
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

                <div className="flex items-center pt-0.5 text-xs text-neutral-600">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#1F45EC] border-neutral-300 focus:ring-0 cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>
                </div>

                {/* Log In to Workspace Button (Matches screenshot capsule styling) */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-full text-xs font-semibold bg-black hover:bg-neutral-800 text-white transition-all mt-2 flex items-center justify-center cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isLoading ? "Signing in..." : "Log In to Workspace"}
                </button>
              </form>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 2: CREATE ACCOUNT (Dedicated Registration with OTP)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "create_account" && (
            <div>
              {!isOtpStep ? (
                <form onSubmit={handleCreateAccountSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-800">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Vance"
                      className="w-full h-10 px-3.5 rounded-md text-sm text-neutral-900 bg-white border border-neutral-300 focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all placeholder:text-neutral-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-800">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full h-10 px-3.5 rounded-md text-sm text-neutral-900 bg-white border border-neutral-300 focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all placeholder:text-neutral-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-800">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full h-10 px-3.5 rounded-md text-sm text-neutral-900 bg-white border border-neutral-300 focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-800">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Axios Energy"
                      className="w-full h-10 px-3.5 rounded-md text-sm text-neutral-900 bg-white border border-neutral-300 focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all placeholder:text-neutral-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-full text-xs font-semibold bg-black hover:bg-neutral-800 text-white transition-all mt-3 flex items-center justify-center cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isLoading ? "Creating Account..." : "Create Account & Send Code"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpVerify} className="space-y-4">
                  {receivedOtpHint && (
                    <div className="p-3 rounded-md bg-neutral-50 border border-neutral-200 text-xs flex items-center justify-between">
                      <span className="font-mono text-neutral-600">
                        Code: <strong className="font-bold text-neutral-900">{receivedOtpHint}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setOtpCode(receivedOtpHint)}
                        className="text-xs font-semibold text-[#1F45EC] hover:underline cursor-pointer"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  <div className="space-y-1.5 text-center">
                    <label className="block text-xs font-medium text-neutral-800">
                      6-Digit Security Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="••••••"
                      className="w-full h-12 text-center font-mono text-2xl tracking-[0.35em] font-bold rounded-md border border-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                    <p className="text-[11px] text-neutral-500">
                      Sent to {email}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length < 6}
                    className="w-full h-11 rounded-full text-xs font-semibold bg-[#1F45EC] hover:bg-[#1538D4] text-white transition-all flex items-center justify-center cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isLoading ? "Verifying..." : "Verify & Log in"}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setIsOtpStep(false)}
                      className="text-xs text-neutral-500 hover:text-black cursor-pointer"
                    >
                      ← Edit details
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 3: EVALUATION PREVIEW (Dedicated Sandbox Preview)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "evaluation_preview" && (
            <form onSubmit={handleEvaluationLaunch} className="space-y-3.5">
              <div className="p-3.5 rounded-md bg-[#FAF8F5] border border-neutral-200 text-xs text-neutral-600 leading-relaxed mb-1">
                Evaluation Preview grants instant sandbox access with full document indexing, hybrid retrieval, and AI copilot reasoning.
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-800">
                  Your Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Evaluation Guest"
                  className="w-full h-10 px-3.5 rounded-md text-sm text-neutral-900 bg-white border border-neutral-300 focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all placeholder:text-neutral-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-800">
                  Work Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guest@evaluation.demo"
                  className="w-full h-10 px-3.5 rounded-md text-sm text-neutral-900 bg-white border border-neutral-300 focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all placeholder:text-neutral-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-800">
                  Sandbox Workspace Name
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Evaluation Sandbox"
                  className="w-full h-10 px-3.5 rounded-md text-sm text-neutral-900 bg-white border border-neutral-300 focus:outline-none focus:border-[#1F45EC] focus:ring-1 focus:ring-[#1F45EC] transition-all placeholder:text-neutral-400"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-full text-xs font-semibold bg-[#1F45EC] hover:bg-[#1538D4] text-white transition-all mt-3 flex items-center justify-center cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isLoading ? "Initializing Sandbox..." : "Launch Evaluation Preview"}
              </button>
            </form>
          )}

        </div>

        {/* Clean Minimalist Footer matching screenshot */}
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
