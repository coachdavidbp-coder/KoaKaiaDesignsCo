"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";
import { SpellingWord } from "@/types/spelling";

interface Tile {
  id: number;
  letter: string;
}

interface WordScrambleProps {
  word: SpellingWord;
  wordNumber: number;
  totalWords: number;
  onResult: (correct: boolean, attempts: number) => void;
  theme: { primary: string; secondary: string };
}

function shuffle(letters: string[]): string[] {
  const arr = [...letters];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (arr.join("") === letters.join("")) return shuffle(letters);
  return arr;
}

export function WordScramble({ word, wordNumber, totalWords, onResult, theme }: WordScrambleProps) {
  const [remaining, setRemaining] = useState<Tile[]>([]);
  const [answer, setAnswer] = useState<Array<Tile | null>>([]);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");

  useEffect(() => {
    const shuffled = shuffle(word.word.split(""));
    setRemaining(shuffled.map((letter, i) => ({ id: i, letter })));
    setAnswer(new Array(word.word.length).fill(null));
    setAttempts(0);
    setShake(false);
    setFeedback("idle");
  }, [word.word]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.75;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  }, []);

  const check = useCallback((filledAnswer: Array<Tile | null>) => {
    const attempt = filledAnswer.map((t) => t?.letter ?? "").join("").toLowerCase();
    const correct = attempt === word.word.toLowerCase();

    if (correct) {
      setFeedback("correct");
      speak("Amazing!");
      setTimeout(() => onResult(true, attempts + 1), 700);
    } else {
      setFeedback("wrong");
      setShake(true);
      speak(word.word);
      const next = attempts + 1;
      setAttempts(next);

      setTimeout(() => {
        setShake(false);
        setFeedback("idle");
        // Reset tiles
        const shuffled = shuffle(word.word.split(""));
        setRemaining(shuffled.map((letter, i) => ({ id: Date.now() + i, letter })));
        setAnswer(new Array(word.word.length).fill(null));

        if (next >= 2) {
          setTimeout(() => onResult(false, next), 1200);
        }
      }, 600);
    }
  }, [word.word, attempts, onResult, speak]);

  const handleTileTap = useCallback((tile: Tile) => {
    if (feedback !== "idle") return;

    setRemaining((r) => r.filter((t) => t.id !== tile.id));
    setAnswer((prev) => {
      const next = [...prev];
      const emptyIdx = next.findIndex((s) => s === null);
      if (emptyIdx === -1) return prev;
      next[emptyIdx] = tile;
      if (next.every((s) => s !== null)) {
        setTimeout(() => check(next), 100);
      }
      return next;
    });
  }, [feedback, check]);

  const handleAnswerTap = useCallback((idx: number) => {
    if (feedback !== "idle") return;
    const tile = answer[idx];
    if (!tile) return;
    setAnswer((prev) => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });
    setRemaining((r) => [...r, tile]);
  }, [answer, feedback]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        Word {wordNumber} of {totalWords}
      </p>

      {/* Emoji + hint */}
      <div className="text-center">
        <div className="text-6xl mb-3">{word.emoji}</div>
        <p className="text-gray-300 text-sm leading-relaxed">
          {word.hint.replace(word.word, "___")}
        </p>
        <button
          onClick={() => speak(word.word)}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white text-xs font-medium transition-all active:scale-95"
        >
          <Volume2 className="w-3.5 h-3.5" />
          Hear it
        </button>
      </div>

      {/* Answer boxes */}
      <motion.div
        animate={shake ? { x: [-6, 6, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex gap-2 flex-wrap justify-center min-h-[48px]"
      >
        {answer.map((tile, i) => (
          <motion.button
            key={i}
            onClick={() => tile && handleAnswerTap(i)}
            layout
            className={`w-11 h-11 rounded-xl border-2 font-bold text-base transition-all ${
              feedback === "correct"
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                : feedback === "wrong"
                ? "bg-red-500/20 border-red-500 text-red-300"
                : tile
                ? "bg-white/15 border-white/40 text-white hover:bg-red-500/20 hover:border-red-500/50 active:scale-90"
                : "bg-white/5 border-dashed border-white/20"
            }`}
          >
            {tile ? tile.letter.toUpperCase() : ""}
          </motion.button>
        ))}
      </motion.div>

      {/* Scrambled tiles */}
      <div className="flex gap-2 flex-wrap justify-center min-h-[48px]">
        <AnimatePresence>
          {remaining.map((tile) => (
            <motion.button
              key={tile.id}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => handleTileTap(tile)}
              disabled={feedback !== "idle"}
              className="w-11 h-11 rounded-xl font-bold text-base text-black transition-all active:scale-90 shadow-lg disabled:opacity-60"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              }}
            >
              {tile.letter.toUpperCase()}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <p className="text-xs text-gray-600 text-center">
        Tap the letters in the right order — tap a placed letter to remove it!
      </p>
    </div>
  );
}
