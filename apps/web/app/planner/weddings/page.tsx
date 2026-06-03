"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function PlannerWeddings() {
  const [user, setUser] = useState<any>(null);
  const [weddings, setWeddings] = useState<any[]>([]);
  const [showNewWeddingForm, setShowNewWeddingForm] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

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
        tasks: 6,
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
        tasks: 3,
      },
      {
        id: "3",
        name: "David & Lisa Wedding",
        date: "2026-12-10",
        venue: "Drakensberg Mountain Resort",
        budget: 320000,
        spent: 0,
        status: "planning",
        couples: 2,
        vendors: 0,
        tasks: 0,
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
            <h1 className="font-serif text-xl text-[#1f2937]">All Weddings</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Manage all your wedding projects</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewWeddingForm(!showNewWeddingForm)}
              className="px-4 py-2 bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              + New Wedding
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">🔔</button>
            <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
              {user.name?.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* New Wedding Form */}
          {showNewWeddingForm && (
            <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Create New Wedding</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Couple Name</label>
                  <input
                    type="text"
                    placeholder="e.g., John & Sarah"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                  <input
                    type="text"
                    placeholder="e.g., Garden Palace, Sandton"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget (R)</label>
                  <input
                    type="number"
                    placeholder="250000"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                  />
                </div>
                <div className="flex gap-3 col-span-2 mt-4">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-lg font-medium hover:shadow-lg transition-all">
                    Create Wedding
                  </button>
                  <button
                    onClick={() => setShowNewWeddingForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Weddings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weddings.map((wedding) => (
              <div
                key={wedding.id}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer border border-gray-100 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-[#1f2937] mb-1 group-hover:text-[#1B2B4B]">
                      {wedding.name}
                    </h3>
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
                      {(((wedding.spent / wedding.budget) * 100) || 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] h-2 rounded-full"
                      style={{ width: `${((wedding.spent / wedding.budget) * 100) || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    R{wedding.spent.toLocaleString()} / R{wedding.budget.toLocaleString()}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-sm font-semibold text-[#1B2B4B]">{wedding.couples}</div>
                    <div className="text-xs text-gray-500">Couples</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-sm font-semibold text-[#1B2B4B]">{wedding.vendors}</div>
                    <div className="text-xs text-gray-500">Vendors</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-sm font-semibold text-[#1B2B4B]">{wedding.tasks}</div>
                    <div className="text-xs text-gray-500">Tasks</div>
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-[#1B2B4B] text-white rounded-lg font-medium hover:bg-[#0f1a2e] transition-colors text-sm">
                  View Wedding
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
