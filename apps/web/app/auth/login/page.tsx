"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "planner") router.push("/planner/dashboard");
      else if (data.user.role === "couple") router.push("/couple/board");
      else router.push("/vendor/dashboard");
    } catch (err) {
      setError("Error");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 bg-gradient-to-br from-[#1B2B4B] to-[#8b4a6b] text-white">
        <h1 className="font-serif text-5xl">WeddingFlow</h1>
      </div>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="font-serif text-3xl mb-6">Sign in</h2>
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
              <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl text-white bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b]">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              No account? <Link href="/auth/register" className="text-[#00AEAE]">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}