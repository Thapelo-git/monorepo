"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function PlannerNotifications() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    setNotifications([
      {
        id: "1",
        type: "task_overdue",
        title: "Task Overdue",
        message: "Photographer brief is overdue for John & Sarah's wedding",
        timestamp: "2026-05-13 09:30",
        read: false,
        wedding: "John & Sarah Wedding",
      },
      {
        id: "2",
        type: "invoice",
        title: "New Invoice",
        message: "Capture Moments Photography submitted an invoice for R18,000",
        timestamp: "2026-05-12 14:20",
        read: false,
        wedding: "John & Sarah Wedding",
      },
      {
        id: "3",
        type: "budget_alert",
        title: "Budget Alert",
        message: "John & Sarah's wedding is over 90% budget spent",
        timestamp: "2026-05-10 11:45",
        read: false,
        wedding: "John & Sarah Wedding",
      },
      {
        id: "4",
        type: "vendor_update",
        title: "Vendor Message",
        message: "Luxe Catering Co. sent a message about final menu",
        timestamp: "2026-05-08 16:00",
        read: true,
        wedding: "John & Sarah Wedding",
      },
    ]);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task_overdue":
        return "⚠️";
      case "invoice":
        return "📄";
      case "budget_alert":
        return "💰";
      case "vendor_update":
        return "💬";
      default:
        return "🔔";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  if (!user) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Notifications</h1>
            <p className="text-xs text-gray-400 -mt-0.5">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">🔔</button>
            <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
              {user.name?.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-3xl">
          <div className="space-y-3">
            {notifications.map((notif) => (
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
                  <span className="text-2xl flex-shrink-0">{getNotificationIcon(notif.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                        {notif.wedding}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                    <p className="text-xs text-gray-400">{notif.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {!notif.read && (
                      <div className="w-3 h-3 rounded-full bg-[#00AEAE]" />
                    )}
                    <button className="px-3 py-1 text-xs bg-[#1B2B4B] text-white rounded-lg hover:bg-[#0f1a2e] transition-colors">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
