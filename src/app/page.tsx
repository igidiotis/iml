import ScenarioPlayer from "@/components/ScenarioPlayer";
import { TeacherChat } from "@/components/TeacherChat";

export default function Home() {
  const participant = "anon-" + Math.random().toString(36).slice(2, 8);
  return (
    <main className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Integrity Mirror Lab</h1>
      <ScenarioPlayer participant={participant} />
      <TeacherChat endpoint="now" />
      <TeacherChat endpoint="future" />
    </main>
  );
} 