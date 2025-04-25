"use client";
import { useState } from "react";

const personas = [
  { id: "educator",    label: "Lead Educator 2045", icon: "📚" },
  { id: "policy",      label: "Policy Architect 2045", icon: "🛡️" },
  { id: "mentor",      label: "AI Mentor 2045", icon: "🤖" },
  { id: "equity",      label: "Equity Ombud 2045", icon: "⚖️" },
];

export default function PersonaPicker({ onDone }: { onDone: (p: string) => void }) {
  const [persona, setPersona] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-96 space-y-6 shadow-xl">
        <h2 className="text-2xl font-bold text-center">Choose your future self</h2>
        <div className="grid grid-cols-2 gap-4">
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => setPersona(p.label)}
              className={`border rounded-xl p-4 text-center space-y-1 ${
                persona === p.label ? "border-indigo-600" : "border-gray-300"
              }`}
            >
              <div className="text-3xl">{p.icon}</div>
              <div className="text-sm">{p.label}</div>
            </button>
          ))}
        </div>
        <button
          disabled={!persona}
          onClick={() => onDone(persona!)}
          className="w-full bg-indigo-600 disabled:bg-gray-400 text-white rounded-lg py-2"
        >
          Start
        </button>
      </div>
    </div>
  );
} 