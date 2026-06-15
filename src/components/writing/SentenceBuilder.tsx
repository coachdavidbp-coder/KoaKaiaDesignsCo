"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { SentenceBuilderActivity } from "@/types/writing";

interface SentenceBuilderProps {
  activity: SentenceBuilderActivity;
  activityNumber: number;
  total: number;
  onResult: (correct: boolean, attempts: number) => void;
  theme: { primary: string; secondary: string };
}

interface Tile { id: number; word: string }

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (arr.length > 1 && a.map((x) => (x as unknown as Tile).word ?? x).join() === arr.map((x) => (x as unknown as Tile).word ?? x).join()) {
    return shuffleArray(arr);
  }
  return a;
}

export function SentenceBuilder({
  activity,
  activityNumber,
  total,
  onResult,
  theme,
}: SentenceBuilderProps) {
  const [remaining, setRemaining] = useState<Tile[]>([]);
  const [answer, setAnswer] = useState<Array<Tile | null>>([]);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");

  useEffect(() => {
    const shuffled = shuffleArray(activity.words.map((w, i) => ({ id: i, word: w })));
    setRemaining(shuffled);
    setAnswer(new Array(activity.words.length).fill(null));
    setAttempts(0);
    setShake(false);
    setFeedback("idle");
  }, [activity.id, activity.words]);

  const check = useCallback(
    (filledAnswer: Array<Tile | null>) => {
      const typed = filledAnswer.map((t) => t?.word ?? "").join(" ").toLowerCase();
      const correct = typed === activity.words.join(" ").toLowerCase();

      if (correct) {
        setFeedback("correct");
        setTimeout(() => onResult(true, attempts + 1), 800);
      } else {
        setFeedback("wrong");
        setShake(true);
        const next = attempts + 1;
        setAttempts(next);
        setTimeout(() => {
          setShake(false);
          setFeedback("idle");
          const shuffled = shuffleArray(activity.words.map((w, i) => ({ id: Date.now() + i, word: w })));
          setRemaining(shuffled);
          setAnswer(new Array(activity.words.length).fill(null));
          if (next >= 2) setTimeout(() => onResult(false, next), 500);
        }, 700);
      }
    },
    [activity.words, attempts, onResult]
  );

  const handleTileTap = useCallback(
    (tile: Tile) => {
      if (feedback !== "idle") return;
      setRemaining((r) => r.filter((t) => t.id !== tile.id));
      setAnswer((prev) => {
        const next = [...prev];
        const emptyIdx = next.findIndex((s) => s === null);
        if (emptyIdx === -1) return prev;
        next[emptyIdx] = tile;
        if (next.every((s) => s !== null)) setTimeout(() => check(next), 100);
        return next;
      });
    },
    [feedback, check]
  );

  const handleAnswerTap = useCallback(
    (idx: number) => {
      if (feedback !== "idle") return;
      const tile = answer[idx];
      if (!tile) return;
      setAnswer((prev) => { const n = [...prev]; n[idx] = null; return n; });
      setRemaining((r) => [...r, tile]);
    },
    [answer, feedback]
  );

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        Sentence {activityNumber} of {total}
      </p>

      {/* Scene hint */}
      <div className="flex gap-2 text-4xl">
        {activity.hint.map((e, i) => <span key={i}>{e}</span>)}
      </div>

      {/* Answer slots */}
      <motion.div
        animate={shake ? { x: [-6, 6, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap gap-2 justify-center min-h-[48px]"
      >
        {answer.map((tile, i) => (
          <motion.button
            key={i}
            layout
            onClick={() => tile && handleAnswerTap(i)}
            className={`h-10 px-3 rounded-xl border-2 font-semibold text-sm transition-all ${
              feedback === "correct"
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                : feedback === "wrong"
                ? "bg-red-500/20 border-red-500 text-red-300"
                : tile
                ? "bg-white/15 border-white/40 text-white hover:bg-red-500/20 hover:border-red-500/50 active:scale-90"
                : "bg-white/5 border-dashed border-white/15 text-transparent"
            }`}
            style={{ minWidth: "40px" }}
          >
            {tile ? tile.word : "..."}
          </motion.button>
        ))}
      </motion.div>

      {/* Feedback message */}
      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-2 text-sm font-bold ${
              feedback === "correct" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {feedback === "correct"
              ? <><CheckCircle className="w-4 h-4" /> That&apos;s right! 🎉</>
              : <><XCircle className="w-4 h-4" /> Not quite — try again!</>
            }
          </motion.div>
        )}
      </AnimatePresence>

      {/* After 2nd wrong: show correct sentence */}
      {feedback === "wrong" && attempts >= 2 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-amber-400 font-medium text-center"
        >
          Correct: <span className="text-white">{activity.sentence}</span>
        </motion.p>
      )}

      {/* Word tiles */}
      <div className="flex flex-wrap gap-2 justify-center min-h-[44px]">
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
              className="h-10 px-3 rounded-xl font-semibold text-sm text-black transition-all active:scale-90 shadow-md disabled:opacity-50"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
            >
              {tile.word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <p className="text-xs text-gray-600 text-center">
        Tap words to build the sentence — tap a placed word to remove it
      </p>
    </div>
  );
}
