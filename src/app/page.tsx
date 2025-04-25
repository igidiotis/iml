"use client";

import * as React from "react";
import ScenarioPlayer from "../components/ScenarioPlayer";
import { TeacherChat } from "../components/TeacherChat";

export default function Home() {
  const participant = "anon-" + Math.random().toString(36).slice(2, 8);

  return (
    <main className="p-6 max-w-6xl mx-auto min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-8 pt-4">Integrity Mirror Lab</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main scenario column - takes up more space */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border border-indigo-100">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Ethics Scenario</h2>
          <ScenarioPlayer participant={participant} />
        </div>

        {/* Side panel with teacher chats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-indigo-100">
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">Teacher Perspectives</h2>
            <p className="text-sm text-gray-600 mb-4">Ask questions about academic integrity to see how perspectives differ across time.</p>
            
            <div className="space-y-6">
              <TeacherChat endpoint="now" />
              <TeacherChat endpoint="future" />
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Integrity Mirror Lab | Academic Ethics Training</p>
      </footer>
    </main>
  );
} 