"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { apiFetch } from "@/lib/api";

function notifIcon(type: string) {
  const icons: Record<string, string> = {
    task_due: "📌", task_update: "✏️", invoice: "📄",
    budget_alert: "💰", vendor_update: "💬", task_overdue: "⚠️",
  };
  return icons[type] ?? "🔔";
}

export default function CoupleNotifications() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { router.push("/auth/login"); return; }
    setUser(JSON.parse(userData));

    apiFetch("/notifications")
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    apiFetch(`/notifications/${id}/read`, { method: "PATCH" }).catch(() => {});
  }

  if (!user) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />
      <main className="ml-64 flex-1">
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Notifications</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Stay updated on your wedding planning</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
            {user.name?.slice(0, 2).toUpperCase()}
          </div>
        </div>

        <div className="p-6 max-w-2xl">
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mb-4">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 border border-gray-100 animate-pulse h-20" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
              <p className="text-gray-400">No notifications yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif: any) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`rounded-lg p-4 cursor-pointer transition-all border ${
                    notif.read
                      ? "bg-white border-gray-100 hover:shadow-md"
                      : "bg-blue-50 border-blue-200 hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl flex-shrink-0">{notifIcon(notif.type)}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="w-3 h-3 rounded-full bg-[#00AEAE] flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
