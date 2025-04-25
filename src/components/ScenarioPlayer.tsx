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
      {/* Scenario text panel */}
      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 relative min-h-[160px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-medium text-indigo-900 mb-4">{node.text}</h3>
            {node.options.length > 0 ? (
              <div className="flex flex-col gap-2">
                {node.options.map((o) => (
                  <button
                    key={o.label}
                    className="rounded-md bg-indigo-600 px-4 py-2.5 text-white text-sm font-medium
                      hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                      transition-colors duration-200 shadow-sm"
                    onClick={() => choose(o)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-indigo-800 font-medium">Scenario complete!</p>
                <button 
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
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
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <IntegrityGauge score={score} />
      </div>
      
      {/* History of choices */}
      {history.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Your path so far:</h4>
          <ul className="space-y-1 text-xs text-gray-600">
            {history.map((step, i) => (
              <li key={i} className="flex items-start">
                <span className="inline-block w-5 h-5 bg-indigo-100 text-indigo-800 rounded-full text-xs flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  {i+1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 