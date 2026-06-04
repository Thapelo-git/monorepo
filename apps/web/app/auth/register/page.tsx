"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "couple",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 500));

    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", "mock-token-" + newUser.id);

    if (formData.role === "couple") {
      router.push("/couple/board");
    } else if (formData.role === "planner") {
      router.push("/planner/dashboard");
    } else {
      router.push("/vendor/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
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
            Start Planning<br />
            <em className="text-[#e8b4b8] not-italic">Your Perfect Day</em>
          </h1>

          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            Join thousands of couples, planners, and vendors building beautiful weddings together.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <span className="text-2xl">💍</span>
              <span className="font-serif text-2xl text-[#8b4a6b] font-semibold">WeddingFlow</span>
            </div>

            <h2 className="font-serif text-3xl text-[#1f2937] mb-1">Create account</h2>
            <p className="text-sm text-gray-500 mb-6">Join WeddingFlow today</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">I am a:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                >
                  <option value="couple">Couple</option>
                  <option value="planner">Wedding Planner</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] hover:shadow-lg"
                }`}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#00AEAE] font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
