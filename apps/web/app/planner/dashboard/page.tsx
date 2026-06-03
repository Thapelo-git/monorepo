"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function PlannerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [weddings, setWeddings] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    // Mock data - will be replaced with API call
    setWeddings([
      {
        id: "1",
        name: "John & Sarah Wedding",
        date: "2026-06-15",
        venue: "Garden Palace, Sandton",
        budget: 250000,
        spent: 43000,
        status: "planning",
        couples: 2,
        vendors: 3,
      },
      {
        id: "2",
        name: "Mike & Anna Wedding",
        date: "2026-07-20",
        venue: "Vineyard Estate, Stellenbosch",
        budget: 180000,
        spent: 12000,
        status: "planning",
        couples: 2,
        vendors: 1,
      },
    ]);
  }, []);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />
      
      <main className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Dashboard</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">🔔</button>
            <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
              {user.name?.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl text-[#1f2937] mb-1">Your Weddings</h2>
              <p className="text-sm text-gray-500">Manage all your wedding projects</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-lg font-medium hover:shadow-lg transition-all">
              + New Wedding
            </button>
          </div>

          {/* Weddings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weddings.map((wedding) => (
              <div
                key={wedding.id}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-lg text-[#1f2937] mb-1">{wedding.name}</h3>
                    <p className="text-xs text-gray-500">{wedding.date}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    {wedding.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{wedding.venue}</p>

                {/* Budget Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-600">Budget</span>
                    <span className="text-xs font-semibold text-[#1B2B4B]">
                      R{wedding.spent.toLocaleString()} / R{wedding.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] h-2 rounded-full"
                      style={{ width: `${(wedding.spent / wedding.budget) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-semibold text-[#1B2B4B]">{wedding.couples}</div>
                    <div className="text-xs text-gray-500">Couples</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-semibold text-[#1B2B4B]">{wedding.vendors}</div>
                    <div className="text-xs text-gray-500">Vendors</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-sm text-gray-600 mb-2">Active Couples</p>
              <p className="text-3xl font-semibold text-[#1B2B4B]">{weddings.length * 2}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="text-2xl mb-2">🤝</div>
              <p className="text-sm text-gray-600 mb-2">Total Vendors</p>
              <p className="text-3xl font-semibold text-[#1B2B4B]">{weddings.reduce((sum, w) => sum + w.vendors, 0)}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-sm text-gray-600 mb-2">Total Budget</p>
              <p className="text-3xl font-semibold text-[#1B2B4B]">
                R{(weddings.reduce((sum, w) => sum + w.budget, 0) / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
