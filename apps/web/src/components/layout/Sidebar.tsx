"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  const plannerLinks = [
    { href: "/planner/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/planner/weddings", label: "Weddings", icon: "💍" },
    { href: "/planner/vendors", label: "Vendors", icon: "🤝" },
    { href: "/planner/notifications", label: "Notifications", icon: "🔔", badge: unreadCount },
    { href: "/planner/settings", label: "Settings", icon: "⚙️" },
  ];

  const coupleLinks = [
    { href: "/couple/board", label: "Our Board", icon: "📋" },
    { href: "/couple/budget", label: "Budget", icon: "💰" },
    { href: "/couple/vendors", label: "Vendors", icon: "🤝" },
    { href: "/couple/chat", label: "Chat", icon: "💬" },
    { href: "/couple/notifications", label: "Notifications", icon: "🔔", badge: unreadCount },
    { href: "/couple/settings", label: "Settings", icon: "⚙️" },
  ];

  const vendorLinks = [
    { href: "/vendor/dashboard", label: "My Tasks", icon: "📋" },
    { href: "/vendor/invoices", label: "Invoices", icon: "📄" },
    { href: "/vendor/settings", label: "Settings", icon: "⚙️" },
  ];

  if (!user) return null;

  const links = user.role === "planner" ? plannerLinks : user.role === "couple" ? coupleLinks : vendorLinks;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-[#1B2B4B] to-[#0f1a2e] text-white flex flex-col z-40 border-r border-white/10">
      {/* Logo */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[rgba(184,151,106,0.25)] flex items-center justify-center text-lg">
            💍
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
        {links.map((link) => {
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
              <span className="text-lg">{link.icon}</span>
              <span className="flex-1">{link.label}</span>
              {link.badge && link.badge > 0 && (
                <span className="text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full font-semibold">
                  {link.badge}
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
        <span className="text-lg">🚪</span>
        <span>Sign out</span>
      </button>
    </aside>
  );
}
