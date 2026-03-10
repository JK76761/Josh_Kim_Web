"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Chatbox from "@/components/Chatbox";

type FloatingChatLauncherProps = {
  developerName: string;
};

export default function FloatingChatLauncher({
  developerName,
}: FloatingChatLauncherProps) {
  const pathname = usePathname();

  if (pathname === "/ai") {
    return null;
  }

  return (
    <FloatingChatLauncherInner
      key={pathname}
      developerName={developerName}
    />
  );
}

function FloatingChatLauncherInner({
  developerName,
}: FloatingChatLauncherProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="floating-chat-shell">
      {isOpen ? (
        <div id="floating-ai-assistant" className="floating-chat-panel">
          <div className="floating-chat-header">
            <div className="floating-chat-header-main">
              <div className="floating-chat-header-top">
                <p className="floating-chat-kicker">AI Assistant</p>
                <span className="floating-chat-status" data-state="live">
                  <span className="floating-chat-status-dot" aria-hidden="true" />
                  OpenAI Live
                </span>
              </div>

              <div className="space-y-1">
                <p className="floating-chat-title">Ask about {developerName}</p>
                <p className="floating-chat-copy">
                  Projects, experience, technical stack, and current career focus.
                </p>
              </div>
            </div>

            <div className="floating-chat-actions">
              <Link href="/ai" className="floating-chat-link">
                Open full page
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="floating-chat-close"
                aria-label="Close assistant"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M7 7l10 10M17 7 7 17"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.75"
                  />
                </svg>
              </button>
            </div>
          </div>

          <Chatbox developerName={developerName} mode="launcher" />
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="floating-chat-button"
        data-open={isOpen}
        aria-expanded={isOpen}
        aria-controls="floating-ai-assistant"
        aria-label={isOpen ? "Close assistant" : "Open assistant"}
      >
        <span className="floating-chat-button-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M7.25 8.25h9.5M7.25 12h6.5m-8 7.25 1.31-3.5A7.75 7.75 0 1 1 19.75 12 7.75 7.75 0 0 1 8.88 19.1l-3.13.15Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
            />
            <path
              d="M17.25 5.75v3m1.5-1.5h-3"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.6"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
