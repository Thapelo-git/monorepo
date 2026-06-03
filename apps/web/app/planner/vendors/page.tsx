"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function PlannerVendors() {
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
        weddings: 1,
        invoices: 1,
        totalAmount: 25000,
      },
      {
        id: "2",
        name: "Capture Moments Photography",
        category: "Photography",
        email: "photos@capturemoments.co.za",
        phone: "+27 82 333 4455",
        weddings: 1,
        invoices: 1,
        totalAmount: 18000,
      },
      {
        id: "3",
        name: "Bloom & Blossom Florists",
        category: "Flowers",
        email: "hello@bloomblossom.co.za",
        phone: "+27 71 222 3344",
        weddings: 1,
        invoices: 0,
        totalAmount: 0,
      },
      {
        id: "4",
        name: "Sound & Vision DJ",
        category: "DJ",
        email: "dj@soundvision.co.za",
        phone: "+27 83 444 5566",
        weddings: 1,
        invoices: 0,
        totalAmount: 0,
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

  const totalVendors = vendors.length;
  const totalInvoiced = vendors.reduce((sum, v) => sum + v.totalAmount, 0);

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Vendors</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Manage all your wedding vendors</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm">
              + Add Vendor
            </button>
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
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Total Vendors</p>
              <p className="text-3xl font-semibold text-blue-700">{totalVendors}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <p className="text-sm text-gray-600 mb-2">Total Invoiced</p>
              <p className="text-3xl font-semibold text-green-700">R{totalInvoiced.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <p className="text-sm text-gray-600 mb-2">Pending Invoices</p>
              <p className="text-3xl font-semibold text-purple-700">{vendors.filter(v => v.invoices === 0).length}</p>
            </div>
          </div>

          {/* Vendors Grid */}
          <div className="grid gap-6">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{vendor.name}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${categoryColors[vendor.category]}`}>
                        {vendor.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{vendor.email}</p>
                    <p className="text-sm text-gray-600">{vendor.phone}</p>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Weddings</p>
                    <p className="text-lg font-semibold text-[#1B2B4B]">{vendor.weddings}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Invoices</p>
                    <p className="text-lg font-semibold text-[#1B2B4B]">{vendor.invoices}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                    <p className="text-lg font-semibold text-[#1B2B4B]">R{vendor.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
