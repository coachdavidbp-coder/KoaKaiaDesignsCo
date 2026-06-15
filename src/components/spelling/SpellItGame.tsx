"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Delete } from "lucide-react";
import { SpellingWord } from "@/types/spelling";

interface SpellItGameProps {
  word: SpellingWord;
  wordNumber: number;
  totalWords: number;
  onResult: (correct: boolean, attempts: number) => void;
  theme: { primary: string; secondary: string };
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["⌫", "Z", "X", "C", "V", "B", "N", "M"],
];

type BoxState = "empty" | "filled" | "correct" | "wrong";

export function SpellItGame({ word, wordNumber, totalWords, onResult, theme }: SpellItGameProps) {
  const [typed, setTyped] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [shake, setShake] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");

  useEffect(() => {
    setTyped([]);
    setAttempts(0);
    setShake(false);
    setShowAnswer(false);
    setFeedback("idle");
  }, [word.word]);

  const speak = useCallback((text: string, rate = 0.75) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  }, []);

  const check = useCallback((letters: string[]) => {
    const attempt = letters.join("").toLowerCase();
    const correct = attempt === word.word.toLowerCase();

    if (correct) {
      setFeedback("correct");
      speak("Great job!", 0.9);
      setTimeout(() => onResult(true, attempts + 1), 700);
    } else {
      setFeedback("wrong");
      setShake(true);
      speak(word.word, 0.6);
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      setTimeout(() => {
        setShake(false);
        setFeedback("idle");
        if (nextAttempts >= 2) {
          setShowAnswer(true);
          setTimeout(() => onResult(false, nextAttempts), 1800);
        } else {
          setTyped([]);
        }
      }, 600);
    }
  }, [word.word, attempts, onResult, speak]);

  const handleKey = useCallback((key: string) => {
    if (feedback !== "idle" || showAnswer) return;

    if (key === "⌫") {
      setTyped((t) => t.slice(0, -1));
      return;
    }

    setTyped((prev) => {
      const next = [...prev, key.toLowerCase()];
      if (next.length === word.word.length) {
        setTimeout(() => check(next), 80);
      }
      return next;
    });
  }, [feedback, showAnswer, word.word.length, check]);

  const getBoxState = (index: number): BoxState => {
    if (feedback === "correct") return index < typed.length ? "correct" : "empty";
    if (feedback === "wrong") return index < typed.length ? "wrong" : "empty";
    return index < typed.length ? "filled" : "empty";
  };

  const hintWithBlank = word.hint.replace(word.word, "___");

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        Word {wordNumber} of {totalWords}
      </p>

      {/* Word emoji + hint */}
      <div className="text-center">
        <div className="text-6xl mb-3">{word.emoji}</div>
        <p className="text-gray-300 text-sm leading-relaxed">{hintWithBlank}</p>
        <button
          onClick={() => speak(word.word)}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white text-xs font-medium transition-all active:scale-95"
        >
          <Volume2 className="w-3.5 h-3.5" />
          Hear it
        </button>
      </div>

      {/* Letter boxes */}
      <AnimatePresence mode="wait">
        {showAnswer ? (
          <motion.div
            key="answer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-xs text-amber-400 font-bold">The word was:</p>
            <div className="flex gap-2">
              {word.word.split("").map((letter, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-black"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                >
                  {letter.toUpperCase()}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="boxes"
            animate={shake ? { x: [-6, 6, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex gap-2 flex-wrap justify-center"
          >
            {word.word.split("").map((_, i) => {
              const state = getBoxState(i);
              return (
                <motion.div
                  key={i}
                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-base transition-all duration-150 ${
                    state === "correct"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                      : state === "wrong"
                      ? "bg-red-500/20 border-red-500 text-red-300"
                      : state === "filled"
                      ? "border-white/40 bg-white/10 text-white"
                      : "border-white/15 bg-white/5 text-transparent"
                  }`}
                >
                  {state === "filled" || state === "correct" || state === "wrong"
                    ? (typed[i] ?? "").toUpperCase()
                    : ""}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attempts hint */}
      {attempts === 1 && !showAnswer && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-amber-400 font-medium -mt-2"
        >
          Try again! Listen carefully 👂
        </motion.p>
      )}

      {/* Keyboard */}
      {!showAnswer && (
        <div className="w-full space-y-1.5">
          {KEYBOARD_ROWS.map((row, ri) => (
            <div key={ri} className="flex justify-center gap-1">
              {row.map((key) => (
                <button
                  key={key}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    handleKey(key);
                  }}
                  disabled={feedback !== "idle"}
                  className={`h-11 rounded-xl font-bold text-sm transition-all select-none active:scale-90 ${
                    key === "⌫"
                      ? "px-3 bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30"
                      : "flex-1 min-w-0 bg-white/10 border border-white/10 text-white hover:bg-white/20 disabled:opacity-40"
                  }`}
                  style={{ fontSize: key === "⌫" ? undefined : "13px" }}
                >
                  {key === "⌫" ? <Delete className="w-4 h-4 mx-auto" /> : key}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
