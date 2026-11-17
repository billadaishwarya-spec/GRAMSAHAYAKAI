// src/hooks/useSpeech.ts
"use client";

import { useCallback, useRef, useState } from "react";

type SpeechLang = "en-IN" | "hi-IN" | "kn-IN";

// Browser-native Speech Recognition + Synthesis.
// Falls back gracefully with isSupported=false on browsers without support
// (rather than crashing — important for low-end devices in rural areas).
export function useSpeech(lang: SpeechLang = "en-IN") {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  const startListening = useCallback(() => {
    if (!isSupported) return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isSupported, lang]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel(); // stop any in-progress speech first
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    },
    [lang]
  );

  return { isSupported, isListening, transcript, startListening, stopListening, speak };
}
