"use client";
import { useState } from "react";
import PersonaPicker from "@/components/PersonaPicker";
import ScenarioPlayer from "@/components/ScenarioPlayer";
import { TeacherChat } from "@/components/TeacherChat";
import PostSurvey from "@/components/PostSurvey";

export default function Home() {
  const [persona, setPersona] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [surveyDone, setSurveyDone] = useState<boolean>(false);
  const participant = "anon-" + Math.random().toString(36).slice(2, 8);

  if (!persona) return <PersonaPicker onDone={setPersona} />;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Integrity Mirror Lab</h1>
      </header>

      {/* Phase 1 – personalised dilemma */}
      {!score && (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
          <ScenarioPlayer
            participant={participant}
            persona={persona}
            onFinished={setScore}
          />
        </div>
      )}

      {/* Phase 2 – dual teacher chats */}
      {score !== null && !surveyDone && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <TeacherChat endpoint="now" />
          <TeacherChat endpoint="future" />
        </div>
      )}

      {/* Phase 3 – micro-survey */}
      {score !== null && !surveyDone && (
        <PostSurvey
          onDone={(s) => {
            fetch("/api/log", {
              method: "POST",
              body: JSON.stringify({
                participant,
                persona,
                event_type: "survey",
                payload: { agreement: s, score_before: score },
              }),
            });
            setSurveyDone(true);
          }}
        />
      )}

      {/* Phase 4 – debrief */}
      {surveyDone && (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Thank you!</h2>
          <p className="mb-4">
            Your reflection has been saved. You can download your session data below.
          </p>
          <a
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify({ participant, persona }, null, 2)
            )}`}
            download={`IML-${participant}.json`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Download
          </a>
        </div>
      )}
    </main>
  );
} 