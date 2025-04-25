"use client";
import { useState } from "react";

export function TeacherChat({ endpoint }: { endpoint: "now" | "future" }) {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  async function send() {
    const res = await fetch(`/api/teacher/${endpoint}`, {
      method: "POST",
      body: JSON.stringify({ question: input }),
    }).then((r) => r.json());
    setMessages((m) => [...m, { role: "user", text: input }, { role: "bot", text: res.answer }]);
    setInput("");
  }

  return (
    <div className="border rounded p-4 space-y-2">
      <h3 className="font-semibold">{endpoint === "now" ? "Teacher-Bot Now" : "Teacher-Bot 2045"}</h3>
      <div className="h-40 overflow-y-auto bg-gray-50 p-2">
        {messages.map((m, i) => (
          <p key={i} className={m.role === "bot" ? "text-indigo-600" : ""}>
            <strong>{m.role}:</strong> {m.text}
          </p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border px-2 py-1"
      />
      <button onClick={send} className="bg-green-600 text-white rounded px-3 py-1">
        Send
      </button>
    </div>
  );
} 