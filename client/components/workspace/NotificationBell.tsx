"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, ShieldAlert, Wrench, FileText, Info, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
  NotificationItem,
} from "@/lib/api";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const loadData = async () => {
    try {
      const list = await fetchNotifications();
      setNotifications(list);
      const count = await fetchUnreadNotificationCount();
      setUnreadCount(count);
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    loadData();

    // Setup Real-Time WebSocket Listener
    const wsUrl = "ws://localhost:8009/ws/notifications?recipient=all";
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const item: NotificationItem = JSON.parse(event.data);
          if (item && item.notification_id) {
            setNotifications((prev) => [item, ...prev.filter((n) => n.notification_id !== item.notification_id)]);
            setUnreadCount((prev) => prev + 1);
          }
        } catch {
          // Non-json frame
        }
      };

      ws.onclose = () => setWsConnected(false);
      ws.onerror = () => setWsConnected(false);
    } catch {
      setWsConnected(false);
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleClearAll = async () => {
    if (!confirm("Delete all notifications permanently?")) return;
    await clearAllNotifications();
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="relative p-2 rounded-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-status-error text-white font-mono text-[10px] font-bold flex items-center justify-center border border-bg-primary">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-full top-0 ml-2.5 w-80 sm:w-96 bg-bg-primary border border-border-subtle rounded-md shadow-2xl z-[100] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-bg-secondary border-b border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-text-primary uppercase tracking-wider">
                Notifications
              </span>
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  wsConnected ? "bg-status-verified" : "bg-status-warning"
                )}
                title={wsConnected ? "WebSocket Real-Time Connected" : "Polling Mode"}
              />
            </div>

          <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1"
                >
                  <Check size={12} />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={handleClearAll}
                title="Delete all notifications"
                className="text-[11px] font-mono text-status-error hover:underline flex items-center gap-1"
              >
                <Trash2 size={11} />
                <span>Clear all</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-tertiary hover:text-text-primary p-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-border-subtle">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.notification_id}
                  className={cn(
                    "p-3.5 flex flex-col gap-1.5 transition-colors text-xs",
                    !n.is_read ? "bg-bg-tertiary/60" : "hover:bg-bg-secondary"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-text-primary leading-snug">
                      {n.title}
                    </span>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 text-[9px] font-mono rounded font-bold uppercase shrink-0 border",
                        n.type === "CRITICAL" || n.type === "ERROR"
                          ? "bg-status-error/10 text-status-error border-status-error/30"
                          : n.type === "WARNING"
                          ? "bg-status-warning/10 text-status-warning border-status-warning/30"
                          : "bg-accent-muted/20 text-accent border-accent/30"
                      )}
                    >
                      {n.type}
                    </span>
                  </div>

                  <p className="text-text-secondary text-[11px] leading-relaxed">{n.message}</p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-text-tertiary pt-1">
                    <span>{n.source_service}</span>
                    {!n.is_read && (
                      <button
                        onClick={() => handleMarkRead(n.notification_id)}
                        className="text-accent hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-text-tertiary">
                No notifications recorded yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
