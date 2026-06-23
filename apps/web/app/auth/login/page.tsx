"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid credentials"); setLoading(false); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "planner")     router.push("/planner/dashboard");
      else if (data.user.role === "couple") router.push("/couple/board");
      else                                  router.push("/vendor/dashboard");
    } catch {
      setError("Connection error. Is the server running?");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f7f3ee] dark:bg-[#0d1117]">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center px-16 bg-gradient-to-br from-[#1B2B4B] to-[#8b4a6b] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full border border-white/30" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full border border-white/20" />
        </div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-3xl mx-auto mb-6">💍</div>
          <h1 className="font-serif text-5xl font-semibold mb-3">WeddingFlow</h1>
          <p className="text-white/70 text-lg">Your complete wedding planning platform</p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-sm text-white/60">
            <div className="bg-white/8 rounded-xl p-4 text-left">
              <p className="text-white font-medium mb-1">📋 Task Boards</p>
              <p>Kanban planning for every detail</p>
            </div>
            <div className="bg-white/8 rounded-xl p-4 text-left">
              <p className="text-white font-medium mb-1">💰 Budget Tracking</p>
              <p>Invoices and vendor management</p>
            </div>
            <div className="bg-white/8 rounded-xl p-4 text-left">
              <p className="text-white font-medium mb-1">💬 Team Chat</p>
              <p>Real-time couple & planner chat</p>
            </div>
            <div className="bg-white/8 rounded-xl p-4 text-left">
              <p className="text-white font-medium mb-1">🔔 Notifications</p>
              <p>Stay updated on every change</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B2B4B] to-[#8b4a6b] flex items-center justify-center text-xl">💍</div>
            <span className="font-serif text-2xl text-gray-900 dark:text-white font-semibold">WeddingFlow</span>
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-3xl text-gray-900 dark:text-white font-semibold">Welcome back</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
          </div>

          <div className="bg-white dark:bg-[#161b22] rounded-2xl p-8 shadow-xl dark:shadow-black/40 border border-gray-100 dark:border-gray-800">
            {error && (
              <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  suppressHydrationWarning
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  suppressHydrationWarning
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30 transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                suppressHydrationWarning
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] hover:shadow-lg hover:shadow-[#1B2B4B]/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : "Sign In"}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              No account?{" "}
              <Link href="/auth/register" className="text-[#00AEAE] hover:text-[#4dd0d0] font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
