"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { WordSortActivity } from "@/types/writing";

interface WordSortProps {
  activity: WordSortActivity;
  onResult: (correct: boolean, attempts: number) => void;
  theme: { primary: string; secondary: string };
}

const CATEGORY_COLORS = [
  { bg: "bg-blue-500/20", border: "border-blue-500/50", text: "text-blue-300", active: "bg-blue-500 text-black" },
  { bg: "bg-purple-500/20", border: "border-purple-500/50", text: "text-purple-300", active: "bg-purple-500 text-black" },
];

export function WordSort({ activity, onResult, theme }: WordSortProps) {
  const [queue, setQueue] = useState<typeof activity.words>([]);
  const [wordIdx, setWordIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    const shuffled = [...activity.words].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setWordIdx(0);
    setCorrectCount(0);
    setFeedback("idle");
    setTotalAttempts(0);
  }, [activity.id]);

  const currentWord = queue[wordIdx];
  const isLast = wordIdx + 1 >= queue.length;

  const handleCategory = useCallback(
    (category: 0 | 1) => {
      if (feedback !== "idle" || !currentWord) return;
      const correct = category === currentWord.category;
      setFeedback(correct ? "correct" : "wrong");
      setTotalAttempts((a) => a + 1);
      if (correct) setCorrectCount((c) => c + 1);

      setTimeout(() => {
        setFeedback("idle");
        if (isLast) {
          const finalCorrect = correct ? correctCount + 1 : correctCount;
          onResult(finalCorrect === queue.length, totalAttempts + 1);
        } else {
          setWordIdx((i) => i + 1);
        }
      }, 900);
    },
    [feedback, currentWord, correctCount, isLast, queue.length, totalAttempts, onResult]
  );

  if (!currentWord) return null;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between w-full text-xs text-gray-500 font-bold">
        <span className="uppercase tracking-wider">
          Word {wordIdx + 1} of {queue.length}
        </span>
        <span className="text-emerald-400">{correctCount} correct</span>
      </div>

      {/* Category headers */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {activity.categories.map((cat, ci) => (
          <div
            key={ci}
            className={`p-3 rounded-2xl border text-center ${CATEGORY_COLORS[ci].bg} ${CATEGORY_COLORS[ci].border}`}
          >
            <div className="text-2xl mb-1">{activity.categoryEmojis[ci]}</div>
            <p className={`text-xs font-bold ${CATEGORY_COLORS[ci].text}`}>{cat}</p>
          </div>
        ))}
      </div>

      {/* Current word */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activity.id}-${wordIdx}`}
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -10 }}
          transition={{ duration: 0.18 }}
          className={`w-full p-6 rounded-3xl border-2 text-center transition-all duration-200 ${
            feedback === "correct"
              ? "bg-emerald-500/20 border-emerald-500"
              : feedback === "wrong"
              ? "bg-red-500/20 border-red-500"
              : "bg-white/5 border-white/15"
          }`}
        >
          {currentWord.emoji && <div className="text-5xl mb-2">{currentWord.emoji}</div>}
          <p
            className="text-3xl font-bold"
            style={{ color: feedback === "idle" ? theme.primary : undefined }}
          >
            {currentWord.word}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-2 font-bold text-sm ${
              feedback === "correct" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {feedback === "correct"
              ? <><CheckCircle className="w-4 h-4" /> That&apos;s right! 🎉</>
              : <><XCircle className="w-4 h-4" /> Not quite — it&apos;s &ldquo;{activity.categories[currentWord.category]}&rdquo;</>
            }
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category buttons */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {activity.categories.map((cat, ci) => (
          <motion.button
            key={ci}
            onClick={() => handleCategory(ci as 0 | 1)}
            disabled={feedback !== "idle"}
            whileTap={feedback === "idle" ? { scale: 0.95 } : undefined}
            className={`py-4 rounded-2xl font-bold text-sm border-2 transition-all ${
              CATEGORY_COLORS[ci].border
            } ${
              feedback !== "idle"
                ? `opacity-40 ${CATEGORY_COLORS[ci].bg} ${CATEGORY_COLORS[ci].text}`
                : `${CATEGORY_COLORS[ci].bg} ${CATEGORY_COLORS[ci].text} hover:opacity-90 active:scale-95`
            }`}
          >
            {activity.categoryEmojis[ci]} {cat}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
