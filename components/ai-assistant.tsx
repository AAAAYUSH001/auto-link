"use client";

import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { Button, Card } from "@/components/ui";

export function AiAssistant() {
  const [query, setQuery] = useState("I want a diesel car under 5 lakh");
  const [answer, setAnswer] = useState("Ask about your budget, fuel choice, or usage, and I will recommend from the current live listings.");
  const [loading, setLoading] = useState(false);

  async function ask() {
    setLoading(true);
    const response = await fetch("/api/ai/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    const data = await response.json();
    setAnswer(data.answer);
    setLoading(false);
  }

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-signal p-3 text-ink"><Bot className="h-5 w-5" /></div>
        <div>
          <h3 className="font-semibold">AI Car Concierge</h3>
          <p className="text-sm text-white/60">Budget matching, comparison, EMI, and recommendations.</p>
        </div>
      </div>
      <div className="rounded-lg bg-black/35 p-4 text-sm leading-6 text-white/76">{loading ? "Thinking through listings..." : answer}</div>
      <div className="mt-4 flex gap-2">
        <input
          suppressHydrationWarning
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-11 min-w-0 flex-1 rounded-lg border border-white/12 bg-white/7 px-3 text-sm outline-none focus:border-signal"
          aria-label="Ask AI assistant"
        />
        <Button onClick={ask} aria-label="Send">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
