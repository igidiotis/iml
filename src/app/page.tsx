"use client";

import * as React from "react";
import { useEffect } from "react";
import ScenarioPlayer from "../components/ScenarioPlayer";
import { TeacherChat } from "../components/TeacherChat";

export default function Home() {
  const participant = "anon-" + Math.random().toString(36).slice(2, 8);
  
  // Media query for responsive layout
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    
    function updateStyles() {
      const gridElement = document.getElementById('main-grid');
      if (gridElement) {
        if (mediaQuery.matches) {
          // Desktop view - 2 column grid
          gridElement.style.gridTemplateColumns = '2fr 1fr';
        } else {
          // Mobile view - stacked layout
          gridElement.style.gridTemplateColumns = '1fr';
        }
      }
    }
    
    // Set initial styles
    updateStyles();
    
    // Add listener for viewport changes
    mediaQuery.addEventListener('change', updateStyles);
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', updateStyles);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Integrity Mirror Lab</h1>
          <p className="mt-2 text-gray-600">Explore academic integrity through AI-powered role play.</p>
        </header>

        {/* Scenario card */}
        <section className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Ethics Scenario</h2>
          <ScenarioPlayer participant={participant} />
        </section>

        {/* Chat cards */}
        <section id="main-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Teacher-Bot 2025</h2>
            <TeacherChat endpoint="now" />
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Teacher-Bot 2045</h2>
            <TeacherChat endpoint="future" />
          </div>
        </section>
      </div>
    </main>
  );
} 