"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function CoupleVendors() {
  const [user, setUser] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    setVendors([
      {
        id: "1",
        name: "Luxe Catering Co.",
        category: "Catering",
        email: "vendor@luxecatering.com",
        phone: "+27 11 555 0101",
        status: "confirmed",
        invoice: { amount: 25000, status: "approved" },
      },
      {
        id: "2",
        name: "Capture Moments Photography",
        category: "Photography",
        email: "photos@capturemoments.co.za",
        phone: "+27 82 333 4455",
        status: "pending",
        invoice: { amount: 18000, status: "pending" },
      },
      {
        id: "3",
        name: "Bloom & Blossom Florists",
        category: "Flowers",
        email: "hello@bloomblossom.co.za",
        phone: "+27 71 222 3344",
        status: "confirmed",
        invoice: null,
      },
      {
        id: "4",
        name: "Sound & Vision DJ",
        category: "DJ",
        email: "dj@soundvision.co.za",
        phone: "+27 83 444 5566",
        status: "pending",
        invoice: null,
      },
    ]);
  }, []);

  if (!user) return null;

  const categoryColors: Record<string, string> = {
    Catering: "bg-orange-100 text-orange-700",
    Photography: "bg-purple-100 text-purple-700",
    Flowers: "bg-pink-100 text-pink-700",
    DJ: "bg-blue-100 text-blue-700",
  };

  const statusBadge: Record<string, string> = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Vendors</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Manage your wedding vendors and invoices</p>
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
          <div className="grid gap-6">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColors[vendor.category]}`}>
                        {vendor.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{vendor.email}</p>
                    <p className="text-sm text-gray-500">{vendor.phone}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusBadge[vendor.status]}`}>
                    {vendor.status}
                  </span>
                </div>

                {vendor.invoice && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Invoice Amount</p>
                        <p className="text-lg font-semibold text-gray-900">R{vendor.invoice.amount.toLocaleString()}</p>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          vendor.invoice.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {vendor.invoice.status}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  <button className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                    Send Message
                  </button>
                  <button className="flex-1 px-4 py-2 rounded-lg bg-[#1B2B4B] text-white hover:shadow-lg transition-all text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
