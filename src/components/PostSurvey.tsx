"use client";
export default function PostSurvey({ onDone }: { onDone: (score: number) => void }) {
  return (
    <div className="my-6 space-y-2">
      <p className="font-medium">Looking back from 2045, AI-assisted work is ethical…</p>
      <input
        type="range"
        min={1}
        max={7}
        defaultValue={4}
        onChange={(e) => onDone(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs px-1">
        <span>Strongly disagree</span><span>Strongly agree</span>
      </div>
    </div>
  );
} 