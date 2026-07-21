"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldAlert, CheckCircle2, UserPlus, LogIn, KeyRound, Sparkles, ArrowLeft } from "lucide-react";
import { loginUser, registerUser, verifyOTP, resendOTP } from "@/lib/api";

const inputClass =
  "w-full h-10 px-3 rounded-sm text-sm text-text-primary bg-bg-primary border border-border-strong focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [unverifiedAccount, setUnverifiedAccount] = useState<{ email: string; otp: string } | null>(null);

  // Registration & OTP State
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regOrg, setRegOrg] = useState("Athleia Energy");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [receivedOtpHint, setReceivedOtpHint] = useState<string | null>(null);
  const [regMessage, setRegMessage] = useState<string | null>(null);
  const [regError, setRegError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setUnverifiedAccount(null);
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("athleia_token", data.access_token);
      localStorage.setItem("athleia_refresh_token", data.refresh_token);
      localStorage.setItem(
        "athleia_user",
        JSON.stringify({
          user_id: data.user_id,
          email: data.email,
          full_name: data.full_name,
          role: data.role,
          status: data.status,
        })
      );
      router.push("/workspace");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      if (msg.startsWith("UNVERIFIED:")) {
        const parts = msg.split(":");
        const unverifiedEmail = parts[1] || email;
        const unverifiedOtp = parts[2] || "";
        setUnverifiedAccount({ email: unverifiedEmail, otp: unverifiedOtp });
        setLoginError("Email is registered but not verified yet.");
      } else {
        setLoginError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleJumpToOtpVerification = (targetEmail: string, targetOtp: string) => {
    setRegEmail(targetEmail);
    if (password) setRegPassword(password);
    if (targetOtp) {
      setReceivedOtpHint(targetOtp);
      setOtpCode(targetOtp);
    }
    setActiveTab("signup");
    setIsOtpStep(true);
    setRegMessage(targetOtp
      ? "Your fresh OTP is shown below. Click Auto-fill then Verify."
      : "Enter the 6-digit OTP sent to your email."
    );
  };

  const handleResendOtp = async (targetEmail: string) => {
    setIsResending(true);
    try {
      const res = await resendOTP(targetEmail);
      const newOtp = res.dev_otp as string | undefined;
      // Jump straight to the OTP screen with the fresh code
      setRegEmail(targetEmail);
      if (password) setRegPassword(password);
      if (newOtp) {
        setReceivedOtpHint(newOtp);
        setOtpCode(newOtp);
      }
      setUnverifiedAccount(null);
      setLoginError(null);
      setActiveTab("signup");
      setIsOtpStep(true);
      setRegMessage(newOtp
        ? `Fresh OTP dispatched. Code: ${newOtp}`
        : "Fresh OTP dispatched to your email."
      );
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegMessage(null);
    setIsLoading(true);

    try {
      const res = await registerUser({
        email: regEmail,
        password: regPassword,
        full_name: regFullName,
        organization: regOrg,
      });

      const otp = (res.dev_otp as string) || null;
      if (otp) {
        setReceivedOtpHint(otp);
        setOtpCode(otp);
      }
      setRegMessage("6-digit OTP code generated and sent.");
      setIsOtpStep(true);
    } catch (err) {
      setRegError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setIsLoading(true);

    try {
      await verifyOTP(regEmail, otpCode);
      setRegMessage("Email OTP verified successfully! Logging you into your workspace...");

      // Automatically authenticate user after successful OTP verification
      const loginData = await loginUser(regEmail, regPassword);
      localStorage.setItem("athleia_token", loginData.access_token);
      localStorage.setItem("athleia_refresh_token", loginData.refresh_token);
      localStorage.setItem(
        "athleia_user",
        JSON.stringify({
          user_id: loginData.user_id,
          email: loginData.email,
          full_name: loginData.full_name,
          role: loginData.role,
          status: loginData.status,
        })
      );

      setTimeout(() => {
        router.push("/workspace");
      }, 1000);
    } catch (err) {
      setRegError(err instanceof Error ? err.message : "Invalid or expired OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Minimal top bar with Back to Home button */}
      <header className="border-b border-border-subtle" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="container-editorial h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
            <div className="h-4 w-px bg-border-subtle" />
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-6.5 h-6.5 shrink-0 rounded-[4px] overflow-hidden bg-accent/10 border border-accent/30 flex items-center justify-center p-0.5">
                <Image
                  src="/icon.png"
                  alt="Athleia Logo"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <span
                className="text-sm font-bold tracking-[0.08em] text-text-primary font-mono"
              >
                ATHLEIA.AI
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("login")}
              className={`text-xs font-mono px-3 py-1.5 rounded-sm transition-colors ${
                activeTab === "login" ? "bg-bg-tertiary text-text-primary font-bold" : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`text-xs font-mono px-3 py-1.5 rounded-sm transition-colors ${
                activeTab === "signup" ? "bg-bg-tertiary text-text-primary font-bold" : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              Create Account
            </button>
          </div>
        </div>
      </header>

      {/* Centered Auth Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div
            className="border border-border-subtle rounded-md overflow-hidden shadow-2xl"
            style={{ backgroundColor: "var(--bg-primary)" }}
          >
            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-border-subtle bg-bg-secondary">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setLoginError(null);
                }}
                className={`flex-1 py-3.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === "login"
                    ? "border-accent text-text-primary bg-bg-primary"
                    : "border-transparent text-text-tertiary hover:text-text-secondary"
                }`}
              >
                <LogIn size={15} />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("signup");
                  setRegError(null);
                  setRegMessage(null);
                }}
                className={`flex-1 py-3.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === "signup"
                    ? "border-accent text-text-primary bg-bg-primary"
                    : "border-transparent text-text-tertiary hover:text-text-secondary"
                }`}
              >
                <UserPlus size={15} />
                Create Account
              </button>
            </div>

            {/* TAB 1: SIGN IN */}
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="px-8 py-7 flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <h1 className="text-text-primary font-bold text-lg font-display">
                    Welcome to Athleia
                  </h1>
                  <p className="text-mono text-xs text-text-tertiary">
                    Enter your work credentials to access the platform.
                  </p>
                </div>

                {loginError && (
                  <div className="rounded-md border overflow-hidden text-xs flex flex-col"
                    style={{
                      borderColor: unverifiedAccount ? "rgba(234,179,8,0.35)" : "rgba(239,68,68,0.3)",
                      backgroundColor: unverifiedAccount ? "rgba(234,179,8,0.07)" : "rgba(239,68,68,0.07)"
                    }}
                  >
                    {/* Header row */}
                    <div className="flex items-start gap-2 px-3.5 pt-3 pb-2"
                      style={{ color: unverifiedAccount ? "#ca8a04" : "var(--status-error)" }}
                    >
                      <ShieldAlert size={15} className="shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold">
                          {unverifiedAccount ? "Account not verified" : loginError}
                        </span>
                        {unverifiedAccount && (
                          <span className="text-text-tertiary font-normal">
                            <span className="font-mono font-semibold text-text-secondary">{unverifiedAccount.email}</span>
                            {" "}is registered but unverified. Choose an option below:
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons for unverified accounts */}
                    {unverifiedAccount && (
                      <div className="flex gap-2 px-3.5 pb-3">
                        {/* Option 1: jump to OTP screen with existing/generated code */}
                        <button
                          type="button"
                          onClick={() =>
                            handleJumpToOtpVerification(
                              unverifiedAccount.email,
                              unverifiedAccount.otp
                            )
                          }
                          className="flex-1 py-2 px-3 rounded-sm font-mono font-bold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                          style={{ backgroundColor: "#ca8a04", color: "var(--bg-primary)" }}
                        >
                          <KeyRound size={13} />
                          Verify OTP →
                        </button>

                        {/* Option 2: request a fresh OTP via /resend-otp */}
                        <button
                          type="button"
                          disabled={isResending}
                          onClick={() => handleResendOtp(unverifiedAccount.email)}
                          className="flex-1 py-2 px-3 rounded-sm font-mono font-bold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 disabled:opacity-50"
                          style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border-strong)" }}
                        >
                          {isResending ? "Sending…" : "Re-send OTP"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-body text-xs text-text-primary font-semibold uppercase tracking-wider">
                    Work Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={inputClass}
                    style={{ backgroundColor: "var(--bg-secondary)" }}
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-body text-xs text-text-primary font-semibold uppercase tracking-wider">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className={`${inputClass} pr-10`}
                      style={{ backgroundColor: "var(--bg-secondary)" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 rounded-sm text-sm font-semibold bg-text-primary text-bg-primary hover:opacity-90 transition-opacity duration-150 mt-1 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? "Authenticating..." : "Sign in →"}
                </button>
              </form>
            )}

            {/* TAB 2: SIGN UP / CREATE ACCOUNT */}
            {activeTab === "signup" && (
              <div className="px-8 py-7 flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <h1 className="text-text-primary font-bold text-lg font-display">
                    {isOtpStep ? "Verify Email OTP" : "Create Account"}
                  </h1>
                  <p className="text-mono text-xs text-text-tertiary">
                    {isOtpStep
                      ? "Enter the 6-digit Security OTP code to activate your account."
                      : "Register an account to join your enterprise workspace."}
                  </p>
                </div>

                {regError && (
                  <div className="p-3 rounded-sm bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-start gap-2">
                    <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                {regMessage && (
                  <div className="p-3 rounded-sm bg-status-verified/10 border border-status-verified/30 text-status-verified text-xs flex items-start gap-2">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    <span>{regMessage}</span>
                  </div>
                )}

                {!isOtpStep ? (
                  <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-text-primary uppercase font-mono">Full Name</label>
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="John Doe"
                        className={inputClass}
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-text-primary uppercase font-mono">Work Email</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="engineer@athleia.ai"
                        className={inputClass}
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-text-primary uppercase font-mono">Password</label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className={inputClass}
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-text-primary uppercase font-mono">Organization</label>
                      <input
                        type="text"
                        value={regOrg}
                        onChange={(e) => setRegOrg(e.target.value)}
                        placeholder="Athleia Energy"
                        className={inputClass}
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-10 mt-2 bg-text-primary text-bg-primary font-semibold text-sm rounded-sm hover:opacity-90 transition-opacity"
                    >
                      {isLoading ? "Dispatching OTP..." : "Register & Send OTP →"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpVerify} className="flex flex-col gap-4">
                    {/* Dev OTP Banner / Hint */}
                    {receivedOtpHint && (
                      <div className="p-3 rounded-md bg-accent/10 border border-accent/30 text-text-primary flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-accent" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono uppercase text-text-tertiary">Dispatched Security OTP</span>
                            <span className="text-sm font-mono font-bold tracking-widest text-accent">{receivedOtpHint}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOtpCode(receivedOtpHint)}
                          className="px-2.5 py-1 rounded-sm bg-accent text-bg-primary font-mono text-xs font-bold hover:opacity-90"
                        >
                          Auto-fill
                        </button>
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-text-primary uppercase font-mono">
                        6-Digit OTP Security Code
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="123456"
                        className={`${inputClass} text-center font-mono text-xl tracking-[0.3em] font-bold`}
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                      />
                      <p className="text-[11px] font-mono text-text-tertiary">
                        Verification code sent to <span className="text-text-primary font-bold">{regEmail}</span>
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-10 mt-2 bg-status-verified text-bg-primary font-bold text-sm rounded-sm hover:opacity-90 transition-opacity"
                    >
                      {isLoading ? "Verifying..." : "Verify OTP & Sign In →"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsOtpStep(false)}
                      className="text-xs font-mono text-text-tertiary hover:text-text-primary text-center"
                    >
                      ← Edit details
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Card footer */}
            <div
              className="px-8 py-4 border-t border-border-subtle flex items-center justify-between"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <span className="text-mono text-xs text-text-tertiary">Auth Service Port 8008</span>
              <span className="text-mono text-xs text-text-tertiary">Argon2id · JWT · OTP</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
