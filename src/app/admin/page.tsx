"use client";
import { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { supabase } from "@/lib/supabaseClient";

// Register Chart.js components
Chart.register(...registerables);

interface SessionData {
  id: string;
  persona: string;
  grand_concern: string;
  created_at: string;
  theme?: string;
}

export default function AdminPage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from("sessions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching sessions:", error);
          return;
        }

        setSessions(data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (sessions.length === 0 || !chartRef.current) return;

    // Clean up previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Process data for the chart - count occurrences of each theme
    const themeCounts: Record<string, number> = {};
    sessions.forEach(session => {
      const theme = session.theme || "Unknown";
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });

    // Prepare data for the chart
    const themes = Object.keys(themeCounts);
    const counts = Object.values(themeCounts);

    // Create a new chart
    const ctx = chartRef.current.getContext("2d");
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: themes,
          datasets: [
            {
              label: "Theme Distribution",
              data: counts,
              backgroundColor: "rgba(75, 85, 229, 0.7)",
              borderColor: "rgba(75, 85, 229, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Session Themes Distribution",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
          },
        },
      });
    }
  }, [sessions]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Theme Distribution</h2>
            <div className="h-96">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
            {sessions.length === 0 ? (
              <p className="text-gray-500">No sessions found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Persona</th>
                      <th className="px-4 py-2 text-left">Grand Concern</th>
                      <th className="px-4 py-2 text-left">Theme</th>
                      <th className="px-4 py-2 text-left">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr key={session.id} className="border-b">
                        <td className="px-4 py-2">{session.persona}</td>
                        <td className="px-4 py-2">{session.grand_concern}</td>
                        <td className="px-4 py-2">{session.theme || "N/A"}</td>
                        <td className="px-4 py-2">
                          {new Date(session.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 