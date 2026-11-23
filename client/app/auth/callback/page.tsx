"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { exchangeWorkOSCode } from "@/lib/api";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");
  const errorDesc = searchParams.get("error_description");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (errorParam) {
      setStatus("error");
      setErrorMessage(errorDesc || errorParam || "WorkOS authentication failed.");
      return;
    }

    if (!code) {
      setStatus("error");
      setErrorMessage("No authorization code provided in callback query.");
      return;
    }

    let isMounted = true;

    async function handleExchange() {
      try {
        const tokenRes = await exchangeWorkOSCode(code!);
        if (!isMounted) return;

        localStorage.setItem("axios_token", tokenRes.access_token);
        localStorage.setItem("axios_session_type", "organizational");
        localStorage.setItem("axios_user", JSON.stringify(tokenRes));

        setStatus("success");
        setTimeout(() => {
          router.push("/workspace");
        }, 600);
      } catch (err: any) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(err.message || "Failed to exchange WorkOS authorization code.");
      }
    }

    handleExchange();

    return () => {
      isMounted = false;
    };
  }, [code, errorParam, errorDesc, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl border border-neutral-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 text-center">
        
        {/* Brand */}
        <div className="mb-6">
          <span className="text-[32px] font-bold tracking-tight text-[#1F45EC] font-sans">
            axios
          </span>
        </div>

        {status === "loading" && (
          <div className="space-y-4 py-6">
            <Loader2 size={32} className="animate-spin mx-auto text-[#1F45EC]" />
            <h2 className="text-base font-semibold text-neutral-800">
              Authenticating with WorkOS...
            </h2>
            <p className="text-xs text-neutral-500">
              Verifying your enterprise credentials and establishing session.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 py-6">
            <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
            <h2 className="text-base font-semibold text-neutral-800">
              Authentication Verified
            </h2>
            <p className="text-xs text-neutral-500">
              Redirecting to your enterprise workspace...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 py-4 text-left">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle size={20} className="shrink-0" />
              <h2 className="text-sm font-semibold">Authentication Error</h2>
            </div>
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 leading-relaxed">
              {errorMessage}
            </div>
            <div className="pt-4 text-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-semibold transition-all"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-mono text-xs text-neutral-400">
          Loading callback...
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
