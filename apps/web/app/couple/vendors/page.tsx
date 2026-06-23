"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { apiFetch } from "@/lib/api";

const CATEGORIES = ["Catering", "Photography", "Flowers", "DJ", "Venue", "Music", "Makeup", "Transport", "Decor", "Other"];

const CAT_COLOR: Record<string, string> = {
  Catering:     "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Photography:  "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Flowers:      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  DJ:           "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Venue:        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Music:        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
};

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden" style={{ animation: "modalIn 0.18s ease-out" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="font-serif text-xl text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-400 transition-colors">✕</button>
        </div>
        <div className="h-px bg-gray-100 dark:bg-gray-700 mx-6" />
        {children}
      </div>
    </div>
  );
}

export default function CoupleVendors() {
  const router = useRouter();
  const [user,          setUser]          = useState<any>(null);
  const [wedding,       setWedding]       = useState<any>(null);
  const [vendors,       setVendors]       = useState<any[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [expandedId,    setExpandedId]    = useState<string | null>(null);

  // Add vendor
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [vendorForm,    setVendorForm]    = useState({ name: "", category: "Catering", email: "", phone: "" });
  const [vendorSaving,  setVendorSaving]  = useState(false);

  // Add invoice
  const [invoiceTarget, setInvoiceTarget] = useState<any>(null);
  const [invoiceForm,   setInvoiceForm]   = useState({ amount: "", description: "" });
  const [invoiceSaving, setInvoiceSaving] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { router.push("/auth/login"); return; }
    setUser(JSON.parse(userData));

    apiFetch("/weddings")
      .then(async (ws: any[]) => {
        const w = ws[0];
        if (!w) return;
        setWedding(w);
        const data = await apiFetch(`/vendors/wedding/${w.id}`);
        setVendors(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleAddVendor(e: React.FormEvent) {
    e.preventDefault();
    if (!wedding) return;
    setVendorSaving(true);
    try {
      const vendor = await apiFetch(`/vendors/wedding/${wedding.id}`, {
        method: "POST",
        body: JSON.stringify({ name: vendorForm.name, category: vendorForm.category, email: vendorForm.email, phone: vendorForm.phone }),
      });
      setVendors(prev => [...prev, { ...vendor, invoices: vendor.invoices ?? [] }]);
      setVendorForm(f => ({ ...f, name: "", email: "", phone: "" }));
      setShowAddVendor(false);
    } catch {}
    setVendorSaving(false);
  }

  async function handleAddInvoice(e: React.FormEvent) {
    e.preventDefault();
    if (!invoiceTarget) return;
    setInvoiceSaving(true);
    try {
      const invoice = await apiFetch(`/vendors/${invoiceTarget.id}/invoices`, {
        method: "POST",
        body: JSON.stringify({ amount: parseFloat(invoiceForm.amount), description: invoiceForm.description }),
      });
      setVendors(prev => prev.map(v => v.id === invoiceTarget.id ? { ...v, invoices: [invoice, ...v.invoices] } : v));
      // Update local budget tracking
      setWedding((w: any) => w ? { ...w, spentAmount: parseFloat(String(w.spentAmount)) + parseFloat(String(invoice.amount)) } : w);
      setInvoiceForm({ amount: "", description: "" });
      setInvoiceTarget(null);
    } catch (err: any) {
      alert(err.message ?? "Failed to add invoice");
    }
    setInvoiceSaving(false);
  }

  async function handleDeleteInvoice(vendorId: string, invoice: any) {
    try {
      await apiFetch(`/vendors/${vendorId}/invoices/${invoice.id}`, { method: "DELETE" });
      setVendors(prev => prev.map(v => v.id === vendorId
        ? { ...v, invoices: v.invoices.filter((i: any) => i.id !== invoice.id) }
        : v
      ));
      setWedding((w: any) => w ? { ...w, spentAmount: Math.max(0, parseFloat(String(w.spentAmount)) - parseFloat(String(invoice.amount))) } : w);
    } catch {}
  }

  async function handleDeleteVendor(id: string) {
    if (!confirm("Delete this vendor and all their invoices?")) return;
    try {
      const vendor = vendors.find(v => v.id === id);
      const vendorTotal = vendor?.invoices.reduce((s: number, i: any) => s + parseFloat(String(i.amount)), 0) ?? 0;
      await apiFetch(`/vendors/${id}`, { method: "DELETE" });
      setVendors(prev => prev.filter(v => v.id !== id));
      setWedding((w: any) => w ? { ...w, spentAmount: Math.max(0, parseFloat(String(w.spentAmount)) - vendorTotal) } : w);
    } catch {}
  }

  if (!user) return null;

  const totalInvoiced = vendors.reduce((s, v) => s + v.invoices.reduce((si: number, i: any) => si + parseFloat(String(i.amount)), 0), 0);
  const pendingCount  = vendors.reduce((s, v) => s + v.invoices.filter((i: any) => i.status === "pending").length, 0);
  const budget        = parseFloat(String(wedding?.budget ?? 0));
  const spent         = parseFloat(String(wedding?.spentAmount ?? 0));
  const pct           = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/25 transition";

  return (
    <div className="flex min-h-screen bg-[#f7f3ee] dark:bg-[#0d1117]">
      <Sidebar />
      <main className="ml-64 flex-1">
        {/* Top bar */}
        <div className="h-14 bg-white dark:bg-[#161b22] border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937] dark:text-white">Vendors</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Your wedding vendors and invoices</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddVendor(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
            >
              + Add Vendor
            </button>
            <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
              {user?.name?.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Budget progress */}
          {wedding && (
            <div className="bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-2xl p-6 mb-6 flex flex-wrap gap-6 items-center">
              <div className="flex-1 min-w-40">
                <p className="text-white/60 text-xs mb-1">Total Budget</p>
                <p className="font-serif text-2xl">R{budget.toLocaleString()}</p>
              </div>
              <div className="flex-2 min-w-48 flex-1">
                <div className="flex justify-between text-xs text-white/70 mb-1.5">
                  <span>Budget used</span>
                  <span>R{spent.toLocaleString()} / R{budget.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${pct >= 90 ? "bg-rose-400" : pct >= 70 ? "bg-amber-400" : "bg-emerald-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-white/60 mt-1">{pct.toFixed(1)}% used</p>
              </div>
              <div className="flex-1 min-w-32">
                <p className="text-white/60 text-xs mb-1">Remaining</p>
                <p className="font-serif text-2xl">R{Math.max(0, budget - spent).toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Vendors",          value: vendors.length,                       cls: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300" },
              { label: "Total Invoiced",   value: `R${totalInvoiced.toLocaleString()}`, cls: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300" },
              { label: "Pending Invoices", value: pendingCount,                          cls: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300" },
            ].map(s => (
              <div key={s.label} className={`bg-gradient-to-br ${s.cls} rounded-xl p-5 border`}>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{s.label}</p>
                <p className={`text-2xl font-semibold ${s.cls.split(" ").at(-1)}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-32 bg-white dark:bg-gray-800 rounded-xl animate-pulse" />)}</div>
          ) : vendors.length === 0 ? (
            <div className="bg-white dark:bg-[#161b22] rounded-xl p-12 border border-gray-100 dark:border-gray-800 text-center">
              <p className="text-4xl mb-3">🤝</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No vendors yet</p>
              <p className="text-sm text-gray-400 mt-1 mb-4">Add your first vendor to start tracking costs</p>
              <button onClick={() => setShowAddVendor(true)} className="px-4 py-2 bg-[#1B2B4B] text-white rounded-lg text-sm font-medium">Add Vendor</button>
            </div>
          ) : (
            <div className="space-y-4">
              {vendors.map(vendor => {
                const invoiceTotal = vendor.invoices.reduce((s: number, i: any) => s + parseFloat(String(i.amount)), 0);
                const isExpanded   = expandedId === vendor.id;
                const catColor     = CAT_COLOR[vendor.category] ?? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";

                return (
                  <div key={vendor.id} className="bg-white dark:bg-[#161b22] rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-5 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{vendor.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor}`}>{vendor.category}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{vendor.email}</p>
                        {vendor.phone && <p className="text-sm text-gray-500 dark:text-gray-400">{vendor.phone}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => { setInvoiceTarget(vendor); setInvoiceForm({ amount: "", description: "" }); }}
                          className="px-3 py-1.5 text-xs bg-[#1B2B4B] text-white rounded-lg font-medium hover:opacity-90 transition"
                        >
                          + Invoice
                        </button>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : vendor.id)}
                          className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          {isExpanded ? "Hide" : `Invoices (${vendor.invoices.length})`}
                        </button>
                        <button
                          onClick={() => handleDeleteVendor(vendor.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition text-sm"
                          title="Delete vendor"
                        >
                          🗑
                        </button>
                      </div>
                    </div>

                    {/* Vendor stats row */}
                    <div className="px-5 pb-4 grid grid-cols-3 gap-3 text-sm border-t border-gray-50 dark:border-gray-800 pt-3">
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Invoices</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{vendor.invoices.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Pending</p>
                        <p className="font-semibold text-amber-600 dark:text-amber-400">{vendor.invoices.filter((i: any) => i.status === "pending").length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Total</p>
                        <p className="font-semibold text-gray-900 dark:text-white">R{invoiceTotal.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Invoices list */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 dark:border-gray-800">
                        {vendor.invoices.length === 0 ? (
                          <p className="px-5 py-4 text-sm text-gray-400 dark:text-gray-500">No invoices yet.</p>
                        ) : (
                          vendor.invoices.map((inv: any) => (
                            <div key={inv.id} className="px-5 py-3 flex items-center justify-between gap-3 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">R{parseFloat(String(inv.amount)).toLocaleString()}</p>
                                {inv.description && <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{inv.description}</p>}
                                <p className="text-xs text-gray-300 dark:text-gray-600">{new Date(inv.uploadedAt).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                  inv.status === "approved"
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                    : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                }`}>
                                  {inv.status === "approved" ? "✓ Approved" : "Pending"}
                                </span>
                                <button
                                  onClick={() => handleDeleteInvoice(vendor.id, inv)}
                                  className="w-6 h-6 rounded flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-red-400 transition text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add Vendor Modal */}
      <Modal open={showAddVendor} onClose={() => setShowAddVendor(false)} title="Add Vendor">
        <form onSubmit={handleAddVendor} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Name <span className="text-rose-400">*</span></label>
            <input required type="text" placeholder="e.g. Bloom & Co Florists" value={vendorForm.name} onChange={e => setVendorForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Category <span className="text-rose-400">*</span></label>
            <select value={vendorForm.category} onChange={e => setVendorForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Email <span className="text-rose-400">*</span></label>
              <input required type="email" placeholder="vendor@email.com" value={vendorForm.email} onChange={e => setVendorForm(f => ({ ...f, email: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Phone</label>
              <input type="tel" placeholder="+27 …" value={vendorForm.phone} onChange={e => setVendorForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} />
            </div>
          </div>
          <div className="flex gap-3 pb-1">
            <button type="button" onClick={() => setShowAddVendor(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
            <button type="submit" disabled={vendorSaving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] hover:shadow-lg transition disabled:opacity-60">
              {vendorSaving ? "Adding…" : "Add Vendor"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Invoice Modal */}
      <Modal open={!!invoiceTarget} onClose={() => setInvoiceTarget(null)} title={`Add Invoice — ${invoiceTarget?.name ?? ""}`}>
        <form onSubmit={handleAddInvoice} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Amount (R) <span className="text-rose-400">*</span></label>
            <input required type="number" min="0.01" step="0.01" placeholder="0.00" value={invoiceForm.amount} onChange={e => setInvoiceForm(f => ({ ...f, amount: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Description</label>
            <textarea rows={2} placeholder="e.g. Ceremony flowers package" value={invoiceForm.description} onChange={e => setInvoiceForm(f => ({ ...f, description: e.target.value }))} className={`${inputCls} resize-none`} />
          </div>
          <div className="flex gap-3 pb-1">
            <button type="button" onClick={() => setInvoiceTarget(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
            <button type="submit" disabled={invoiceSaving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] hover:shadow-lg transition disabled:opacity-60">
              {invoiceSaving ? "Adding…" : "Add Invoice"}
            </button>
          </div>
        </form>
      </Modal>

      <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </div>
  );
}
