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

type ChatStatusPayload = {
  configured?: boolean;
};

const suggestedQuestions = [
  "How is AI used in this portfolio?",
  "What technologies does Joshua use most?",
  "Tell me about Joshua's internship experience.",
  "What role is Joshua currently looking for?",
];

function getIntroMessage(developerName: string, configured: boolean): string {
  return configured
    ? `Hi, I'm ${developerName}'s AI portfolio assistant. Ask about projects, experience, skills, or how AI is used in this site.`
    : "Live OpenAI chat is currently disabled. Add OPENAI_API_KEY to .env.local or Vercel project settings to enable it.";
}

export default function Chatbox({
  developerName,
  isConfigured,
  mode = "full",
}: ChatboxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runtimeConfigured, setRuntimeConfigured] = useState(isConfigured);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const canSubmit = useMemo(
    () => runtimeConfigured && input.trim().length > 0 && !loading,
    [input, loading, runtimeConfigured],
  );
  const isEmbedded = mode === "embedded";
  const isLauncher = mode === "launcher";
  const suggestionItems = isLauncher ? suggestedQuestions.slice(0, 2) : suggestedQuestions;
  const introMessage = getIntroMessage(developerName, runtimeConfigured);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    let isCancelled = false;

    async function loadStatus() {
      try {
        const response = await fetch("/api/chat/status", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as ChatStatusPayload;

        if (!isCancelled && typeof payload.configured === "boolean") {
          setRuntimeConfigured(payload.configured);
        }
      } catch {
        // Keep the server-provided fallback state if status lookup fails.
      }
    }

    void loadStatus();

    return () => {
      isCancelled = true;
    };
  }, []);

  async function sendMessage(content: string) {
    const trimmed = content.trim();

    if (!trimmed || loading || !runtimeConfigured) {
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
      data-chat-mode={mode}
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
            disabled={!runtimeConfigured || loading}
            className="chat-chip px-3 py-1 text-xs font-semibold"
          >
            {question}
          </button>
        ))}
      </div>

      <div
        className={`chat-thread overflow-y-auto rounded-2xl p-4 ${
          isLauncher
            ? "h-[220px] sm:h-[300px]"
            : isEmbedded
              ? "h-[360px]"
              : "h-[460px] sm:p-5"
        }`}
      >
        <div className="space-y-4">
          <div data-role="assistant" className="chat-message text-sm">
            {introMessage}
          </div>

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
          disabled={!runtimeConfigured}
          placeholder={
            runtimeConfigured
              ? "Ask about Joshua's projects, stack, experience, or AI integration..."
              : "Set OPENAI_API_KEY to enable live assistant mode."
          }
          className="chat-textarea w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none transition"
        />

        <div
          className={`flex gap-3 ${
            isLauncher ? "justify-end" : "items-center justify-between"
          }`}
        >
          {!isLauncher ? (
            <p className="text-xs text-slate-500">Shift + Enter for a new line.</p>
          ) : null}
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
