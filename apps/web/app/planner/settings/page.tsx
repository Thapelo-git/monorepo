"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function PlannerSettings() {
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    dueDateAlerts: true,
    budgetAlerts: true,
    chatNotifications: true,
    invoiceNotifications: true,
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
    localStorage.setItem("plannerSettings", JSON.stringify(settings));
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Settings</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Manage your preferences and account</p>
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
          {/* Account Information */}
          <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100">
            <h2 className="font-serif text-xl text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value="Wedding Planner"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100">
            <h2 className="font-serif text-xl text-gray-900 mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive emails about wedding updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B2B4B]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Due Date Alerts</p>
                  <p className="text-sm text-gray-500">Get notified when tasks are due</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.dueDateAlerts}
                    onChange={(e) => handleSettingChange("dueDateAlerts", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B2B4B]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Budget Alerts</p>
                  <p className="text-sm text-gray-500">Alerts when budget thresholds are exceeded</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.budgetAlerts}
                    onChange={(e) => handleSettingChange("budgetAlerts", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B2B4B]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Chat Notifications</p>
                  <p className="text-sm text-gray-500">Receive messages from couples and vendors</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.chatNotifications}
                    onChange={(e) => handleSettingChange("chatNotifications", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B2B4B]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Invoice Notifications</p>
                  <p className="text-sm text-gray-500">Alerts when vendors submit invoices</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.invoiceNotifications}
                    onChange={(e) => handleSettingChange("invoiceNotifications", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B2B4B]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="font-serif text-xl text-gray-900 mb-4">Security</h2>
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors mb-3">
              Change Password
            </button>
            <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
