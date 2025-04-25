"use client";
import * as React from "react";
import { useState } from "react";

// Inline styles with proper React CSSProperties typing
const getStyles = (endpoint: "now" | "future") => {
  const primary = endpoint === "now" ? "#4f46e5" : "#9333ea"; // indigo vs purple
  const light = endpoint === "now" ? "#eef2ff" : "#f5f3ff";   // light indigo vs light purple
  
  return {
    container: {
      borderRadius: "0.5rem", 
      border: "1px solid #e5e7eb",
      overflow: "hidden",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
    } as React.CSSProperties,
    header: {
      padding: "0.5rem 1rem",
      backgroundColor: primary,
      color: "white"
    } as React.CSSProperties,
    headerText: {
      fontSize: "0.875rem",
      fontWeight: 500
    } as React.CSSProperties,
    body: {
      padding: "0.75rem",
      backgroundColor: "white"
    } as React.CSSProperties,
    messageContainer: {
      height: "12rem",
      overflowY: "auto",
      marginBottom: "0.75rem",
      padding: "0.5rem",
      backgroundColor: "#f9fafb",
      borderRadius: "0.375rem",
      border: "1px solid #f3f4f6"
    } as React.CSSProperties,
    emptyMessage: {
      color: "#9ca3af",
      fontSize: "0.875rem",
      fontStyle: "italic",
      textAlign: "center",
      margin: "2rem 0"
    } as React.CSSProperties,
    message: (isBot: boolean) => ({
      marginBottom: "0.5rem",
      padding: "0.5rem",
      borderRadius: "0.375rem",
      marginLeft: isBot ? "0.5rem" : "0",
      marginRight: isBot ? "0" : "0.5rem",
      backgroundColor: isBot ? light : "#f3f4f6"
    } as React.CSSProperties),
    messageSender: (isBot: boolean) => ({
      fontSize: "0.75rem",
      fontWeight: 600,
      color: isBot ? primary : "#4b5563"
    } as React.CSSProperties),
    messageText: {
      fontSize: "0.875rem",
      whiteSpace: "pre-wrap"
    } as React.CSSProperties,
    loadingIndicator: {
      textAlign: "center",
      padding: "0.5rem"
    } as React.CSSProperties,
    loadingDots: {
      display: "inline-block",
      color: primary,
      animation: "pulse 1.5s ease-in-out infinite"
    } as React.CSSProperties,
    inputContainer: {
      display: "flex",
    } as React.CSSProperties,
    input: {
      flexGrow: 1,
      border: "1px solid #d1d5db",
      borderTopLeftRadius: "0.375rem",
      borderBottomLeftRadius: "0.375rem",
      padding: "0.5rem 0.75rem",
      fontSize: "0.875rem",
      outline: "none"
    } as React.CSSProperties,
    sendButton: (disabled: boolean) => ({
      padding: "0.5rem 1rem",
      borderTopRightRadius: "0.375rem",
      borderBottomRightRadius: "0.375rem",
      backgroundColor: disabled ? `${primary}80` : primary,
      color: "white",
      fontSize: "0.875rem",
      fontWeight: 500,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "background-color 0.2s"
    } as React.CSSProperties)
  };
};

export function TeacherChat({ endpoint }: { endpoint: "now" | "future" }) {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Color scheme based on endpoint
  const themeColor = endpoint === "now" ? "indigo" : "purple";
  
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
        { role: "bot", text: res.answer },
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
    <div className="flex flex-col h-80">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm italic text-center mt-16">
            {endpoint === "now" 
              ? "Ask me about today's academic integrity policies" 
              : "Ask how AI education evolved over 20 years"}
          </p>
        ) : (
          messages.map((m, i) => (
            <p 
              key={i} 
              className={m.role === "bot" 
                ? `${themeColor === "indigo" ? "text-indigo-600" : "text-purple-600"}` 
                : "text-gray-800"
              }
            >
              <strong>
                {m.role === "bot" 
                  ? endpoint === "now" ? "Teacher 2025:" : "Teacher 2045:" 
                  : "You:"}
              </strong>{" "}
              {m.text}
            </p>
          ))
        )}
        {isLoading && (
          <div className="text-center py-2">
            <span className={`inline-block animate-pulse ${themeColor === "indigo" ? "text-indigo-500" : "text-purple-500"}`}>
              ●●●
            </span>
          </div>
        )}
      </div>
      
      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none"
          placeholder="Ask a question..."
          disabled={isLoading}
        />
        <button 
          onClick={send} 
          disabled={isLoading || !input.trim()}
          className={`${themeColor === "indigo" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-purple-600 hover:bg-purple-700"} text-white rounded-r-lg px-4 transition-colors`}
        >
          Send
        </button>
      </div>
    </div>
  );
} 