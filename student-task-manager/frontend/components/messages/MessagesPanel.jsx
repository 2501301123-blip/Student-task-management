"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { createMessage } from "@/lib/api";

export default function MessagesPanel({ initialMessages, team }) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [sender, setSender] = useState(team[0]?._id || "");
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !sender) return;
    setSending(true);
    try {
      const message = await createMessage({ text, sender, channel: "general" });
      setMessages((prev) => [...prev, message]);
      setText("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="card flex flex-col h-[calc(100vh-160px)]">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800">
        <h3 className="font-semibold text-gray-800 dark:text-slate-100"># general</h3>
        <p className="text-xs text-gray-400 dark:text-slate-500">Team channel for the capstone project</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((m) => (
          <div key={m._id} className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
              style={{ backgroundColor: m.sender?.avatarColor || "#6366f1" }}
            >
              {m.sender?.name?.charAt(0) || "?"}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-sm font-medium text-gray-800 dark:text-slate-100">{m.sender?.name || "Unknown"}</p>
                <span className="text-[11px] text-gray-400 dark:text-slate-500">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 mt-0.5">{m.text}</p>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-10">No messages yet. Say hello!</p>}
      </div>

      <form onSubmit={handleSend} className="px-5 py-4 border-t border-gray-100 dark:border-slate-800 flex items-center gap-3">
        <select
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          className="text-xs border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
        >
          {team.map((m) => (
            <option key={m._id} value={m._id}>{m.name}</option>
          ))}
        </select>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
        />
        <button
          type="submit"
          disabled={sending}
          className="w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center disabled:opacity-60"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
