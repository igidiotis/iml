"use client";
import { useState } from "react";
import PersonaPicker from "@/components/PersonaPicker";
import ScenarioPlayer from "@/components/ScenarioPlayer";
import { TeacherChat } from "@/components/TeacherChat";

export default function Home() {
  const [persona, setPersona] = useState<string | null>(null);
  const participant = "anon-" + Math.random().toString(36).slice(2, 8);
  if (!persona) return <PersonaPicker onDone={setPersona} />;

  return (
    /* existing pretty layout, but pass persona down */
    <main className="min-h-screen bg-gray-100 p-8">
      {/* header */}
      <ScenarioPlayer participant={participant} persona={persona} />
      {/* chats */}
    </main>
  );
} 