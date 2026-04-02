"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const STARTER_PROMPTS = [
  "The light is behind my subject",
  "My shadows look too harsh",
  "I don't know how to pose my subject",
  "I'm shooting on iPhone, how do I get cinematic shots"
];

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function AskLENSD() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      window.setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();

    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next })
      });

      const data = (await res.json()) as { content?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setMessages([...next, { role: "assistant", content: data.content ?? "" }]);
    } catch (err) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            err instanceof Error
              ? err.message
              : "Hmm, something went wrong. Try asking again!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.chatFab}
        onClick={() => setOpen(true)}
        aria-label="Ask LENSD photography coach"
      >
        <CameraIcon />
        <span>ASK LENSD</span>
      </button>

      {open ? (
        <div className={styles.chatOverlay} role="dialog" aria-modal="true" aria-label="Ask LENSD">
          <div className={styles.chatHeader}>
            <div>
              <p className={styles.chatEyebrow}>AI PHOTOGRAPHY COACH</p>
              <h2 className={styles.chatTitle}>ASK LENSD</h2>
            </div>
            <button
              type="button"
              className={styles.chatCloseBtn}
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <CloseIcon />
            </button>
          </div>

          <div className={styles.chatBody}>
            {messages.length === 0 ? (
              <div className={styles.chatIntro}>
                <p className={styles.chatIntroText}>
                  Hey! I&apos;m your on-set photography coach. Ask me anything — lighting,
                  posing, gear, composition, you name it.
                </p>
                <p className={styles.chatStarterLabel}>TRY ONE OF THESE</p>
                <div className={styles.chatStarters}>
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className={styles.starterPrompt}
                      onClick={() => sendMessage(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.role === "user" ? styles.chatBubbleUser : styles.chatBubbleAI}
              >
                {msg.role === "assistant" ? (
                  <p className={styles.chatSenderLabel}>LENSD</p>
                ) : null}
                <p className={styles.chatBubbleText}>{msg.content}</p>
              </div>
            ))}

            {loading ? (
              <div className={styles.chatBubbleAI}>
                <p className={styles.chatSenderLabel}>LENSD</p>
                <span className={styles.chatTyping}>
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>

          <form className={styles.chatInputRow} onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              className={styles.chatInput}
              placeholder="Ask a photography question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              type="submit"
              className={styles.chatSendBtn}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
