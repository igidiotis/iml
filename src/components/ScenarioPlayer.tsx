"use client";
import * as React from "react";
import { useState } from "react";
import { scenario, DecisionNode } from "../data/scenario";
import { IntegrityGauge } from "./IntegrityGauge";

export default function ScenarioPlayer({ participant }: { participant: string }) {
  const [node, setNode] = useState<DecisionNode>(scenario.start);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  async function choose(opt: (typeof node.options)[0]) {
    setIsLoading(true);
    
    try {
      await fetch("/api/log", {
        method: "POST",
        body: JSON.stringify({
          participant,
          event_type: "decision",
          payload: { node: node.id, choice: opt.label, score: opt.score },
        }),
      });
      
      // Add current text to history
      setHistory(prev => [...prev, `${node.text} → ${opt.label}`]);
      
      // Update score and move to next node
      setScore((s) => s + opt.score);
      setNode(scenario[opt.next]);
    } catch (error) {
      console.error("Error logging choice:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Scenario text and options */}
      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <p className="text-gray-800 text-lg mb-5 leading-relaxed">{node.text}</p>
            {node.options.length > 0 ? (
              <div className="flex flex-col gap-3">
                {node.options.map((o) => (
                  <button
                    key={o.label}
                    onClick={() => choose(o)}
                    className="w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-3 transition-colors shadow-sm font-medium"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-indigo-800 font-medium">Scenario complete!</p>
                <button 
                  className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  onClick={() => {
                    setNode(scenario.start);
                    setScore(0);
                    setHistory([]);
                  }}
                >
                  Restart Scenario
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Integrity gauge */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Integrity Score</h3>
        <IntegrityGauge score={score} />
      </div>
      
      {/* History of choices */}
      {history.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Your path so far:</h3>
          <ul className="space-y-2">
            {history.map((step, i) => (
              <li key={i} className="flex items-start text-sm text-gray-600">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium mr-2 flex-shrink-0">
                  {i+1}
                </span>
                <span className="leading-tight">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 