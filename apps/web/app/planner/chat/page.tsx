"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { apiFetch } from "@/lib/api";

export default function PlannerChat() {
  const router   = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [user,       setUser]       = useState<any>(null);
  const [weddings,   setWeddings]   = useState<any[]>([]);
  const [wedding,    setWedding]    = useState<any>(null);
  const [messages,   setMessages]   = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [sending,    setSending]    = useState(false);
//Nethononda
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { router.push("/auth/login"); return; }
    setUser(JSON.parse(userData));

    apiFetch("/weddings").then((ws: any[]) => {
      setWeddings(ws);
      if (ws[0]) loadMessages(ws[0]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadMessages(w: any) {
    setWedding(w);
    setMessages([]);
    setLoading(true);
    try {
      const msgs = await apiFetch(`/chat/${w.id}`);
      setMessages(msgs);
    } catch {}
    setLoading(false);
  }

  async function handleSend() {
    if (!newMessage.trim() || !wedding) return;
    setSending(true);
    try {
      const msg = await apiFetch(`/chat/${wedding.id}`, {
        method: "POST",
        body: JSON.stringify({ text: newMessage }),
      });
      setMessages(prev => [...prev, msg]);
      setNewMessage("");
    } catch {}
    setSending(false);
  }

  if (!user) return null;

  const ROLE_COLOR: Record<string, string> = {
    planner: "bg-[#1B2B4B]",
    couple:  "bg-[#8b4a6b]",
  };

  return (
    <div className="flex min-h-screen bg-[#f7f3ee] dark:bg-[#0d1117]">
      <Sidebar />
      <main className="ml-64 flex-1 flex flex-col h-screen">
        {/* Top bar */}
        <div className="h-14 bg-white dark:bg-[#161b22] border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-serif text-xl text-[#1f2937] dark:text-white">Chat</h1>
              <p className="text-xs text-gray-400 -mt-0.5">Wedding planning discussion</p>
            </div>
            {/* Wedding selector */}
            {weddings.length > 1 && (
              <select
                value={wedding?.id ?? ""}
                onChange={e => {
                  const w = weddings.find(w => w.id === e.target.value);
                  if (w) loadMessages(w);
                }}
                className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/25"
              >
                {weddings.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            )}
            {wedding && weddings.length === 1 && (
              <span className="text-sm font-medium text-[#1B2B4B] dark:text-blue-300 bg-[#1B2B4B]/10 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                {wedding.name}
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
            {user.name?.slice(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              {[1,2,3].map(i => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                  <div className="w-56 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
                </div>
              ))}
            </div>
          ) : !wedding ? (
            <div className="text-center text-gray-400 dark:text-gray-500 mt-24">
              <p className="text-4xl mb-3">💬</p>
              <p>No weddings found. Create a wedding first.</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-500 mt-24">
              <p className="text-4xl mb-3">👋</p>
              <p className="font-medium text-gray-500 dark:text-gray-400">No messages yet</p>
              <p className="text-sm mt-1">Start the conversation with the couple!</p>
            </div>
          ) : (
            <div className="space-y-3 max-w-3xl mx-auto">
              {messages.map((msg: any, i: number) => {
                const isMe = msg.user?.id === user.id;
                const showName = i === 0 || messages[i - 1]?.user?.id !== msg.user?.id;
                const avatarColor = ROLE_COLOR[msg.user?.role] ?? "bg-gray-400";
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}>
                    {/* Avatar — only show on first of a run */}
                    <div className={`w-8 h-8 rounded-full ${avatarColor} text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 ${!showName ? "invisible" : ""}`}>
                      {msg.user?.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className={`max-w-sm ${isMe ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                      {showName && (
                        <p className={`text-xs font-medium text-gray-500 dark:text-gray-400 px-1 ${isMe ? "text-right" : ""}`}>
                          {isMe ? "You" : msg.user?.name}
                          {msg.user?.role && msg.user.role !== "planner" && (
                            <span className="ml-1 text-[10px] text-gray-400 capitalize">({msg.user.role})</span>
                          )}
                        </p>
                      )}
                      <div className={`rounded-2xl px-4 py-2.5 ${
                        isMe
                          ? "bg-gradient-to-br from-[#1B2B4B] to-[#2d4070] text-white rounded-tr-sm"
                          : "bg-white dark:bg-[#1f2937] border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white rounded-tl-sm"
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <p className={`text-[10px] text-gray-400 dark:text-gray-600 px-1 ${isMe ? "text-right" : ""}`}>
                        {new Date(msg.createdAt).toLocaleString("en-ZA", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-[#161b22] border-t border-gray-100 dark:border-gray-800 p-4 flex-shrink-0">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={wedding ? `Message ${wedding.name}…` : "Select a wedding to start chatting"}
              disabled={!wedding || sending}
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30 disabled:opacity-50 transition"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || !wedding || sending}
              className="px-6 py-2.5 bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {sending ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                </span>
              ) : "Send ↑"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
