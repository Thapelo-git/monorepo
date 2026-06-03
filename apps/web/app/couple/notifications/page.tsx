"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function CoupleNotifications() {
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
        type: "task_due",
        title: "Task Due Tomorrow",
        message: "Catering menu finalisation is due tomorrow",
        timestamp: "2026-05-13 09:30",
        read: false,
      },
      {
        id: "2",
        type: "invoice",
        title: "New Invoice",
        message: "Capture Moments Photography submitted an invoice for R18,000",
        timestamp: "2026-05-12 14:20",
        read: false,
      },
      {
        id: "3",
        type: "budget_alert",
        title: "Budget Update",
        message: "R43,000 has been spent from your R250,000 budget",
        timestamp: "2026-05-10 11:45",
        read: true,
      },
      {
        id: "4",
        type: "task_update",
        title: "Task Updated",
        message: "Planner updated: Send invitations",
        timestamp: "2026-05-08 16:00",
        read: true,
      },
    ]);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task_due":
        return "📌";
      case "invoice":
        return "📄";
      case "budget_alert":
        return "💰";
      case "task_update":
        return "✏️";
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

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Notifications</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Stay updated on your wedding planning</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">🔔</button>
            <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
              {user.name?.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-2xl">
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
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{notif.timestamp}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-3 h-3 rounded-full bg-[#00AEAE] flex-shrink-0 mt-1.5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
