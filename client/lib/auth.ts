"use client";

import { useState, useEffect } from "react";

export interface AuthUser {
  fullName: string;
  email: string;
  role: string;
  isDemo: boolean;
  organization?: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  sessionType: "organizational" | "evolution" | null;
}

export function getAuthSession(): AuthSession {
  if (typeof window === "undefined") {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      sessionType: null,
    };
  }

  try {
    const token = localStorage.getItem("axios_token");
    const sessionType = localStorage.getItem("axios_session_type") as "organizational" | "evolution" | null;
    const evalUser = localStorage.getItem("axios_eval_user");
    const storedUser = localStorage.getItem("axios_user");
    const orgUser = localStorage.getItem("axios_org_user");

    // Any valid token or session type indicates authentication
    if (!token && !sessionType && !evalUser && !storedUser && !orgUser) {
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        sessionType: null,
      };
    }

    let user: AuthUser = {
      fullName: "Axios Member",
      email: "user@axios.ai",
      role: "MEMBER",
      isDemo: false,
      organization: "Axios Enterprise",
    };

    if (sessionType === "evolution" || evalUser) {
      const parsed = evalUser ? JSON.parse(evalUser) : {};
      user = {
        fullName: parsed.fullName || parsed.full_name || "Evaluation Guest",
        email: parsed.email || "guest@evaluation.demo",
        role: "EVAL_SANDBOX",
        isDemo: true,
        organization: "Evaluation Sandbox",
      };
    } else if (storedUser) {
      const parsed = JSON.parse(storedUser);
      user = {
        fullName: parsed.full_name || parsed.fullName || parsed.email?.split("@")[0] || "Axios Member",
        email: parsed.email || "user@axios.ai",
        role: parsed.role || "MEMBER",
        isDemo: false,
        organization: parsed.organization || parsed.org || "Axios Enterprise",
      };
    } else if (orgUser) {
      const parsed = JSON.parse(orgUser);
      user = {
        fullName: parsed.name || parsed.email?.split("@")[0] || "Enterprise User",
        email: parsed.email || "user@enterprise.internal",
        role: parsed.role || "MEMBER",
        isDemo: false,
        organization: parsed.org || "Axios Enterprise",
      };
    }

    return {
      isAuthenticated: true,
      user,
      token: token || "session-active",
      sessionType: sessionType || "organizational",
    };
  } catch (e) {
    console.error("Error reading auth session", e);
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      sessionType: null,
    };
  }
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("axios_token");
    localStorage.removeItem("axios_user");
    localStorage.removeItem("axios_eval_user");
    localStorage.removeItem("axios_session_type");
    localStorage.removeItem("axios_org_auth");
    localStorage.removeItem("axios_org_user");
    window.dispatchEvent(new Event("axios-auth-changed"));
  } catch (e) {
    console.error("Error clearing auth session", e);
  }
}

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession>({
    isAuthenticated: false,
    user: null,
    token: null,
    sessionType: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const update = () => {
      setSession(getAuthSession());
      setIsLoading(false);
    };

    update();

    window.addEventListener("storage", update);
    window.addEventListener("axios-auth-changed", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("axios-auth-changed", update);
    };
  }, []);

  return { ...session, isLoading, signOut: clearAuthSession };
}
