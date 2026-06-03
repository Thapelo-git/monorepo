"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function CoupleChat() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    setMessages([
      {
        id: "1",
        sender: "Grace Mokoena",
        role: "planner",
        text: "Welcome to your wedding planning board! 🎉 Let's make this perfect.",
        timestamp: "2026-04-10 10:30",
      },
      {
        id: "2",
        sender: "John & Sarah",
        role: "couple",
        text: "Thank you Grace! We're so excited to get started.",
        timestamp: "2026-04-10 10:35",
      },
      {
        id: "3",
        sender: "Grace Mokoena",
        role: "planner",
        text: "I've created your task board. Let's start with venue confirmation this week.",
        timestamp: "2026-04-10 10:45",
      },
      {
        id: "4",
        sender: "John & Sarah",
        role: "couple",
        text: "Perfect! We have a site visit scheduled for Thursday.",
        timestamp: "2026-04-10 11:00",
      },
    ]);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        sender: user?.name,
        role: "couple",
        text: newMessage,
        timestamp: new Date().toLocaleString(),
      },
    ]);
    setNewMessage("");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#f7f3ee]">
      <Sidebar />

      <main className="ml-64 flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-serif text-xl text-[#1f2937]">Chat</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Wedding planning discussion</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">🔔</button>
            <div className="w-8 h-8 rounded-full bg-[#1B2B4B] text-white flex items-center justify-center text-xs font-semibold">
              {user.name?.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "couple" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-sm rounded-lg p-4 ${
                    msg.role === "couple"
                      ? "bg-[#1B2B4B] text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-xs font-semibold mb-1 opacity-75">{msg.sender}</p>
                  <p className="text-sm mb-2">{msg.text}</p>
                  <p className="text-xs opacity-50">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-100 p-6">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2B4B]/30"
            />
            <button
              onClick={handleSendMessage}
              className="px-6 py-2.5 bg-gradient-to-r from-[#1B2B4B] to-[#8b4a6b] text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
