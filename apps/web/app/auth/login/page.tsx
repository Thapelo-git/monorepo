"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MOCK_USERS = [
  { id: "1", name: "Grace Mokoena", email: "planner@weddingco.com", password: "planner123", role: "planner" },
  { id: "2", name: "John & Sarah Dlamini", email: "john.sarah@email.com", password: "couple123", role: "couple" },
  { id: "3", name: "Mike & Anna Nkosi", email: "mike.anna@email.com", password: "couple123", role: "couple" },
  { id: "4", name: "Luxe Catering Co.", email: "vendor@luxecatering.com", password: "vendor123", role: "vendor" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await new Promise(r => setTimeout(r, 500));

    const user = MOCK_USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    localStorage.setItem("token", "mock-token-" + user.id);
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "planner") {
      router.push("/planner/dashboard");
    } else if (user.role === "couple") {
      router.push("/couple/board");
    } else {
      router.push("/vendor/dashboard");
    }
  };

  const setDemoAccount = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 bg-gradient-to-br from-[#1B2B4B] to-[#8b4a6b] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-[#e8b4b8] rounded-full blur-3xl -top-32 left-12" />
          <div className="absolute w-96 h-96 bg-[#b8976a] rounded-full blur-3xl -bottom-32 right-12" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-[rgba(184,151,106,0.3)] flex items-center justify-center text-2xl">
              💍
            </div>
            <span className="font-serif text-3xl font-semibold">WeddingFlow</span>
          </div>

          <h1 className="font-serif text-5xl leading-tight mb-4">
            Where Beautiful<br />
            <em className="text-[#e8b4b8] not-italic">Weddings</em>
            <br />
            Begin
          </h1>

          <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-12">
            A collaborative platform connecting planners, couples, and vendors — streamlining every detail of your perfect day.
          </p>

          <div className="flex gap-8">
            {[
              { number: "150+", label: "Weddings Planned" },
              { number: "98%", label: "Couples Happy" },
              { number: "500+", label: "Vendors Managed" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-3xl text-[#b8976a] font-semibold">{stat.number}</div>
                <div className="text-white/50 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <span className="text-2xl">💍</span>
              <span className="font-serif text-2xl text-[#8b4a6b] font-semibold">WeddingFlow</span>
            </div>

            <h2 className="font-serif text-3xl text-[#1f2937] mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500 mb-6">Sign in to your workspace</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30 focus:border-[#1B2B4B] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30 focus:border-[#1B2B4B] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6">
              <p className="text-xs text-gray-400 text-center mb-3">— Demo Accounts —</p>
              <div className="space-y-2">
                {MOCK_USERS.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => setDemoAccount(account.email, account.password)}
                    className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:border-[#1B2B4B] hover:bg-[#1B2B4B]/5 transition-all"
                  >
                    <div className="font-medium text-sm text-[#1B2B4B]">{account.name}</div>
                    <div className="text-gray-400 text-xs truncate">{account.email}</div>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-[#00AEAE] font-semibold hover:text-[#00AEAE]/80">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
