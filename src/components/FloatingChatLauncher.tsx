"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) {
      return;
    }

    const storageKey = "jk-ai-autolaunch-seen";
    const hasLaunched = window.sessionStorage.getItem(storageKey);

    if (hasLaunched) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsOpen(true);
      window.sessionStorage.setItem(storageKey, "1");
    }, 700);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isHome]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="floating-chat-shell">
      {isOpen ? (
        <div
          id="floating-ai-assistant"
          className="floating-chat-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="floating-ai-title"
        >
          <button
            type="button"
            className="floating-chat-backdrop"
            aria-label="Close assistant"
            onClick={() => setIsOpen(false)}
          />

          <div className="floating-chat-stage">
            <div className="floating-chat-stage-top">
              <div className="floating-chat-meta-row">
                <p className="floating-chat-kicker">AI Assistant</p>
                <span className="floating-chat-overlay-note">OpenAI powered</span>
              </div>

              <div className="floating-chat-stage-actions">
                <Link href="/ai" className="floating-chat-secondary-link">
                  Open dedicated page
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

            <div className="floating-chat-layout">
              <aside className="floating-chat-aside">
                <div className="floating-chat-avatar" aria-hidden="true">
                  <div className="floating-chat-avatar-ring floating-chat-avatar-ring-1" />
                  <div className="floating-chat-avatar-ring floating-chat-avatar-ring-2" />
                  <div className="floating-chat-avatar-core">
                    <svg viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="4.6" fill="currentColor" />
                      <path
                        d="M20 6v5M20 29v5M6 20h5M29 20h5M10.7 10.7l3.5 3.5M25.8 25.8l3.5 3.5M29.3 10.7l-3.5 3.5M14.2 25.8l-3.5 3.5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 id="floating-ai-title" className="floating-chat-hero-title">
                    Ask Joshua Kim&apos;s AI assistant first.
                  </h2>
                  <p className="floating-chat-hero-copy">
                    Explore projects, experience, technical stack, and career focus
                    in a full-screen chat layer while the portfolio stays visible
                    behind it.
                  </p>
                </div>

                <div className="floating-chat-badge-row">
                  <span className="floating-chat-badge">Portfolio scoped</span>
                  <span className="floating-chat-badge">Rate limited</span>
                  <span className="floating-chat-badge">Live OpenAI</span>
                </div>

                <div className="floating-chat-aside-actions">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="floating-chat-dismiss"
                  >
                    Continue to portfolio
                  </button>
                  <p className="floating-chat-inline-note">
                    Press <kbd>Esc</kbd> or close at any time.
                  </p>
                </div>
              </aside>

              <div className="floating-chat-main">
                <div className="floating-chat-main-head">
                  <p className="floating-chat-main-label">Start with a question</p>
                  <p className="floating-chat-main-copy">
                    Ask directly, or use one of the guided prompts below.
                  </p>
                </div>
                <Chatbox developerName={developerName} mode="overlay" />
              </div>
            </div>
          </div>
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
        <span className="floating-chat-button-label">AI Assistant</span>
      </button>
    </div>
  );
}
