"use client";
import * as React from "react";
import { useState } from "react";

export function TeacherChat({ endpoint }: { endpoint: "now" | "future" }) {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/teacher/${endpoint}`, {
        method: "POST",
        body: JSON.stringify({ question: input }),
      }).then((r) => r.json());
      
      setMessages((m) => [
        ...m, 
        { role: "user", text: input }, 
        { role: "bot", text: res.answer }
      ]);
      setInput("");
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="rounded-lg border border-indigo-200 overflow-hidden shadow-sm">
      <div className={`py-2 px-4 text-white ${endpoint === "now" ? "bg-indigo-600" : "bg-purple-700"}`}>
        <h3 className="font-medium text-sm">
          {endpoint === "now" ? "Teacher-Bot 2025" : "Teacher-Bot 2045"}
        </h3>
      </div>
      
      <div className="p-3 bg-white">
        <div className="h-48 overflow-y-auto mb-3 p-2 bg-gray-50 rounded border border-gray-100">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm italic text-center my-8">
              {endpoint === "now" 
                ? "Ask me about today's academic integrity policies" 
                : "Ask how AI education evolved over 20 years"}
            </p>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`mb-2 p-2 rounded-lg ${
                m.role === "bot" 
                  ? `${endpoint === "now" ? "bg-indigo-50" : "bg-purple-50"} ml-2` 
                  : "bg-gray-100 mr-2"
              }`}>
                <span className={`text-xs font-semibold ${
                  m.role === "bot" 
                    ? `${endpoint === "now" ? "text-indigo-700" : "text-purple-700"}` 
                    : "text-gray-700"
                }`}>
                  {m.role === "bot" 
                    ? (endpoint === "now" ? "Teacher 2025" : "Teacher 2045") 
                    : "You"}:
                </span>
                <p className="text-sm whitespace-pre-wrap">{m.text}</p>
              </div>
            ))
          )}
          {isLoading && (
            <div className="text-center p-2">
              <span className="inline-block animate-pulse text-indigo-600">●●●</span>
            </div>
          )}
        </div>
        
        <div className="flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
          <button 
            onClick={send} 
            disabled={isLoading || !input.trim()}
            className={`px-4 py-2 rounded-r-md text-white text-sm font-medium
              ${endpoint === "now" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-purple-700 hover:bg-purple-800"}
              ${(isLoading || !input.trim()) ? "opacity-50 cursor-not-allowed" : ""}
              transition-colors duration-200`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 