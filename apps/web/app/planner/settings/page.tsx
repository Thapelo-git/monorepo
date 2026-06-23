"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Sidebar from "@/components/layout/Sidebar";

const toggleCls = "w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B2B4B]";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
      <div className={toggleCls} />
    </label>
  );
}

export default function PlannerSettings() {
  const [user,     setUser]     = useState<any>(null);
  const [mounted,  setMounted]  = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications:   true,
    dueDateAlerts:        true,
    budgetAlerts:         true,
    chatNotifications:    true,
    invoiceNotifications: true,
  });

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    const saved = localStorage.getItem("plannerSettings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  function handleSettingChange(key: string, value: boolean) {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem("plannerSettings", JSON.stringify(updated));
  }

  if (!user || !mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="flex min-h-screen bg-[#f7f3ee] dark:bg-[#0d1117]">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="h-14 bg-white dark:bg-[#161b22] border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937] dark:text-white">Settings</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Manage your preferences and account</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">🔔</button>
            <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
              {user.name?.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="p-6 max-w-2xl space-y-6">
          {/* Account Information */}
          <section className="bg-white dark:bg-[#161b22] rounded-xl p-6 border border-gray-100 dark:border-gray-800">
            <h2 className="font-serif text-xl text-gray-900 dark:text-white mb-4">Account Information</h2>
            <div className="space-y-4">
              {[
                { label: "Name",  value: user.name,          type: "text"  },
                { label: "Email", value: user.email,         type: "email" },
                { label: "Role",  value: "Wedding Planner",  type: "text"  },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{f.label}</label>
                  <input
                    type={f.type}
                    value={f.value}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Appearance */}
          <section className="bg-white dark:bg-[#161b22] rounded-xl p-6 border border-gray-100 dark:border-gray-800">
            <h2 className="font-serif text-xl text-gray-900 dark:text-white mb-1">Appearance</h2>
            <p className="text-sm text-gray-400 mb-5">Choose how WeddingFlow looks on your device</p>

            {/* Theme cards */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Light", value: "light", preview: "bg-[#f7f3ee]", card: "bg-white border-gray-200" },
                { label: "Dark",  value: "dark",  preview: "bg-[#0d1117]", card: "bg-[#161b22] border-[#30363d]" },
              ].map(t => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`rounded-xl p-3 border-2 transition-all text-left ${
                    theme === t.value
                      ? "border-[#1B2B4B] dark:border-blue-400 shadow-md"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {/* Preview mockup */}
                  <div className={`${t.preview} rounded-lg h-14 mb-2 flex flex-col gap-1 p-2 overflow-hidden`}>
                    <div className={`h-2 w-10 rounded ${t.card} border`} />
                    <div className={`h-2 w-16 rounded ${t.card} border`} />
                    <div className={`h-2 w-8 rounded ${t.card} border`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold ${theme === t.value ? "text-[#1B2B4B] dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                      {t.label}
                    </p>
                    {theme === t.value && (
                      <span className="text-xs text-[#1B2B4B] dark:text-blue-400 font-semibold">✓ Active</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Toggle row */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark</p>
              </div>
              <Toggle checked={isDark} onChange={on => setTheme(on ? "dark" : "light")} />
            </div>
          </section>

          {/* Notification Settings */}
          <section className="bg-white dark:bg-[#161b22] rounded-xl p-6 border border-gray-100 dark:border-gray-800">
            <h2 className="font-serif text-xl text-gray-900 dark:text-white mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { key: "emailNotifications",   label: "Email Notifications",   desc: "Receive emails about wedding updates" },
                { key: "dueDateAlerts",        label: "Due Date Alerts",        desc: "Get notified when tasks are due" },
                { key: "budgetAlerts",         label: "Budget Alerts",          desc: "Alerts when budget thresholds are exceeded" },
                { key: "chatNotifications",    label: "Chat Notifications",     desc: "Receive messages from couples and vendors" },
                { key: "invoiceNotifications", label: "Invoice Notifications",  desc: "Alerts when vendors submit invoices" },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{n.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{n.desc}</p>
                  </div>
                  <Toggle
                    checked={settings[n.key as keyof typeof settings]}
                    onChange={v => handleSettingChange(n.key, v)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Security */}
          <section className="bg-white dark:bg-[#161b22] rounded-xl p-6 border border-gray-100 dark:border-gray-800">
            <h2 className="font-serif text-xl text-gray-900 dark:text-white mb-4">Security</h2>
            <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-3">
              Change Password
            </button>
            <button className="w-full px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              Delete Account
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
