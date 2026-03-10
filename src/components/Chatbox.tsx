"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatboxProps = {
  developerName: string;
  mode?: "full" | "embedded" | "launcher" | "hero" | "overlay";
};

type ChatPayload = {
  answer?: string;
  error?: string;
};

type StatusPayload = {
  configured?: boolean;
  model?: string;
  provider?: string;
};

type AssistantState = "checking" | "ready" | "disabled";

const suggestedQuestions = [
  {
    label: "Recruiters",
    prompt: "What should recruiters know first?",
  },
  {
    label: "Tech Stack",
    prompt: "What technologies does Joshua use most?",
  },
  {
    label: "Experience",
    prompt: "Tell me about Joshua's internship experience.",
  },
  {
    label: "Career",
    prompt: "What role is Joshua currently looking for?",
  },
];

const launcherCategories = [
  {
    label: "Projects",
    prompt: "Which projects best represent Joshua Kim's work?",
  },
  {
    label: "Experience",
    prompt: "Tell me about Joshua's internship experience.",
  },
  {
    label: "Stack",
    prompt: "What technologies does Joshua use most?",
  },
  {
    label: "AI Use",
    prompt: "How is AI used in this portfolio?",
  },
];

function getIntroMessage(
  developerName: string,
  mode: "full" | "embedded" | "launcher" | "hero" | "overlay",
): string {
  if (mode === "launcher") {
    return `Hi, I'm ${developerName}'s AI assistant. Ask about projects, stack, experience, or career focus.`;
  }

  if (mode === "overlay") {
    return `Hi, I'm ${developerName}'s AI assistant. Ask about projects, experience, stack, or career direction.`;
  }

  return `Hi, I'm ${developerName}'s AI assistant. Ask about projects, experience, technical strengths, or current career focus.`;
}

export default function Chatbox({
  developerName,
  mode = "full",
}: ChatboxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assistantState, setAssistantState] = useState<AssistantState>("checking");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [sessionDisabled, setSessionDisabled] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const isEmbedded = mode === "embedded";
  const isHero = mode === "hero";
  const isLauncher = mode === "launcher";
  const isOverlay = mode === "overlay";
  const suggestionItems = isLauncher || isOverlay ? launcherCategories : suggestedQuestions;
  const introMessage = getIntroMessage(developerName, mode);
  const isChatDisabled = assistantState !== "ready" || sessionDisabled;
  const canSubmit = useMemo(
    () => input.trim().length > 0 && !loading && !isChatDisabled,
    [input, loading, isChatDisabled],
  );

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    let active = true;

    async function loadStatus() {
      try {
        const response = await fetch("/api/chat/status", {
          cache: "no-store",
        });
        const payload = (await response.json()) as StatusPayload;

        if (!active) {
          return;
        }

        if (!response.ok || !payload.configured) {
          setAssistantState("disabled");
          setStatusMessage("OpenAI is not configured for this deployment.");
          return;
        }

        setAssistantState("ready");
        setStatusMessage(null);
      } catch {
        if (!active) {
          return;
        }

        setAssistantState("disabled");
        setStatusMessage("OpenAI is not configured for this deployment.");
      }
    }

    void loadStatus();

    return () => {
      active = false;
    };
  }, []);

  async function sendMessage(content: string) {
    const trimmed = content.trim();

    if (!trimmed || loading || isChatDisabled) {
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
            "The assistant returned an empty response. Try a different question.",
        },
      ]);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "OpenAI request could not be completed. Try again shortly.";

      setError(message);
      setSessionDisabled(true);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `OpenAI chat is unavailable right now. ${message}`,
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
        isOverlay
          ? "p-0"
          : isLauncher
            ? "p-3 sm:p-4"
            : isEmbedded || isHero
              ? "p-4"
              : "p-4 sm:p-6"
      }`}
    >
      <div className={`space-y-2 ${isOverlay ? "mb-5" : "mb-4"}`}>
        {isLauncher || isOverlay ? (
          <p className="chat-section-label">{isOverlay ? "Start with a topic" : "Quick topics"}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {suggestionItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => sendMessage(item.prompt)}
              disabled={loading || isChatDisabled}
              className={`chat-chip px-3 py-1 text-xs font-semibold ${
                isLauncher || isOverlay ? "chat-chip-category" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`chat-thread overflow-y-auto rounded-2xl p-4 ${
          isOverlay
            ? "h-[min(44svh,30rem)] sm:h-[min(48svh,34rem)] sm:p-5"
            : isLauncher
            ? "h-[220px] sm:h-[300px]"
            : isHero
              ? "h-[240px] sm:h-[260px]"
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
          rows={isLauncher || isHero ? 2 : isEmbedded ? 2 : isOverlay ? 3 : 3}
          disabled={loading || isChatDisabled}
          placeholder={
            assistantState === "disabled"
              ? "OpenAI is not configured for this deployment."
              : sessionDisabled
                ? "OpenAI chat is currently unavailable."
                : "Ask about Joshua's projects, stack, experience, or career focus..."
          }
          className="chat-textarea w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none transition"
        />

        <div
          className={`flex gap-3 ${
            isLauncher || isHero ? "justify-end" : "items-center justify-between"
          } ${isOverlay ? "flex-col items-stretch sm:flex-row sm:items-center" : ""}`}
        >
          {!isLauncher && !isHero ? (
            <p className="chat-helper-text">Shift + Enter for a new line.</p>
          ) : null}
          <button
            type="submit"
            disabled={!canSubmit}
            className="chat-send-button"
          >
            Send
          </button>
        </div>

        {assistantState === "checking" ? (
          <p className="chat-helper-text">Checking OpenAI setup...</p>
        ) : null}
        {statusMessage ? <p className="chat-status-text">{statusMessage}</p> : null}
        {error ? <p className="chat-error-text">{error}</p> : null}
      </form>
    </section>
  );
}
