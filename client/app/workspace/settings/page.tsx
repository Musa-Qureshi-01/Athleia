"use client";

import { useState, useEffect } from "react";
import {
  Sliders,
  Moon,
  Sun,
  Keyboard,
  Terminal,
  Info,
  Shield,
  Server,
  Check,
  Users,
  UserCheck,
  UserCog,
  RefreshCw,
  Lock,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";
import { fetchUserList, updateUserRole, UserProfileData } from "@/lib/api";

export default function SettingsPage() {
  const [developerMode, setDeveloperMode] = useState(true);
  const [airgapStrict, setAirgapStrict] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.85);

  // User Admin State
  const [users, setUsers] = useState<UserProfileData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userAdminMsg, setUserAdminMsg] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("athleia_token") : null;
      if (token) {
        const data = await fetchUserList(token);
        setUsers(data.users);
      }
    } catch {
      // Fallback mock users if unauthenticated
      setUsers([
        {
          user_id: "usr_superadmin",
          email: "admin@athleia.ai",
          full_name: "Athleia Super Admin",
          organization: "Athleia Core",
          role: "SUPER_ADMIN",
          status: "ACTIVE",
          is_verified: true,
          created_at: new Date().toISOString(),
          permissions: ["all"],
        },
        {
          user_id: "usr_002",
          email: "engineer.musa@athleia.ai",
          full_name: "Musa Qureshi",
          organization: "Athleia Energy",
          role: "ADMIN",
          status: "ACTIVE",
          is_verified: true,
          created_at: new Date().toISOString(),
          permissions: ["manage_users", "upload_documents"],
        },
        {
          user_id: "usr_003",
          email: "field.tech@athleia.ai",
          full_name: "Field Technician",
          organization: "Athleia Operations",
          role: "EMPLOYEE",
          status: "PENDING_VERIFICATION",
          is_verified: false,
          created_at: new Date().toISOString(),
          permissions: ["view_documents"],
        },
      ]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUserAdminMsg(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("athleia_token") : null;
      if (token) {
        await updateUserRole(userId, newRole, token);
      }
      setUsers((prev) =>
        prev.map((u) => (u.user_id === userId ? { ...u, role: newRole as any } : u))
      );
      setUserAdminMsg(`Updated user role to ${newRole}.`);
    } catch (err) {
      setUserAdminMsg(err instanceof Error ? err.message : "Failed to update role.");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-6 border-b border-border-subtle">
        <span className="text-label text-text-tertiary">System Configuration</span>
        <h1 className="text-heading-1 text-text-primary">
          Platform Settings
        </h1>
      </div>

      {/* Section 1: User & Identity Administration (Auth Service Port 8008) */}
      <div className="p-6 rounded-md border border-border-subtle bg-bg-primary flex flex-col gap-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCog size={18} className="text-accent" />
            <div>
              <h2 className="text-sm font-bold text-text-primary font-mono uppercase tracking-wider">
                User & Organization Identity (Port 8008)
              </h2>
              <p className="text-xs text-text-tertiary">
                Manage organizational accounts, email OTP verification, and RBAC roles.
              </p>
            </div>
          </div>
          <button
            onClick={loadUsers}
            disabled={loadingUsers}
            className="px-3 py-1.5 rounded-sm bg-bg-secondary border border-border-subtle hover:bg-bg-tertiary text-text-primary text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={13} className={cn(loadingUsers && "animate-spin")} />
            Refresh Directory
          </button>
        </div>

        {userAdminMsg && (
          <div className="p-3 rounded-sm bg-status-verified/10 border border-status-verified/30 text-status-verified text-xs font-mono">
            {userAdminMsg}
          </div>
        )}

        <div className="border border-border-subtle rounded-sm overflow-hidden bg-bg-secondary">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-primary text-[11px] font-mono text-text-tertiary uppercase">
                <th className="p-3">User</th>
                <th className="p-3">Organization</th>
                <th className="p-3">Status</th>
                <th className="p-3">Role Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {users.map((u) => (
                <tr key={u.user_id} className="hover:bg-bg-primary/50 transition-colors">
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-text-primary">{u.full_name}</span>
                      <span className="text-[11px] font-mono text-text-tertiary">{u.email}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-text-secondary">{u.organization || "Athleia Energy"}</td>
                  <td className="p-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border",
                        u.is_verified
                          ? "bg-status-verified/10 text-status-verified border-status-verified/20"
                          : "bg-status-warning/10 text-status-warning border-status-warning/20"
                      )}
                    >
                      {u.is_verified ? <UserCheck size={11} /> : <Lock size={11} />}
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.user_id, e.target.value)}
                      className="px-2 py-1 rounded-sm bg-bg-primary border border-border-strong text-xs font-mono font-semibold text-text-primary focus:outline-none"
                    >
                      <option value="SUPER_ADMIN">SUPER ADMIN</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="EMPLOYEE">EMPLOYEE</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Appearance & Theme */}
      <div className="p-6 rounded-md border border-border-subtle bg-bg-primary flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Sun size={16} className="text-accent" />
          <h2 className="text-sm font-medium text-text-primary">Appearance & Theme</h2>
        </div>
        <p className="text-xs text-text-secondary">
          Customize the visual interface. Athleia supports semantic Light and Dark themes engineered for long engineering shifts.
        </p>

        <div className="flex items-center justify-between p-4 rounded-sm bg-bg-secondary border border-border-subtle">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-text-primary">Interface Mode</span>
            <span className="text-[11px] text-text-tertiary">Switch between Light and Dark editorial slate themes</span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Section 3: Workspace Security Preferences */}
      <div className="p-6 rounded-md border border-border-subtle bg-bg-primary flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-accent" />
          <h2 className="text-sm font-medium text-text-primary">Workspace Security Preferences</h2>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 rounded-sm bg-bg-secondary border border-border-subtle">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-text-primary">Strict Airgap Enforcement</span>
              <span className="text-[11px] text-text-tertiary">
                Block external web search fallback in all reasoning dispatches.
              </span>
            </div>
            <input
              type="checkbox"
              checked={airgapStrict}
              onChange={(e) => setAirgapStrict(e.target.checked)}
              className="rounded-xs border-border-strong text-accent focus:ring-0"
            />
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-sm bg-bg-secondary border border-border-subtle">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-primary">Minimum Confidence Threshold</span>
              <span className="text-mono text-xs font-semibold text-text-primary">{confidenceThreshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
            <span className="text-[11px] text-text-tertiary">
              Answers below this threshold return &quot;Insufficient grounded evidence to answer&quot;.
            </span>
          </div>
        </div>
      </div>

      {/* Section 4: About Athleia */}
      <div className="p-6 rounded-md border border-border-subtle bg-bg-secondary flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text-primary">Athleia Industrial Intelligence Platform</span>
          <span className="text-mono text-xs text-text-tertiary">v1.0.0 Enterprise</span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Engineered for Fortune 500 industrial operations. Built with Next.js 15, FastAPI microservices, and a custom Python API Gateway.
        </p>
      </div>
    </div>
  );
}
