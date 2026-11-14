import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Loader2,
  RotateCcw,
  Send,
} from "lucide-react";
import { ProseMarkdown } from "./ProseMarkdown";
import type {
  NavigationPrefill,
  TutorMessage,
  TutorStyle,
} from "../types/learning";

interface TutorViewProps {
  messages: TutorMessage[];
  prefill: NavigationPrefill | null;
  onClearPrefill: () => void;
  onAddMessages: (msgs: TutorMessage[]) => void;
  onResetChat: () => void;
}

const STARTER_PROMPTS = [
  {
    label: "Quantum Normalization Step-by-Step",
    subject: "Physics",
    topic: "Wavefunction Normalization",
    prompt:
      "Explain why we normalize a wavefunction with ∫|ψ(x)|² dx = 1 and walk through an infinite square well example step by step.",
  },
  {
    label: "1D Dynamic Programming Intuition",
    subject: "Computer Science",
    topic: "0/1 Knapsack Optimization",
    prompt:
      "Why do we iterate capacity backwards when compressing 0/1 Knapsack from a 2D DP table to a 1D array? Show a tiny trace.",
  },
  {
    label: "Stokes' Theorem Mental Model",
    subject: "Mathematics",
    topic: "Vector Calculus",
    prompt:
      "Give me a crisp physical intuition for Stokes' Theorem and show how curl relates to circulation around a boundary.",
  },
];

export const TutorView: React.FC<TutorViewProps> = ({
  messages,
  prefill,
  onClearPrefill,
  onAddMessages,
  onResetChat,
}) => {
  const [subject, setSubject] = useState(prefill?.subject || "Computer Science");
  const [topic, setTopic] = useState(prefill?.topic || "Dynamic Programming");
  const [style, setStyle] = useState<TutorStyle>("intuitive");
  const [input, setInput] = useState(prefill?.prompt || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefill) {
      if (prefill.subject) setSubject(prefill.subject);
      if (prefill.topic) setTopic(prefill.topic);
      if (prefill.prompt) setInput(prefill.prompt);
      onClearPrefill();
    }
  }, [prefill, onClearPrefill]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (overrideText?: string) => {
    const trimmed = (overrideText ?? input).trim();
    if (!trimmed || isLoading) return;

    const nowLabel = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg: TutorMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: nowLabel,
    };

    const nextHistory = [...messages, userMsg];
    onAddMessages([userMsg]);
    if (!overrideText) setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          subject,
          topic,
          style,
        }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !data.reply) {
        throw new Error(
          data.error || "Unable to reach the AI Tutor right now. Please try again."
        );
      }

      const assistantMsg: TutorMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      onAddMessages([assistantMsg]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while contacting the AI Tutor."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] min-h-[560px] flex-col rounded-xl border border-[#E4E3F5] bg-white overflow-hidden">
      {/* Top Tutor Context Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4E3F5] bg-[#F8F9FC] px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="tutor-subject" className="text-xs font-medium text-[#64748B]">
              Subject
            </label>
            <input
              id="tutor-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Physics"
              className="w-36 rounded-lg border border-[#D6D5E9] bg-white px-2.5 py-1.5 text-xs font-medium text-[#161F42] focus:border-[#5B53E6] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="tutor-topic" className="text-xs font-medium text-[#64748B]">
              Topic
            </label>
            <input
              id="tutor-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Potential Wells"
              className="w-44 rounded-lg border border-[#D6D5E9] bg-white px-2.5 py-1.5 text-xs font-medium text-[#161F42] focus:border-[#5B53E6] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex items-center gap-1 rounded-lg bg-[#E4E3F5]/60 p-1"
            role="group"
            aria-label="Explanation style"
          >
            {(
              [
                { id: "intuitive", label: "Intuitive" },
                { id: "step-by-step", label: "Step-by-Step" },
                { id: "exam-prep", label: "Exam Prep" },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setStyle(mode.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  style === mode.id
                    ? "bg-white text-[#161F42] shadow-xs"
                    : "text-[#475569] hover:text-[#161F42]"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onResetChat}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D6D5E9] bg-white px-3 py-1.5 text-xs font-medium text-[#334175] transition-colors hover:bg-[#F1F0FB] whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
        {messages.length <= 2 && (
          <div className="rounded-xl border border-[#E4E3F5] bg-[#F8F9FC] p-4">
            <p className="mb-2.5 text-xs font-medium text-[#64748B]">
              Suggested study prompts
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTER_PROMPTS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setSubject(item.subject);
                    setTopic(item.topic);
                    void sendMessage(item.prompt);
                  }}
                  className="rounded-lg border border-[#D6D5E9] bg-white px-3 py-1.5 text-left text-xs font-medium text-[#161F42] transition-colors hover:border-[#5B53E6] hover:bg-[#F1F0FB]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-3xl rounded-xl px-5 py-4 ${
                msg.role === "user"
                  ? "bg-[#161F42] text-white"
                  : "border border-[#E4E3F5] bg-[#F8F9FC] text-[#111827]"
              }`}
            >
              <div
                className={`mb-1.5 flex items-center justify-between gap-4 text-[11px] font-medium ${
                  msg.role === "user" ? "text-[#C7CBE1]" : "text-[#64748B]"
                }`}
              >
                <span>{msg.role === "user" ? "You" : "LearnLoop AI Tutor"}</span>
                <span className="tabular-nums">{msg.timestamp}</span>
              </div>

              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
                  {msg.content}
                </p>
              ) : (
                <ProseMarkdown content={msg.content} />
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3 rounded-xl border border-[#E4E3F5] bg-[#F8F9FC] px-5 py-3.5 text-sm text-[#334175]">
              <Loader2 className="h-4 w-4 animate-spin text-[#5B53E6]" />
              <span>Working through a clear explanation...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start justify-between gap-4 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs font-medium underline whitespace-nowrap shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage();
        }}
        className="border-t border-[#E4E3F5] bg-white p-4"
      >
        <div className="flex items-end gap-3">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendMessage();
              }
            }}
            placeholder={`Ask anything about ${topic || subject}... (Enter to send, Shift+Enter for new line)`}
            className="flex-1 resize-none rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#64748B] focus:border-[#5B53E6] focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex h-[46px] items-center gap-2 rounded-lg bg-[#161F42] px-5 text-sm font-medium text-white transition-colors hover:bg-[#222E5E] disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>Ask Tutor</span>
          </button>
        </div>
      </form>
    </div>
  );
};
