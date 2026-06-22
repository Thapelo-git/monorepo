"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { apiFetch } from "@/lib/api";

export default function CoupleBudget() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [wedding, setWedding] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { router.push("/auth/login"); return; }
    setUser(JSON.parse(userData));

    apiFetch("/weddings")
      .then(async (ws: any[]) => {
        const w = ws[0];
        if (!w) return;
        setWedding(w);
        const vendors: any[] = await apiFetch(`/vendors/wedding/${w.id}`);
        const allInvoices = vendors.flatMap((v: any) =>
          v.invoices.map((inv: any) => ({ ...inv, vendorName: v.name }))
        );
        setInvoices(allInvoices);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f7f3ee]">
        <Sidebar />
        <main className="ml-64 flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="flex min-h-screen bg-[#f7f3ee]">
        <Sidebar />
        <main className="ml-64 flex-1 p-12 text-center">
          <p className="text-gray-500">No wedding found. Ask your planner for an invite.</p>
        </main>
      </div>
    );
  }

  const total = parseFloat(wedding.budget ?? 0);
  const spent = parseFloat(wedding.spentAmount ?? 0);
  const remaining = total - spent;
  const pct = total > 0 ? (spent / total) * 100 : 0;

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />
      <main className="ml-64 flex-1">
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Budget Tracking</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Monitor your wedding expenses</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
            {user.name?.slice(0, 2).toUpperCase()}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Total Budget</p>
              <p className="text-3xl font-semibold text-[#1B2B4B] mb-2">R{total.toLocaleString()}</p>
              <div className="text-xs text-gray-600">Your wedding budget allocation</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <p className="text-sm text-gray-600 mb-2">Amount Spent</p>
              <p className="text-3xl font-semibold text-red-700 mb-2">R{spent.toLocaleString()}</p>
              <div className="text-xs text-gray-600">{pct.toFixed(1)}% of budget</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <p className="text-sm text-gray-600 mb-2">Remaining Budget</p>
              <p className="text-3xl font-semibold text-green-700 mb-2">R{remaining.toLocaleString()}</p>
              <div className="text-xs text-gray-600">{(100 - pct).toFixed(1)}% available</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 mb-8 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Budget Distribution</h3>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Spent</span>
                <span className="text-sm font-semibold text-[#1B2B4B]">R{spent.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Invoices</h3>
            </div>
            {invoices.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No invoices yet.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {invoices.map((invoice: any) => (
                  <div key={invoice.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{invoice.vendorName}</p>
                        <p className="text-sm text-gray-500">{invoice.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(invoice.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-semibold text-gray-900">
                          R{parseFloat(invoice.amount).toLocaleString()}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium inline-block mt-2 ${
                            invoice.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
