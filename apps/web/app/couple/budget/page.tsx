"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function CoupleBudget() {
  const [user, setUser] = useState<any>(null);
  const [budget, setBudget] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    setBudget({
      total: 250000,
      spent: 43000,
      remaining: 207000,
    });

    setInvoices([
      {
        id: "1",
        vendor: "Luxe Catering Co.",
        description: "Catering deposit – 80 pax",
        amount: 25000,
        status: "approved",
        date: "2026-04-10",
      },
      {
        id: "2",
        vendor: "Capture Moments Photography",
        description: "Full day coverage + album",
        amount: 18000,
        status: "pending",
        date: "2026-04-12",
      },
    ]);
  }, []);

  if (!user || !budget) return null;

  const percentageSpent = (budget.spent / budget.total) * 100;

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Budget Tracking</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Monitor your wedding expenses</p>
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
          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Budget */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Total Budget</p>
              <p className="text-3xl font-semibold text-[#1B2B4B] mb-2">R{budget.total.toLocaleString()}</p>
              <div className="text-xs text-gray-600">Your wedding budget allocation</div>
            </div>

            {/* Spent */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <p className="text-sm text-gray-600 mb-2">Amount Spent</p>
              <p className="text-3xl font-semibold text-red-700 mb-2">R{budget.spent.toLocaleString()}</p>
              <div className="text-xs text-gray-600">{percentageSpent.toFixed(1)}% of budget</div>
            </div>

            {/* Remaining */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <p className="text-sm text-gray-600 mb-2">Remaining Budget</p>
              <p className="text-3xl font-semibold text-green-700 mb-2">R{budget.remaining.toLocaleString()}</p>
              <div className="text-xs text-gray-600">{(100 - percentageSpent).toFixed(1)}% available</div>
            </div>
          </div>

          {/* Budget Visualization */}
          <div className="bg-white rounded-xl p-6 mb-8 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Budget Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Spent</span>
                  <span className="text-sm font-semibold text-[#1B2B4B]">R{budget.spent.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] h-3 rounded-full"
                    style={{ width: `${percentageSpent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Invoices */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Recent Invoices</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{invoice.vendor}</p>
                      <p className="text-sm text-gray-500">{invoice.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{invoice.date}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-semibold text-gray-900">R{invoice.amount.toLocaleString()}</p>
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
          </div>
        </div>
      </main>
    </div>
  );
}
