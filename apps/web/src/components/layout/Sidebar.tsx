"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Heart,
  Handshake,
  MessageSquare,
  Bell,
  Settings,
  ClipboardList,
  Wallet,
  Receipt,
  LogOut,
  Gem
} from "lucide-react";

const API = "http://localhost:3001/api";

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export default function Sidebar() {
  const router   = useRouter();
  const pathname = usePathname();
  const [user,        setUser]        = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  function fetchUnread() {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    fetch(`${API}/notifications`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then((ns: any[]) => setUnreadCount(ns.filter(n => !n.read).length))
      .catch(() => {});
  }

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    fetchUnread();
    // Re-fetch unread count when window gains focus (after visiting notifications page)
    window.addEventListener("focus", fetchUnread);
    return () => window.removeEventListener("focus", fetchUnread);
  }, []);

  // Re-fetch whenever route changes (e.g. coming back from notifications)
  useEffect(() => { fetchUnread(); }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  const plannerLinks: NavLink[] = [
    { href: "/planner/dashboard",     label: "Dashboard",     icon: LayoutDashboard },
    { href: "/planner/weddings",      label: "Weddings",      icon: Heart },
    { href: "/planner/vendors",       label: "Vendors",       icon: Handshake },
    { href: "/planner/chat",          label: "Chat",          icon: MessageSquare },
    { href: "/planner/notifications", label: "Notifications", icon: Bell, badge: unreadCount },
    { href: "/planner/settings",      label: "Settings",      icon: Settings },
  ];

  const coupleLinks: NavLink[] = [
    { href: "/couple/board",          label: "Our Board",     icon: ClipboardList },
    { href: "/couple/budget",         label: "Budget",        icon: Wallet },
    { href: "/couple/vendors",        label: "Vendors",       icon: Handshake },
    { href: "/couple/chat",           label: "Chat",          icon: MessageSquare },
    { href: "/couple/notifications",  label: "Notifications", icon: Bell, badge: unreadCount },
    { href: "/couple/settings",       label: "Settings",      icon: Settings },
  ];

  const vendorLinks: NavLink[] = [
    { href: "/vendor/dashboard", label: "My Tasks",  icon: ClipboardList },
    { href: "/vendor/invoices",  label: "Invoices",  icon: Receipt },
    { href: "/vendor/settings",  label: "Settings",  icon: Settings },
  ];

  if (!user) return null;

  const links = user.role === "planner" ? plannerLinks : user.role === "couple" ? coupleLinks : vendorLinks;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-[#1B2B4B] to-[#0f1a2e] text-white flex flex-col z-40 border-r border-white/10">
      {/* Logo */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[rgba(184,151,106,0.25)] flex items-center justify-center text-[#B8976A]">
            <Gem className="w-5 h-5" />
          </div>
          <span className="font-serif text-xl font-semibold">WeddingFlow</span>
        </div>
      </div>

      {/* User Card */}
      <div className="mx-2 mb-4 p-3 rounded-lg bg-white/8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#00AEAE] flex items-center justify-center font-semibold text-sm flex-shrink-0">
          {user.name?.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{user.name}</div>
          <div className="text-xs opacity-70 capitalize">{user.role}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1 overflow-y-auto">
        {links.map(link => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm relative ${
                isActive
                  ? "bg-white/12 text-white font-semibold"
                  : "text-white/55 hover:bg-white/8 hover:text-white"
              }`}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              <span className="flex-1">{link.label}</span>
              {"badge" in link && typeof link.badge === "number" && link.badge > 0 && (
                <span className="text-xs bg-red-500 text-white min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full font-semibold tabular-nums">
                  {link.badge > 99 ? "99+" : link.badge}
                </span>
              )}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#00AEAE] rounded-l-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mx-2 mb-4 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-transparent text-white/40 hover:bg-white/8 hover:text-white/70 transition-all text-sm border-t border-white/10 pt-4"
      >
        <LogOut className="w-5 h-5 shrink-0" />
        <span>Sign out</span>
      </button>
    </aside>
  );
}
