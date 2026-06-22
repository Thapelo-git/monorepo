"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { apiFetch } from "@/lib/api";

export default function CoupleChat() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { router.push("/auth/login"); return; }
    setUser(JSON.parse(userData));

    apiFetch("/weddings")
      .then(async (ws: any[]) => {
        const w = ws[0];
        if (!w) return;
        setWeddingId(w.id);
        const msgs = await apiFetch(`/chat/${w.id}`);
        setMessages(msgs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!newMessage.trim() || !weddingId) return;
    setSending(true);
    try {
      const msg = await apiFetch(`/chat/${weddingId}`, {
        method: "POST",
        body: JSON.stringify({ text: newMessage }),
      });
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    } catch {}
    setSending(false);
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />
      <main className="ml-64 flex-1 flex flex-col">
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Chat</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Wedding planning discussion</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
            {user.name?.slice(0, 2).toUpperCase()}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                  <div className="w-48 h-16 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          ) : !weddingId ? (
            <div className="text-center text-gray-400 mt-12">
              No wedding found. Ask your planner for an invite.
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-12">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((msg: any) => {
                const isMe = msg.user?.id === user.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-sm rounded-lg p-4 ${
                        isMe
                          ? "bg-[#1B2B4B] text-white"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1 opacity-75">{msg.user?.name}</p>
                      <p className="text-sm mb-2">{msg.text}</p>
                      <p className="text-xs opacity-50">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="bg-white border-t border-gray-100 p-6">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Type your message..."
              disabled={!weddingId}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || !weddingId || sending}
              className="px-6 py-2.5 bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {sending ? "..." : "Send"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
