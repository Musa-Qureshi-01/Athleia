"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, ShieldCheck, Trash2, Lock, Unlock, UserCog,
  RefreshCw, Crown, BriefcaseBusiness, UserRound, CheckCircle2,
  XCircle, AlertTriangle, Send, ChevronDown, Search, Ban,
  ShieldAlert, Megaphone, Eye, Upload, Cpu, Wrench,
  ClipboardList, BarChart3, Settings2,
} from "lucide-react";
import { fetchUserList, updateUserRole, updateUserStatus, deleteUser, publishNotification } from "@/lib/api";

type Role = "SUPER_ADMIN" | "MANAGER" | "EMPLOYEE";
type Status = "PENDING_VERIFICATION" | "ACTIVE" | "LOCKED" | "DISABLED";

interface OrgUser {
  user_id: string;
  email: string;
  full_name: string;
  organization: string;
  role: Role;
  status: Status;
  is_verified: boolean;
  created_at: string;
  last_login_at?: string;
  permissions: string[];
}

type AdminTab = "users" | "broadcast" | "roles";

const ROLE_META: Record<Role, { label: string; color: string; bg: string; Icon: React.ElementType; description: string }> = {
  SUPER_ADMIN: { label: "Super Admin", color: "#a78bfa", bg: "rgba(167,139,250,0.12)", Icon: Crown,            description: "Full platform control. Manages all users, documents, and organization settings." },
  MANAGER:     { label: "Manager",     color: "#38bdf8", bg: "rgba(56,189,248,0.10)",  Icon: BriefcaseBusiness, description: "Can view reports, analytics, upload documents, trigger compliance/maintenance agents." },
  EMPLOYEE:    { label: "Employee",    color: "#4ade80", bg: "rgba(74,222,128,0.10)",  Icon: UserRound,         description: "Read-only access: knowledge search, AI reasoning, documents, and notifications." },
};

const STATUS_META: Record<Status, { label: string; color: string; Icon: React.ElementType }> = {
  ACTIVE:               { label: "Active",      color: "#4ade80", Icon: CheckCircle2 },
  PENDING_VERIFICATION: { label: "Pending OTP", color: "#facc15", Icon: AlertTriangle },
  LOCKED:               { label: "Frozen",      color: "#f97316", Icon: Lock },
  DISABLED:             { label: "Banned",      color: "#ef4444", Icon: Ban },
};

const PERMISSIONS = [
  { label: "Search Knowledge",            Icon: Search,        employee: true,  manager: true,  admin: true  },
  { label: "AI Reasoning",                Icon: Cpu,           employee: true,  manager: true,  admin: true  },
  { label: "View Documents",              Icon: Eye,           employee: true,  manager: true,  admin: true  },
  { label: "View Maintenance Findings",   Icon: Wrench,        employee: true,  manager: true,  admin: true  },
  { label: "View Compliance Findings",    Icon: ShieldCheck,   employee: true,  manager: true,  admin: true  },
  { label: "Receive Notifications",       Icon: ShieldAlert,   employee: true,  manager: true,  admin: true  },
  { label: "View Reports",                Icon: BarChart3,     employee: false, manager: true,  admin: true  },
  { label: "Team Analytics",              Icon: Users,         employee: false, manager: true,  admin: true  },
  { label: "Upload Documents",            Icon: Upload,        employee: false, manager: false, admin: true  },
  { label: "Trigger Compliance Scan",     Icon: ShieldAlert,   employee: false, manager: false, admin: true  },
  { label: "Trigger Maintenance Agent",   Icon: Wrench,        employee: false, manager: false, admin: true  },
  { label: "Manage Users",                Icon: UserCog,       employee: false, manager: false, admin: true  },
  { label: "Assign Roles",                Icon: ClipboardList, employee: false, manager: false, admin: true  },
  { label: "Delete Documents",            Icon: Trash2,        employee: false, manager: false, admin: true  },
  { label: "Configure Organization",      Icon: Settings2,     employee: false, manager: false, admin: true  },
  { label: "View System Metrics",         Icon: BarChart3,     employee: false, manager: false, admin: true  },
];

function getToken() { return typeof window !== "undefined" ? localStorage.getItem("athleia_token") || "" : ""; }
function getMyUserId() {
  if (typeof window === "undefined") return "";
  try { return JSON.parse(localStorage.getItem("athleia_user") || "{}").user_id || ""; } catch { return ""; }
}

function Pill({ allowed }: { allowed: boolean }) {
  return allowed
    ? <CheckCircle2 size={14} className="mx-auto" style={{ color: "#4ade80" }} />
    : <XCircle    size={14} className="mx-auto" style={{ color: "rgba(255,255,255,0.10)" }} />;
}

function ActionBtn({ Icon, label, color, busy, onClick, danger = false }: { Icon: React.ElementType; label: string; color: string; busy: boolean; onClick: () => void; danger?: boolean }) {
  return (
    <button title={label} disabled={busy} onClick={onClick}
      className="h-7 w-7 rounded-sm flex items-center justify-center transition-all disabled:opacity-40 hover:scale-110"
      style={{ background: `${color}18`, border: `1px solid ${color}35`, color }}>
      {busy ? <RefreshCw size={11} className="animate-spin" /> : <Icon size={12} />}
    </button>
  );
}

export default function AdminPage() {
  const [tab, setTab]               = useState<AdminTab>("users");
  const [users, setUsers]           = useState<OrgUser[]>([]);
  const [loading, setLoading]       = useState(true);
  const [searchQ, setSearchQ]       = useState("");
  const [busy, setBusy]             = useState<string | null>(null);
  const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null);

  const [bTitle, setBTitle]         = useState("");
  const [bMsg, setBMsg]             = useState("");
  const [bType, setBType]           = useState<"INFO"|"WARNING"|"ERROR"|"SUCCESS">("INFO");
  const [bPrio, setBPrio]           = useState<"NORMAL"|"HIGH"|"URGENT">("NORMAL");
  const [bSending, setBSending]     = useState(false);

  const flash = (msg: string, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3500); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await fetchUserList(getToken()); setUsers((r.users as unknown as OrgUser[]) ?? []); }
    catch { flash("Failed to load users", false); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const changeRole = async (uid: string, role: string) => {
    if (uid === getMyUserId()) { flash("Cannot change own role", false); return; }
    setBusy(`r-${uid}`);
    try { await updateUserRole(uid, role, getToken()); setUsers(p => p.map(u => u.user_id === uid ? { ...u, role: role as Role } : u)); flash("Role updated"); }
    catch (e) { flash(e instanceof Error ? e.message : "Failed", false); }
    finally { setBusy(null); }
  };

  const changeStatus = async (uid: string, s: Status) => {
    if (uid === getMyUserId()) { flash("Cannot change own status", false); return; }
    setBusy(`s-${uid}`);
    try { await updateUserStatus(uid, s, getToken()); setUsers(p => p.map(u => u.user_id === uid ? { ...u, status: s } : u)); flash(`Status ? ${s}`); }
    catch (e) { flash(e instanceof Error ? e.message : "Failed", false); }
    finally { setBusy(null); }
  };

  const remove = async (uid: string, email: string) => {
    if (uid === getMyUserId()) { flash("Cannot delete own account", false); return; }
    if (!confirm(`Permanently delete ${email}?`)) return;
    setBusy(`d-${uid}`);
    try { await deleteUser(uid, getToken()); setUsers(p => p.filter(u => u.user_id !== uid)); flash(`${email} deleted`); }
    catch (e) { flash(e instanceof Error ? e.message : "Failed", false); }
    finally { setBusy(null); }
  };

  const broadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setBSending(true);
    try {
      await publishNotification({ title: bTitle.trim(), message: bMsg.trim(), type: bType, priority: bPrio, source_service: "admin-broadcast", recipient: "all", metadata: { broadcast: true } });
      flash("Broadcast sent to all users ?");
      setBTitle(""); setBMsg("");
    } catch (e) { flash(e instanceof Error ? e.message : "Failed", false); }
    finally { setBSending(false); }
  };

  const filtered = users.filter(u => u.email.toLowerCase().includes(searchQ.toLowerCase()) || u.full_name.toLowerCase().includes(searchQ.toLowerCase()));
  const stats = { total: users.length, active: users.filter(u => u.status === "ACTIVE").length, pending: users.filter(u => u.status === "PENDING_VERIFICATION").length, restricted: users.filter(u => u.status === "LOCKED" || u.status === "DISABLED").length };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: "var(--bg-secondary)" }}>

      {/* Page Header */}
      <div className="px-8 py-5 border-b border-border-subtle shrink-0 flex items-center justify-between" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2.5">
            <Crown size={18} style={{ color: "#a78bfa" }} />
            <h1 className="text-text-primary font-bold text-lg">Organizational Control Center</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm font-bold" style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)" }}>SUPER ADMIN</span>
          </div>
          <p className="text-xs font-mono text-text-tertiary">Identity management - Role assignment - Organization-wide broadcasts</p>
        </div>
        <button onClick={load} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono text-text-secondary border border-border-strong hover:text-text-primary hover:bg-bg-tertiary transition-colors">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="px-8 py-3 border-b border-border-subtle flex items-center gap-8 shrink-0" style={{ backgroundColor: "var(--bg-primary)" }}>
        {[
          { l: "Total Users",     v: stats.total,      c: "var(--text-primary)" },
          { l: "Active",          v: stats.active,     c: "#4ade80" },
          { l: "Pending Verify",  v: stats.pending,    c: "#facc15" },
          { l: "Restricted",      v: stats.restricted, c: "#f87171" },
        ].map(s => (
          <div key={s.l} className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono" style={{ color: s.c }}>{s.v}</span>
            <span className="text-xs text-text-tertiary">{s.l}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-8 border-b border-border-subtle flex shrink-0" style={{ backgroundColor: "var(--bg-primary)" }}>
        {([
          { id: "users",     label: "User Directory",   Icon: Users },
          { id: "broadcast", label: "Broadcast",        Icon: Megaphone },
          { id: "roles",     label: "Role Permissions", Icon: ShieldCheck },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-mono font-bold border-b-2 transition-colors ${tab === t.id ? "border-accent text-text-primary" : "border-transparent text-text-tertiary hover:text-text-secondary"}`}>
            <t.Icon size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* -- USERS TAB -------------------------------------------------- */}
          {tab === "users" && (
            <motion.div key="users" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="p-8 flex flex-col gap-4">
              <div className="relative max-w-xs">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search name or email…"
                  className="w-full h-9 pl-8 pr-3 rounded-sm text-sm bg-bg-primary border border-border-strong text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent transition-colors" />
              </div>

              <div className="rounded-md border border-border-subtle overflow-hidden">
                {/* Table head */}
                <div className="grid text-[10px] font-mono uppercase text-text-tertiary tracking-wider border-b border-border-subtle px-5 py-2.5"
                  style={{ gridTemplateColumns: "2fr 1.3fr 1.1fr 1fr 1.6fr", backgroundColor: "var(--bg-tertiary)" }}>
                  <span>User</span><span>Role</span><span>Status</span><span>Joined</span><span className="text-right">Actions</span>
                </div>

                {loading ? (
                  <div className="py-16 text-center text-text-tertiary text-sm font-mono">Loading directory…</div>
                ) : filtered.length === 0 ? (
                  <div className="py-16 text-center text-text-tertiary text-sm font-mono">No users found</div>
                ) : filtered.map((user, i) => {
                  const rm = ROLE_META[user.role];
                  const sm = STATUS_META[user.status] ?? STATUS_META["ACTIVE"];
                  const isSelf = user.user_id === getMyUserId();
                  const isActive = user.status === "ACTIVE";
                  const isRestricted = user.status === "LOCKED" || user.status === "DISABLED";

                  return (
                    <div key={user.user_id} className="grid items-center px-5 py-3.5 hover:bg-bg-tertiary/40 transition-colors"
                      style={{ gridTemplateColumns: "2fr 1.3fr 1.1fr 1fr 1.6fr", borderBottom: "1px solid var(--border-subtle)", backgroundColor: i % 2 !== 0 ? "rgba(0,0,0,0.06)" : undefined }}>

                      {/* User */}
                      <div className="flex flex-col gap-0.5 min-w-0 pr-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-text-primary truncate">{user.full_name}</span>
                          {isSelf && <span className="text-[9px] font-mono px-1 rounded bg-accent/10 text-accent border border-accent/20 shrink-0">YOU</span>}
                        </div>
                        <span className="text-[11px] font-mono text-text-tertiary truncate">{user.email}</span>
                      </div>

                      {/* Role */}
                      <div>
                        <div className="relative inline-flex items-center">
                          <select value={user.role} disabled={isSelf || busy === `r-${user.user_id}`}
                            onChange={e => changeRole(user.user_id, e.target.value)}
                            className="appearance-none h-7 pl-2 pr-6 rounded-sm text-[11px] font-mono font-bold cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: rm.bg, color: rm.color, border: `1px solid ${rm.color}35` }}>
                            <option value="EMPLOYEE">Employee</option>
                            <option value="MANAGER">Manager</option>
                            <option value="SUPER_ADMIN">Super Admin</option>
                          </select>
                          <ChevronDown size={11} className="absolute right-1.5 pointer-events-none" style={{ color: rm.color }} />
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-sm"
                          style={{ color: sm.color, background: `${sm.color}15`, border: `1px solid ${sm.color}30` }}>
                          <sm.Icon size={10} />{sm.label}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="text-[11px] font-mono text-text-tertiary">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) : "—"}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 justify-end">
                        {isActive && !isSelf && (
                          <ActionBtn Icon={Lock}   label="Freeze" color="#f97316" busy={busy === `s-${user.user_id}`} onClick={() => changeStatus(user.user_id, "LOCKED")} />
                        )}
                        {isRestricted && !isSelf && (
                          <ActionBtn Icon={Unlock} label="Activate" color="#4ade80" busy={busy === `s-${user.user_id}`} onClick={() => changeStatus(user.user_id, "ACTIVE")} />
                        )}
                        {user.status !== "DISABLED" && !isSelf && (
                          <ActionBtn Icon={Ban}    label="Ban" color="#f87171" busy={busy === `s-${user.user_id}`} onClick={() => changeStatus(user.user_id, "DISABLED")} />
                        )}
                        {!isSelf && (
                          <ActionBtn Icon={Trash2} label="Delete permanently" color="#ef4444" busy={busy === `d-${user.user_id}`} onClick={() => remove(user.user_id, user.email)} danger />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* -- BROADCAST TAB ----------------------------------------------- */}
          {tab === "broadcast" && (
            <motion.div key="broadcast" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="p-8 max-w-2xl">
              <div className="rounded-md border border-border-subtle overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
                <div className="px-6 py-4 border-b border-border-subtle flex items-center gap-3" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                  <Megaphone size={18} style={{ color: "#f97316" }} />
                  <div>
                    <div className="text-sm font-bold text-text-primary">Organization-Wide Broadcast</div>
                    <div className="text-[11px] font-mono text-text-tertiary">Notification pushed to every user&apos;s panel instantly</div>
                  </div>
                </div>

                <form onSubmit={broadcast} className="p-6 flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider">Title</label>
                    <input type="text" required value={bTitle} onChange={e => setBTitle(e.target.value)} placeholder="e.g. Planned maintenance window tonight"
                      className="h-10 px-3 rounded-sm text-sm bg-bg-secondary border border-border-strong text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider">Message</label>
                    <textarea required rows={4} value={bMsg} onChange={e => setBMsg(e.target.value)} placeholder="Write your platform-wide announcement here…"
                      className="px-3 py-2.5 rounded-sm text-sm bg-bg-secondary border border-border-strong text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed" />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider">Type</label>
                      <select value={bType} onChange={e => setBType(e.target.value as typeof bType)}
                        className="h-9 px-2 rounded-sm text-sm bg-bg-secondary border border-border-strong text-text-primary focus:outline-none focus:border-accent">
                        <option value="INFO">INFO</option>
                        <option value="WARNING">WARNING</option>
                        <option value="ERROR">ERROR / CRITICAL</option>
                        <option value="SUCCESS">SUCCESS</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider">Priority</label>
                      <select value={bPrio} onChange={e => setBPrio(e.target.value as typeof bPrio)}
                        className="h-9 px-2 rounded-sm text-sm bg-bg-secondary border border-border-strong text-text-primary focus:outline-none focus:border-accent">
                        <option value="NORMAL">Normal</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                  </div>

                  {/* Live preview */}
                  <div className="p-4 rounded-md border border-border-subtle flex items-start gap-3" style={{ backgroundColor: "var(--bg-secondary)" }}>
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <span className="text-xs font-bold text-text-primary">{bTitle || "Notification title preview"}</span>
                      <span className="text-xs text-text-tertiary leading-relaxed">{bMsg || "Your message will appear here…"}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
                        background: bType === "WARNING" ? "rgba(234,179,8,0.15)" : bType === "ERROR" ? "rgba(239,68,68,0.15)" : bType === "SUCCESS" ? "rgba(74,222,128,0.15)" : "rgba(56,189,248,0.15)",
                        color:      bType === "WARNING" ? "#facc15" : bType === "ERROR" ? "#f87171" : bType === "SUCCESS" ? "#4ade80" : "#38bdf8",
                      }}>{bType}</span>
                      <span className="text-[9px] font-mono text-text-tertiary">? all users</span>
                    </div>
                  </div>

                  <button type="submit" disabled={bSending || !bTitle.trim() || !bMsg.trim()}
                    className="h-10 rounded-sm font-bold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-40"
                    style={{ backgroundColor: "#f97316", color: "#fff" }}>
                    <Send size={15} />
                    {bSending ? "Broadcasting…" : "Send to All Users ?"}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* -- ROLES TAB --------------------------------------------------- */}
          {tab === "roles" && (
            <motion.div key="roles" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="p-8 flex flex-col gap-6">
              {/* Role summary cards */}
              <div className="grid grid-cols-3 gap-4">
                {(["EMPLOYEE", "MANAGER", "SUPER_ADMIN"] as Role[]).map(role => {
                  const m = ROLE_META[role];
                  const count = users.filter(u => u.role === role).length;
                  return (
                    <div key={role} className="rounded-md border p-5 flex flex-col gap-3" style={{ borderColor: `${m.color}30`, backgroundColor: m.bg }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: `${m.color}20`, border: `1px solid ${m.color}35` }}>
                          <m.Icon size={17} style={{ color: m.color }} />
                        </div>
                        <div>
                          <div className="text-sm font-bold" style={{ color: m.color }}>{m.label}</div>
                          <div className="text-[10px] font-mono text-text-tertiary">{count} member{count !== 1 ? "s" : ""}</div>
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">{m.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Permissions matrix */}
              <div className="rounded-md border border-border-subtle overflow-hidden">
                <div className="grid border-b border-border-subtle" style={{ gridTemplateColumns: "2.2fr 1fr 1fr 1fr", backgroundColor: "var(--bg-tertiary)" }}>
                  <div className="px-5 py-3 text-[10px] font-mono uppercase text-text-tertiary tracking-wider">Capability</div>
                  {(["EMPLOYEE", "MANAGER", "SUPER_ADMIN"] as Role[]).map(role => (
                    <div key={role} className="py-3 text-center text-[11px] font-mono font-bold" style={{ color: ROLE_META[role].color }}>
                      {ROLE_META[role].label}
                    </div>
                  ))}
                </div>
                {PERMISSIONS.map((p, i) => (
                  <div key={p.label} className="grid items-center" style={{ gridTemplateColumns: "2.2fr 1fr 1fr 1fr", borderBottom: "1px solid var(--border-subtle)", backgroundColor: i % 2 === 0 ? "var(--bg-primary)" : "var(--bg-secondary)" }}>
                    <div className="px-5 py-3 flex items-center gap-2.5 text-xs text-text-secondary">
                      <p.Icon size={13} className="text-text-tertiary shrink-0" />{p.label}
                    </div>
                    <div className="py-3 text-center"><Pill allowed={p.employee} /></div>
                    <div className="py-3 text-center"><Pill allowed={p.manager} /></div>
                    <div className="py-3 text-center"><Pill allowed={p.admin} /></div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 right-6 flex items-center gap-2.5 px-4 py-3 rounded-md shadow-2xl text-sm font-semibold z-50 border"
            style={{ backgroundColor: "var(--bg-primary)", borderColor: toast.ok ? "rgba(74,222,128,0.3)" : "rgba(239,68,68,0.3)", color: toast.ok ? "#4ade80" : "#f87171" }}>
            {toast.ok ? <CheckCircle2 size={15} /> : <XCircle size={15} />}{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
