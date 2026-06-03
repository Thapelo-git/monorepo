"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function VendorInvoices() {
  const [user, setUser] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    setInvoices([
      {
        id: "1",
        wedding: "John & Sarah Wedding",
        description: "Catering deposit – 80 pax",
        amount: 25000,
        status: "approved",
        uploadDate: "2026-04-10",
        approvedDate: "2026-04-11",
      },
    ]);
  }, []);

  if (!user) return null;

  const totalApproved = invoices
    .filter((i) => i.status === "approved")
    .reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices
    .filter((i) => i.status === "pending")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Invoices</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Manage your billing</p>
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
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <p className="text-sm text-gray-600 mb-2">Total Approved</p>
              <p className="text-3xl font-semibold text-green-700">R{totalApproved.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
              <p className="text-sm text-gray-600 mb-2">Pending Approval</p>
              <p className="text-3xl font-semibold text-yellow-700">R{totalPending.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Total Invoices</p>
              <p className="text-3xl font-semibold text-blue-700">{invoices.length}</p>
            </div>
          </div>

          {/* Upload Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="px-4 py-2 bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              + Upload Invoice
            </button>
          </div>

          {/* Upload Form */}
          {showUploadForm && (
            <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Upload New Invoice</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wedding
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30">
                    <option>John & Sarah Wedding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Catering services - 100 pax"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (R)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Document
                  </label>
                  <input
                    type="file"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-lg font-medium hover:shadow-lg transition-all">
                    Submit Invoice
                  </button>
                  <button
                    onClick={() => setShowUploadForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Invoices List */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-serif text-lg text-gray-900">Your Invoices</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{invoice.description}</p>
                      <p className="text-sm text-gray-600">{invoice.wedding}</p>
                      <p className="text-sm text-gray-500 mt-1">Uploaded: {invoice.uploadDate}</p>
                      {invoice.approvedDate && (
                        <p className="text-sm text-gray-500">Approved: {invoice.approvedDate}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-semibold text-gray-900">R{invoice.amount.toLocaleString()}</p>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium inline-block mt-2 ${
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
