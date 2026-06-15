"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronRight, Shield } from "lucide-react";
import { BossQuestion } from "@/data/boss/questions";

interface BossArenaProps {
  questions: BossQuestion[];
  onComplete: (correct: number, total: number) => void;
  studentName: string;
}

const SUBJECT_COLORS: Record<string, string> = {
  reading:  "#3B82F6",
  math:     "#F59E0B",
  spelling: "#8B5CF6",
  writing:  "#10B981",
};

export function BossArena({ questions, onComplete, studentName }: BossArenaProps) {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [fogHp, setFogHp] = useState(questions.length);
  const [shields, setShields] = useState(3);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [fogShake, setFogShake] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);

  const current = questions[questionIdx];
  const isCorrect = selected !== null && selected === current.answer;
  const total = questions.length;
  const fogPct = (fogHp / total) * 100;

  useEffect(() => {
    setSelected(null);
    setShowExplanation(false);
  }, [questionIdx]);

  const handleChoice = (choice: string) => {
    if (selected !== null) return;
    setSelected(choice);
    const correct = choice === current.answer;

    if (correct) {
      setFogHp((h) => h - 1);
      setCorrectCount((c) => c + 1);
      setFogShake(true);
      setTimeout(() => setFogShake(false), 600);
    } else {
      setShields((s) => Math.max(0, s - 1));
      setPlayerShake(true);
      setTimeout(() => setPlayerShake(false), 600);
    }

    setTimeout(() => setShowExplanation(true), 300);
  };

  const handleNext = () => {
    const nextIdx = questionIdx + 1;
    const newCorrect = selected === current.answer ? correctCount + 1 : correctCount;
    // Note: correctCount state may not update synchronously, so pass newCorrect
    if (nextIdx >= total) {
      onComplete(isCorrect ? correctCount + 1 : correctCount, total);
    } else {
      setQuestionIdx(nextIdx);
    }
  };

  const subjectColor = SUBJECT_COLORS[current.subject] ?? "#8B5CF6";

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
      {/* Fog status */}
      <motion.div
        className="rounded-3xl border border-purple-500/30 p-4 text-center"
        style={{ background: "linear-gradient(160deg, #1a0a2e, #0a0514)" }}
        animate={fogShake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-6xl mb-2 inline-block"
          animate={{
            scale: fogShake ? [1, 0.85, 1.05, 1] : [1, 1.04, 1],
            opacity: fogShake ? [1, 0.5, 1] : 1,
          }}
          transition={{ duration: fogShake ? 0.5 : 3, repeat: fogShake ? 0 : Infinity }}
        >
          🌫️
        </motion.div>
        <p className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
          The Forgetful Fog
        </p>
        <div className="h-2.5 bg-purple-950 rounded-full overflow-hidden border border-purple-800">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #7C3AED, #A855F7)" }}
            animate={{ width: `${fogPct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-purple-400 mt-1">{fogHp} / {total} HP remaining</p>
      </motion.div>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>Question {questionIdx + 1} of {total}</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              animate={i >= shields ? { scale: [1, 1.3, 1], opacity: [1, 0.3, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Shield
                className={`w-4 h-4 ${
                  i < shields ? "text-blue-400 fill-blue-400/30" : "text-gray-700 fill-gray-800"
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Subject tag + question */}
          <div
            className="rounded-2xl border p-4 text-center"
            style={{
              background: `linear-gradient(135deg, ${subjectColor}12, transparent)`,
              borderColor: subjectColor + "30",
            }}
          >
            <div className="text-3xl mb-2">{current.emoji}</div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: subjectColor }}
            >
              {current.subject}
            </p>
            <p className="text-white font-bold text-base leading-snug">{current.question}</p>
          </div>

          {/* Choices */}
          <div className="grid grid-cols-1 gap-2.5">
            {current.choices.map((choice) => {
              const isChosen = selected === choice;
              const isRight = choice === current.answer;
              let cls = "bg-white/8 border-white/15 text-white hover:bg-white/15 hover:border-white/30 active:scale-[0.97]";
              if (selected !== null) {
                if (isRight) cls = "bg-emerald-500/20 border-emerald-500 text-emerald-200";
                else if (isChosen) cls = "bg-red-500/20 border-red-500 text-red-200";
                else cls = "bg-white/3 border-white/5 text-gray-600 opacity-40";
              }

              return (
                <motion.button
                  key={choice}
                  onClick={() => handleChoice(choice)}
                  disabled={selected !== null}
                  whileTap={selected === null ? { scale: 0.97 } : undefined}
                  className={`w-full py-3 px-4 rounded-2xl border-2 font-semibold text-sm text-left transition-all duration-200 ${cls}`}
                >
                  {choice}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border p-4 ${
                  isCorrect
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-start gap-2 mb-3">
                  {isCorrect
                    ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  }
                  <div>
                    <p className={`text-sm font-bold mb-1 ${isCorrect ? "text-emerald-300" : "text-red-300"}`}>
                      {isCorrect ? "Correct! ⚡" : `Not quite — the answer is "${current.answer}"`}
                    </p>
                    <p className="text-xs text-gray-300 leading-relaxed">{current.explanation}</p>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-all active:scale-98"
                >
                  {questionIdx + 1 >= total ? "See Final Result ⚡" : "Next Attack"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Player label */}
      <motion.p
        className="text-center text-xs text-gray-600"
        animate={playerShake ? { x: [-5, 5, -4, 4, -2, 2, 0], color: ["#ef4444", "#6b7280"] } : {}}
        transition={{ duration: 0.5 }}
      >
        ⚔️ {studentName}
      </motion.p>
    </div>
  );
}
