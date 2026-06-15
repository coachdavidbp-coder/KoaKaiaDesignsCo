"use client";

import { motion } from "framer-motion";
import { Star, Home, RotateCcw, BookOpen } from "lucide-react";
import { SpellingSet, SessionWordResult, MASTERY_COLORS } from "@/types/spelling";
import { WordMastery } from "@/types/spelling";

interface SessionCompleteProps {
  set: SpellingSet;
  results: SessionWordResult[];
  score: number;
  xpEarned: number;
  wordMastery: Record<string, WordMastery>;
  onGoHome: () => void;
  onPlayAgain: () => void;
}

const SCORE_MSGS = [
  { min: 100, emoji: "🌟", msg: "PERFECT SCORE!", sub: "You spelled every word correctly. Legend!" },
  { min: 80,  emoji: "⭐", msg: "Amazing Speller!", sub: "You really know your words. Fantastic!" },
  { min: 60,  emoji: "👍", msg: "Good Work!", sub: "Every practice session makes you stronger!" },
  { min: 0,   emoji: "📚", msg: "Keep Practicing!", sub: "Spelling takes practice — you're getting there!" },
];

export function SessionComplete({
  set,
  results,
  score,
  xpEarned,
  wordMastery,
  onGoHome,
  onPlayAgain,
}: SessionCompleteProps) {
  const msg = SCORE_MSGS.find((m) => score >= m.min) ?? SCORE_MSGS[SCORE_MSGS.length - 1];
  const correct = results.filter((r) => r.correct).length;
  const starCount = Math.max(0, Math.round(score / 20));

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-10 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="text-8xl mb-4"
      >
        {msg.emoji}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">{msg.msg}</h1>
        <p className="text-gray-400 mb-6 max-w-xs">{msg.sub}</p>
      </motion.div>

      {/* Reward boxes */}
      <motion.div
        className="grid grid-cols-3 gap-3 w-full max-w-xs mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <RewardBox emoji="✅" value={`${correct}/${results.length}`} label="Correct" color={set.theme.primary} />
        <RewardBox emoji="💎" value={`+${set.crystalReward}`} label="Crystals" color="#F59E0B" />
        <RewardBox emoji="⚡" value={`+${xpEarned}`} label="XP" color="#3B82F6" />
      </motion.div>

      {/* Word mastery list */}
      <motion.div
        className="w-full max-w-xs mb-6 p-4 rounded-2xl border border-white/10 bg-white/5 text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <p className="text-sm font-bold text-white">Word Progress</p>
        </div>
        <div className="space-y-2">
          {results.map((r) => {
            const mastery = wordMastery[r.word];
            const colors = mastery ? MASTERY_COLORS[mastery.level] : MASTERY_COLORS.new;
            return (
              <div key={r.word} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${r.correct ? "text-emerald-400" : "text-red-400"}`}>
                    {r.correct ? "✓" : "✗"}
                  </span>
                  <span className="text-sm font-medium text-white">{r.word}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
                  {mastery?.level ?? "new"}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Stars */}
      <motion.div
        className="flex gap-2 justify-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.7 + i * 0.08, type: "spring" }}
          >
            <Star
              className={`w-6 h-6 ${i < starCount ? "text-amber-400 fill-amber-400" : "text-gray-700 fill-gray-800"}`}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="flex flex-col gap-3 w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <button
          onClick={onGoHome}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-black text-sm transition-all active:scale-95 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${set.theme.primary}, ${set.theme.secondary})` }}
        >
          <Home className="w-4 h-4" />
          Back to Spelling Hub
        </button>
        <button
          onClick={onPlayAgain}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-gray-300 text-sm bg-white/10 border border-white/10 hover:bg-white/15 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </button>
      </motion.div>
    </div>
  );
}

function RewardBox({ emoji, value, label, color }: { emoji: string; value: string; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-white/5 border border-white/10">
      <span className="text-2xl">{emoji}</span>
      <span className="font-bold text-sm" style={{ color }}>{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
