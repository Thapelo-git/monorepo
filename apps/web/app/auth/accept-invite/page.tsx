"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [invite, setInvite] = useState<{
    email: string;
    weddingName: string;
    weddingDate: string;
  } | null>(null);
  const [tokenError, setTokenError] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenError("Missing invite token.");
      setLoading(false);
      return;
    } 
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    fetch(`${API_URL}/api/auth/invite/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setTokenError(data.error);
        } else {
          setInvite(data);
        }
      })
      .catch(() => setTokenError("Could not validate invite."))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}/api/auth/accept-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setSubmitting(false);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/couple/board");
    } catch {
      setError("Could not connect to server.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      {/* Left panel */}
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
            Your perfect day<br />
            <em className="text-[#e8b4b8] not-italic">is taking shape</em>
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            Your planner has set everything up. Create your account to access your wedding board and stay updated on every detail.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <span className="text-2xl">💍</span>
              <span className="font-serif text-2xl text-[#8b4a6b] font-semibold">WeddingFlow</span>
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-2 border-[#1B2B4B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Validating invite…</p>
              </div>
            ) : tokenError ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  ✗
                </div>
                <h2 className="font-serif text-2xl text-gray-900 mb-2">Invite Invalid</h2>
                <p className="text-gray-500 text-sm mb-6">{tokenError}</p>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="px-6 py-2.5 bg-[#1B2B4B] text-white rounded-xl text-sm font-semibold"
                >
                  Go to Sign In
                </button>
              </div>
            ) : invite ? (
              <>
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-gray-500 mb-1">You're invited to</p>
                  <p className="font-serif text-lg text-[#1B2B4B] font-semibold">{invite.weddingName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(invite.weddingDate).toLocaleDateString("en-ZA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <h2 className="font-serif text-2xl text-[#1f2937] mb-1">Create your account</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Signing in as <span className="font-medium text-[#1B2B4B]">{invite.email}</span>
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Emma Johnson"
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
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
                      minLength={6}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Confirm Password</label>
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] hover:shadow-lg"
                    }`}
                  >
                    {submitting ? "Creating account…" : "Accept Invitation & Sign In"}
                  </button>
                </form>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense>
      <AcceptInviteContent />
    </Suspense>
  );
}
