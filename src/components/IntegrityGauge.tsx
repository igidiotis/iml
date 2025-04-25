"use client";
import * as React from "react";
import { useEffect, useRef } from "react";

export function IntegrityGauge({ score }: { score: number }) {
  // Get color based on score
  const getColor = (score: number) => {
    if (score <= -2) return "#ef4444"; // red
    if (score < 0) return "#fb923c";   // orange
    if (score === 0) return "#fbbf24";  // yellow
    if (score <= 2) return "#4ade80";  // light green
    return "#22c55e";                  // green
  };

  // Calculate percentage for progress bar (score from -4 to +4)
  const percentage = ((score + 4) / 8) * 100;
  
  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Integrity Score</h3>
      
      <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: getColor(score) 
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color: score !== 0 ? "white" : "black" }}>
            {score}
          </span>
        </div>
      </div>
      
      <div className="w-full flex justify-between mt-1 text-xs text-gray-600">
        <span>-4</span>
        <span>+4</span>
      </div>
      
      <div className="mt-3 text-sm text-center text-gray-600">
        {score <= -3 && "Very low integrity - serious ethical concerns!"}
        {score > -3 && score <= -1 && "Low integrity - reconsider your choices."}
        {score > -1 && score < 1 && "Neutral integrity - room for improvement."}
        {score >= 1 && score < 3 && "Good integrity - ethically sound choices."}
        {score >= 3 && "Excellent integrity - exemplary ethical standards!"}
      </div>
    </div>
  );
} 