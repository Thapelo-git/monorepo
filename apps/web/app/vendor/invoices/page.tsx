"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { apiFetch } from "@/lib/api";

export default function VendorInvoices() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { router.push("/auth/login"); return; }
    setUser(JSON.parse(userData));

    // Fetch invoices from all weddings the user is part of
    apiFetch("/vendors")
      .then((vendors: any[]) => {
        const all = vendors.flatMap((v: any) =>
          v.invoices.map((inv: any) => ({
            ...inv,
            vendorName: v.name,
            weddingName: v.wedding?.name,
          }))
        );
        setInvoices(all);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const totalApproved = invoices
    .filter((i) => i.status === "approved")
    .reduce((s, i) => s + parseFloat(i.amount || 0), 0);
  const totalPending = invoices
    .filter((i) => i.status === "pending")
    .reduce((s, i) => s + parseFloat(i.amount || 0), 0);

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />
      <main className="ml-64 flex-1">
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Invoices</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Billing overview</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
            {user.name?.slice(0, 2).toUpperCase()}
          </div>
        </div>

        <div className="p-6">
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

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-serif text-lg text-gray-900">All Invoices</h3>
            </div>
            {loading ? (
              <div className="divide-y divide-gray-100">
                {[1, 2].map((i) => (
                  <div key={i} className="p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : invoices.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No invoices found.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {invoices.map((invoice: any) => (
                  <div key={invoice.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{invoice.description}</p>
                        <p className="text-sm text-gray-600">{invoice.vendorName}</p>
                        {invoice.weddingName && (
                          <p className="text-sm text-gray-500">{invoice.weddingName}</p>
                        )}
                        <p className="text-sm text-gray-400 mt-1">
                          Uploaded: {new Date(invoice.uploadedAt).toLocaleDateString()}
                        </p>
                        {invoice.approvedAt && (
                          <p className="text-sm text-gray-400">
                            Approved: {new Date(invoice.approvedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-semibold text-gray-900">
                          R{parseFloat(invoice.amount).toLocaleString()}
                        </p>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium inline-block mt-2 ${
                          invoice.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
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
