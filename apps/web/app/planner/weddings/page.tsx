"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import { apiFetch } from "@/lib/api";

export default function PlannerWeddings() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [weddings, setWeddings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [inviteWeddingId, setInviteWeddingId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteResult, setInviteResult] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", weddingDate: "", venue: "", budget: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { router.push("/auth/login"); return; }
    setUser(JSON.parse(userData));
    fetchWeddings();
  }, []);

  function fetchWeddings() {
    setLoading(true);
    apiFetch("/weddings")
      .then(setWeddings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiFetch("/weddings", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ name: "", weddingDate: "", venue: "", budget: "" });
      setShowNewForm(false);
      fetchWeddings();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteWeddingId) return;
    try {
      const data = await apiFetch("/auth/invite", {
        method: "POST",
        body: JSON.stringify({ weddingId: inviteWeddingId, email: inviteEmail }),
      });
      setInviteResult(data.acceptUrl);
      setInviteEmail("");
    } catch (err: any) {
      setInviteResult(`Error: ${err.message}`);
    }
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />
      <main className="ml-64 flex-1">
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">All Weddings</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Manage all your wedding projects</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="px-4 py-2 bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              + New Wedding
            </button>
            <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
              {user.name?.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="p-6">
          {showNewForm && (
            <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Create New Wedding</h3>
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              <form onSubmit={handleCreate}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Couple Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g., John & Sarah"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Date</label>
                    <input
                      required
                      type="date"
                      value={form.weddingDate}
                      onChange={(e) => setForm({ ...form, weddingDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g., Garden Palace, Sandton"
                      value={form.venue}
                      onChange={(e) => setForm({ ...form, venue: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget (R)</label>
                    <input
                      required
                      type="number"
                      placeholder="250000"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                    />
                  </div>
                  <div className="flex gap-3 col-span-2 mt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {saving ? "Creating..." : "Create Wedding"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse h-64" />
              ))}
            </div>
          ) : weddings.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
              <p className="text-gray-400 mb-4">No weddings yet. Create your first one above.</p>
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
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-all border border-gray-100 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-[#1f2937] mb-1 group-hover:text-[#1B2B4B]">
                          {wedding.name}
                        </h3>
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
                          {pct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] h-2 rounded-full"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        R{spent.toLocaleString()} / R{budget.toLocaleString()}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <div className="text-sm font-semibold text-[#1B2B4B]">{wedding.members?.length ?? 0}</div>
                        <div className="text-xs text-gray-500">Members</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <div className="text-sm font-semibold text-[#1B2B4B]">{wedding.vendors?.length ?? 0}</div>
                        <div className="text-xs text-gray-500">Vendors</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <div className="text-sm font-semibold text-[#1B2B4B]">{wedding.tasks?.length ?? 0}</div>
                        <div className="text-xs text-gray-500">Tasks</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/planner/weddings/${wedding.id}`}
                        className="flex-1 px-3 py-2 bg-[#1B2B4B] text-white rounded-lg font-medium hover:bg-[#0f1a2e] transition-colors text-center text-sm"
                      >
                        View Board
                      </Link>
                      <button
                        onClick={() => { setInviteWeddingId(wedding.id); setInviteResult(null); }}
                        className="px-3 py-2 border border-[#1B2B4B] text-[#1B2B4B] rounded-lg text-sm font-medium hover:bg-gray-50"
                      >
                        Invite Couple
                      </button>
                    </div>

                    {inviteWeddingId === wedding.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {inviteResult ? (
                          <div className="text-xs bg-green-50 text-green-700 p-3 rounded-lg break-all">
                            Invite link: <strong>{inviteResult}</strong>
                            <button
                              onClick={() => { setInviteWeddingId(null); setInviteResult(null); }}
                              className="block mt-2 text-gray-500 underline"
                            >
                              Close
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleInvite} className="flex gap-2">
                            <input
                              required
                              type="email"
                              placeholder="couple@email.com"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                            />
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-[#8b4a6b] text-white rounded-lg text-sm font-medium"
                            >
                              Send
                            </button>
                          </form>
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
    </div>
  );
}
