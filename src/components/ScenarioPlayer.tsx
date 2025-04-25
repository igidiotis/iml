"use client";
import { useEffect, useState } from "react";
import { IntegrityGauge } from "./IntegrityGauge";

interface Node {
  text: string;
  options: { label: string; score: number }[];
}

export default function ScenarioPlayer({
  participant,
  persona,
  onFinished,        // callback when dilemma ends
}: {
  participant: string;
  persona: string;
  onFinished: (finalScore: number) => void;
}) {
  const [node, setNode] = useState<Node | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch("/api/scenario", {
      method: "POST",
      body: JSON.stringify({ persona }),
    })
      .then((r) => r.json())
      .then(setNode);
  }, [persona]);

  if (!node) return <p>Loading scenario…</p>;

  const choose = (opt: Node["options"][number]) => {
    setScore((s) => s + opt.score);
    // no branches, single-step dilemma; call finish
    onFinished(score + opt.score);
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-700">{node.text}</p>
      {node.options.map((o) => (
        <button
          key={o.label}
          onClick={() => choose(o)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2"
        >
          {o.label}
        </button>
      ))}
      <IntegrityGauge score={score} />
    </div>
  );
} 