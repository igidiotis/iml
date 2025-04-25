"use client";
import { useState } from "react";
import { scenario, DecisionNode } from "@/data/scenario";
import { IntegrityGauge } from "./IntegrityGauge";

export default function ScenarioPlayer({ participant }: { participant: string }) {
  const [node, setNode] = useState<DecisionNode>(scenario.start);
  const [score, setScore] = useState(0);

  async function choose(opt: (typeof node.options)[0]) {
    await fetch("/api/log", {
      method: "POST",
      body: JSON.stringify({
        participant,
        event_type: "decision",
        payload: { node: node.id, choice: opt.label, score: opt.score },
      }),
    });
    setScore((s) => s + opt.score);
    setNode(scenario[opt.next]);
  }

  return (
    <div className="space-y-4">
      <p>{node.text}</p>
      <div className="flex flex-col gap-2">
        {node.options.map((o) => (
          <button
            key={o.label}
            className="rounded bg-indigo-600 px-4 py-2 text-white"
            onClick={() => choose(o)}
          >
            {o.label}
          </button>
        ))}
      </div>
      <IntegrityGauge score={score} />
    </div>
  );
} 