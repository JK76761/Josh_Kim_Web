"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatboxProps = {
  developerName: string;
  isConfigured: boolean;
  mode?: "full" | "embedded" | "launcher";
};

type ChatPayload = {
  answer?: string;
  error?: string;
};

const suggestedQuestions = [
  "How is AI used in this portfolio?",
  "What technologies does Joshua use most?",
  "Tell me about Joshua's internship experience.",
  "What role is Joshua currently looking for?",
];

export default function Chatbox({
  developerName,
  isConfigured,
  mode = "full",
}: ChatboxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: isConfigured
        ? `Hi, I'm ${developerName}'s AI portfolio assistant. Ask about projects, experience, skills, or how AI is used in this site.`
        : "Live OpenAI chat is currently disabled. Add OPENAI_API_KEY to .env.local or Vercel project settings to enable it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const canSubmit = useMemo(
    () => isConfigured && input.trim().length > 0 && !loading,
    [input, isConfigured, loading],
  );
  const isEmbedded = mode === "embedded";
  const isLauncher = mode === "launcher";
  const suggestionItems = isLauncher ? suggestedQuestions.slice(0, 3) : suggestedQuestions;

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(content: string) {
    const trimmed = content.trim();

    if (!trimmed || loading || !isConfigured) {
      return;
    }

    const nextUserMessage: Message = { role: "user", content: trimmed };
    const history = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setMessages((current) => [...current, nextUserMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          history,
        }),
      });

      const payload = (await response.json()) as ChatPayload;

      if (!response.ok) {
        throw new Error(payload.error || `Chat request failed (${response.status})`);
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            payload.answer ||
            "OpenAI returned an empty response. Try a different question.",
        },
      ]);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "I could not reach the assistant. Check API settings and try again.";

      setError(message);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `Request failed: ${message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessage(input);
  }

  return (
    <section
      className={`chat-shell ${
        isLauncher ? "p-3 sm:p-4" : isEmbedded ? "p-4" : "p-4 sm:p-6"
      }`}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {suggestionItems.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => sendMessage(question)}
            disabled={!isConfigured || loading}
            className="chat-chip px-3 py-1 text-xs font-semibold"
          >
            {question}
          </button>
        ))}
      </div>

      <div
        className={`chat-thread overflow-y-auto rounded-2xl p-4 ${
          isLauncher
            ? "h-[280px] sm:h-[320px]"
            : isEmbedded
              ? "h-[360px]"
              : "h-[460px] sm:p-5"
        }`}
      >
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              data-role={message.role}
              className="chat-message text-sm"
              style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
            >
              {message.content}
            </div>
          ))}

          {loading ? (
            <div data-role="assistant" className="chat-message text-sm">
              <span className="typing-dots" aria-label="Assistant is typing">
                <span />
                <span />
                <span />
              </span>
            </div>
          ) : null}

          <div ref={endOfMessagesRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();

              if (canSubmit) {
                void sendMessage(input);
              }
            }
          }}
          rows={isLauncher ? 2 : isEmbedded ? 2 : 3}
          disabled={!isConfigured}
          placeholder={
            isConfigured
              ? "Ask about Joshua's projects, stack, experience, or AI integration..."
              : "Set OPENAI_API_KEY to enable live assistant mode."
          }
          className="chat-textarea w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none transition"
        />

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">Shift + Enter for a new line.</p>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-5 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/30 hover:bg-cyan-300/14 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </div>

        {error ? <p className="text-xs text-rose-300">{error}</p> : null}
      </form>
    </section>
  );
}
