// src/app/chat/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send, Volume2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage, LANGUAGES } from "@/context/LanguageContext";
import { useSpeech } from "@/hooks/useSpeech";
import {
  saveChatMessage,
  subscribeToChatHistory,
  type ChatMessage,
} from "@/firebase/firestore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function ChatPage() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const speechLang = LANGUAGES[lang].speechCode as "en-IN" | "hi-IN" | "kn-IN";
  const { isSupported, isListening, transcript, startListening, stopListening, speak } =
    useSpeech(speechLang);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToChatHistory(user.uid, setMessages);
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || !user) return;
    setInput("");
    setLoading(true);

    await saveChatMessage({ uid: user.uid, role: "user", text, language: lang });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          language: lang,
          history: messages.slice(-6).map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't process that. Please try again.";

      await saveChatMessage({ uid: user.uid, role: "assistant", text: reply, language: lang });
      speak(reply);
    } catch {
      await saveChatMessage({
        uid: user.uid,
        role: "assistant",
        text: "Something went wrong reaching the assistant. Please try again.",
        language: lang,
      });
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-ink/70">
          Please <a href="/login" className="text-leaf-600 underline">sign in</a> to start chatting.
        </p>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col bg-clay-50">
      <header className="flex items-center justify-between border-b border-clay-200 bg-white px-6 py-4">
        <h1 className="font-display text-lg font-semibold text-leaf-600">GramSahayak Chat</h1>
        <LanguageSwitcher />
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-12">
        {messages.length === 0 && (
          <p className="mx-auto max-w-md text-center text-sm text-ink/50">
            Ask about scheme eligibility, crop advisory, or how to file a complaint —
            in {LANGUAGES[lang].native}.
          </p>
        )}
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "ml-auto bg-leaf-500 text-white"
                  : "bg-white text-ink border border-clay-200"
              }`}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="max-w-[80%] rounded-2xl border border-clay-200 bg-white px-4 py-2.5 text-sm text-ink/50">
              Typing…
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="border-t border-clay-200 bg-white px-4 py-4 md:px-12"
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          {isSupported && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              aria-label={isListening ? "Stop listening" : "Speak your question"}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                isListening ? "bg-red-500 text-white" : "bg-clay-100 text-ink"
              }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type in ${LANGUAGES[lang].native}…`}
            className="flex-1 rounded-full border border-clay-200 px-4 py-2.5 outline-none focus:border-leaf-400"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf-500 text-white disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </main>
  );
}
