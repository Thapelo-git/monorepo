"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { apiFetch } from "@/lib/api";

export default function PlannerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [weddings, setWeddings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { router.push("/auth/login"); return; }
    setUser(JSON.parse(userData));

    apiFetch("/weddings")
      .then(setWeddings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const totalBudget = weddings.reduce((s, w) => s + parseFloat(w.budget || 0), 0);
  const totalVendors = weddings.reduce((s, w) => s + (w.vendors?.length ?? 0), 0);
  const totalMembers = weddings.reduce((s, w) => s + (w.members?.length ?? 0), 0);

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />
      <main className="ml-64 flex-1">
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Dashboard</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
              {user.name?.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl text-[#1f2937] mb-1">Your Weddings</h2>
              <p className="text-sm text-gray-500">Manage all your wedding projects</p>
            </div>
            <button
              onClick={() => router.push("/planner/weddings")}
              className="px-4 py-2 bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              + New Wedding
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : weddings.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
              <p className="text-gray-400 mb-4">No weddings yet</p>
              <button
                onClick={() => router.push("/planner/weddings")}
                className="px-4 py-2 bg-[#1B2B4B] text-white rounded-lg text-sm font-medium"
              >
                Create your first wedding
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weddings.map((wedding) => {
                const budget = parseFloat(wedding.budget || 0);
                const spent = parseFloat(wedding.spentAmount || 0);
                const pct = budget > 0 ? (spent / budget) * 100 : 0;
                return (
                  <div
                    key={wedding.id}
                    onClick={() => router.push(`/planner/weddings/${wedding.id}`)}
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-serif text-lg text-[#1f2937] mb-1">{wedding.name}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(wedding.weddingDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        {wedding.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{wedding.venue}</p>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-600">Budget</span>
                        <span className="text-xs font-semibold text-[#1B2B4B]">
                          R{spent.toLocaleString()} / R{budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] h-2 rounded-full"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-[#1B2B4B]">
                          {wedding.members?.length ?? 0}
                        </div>
                        <div className="text-xs text-gray-500">Members</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-[#1B2B4B]">
                          {wedding.vendors?.length ?? 0}
                        </div>
                        <div className="text-xs text-gray-500">Vendors</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-sm text-gray-600 mb-2">Active Members</p>
              <p className="text-3xl font-semibold text-[#1B2B4B]">{totalMembers}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="text-2xl mb-2">🤝</div>
              <p className="text-sm text-gray-600 mb-2">Total Vendors</p>
              <p className="text-3xl font-semibold text-[#1B2B4B]">{totalVendors}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-sm text-gray-600 mb-2">Total Budget</p>
              <p className="text-3xl font-semibold text-[#1B2B4B]">
                R{(totalBudget / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
