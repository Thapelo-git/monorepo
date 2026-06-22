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

export default function CoupleVendors() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { router.push("/auth/login"); return; }
    setUser(JSON.parse(userData));

    apiFetch("/weddings")
      .then(async (ws: any[]) => {
        const w = ws[0];
        if (!w) return;
        const data = await apiFetch(`/vendors/wedding/${w.id}`);
        setVendors(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />
      <main className="ml-64 flex-1">
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Vendors</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Your wedding vendors and invoices</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
            {user.name?.slice(0, 2).toUpperCase()}
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse h-40" />
              ))}
            </div>
          ) : vendors.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
              <p className="text-gray-400">No vendors assigned to your wedding yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {vendors.map((vendor: any) => {
                const categoryColor = CATEGORY_COLORS[vendor.category] ?? "bg-gray-100 text-gray-700";
                const latestInvoice = vendor.invoices?.[vendor.invoices.length - 1];
                return (
                  <div key={vendor.id} className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColor}`}>
                            {vendor.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{vendor.email}</p>
                        {vendor.phone && <p className="text-sm text-gray-500">{vendor.phone}</p>}
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        latestInvoice?.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {latestInvoice ? latestInvoice.status : "no invoice"}
                      </span>
                    </div>

                    {latestInvoice && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Latest Invoice</p>
                            <p className="text-lg font-semibold text-gray-900">
                              R{parseFloat(latestInvoice.amount).toLocaleString()}
                            </p>
                            {latestInvoice.description && (
                              <p className="text-xs text-gray-400 mt-1">{latestInvoice.description}</p>
                            )}
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            latestInvoice.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {latestInvoice.status}
                          </span>
                        </div>
                      </div>
                    )}
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
