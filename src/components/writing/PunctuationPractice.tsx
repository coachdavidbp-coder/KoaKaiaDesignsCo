"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { PunctuationActivity } from "@/types/writing";

interface PunctuationPracticeProps {
  activity: PunctuationActivity;
  activityNumber: number;
  total: number;
  onResult: (correct: boolean, attempts: number) => void;
  theme: { primary: string; secondary: string };
}

const PUNCTUATION_OPTIONS: Array<{ mark: "." | "?" | "!"; label: string; color: string }> = [
  { mark: ".", label: "Period", color: "#3B82F6" },
  { mark: "?", label: "Question Mark", color: "#8B5CF6" },
  { mark: "!", label: "Exclamation Mark", color: "#F59E0B" },
];

export function PunctuationPractice({
  activity,
  activityNumber,
  total,
  onResult,
  theme,
}: PunctuationPracticeProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setSelected(null);
    setFeedback("idle");
    setAttempts(0);
  }, [activity.id]);

  const handleSelect = (mark: string) => {
    if (feedback !== "idle") return;
    setSelected(mark);
    const correct = mark === activity.correct;
    setFeedback(correct ? "correct" : "wrong");
    const next = attempts + 1;
    setAttempts(next);

    setTimeout(() => onResult(correct, next), correct ? 1200 : 1800);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        Sentence {activityNumber} of {total}
      </p>

      {/* Scene hint */}
      <div className="flex gap-2 text-4xl">
        {activity.hint.map((e, i) => <span key={i}>{e}</span>)}
      </div>

      {/* Sentence display */}
      <div
        className="w-full p-5 rounded-2xl border text-center"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}10, transparent)`,
          borderColor: theme.primary + "30",
        }}
      >
        <p className="text-2xl font-bold text-white leading-snug">
          {activity.sentence}
          <span
            className={`ml-0.5 transition-all duration-300 ${
              selected
                ? feedback === "correct"
                  ? "text-emerald-400"
                  : "text-red-400"
                : "text-gray-600"
            }`}
          >
            {selected ?? "_"}
          </span>
        </p>
      </div>

      {/* Punctuation buttons */}
      <div className="flex gap-3 w-full">
        {PUNCTUATION_OPTIONS.map(({ mark, label, color }) => {
          const isSelected = selected === mark;
          const isCorrect = feedback === "correct" && isSelected;
          const isWrong = feedback === "wrong" && isSelected;

          return (
            <motion.button
              key={mark}
              onClick={() => handleSelect(mark)}
              disabled={feedback !== "idle"}
              whileTap={feedback === "idle" ? { scale: 0.94 } : undefined}
              className={`flex-1 flex flex-col items-center gap-1 py-4 rounded-2xl border-2 font-bold transition-all duration-200 ${
                isCorrect
                  ? "bg-emerald-500/20 border-emerald-500"
                  : isWrong
                  ? "bg-red-500/20 border-red-500"
                  : feedback !== "idle"
                  ? "opacity-40 border-white/10 bg-white/5"
                  : "border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25"
              }`}
            >
              <span
                className="text-4xl font-black"
                style={{ color: isCorrect ? "#10B981" : isWrong ? "#EF4444" : color }}
              >
                {mark}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">{label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback explanation */}
      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`w-full p-4 rounded-2xl border ${
              feedback === "correct"
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}
          >
            <div className="flex items-start gap-2">
              {feedback === "correct"
                ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              }
              <div>
                <p className={`text-sm font-bold mb-1 ${feedback === "correct" ? "text-emerald-300" : "text-red-300"}`}>
                  {feedback === "correct" ? "Correct! 🎉" : `The answer is "${activity.correct}"`}
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">{activity.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
