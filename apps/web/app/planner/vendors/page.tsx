"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { apiFetch } from "@/lib/api";

const CATEGORY_COLORS: Record<string, string> = {
  Catering: "bg-orange-100 text-orange-700",
  Photography: "bg-purple-100 text-purple-700",
  Flowers: "bg-pink-100 text-pink-700",
  DJ: "bg-blue-100 text-blue-700",
  Venue: "bg-green-100 text-green-700",
  Music: "bg-indigo-100 text-indigo-700",
};

export default function PlannerVendors() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { router.push("/auth/login"); return; }
    setUser(JSON.parse(userData));

    apiFetch("/vendors")
      .then(setVendors)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const totalInvoiced = vendors.reduce(
    (s, v) => s + v.invoices.reduce((si: number, i: any) => si + parseFloat(i.amount || 0), 0),
    0
  );
  const pendingInvoices = vendors.reduce(
    (s, v) => s + v.invoices.filter((i: any) => i.status === "pending").length,
    0
  );

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />
      <main className="ml-64 flex-1">
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Vendors</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Manage all your wedding vendors</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
            {user.name?.slice(0, 2).toUpperCase()}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Total Vendors</p>
              <p className="text-3xl font-semibold text-blue-700">{vendors.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <p className="text-sm text-gray-600 mb-2">Total Invoiced</p>
              <p className="text-3xl font-semibold text-green-700">R{totalInvoiced.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <p className="text-sm text-gray-600 mb-2">Pending Invoices</p>
              <p className="text-3xl font-semibold text-purple-700">{pendingInvoices}</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse h-32" />
              ))}
            </div>
          ) : vendors.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
              <p className="text-gray-400">No vendors yet. Add vendors through a wedding's board.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {vendors.map((vendor) => {
                const invoiceTotal = vendor.invoices.reduce(
                  (s: number, i: any) => s + parseFloat(i.amount || 0), 0
                );
                const categoryColor = CATEGORY_COLORS[vendor.category] || "bg-gray-100 text-gray-700";
                return (
                  <div key={vendor.id} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{vendor.name}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${categoryColor}`}>
                            {vendor.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{vendor.email}</p>
                        {vendor.phone && <p className="text-sm text-gray-600">{vendor.phone}</p>}
                        {vendor.wedding && (
                          <p className="text-xs text-gray-400 mt-1">Wedding: {vendor.wedding.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Invoices</p>
                        <p className="text-lg font-semibold text-[#1B2B4B]">{vendor.invoices.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Pending</p>
                        <p className="text-lg font-semibold text-[#1B2B4B]">
                          {vendor.invoices.filter((i: any) => i.status === "pending").length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                        <p className="text-lg font-semibold text-[#1B2B4B]">R{invoiceTotal.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
