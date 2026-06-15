"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { ComprehensionQuestion } from "@/types/reading";
import { Story } from "@/types/reading";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ComprehensionQuizProps {
  story: Story;
  onComplete: (correct: number, total: number) => void;
}

type AnswerState = "unanswered" | "correct" | "incorrect";

export function ComprehensionQuiz({ story, onComplete }: ComprehensionQuizProps) {
  const questions = story.questions;
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = questions[currentQ];
  const progress = ((currentQ) / questions.length) * 100;

  const handleSelect = (index: number) => {
    if (answerState !== "unanswered") return;
    setSelectedIndex(index);
    const isCorrect = index === question.correctIndex;
    setAnswerState(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => setShowExplanation(true), 400);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      onComplete(score, questions.length);
      return;
    }
    setCurrentQ((q) => q + 1);
    setSelectedIndex(null);
    setAnswerState("unanswered");
    setShowExplanation(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Question {currentQ + 1} of {questions.length}
          </p>
          <p className="text-xs font-bold text-blue-300">
            {score} correct
          </p>
        </div>
        <ProgressBar value={progress} size="sm" variant="blue" animated={false} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col"
        >
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{getQuestionEmoji(question.skill)}</span>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide capitalize">
                {question.skill.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-white leading-snug">
              {question.question}
            </p>
          </div>

          <div className="space-y-2.5 flex-1">
            {question.options.map((option, i) => (
              <OptionButton
                key={i}
                option={option}
                index={i}
                selected={selectedIndex === i}
                correct={i === question.correctIndex}
                answerState={answerState}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-2xl border ${
                  answerState === "correct"
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-start gap-2">
                  {answerState === "correct" ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-sm font-bold mb-1 ${answerState === "correct" ? "text-emerald-300" : "text-red-300"}`}>
                      {answerState === "correct" ? "That's right! 🎉" : "Not quite..."}
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">{question.explanation}</p>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-all active:scale-98"
                >
                  {currentQ + 1 >= questions.length ? "See Results 🌟" : "Next Question"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OptionButton({
  option,
  index,
  selected,
  correct,
  answerState,
  onSelect,
}: {
  option: string;
  index: number;
  selected: boolean;
  correct: boolean;
  answerState: AnswerState;
  onSelect: (i: number) => void;
}) {
  const LETTERS = ["A", "B", "C", "D"];
  const isAnswered = answerState !== "unanswered";
  const showCorrect = isAnswered && correct;
  const showWrong = isAnswered && selected && !correct;

  return (
    <motion.button
      onClick={() => onSelect(index)}
      disabled={isAnswered}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-200 ${
        showCorrect
          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-100"
          : showWrong
          ? "bg-red-500/20 border-red-500/50 text-red-100"
          : selected && !isAnswered
          ? "bg-blue-500/20 border-blue-500/50 text-white"
          : isAnswered
          ? "bg-white/3 border-white/5 text-gray-600 opacity-60"
          : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 active:scale-98"
      }`}
      whileTap={!isAnswered ? { scale: 0.98 } : undefined}
    >
      <span
        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
          showCorrect
            ? "bg-emerald-500 text-white"
            : showWrong
            ? "bg-red-500 text-white"
            : "bg-white/10 text-gray-400"
        }`}
      >
        {showCorrect ? "✓" : showWrong ? "✗" : LETTERS[index]}
      </span>
      <span className="text-sm font-medium leading-snug">{option}</span>
    </motion.button>
  );
}

function getQuestionEmoji(skill: string): string {
  const map: Record<string, string> = {
    recall: "🔍",
    inference: "🧠",
    vocabulary: "📖",
    main_idea: "💡",
    sequencing: "🔢",
    prediction: "🔮",
    detail: "🔎",
  };
  return map[skill] ?? "❓";
}
