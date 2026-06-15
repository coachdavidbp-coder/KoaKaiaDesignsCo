"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface NarrationState {
  isPlaying: boolean;
  isPaused: boolean;
  currentWordIndex: number;
  rate: number;
}

export function useNarration() {
  const [state, setState] = useState<NarrationState>({
    isPlaying: false,
    isPaused: false,
    currentWordIndex: -1,
    rate: 0.85,
  });
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef<string>("");

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  const getVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined") return null;
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.name === "Samantha") ??
      voices.find((v) => v.name.includes("Google US English")) ??
      voices.find((v) => v.lang === "en-US" && !v.name.includes("Google") && v.localService) ??
      voices.find((v) => v.lang.startsWith("en")) ??
      null
    );
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();
      textRef.current = text;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = state.rate;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      const voice = getVoice();
      if (voice) utterance.voice = voice;

      utterance.onboundary = (event) => {
        if (event.name === "word") {
          const charIndex = event.charIndex;
          const textBefore = text.substring(0, charIndex);
          const wordIdx = textBefore.split(/\s+/).filter(Boolean).length;
          setState((s) => ({ ...s, currentWordIndex: wordIdx }));
        }
      };

      utterance.onend = () => {
        setState((s) => ({ ...s, isPlaying: false, isPaused: false, currentWordIndex: -1 }));
      };

      utterance.onerror = () => {
        setState((s) => ({ ...s, isPlaying: false, isPaused: false, currentWordIndex: -1 }));
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setState((s) => ({ ...s, isPlaying: true, isPaused: false, currentWordIndex: 0 }));
    },
    [state.rate, getVoice]
  );

  const pause = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.pause();
    setState((s) => ({ ...s, isPlaying: false, isPaused: true }));
  }, []);

  const resume = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.resume();
    setState((s) => ({ ...s, isPlaying: true, isPaused: false }));
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setState((s) => ({
      ...s,
      isPlaying: false,
      isPaused: false,
      currentWordIndex: -1,
    }));
  }, []);

  const setRate = useCallback((rate: number) => {
    setState((s) => ({ ...s, rate }));
    if (state.isPlaying) {
      window.speechSynthesis.cancel();
      speak(textRef.current);
    }
  }, [state.isPlaying, speak]);

  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  return { ...state, speak, pause, resume, stop, setRate, isSupported };
}
