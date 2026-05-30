"use client";

import { useEffect, useState } from "react";

type Session = {
  ID: string;
  USER_ID: string;
  TOPIC: string;
  QUESTION: string;
  AI_RESPONSE: string;
  SCORE: number;
  CREATED_AT: string;
  THREAD_ID?: string;
};

export default function DashboardPage() {
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("Algorithms");
  const [answer, setAnswer] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadSessions() {
    const res = await fetch("/api/study-sessions");
    const data = await res.json();
    if (data.success) setSessions(data.data);
  }

  async function askAI() {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "han123",
        topic,
        question,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setAnswer(data.aiResponse);
      setQuestion("");
      await loadSessions();
    } else {
      setAnswer(data.error || "Something went wrong.");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-radial p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <h1 className="text-4xl font-bold">StudyChain AI Dashboard</h1>
          <p className="text-muted-foreground">
            Learn with AI, remember with Backboard, track with Snowflake.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-muted-foreground">Study Sessions</p>
            <h2 className="text-3xl font-bold">{sessions.length}</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-muted-foreground">Topics Learned</p>
            <h2 className="text-3xl font-bold">
              {new Set(sessions.map((s) => s.TOPIC)).size}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-muted-foreground">Memory Status</p>
            <h2 className="text-3xl font-bold">
              {sessions.some((s) => s.THREAD_ID) ? "Active" : "New"}
            </h2>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <h2 className="mb-4 text-2xl font-bold">Ask AI Tutor</h2>

            <label className="mb-2 block text-sm">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mb-4 w-full rounded-lg border border-white/10 bg-black/30 p-3 outline-none"
            />

            <label className="mb-2 block text-sm">Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              className="min-h-32 w-full rounded-lg border border-white/10 bg-black/30 p-3 outline-none"
            />

            <button
              onClick={askAI}
              disabled={loading}
              className="mt-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 font-semibold disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Ask AI"}
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <h2 className="mb-4 text-2xl font-bold">AI Response</h2>
            <div className="max-h-[500px] overflow-y-auto whitespace-pre-wrap rounded-lg bg-black/30 p-4 text-sm leading-6">
              {answer || "Your AI answer will appear here."}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
          <h2 className="mb-4 text-2xl font-bold">Recent Study Sessions</h2>

          <div className="space-y-4">
            {sessions.length === 0 && (
              <p className="text-muted-foreground">No study sessions yet.</p>
            )}

            {sessions.slice(0, 10).map((session) => (
              <div
                key={session.ID}
                className="rounded-xl border border-white/10 bg-black/30 p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <h3 className="font-semibold">{session.TOPIC}</h3>
                  <span className="text-xs text-muted-foreground">
                    {new Date(session.CREATED_AT).toLocaleString()}
                  </span>
                </div>

                <p className="mb-2 text-sm">
                  <span className="font-semibold">Q:</span> {session.QUESTION}
                </p>

                <p className="line-clamp-3 text-sm text-muted-foreground">
                  <span className="font-semibold">AI:</span>{" "}
                  {session.AI_RESPONSE}
                </p>

                {session.THREAD_ID && (
                  <p className="mt-2 text-xs text-green-400">
                    Backboard memory active
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}