"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { MathProblem } from "@/types/math";
import { CounterVisual } from "./CounterVisual";
import { SkipSequence } from "./SkipSequence";
import { TensOnesVisual } from "./TensOnesVisual";

interface MathProblemCardProps {
  problem: MathProblem;
  problemNumber: number;
  total: number;
  onResult: (correct: boolean, attempts: number) => void;
  theme: { primary: string; secondary: string };
}

type FeedbackState = "idle" | "correct" | "wrong";

export function MathProblemCard({ problem, problemNumber, total, onResult, theme }: MathProblemCardProps) {
  const [selected, setSelected] = useState<number | string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [attempts, setAttempts] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setSelected(null);
    setFeedback("idle");
    setAttempts(0);
    setShowExplanation(false);
  }, [problem.id]);

  const handleChoice = (choice: number | string) => {
    if (feedback !== "idle") return;
    setSelected(choice);
    const correct = String(choice) === String(problem.answer);
    setFeedback(correct ? "correct" : "wrong");
    setAttempts((a) => a + 1);
    setTimeout(() => setShowExplanation(true), 300);
  };

  const isComparison = problem.type === "comparison";
  const choices = problem.choices;

  const getChoiceStyle = (choice: number | string) => {
    if (feedback === "idle") return "bg-white/8 border-white/15 text-white hover:bg-white/15 hover:border-white/30 active:scale-95";
    const isCorrect = String(choice) === String(problem.answer);
    const isSelected = String(choice) === String(selected);
    if (isCorrect) return "bg-emerald-500/20 border-emerald-500 text-emerald-200";
    if (isSelected && !isCorrect) return "bg-red-500/20 border-red-500 text-red-200";
    return "bg-white/3 border-white/5 text-gray-600 opacity-50";
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        Problem {problemNumber} of {total}
      </p>

      {/* Word problem story */}
      {problem.story && (
        <div
          className="w-full p-4 rounded-2xl border text-center"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}12, transparent)`,
            borderColor: theme.primary + "30",
          }}
        >
          {problem.scene && (
            <div className="flex gap-1.5 justify-center text-3xl mb-2">
              {problem.scene.map((e, i) => <span key={i}>{e}</span>)}
            </div>
          )}
          <p className="text-sm text-gray-200 leading-relaxed">{problem.story}</p>
        </div>
      )}

      {/* Visual */}
      {problem.counterGroups && problem.counterEmoji && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 w-full">
          <CounterVisual
            groups={problem.type === "subtraction" ? [problem.counterGroups[0]] : problem.counterGroups}
            emoji={problem.counterEmoji}
            operation={problem.type === "subtraction" ? "−" : "+"}
          />
        </div>
      )}

      {problem.sequence && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 w-full">
          <SkipSequence sequence={problem.sequence} theme={theme} />
        </div>
      )}

      {problem.tensOnes && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 w-full">
          <TensOnesVisual
            tens={problem.tensOnes.tens}
            ones={problem.tensOnes.ones}
            theme={theme}
          />
        </div>
      )}

      {/* Question */}
      <div className="text-center">
        {problem.emoji && !problem.story && <div className="text-4xl mb-2">{problem.emoji}</div>}
        <p
          className="text-3xl font-bold text-white"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {problem.question}
        </p>
      </div>

      {/* Choices */}
      {isComparison ? (
        <div className="flex gap-3 w-full">
          {choices.map((choice) => (
            <motion.button
              key={String(choice)}
              onClick={() => handleChoice(choice)}
              disabled={feedback !== "idle"}
              whileTap={feedback === "idle" ? { scale: 0.93 } : undefined}
              className={`flex-1 py-5 rounded-2xl border-2 text-4xl font-black transition-all duration-200 ${getChoiceStyle(choice)}`}
            >
              {choice}
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 w-full">
          {choices.map((choice) => (
            <motion.button
              key={String(choice)}
              onClick={() => handleChoice(choice)}
              disabled={feedback !== "idle"}
              whileTap={feedback === "idle" ? { scale: 0.95 } : undefined}
              className={`py-4 rounded-2xl border-2 font-bold text-2xl transition-all duration-200 ${getChoiceStyle(choice)}`}
            >
              {choice}
            </motion.button>
          ))}
        </div>
      )}

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full p-4 rounded-2xl border ${
              feedback === "correct"
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}
          >
            <div className="flex items-start gap-2 mb-3">
              {feedback === "correct"
                ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              }
              <div>
                <p className={`text-sm font-bold mb-1 ${feedback === "correct" ? "text-emerald-300" : "text-red-300"}`}>
                  {feedback === "correct" ? "Correct! 🎉" : "Not quite — but good try!"}
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">{problem.explanation}</p>
              </div>
            </div>

            <button
              onClick={() => onResult(feedback === "correct", attempts)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-all active:scale-98"
            >
              {problemNumber >= total ? "See Results 🌟" : "Next Problem"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
