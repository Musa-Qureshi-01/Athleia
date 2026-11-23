"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/workspace/Sidebar";
import { TopNav } from "@/components/workspace/TopNav";
import { validateSessionToken } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isFullHeightApp = pathname?.startsWith("/workspace/assistant") || pathname?.startsWith("/workspace/knowledge");

  // Auto-collapse sidebar on narrower/laptop screens (< 1024px) for optimal horizontal space
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkWidth = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      if (typeof window === "undefined") return;

      if (window.innerWidth < 1200) {
        setCollapsed(true);
      }

      const token = localStorage.getItem("axios_token");
      if (!token) {
        if (isMounted) {
          setIsAuthenticated(false);
          router.push("/login");
        }
        return;
      }

      // Verify token authenticity against backend (Organisational or Evolution)
      try {
        const validation = await validateSessionToken(token);
        if (!isMounted) return;

        if (validation.valid) {
          setIsAuthenticated(true);
        } else {
          // Token is expired, invalid, or forged - clear stale credentials
          localStorage.removeItem("axios_token");
          localStorage.removeItem("axios_eval_user");
          localStorage.removeItem("axios_user");
          setIsAuthenticated(false);
          router.push("/login?error=session_expired");
        }
      } catch {
        if (!isMounted) return;
        localStorage.removeItem("axios_token");
        setIsAuthenticated(false);
        router.push("/login?error=session_expired");
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg-primary text-text-secondary font-mono text-xs">
        Authenticating session...
      </div>
    );
  }

  return (
    <div
      className="flex w-full max-w-full overflow-hidden bg-bg-primary text-text-primary"
      style={{
        height: "calc(100vh / 1.15)",
        maxHeight: "calc(100vh / 1.15)",
      }}
    >
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopNav />
        <main
          className={cn(
            "flex-1 min-h-0 bg-bg-primary",
            isFullHeightApp
              ? "h-full overflow-hidden flex flex-col"
              : "overflow-y-auto overflow-x-hidden"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
